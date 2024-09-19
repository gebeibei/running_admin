<template>
    <p :class="['zrx-empty-state', noMargin && 'no-margin']">
        <i :class="['svg-icon', icon]"></i>
        <span v-if="describe !== ''">{{ describe }}</span>
    </p>
</template>

<script setup>
import { computed } from 'vue'
defineOptions({
    name: 'zrxEmptyState'
})

const props = defineProps({
    type: {
        type: String,
        default: 'data'
    },
    text: {
        type: [String, Number, Boolean],
        default: 'unset'
    },
    noMargin: {
        type: Boolean,
        default: false
    }
})

const iconMap = {
    data: 'zrx-icon-empty-default',
    personal: 'zrx-icon-empty-person',
    image: 'zrx-icon-upload-image',
    imageFailure: 'zrx-icon-image-failure',
    search: 'zrx-icon-empty-search',
    file: 'zrx-icon-upload-file',
    info: 'zrx-icon-empty-notify',
    warning: 'zrx-icon-empty-warning',
    map: 'zrx-icon-empty-map',
    mapOffline: 'zrx-icon-map-offline',
    mapEmpty: 'zrx-icon-empty-map-empty',
    video: 'zrx-icon-empty-video',
    videoOffline: 'zrx-icon-video-offline'
}
const textMap = {
    data: '暂无数据',
    personal: '',
    image: '',
    imageFailure: '',
    file: '',
    search: '',
    info: '',
    warning: '',
    map: '',
    mapOffline: '',
    mapEmpty: '',
    video: '',
    videoOffline: ''
}
const defaultIcon = 'zrx-icon-empty-default'

const icon = computed(() => {
    return iconMap[props.type] ?? defaultIcon
})

const describe = computed(() => {
    if ([false, null, undefined].includes(props.text)) return ''
    return props.text != 'unset' ? props.text : (textMap[props.type] ?? '')
})
</script>
