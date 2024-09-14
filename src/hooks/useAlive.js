import { breadcrumbs } from '@/config/breadcrumb'
import { hasLength, getFromRouteName } from '@/utils'

/** 简化关于keepAlive相关的方法 */
export const useAlive = () => {
    const route = useRoute()

    const setNeedUpdate = (routes, name, value) => {
        routes.forEach((route) => {
            if (route === name) return

            const target = breadcrumbs.find((item) => item.name == route)

            if (target) target.needUpdate = value
        })
    }

    /**
     * @description 设置返回列表是否需要更新
     * @param { Boolean | 'add' | 'edit' | 'publish' } value 默认为true 
     */
    const setActivated = (value = true) => {
        const name = route.name
        const currentPageInfo = breadcrumbs.find((item) => item.name == name)
        if (currentPageInfo) {
            if (Array.isArray(currentPageInfo.pathTrack)) {
                setNeedUpdate(currentPageInfo.pathTrack, name, value)
            } else {
                // 为map类型的公用页面，此时根据sessionage中存储的form的route，将对应的链路上的routes的needUpdate变更
                const targetRoutes = currentPageInfo.pathTrack.get(getFromRouteName())

                if (hasLength(targetRoutes)) {
                    setNeedUpdate(targetRoutes, name, value)
                } else {
                    // 否则将所有链路都更新
                    currentPageInfo.pathTrack.forEach((routes) => {
                        setNeedUpdate(routes, name, value)
                    })
                }
            }
        }
    }

    /**
     * @description onActivated生命周期，如果breadcrumbs中对应对象的needUpdate为true，则执行重新请求，不使用缓存
     * @param { function ('add' | 'edit' | 'publish' | Boolean): void } cb 不使用缓存时候的回调方法
     * @date 2023-01-05
     */
    const onAlive = (cb = () => {}) => {
        onActivated(() => {
            const name = route.name
            const currentPageInfo = breadcrumbs.find((item) => item.name == name)
            const msg = currentPageInfo.needUpdate
            if (!msg) return

            currentPageInfo.needUpdate = false
            cb(msg)
        })
    }

    return {
        onAlive,
        setActivated
    }
}
