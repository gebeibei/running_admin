// 只存储存在多条路径，或者路径存在超过三层的

//  {
//     name: 'toBeProcessedEdit',
//     label: '处理',
//     needUpdate: false,
//     pathTrack: new Map([
//         ['toBeProcessed', ['toBeProcessed', 'toBeProcessedEdit']],
//         ['appealList', ['overview', 'appealList', 'toBeProcessedEdit']]
//     ])
// }
export const breadcrumbs = [
    {
        name: 'overview',
        label: '总览',
        needUpdate: false,
        pathTrack: ['overview']
    },
    {
        name: 'records',
        label: '运动记录',
        needUpdate: false,
        pathTrack: ['records']
    },
    {
        name: 'recordDetail',
        label: '记录详情',
        needUpdate: false,
        pathTrack: ['records', 'recordDetail']
    },
    {
        name: 'iframeBox',
        label: 'iframeBox',
        needUpdate: false,
        pathTrack: ['iframeBox']
    }
]

const setMapItem = (key, value, _map) => {
    const routes = _map.get(key)

    if (routes) {
        if (!routes.includes(key)) routes.push(value)
    } else {
        _map.set(key, [value])
    }
}

/**
 * @description 构建cacheWhenFromRoutes
 * @returns { Map<string, Array<string>> }
 */
export const buildRoutesMap = () => {
    const routesMap = new Map()

    breadcrumbs.forEach((item) => {
        const { pathTrack, name } = item

        if (Array.isArray(pathTrack)) {
            // 类型为数组

            if (pathTrack.length > 1) {
                pathTrack
                    .filter((route) => route !== name)
                    .forEach((route) => {
                        setMapItem(route, name, routesMap)
                    })
            }
        } else {
            // 类型为map
            pathTrack.forEach((routes) => {
                routes
                    .filter((route) => route !== name)
                    .forEach((route) => {
                        setMapItem(route, name, routesMap)
                    })
            })
        }
    })

    return routesMap
}
