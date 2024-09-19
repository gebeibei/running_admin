<template>
    <div class="zrx-transfer-panel" :class="['zrx-transfer-panel', typeMap.get(type).listClass && 'is-list-type']">
        <div class="zrx-transfer-title">
            <el-checkbox
                v-if="typeMap.get(type).showTitleCheckBox"
                v-model="checkAll"
                @change="checkAllOptions"
                :indeterminate="isIndeterminate"
                :disabled="disabledAll"
            ></el-checkbox>
            {{ title }} ({{ selection.length }}/{{ data.length }})<span>{{ label }}</span>
        </div>
        <el-input class="zrx-transfer-search" v-model="keyword" :placeholder="placeholder" v-if="showSearch">
            <template #suffix>
                <i class="svg-icon zrx-icon-search"></i>
            </template>
        </el-input>

        <div class="zrx-transfer-header" v-if="typeMap.get(type).showTableHeader">
            <el-checkbox v-model="checkAll" @change="checkAllOptions" :indeterminate="isIndeterminate" :disabled="disabledAll"></el-checkbox>
            <div class="t-table__row header" :style="computedColumns()">
                <div v-for="item in tableColumns" :key="item.key" class="t-table__cell">
                    <div class="cell">{{ item.title }}</div>
                </div>
            </div>
        </div>

        <div :class="['zrx-transfer-container', !showSearch && 'no-search']">
            <el-scrollbar style="height: 100%">
                <template v-if="showGroup">
                    <template v-for="[group, data] in options" :key="group + '1'">
                        <div class="zrx-transfer-item group">
                            <el-checkbox
                                v-model="groupOption.get(group).selected"
                                :indeterminate="groupOption.get(group).isIndeterminate"
                                :disabled="groupOption.get(group).disabled"
                                @change="(checked) => onGroupChange(checked, groupOption.get(group), data)"
                            ></el-checkbox>
                            <i
                                @click="changeExpand(group)"
                                :class="['svg-icon', groupOption.get(group).isExpand ? 'zrx-icon-down-angle' : 'zrx-icon-right-angle']"
                            ></i>
                            <span :title="groupOption.get(group).groupLabel">{{ groupOption.get(group).groupLabel }}</span>
                        </div>
                        <template v-if="groupOption.get(group).isExpand">
                            <div class="zrx-transfer-item" v-for="item in data" :key="item[props.key]">
                                <el-checkbox
                                    v-model="item.selected"
                                    :disabled="item[props.disabled]"
                                    @change="(checked) => onChange(checked, item, group)"
                                ></el-checkbox>
                                <div class="t-table__row" :style="computedColumns()">
                                    <div
                                        v-for="(i, inx) in tableColumns"
                                        :key="`${item[props.key]}*${i.key}`"
                                        :class="['t-table__cell', inx == 0 && 'first']"
                                    >
                                        <slot :data="item">
                                            <div class="cell" :title="i.isShowTitle && item[i.key]">{{ item[i.key] }}</div>
                                        </slot>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </template>
                </template>

                <template v-else>
                    <div class="zrx-transfer-item" v-for="item in options" :key="item[props.key]">
                        <el-checkbox v-model="item.selected" :disabled="item[props.disabled]" @change="(checked) => onChange(checked, item)">
                        </el-checkbox>
                        <div class="t-table__row" :style="computedColumns()">
                            <div v-for="i in tableColumns" :key="`${item[props.key]}*${i.key}`" class="t-table__cell">
                                <slot :data="item">
                                    <div class="cell" :title="i.isShowTitle && item[i.key]">{{ item[i.key] }}</div>
                                </slot>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-if="!options.length">
                    <div class="zrx-transfer-empty-box">暂无数据</div>
                </template>
            </el-scrollbar>
        </div>
    </div>
</template>

<script setup>
import groupBy from 'lodash/groupBy'

defineOptions({ name: 'zrxTransferPanel' })

const emit = defineEmits(['change'])

