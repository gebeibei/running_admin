import lodash from 'lodash'
import data from '@/data/activities.json'
import { RUN_TITLES } from '@/utils/const'

const formatPace = (d) => {
    if (Number.isNaN(d)) return '0'
    const pace = (1000.0 / 60.0) * (1.0 / d)
    const minutes = Math.floor(pace)
    const seconds = Math.floor((pace - minutes) * 60.0)
    return `${minutes}'${seconds.toFixed(0).toString().padStart(2, '0')}"`
}

const convertMovingTime2Sec = (moving_time) => {
    if (!moving_time) return 0
    const splits = moving_time.split(', ')
    const days = splits.length == 2 ? parseInt(splits[0]) : 0
    const time = splits.splice(-1)[0]
    const [hours, minutes, seconds] = time.split(':').map(Number)
    const totalSeconds = ((days * 24 + hours) * 60 + minutes) * 60 + seconds
    return totalSeconds
}

const formatRunTime = (moving_time) => {
    const totalSeconds = convertMovingTime2Sec(moving_time)
    const seconds = totalSeconds % 60
    const minutes = (totalSeconds - seconds) / 60
    if (minutes === 0) {
        return seconds + 's'
    }
    return minutes + 'min'
}

const titleForRun = (run) => {
    const runDistance = run.distance / 1000
    const runHour = +run.start_date_local.slice(11, 13)
    if (runDistance > 20 && runDistance < 40) {
        return RUN_TITLES.HALF_MARATHON_RUN_TITLE
    }
    if (runDistance >= 40) {
        return RUN_TITLES.FULL_MARATHON_RUN_TITLE
    }
    if (runHour >= 0 && runHour <= 10) {
        return RUN_TITLES.MORNING_RUN_TITLE
    }
    if (runHour > 10 && runHour <= 14) {
        return RUN_TITLES.MIDDAY_RUN_TITLE
    }
    if (runHour > 14 && runHour <= 18) {
        return RUN_TITLES.AFTERNOON_RUN_TITLE
    }
    if (runHour > 18 && runHour <= 21) {
        return RUN_TITLES.EVENING_RUN_TITLE
    }
    return RUN_TITLES.NIGHT_RUN_TITLE
}

/** 跑步记录数据
 * @type { Array<RunRecord> }
 */
const runRecords = lodash
    .cloneDeep(data)
    .reverse()
    .map((item) => {
        let location = {}
        item.location_country = item.location_country.replace(/\'/g, '"').replace(/None/g, `null`)

        try {
            location = JSON.parse(item.location_country) || {}
        } catch (error) {
            console.log('🚀 ~ runRecords ~ error:', error, item)
        }

        return {
            id: item.run_id,
            origin: lodash.cloneDeep(item),
            startDate: item.start_date_local,
            distance: (item.distance / 1000).toFixed(2),
            paceParts: item.average_speed ? formatPace(item.average_speed) : null,
            heartRate: item.average_heartrate?.toFixed(0),
            runTime: formatRunTime(item.moving_time),
            moment: titleForRun(item),
            location: location,
            address: `${location.province || ''}${location.city}${location.district || ''}`
        }
    })

export const useRun = () => {
    const total = ref(runRecords.length)

    const getDetailById = (id) => {
        return runRecords.find((item) => item.id == id)
    }

    /** 根据检索条件搜索数据
     * @param {Object} props 检索条件
     * @param { Number } props.pageNum 页码
     * @param { Number } props.pageSize 每页条数
     * @param { Array } props.dates 日期列表
     * @param { Number } props.distance 距离
     * @param { Number } props.heartRate 心率
     * @param { Number } props.pace 配速
     * @param { String } props.address 地址
     * @param { String } props.runTime 跑步时间
     * @returns { Array<RunRecord> } 跑步记录列表
     */
    const getList = (props = {}) => {
        const { pageNum = 15, pageSize = 1, dates = [], distance, heartRate, pace, address, runTime } = props
        const targetDataList = runRecords.filter((item) => {
            const flags = []
            if (dates.length) {
                flags.push(+new Date(item.startDate) >= +new Date(dates[0]) && +new Date(item.startDate) <= +new Date(dates[1]))
            }

            if (distance) {
                flags.push(item.origin.distance / 1000 >= distance)
            }

            if (heartRate) {
                flags.push(item.origin.average_heartrate >= heartRate)
            }

            if (pace) {
                flags.push(item.paceParts.replace("'", ':').replace('"', '') <= pace)
            }

            if (address) {
                flags.push(item.address.includes(address))
            }

            if (runTime) {
                flags.push(item.runTime >= runTime)
            }

            return flags.every((item) => item)
        })

        total.value = targetDataList.length

        return targetDataList.slice((pageNum - 1) * pageSize, pageNum * pageSize)
    }

    return {
        total,
        runRecords,
        getList,
        getDetailById
    }
}
