<template>
    <div class="zrx-process-wrap" :style="bgStyle" v-show="visible">
        <div class="zrx-process" :style="style"></div>
    </div>
</template>
<script setup>
defineOptions({ name: 'zrxProcess', inheritAttrs: false })
const defaultOption = {
    duration: 15,
    color: '#405FFE',
    position: 'absolute',
    failedColor: '#F0465A',
    thickness: '3px',
    transition: {
        speed: '0.2s',
        opacity: '0.6s',
        termination: 300
    },
    granularity: 10, // 每秒执行的次数 值越大时间越精确
    location: 'top',
    penetrate: false,
    marginEdage: '0',
    inverse: false,
    autoFinish: true,
    background: 'transparent'
}
const props = defineProps({
    location: String,
    penetrate: {
        type: Boolean,
        default: false
    },
    option: {
        type: Object,
        default() {
            return {}
        }
    },
    show: Boolean
})
const state = reactive({
    canSuccess: true,
    tFailColor: '',
    tColor: '',
    timer: null,
    cut: 0
})
const percent = ref(0)
const options = ref({})
const visible = ref(false)
const setStep = (duration) => {
    const expectation = 100 / (duration * options.value.granularity) // 每次预计增加的百分比值
    const a = Math.ceil(expectation / 0.5)
    return (a * (a + 1)) / (2 * (a - expectation))
}
const start = (duration) => {
    duration = duration === undefined ? options.value.duration : duration
    options.value.duration = duration
    percent.value == 100 && (percent.value = 0)
    visible.value = true
    state.canSuccess = true
    const interval = (1 / options.value.granularity) * 1000 // 每次更新进度条的间隔
    state.cut = setStep(duration) // 在大计算量下，该值期望为0.5
    clearInterval(state.timer)
    state.timer = setInterval(() => {
        increase(state.cut * Math.random())
        if (percent.value > 95 && options.value.autoFinish) {
            finish()
        }
    }, interval)
}
const setOption = (option) => {
    Object.assign(options.value, option)
}
const set = (num) => {
    visible.value = true
    state.canSuccess = true
    percent.value = Math.floor(num)
}
const get = () => {
    return Math.floor(percent.value)
}
const increase = (num) => {
    percent.value = Math.min(99, percent.value + Math.floor(num))
}
const decrease = (num) => {
    percent.value = percent.value - Math.floor(num)
}
const hide = () => {
    clearInterval(state.timer)
    state.timer = null
    return new Promise((resolve) => {
        setTimeout(() => {
            visible.value = false
            if (options.value.autoRevert) {
                setTimeout(() => {
                    percent.value = 0
                }, 100)
                if (options.value.autoRevert) {
                    setTimeout(() => {
                        revert()
                        resolve()
                    }, 300)
                }
            } else {
                setTimeout(() => {
                    percent.value = 0
                    resolve()
                }, 100)
            }
        }, options.value.transition.termination)
    })
}
const pause = () => {
    clearInterval(state.timer)
}
const finish = () => {
    percent.value = 100
    return hide()
}
const fail = () => {
    state.canSuccess = false
    percent.value = 100
    return hide()
}
const setFailColor = (color) => {
    options.value.failedColor = color
}
const setColor = (color) => {
    options.value.color = color
}
const setBackground = (bg) => {
    options.value.background = bg
}
const setLocation = (loc) => {
    options.value.location = loc
}
const setPenetrate = (pen = true) => {
    options.value.penetrate = pen
}
const setTransition = (transition) => {
    options.value.transition = transition
}
const tempFailColor = (color) => {
    state.tFailColor = options.value.failedColor
    options.value.failedColor = color
}
const tempColor = (color) => {
    state.tColor = options.value.color
    options.value.color = color
}
const tempLocation = (loc) => {
    state.tLocation = options.value.location
    options.value.location = loc
}
const tempTransition = (transition) => {
    state.tTransition = options.value.transition
    options.value.transition = transition
}
const revertColor = () => {
    options.value.color = state.tColor
    state.tColor = ''
}
const revertFailColor = () => {
    options.value.failedColor = state.tFailColor
    state.tFailColor = ''
}
const revertLocation = () => {
    options.value.location = state.tLocation
    state.tLocation = ''
}
const revertTransition = () => {
    options.value.transition = state.tTransition
    state.tTransition = {}
}
const revert = () => {
    if (options.value.autoRevert) {
        if (state.tColor) {
            revertColor()
        }
        if (state.tFailColor) {
            revertFailColor()
        }
        if (state.tLocation) {
            revertLocation()
        }
        if (state.tTransition && (state.tTransition.speed !== undefined || state.tTransition.opacity !== undefined)) {
            revertTransition()
        }
    }
}
watch(
    () => props.show,
    async (newv) => {
        if (newv) {
            visible.value = newv
            await nextTick()
            start()
        } else {
            await finish()
            visible.value = newv
        }
    }
)
watch(
    () => props.option,
    (newv) => {
        options.value = JSON.parse(JSON.stringify(Object.assign({}, defaultOption, newv)))
    },
    { deep: true, immediate: true }
)
onMounted(() => {
    if (props.show !== undefined) {
        visible.value = props.show
    }
})
const style = computed(() => {
    const location = props.location || options.value.location
    const style = {
        'background-color': state.canSuccess ? options.value.color : options.value.failedColor,
        opacity: visible.value ? 1 : 0,
        position: options.value.position,
        'border-radius': (options.value.thickness.replace(/px/i, '') - 0) / 2 + 'px'
    }
    if (location == 'top' || location == 'bottom') {
        if (location == 'top') {
            style.top = '0px'
        } else {
            style.bottom = '0px'
        }
        if (!options.value.inverse) {
            style.left = '0px'
        } else {
            style.right = '0px'
        }
        style.width = percent.value + '%'
        style.height = options.value.thickness
        style[`margin-${location}`] = options.value.marginEdage
        style.transition = (visible.value ? 'width ' + options.value.transition.speed + ', ' : '') + 'opacity ' + options.value.transition.opacity
    } else if (location == 'left' || location == 'right') {
        if (location == 'left') {
            style.left = '0px'
        } else {
            style.right = '0px'
        }
        if (!options.value.inverse) {
            style.top = '0px'
        } else {
            style.bottom = '0px'
        }
        style.height = percent.value + '%'
        style.width = options.value.thickness
        style[`margin-${location}`] = options.value.marginEdage
        style.transition = (visible.value ? 'height ' + options.value.transition.speed + ', ' : '') + 'opacity ' + options.value.transition.opacity
    }
    return style
})
const bgStyle = computed(() => {
    let style = `background-color: ${options.value.background}`
    props.penetrate || (options.value.penetrate && (style += 'pointer-events: none;'))
    return style
})
defineExpose({ start, setOption, set, get, increase, decrease, pause, finish, fail, setBackground, setLocation, setPenetrate, setTransition, revert })
</script>
