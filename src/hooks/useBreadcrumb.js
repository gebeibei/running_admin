import lodash from 'lodash'
import { commonStore } from '@/store/commonStore'
import { zrxStorage, getFromRouteName } from '@/utils'
import { breadcrumbs, buildRoutesMap } from '@/config/breadcrumb'
import { G } from '@/config/global'

const cachedRouteNamesMap = buildRoutesMap()
const commonStr = '/'

/**
 * @description 关于面包屑数据的一些方法和应用，请确保所有路由均在breadcrumbs数组中；
 * 提取所有关于使用breadcrumbs数据的操作在此hook中，方便了解所有逻辑的完整性，提高代码可读性；
 * !!!注意: 如果某个页面的路由为公共路由（即在多个页面会跳转☞该页面），请在breadcrumbs中建立一一对应的map，来对应相应的链路；
 * @date 2022-10-21
 */
export const useBreadcrumb = () => {
    /**@description 获取默认的路由路径轨迹，返回轨迹的首项 */
    const getDefaultPathTrack = (route, pathTrack) => {
        return route.query?.origin || [...pathTrack.keys()][0]
    }

    /**
     * @description 根据当前路由，设置breadcrumb，会将当前路由的query参数持久化保存在sessionStorage中，
     * 以便于在下一层面包屑返回时候读取参数，下一层面包屑返回读取参数过后，则会删除该数据；
     * @param { Object } route 当前路由对象
     * @param { Object } from 来的路由对象
     * @date 2023-03-28
     */
    const setBreadcrumbs = (route, from) => {
        const store = commonStore()
        const pageObj = breadcrumbs.find((item) => item.name == route.name)
        if (!pageObj?.pathTrack) return

        const breadCrumbList = []
        const { pathTrack } = lodash.cloneDeep(pageObj)

        if (Array.isArray(pathTrack)) {
            pathTrack.forEach((_name) => {
                const target = breadcrumbs.find((item) => item.name === _name)
                if (target) {
                    breadCrumbList.push({
                        label: target.label,
                        path: target.type == 'directory' ? '' : commonStr + target.name
                    })
                }
            })
        } else {
            let fromName = from.name // 来源路由的name
            if (fromName) {
                zrxStorage.setItem(G.fromName, fromName)
            } else {
                fromName = getFromRouteName()
            }

            if (!fromName) {
                // 如果此时仍不存在，说明为外部应用直接跳转的具体route，则根据
                fromName = getDefaultPathTrack(route, pathTrack)
                zrxStorage.setItem(G.fromName, fromName)
            }

            // 为Map类型
            pathTrack.get(fromName)?.forEach((_name) => {
                const target = breadcrumbs.find((item) => item.name === _name)
                if (target) {
                    breadCrumbList.push({
                        label: target.label,
                        path: target.type == 'directory' ? '' : commonStr + target.name
                    })
                }
            })
        }

        if (breadCrumbList.length && Object.keys(route.query).length) {
            // 持久化保存路由中的参数
            zrxStorage.setItem(route.path, route.query)
        }

        store.breadCrumbList = breadCrumbList
    }

    /**
     * @description 更新面包屑数据
     * @param { Object } params
     * @param { Number } params.index 需要更新对象在数据中的索引;为-1时，更新最后一项；
     * @param { { label: String; path: String } } params.payload 需要更新的数据对象
     * @date 2023-03-10
     */
    const updateBreadcrumb = ({ payload, index }) => {
        const store = commonStore()
        if (store.breadCrumbList.at(index)) Object.assign(store.breadCrumbList.at(index), payload)
    }

    /**
     * @description 获取breadcrumb的query参数，获取过后会删除sessionStorage中保存的参数，以消除副作用
     * @param { String } key 存储参数的key，为路由的path;
     * @date 2023-03-28
     */
    const getBreadcrumbQuery = (key) => {
        const queryStr = zrxStorage.getItem(key)
        if (queryStr) zrxStorage.removeItem(key)

        return queryStr || null
    }

    /**
     * @description 根据当前路由，获取侧边导航高亮的path
     */
    const getMenuActivePath = (route) => {
        const targetRoute = breadcrumbs.find((item) => item.name == route.name)
        const directoryList = breadcrumbs.filter((item) => item.type == 'directory').map((item) => item.name)

        if (!targetRoute) return null

        const fromName = getFromRouteName()
        const pathTrack = Array.isArray(targetRoute.pathTrack) ? targetRoute.pathTrack : targetRoute.pathTrack.get(fromName)

        // 需要过滤掉类型是目录的菜单项
        let menu = lodash.cloneDeep(pathTrack || []).filter((n) => !directoryList.includes(n))
        if (!Array.isArray(menu)) {
            menu = fromName ? menu.get(fromName) : getDefaultPathTrack(route, menu)
        }
        const _temp = menu.length ? commonStr + menu[0] : null

        return _temp === '/iframeBox' ? `/iframeBox?_k=${route.query._k}` : _temp
    }

    /** 获取当前路径轨迹 */
    const getPathTrack = (route) => {
        const targetRoute = breadcrumbs.find((item) => item.name == route.name)

        if (!targetRoute) return []

        const fromName = getFromRouteName()
        const pathTrack = Array.isArray(targetRoute.pathTrack) ? targetRoute.pathTrack : targetRoute.pathTrack.get(fromName)

        return pathTrack
    }

    return {
        breadcrumbs,
        cachedRouteNamesMap,
        setBreadcrumbs,
        updateBreadcrumb,
        getBreadcrumbQuery,
        getPathTrack,
        getMenuActivePath
    }
}