const props = defineProps({
    title: String,
    label: String,
    type: {
        type: String,
        default: 'table'
    },
    tableColumns: {
        type: Array,
        default: () => [
            {
                title: '选项', // 表头字段
                key: 'label', // 该字段对应的属性key
                // width: 100, // 该列的宽度，不传默认平均分配,只能传数字，单位px
                isShowTitle: true // 是否鼠标移入显示title
            }
        ]
    },
    data: {
        type: Array,
        default: () => []
    },
    showSearch: {
        type: Boolean,
        default: false
    },
    showGroup: {
        type: Boolean,
        default: true
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
    // 是否可以按照分组进行关键字检索
    searchByGroup: {
        type: Boolean,
        default: false
    },
    placeholder: {
        type: String,
        default: '请输入'
    }
})

const typeMap = new Map([
    [
        'table',
        {
            showTitleCheckBox: false, // 复选框是否显示在标题行
            showTableHeader: true, // 表头是否显示
            listClass: false // 列表行样式是否更改，是否去掉下边框
        }
    ],
    [
        'list',
        {
            showTitleCheckBox: true,
            showTableHeader: false,
            listClass: true
        }
    ]
]) // 表格项和列表项穿梭框的不同之处

const keyword = ref('') // 检索关键字
const selection = ref([]) // 选择的数据
const checkAll = ref(false) // 全选
const isIndeterminate = ref(false) // 半选
const groupOption = ref(new Map([])) // 存储分组的相关属性

const buildList = (list) => {
    return list.map((item) => {
        return {
            ...item,
            selected: selection.value.findIndex((option) => option[props.props.key] === item[props.props.key]) > -1,
            disabled: Boolean(item[props.props.disabled])
        }
    })
}

// 展开分组
const changeExpand = (group) => {
    groupOption.value.get(group).isExpand = !groupOption.value.get(group).isExpand
}

// 分组的勾选
const onGroupChange = (checked, group, data) => {
    if (group.disabled) return
    data.forEach((option) => {
        onChange(checked, option, group)
    })
}

// 设置分组的勾选框
const setGroupChange = (group) => {
    const option = options.value.find((item) => item[0] == group)
    const len = option[1].length
    const checkedNum = option[1].filter((i) => i.selected).length
    const disabledNum = option[1].filter((i) => i[props.props.disabled]).length
    let disabledFlag = false
    const currentGroup = groupOption.value.get(group)
    if (checkedNum == len) {
        // 子类选择的数量等于子类的长度，分组框全选
        currentGroup.selected = true
        currentGroup.isIndeterminate = false
    } else if (checkedNum < len && checkedNum > 0 && len - checkedNum != disabledNum) {
        // 子类选择的数量小于子类的长度，且子类选择有选择，且没选择的数量都不是被禁用的，分组框半选
        currentGroup.selected = false
        currentGroup.isIndeterminate = true
    } else if (checkedNum < len && checkedNum > 0 && len - checkedNum == disabledNum) {
        // 子类选择的数量小于子类的长度，且子类选择有选择，且没选择的数量等于被禁用的，分组框全选
        currentGroup.selected = true
        currentGroup.isIndeterminate = false
    } else if (checkedNum == 0 && disabledNum != len) {
        // 子类未选择，且被禁用的数量不是子类的长度， 分组框不选中
        currentGroup.selected = false
        currentGroup.isIndeterminate = false
    } else if (checkedNum == 0 && disabledNum == len) {
        // 子类未选择，且全被禁用， 分组框不选中，禁用
        currentGroup.selected = false
        currentGroup.isIndeterminate = false
        disabledFlag = true
    }
    currentGroup.disabled = disabledFlag
}

// 单个勾选框
const onChange = (checked, item, group) => {
    if (item[props.props.disabled]) return
    item.selected = checked

    const index = selection.value.findIndex((option) => option[props.props.key] === item[props.props.key])
    if (checked) {
        // 添加
        if (index === -1) selection.value.push(item)
    } else {
        // 删除
        if (index > -1) selection.value.splice(index, 1)
    }
    emit('change')
    setCheckAll()
}

// 是否全部选中/全部不选中
const volidCheckAll = (value = true) => {
    if (props.showGroup) {
        return options.value.every((item) => {
            return item[1].every((option) => option[props.props.disabled] || option.selected === value)
        })
    } else {
        return options.value.every((item) => item[props.props.disabled] || item.selected === value)
    }
}

// 全选
const checkAllOptions = (checked) => {
    if (props.showGroup) {
        options.value.forEach((item) => {
            item[1].forEach((option) => {
                onChange(checked, option, item[0])
            })
        })
    } else {
        options.value.forEach((item) => {
            onChange(checked, item)
        })
    }
}

// 重置
const resetSelection = () => {
    selection.value = []
    checkAll.value = false
    isIndeterminate.value = false
    emit('change')
}

// 设置全选框
const setCheckAll = () => {
    const isCheckAll = volidCheckAll(true)
    const isCheckNo = volidCheckAll(false)

    checkAll.value = isCheckAll
    isIndeterminate.value = !isCheckAll
    if (isCheckNo) isIndeterminate.value = false
    let flag = false
    if (options.value?.length) {
        // 搜索有数据但是全都是禁选状态时全选框不勾选
        if (props.showGroup) {
            flag = options.value.every((item) => {
                return item[1].every((option) => option[props.props.disabled])
            })
        } else {
            flag = options.value.every((item) => item[props.props.disabled])
        }
    } else {
        // 搜索无数据的时候全选框不勾选
        flag = true
    }
    if (flag) {
        checkAll.value = false
        isIndeterminate.value = false
    }
}

const reset = () => {
    keyword.value = ''
    resetSelection()
}

const computedColumns = () => {
    const str = props.tableColumns.map((i) => (i.width && Number(i.width) ? `${i.width}px` : 'minmax(0, 1fr)')).join(' ')
    return `display: grid;grid-template-columns: ${str}`
}

const options = computed(() => {
    let tempList
    const label = props.props.label
    const group = props.props.group
    const groupLabel = props.props.groupLabel || props.props.group
    if (!props.showSearch || !keyword.value || !keyword.value?.trim()) {
        tempList = buildList(props.data)
    } else {
        const val = keyword.value.trim()
        if (props.searchByGroup && props.showGroup) {
            tempList = buildList(props.data.filter((item) => item[label].includes(val) || item[groupLabel].includes(val)))
        } else {
            tempList = buildList(props.data.filter((item) => item[label].includes(val)))
        }
    }
    if (props.showGroup) {
        const groupObj = groupBy(tempList, props.props.group)
        const keys = [...groupOption.value.keys()]
        Object.keys(groupObj).forEach((key, i) => {
            const groupItem = tempList.find((i) => i[props.props.group] == key)
            // 如果groupOption里面有该分组，不做处理，不在就添加该分组
            !groupOption.value.get(key) &&
                groupOption.value.set(key, {
                    group: key,
                    groupLabel: groupItem[groupLabel],
                    isExpand: true,
                    selected: false,
                    isIndeterminate: false,
                    disabled: false
                })
        })
        keys.forEach((key) => {
            // 如果groupOption里面的分组整个列表里面没有该分组，要去掉该分组
            if (!Object.keys(groupObj).includes(key)) groupOption.value.delete(key)
        })
        //分组结构数据
        return Object.entries(groupObj)
    } else {
        return tempList
    }
})

const disabledAll = computed(() => {
    let disabledItemNum = 0
    let total = 0
    if (props.showGroup) {
        options.value.forEach((item) => {
            disabledItemNum =
                disabledItemNum +
                item[1].reduce((prev, cur) => {
                    return prev + (cur[props.props.disabled] ? 1 : 0)
                }, 0)
            total = total + item[1].length
        })
    } else {
        disabledItemNum = options.value.reduce((prev, cur) => {
            return prev + (cur[props.props.disabled] ? 1 : 0)
        }, 0)
        total = options.value.length
    }
    return !(total - disabledItemNum)
})

watch(keyword, (val) => {
    nextTick(() => {
        setCheckAll()
    })
})

watch(
    options,
    (val) => {
        val.forEach((item) => {
            props.showGroup && setGroupChange(item[0])
        })
    },
    { deep: true }
)

defineExpose({
    reset,
    setCheckAll,
    selection,
    resetSelection
})
</script>
