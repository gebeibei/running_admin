<template>
    <el-dropdown
        v-bind="attrs"
        :disabled="disabled"
        placement="bottom-start"
        @visible-change="onVisibleChange"
        :class="{ 'popup-visible': isPopupVisible }"
    >
        <slot>
            <el-button :disabled="disabled">
                {{ btnText }}
                <span :class="['svg-icon zrx-icon-down-angle', disabled && 'important:(bg-font bg-op-30)']"></span>
            </el-button>
        </slot>

        <template #dropdown>
            <slot name="dropdown"></slot>
        </template>
    </el-dropdown>
</template>

<script setup>
defineOptions({ name: 'zrxDropdown' })

const props = defineProps({
    btnText: {
        type: String,
        default: ''
    },
    disabled: {
        type: Boolean,
        default: false
    }
})
const attrs = useAttrs()
const isPopupVisible = ref(false)

const onVisibleChange = (visible) => {
    isPopupVisible.value = visible
}
</script>

<style scoped lang="scss">
.el-dropdown {
    &:hover:not(.is-disabled),
    &.popup-visible:not(.is-disabled) {
        :deep(.zrx-icon-down-angle) {
            transform: rotate(180deg);
            transition: all 150ms;
        }
    }
}
</style>
