import { defineStore } from 'pinia'
import { isEmpty } from '@/utils'
import { request, apiKeyMap } from '@/config/axios'
import lodash from 'lodash'

export const getUserInfo = () => {
    return request({
        method: 'get',
        url: apiKeyMap.common.getUserInfo
    })
}

export const getDicInfo = () => {
    return request({
        method: 'get',
        params: { dicType: '1' },
        url: apiKeyMap.common.getCompanyDictByType
    })
}
export const commonStore = defineStore('commonStore', {
    state: () => {
        return {
            userInfo: {}, //用户信息
            collapse: false, // 侧边栏状态
            cachedRouteNames: [], // 缓存的路由名称
            isOverlay: true,
            breadCrumbList: []
        }
    },
    getters: {},
    actions: {
        updateState(key, value) {
            this[key] = value
        },
        async getUserInfo() {
            try {
                if (isEmpty(this.userInfo) || Object.keys(this.userInfo).length === 0) {
                    const res = await getUserInfo()
                    const data = res?.data?.data || null
                    this.updateState('userInfo', data)
                }
                return this.userInfo
            } catch (error) {
                console.log(error)
                return this.userInfo
            }
        }
    }
})
