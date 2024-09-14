export const apiKeyMap = /** @type { const } */ ({
    common: {
        /** 获取用户信息 */
        getUserInfo: '/user/center/user',
        /** 获取侧边导航菜单 */
        menuList: '/terrace/center/menu/tree',
        /** 获取用户的权限列表 */
        auth: '/terrace/center/menu/plat/sign',
        upload: '/file/server/file/uploadFtp',
        // 注销token
        logout: '/uaa/center/oauth/remove/token',
        /** 字典信息 */
        getDicInfo: '/user/center/feign/treeDicInfo',
        /** 单个类型字典查询 */
        getCompanyDictByType: '/company/demand/companyDic/get',
        /** 获取机构树 */
        getOrgTreeList: '/user/external/org/getOrgTreeList',
        /** 根据传入的机构id，获取下级全部机构 */
        findChildrenOrgById: '/user/external/org/findChildrenOrgById',
        /** 获取领导用户列表 */
        getLeaderList: '/user/center/user/page',
        /** 获取当前用户的所有角色 */
        getAllRoleListByUid: '/user/center/role/getAllRoleListByUid',
        /** 获取镇街、园区数据 */
        dicInfoByParentCode: '/user/center/feign/dicInfoByGridStreet',
        // 导入导出进度
        getProcess: '/company/demand/fileManagement/progress',
        // 下载文件模板
        getExcelTemplate: '/company/demand/common/excel/template',
        // 校验上传文件
        uploadFile: '/company/demand/fileManagement/import',
        // 下载校验结果
        getExcelCheckout: '/company/demand/fileManagement/checkExcel',
        // 删除上传的文件
        deleteImportFile: '/company/demand/fileManagement/deleteImportFile',
        // 取消上传文件
        stopImportUrl: '/company/demand/fileManagement/cancel',
        // 执行上传文件
        excuteImport: '/company/demand/fileManagement/storage'
    },
    /** 诉求登记 */
    appealRegister: {
        /** 诉求登记分页查询 */
        page: '/company/demand/companyDemands/page',
        /** 诉求登记查询详情 */
        detail: '/company/demand/companyDemands/get',
        /** 诉求登记删除 */
        delete: '/company/demand/companyDemands/delete',
        /** 诉求登记新增/暂存 */
        save: '/company/demand/companyDemands/save',
        /** 企业名称信息分页 */
        companyNamePage: '/user/external/companyUser/companyNamePage'
    }
})
