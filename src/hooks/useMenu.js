import { G } from '@/config/global'
import { request } from '@/config/axios'
import { apiKeyMap } from '@/config/apiKeyMap'
import { clearTokenAndToLogin, getCookie } from '@/utils/cookie'
import { breadcrumbs } from '@/config/breadcrumb'
import { handleFileUrlOnHttps } from '@/utils'

const menuItemMap = new Map()
export const useMenu = () => {
    const menu = ref([])
    const authority = reactive({})
    const route = useRoute()
    const router = useRouter()
    // 如果当前项不在menuItemMap中，则不可以跳转

    const defaultActive = ref('')

    const _handleMenu = (list) => {
        return list.map((item) => {
            if (item.children || Array.isArray(item.children)) {
                const children = _sortBy(item.children)
                return {
                    id: item.id,
                    label: item.menuName,
                    icon: _handleIcon(item),
                    menuType: item.menuType,
                    children: _handleMenu(children),
                    path: item.authoritySign + item.sort
                }
            }

            const path = item.menuUrl?.includes('http') ? `/iframeBox?_k=${item.id}` : item.menuUrl

            menuItemMap.set(path, item)
            return {
                path: path,
                id: item.id,
                menuUrl: item.menuUrl,
                label: item.menuName,
                icon: _handleIcon(item),
                menuType: item.menuType
            }
        })
    }

    const getMenuMap = () => menuItemMap

    const _handleIcon = (item) => {
        if (item.icon) return handleFileUrlOnHttps(item.icon)

        return ''
    }

    const _sortBy = (list, key = 'sort') => {
        if (!list || list.length == 0) return []

        return list.sort((a, b) => {
            return a[key].split('-').at(-1) - b[key].split('-').at(-1)
        })
    }

    /** 获取应用的权限列表 */
    const getAuthority = async () => {
        return await request({
            method: 'get',
            params: {
                platId: getCookie(G.platformId)
            },
            url: apiKeyMap.common.auth
        }).then((res) => {
            if (res.data.status == 200) {
                const data = res.data.data || {}

                for (const key in data) {
                    authority[key] = data[key]
                }
            }
        })
    }

    const getMenuList = async () => {
        return await request({
            method: 'get',
            url: apiKeyMap.common.menuList,
            params: {
                platformId: getCookie(G.platformId)
            }
        }).then((res) => {
            if (res.data.status == 200) {
                const { list = [], homePage = {} } = res.data.data || {}
                menu.value = _handleMenu(list)
                const currentRouteName = router.currentRoute.value.name
                // 跳转指定首页
                if (menu.value.length && !breadcrumbs.find((item) => item.name === currentRouteName)) {
                    if (homePage.state === '1') {
                        router.push(homePage.menuUrl)
                    } else {
                        router.push(menu.value[0].path)
                    }
                }
            }
        })
    }

    const getStaticMenu = () => {
        menu.value = []
    }

    // 判断路由是否可以跳转
    const judgeCanGo = (route) => {
        const routeInfo = breadcrumbs.find((item) => item.name === route.name)
        const menuItem = routeInfo.pathTrack[0]

        return Boolean(menuItemMap.get(menuItem))
    }

    /** 跳转默认首页 */
    const toDefaultPage = (menuUrl) => {
        setTimeout(() => {
            const currentRouteName = router.currentRoute.value.name
            if (menu.value.length && !breadcrumbs.find((item) => item.name === currentRouteName)) {
                router.push(menuUrl)
            }
        }, 100)
    }

    watch(
        () => route,
        (_route) => {
            if (!judgeCanGo(_route)) clearTokenAndToLogin()
        }
    )

    return {
        menu,
        authority,
        defaultActive,
        judgeCanGo,
        getAuthority,
        getMenuList,
        getMenuMap,
        getStaticMenu,
        toDefaultPage
    }
}
