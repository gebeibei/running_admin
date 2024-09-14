<template>
    <div class="zrx-stars f-c" :style="computedCssVar">
        <div class="f-c" :style="`column-gap: ${gap}px;`">
            <div
                v-for="v in list"
                :key="v"
                :style="computedStyle(v)"
                :class="['rd-4px f-c-c zrx-star-item', v <= score && 'is-active', v > score && score > v - itemScore && 'half-active']"
            >
                <i class="zrx-icon-star"></i>
            </div>
        </div>
        <div v-if="showText" class="m-l-8 f-14 font-bold" :style="`color: ${props.activeColor}`">{{ score }}分</div>
    </div>
</template>

<script setup>
defineOptions({ name: 'zrxStars' })

const props = defineProps({
    max: {
        type: Number,
        default: 5
    },
    itemScore: {
        type: Number,
        default: 1
    },
    gap: {
        type: Number,
        default: 6
    },
    size: {
        type: Number,
        default: 24
    },
    iconSize: {
        type: Number,
        default: 18
    },
    activeColor: {
        type: String,
        default: '#FF9700'
    },
    inactiveColor: {
        type: String,
        default: '#E3E4E6'
    },
    showText: {
        type: Boolean,
        default: true
    }
})

const list = computed(() => {
    return new Array(props.max).fill('').map((_, i) => (i + 1) * props.itemScore)
})

const computedCssVar = computed(() => {
    return `
        --zrx-star-icon-size: ${props.iconSize}px;
        --zrx-star-active-color: ${props.activeColor};
        --zrx-star-inactive-color: ${props.inactiveColor};
    `
})

const computedStyle = computed(() => {
    return (v) => {
        return `
            height: ${props.size}px;
            width: ${props.size}px;
            ${
                v > score.value && score.value > v - props.itemScore
                    ? '--zrx-star-half-width:' + ((score.value - v + props.itemScore) / props.itemScore) * 100 + '%'
                    : ''
            }
        `
    }
})

const score = defineModel({ type: Number, default: 0 })
</script>

<style scoped lang="scss">
.zrx-stars {
    .zrx-star-item {
        background-color: var(--zrx-star-inactive-color);

        &.is-active {
            background-color: var(--zrx-star-active-color);
        }

        &.half-active {
            position: relative;
            z-index: 5;

            i {
                position: relative;
                z-index: 10;
            }

            &::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                z-index: 8;
                height: 100%;
                border-radius: 4px 0 0 4px;
                width: var(--zrx-star-half-width);
                background-color: var(--zrx-star-active-color);
            }
        }
    }

    .zrx-icon-star {
        width: var(--zrx-star-icon-size, 24px);
        height: var(--zrx-star-icon-size, 24px);
        @include bgImage('@/assets/images/common/icon_star.svg');
        background-size: var(--zrx-star-icon-size, 24px) var(--zrx-star-icon-size, 24px);
    }
}
</style>
