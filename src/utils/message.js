import { G } from '@/config/global'
import { ElMessageBox } from '@/zrxAdminPlus'

/**
 * @description 简化常用ElMessageBox调用
 * @param { String } message 确认框提示的内容
 * @param { String } title 确认框提示的标题，默认为'温馨提示'
 * @param { typeof G.messageBoxConfig } options ElMessageBox的配置参数，默认为Config.messageBoxConfig
 * @date 2022-12-07
 */
export const messageBox = (message, title = '温馨提示', options = G.messageBoxConfig) => {
    return new Promise((resolve, reject) => {
        ElMessageBox.confirm(message, title, options)
            .then(() => {
                resolve()
            })
            .catch((err) => {
                reject(err)
            })
    })
}
