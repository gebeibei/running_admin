<template>
    <el-pagination ref="paginationRef" v-bind="attrs" :total="total" v-model:page-size="pageSize" v-model:current-page="pageNum" :layout="layout">
        <slot v-if="layout.includes('slot')">
            <template v-if="layout.includes('->, prev, next, slot')">
                <!-- 首页 -->
                <i :class="['svg-icon zrx-icon-angle-line-left', pageNum === 1 && 'is-disabled']" @click="onFirst"></i>
                <!-- 尾页 -->
                <i :class="['svg-icon zrx-icon-angle-line-right', pageNum == maxPageCount && 'is-disabled']" @click="onLast"></i>
            </template>

            <el-input-number @change="onChange" :controls="false" :min="1" v-model="inputNumberVal" class="zrx-pagination-input"></el-input-number>
            <span class="zrx-pagination-total-text"> /{{ maxPageCount }}</span>
            <div class="zrx-pagination-jumper-btn el-button el-button--default" @click="onJump">跳转</div>
        </slot>
    </el-pagination>
</template>

<script setup>
import { computed, useAttrs } from 'vue'

defineOptions({ name: 'zrxPagination', inheritAttrs: false })

const paginationRef = ref()
const pageNum = defineModel('currentPage', {
    type: Number,
    default: 1
})

const pageSize = defineModel('pageSize', {
    type: Number,
    default: 10
})

const props = defineProps({
    total: {
        type: Number,
        default: 0
    },
    layout: {
        type: String,
        default: 'total, sizes, ->, prev, pager, next, slot'
    }
})

const inputNumberVal = ref(1)

const maxPageCount = computed(() => {
    return Math.max(1, Math.ceil(props.total / pageSize.value))
})

const attrs = useAttrs()

const onChange = (/** @type {number} */ val) => {
    // 取输入的数字和最大页码的最小值
    inputNumberVal.value = Math.trunc(+val)
}

watch(pageNum, onChange)

const onJump = () => {
    pageNum.value = Math.min(inputNumberVal.value, maxPageCount.value)

    // 如果输入的页码变化了（超过最大页码），但是pageNum没变化，直接手动赋值
    if (inputNumberVal.value != pageNum.value) {
        inputNumberVal.value = pageNum.value
    }
}

const onFirst = () => {
    if (pageNum.value == 1) return
    pageNum.value = 1
}

const onLast = () => {
    if (pageNum.value == maxPageCount.value) return
    pageNum.value = maxPageCount.value
}

defineExpose({ paginationRef })
</script>
