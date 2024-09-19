<template>
    <div :class="computedClass" :style="{ '--zrx-status-bg-color': props.color || null }">
        <span><slot></slot></span>
    </div>
</template>

<script setup>
// @ts-ignore
defineOptions({ name: 'zrxStatus' })

const props = defineProps({
    /** @type { 'error' | 'success' | 'primary' | 'warning' | 'disabled' | 'danger' } */
    // @ts-ignore
    type: {
        type: String,
        default: ''
    },
    color: {
        type: String,
        default: ''
    }
})

const computedClass = computed(() => {
    return {
        'zrx-status': true,
        [`zrx-status__${props.type}`]: Boolean(props.type),
        [`zrx-status__custom`]: Boolean(props.color)
    }
})
</script>
