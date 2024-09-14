/** 全局常用的获取后端数据的方法 */
import { findItem } from './index'
import { apiKeyMap, request } from '@/config/axios'

/**
 * @description 根据传入的机构id，获取下级全部机构,默认为获取全局配置的节点（香洲）及下属机构
 * @param { String } orgId 机构节点id
 * @date 2024-05-16
 */
export const getOrgTreeData = async (orgId) => {
    const id = orgId || window.globalData?.orgId
    try {
        const res = await request({
            method: 'get',
            params: { orgStatus: '1' },
            url: apiKeyMap.common.getOrgTreeList
        })
        const data = findItem(res.data.data || [], { key: 'id', value: id })

        return data ? [data] : []
    } catch (err) {
        throw err
    }
}

/**
 * @description 获取字典信息
 * @param { 'grid' | 'industry' | 'companyType' } type 要获取的字典类型（industry：企业类型；grid: 区划）
 */
export const getDictInfo = async (type) => {
    try {
        const res = await request({
            method: 'get',
            params: { type: type },
            url: apiKeyMap.common.getDicInfo
        })

        return res.data?.data || []
    } catch (error) {
        console.log('🚀 ~ getDictInfo ~ error:', error)
        throw err
    }
}

/**
 * @description 根据当前用户uid获取所有角色id列表
 * @param { String } userId 当前用户id
 * @date 2024-05-27
 */
export const getAllRoleListByUid = async (userId) => {
    try {
        const res = await request({
            method: 'get',
            params: { userId, roleTypes: '0' },
            url: apiKeyMap.common.getAllRoleListByUid
        })

        const data = res.data?.data || []

        return data
    } catch (error) {
        throw error
    }
}
