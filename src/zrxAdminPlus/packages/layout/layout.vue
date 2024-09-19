<template>
    <el-config-provider :locale="zhCn">
        <div class="zrx-root">
            <div :class="['zrx-root-context', isCollapse && 'is-collapsed']">
                <div class="zrx-left-side">
                    <div :class="['zrx-left-headline', props.subTitle && 'has-sub-title']">
                        <div class="zrx-left-main-title">
                            <!-- <i :class="['zrx-project-icon', props.icon]" v-if="props.icon"></i> -->
                            <slot name="icon"></slot>
                            <transition name="fadeInOut">
                                <span v-show="!isCollapse">{{ props.title }}</span>
                            </transition>
                        </div>
                        <span v-if="props.subTitle && !isCollapse" class="zrx-left-sub-title">{{ props.subTitle }}</span>
                    </div>

                    <div class="zrx-left-menu">
                        <slot name="menu">
                            <el-menu
                                router
                                :collapse="isCollapse"
                                popper-effect="light"
                                :collapse-transition="false"
                                :default-active="props.defaultActive"
                                :class="['el-menu-vertical-demo', isCollapse && 'el-menu--collapse']"
                            >
                                <template v-for="item in props.menu" :key="item.key">
                                    <el-menu-item :index="item.path" v-if="!item.children?.length" @click="onMenuItemClick(item)">
                                        <i class="zrx-menu-icon svg-icon" :style="`--mask-image:url(${item.icon || defaultMenuIcon})`"></i>
                                        <!-- 为了解决el-menu在折叠时候的卡顿问题，直接在折叠时，隐藏title对应的label内容 -->
                                        <template #title v-if="!isCollapse">
                                            {{ item.label }}
                                        </template>
                                    </el-menu-item>
                                    <el-sub-menu v-else :index="item.path || item.key">
                                        <template #title>
                                            <i class="zrx-menu-icon svg-icon" :style="`--mask-image:url(${item.icon || defaultMenuIcon})`"></i>
                                            <span class="zrx-menu-label" :title="item.label" v-if="!isCollapse">{{ item.label }}</span>
                                        </template>
                                        <el-menu-item
                                            :index="menuItem.path"
                                            v-for="menuItem in item.children"
                                            :key="menuItem.key"
                                            @click="onMenuItemClick(menuItem)"
                                        >
                                            <template #title>
                                                <span class="zrx-menu-label" :title="menuItem.label">{{ menuItem.label }}</span>
                                            </template>
                                        </el-menu-item>
                                    </el-sub-menu>
                                </template>
                            </el-menu>
                        </slot>
                    </div>

                    <div class="zrx-left-bottom">
                        <i :class="['svg-icon', isCollapse ? 'zrx-icon-draw-right' : 'zrx-icon-draw-left']" @click="onIconClick"></i>
                    </div>
                </div>
                <div class="zrx-right-side">
                    <div class="zrx-top-nav">
                        <slot name="breadcrumb"></slot>
                    </div>

                    <div class="zrx-floor-context">
                        <slot></slot>
                    </div>
                </div>
            </div>
        </div>
    </el-config-provider>
</template>

<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import defaultMenuIcon from '../../assets/svg-icon/auto-import/user.svg'

defineOptions({ name: 'zrxLayout' })
const emit = defineEmits(['collapse-change', 'menu-item-click'])

const props = defineProps({
    // icon: {
    //     type: String,
    //     default: ''
    // },
    title: {
        type: String,
        default: ''
    },
    subTitle: {
        type: String,
        default: ''
    },
    defaultActive: {
        type: String,
        default: ''
    },
    menu: {
        type: Array,
        default: () => []
    }
})

const isCollapse = ref(false)

const onIconClick = () => {
    isCollapse.value = !isCollapse.value
    emit('collapse-change', isCollapse.value)
}

const onMenuItemClick = (item) => {
    emit('menu-item-click', item)
}

defineExpose({ isCollapse })
</script>
