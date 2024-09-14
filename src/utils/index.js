import lodash from 'lodash'
import { G } from '@/config/global'

/**空函数 */
export const NOOP = () => {}

export const isEmpty = (value) => {
    return [null, undefined, NaN, ''].includes(value) || /^\s+$/.test(value)
}

export const translateTypeToString = (val) => Object.prototype.toString.call(val)

export function isDate(val) {
    return translateTypeToString(val) === '[object Date]'
}

export const isEmptyObj = (obj) => {
    return obj === null ? true : !Object.keys(obj).length
}
export const formatDate = (date, fmt = 'yyyy-MM-dd HH:mm:ss') => {
    if (isEmpty(date)) {
        return null
    }
    fmt = fmt.replace(/Y/g, 'y').replace(/D/g, 'd').replace(/H/g, 'h')

    date = new Date(date)

    if (date.toString() === 'Invalid Date') {
        throw new Error('非法的日期格式')
    }
    const o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'H+': date.getHours(), // 小时
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (const k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
        }
    }

    return fmt
}
export const hasLength = (arr) => {
    return Boolean(Array.isArray(arr) && arr.length !== 0)
}

export function toDate(date) {
    if (!(date instanceof Date)) {
        if (lodash.isString(date) && !date.includes('+')) {
            date = date.replace(/-/g, '/').replace('T', ' ').replace('.000+0000', '')
        }
        date = new Date(date)

        if (!lodash.isDate(date)) return ''
    }
    return date
}

// 判断入参是否有值，且不是默认的占位值（e.g. --）
export function hasValue(value, hintText = G.emptyStr) {
    if (Array.isArray(value)) return Boolean(value.length)
    return !isEmpty(value) && value != hintText
}

export const setDefaultValue = (value, defaultValue = G.emptyStr) => {
    if (value instanceof Object) {
        const obj = lodash.cloneDeep(value)
        for (const key in obj) {
            isEmpty(obj[key]) && (obj[key] = defaultValue)
        }

        // 使用_origin来保留原本的数据
        obj._origin = lodash.cloneDeep(value)
        return obj
    } else {
        return isEmpty(value) ? defaultValue : value
    }
}

export function simplifyNumber(num, retainedDigits = 2) {
    const type = typeof num
    let unit = ''
    if (type == 'string') {
        num -= 0
    } else if (type != 'number') {
        return { value: '', unit }
    }
    const digits = (Math.log(num) * Math.LOG10E + 1) | 0
    if (digits < 5) {
        return { value: num, unit }
    }
    if (digits < 9) {
        num = retainDigits(num / Math.pow(10, 4), retainedDigits)
        unit = '万'
    } else if (digits < 13) {
        num = retainDigits(num / Math.pow(10, 8), retainedDigits)
        unit = '亿'
    } else {
        num = retainDigits(num / Math.pow(10, 12), retainedDigits)
        unit = '万亿'
    }
    return {
        value: type == 'string' ? num + '' : num,
        unit
    }
}

export function retainDigits(num, retianVal) {
    const val = Math.pow(10, retianVal)
    return Math.round(num * val) / val
}

export function isJsonStr(str) {
    if (typeof str == 'string') {
        try {
            let obj = JSON.parse(str)
            if (typeof obj == 'object' && obj) return true
            return false
        } catch (e) {
            return false
        }
    }

    return false
}

function toNumber(val) {
    const _v = Number(val)
    return isNaN(_v) ? val : _v
}

/**
 * @description 将对象的指定属性进行判断，并且拼接上单位
 * @param { Object } raw 包含value和unit属性的对象
 * @param { Boolean } isToNumber 是否用Number函数转化
 * @date 2022-11-15
 */
export function handleFieldValue(raw, isToNumber = false) {
    if (raw.value === G.emptyStr || isEmpty(raw.value)) {
        raw.value = G.emptyStr
        return raw.value
    } else {
        raw.value = (isToNumber && raw.unit ? toNumber(raw.value) : raw.value) + (raw.unit || '')

        return raw.value
    }
}

export function getRequiredRule(trigger = 'blur') {
    return [{ required: true, message: trigger == 'blur' ? '请输入' : '请选择', trigger }]
}

export const getMaxZIndex = () => {
    let arr = [...document.querySelectorAll('*')].map((e) => +window.getComputedStyle(e).zIndex || 0)
    return arr.length ? Math.max(...arr) + 1 : 1
}

export const handleTreeList = (list, props = {}) => {
    const { id = 'id', label = 'name', value = 'groupCode', children = 'children', disabled = () => false } = props
    return list.map((item) => {
        if (Array.isArray(item.children) && item.children.length !== 0) {
            return {
                ...item,
                id: item[id],
                label: item[label],
                value: item[value] || item[id],
                children: handleTreeList(item[children], props),
                disabled: disabled(item)
            }
        }
        return {
            ...item,
            id: item[id],
            label: item[label],
            value: item[value] || item[id],
            disabled: disabled(item)
        }
    })
}

