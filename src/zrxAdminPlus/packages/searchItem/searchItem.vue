<template>
    <div class="zrx-search-item">
        <slot name="label">
            <label class="label">{{ label }}</label>
        </slot>
        <slot></slot>
    </div>
</template>

<script setup>
defineOptions({ name: 'zrxSearchItem' })

const props = defineProps({
    label: {
        type: String,
        default: ''
    }
})
</script>
