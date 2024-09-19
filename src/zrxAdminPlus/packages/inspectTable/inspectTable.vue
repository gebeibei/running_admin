<template>
    <div class="zrx-inspect-table" :style="computefCssVar">
        <div :class="['zrx-inspect-table-td', item.extraClass]" v-for="(item, index) in props.data" :key="index">
            <div :class="['zrx-inspect-table-td__label', item.required && 'is-required', props.labelClass]">
                <slot name="label" :row="item">{{ item.label }}</slot>
            </div>

            <div class="zrx-inspect-table-td__value text-ellipsis" v-if="item.showTooltip" :title="item.value">
                <slot :row="item">{{ item.value }}</slot>
            </div>

            <div class="zrx-inspect-table-td__value" v-else>
                <slot :row="item">{{ item.value }}</slot>
            </div>
        </div>
    </div>
</template>

<script setup>
defineOptions({
    name: 'zrxInspectTable'
})

const props = defineProps({
    /** @type { Array<{ label: string; value: unknown; reqiured?: boolean; extraClass?: string, showTooltip?: boolean }> } */
    data: {
        type: Array,
        default: () => []
    },
    columns: {
        type: Number,
        default: 2
    },
    labelWidth: {
        type: Number,
        default: 144
    },
    labelClass: {
        type: String,
        default: ''
    }
})

const computefCssVar = computed(() => {
    return `--zrx-inspect-table-cols: ${props.columns};--zrx-inspect-table-label-width: ${props.labelWidth}px;`
})
</script>

<style scoped lang="scss"></style>
