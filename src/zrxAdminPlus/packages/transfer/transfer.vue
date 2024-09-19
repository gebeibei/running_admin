<template>
    <div class="zrx-transfer" :type="type">
        <TransferPanel
            :props="keys"
            ref="sourcePanelRef"
            :title="sourceTitle"
            :data="sourceData"
            class="zrx-transfer-source"
            :type="type"
            :searchByGroup="searchByGroup"
            :showSearch="showSearch"
            :showGroup="showGroup"
            :placeholder="placeholder"
            :tableColumns="tableColumnsArr"
            @change="changeSourcePanel"
        >
            <template #header>
                <div>选项</div>
            </template>

            <template #default="{ data }">
                <slot :data="data"></slot>
            </template>
        </TransferPanel>
        <div class="zrx-transfer-btns">
            <div v-for="(item, index) in targetConfigArr" :key="item.key" :style="`height: ${(1 / targetConfigArr.length) * 100}%`">
                <div :class="[`zrx-transfer-action-btn btn-left`, toTargetDisabled && 'is-disabled']" @click="toTarget(index)">
                    <i class="icon svg-icon zrx-icon-right-angle"></i>
                </div>
                <div :class="[`zrx-transfer-action-btn`, toSourceDisabled[index] && 'is-disabled']" @click="toSource(index)">
                    <i class="icon svg-icon zrx-icon-left-angle"></i>
                </div>
            </div>
        </div>
        <div
            class="zrx-transfer-target"
            :style="`display: grid;grid-template-columns:auto; grid-template-rows: repeat(auto-fit, minmax(0, 1fr));row-gap: 12px;`"
        >
            <TransferPanel
                v-for="(item, index) in targetConfigArr"
                :key="item.key"
                :props="keys"
                :ref="getTargetRef"
                :title="item.title"
                :label="item.label"
                :data="targetData[index]"
                :type="type"
                :showGroup="showGroup"
                :showSearch="item.showSearch"
                :placeholder="item.placeholder || placeholder"
                :searchByGroup="searchByGroup"
                :tableColumns="tableColumnsArr"
                @change="changeTargetPanel(index)"
            >
                <template #header>
                    <div>选项</div>
                </template>

                <template #default="{ data }">
                    <slot :data="data"></slot>
                </template>
            </TransferPanel>
        </div>
    </div>
</template>

<script setup>
import omit from 'lodash/omit'
import TransferPanel from './transferPanel.vue'

defineOptions({ name: 'zrxTransfer' })

const emit = defineEmits(['change'])
const props = defineProps({
    type: {
        type: String,
        default: 'table' // table表格项；list列表项
    },
    tableColumns: {
        type: Array,
        default: () => []
    }, // 表头字段显示
    showSearch: {
        type: Boolean,
        default: true
    }, // 是否显示搜索框
    showGroup: {
        type: Boolean,
        default: false
    }, // 是否按照分组显示
    targetConfig: {
        type: Array,
        default: () => []
    }, // 目标池子的个数配置项
    data: {
        type: Array,
        default: () => []
    },
    props: {
        type: Object,
        default: () => {
            return {
                key: 'key',
                label: 'label',
                group: 'group',
                disabled: 'disabled'
            }
        }
    },
    placeholder: {
        type: String,
        default: '请输入'
    }, // 输入检索框的提示文字
    searchByGroup: {
        type: Boolean,
        default: true
    }, // 是否可以按照分组进行关键字检索,检索字段为group、groupLabel对应的字段
    sourceTitle: {
        type: String,
        default: '待选择'
    } // 来源池的标题
})
const selectKeys = defineModel({
    type: Array,
    default: () => []
})

// 默认数据展示配置项
const defaultProps = {
    key: 'key', // 关键字段，需要唯一
    label: 'label', // 搜索字段
    group: 'group', // 分组字段key，需要唯一
    // groupLabel: 'groupLabel', // 显示的分组字段label(不传就直接显示group)
    disabled: 'disabled' // 是否禁选字段
}
// 表头字段数据展示配置项
const defaultTableColumns = [
    {
        title: '选项', // 表头字段
        key: 'label', // 该字段对应的属性key
        // width: 100, // 该列的宽度，不传默认平均分配,只能传数字，单位px
        isShowTitle: true // 是否鼠标移入显示title
    }
]
// 目标池子的个数配置项
const defaultTargetConfig = [
    {
        key: 1,
        title: '已选择', // 目标池标题
        label: '', // 目标池副标题
        showSearch: true, // 目标池是否显示搜索
        placeholder: '' // 目标池输入检索框的提示文字
    }
]

