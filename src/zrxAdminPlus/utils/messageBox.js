import { h } from 'vue'
import { ElMessageBox as MessageBox } from 'element-plus'
import { isObject } from './index'
const iconsMap = {
    success: h('i', { className: 'zrx-icon zrx-icon-success-large' }),
    error: h('i', { className: 'zrx-icon zrx-icon-error-large' }),
    warning: h('i', { className: 'zrx-icon zrx-icon-question-large' }),
    info: h('i', { className: 'zrx-icon zrx-icon-info-large' })
}
const getIconByType = (type = 'info') => iconsMap[type]

const createOption = (type = 'info') => {
    return {
        type,
        icon: getIconByType(type),
        cancelButtonText: type == 'info' ? '取消' : '关闭',
        showCancelButton: true,
        confirmButtonText: '确定',
        showConfirmButton: type == 'info',
        showClose: false
    }
}
/** @type { typeof MessageBox } */
//重置MessageBox
const _ElMessageBox = (params = {}) => {
    const options = {
        message: ''
    }
    // console.log('params:', params)
    if (isObject(params)) {
        if (!params.icon) {
            Object.assign(options, {
                ...createOption(params?.type || 'info'),
                ...params
            })
        } else {
            Object.assign(options, {
                ...createOption(params?.type || 'info'),
                ...params
            })
        }
    } else {
        Object.assign(options, {
            ...createOption('info'),
            message: params
        })
    }

    return params?.method ? MessageBox[params.method](options.message, options.title, options) : MessageBox(options)
}
const methods = ['alert', 'confirm', 'prompt']
methods.forEach((method) => {
    _ElMessageBox[method] = (...args) => {
        let params = {}
        Object.assign(params, {
            method,
            message: args[0],
            title: args.length > 2 ? args[1] : undefined,
            showConfirmButton: ['confirm', 'prompt'].indexOf(method) != -1,
            type: ['confirm', 'prompt'].indexOf(method) != -1 ? 'warning' : 'info',
            ...(args.length == 3 ? args[2] : args[1])
        })
        return _ElMessageBox(params)
    }
})

export const ElMessageBox = _ElMessageBox
