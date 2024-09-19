export const isEmpty = (value) => {
    return [null, undefined, NaN, ''].includes(value) || /^\s+$/.test(value)
}

/**
 * @description 获取目标的具体类型
 * @export
 * @param {*} target 目标
 * @returns {*} string in lower case
 */
export function getTypeof(target) {
    return Object.prototype.toString
        .call(target)
        .match(/\S+(?=\])/)[0]
        .toLowerCase()
}

export const translateTypeToString = (val) => Object.prototype.toString.call(val)

export function isDate(val) {
    return translateTypeToString(val) === '[object Date]'
}
export function isObject(val) {
    return translateTypeToString(val) === '[object Object]'
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

export function transformToDate(value) {
    let result
    try {
        if (isEmpty(value)) {
            throw new Error()
        } else if (value instanceof Date || typeof value === 'string' || typeof value === 'number') {
            result = new Date(value)
        }
        if (result instanceof Date && result.toString() === 'Invalid Date') {
            throw new Error()
        }
    } catch (e) {
        result = new Date()
    }
    return result
}

export function toDateLong(value) {
    const type = getTypeof(value)
    if (type == 'date') {
        return !isNaN(value) ? value.valueOf() : 0
    } else if (type == 'number' || type == 'string') {
        return toDateLong(new Date(value))
    }
    return 0
}

/**
 * @description 处理数值，为其添加单位，并保留一定位数
 * @export
 * @param {*} num 输入数值
 * @param {number} [retainedDigits=2] 保留的位数
 * @returns {*} {value, unit}
 */
export function simplifyNumber(num, retainedDigits = 2) {
    const type = typeof num
    let unit = ''
    if (type == 'string') {
        num -= 0
    } else if (type != 'number') {
        return { value: '', unit }
    }
    const digits = getDigits(num)
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

/**
 * @description 为一个数值保留几位小数
 * @export
 * @param {*} num 输入数值
 * @param {*} retianVal 要保留的小数位数
 * @returns {*} 输出数值
 */
export function retainDigits(num, retianVal) {
    const val = Math.pow(10, retianVal)
    return Math.round(num * val) / val
}

/**
 * @description 获取数值的位数
 * @export
 * @param {*} num 输入数值
 * @returns {*} 数值位数
 */
export function getDigits(num) {
    return (Math.log(num) * Math.LOG10E + 1) | 0
}

/**
 * @description 安全地将一个字符串转成数字
 * @export
 * @param {*} val 字符串或数字
 * @returns {*} 数字
 */
export function convertNumberByString(val) {
    if (typeof val == 'string') {
        const v = val - 0
        return Number.isNaN(v) ? 0 : v
    }
    return val
}

/**
 * @description 安全地将一个字符串转成0或正整数
 * @export
 * @param {*} val 字符串或数字
 * @returns {*} 数字
 */
export function convertPositiveIntegerByString(val) {
    if (typeof val == 'string') {
        let v = val - 0
        v = Number.isNaN(v) ? 0 : Math.round(v)
        return Math.max(v, 0)
    }
    return Math.max(Math.round(val), 0)
}

export const withInstall = (main, extra) => {
    main.install = (app) => {
        for (const comp of [main, ...Object.values(extra != null ? extra : {})]) {
            app.component(comp.name, comp)
        }
    }
    if (extra) {
        for (const [key, comp] of Object.entries(extra)) {
            main[key] = comp
        }
    }
    return main
}

/**
 * @description 提取'***px','***'为数值
 * @param {*} val
 * @param {number} [defaultVal=0]
 * @returns {*} 数字
 */
export const getPropVal = (val, defaultVal = 0) => {
    if (typeof val == 'string') {
        const v = val.replace(/px(?=$)/i, '') - 0
        return Number.isNaN(v) ? defaultVal : v
    }
    return val
}

export function generateUUID() {
    const s = []
    const hexDigital = '0123456789abcdef'
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigital.substr(Math.floor(Math.random() * 0x10), 1)
    }
    s[14] = '4'
    s[19] = hexDigital.substr((s[19] & 0x3) | 0x8, 1)
    s[8] = s[13] = s[18] = s[23] = '-'
    return s.join('')
}