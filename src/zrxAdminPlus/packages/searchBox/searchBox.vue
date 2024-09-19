<template>
    <div
        tabindex="-1"
        ref="containerRef"
        @keydown.13.capture.stop
        @keyup.13="emit('onEnter')"
        :style="computedCssVar"
        :class="['zrx-search-box', extraClass, 'col-' + columns]"
    >
        <slot></slot>
        <div class="secondary-btns" v-if="showBtns">
            <slot name="btn">
                <el-button @click="emit('search')" type="primary">{{ searchText }}</el-button>
                <el-button @click="emit('reset')">{{ resetText }}</el-button>
            </slot>
            <a @click="onToggle" v-if="showToggle">
                <i :class="['zrx-icon-draw-hook', stretched && 'is-reversed']">
                    <i></i>
                    <i></i>
                </i>
            </a>
        </div>
    </div>
</template>

<script setup>
import { getPropVal } from '@/zrxAdminPlus/utils'
defineOptions({ name: 'zrxSearchBox' })
const emit = defineEmits(['onEnter', 'transitionend', 'change', 'search', 'reset'])

const defaultPaddingX = 16
const defaultMinInputWidth = 270
const defaultColumnGap = 32
const defaultRowGap = 24
const defaultLabelWidth = 88
const defaultRowHeight = 32

const props = defineProps({
    searchText: {
        type: String,
        default: '查 询'
    },
    resetText: {
        type: String,
        default: '重 置'
    },
    showBtns: {
        type: Boolean,
        default: true
    },
    initialExpand: {
        type: Boolean,
        default: false
    },
    paddingX: {
        type: [String, Number],
        default: defaultPaddingX
    },
    labelWidth: {
        type: [String, Number],
        default: defaultLabelWidth
    },
    rowHeight: {
        type: [String, Number],
        default: defaultRowHeight
    },
    minInputWidth: {
        type: [String, Number],
        default: defaultMinInputWidth
    },
    columnGap: {
        type: [String, Number],
        default: defaultColumnGap
    },
    rowGap: {
        type: [String, Number],
        default: defaultRowGap
    },
    preventDefaultToggle: {
        type: Boolean,
        default: false
    },
    showToggler: {
        type: Boolean,
        default: true
    }
})

const stretched = ref(props.initialExpand)
const totalHeight = ref(0)
const extraClass = ref('')
const columns = ref(0)
const childNodes = ref(0)
const containerRef = ref()
let mObserver = null
let rObserver = null

const minWidth = computed(() => getPropVal(props.minInputWidth, defaultMinInputWidth))
const gapX = computed(() => getPropVal(props.columnGap, defaultColumnGap))
const padding = computed(() => getPropVal(props.paddingX, defaultPaddingX))
const thresholds = computed(() => {
    const getClientWidth = (n) => minWidth.value * n + gapX.value * (n - 1) + padding.value
    return [getClientWidth(3), getClientWidth(4)]
})
const showToggle = computed(() => {
    return props.preventDefaultToggle ? props.showToggler : totalHeight.value > props.rowHeight && props.showToggler
})

const computedCssVar = computed(() => {
    return {
        '--zrx-search-row-height': getPropVal(props.rowHeight, defaultRowHeight) + 'px',
        '--zrx-search-gap-col': gapX.value + 'px',
        '--zrx-search-padding-x': props.paddingX + 'px',
        '--zrx-search-total-height': totalHeight.value + 'px',
        '--zrx-search-gap-row': getPropVal(props.rowGap, defaultRowGap) + 'px',
        '--zrx-search-label-width': getPropVal(props.labelWidth, defaultLabelWidth) + 'px'
    }
})

const init = async () => {
    childNodes.value = containerRef.value.childElementCount
    if (props.preventDefaultToggle) {
        extraClass.value = 'auto-height visible'
        return attachSimplifiedObserver()
    }
    await attachObserver()
    extraClass.value = 'auto-height'
    nextTick(() => {
        totalHeight.value = containerRef.value.offsetHeight
        extraClass.value = ''
        if (props.initialExpand) {
            setTimeout(() => (extraClass.value = 'trans-start heighted'), 0)
        }
    })
}

const resetWhenChildChange = (expand) => {
    childNodes.value = containerRef.value.childElementCount
    extraClass.value = 'auto-height'
    nextTick(() => {
        const height = containerRef.value.offsetHeight
        if (stretched.value) {
            extraClass.value = 'heighted'
            setTimeout(() => {
                totalHeight.value = height
                extraClass.value = 'trans-start heighted'
            }, 0)
        } else {
            totalHeight.value = height
            extraClass.value = ''
            if (expand && totalHeight.value > props.rowHeight) {
                onToggle()
            }
        }
    })
}

const setColumns = () => {
    if (childNodes.value) {
        const w = containerRef.value.offsetWidth
        if (w < thresholds.value[0] && columns.value != 2) {
            return (columns.value = 2)
        }
        if (w >= thresholds.value[0] && w < thresholds.value[1] && columns.value != 3) {
            return (columns.value = 3)
        }
        if (w >= thresholds.value[1] && columns.value != 4) {
            return (columns.value = 4)
        }
    }
}

const attachObserver = () => {
    mObserver = new MutationObserver(resetWhenChildChange)
    mObserver.observe(containerRef.value, {
        childList: true,
        attributes: false
    })
    // 等到@container（容器查询）实现，就不用ResizeObserver了
    let width = containerRef.value.offsetWidth
    rObserver = new ResizeObserver((entries) => {
        if (containerRef.value.offsetWidth == width) return
        setColumns()
        if (stretched.value) {
            resetWhenChildChange()
        } else {
            extraClass.value = 'auto-height'
            nextTick(() => {
                totalHeight.value = containerRef.value.offsetHeight
                extraClass.value = ''
            })
        }
        width = containerRef.value.offsetWidth
    })
    setColumns()
    rObserver.observe(containerRef.value)
    containerRef.value.addEventListener('transitionend', (evt) => {
        if (evt.srcElement == containerRef.value) {
            emit('transitionend', { stretched: stretched.value, height: containerRef.value.clientHeight }, evt)
        }
    })
    return Promise.resolve()
}

const attachSimplifiedObserver = () => {
    mObserver = new MutationObserver(() => {
        childNodes.value = containerRef.value.childElementCount
        setColumns()
    })
    mObserver.observe(containerRef.value, {
        childList: true,
        attributes: false
    })
    setColumns()
}

const onToggle = () => {
    stretched.value = !stretched.value
    emit('change', stretched.value)
    if (props.preventDefaultToggle) return false
    if (stretched.value) {
        extraClass.value = 'auto-height'
        nextTick(() => {
            const height = containerRef.value?.offsetHeight
            extraClass.value = ''
            setTimeout(() => {
                totalHeight.value = height
                extraClass.value = 'trans-start heighted'
            }, 0)
        })
    } else {
        extraClass.value = 'trans-start'
    }
}

const focus = () => containerRef.value?.focus()

onMounted(init)

onBeforeUnmount(() => {
    mObserver?.disconnect()
    rObserver?.disconnect()
})

defineExpose({
    focus,
    resetWhenChildChange
})
</script>
