import { h } from 'vue'
import { ElMessage as Message } from 'element-plus'
import omit from 'lodash/omit'
import { isObject } from './index'
const iconsMap = {
    success: h('i', { className: 'zrx-icon zrx-icon-success' }),
    error: h('i', { className: 'zrx-icon zrx-icon-error' }),
    warning: h('i', { className: 'zrx-icon zrx-icon-question' }),
    info: h('i', { className: 'zrx-icon zrx-icon-info' })
}
const iconsGMap = {
    success: h('i', { className: 'zrx-icon zrx-icon-success' }),
    error: h('i', { className: 'zrx-icon zrx-icon-error' }),
    warning: h('i', { className: 'zrx-icon zrx-icon-warning' }),
    info: h('i', { className: 'zrx-icon zrx-icon-info' })
}
const getIconByType = (type = 'info', customClass = 'zrx-g-message') => {
    return customClass == 'zrx-g-message' ? iconsGMap[type] : iconsMap[type]
}

let messageInstance = null
/** @type { typeof Message } */
//重置ElMessage
const _ElMessage = (params = {}) => {
    if (messageInstance) {
        messageInstance.close()
    }
    const options = {
        message: '',
        customClass: params?.customClass || 'zrx-g-message'
    }
    if (isObject(params)) {
        if (!params.icon) {
            // console.log('params:', params)
            Object.assign(options, {
                showClose: true,
                ...params,
                icon: getIconByType(params.type, params?.customClass)
            })
        } else {
            Object.assign(options, {
                showClose: true,
                ...params
            })
        }
    } else {
        Object.assign(options, {
            message: params,
            showClose: true,
            icon: getIconByType('info')
        })
    }
    messageInstance = Message(options)
}

const types = ['error', 'success', 'info', 'warning']
types.forEach((type) => {
    _ElMessage[type] = (params) => {
        let options = {
            message: '',
            type
        }
        isObject(params) ? Object.assign(options, omit(params, 'type')) : (options.message = params)
        return _ElMessage(options)
    }
})
export const ElMessage = _ElMessage
