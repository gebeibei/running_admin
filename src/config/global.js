export const G = /** @type { const } */ ({
    ...window.globalData,
    timeout: 15 * 1000, // 15s
    /**@type { Boolean } 是否为生产环境 */
    isProd: import.meta.env.PROD,
    accessToken: 'zrx-appeal-accessToken',
    platformId: 'zrx-appeal-platformId',
    messageBoxConfig: {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showConfirmButton: true,
        showCancleButton: true,
    },
    /**@description 空值时候的占位符 */
    emptyStr: '- -',
    indexWidth: '80px',
    selectionWidth: '55px',
    dateWidth: '180px',
    dayTime: 24 * 60 * 60 * 1000,
    isSmallScreen: window.innerWidth < 1440,
    maxKeepAliveCount: 20,
    fromName: 'zrx-appeal-from-name',
    formPath: 'zrx-appeal-from-path'
})
