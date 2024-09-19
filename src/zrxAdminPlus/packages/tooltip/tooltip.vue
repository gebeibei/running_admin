<template>
    <div ref="tooltipRef">
        <el-tooltip placement="top" :disabled="disabled" :content="content + ''">
            <template #content>
                <div class="zrx-tooltip-content">{{ content }}</div>
            </template>
            <slot :isExceed="disabled">
                <div :class="[lines === 1 ? 'text-ellipsis' : `line-clamp-more`, innerClass]" :style="`--zrx-line-clamp: ${lines};`">
                    {{ content }}
                </div>
            </slot>
        </el-tooltip>
    </div>
</template>

<script setup>
defineOptions({ name: 'zrxTooltip' })

const props = defineProps({
    content: {
        type: [String, Number, Date],
        default: ''
    },
    innerClass: {
        type: String,
        default: ''
    },
    // 是否单行
    lines: {
        type: Number,
        default: 1
    }
})

const disabled = ref(true)
const timer = ref(null)
const tooltipRef = ref()

const getStyle = (dom, attr) => getComputedStyle(dom, null)[attr]

const judgeWidth = () => {
    if (!props.content) return

    disabled.value = true

    const cellChild = tooltipRef.value?.children[0]
    if (!cellChild) return

    // range 表示文档的一个区域
    const range = document.createRange()
    range.setStart(cellChild, 0)
    range.setEnd(cellChild, cellChild.childNodes.length)

    let dValue = 0
    const flag = getStyle(cellChild, '-webkit-line-clamp')
    if (flag == 'none') {
        // rangeWidth 表示元素内容的宽度
        const rangeWidth = range.getBoundingClientRect().width
        const padding = (parseInt(getStyle(cellChild, 'paddingLeft')) || 0) + (parseInt(getStyle(cellChild, 'paddingRight')) || 0)

        // cellChild.offsetWidth 表示选定区域的宽度
        dValue = rangeWidth - (cellChild.offsetWidth - padding)
    } else {
        // rangeHeight 表示元素内容的高度
        const rangeHeight = range.getBoundingClientRect().height
        const padding = (parseInt(getStyle(cellChild, 'paddingTop')) || 0) + (parseInt(getStyle(cellChild, 'paddingBottom')) || 0)

        // cellChild.offsetHeight 表示选定区域的高度
        dValue = rangeHeight - (cellChild.offsetHeight - padding)
    }

    // ！！！原本差值大于0，则不提示，导致部分未出现省略号的情况会触发提示，现在添加1px来避免此类情况
    if (dValue > 1) disabled.value = false
}

watch(
    () => props.content,
    () => {
        nextTick(judgeWidth)
    },
    { immediate: true }
)

onMounted(() => {
    window.addEventListener('resize', () => {
        timer.value && clearTimeout(timer.value)
        timer.value = setTimeout(() => {
            nextTick(() => {
                judgeWidth()
                clearTimeout(timer.value)
            })
        }, 500)
    })
})
</script>
