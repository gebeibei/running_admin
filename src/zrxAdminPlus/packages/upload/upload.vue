<template>
    <div :class="['zrx-upload', disabled && 'disabled']">
        <el-upload
            v-bind="attrs"
            :limit="limit"
            :show-file-list="false"
            :class="computedClassName"
            ref="uploadRef"
            :on-exceed="onExceed"
            :before-upload="beforeUpload"
            :disabled="disabled"
            :headers="{ Authorization: token ? `${token}` : '' }"
        >
            <template v-if="attrs?.drag">
                <i :class="`svg-icon zrx-icon-upload-${uploadType}`"></i>
                <div class="zrx-click-upload">点击或将文件拖拽至此区域上传</div>
                <div class="upload-tip">{{ uploadTips }}</div>
            </template>
            <template v-else-if="attrs?.['list-type'] === 'picture-card' && uploadType === 'image'">
                <template v-if="attrs?.['file-list'].length && hasDelete">
                    <div fit="fill" :key="'image_' + index" class="zrx-image-preview" v-for="(item, index) in attrs?.['file-list']">
                        <el-image :src="item.url"></el-image>
                        <div class="shade" @click.stop>
                            <a class="btn" :href="item.url" target="_blank" role="preview"><i class="svg-icon zrx-icon-eye"></i></a>
                            <a class="btn" role="delete" @click.stop="removeFile(item, index)" v-if="!disabled">
                                <i class="svg-icon zrx-icon-delete"></i>
                            </a>
                        </div>
                    </div>
                </template>
                <template v-else-if="attrs?.['file-list'].length && !hasDelete">
                    <div fit="fill" :key="'image_' + index" class="zrx-image-preview" v-for="(item, index) in attrs?.['file-list']">
                        <el-image :src="item.url"></el-image>
                        <div class="svg-icon-reload-container">
                            <span class="reload-tip">点此重新上传</span>
                        </div>
                    </div>
                </template>
                <div class="zrx-upload-icon-box" v-if="attrs?.['file-list'].length < props.limit">
                    <slot name="uploadIcon">
                        <i class="svg-icon zrx-icon-upload-image"></i>
                        <div class="zrx-click-upload">点此上传</div>
                        <div class="zrx-upload-tip zrx-upload-image-tip">{{ uploadImageTips }}</div>
                    </slot>
                </div>
            </template>

            <template v-else-if="attrs?.['list-type'] === 'picture-card' && uploadType === 'file'">
                <template v-if="attrs?.['file-list'].length">
                    <div fit="fill" :key="'file_' + index" class="zrx-file-preview" v-for="(item, index) in attrs?.['file-list']">
                        <i class="zrx-file-icon"></i>
                        <div class="zrx-file-name" :title="item.name || ''">{{ item.name || '' }}</div>
                        <div class="shade" @click.stop>
                            <a class="btn" :href="item.url" :download="decodeURI(item.name || '')" target="_blank" role="preview">
                                <i class="svg-icon zrx-icon-eye"></i>
                            </a>
                            <a class="btn" role="delete" @click.stop="removeFile(item, index)" v-if="!disabled">
                                <i class="svg-icon zrx-icon-delete"></i>
                            </a>
                        </div>
                    </div>
                </template>
                <div class="zrx-upload-icon-box" v-if="attrs?.['file-list'].length < props.limit">
                    <slot name="uploadIcon">
                        <i class="svg-icon zrx-icon-upload-file"></i>
                        <div class="zrx-click-upload">点此上传</div>
                    </slot>
                </div>
            </template>
            <template v-else>
                <el-button><i class="svg-icon zrx-icon-upload"></i>{{ buttonText }}</el-button>
                <div class="upload-tip">{{ uploadTips }}</div>
            </template>
        </el-upload>
        <ul class="files-preview" v-if="attrs?.['list-type'] !== 'picture-card'">
            <li v-for="(file, index) in attrs?.['file-list']" :key="'card_' + index">
                <i class="svg-icon zrx-icon-paper-clip"></i>
                <span>
                    <a :href="file.url" :download="decodeURI(file.name)" target="_blank" :title="file.name">{{ file.name }}</a>
                </span>
                <a class="btn" @click.stop="removeFile(file, index)"><i class="svg-icon zrx-icon-close"></i></a>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { computed, useAttrs } from 'vue'

const emits = defineEmits(['removeFile', 'onExceed', 'beforeUpload'])
defineOptions({ name: 'zrxUpload', inheritAttrs: false })
const props = defineProps({
    uploadType: {
        type: String,
        default: 'file'
    },
    fileSize: {
        type: [Number, String],
        default: 2
    },
    sizeUnit: {
        type: String,
        default: 'MB'
    },
    buttonText: {
        type: String,
        default: '点击上传' // 表单中心可配置项，按钮的文字
    },
    disabled: {
        type: Boolean,
        default: false // 表单中心可配置项，是否禁用
    },
    showTip: {
        type: Boolean,
        default: true // 表单中心可配置项，是否显示提示
    },
    token: {
        type: String,
        default: '' // 表单中心可配置项,文件上传的token
    },
    hasDelete: {
        type: Boolean,
        default: true // 已上传的图片可否点击删除
    },
    showImageTip: {
        type: Boolean,
        default: false // 是否显示提示
    },
    // 自定义提示
    customTip: {
        type: String,
        default: ''
    },
    // 自定义类型
    customType: {
        type: String,
        default: ''
    },
    limit: {
        type: Number,
        default: 1
    }
})
const uploadRef = ref()
const attrs = useAttrs()

const computedClassName = computed(() => {
    if (props.customType) return props.customType

    if (attrs?.drag) {
        return 'zrx-drag-upload'
    } else if (attrs?.['list-type'] === 'picture-card' && props.uploadType === 'image') {
        return 'zrx-upload-image'
    } else if (attrs?.['list-type'] === 'picture-card' && props.uploadType === 'file') {
        return 'zrx-upload-file'
    } else {
        return 'zrx-button-upload'
    }
})
const uploadTips = computed(() => {
    if (props.customTip) return props.customTip
    let tips = ''
    if (attrs?.accept && props.showTip) {
        tips = `支持扩展名:${attrs?.accept.split(',').join(' ')}(最多上传${props.limit}个，每个不超过${props.fileSize}${props.sizeUnit})`
    }
    return tips
})

const uploadImageTips = computed(() => {
    if (props.customTip) return props.customTip
    let tips = ''
    if (attrs?.accept && props.showImageTip) {
        tips = `支持${attrs?.accept.split(',').join(' ')}(大小不超过${props.fileSize}${props.sizeUnit})`
    }
    return tips
})

const removeFile = (file, index) => {
    if (props.disabled) return false

    uploadRef.value?.handleRemove(file)
    attrs?.['file-list'].splice(index, 1)
    emits('removeFile', file, index)
}
const onExceed = (file, fileList) => {
    emits('onExceed', attrs?.['file-list'].length >= props.limit, file, fileList)
}
const beforeUpload = (file) => {
    if (attrs?.['before-upload']) {
        return attrs?.['before-upload'](file)
    } else if (attrs?.['beforeUpload']) {
        return attrs?.beforeUpload(file)
    }

    const size = props.sizeUnit === 'MB' ? 1024 : 1
    let threshold = 1024 * size * props.fileSize
    let exceed = file.size > threshold
    let unAchieved = file.size === 0
    emits('beforeUpload', file, exceed, unAchieved)
    return !(exceed || unAchieved)
}
const decodeURI = (fileName) => {
    return window.decodeURI(fileName)
}

defineExpose({ uploadRef })
</script>
