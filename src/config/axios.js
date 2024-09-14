import axios from 'axios'
import { apiKeyMap } from '@/config/apiKeyMap'
import { G } from './global'
import { isEmpty } from '@/utils'
import { ElMessage } from 'zrx-admin-plus'
import { getToken, clearTokenAndToLogin } from '@/utils/cookie'

const cancelToken = axios.CancelToken
const source = cancelToken.source()

const request = axios.create({
    baseURL: G.baseURL,
    timeout: G.timeout,
    cancelToken: source.token,
    credentials: true,
    headers: {
        'Content-Type': 'application/json; charset=utf-8'
    }
})

// 清除cookie并跳转登录页
const goLogin = () => {
    setTimeout(() => {
        clearTokenAndToLogin()
    }, 600)
}
let isFirstTip = true // 整个生命周期仅仅执行1次的提示方法
const onlyOnceTip = (msg = '登录超时,请重新登录!') => {
    if (!isFirstTip) return
    toast(msg)
    isFirstTip = false
}
// 信息提示
const toast = (msg, duration = 1500) => {
    ElMessage({
        type: 'error',
        message: msg,
        duration: duration
    })
}

const handleFalseyValue = (raw) => {
    Object.keys(raw).forEach((key) => {
        if (isEmpty(raw[key])) raw[key] = null
    })
}

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, other) => {
    switch (Number(status)) {
        case 401:
            onlyOnceTip('获取用户鉴权失败，请重新登录')
            goLogin()
            break
        case 403:
            onlyOnceTip()
            goLogin()
            break
        case 404:
            toast('请求资源不存在!')
            break
        case 405:
            toast('请求方式错误!')
            break
        default:
            toast(other)
    }
}

const specStrList = ['/user/center', '/terrace/center', '/file/server', '/user/external', '/uaa/center']
request.interceptors.request.use(
    async (config) => {
        specStrList.forEach((str) => {
            if (config.url.includes(str)) config.baseURL = G.businessURL
        })

        if (config.credentials) {
            config.headers.Authorization = getToken()
        }
        if (config.useFormData) {
            const fd = new FormData()
            const method = config.method
            const payloadKey = ['GET', 'get'].includes(method) ? 'params' : 'data'
            for (const key in config[payloadKey]) {
                fd.append(key, config[payloadKey][key])
            }
            config[payloadKey] = fd
        }

        return config
    },
    (error) => {
        return Promise.error(error)
    }
)
request.interceptors.response.use(
    (res) => (res.status == 200 ? Promise.resolve(res) : Promise.reject(res)),
    (error) => {
        const { response } = error

        if (response) {
            if (!error.config?.customErrorTip) {
                errorHandle(response.status, response.data?.message || '网络异常')
            }
            return Promise.reject(response)
        } else if (error.message.match(/timeout/i)) {
            if (!error.config?.customErrorTip) {
                errorHandle(null, '请求超时')
            }
            return Promise.reject(error)
        } else {
            return Promise.reject(error)
        }
    }
)

export { request, apiKeyMap }
