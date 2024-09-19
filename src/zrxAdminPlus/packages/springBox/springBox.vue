<template>
    <div
        class="zrx-spring-box"
        :class="extraClass"
        tabindex="-1"
        :style="`--zrx-spring-box-height: ${realHeight}px;`"
        @keydown.13.capture.stop
        @keyup.13="() => emit('onEnter')"
        ref="containerRef"
    >
        <slot></slot>
    </div>
</template>

<script setup>
import {getPropVal} from '@/zrxAdminPlus/utils'
defineOptions({ name: 'zrxSpringBox' })
const emit = defineEmits(['onToggle', 'onEnter'])
const containerRef = ref(null)
const props = defineProps({
    value: {
        type: Boolean,
        default: true
    },
    collapseHeight: {
        type: [Number, String],
        default: 0
    }
})
const extraClass = ref('')
const realHeight = ref(0)
const endHeight = computed(() => getPropVal(props.collapseHeight))
const onToggle = (v) => {
    if (v) {
        emit('onToggle', v)
        extraClass.value = 'auto-height'
        nextTick(() => {
            const height = containerRef.value.offsetHeight
            extraClass.value = 'heighted'
            setTimeout(() => {
                realHeight.value = height
                extraClass.value = 'trans-start heighted'
            }, 0)
        })
    } else {
        realHeight.value = endHeight.value
        extraClass.value = 'trans-start heighted'
    }
}
const reset = () => {
    const name = extraClass.value
    extraClass.value = 'auto-height'
    nextTick(() => {
        const height = containerRef.value.offsetHeight
        if (height == realHeight.value) {
            return (extraClass.value = name)
        }
        if (props.value) {
            extraClass.value = 'heighted'
            setTimeout(() => {
                realHeight.value = height
                extraClass.value = 'trans-start heighted'
            }, 0)
        }
    })
}
watch(
    () => props.value,
    (newv) => onToggle(newv),
    { immediate: true }
)
onBeforeMount(() => {
    if (!props.value) {
        realHeight.value = endHeight.value
        extraClass.value = 'heighted'
    } else {
        extraClass.value = 'auto-height'
    }
})
defineExpose({ reset })
</script>
