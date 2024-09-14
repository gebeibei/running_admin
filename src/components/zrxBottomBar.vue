<template>
    <div
        :class="[
            'h-56 f-c p-x-16 fixed bottom-0 bg-white z-10 b-t-1 b-t-solid b-t-border',
            isCollapse ? 'left-48px calc-w-48' : 'left-200px calc-w-200',
            'transition-left transition-width transition-duration-2000'
        ]"
    >
        <slot></slot>
    </div>
</template>

<script setup>
defineOptions({ name: 'zrxBottomBar' })

const isCollapse = inject('isCollapse')
</script>
