import { G } from '@/config/global'

/**
 *@description 用户获取url串中的参数
 *@date 2020-06-12
 */
export function getQueryString(name) {
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    const reg_rewrite = new RegExp('(^|/)' + name + '/([^/]*)(/|$)', 'i')
    const r = window.location.search.substr(1).match(reg)
    const q = window.location.pathname.substr(1).match(reg_rewrite)
    if (r != null) {
        return unescape(r[2])
    } else if (q != null) {
        return unescape(q[2])
    } else {
        return null
    }
}
/**
 *@description 用于去除url中参数
 @param { paramKeys：Array(string) }
 *@date 2020-06-12
 */
export function delParam(paramKeys) {
    const url = window.location.href // 页面url
    const urlParam = window.location.search.substr(1) // 页面参数
    const beforeUrl = url.substr(0, url.indexOf('?')) // 页面主地址（参数之前地址）
    var nextUrl = ''
    // eslint-disable-next-line no-array-constructor
    var arr = new Array()
    if (urlParam) {
        const urlParamArr = urlParam.split('&') // 将参数按照&符分成数组
        for (let i = 0; i < urlParamArr.length; i++) {
            const paramArr = urlParamArr[i].split('=') // 将参数键，值拆开
            // 如果键雨要删除的不一致，则加入到参数中
            if (!paramKeys.includes(paramArr[0])) {
                arr.push(urlParamArr[i])
            }
        }
    }
    if (arr.length > 0) {
        nextUrl = '?' + arr.join('&')
    }
    return beforeUrl + window.location.hash
}
export function setCookie(key, value) {
    window.localStorage.setItem(key, value)
}
export function getCookie(key) {
    return window.localStorage.getItem(key)
}
export function delCookie(key, option) {
    window.localStorage.removeItem(key)
}
export function clearTokenAndToLogin() {
    if (import.meta.env.PROD) {
        delCookie(G.accessToken)
        window.open(G.redirectURL, '_self')
    }
}
export function getToken() {
    return getCookie(G.accessToken) ? `Bearer ${getCookie(G.accessToken)}` : ''
}
