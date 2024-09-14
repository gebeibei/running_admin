export const routes = [
    {
        path: '/',
        name: 'Home',
        children: [
            {
                path: '/overview',
                name: 'overview',
                component: () => import('@/views/overview/index.vue')
            },
            {
                path: '/records',
                name: 'records',
                component: () => import('@/views/records/index.vue')
            },
            {
                path: '/recordDetail',
                name:'recordDetail',
                component: () => import('@/views/records/detail.vue')
            },
        ]
    }
]
