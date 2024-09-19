<template>
    <el-tree-select v-bind="attrs" ref="treeSelectRef">
        <template #header v-if="showSearch">
            <el-input v-model="filterText" :placeholder="searchPlaceholder" @keydown.enter="handleSearch">
                <template #suffix>
                    <i class="svg-icon zrx-icon-search cursor-pointer" @click="handleSearch"></i>
                </template>
            </el-input>
        </template>
    </el-tree-select>
</template>

<script setup>
import { useAttrs, ref } from 'vue'

defineOptions({ name: 'zrxTreeSelect', inheritAttrs: false })
const props = defineProps({
    showSearch: {
        type: Boolean,
        default: true
    },
    searchPlaceholder: {
        type: String,
        default: '请输入'
    }
})

const treeSelectRef = ref()
const attrs = useAttrs()
const filterText = ref('')
const handleSearch = () => {
    treeSelectRef.value?.filter(filterText.value)
}

defineExpose({ treeSelectRef })
</script>
