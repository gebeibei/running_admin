<template>
    <el-select
        remote
        remote-show-suffix
        :filterable
        :placeholder
        v-bind="attrs"
        v-model="mValue"
        ref="selectRef"
        :remote-method="getData"
        @visible-change="visibleChange"
    >
        <template #header v-if="slots.header">
            <slot name="header"></slot>
        </template>

        <el-option
            v-for="item in options"
            :key="item[props.props.value]"
            :label="item[props.props.label]"
            :value="item[props.props.value]"
        ></el-option>

        <template #footer v-if="slots.footer">
            <slot name="footer"></slot>
        </template>
    </el-select>
</template>

<script setup>
import lodash from 'lodash'

const searchKeyword = ref()
// 滚动的容器元素
let scrollWrapDom = null

// 添加 加载中，分页时候会导致页面闪烁，暂时去掉
const loading = ref(false)
// select-options 数据源
const options = ref([])
// 分页控制
let pageNum = 1
let toLastPage = false
const selectRef = ref()

const slots = useSlots()

let currentLabel = null
const mValue = defineModel({ type: String, default: '' })

const attrs = useAttrs()
const props = defineProps({
    placeholder: '请选择',
    filterable: {
        type: Boolean,
        default: false
    },
    pageSize: {
        type: Number,
        default: 100
    },
    /** 入参是{ pageNum, pageSize, keyword } */
    loadData: {
        type: Function,
        default: () => {}
    },
    props: {
        type: Object,
        default: () => {
            return {
                label: 'label',
                value: 'value'
            }
        }
    }
})

let requestData = null
const volidDataIsEqual = (keyword) => lodash.isEqual(requestData, { pageNum: pageNum, pageSize: props.pageSize, keyword: keyword })

const hasAddEventListener = ref(false)

const addEventListener = () => {
    if (!hasAddEventListener.value) {
        /* 在数据渲染完之后的回调 */
        /* 初始化滚动监听 （由于 dom 渲染未完成，所以需要开启一个 timeout 在 1s 后实现监听） */
        scrollWrapDom = selectRef.value.scrollbarRef.wrapRef
        setTimeout(() => {
            hasAddEventListener.value = true
            if (scrollWrapDom.querySelector('.el-scrollbar__view.el-select-dropdown__list')?.children?.length) {
                scrollWrapDom.addEventListener('scroll', scrollAddEventFn, false)
            }
        }, 100)
    }
}

/**
 * @param {string} keyword 输入的搜索关键词
 */
const getData = (keyword) => {
    // 请求参数未变化，并且存在数据，则不请求
    if (volidDataIsEqual(keyword) && options.value.length) {
        addEventListener()
        return
    }

    loading.value = true
    if (keyword !== searchKeyword.value) {
        pageNum = 1
        options.value = []
    }

    searchKeyword.value = keyword
    requestData = lodash.cloneDeep({ pageNum: pageNum, pageSize: props.pageSize, keyword: keyword })

    props
        .loadData({ pageNum: pageNum, pageSize: props.pageSize, keyword: keyword })
        .then((res) => {
            const { list, isLastPage } = res.data?.data || { list: [], isLastPage: true }

            toLastPage = isLastPage
            options.value.push(...list)

            addEventListener()
        })
        .finally(() => {
            loading.value = false
        })
}

/* 滚动监听函数 */
const scrollAddEventFn = lodash.debounce((e) => {
    const self = e.target

    if (self.scrollHeight - self.scrollTop <= self.clientHeight && !toLastPage) {
        pageNum++
        getData(searchKeyword.value)
    }
}, 100)

const reset = () => {
    toLastPage = false
    requestData = null
    pageNum = 1
    options.value = []
}

const visibleChange = (isShow) => {
    if (!isShow) {
        hasAddEventListener.value = false
        // 移除滚动监听
        scrollWrapDom?.removeEventListener('scroll', scrollAddEventFn, false)
        // options.value = []

        // 当编辑时候，因为是直接设置span标签的文本来回显label的，若输入关键词搜索后，此时会重新显示id，所以重新setCurrentLabel
        if (mValue.value === selectRef.value.states.selected.currentLabel && currentLabel) {
            nextTick(() => {
                setCurrentLabel(currentLabel)
            })
        } else {
            currentLabel = null
        }
    }
}

/**
 * @description 回显设置
 * @param { String } label 设置回显的label
 * @date 2024-05-09
 */
const setCurrentLabel = (label) => {
    const spanNode = selectRef.value.$el?.querySelector('.el-select__selected-item.el-select__placeholder span')
    if (spanNode && label) {
        currentLabel = label
        nextTick(() => {
            spanNode.innerText = label
        })
    }
}

defineExpose({ reset, getData, setCurrentLabel })
</script>
