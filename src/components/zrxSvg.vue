<template>
    <div v-if="isExternal" :style="styleExternalIcon" class="svg-external-icon svg-icon" :class="className" />
    <!-- 即使 aria-hidden="true" 可以阻止内容被辅助技术读取，它并不会影响内容的视觉显示。因此，您可能需要使用CSS来隐藏这些元素（如果适用）。但是，请注意，仅仅使用CSS隐藏元素并不足以确保它们对辅助技术用户是不可见的。 -->
    <svg v-else class="svg-icon" :class="className" aria-hidden="true">
        <use :xlink:href="iconName" />
    </svg>
</template>

<script setup>
import { defineProps, computed } from 'vue'
// defineProps接受父组件传入的对象
const props = defineProps({
    // icon 图标
    icon: {
        type: String,
        required: true
    },
    // 图标类名
    className: {
        type: String,
        default: ''
    }
})

function external(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 判断是否为外部图标
 */
const isExternal = computed(() => external(props.icon))
/**
 * 外部图标样式
 */
/**
 * mask: 是一个 CSS 属性，用于将图像用作元素的遮罩。遮罩定义了
 * 哪些部分应该显示（图像的白色或透明部分），哪些部分应该隐藏
 * （图像的黑色部分）。no-repeat 50% 50% 表示图像不会重复，并且会居中放置。
 */
const styleExternalIcon = computed(() => ({
    mask: `url(${props.icon}) no-repeat 50% 50%`,
    '-webkit-mask': `url(${props.icon}) no-repeat 50% 50%`
}))
/**
 * 项目内图标
 */
const iconName = computed(() => `#icon-${props.icon}`)
</script>

<style scoped>
.svg-icon {
    width: 100%;
    height: 100%;
    fill: currentColor;
    overflow: hidden;
}

.svg-external-icon {
    background-color: currentColor;
    mask-size: cover !important;
    display: inline-block;
}
</style>
