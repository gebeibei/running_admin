import { request } from '@/config/axios'
import { messageBox } from '@/utils/message'
import { ElMessage } from '@/zrxAdminPlus'

/**
 * @description 列表多选导出数据
 * @date 2023-04-03
 */
export const useDownload = () => {
    /**
     * @description 点击下载/导出
     * @param { Number } total 列表数据条数
     * @param { Number } length 列表导出勾选数据的长度
     * @returns { Promise }
     * @date 2023-04-03
     */
    const clickDownload = (total, length) => {
        return new Promise((resolve) => {
            if (total === 0) {
                ElMessage.warning('没有可以导出的数据')
            } else {
                const hasSelect = length !== 0
                const msg = hasSelect ? `是否导出选中的${length}项？` : '您未选中任何项，默认导出全部，是否导出？'
                messageBox(msg).then(resolve)
            }
        })
    }

    /**
     * @description 点击下载/导出
     * @param { AxiosRequestConfig } axiosConfig axios请求的参数对象
     * @returns { Promise }
     * @date 2023-04-03
     */
    const handleDownloadFile = (axiosConfig) => {
        const {
            method = 'post',
            url = '',
            data = {},
            params = {},
            responseType = 'blob',
            timeout = 60 * 1000,
            defaultFileName = '导出数据.xlsx'
        } = axiosConfig

        return new Promise((resolve, reject) => {
            request({
                method,
                url,
                data,
                params,
                responseType,
                timeout
            })
                .then((res) => {
                    const blob = new Blob([res.data], {
                        type: 'data:application/vnd.ms-excel;charset=utf-8'
                    })
                    const fileName = window.decodeURI(res.headers['content-disposition']?.split('=')[1] || defaultFileName)
                    const objectUrl = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = objectUrl
                    a.download = fileName
                    a.click()
                    resolve(res)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }

    return {
        clickDownload,
        handleDownloadFile
    }
}
