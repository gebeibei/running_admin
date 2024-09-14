<template>
    <zrx-layout :title="projectName" :menu :defaultActive @collapse-change="collapseChange">
        <template #icon>
            <i class="zrx-project-icon"></i>
        </template>
        <template #breadcrumb>
            <div class="f-c-b w-full">
                <el-breadcrumb :separator-icon="ArrowRight">
                    <el-breadcrumb-item
                        v-for="(item, index) in store.breadCrumbList"
                        :key="item.path"
                        @click="onBreadcrumbItemClick(item, index)"
                        :class="getComputedBreadcrumbItemClass(item, index)"
                    >
                        {{ item.label }}
                    </el-breadcrumb-item>
                </el-breadcrumb>

                <div class="f-c">
                    <el-image class="size-28px m-r-12 rd-50%" fit="cover" :src="handleFileUrlOnHttps(store.userInfo?.photo) || portrait">
                        <template #error>
                            <img :src="portrait" alt="" class="size-28px" />
                        </template>
                    </el-image>
                    <span class="c-font op-70">你好，{{ store.userInfo?.name || '未知用户' }}</span>
                    <i class="svg-icon zrx-icon-exit cursor-pointer m-l-8" @click="logout"></i>
                </div>
            </div>
        </template>

        <div class="h-full of-y-auto">
            <router-view v-slot="{ Component, route }" v-if="!isLoading">
                <keep-alive :include="cachedRoutes" :max="G.maxKeepAliveCount">
                    <component :is="Component" :key="route.name"></component>
                </keep-alive>
            </router-view>
        </div>
    </zrx-layout>
</template>

<script setup>
import { G } from '@/config/global'
import { commonStore } from '@/store/commonStore'
import portrait from '@/assets/images/common/headpic.png'
import { messageBox } from '@/utils/message'
import { handleFileUrlOnHttps } from '@/utils/index'
import { apiKeyMap, request } from '@/config/axios'
import { clearTokenAndToLogin, getCookie } from './utils/cookie'

const ArrowRight = () => h('i', { className: 'svg-icon zrx-icon-right-angle-large' })
const isCollapse = ref(false)
provide('isCollapse', isCollapse)
const collapseChange = (v) => {
    isCollapse.value = v
}

const isLoading = ref(false)

const projectName = window?.globalData?.projectName || '企业诉求平台'
const store = commonStore()

const cachedRoutes = computed(() => {
    return store.cachedRouteNames.concat([])
})

const logout = () => {
    messageBox('返回主页')
        .then(() => {
            request({
                method: 'get',
                params: {
                    access_token: getCookie(G.accessToken)
                },
                credentials: false,
                url: apiKeyMap.common.logout
            }).finally(() => {
                clearTokenAndToLogin()
            })
        })
        .catch((err) => err)
}

const route = useRoute()
const router = useRouter()
const defaultActive = ref('')
const { getMenuActivePath, getBreadcrumbQuery } = useBreadcrumb()

const getComputedBreadcrumbItemClass = (item, index) => {
    if (store.breadCrumbList.length == 1) return null

    if (index == store.breadCrumbList.length - 1) return null

    if (!item.path) return 'is-link no-path'

    return 'is-link'
}
const onBreadcrumbItemClick = (row, index) => {
    if (!row.path || index == store.breadCrumbList.length - 1) return

    // 获取参数后跳转
    router.push({
        path: row.path,
        query: getBreadcrumbQuery(row.path)
    })
}

const { menu, toDefaultPage } = useMenu()
menu.value = [
    {
        path: '/overview',
        id: '1',
        menuUrl: 'overview',
        label: '总览',
        icon: 'https://api.iconify.design/material-symbols:overview.svg',
        menuType: '2'
    },
    {
        path: '/records',
        id: '2',
        menuUrl: 'records',
        label: '运动记录',
        icon: 'https://api.iconify.design/ic:twotone-directions-run.svg',
        menuType: '2'
    },
]
defaultActive.value = 'overview'
toDefaultPage(defaultActive.value)
provide('globalMenu', menu)

watch(
    () => route.path,
    () => {
        defaultActive.value = getMenuActivePath(route)
    }
)
</script>

<style scoped lang="scss">
.el-breadcrumb__item.is-link.no-path {
    :deep(.el-breadcrumb__inner) {
        cursor: text !important;
        color: rgba(var(--zrx-breadcrumb-text-color), 0.7);

        &:hover {
            border-bottom: none !important;
        }
    }
}

.zrx-project-icon {
    background-image: url('@/assets/images/common/logo.svg');
}
</style>