// 根据指定字段和指定值，从list中查找对应的项
export const findItem = (list, { key, value }) => {
    let target = null
    for (let item of list) {
        if (item[key] === value) {
            target = item
            break
        }

        if (!target && hasLength(item.children)) {
            target = findItem(item.children, { key, value })
        }
    }

    return target
}

/**
 * @description: 展开树
 * @author: cmd
 * @date: 2023-02-20 17:35:15
 * @version: null
 **/
export const flattenTree = (list, props = { children: 'children' }) => {
    if (!hasLength(list)) return []
    const all = []
    const hasChidren = (list) => {
        list.forEach((item) => {
            all.push(item)
            if (hasLength(item[props.children])) hasChidren(item[props.children])
        })
    }
    hasChidren(list)
    return all
}

/**
 * @description: 根据id在树中查找完整路径
 * @author: cmd
 * @date: 2023-03-06 20:05:40
 * @version: null
 **/
export const findPathById = (treeList, id, props = { id: 'id', children: 'childs' }) => {
    const path = []
    try {
        const getPath = (node) => {
            path.push(node)
            if (node[props.id] === id) {
                throw new Error('GOT IT')
            }
            if (node[props.children] && node[props.children].length !== 0) {
                node[props.children].forEach((item) => {
                    getPath(item)
                })
                path.pop()
            } else {
                path.pop()
            }
        }
        for (let i = 0; i < treeList.length; i++) {
            getPath(treeList[i])
        }
    } catch (e) {}
    return path
}

/** @description 封装sessionStorage */
export const zrxStorage = {
    /**
     * @description 设置sessionStorage
     * @param { key } String sessionStorage的key
     * @param { value } any
     * @date 2022-01-19
     */
    setItem(key, value) {
        const _val = lodash.isObject(value) ? JSON.stringify(value) : String(value)

        window.sessionStorage.setItem(key, _val)
    },
    /**
     * @description 获取sessionStorage
     * @param { String } key sessionStorage的key
     * @param { boolean } isParse 是否进行JSON.parse处理
     * @date 2022-01-19
     */
    getItem(key, isParse = true) {
        const _val = window.sessionStorage.getItem(key)
        if (!_val) return ''
        if (!isParse) return _val
        if (isJsonStr(_val)) return JSON.parse(_val)
        return _val
    },
    /**
     * @param { String } key 需要删除的key
     */
    removeItem(key) {
        window.sessionStorage.removeItem(key)
    }
}

/** @description 生成随机id */
export const generateRandomId = () => {
    const s = []
    const hexDigital = '0123456789abcdef'
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigital.substr(Math.floor(Math.random() * 0x10), 1)
    }
    s[14] = '4'
    s[19] = hexDigital.substr((s[19] & 0x3) | 0x8, 1)
    s[8] = s[13] = s[18] = s[23] = '-'
    return s.join('') + new Date().getTime()
}

/**
 * @description 获取页面的fromRouteName
 * @returns { String }
 */
export const getFromRouteName = () => zrxStorage.getItem(G.fromName)

/**
 * @description 获取表格排序方式
 * @param { string } order 'ascending' | 'descending' | ''
 * @returns { 'asc' | 'desc' | '' }
 * @date 2022-01-18
 */
export function getOrderWay(order) {
    return order?.toString().replace('ending', '') || ''
}

/**
 * @description 根据路径获取文件名称
 * @param { String } url 文件的路径地址
 * @example 'http://10.10.120.201:30223/file/dev/upload//20240509/bg_3873375912029905.jpg' --> 'bg.jpg'
 */
export const getFileNameByUrl = (url) => {
    if (!url) return ''
    const fileName = url.split('/')?.at(-1)?.replace(/_\d+./, '.')
    return window.decodeURI(fileName)
}

/**
 * @description 当前地址为https时，处理文件的url
 * @param { String } url 文件路径
 * @example http://183.134.197.26:30124/file/dev/upload//20240517/员工固定资产统计表_11591128615196496.xls --> https://183.134.197.26:30124/file/dev/upload//20240517/员工固定资产统计表_11591128615196496.xls
 * @returns { String }
 */
export const handleFileUrlOnHttps = (url) => {
    if (location.href?.startsWith('http:') || !url || !window.globalData.fileServerUrl) return url

    // 将url中的ip + 端口换成指定的格式

    return url?.replace(/http:\/\/[\d.:]+/g, window.globalData.fileServerUrl)
}

/** 将详情中返回的附件字符串处理成数组 */
export const handleAttachments = (attachments) => {
    if (!attachments) return []
    let temp = []

    if (Array.isArray(attachments)) {
        temp = attachments
    } else if (Array.isArray(JSON.parse(attachments))) {
        temp = JSON.parse(attachments)
    }

    return temp.map((file) => {
        return {
            originUrl: file.url,
            url: handleFileUrlOnHttps(file.url),
            name: file.fileName || file.name
        }
    })
}

/**
 * @description 生成从minNum到maxNum的随机数
 * @param { Number } minNum 范围1
 * @param { Number } maxNum 范围2
 * @date 2024-05-10
 */