const sourcePanelRef = ref()
const targetPanelRefs = ref([])
const keys = ref({}) // 整合之后的props
const tableColumnsArr = ref([]) // 整合之后的tableColumns表头字段数据展示配置项
const targetConfigArr = ref([]) // 整合之后的targetConfig目标池子的个数展示配置项
const targetData = ref([])
const sourceData = ref([])
const toTargetDisabled = ref(true) // 去往目标池按钮是否禁用,默认禁用true
const toSourceDisabled = ref({}) // 回到来源池的按钮是否禁用,默认禁用true(可能会有多个目标池)

const getTargetRef = (el) => {
    targetPanelRefs.value.push(el)
}

const init = () => {
    keys.value = { ...defaultProps, ...props.props }
    if (props.tableColumns?.length) {
        tableColumnsArr.value = [...props.tableColumns]
    } else {
        tableColumnsArr.value = [
            {
                ...defaultTableColumns[0],
                key: keys.value.label // 没有表头的配置项，根据props的label对应的字段展示
            }
        ]
    }
    if (props.targetConfig?.length) {
        targetConfigArr.value = [...props.targetConfig]
    } else {
        targetConfigArr.value = [
            {
                ...defaultTargetConfig[0],
                showSearch: props.showSearch // 没有传目标池的配置，根据总体showSearch对应的字段展示
            }
        ]
    }
    sourceData.value = props.data.map((item, index) => {
        return { ...item, sortIndex: index }
    })
    targetData.value = targetConfigArr.value.map(() => [])
    targetConfigArr.value.forEach((item, index) => {
        toSourceDisabled.value[index] = true
    })
    if (selectKeys.value?.[0]) {
        // 初始默认选择的数据处理
        if (targetConfigArr.value.length > 1) {
            // 如果是分组并且有多个目标池的情况
            selectKeys.value.forEach((item, index) => {
                const selection = sourceData.value.filter((i) => item.includes(i[keys.value.key]))
                mergeList(targetData.value[index], selection, keys.value.key)
                subList(sourceData.value, selection, keys.value.key)
            })
        } else {
            const selection = sourceData.value.filter((i) => selectKeys.value.includes(i[keys.value.key]))
            mergeList(targetData.value[0], selection, keys.value.key)
            subList(sourceData.value, selection, keys.value.key)
        }
        nextTick(() => {
            sourcePanelRef.value.setCheckAll()
            updateModelValue()
        })
    }
}

const toTarget = (index) => {
    if (toTargetDisabled.value) return

    const currRef = sourcePanelRef.value
    mergeList(targetData.value[index], currRef.selection, keys.value.key)
    subList(sourceData.value, currRef.selection, keys.value.key)
    targetPanelRefs.value[index].setCheckAll()
    currRef.resetSelection()
    updateModelValue()
}

const toSource = (index) => {
    if (toSourceDisabled.value[index]) return

    const currRef = targetPanelRefs.value[index]
    mergeList(sourceData.value, currRef.selection, keys.value.key)
    subList(targetData.value[index], currRef.selection, keys.value.key)
    sourceData.value = sourceData.value.sort((a, b) => {
        return a.sortIndex - b.sortIndex
    })
    sourcePanelRef.value.setCheckAll()
    currRef.resetSelection()
    updateModelValue()
}

const reset = () => {
    sourcePanelRef.value.reset()
    for (let i = 0; i < targetConfigArr.value.length; i++) {
        targetPanelRefs.value[index].reset()
    }
}

// 来源池数据,目标池数据改变向外部传递数据
const updateModelValue = () => {
    const target = []
    for (let i = 0; i < targetConfigArr.value.length; i++) {
        target[i] = (targetData.value[i] || []).map((item) => {
            return omit(item, ['selected', keys.value.disabled])
        })
    }

    selectKeys.value = target
    emit('change', target)
}

// 目标池数据勾选状态改变触发按钮的状态改变
const changeTargetPanel = (index) => {
    const currRef = targetPanelRefs.value[index]
    toSourceDisabled.value[index] = Boolean(!currRef.selection.length)
}

// 来源池数据勾选状态改变触发按钮的状态改变
const changeSourcePanel = () => {
    toTargetDisabled.value = Boolean(!sourcePanelRef.value.selection.length)
}

// 将list2合并到List1
const mergeList = (list1, list2, key = 'key') => {
    list2.forEach((item) => {
        const index = list1.findIndex((option) => option[key] === item[key])

        if (index === -1) list1.unshift(item)
    })
}

// 从list1中减去list2
const subList = (list1, list2, key = 'key') => {
    list2.forEach((item) => {
        const index = list1.findIndex((option) => option[key] === item[key])

        if (index > -1) list1.splice(index, 1)
    })
}

defineExpose({ reset })

init()
</script>
