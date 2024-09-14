<template>
    <div class="bg-white zrx-common-shadow zrx-flow-list p-t-16 p-b-32 rd-2px flex-col">
        <div class="m-b-16 p-x-16 f-c-b shrink-0">
            <slot name="title">
                <span class="f-16 font-bold lh-40px">{{ title }}</span>
            </slot>
            <i
                v-if="computedFlows.length"
                @click="isReversed = !isReversed"
                :class="['svg-icon cursor-pointer', isReversed ? 'zrx-icon-sort-asc' : 'zrx-icon-sort-desc']"
            ></i>
        </div>

        <div class="h-10 flex-auto of-y-auto p-x-16">
            <div v-for="item in computedFlows" :key="item[props.rowKey]" class="zrx-flow-list-row flex relative">
                <div class="w-1 calc-h-11 bg-border absolute left-5px top-17px"></div>
                <div class="zrx-flow-list-row-left m-r-6 w-11 shrink-0 flex-col h-full relative f-c">
                    <i class="size-7px rd-50% bg-black bg-op-20 m-t-8"></i>
                </div>

                <div class="zrx-flow-list-row-right w-10 flex-auto p-b-20">
                    <div class="f-c-b m-b-4">
                        <zrx-tooltip :content="!mode ? item.nodeType : item.handlerTime " class="w-10 flex-auto" inner-class="font-bold f-16 lh-24px"></zrx-tooltip>

                        <i
                            v-if="item.collapsible"
                            @click="onCollapsed(item)"
                            :class="['m-l-16 svg-icon cursor-pointer zrx-icon-angles-down-large transition-all', item.isCollapsed && 'rotate-z-180']"
                        ></i>
                    </div>

                    <div class="f-c-b p-r-50">
                        <zrx-tooltip class="c-font bg-op-90 w-10 flex-auto" :content="item.handlerInfo"></zrx-tooltip>

                        <el-tooltip :content="item.contactPhones" placement="top" :disabled="Boolean(!item.contactPhones)">
                            <i class="svg-icon zrx-icon-telephone cursor-pointer shrink-0" important="bg-font bg-op-70"></i>
                        </el-tooltip>
                    </div>
                    <div class="m-t-4 c-font bg-op-70 m-b-8" v-if="!mode">{{ item.handlerTime }}</div>
                    <slot :row="item" v-if="!item.isCollapsed"></slot>

                    <div class="h-1 bg-border" v-if="!item.collapsible || item.isCollapsed"></div>
                </div>
            </div>
            <zrx-empty-state v-if="!computedFlows.length"></zrx-empty-state>
        </div>
    </div>
</template>

<script setup>
import lodash from 'lodash'
import { formatDate } from '@/utils/index'

const props = defineProps({
    rowKey: {
        type: String,
        default: 'id'
    },
    data: {
        type: Array,
        default: () => []
    },
    title: {
        type: String,
        default: '流转记录'
    },
    mode: {
        // 取值无特定含义 0代表流转记录 1代表催办记录
        type: Number,
        default: 0,
        validator(val) {
            return [0, 1].includes(val)
        }
    }
})

const isReversed = defineModel('isReversed', { default: false })

/** 记录展开的节点 */
const expandIds = ref([])

const onCollapsed = (item) => {
    item.isCollapsed = !item.isCollapsed

    if (!item.isCollapsed) {
        expandIds.value.push(item.id)
    } else {
        const idx = expandIds.value.findIndex((id) => item.id === id)

        expandIds.value.splice(idx, 1)
    }
}
const computedFlows = computed(() => {
    const temp = lodash.cloneDeep(props.data).map((item) => {
        return reactive({
            ...item,
            id: item.handlerTime,
            handlerTime: formatDate(item.handlerTime),
            handlerInfo: `${item.handlerName || ''}（${item.departmentName || ''}）`,
            isCollapsed: expandIds.value.includes(item.handlerTime) ? false : item.isCollapsed
        })
    })
    return !isReversed.value ? temp : temp.reverse()
})
</script>