export function randomNum(minNum, maxNum) {
    switch (arguments.length) {
        case 1:
            return parseInt(Math.random() * minNum + 1, 10)
        case 2:
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10)
        default:
            return 0
    }
}

/**
 * @description 计算耗时
 * @param { String } startTime 开始时间
 * @param { String } endTime 结束时间
 * @date 2024-05-13
 */
export const getProcessingTime = (startTime, endTime) => {
    try {
        if (!startTime || !endTime) return ''
        const v1 = new Date(formatDate(startTime, 'yyyy/MM/dd HH:mm:ss')).getTime()
        const v2 = new Date(formatDate(endTime, 'yyyy/MM/dd HH:mm:ss')).getTime()

        const d = Math.floor((v2 - v1) / 1000)
        const getMinute = (v) => {
            let m = Math.floor(v / 60)
            if (m >= 60) m = m % 60
            return m
        }

        const getHour = (v) => {
            let h = Math.floor(v / (60 * 60))
            if (h >= 24) h = h % 24

            return h
        }

        const getDay = (v) => Math.floor(v / (60 * 60 * 24))

        const m = getMinute(d)
        const h = getHour(d)
        const day = getDay(d)
        const s = d - day * (24 * 60 * 60) - m * 60 - h * 60 * 60

        return `${day ? day + '天' : ''}${h ? h + '小时' : ''}${m ? m + '分' : ''}${s ? s + '秒' : ''}`
    } catch (error) {
        return ''
    }
}

/**
 * @description 返回数组中，key值匹配项的label
 * @param {*} value
 * @param {*} arr
 * @param {string} [valueKey='value']
 * @param {string} [labelKey='label']
 * @returns {*}
 */
export const getRelevantValue = (value, arr, valueKey = 'value', labelKey = 'label') => {
    return arr?.find((item) => item[valueKey] === value)?.[labelKey] ?? '- -'
}

export function getStartOfWeek(date, format) {
    const currentDate = date ? new Date(date) : new Date()
    // 获取当前日期的星期几（0-6），星期天是0
    const day = currentDate.getDay()
    // 计算星期一的日期偏移量
    const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1)
    // 设置日期为本周的星期一
    currentDate.setDate(diff)
    // 设置时间为当天的00:00:00
    currentDate.setHours(0, 0, 0, 0)
    // 返回结果
    return format ? formatDate(currentDate, format) : currentDate
}

/**
 * @description 将指定数组按照指定键值属性转成对象字典
 * @template T
 * @template T1
 * @template T2
 * @param { T } data
 * @param { T1 } originKey 转换成目标对象的key对应数组对象中的属性,默认为value;
 * @param { T2 } targetKey 转换成目标对象的value对应数组对象中的属性，默认为label
 * @returns { ToKeyValue<T, T1, T2> }
 */
export const getDict = (data, originKey = 'value', targetKey = 'label') => data.reduce((r, d) => ({ ...r, [d[originKey]]: d[targetKey] }), {})

/**
 * @description 将blob类型的文件转为.docx类型
 * @param {*} data
 * @param {*} fileName
 */
export function downloadWordFile(data, fileName, type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=UTF-8') {
    const blob = new Blob([data], { type })
    const link = document.createElement('a')
    link.download = fileName
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    document.body.appendChild(link)
    link.click()
    URL.revokeObjectURL(link.href)
    document.body.removeChild(link)
}

/**
 * @description 文件上传格式校验
 * @author wt
 * @date 2022-12-20
 */
export const isFileCheck = (file, callBack) => {
    if (file.name == '') {
        callBack(`请选择文件`)
        return
    } else {
        if (!/\.(xls|xlsx)$/.test(file.name)) {
            callBack(`文件上传格式错误`)
            return
        } else if (!/^[\u4e00-\u9fa5a-zA-z0-9-_()（）. ]+$/.test(file.name)) {
            callBack(`文件名只支持，中文、英文、数字、空格、-、_、()、（）、.`)
            return
        } else if (file.name.length > 64) {
            callBack(`文件名长度不能大于64`)
            return
        } else if (parseInt(file.size / Math.pow(2, 20)) >= 10) {
            callBack('导入的文件不能大于10M')
            return
        } else {
            callBack()
        }
    }
}

/**
 * @description 为目标对象添加千分符
 * @export
 * @param {*} num 目标对象
 * @param {*} digits 保留小数位数 不传则不处理
 * @param {*} [defaultValue=null] 输入异常值时返回的值
 * @returns {*} String/Number
 */
export function addThousandSeperators(num, digits, defaultValue = null) {
    const type = typeof num
    if (['number', 'string'].includes(type)) {
        if (type == 'string') {
            const _num = num - 0
            if (Number.isNaN(_num)) {
                return defaultValue
            }
            return _num.toLocaleString('en-IN', { maximumFractionDigits: digits }) + ''
        }
        return num.toLocaleString('en-IN', { maximumFractionDigits: digits })
    }
    return defaultValue
}
