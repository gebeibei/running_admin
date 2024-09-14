/*
 * @Author: wupeiwen javapeiwen2010@gmail.com
 * @Date: 2018-04-20 11:49:46
 * @Last Modified by: 43805
 * @Last Modified time: 2018-08-23
 */
// 数字的正则表达式
const isNum = (str) => {
    const reg = /^\d*$/
    return reg.test(str)
}

// 整数的正则表达式
const isInt = (str) => {
    const reg = /^0$|^[1-9]\d*$/
    return reg.test(str)
}

// 英文的正则表达式
const isEnglish = (str) => {
    const reg = /^[a-zA-Z]*$/
    return reg.test(str)
}

// 英文数字组合的正则表达式
const isEnglishNum = (str) => {
    const reg = /^[a-zA-Z0-9_]*$/
    return reg.test(str)
}

// 中文的正则表达式
const isChinese = (str) => {
    const reg = /^[\u4e00-\u9fa5]{0,}$/
    return reg.test(str)
}

// 非中文
const isNotChinese = (str) => {
    const reg = new RegExp('^[\u4e00-\u9fa5]{1,}$')
    return !reg.test(str)
}

// 中文和符号的正则表达式
const isChineseSymbol = (str) => {
    const reg = /^[\u4e00-\u9fa5，。！、……《》（）【】：；“‘”’？￥,.?:;'"()]+$/
    return reg.test(str)
}

// 18位身份证的正则表达式
const isIDCard = (str) => {
    const reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
    return reg.test(str)
}

// 港澳居民来往内地通行证
const isHKCard = (card) => {
    // 规则： H/M + 10位或6位数字
    // 样本： H1234567890
    const reg = /^([A-Z]\d{6,10}(\(\w{1}\))?)$/
    return reg.test(card)
}

// 护照
const isPassPortCard = (card) => {
    // 规则： 14/15开头 + 7位数字, G + 8位数字, P + 7位数字, S/D + 7或8位数字,等
    // 样本： 141234567, G12345678, P1234567
    const reg = /^([a-zA-z]|[0-9]){5,17}$/
    return reg.test(card)
}

// 军官证
const isOfficerCard = (card) => {
    // 规则： 军/兵/士/文/职/广/（其他中文） + "字第" + 4到8位字母或数字 + "号"
    // 样本： 军字第2001988号, 士字第P011816X号
    const reg = /^[\u4E00-\u9FA5](字第)([0-9a-zA-Z]{4,8})(号?)$/
    return reg.test(card)
}

// 邮箱的正则表达式
const isMail = (str) => {
    const reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
    return reg.test(str)
}

// 11位手机号的正则表达式
const isPhone = (str) => {
    const reg = /^1[3-9][0-9]\d{8}$/
    return reg.test(str)
}
// 座机电话号码的正则表达式（区号-号码）
const isTel = (str) => {
    // const reg = /^\d{3}-\d{8}$|^\d{4}-\d{7}$/
    // 为0开头的3位或4位区号加 - 号，加7位或8位电话号
    const reg = /^0\d{2,3}-\d{7,8}$/
    return reg.test(str)
}

// Url地址的正则表达式
const isUrl = (str) => {
    const reg = /^(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]$/
    return reg.test(str)
}

// 端口号的正则表达式
const isPort = (str) => {
    const reg = /^(1(02[4-9]|0[3-9][0-9]|[1-9][0-9]{2})|[2-9][0-9]{3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/
    return reg.test(str)
}

// IP地址的正则表达式
const isIP = (str) => {
    const reg =
        /^(?:(?:1[0-9][0-9]\.)|(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:1[0-9][0-9])|(?:2[0-4][0-9])|(?:25[0-5])|(?:[1-9][0-9])|(?:[0-9]))$/
    return reg.test(str)
}

const isAllNull = (str) => {
    const reg = /^\s*$/
    return reg.test(str)
}

const isVersionFormat = (str) => {
    const reg = /^\d+(\.\d+)*$/
    return reg.test(str)
}

const isSpace = (str) => {
    const reg = /\s/
    return reg.test(str)
}

const isWechatNum = (str) => {
    const reg = /^[a-zA-Z]([a-zA-Z\d_-]{5,19})$/

    return reg.test(str)
}

// 统一社会信用代码
// 第一部分（第1位）为登记管理部门代码，9表示工商部门；(数字或大写英文字母)
// 第二部分（第2位）为机构类别代码;(数字或大写英文字母)
// 第三部分（第3-8位）为登记管理机关行政区划码；(数字)
// 第四部分（第9-17位）为全国组织机构代码；(数字或大写英文字母)
// 第五部分（第18位）为校验码(数字或大写英文字母)
const isUSCC = (str) => {
    const reg = /[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}/
    return reg.test(str)
}

const ruleList = {
    isNum: isNum,
    isInt: isInt,
    isEnglish: isEnglish,
    isEnglishNum: isEnglishNum,
    isChinese: isChinese,
    isNotChinese,
    isChineseSymbol: isChineseSymbol,
    isIDCard: isIDCard,
    isHKCard,
    isPassPortCard,
    isOfficerCard,
    isMail: isMail,
    isPhone: isPhone,
    isTel,
    isUrl: isUrl,
    isPort: isPort,
    isIP: isIP,
    isAllNull,
    isVersionFormat,
    isSpace,
    isWechatNum,
    isUSCC
}

const checkNumber = (rule, value, callback) => {
    if (!rule.required && !value) return callback()

    if (!ruleList.isNum(value)) {
        return callback(new Error('请输入数字'))
    } else {
        callback()
    }
}
const checkChinese = (rule, value, callback) => {
    if (!rule.required && !value) return callback()

    if (!ruleList.isChinese(value)) {
        return callback(new Error('只能输入中文字符'))
    } else {
        callback()
    }
}
const checkNotChinese = (rule, value, callback) => {
    if (!rule.required && !value) return callback()

    if (!ruleList.isNotChinese(value)) {
        return callback(new Error('不能输入中文'))
    } else {
        callback()
    }
}
const checkChineseSymbol = (rule, value, callback) => {
    if (!rule.required && !value) return callback()

    if (!ruleList.isChineseSymbol(value)) {
        return callback(new Error('只能输入中文和标点符号字符'))
    } else {
        callback()
    }
}
const checkEnglish = (rule, value, callback) => {
    if (!rule.required && !value) return callback()

    if (!ruleList.isEnglish(value)) {
        return callback(new Error('只能输入英文字符'))
    } else {
        callback()
    }
}
const checkEnglishNum = (rule, value, callback) => {
    if (!rule.required && !value) return callback()

    if (!ruleList.isEnglishNum(value)) {
        return callback(new Error('只能输入英文和数字字符'))
    } else {
        callback()
    }
}
const checkIDCard = (rule, value, callback) => {
    if (!rule.required && !value) return callback()

    if (!ruleList.isIDCard(value)) {
        return callback(new Error('18位身份证号码格式不正确'))
    } else {
        callback()
    }
}

const checkHKCard = (rule, value, callback) => {
    if (!rule.required && !value) return callback()

    if (!ruleList.isHKCard(value)) {
        return callback(new Error('港澳居民来往内地通行证号码不合规'))
    } else {
        callback()
    }
}

const checkPassPortCard = (rule, value, callback) => {
    if (!rule.required && !value) return callback()

    if (!ruleList.isPassPortCard(value)) {
        return callback(new Error('护照号码不合规'))
    } else {
        callback()
    }
}

const checkOfficerCard = (rule, value, callback) => {
    if (!rule.required && !value) return callback()

    if (!ruleList.isOfficerCard(value)) {
        return callback(new Error('军官证号不合规'))
    } else {
        callback()
    }
}

const checkMail = (rule, value, callback) => {
    if (!rule.required && !value) return callback()

    if (!ruleList.isMail(value)) {
        return callback(new Error('邮箱格式不正确'))
    } else {
        callback()
    }
}

const checkPhone = (rule, value, callback) => {
    if (!rule.required && !value) return callback()
    if (!ruleList.isPhone(value)) {
        return callback(new Error('11位手机号码格式不正确'))
    } else {
        callback()
    }
}
const checkIP = (rule, value, callback) => {
    if (!rule.required && !value) return callback()

    if (!ruleList.isIP(value)) {
        return callback(new Error('IP地址格式不正确'))
    } else {
        callback()
    }
}
const checkPort = (rule, value, callback) => {
    if (!rule.required && !value) return callback()

    if (!ruleList.isPort(value)) {
        return callback(new Error('端口号格式不正确, 1024-65535'))
    } else {
        callback()
    }
}
const checkUrl = (rule, value, callback) => {
    if (!rule.required && !value) return callback()

    if (!ruleList.isUrl(value)) {
        return callback(new Error('Url地址格式不正确'))
    } else {
        callback()
    }
}

const checkAllNull = (rule, value, callback) => {
    if (!rule.required && !value) return callback()

    if (ruleList.isAllNull(value)) {
        callback(new Error('请输入非空值'))
    } else callback()
}

const checkVersion = (rule, value, callback) => {
    if (!rule.required && !value) return callback()

    if (!ruleList.isVersionFormat(value)) {
        callback(new Error('请输入正确的版本格式'))
    } else callback()
}

const checkUserName = (rule, value, callback) => {
    if (!rule.required && !value) return callback()

    if (!value) {
        callback(new Error('请输入用户名'))
    } else callback()
}

const checkPassWord = (rule, value, callback) => {
    if (!rule.required && !value) return callback()

    if (!isEnglishNum(value)) {
        callback(new Error('请输入正确的密码格式，字母数字组合'))
    } else callback()
}

const checkPhoneNum = (rule, value, callback) => {
    if (!rule.required && !value) return callback()

    if (!ruleList.isTel(value) && !ruleList.isPhone(value)) {
        return callback(new Error('请输入正确的手机号码或者座机(区号-电话)'))
    } else {
        callback()
    }
}

const validatePassword = (str) => {
    const reg = /^(\w){6,20}$/
    const obj = {
        boolean: true,
        msg: ''
    }
    obj.boolean = reg.test(str)
    obj.msg = '应由6-20位字母，数字，下划线组成'
    return obj
}

const validateMobile = (str) => {
    const reg = /^1\d{10}$/
    const obj = {
        boolean: true,
        msg: ''
    }
    obj.boolean = reg.test(str)
    obj.msg = '请填写正确的移动电话号码'
    return obj
}

const validatePhone = (str) => {
    const reg = /^[\d]+$/
    const obj = {
        boolean: true,
        msg: ''
    }
    obj.boolean = reg.test(str)
    obj.msg = '请填写正确的联系电话'
    return obj
}

const validateSpace = (rule, value, callback) => {
    if (!rule.required && !value) return callback()

    if (ruleList.isSpace(value)) {
        return callback(new Error('请不要输入空格'))
    } else {
        callback()
    }
}

const checkWechatNum = (rule, value, callback) => {
    if (!rule.required && !value) return callback()

    if (!ruleList.isWechatNum(value)) {
        return callback(new Error('仅支持6-20个字母、数字、下划线或减号，以字母开头'))
    } else {
        callback()
    }
}

// 统一社会用代码表单校验
const usccValidator = (rule, value, callback) => {
    if (!rule.required && !value) return callback()

    if (!isUSCC(value)) {
        callback(new Error('请输入正确格式的统一社会信用代码'))
    } else {
        callback()
    }
}

const checkReg = {
    isPhone,
    isIP,
    checkNumber,
    checkChinese: checkChinese,
    checkNotChinese,
    checkChineseSymbol: checkChineseSymbol,
    checkEnglish: checkEnglish,
    checkEnglishNum: checkEnglishNum,
    checkIDCard: checkIDCard,
    checkHKCard: checkHKCard,
    checkPassPortCard: checkPassPortCard,
    checkOfficerCard: checkOfficerCard,
    checkMail: checkMail,
    checkPhone,
    checkIP: checkIP,
    checkPort: checkPort,
    checkUrl: checkUrl,
    checkAllNull,
    checkVersion,
    checkUserName,
    checkPassWord,
    checkPhoneNum,
    validatePassword,
    validateMobile,
    validatePhone,
    validateSpace,
    checkWechatNum,
    usccValidator
}

export default checkReg
