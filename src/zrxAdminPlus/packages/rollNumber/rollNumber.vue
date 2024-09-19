<template>
    <render />
</template>
<script setup>
import { simplifyNumber, retainDigits, getDigits, convertNumberByString, convertPositiveIntegerByString } from '@/zrxAdminPlus/utils'
defineOptions({
    name: 'zrxRollNumber'
})
const slots = useSlots()
const props = defineProps({
    // 保留几位小数
    retainDecimals: {
        type: [String, Number],
        default: 0
    },
    // 传入的数字
    value: {
        required: true
    },
    // 数字变化持续时间
    duration: {
        type: [Number],
        default: 500,
        validator(val) {
            return val >= 200 || val === 0
        }
    },
    // 是否每三位添加分隔符
    breakSign: {
        type: Boolean,
        default: false
    },
    // 自动添加单位
    addUnit: {
        type: Boolean,
        default: false
    },
    tag: {
        type: String,
        default: 'p'
    },
    initedValue: {
        type: Boolean,
        default: false
    },
    placeholder: {
        type: [String, Number],
        default: '--'
    },
    alwaysDecimal: {
        type: Boolean,
        default: true
    },
    interval: {
        type: [String, Number],
        default: 20
    }
})
const emit = defineEmits(['onFinish'])
const showText = ref('')
const timer = ref(null)
const startNumber = ref(0)
const unit = ref('')
const vmValue = computed(() => {
    if (['string', 'number'].includes(typeof props.value)) {
        let val = props.value
        if (typeof val == 'string') {
            val = val - 0
        }
        return Number.isNaN(val) ? props.placeholder: val
    } else {
        return props.placeholder
    }
})
watch(
    () => vmValue.value,
    (newVal, oldVal) => {
        if (props.duration) {
            startNumber.value = oldVal
            roll()
        } else {
            showNumber(vmValue.value)
        }
    }
)

const roll = () => {
    timer.value && clearInterval(timer.value)
    startNumber.value === props.placeholder && (startNumber.value = 0)
    if (vmValue.value == startNumber.value || vmValue.value === props.placeholder) return (showText.value = vmValue.value)
    const step = retainDigits((vmValue.value - startNumber.value) / (props.duration / vmInterval.value), 2)
    let current = startNumber.value
    timer.value = setInterval(() => {
        if (current == vmValue.value) {
            clearInterval(timer.value)
            emit('onFinish')
            return (timer.value = null)
        }
        if ((current + step - vmValue.value) * (current - vmValue.value) < 0) {
            current = vmValue.value
        } else if (current != vmValue.value) {
            current += step
        }
        showNumber(current)
    }, vmInterval.value)
}

const showNumber = number => {
    if (number === props.placeholder) return (showText.value = number)
    if (props.breakSign) {
        if (vmRetainDecimals.value) {
            const total = retainDigits(number, vmRetainDecimals.value)
            showText.value = (Math.floor(total) + '').replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + ((total + '').match(/\.\d+$/) ?? [''])[0]
        } else {
            showText.value = (Math.round(number) + '').replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
        }
    } else if (props.addUnit) {
        let text = 0
        if (vmRetainDecimals.value) {
            if (getDigits(number) < 5 && !props.alwaysDecimal) {
                text = Math.round(number)
            } else {
                text = retainDigits(number, vmRetainDecimals.value)
            }
        } else {
            text = Math.round(number)
        }
        const res = simplifyNumber(text, vmRetainDecimals.value)
        unit.value = res.unit
        showText.value = unitSlot.value ? res.value : res.value + res.unit
    } else {
        showText.value = vmRetainDecimals.value ? retainDigits(number, vmRetainDecimals.value) : Math.round(number)
    }
}

onBeforeMount(() => {
    props.initedValue && (startNumber.value = vmValue.value)
})

onMounted(() => {
    if (props.duration) {
        roll()
    } else {
        showNumber(vmValue.value)
    }
})

onBeforeUnmount(() => {
    timer.value && clearInterval(timer.value)
})

const render = () => {
    const children = [showText.value]
    slots.unit && children.push(slots.unit({ unit: unit.value }))
    slots.default && children.push(slots.default())
    return h(props.tag, { class: 'zrx-roll-number' }, children)
}

const vmRetainDecimals = computed(() => convertPositiveIntegerByString(props.retainDecimals))

const unitSlot = computed(() => !!(slots.unit || slots.scopedSlots?.unit))

const vmInterval = computed(() => Math.max(20, Math.min(convertNumberByString(props.interval), 100)))
</script>
