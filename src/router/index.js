import { routes } from './routes'
import { G } from '@/config/global'
import { createRouter, createWebHashHistory } from 'vue-router'
import { getQueryString, delParam, setCookie, getCookie, clearTokenAndToLogin } from '@/utils/cookie'
import { commonStore } from '@/store/commonStore'
import { messageBox } from '@/utils/message'

const router = createRouter({
    history: createWebHashHistory(),
    routes
})
const { breadcrumbs, setBreadcrumbs, cachedRouteNamesMap } = useBreadcrumb()
// console.log('🚀 ~ cachedRouteNamesMap:', cachedRouteNamesMap)

// 定义添加缓存组件name函数，设置的是组件的name
const addRoutes = (route) => {
    // 需要缓存的路由名称数组
    const cachedRouteNames = commonStore().cachedRouteNames
    const routeName = route?.name || ''
    if (route && !cachedRouteNames.includes(routeName)) {
        cachedRouteNames.push(routeName)
    }
}

// 定义删除缓存组件name函数,设置的是组件的name
const deleteRoutes = (route) => {
    if (!route) return false
    const routeName = route?.name || ''
    // 需要缓存的路由名称数组
    const cachedRouteNames = commonStore().cachedRouteNames
    if (routeName && cachedRouteNames.includes(routeName)) {
        const index = cachedRouteNames.findIndex((item) => item == routeName)
        if (index > -1) cachedRouteNames.splice(index, 1)
    }
}

// 判断是否需要缓存目标路由target
const isNeedCacheTarget = (target, relatedRoute) => {
    const targetRoute = target.matched.find((route) => route.path == target.path)
    const cacheWhenFromRoutes = cachedRouteNamesMap.get(targetRoute?.name)
    /**
     * 判断简化为，仅仅只有在对应的cachedRouteNamesMap中可以找到from路由，才需要缓存
     */
    return cacheWhenFromRoutes?.includes(relatedRoute?.name)
}

router.beforeEach(async (to, from, next) => {
    if (!from.name) {
        // 初次进入
        const platformId = getQueryString('platformId')
        const accessToken = getQueryString('access_token')
        if (accessToken) {
            setCookie(G.accessToken, accessToken)
            setCookie(G.platformId, platformId)
            location.href = delParam(['access_token', 'platformId'])
        }

        if (!getCookie(G.accessToken)) {
            clearTokenAndToLogin()
        }
    }

    // 判断页面的路由变化，指定需要判断返回提示的页面的backMethod方法，即可触发消息提示
    const fromPage = breadcrumbs.find((item) => item.name == from.name)
    if (fromPage?.needBackTips && fromPage.needBackTips()) {
        try {
            await messageBox('页面中存在未保存的内容，如果离开，将不会保存！是否继续？', '温馨提示', {
                confirmButtonText: '继续',
                cancelButtonText: '取消'
            })
        } catch (err) {
            throw err
        }
    }

    if (!isNeedCacheTarget(to, from)) {
        const toRoute = to.matched.find((route) => route.path == to.path)
        deleteRoutes(toRoute)
    }

    if (isNeedCacheTarget(from, to)) {
        const fromRoute = from.matched.find((route) => route.path == from.path)
        addRoutes(fromRoute)
    }

    next()
})

router.afterEach((to, from) => {
    setBreadcrumbs(to, from)
})

export default router
