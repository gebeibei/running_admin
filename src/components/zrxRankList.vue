<template>
    <div class="zrx-rank-list flex-col gap-row-6px">
        <div :class="['zrx-rank-list__item']" v-for="(item, idx) in props.data" :key="item.label + idx">
            <div class="zrx-rank-list__item-top f-c-c lh-24px">
                <slot :row="item" :index="idx">
                    <div class="shrink-0 m-r-8 c-font bg-op-70 f-14">{{ `${idx + 1}`.padStart(2, '0') }}</div>

                    <zrx-tooltip class="w-10 flex-auto" inner-class="c-font f-14" :content="item.label"></zrx-tooltip>

                    <div class="shrink-0 w-150 justify-end f-c">
                        <zrx-roll-number
                            :value="item.value"
                            v-if="props.useRollNumber"
                            v-bind="props.rollNumberConfig"
                            class="f-14 c-font bg-op-90 font-bold"
                        ></zrx-roll-number>

                        <span v-else class="f-14 c-font bg-op-90 font-bold">{{ item.value }}</span>

                        <span class="f-12 c-font bg-op-90" v-if="item.unit">{{ item.unit }}</span>
                    </div>
                </slot>
            </div>

            <div class="zrx-rank-list__item-bot m-t-8 rd-2px h-8" :style="`background: ${props.outerColor};`">
                <div
                    :class="['h-full rd-2px']"
                    :style="`background: ${props.activeCount >= idx + 1 ? props.activeColor : props.normalColor}; width: ${
                        (item.value / total) * 100
                    }%`"
                ></div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    /** 最大数值所占百分比，默认为80% */
    maxPercent: {
        type: Number,
        default: 0.8
    },
    /** 需要高亮显示的个数 */
    activeCount: {
        type: Number,
        default: 3
    },
    /** @type { Array<{ label: string; value: string, unit: string }> } */
    data: {
        type: Array,
        default: () => []
    },
    /** 右侧数值展示是否使用数字滚动 */
    useRollNumber: {
        type: Boolean,
        default: true
    },
    /** 关于数字滚动的配置 */
    rollNumberConfig: {
        type: Object,
        default: () => ({})
    },
    activeColor: {
        type: String,
        default: 'rgba(var(--zrx-primary), 1)'
    },
    normalColor: {
        type: String,
        default: 'rgba(var(--zrx-gray), 1)'
    },
    outerColor: {
        type: String,
        default: 'rgba(var(--zrx-border), 1)'
    }
})

const slots = useSlots()

const total = computed(() => {
    return Math.max(...props.data.map((item) => item.value)) / props.maxPercent
})
</script>
