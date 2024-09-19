<template>
    <render></render>
</template>
<script lang="jsx" setup>
import { convertNumberByString } from '@/zrxAdminPlus/utils'
defineOptions({ name: 'zrxPassword' })
const slots = useSlots()
const containerRef = ref(null)
const props = defineProps({
    tag: {
        type: String,
        default: 'div'
    },
    value: {
        type: [String, Number],
        default: ''
    },
    placeholder: {
        type: String,
        default: '- -'
    },
    charLength: [String, Number],
    exclusive: [String, Number],
    defaultShow: {
        type: Boolean,
        default: false
    }
})
const visible = ref(false)
const plaintext = ref('')
let entity = null
const init = () => {
    entity = containerRef.value.querySelector('[password]')
    if (slots.default && entity?.firstChild) {
        plaintext.value = entity.firstChild.nodeValue ?? ''
        if (vmExclusives.value.includes(plaintext.value)) {
            return (entity.firstChild.nodeValue = props.placeholder)
        }
        if (!visible.value && entity.firstChild) {
            entity.firstChild.nodeValue = ciphertext.value
        }
    }
}
const onClick = () => {
    visible.value = !visible.value
    if (slots.default && entity?.firstChild) {
        if (visible.value) {
            entity.firstChild.nodeValue = plaintext.value
        } else {
            entity.firstChild.nodeValue = ciphertext.value
        }
    }
}
onBeforeMount(() => {
    visible.value = props.defaultShow
})
onMounted(() => {
    init()
})
watch(
    () => props.value,
    (newv) => (plaintext.value = newv),
    { immediate: true }
)
const ciphertext = computed(() => {
    if (typeof plaintext.value == 'number') {
        plaintext.value += ''
    }
    let l = (convertNumberByString(props.charLength) ?? plaintext.value.length) || plaintext.value.length
    return ''.padStart(Math.floor(l), '*')
})
const showText = computed(() => {
    if (vmExclusives.value.includes(plaintext.value)) {
        return props.placeholder
    }
    return visible.value ? plaintext.value : ciphertext.value
})
const vmExclusives = computed(() => ['', NaN, undefined, null].concat(props.exclusive))
const render = () => {
    const tag = props.tag
    const children = slots.default ? <p class="s-text">{slots.default()}</p> : <span class="s-text">{showText.value}</span>
    return (
        <tag class="zrx-password" type={visible.value ? 'text' : 'password'} ref={containerRef}>
            {children}
            <span class="placeholder">{plaintext.value}</span>
            <i
                class={'btn svg-icon ' + (visible.value ? 'zrx-icon-eye' : 'zrx-icon-closed-eye')}
                title={visible.value ? '切换密文' : '切换明文'}
                v-show={!vmExclusives.value.includes(plaintext.value)}
                onClick={onClick}
            ></i>
        </tag>
    )
}
defineExpose({ init })
</script>
