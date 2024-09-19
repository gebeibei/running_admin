<!--自定义列表-->
<template>
    <el-popover popper-class="zrx-table-widgets zrx-popover" width="184" trigger="click" v-model:visible="dialogVisible">
        <div class="zrx-table-widgets__header">字段名称</div>
        <el-table
            max-height="380"
            ref="multipleTableRef"
            :data="columnsData"
            :row-key="rowKey"
            @row-click="handleRowClick"
            @select="handleSelect"
            @select-all="handleSelectAll"
            @header-click="handleHeaderClick"
            :row-class-name="computedRowClass"
        >
            <el-table-column type="selection" align="center" :selectable="selectable" width="32px"></el-table-column>
            <el-table-column :label="title" prop="label" show-overflow-tooltip>
                <template #default="{ row }">
                    <span>{{ row.label }}</span>
                    <span>{{ row.isFixed == true ? '（必选）' : '' }}</span>
                </template>
            </el-table-column>
        </el-table>
        <div class="pop-btn">
            <el-button type="primary" class="btn btn-primary" @click="onChange">确定</el-button>
        </div>
        <template #reference>
            <div :class="['icon-filter-box', dialogVisible && 'is-active']">
                <span @click="toCustomTitle">
                    <i class="svg-icon zrx-icon-filter-table"></i>
                </span>
            </div>
        </template>
    </el-popover>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['change'])
defineOptions({ name: 'zrxTableWidgets', inheritAttrs: false })

const props = defineProps({
    // popover中rowkey值
    rowKey: {
        type: [String, Number],
        default: 'id'
    },
    title: {
        type: String,
        default: '全选'
    }
})

const data = defineModel({ type: Array, default: () => [] })

watch(data, () => {
    columnsData.value = [...data.value]
})

const columnsData = ref([...data.value])
const dialogVisible = ref(false)
const selectList = ref([])
const multipleTableRef = ref()

const findIndex = (row) => {
    return selectList.value.findIndex((item) => item[props.rowKey] === row[props.rowKey])
}
//点击设置自定义标题按钮
const toCustomTitle = () => {
    if (dialogVisible.value) return
    selectList.value = []
    columnsData.value.forEach((item) => {
        if (item.show) {
            selectList.value.push(item)
        }
    })
    setRowSelected()
}
//关闭弹窗
const onCloseDialog = () => {
    dialogVisible.value = false
}

//保存弹窗
const onChange = () => {
    const list = columnsData.value.map((item) => {
        return {
            ...item,
            show: false
        }
    })
    selectList.value.forEach((item) => {
        let index = list.findIndex((n) => n[props.rowKey] == item[props.rowKey])
        if (index > -1) {
            list[index].show = true
        }
    })
    data.value = list
    emit('change', list)
    onCloseDialog()
}
//禁用选择弹窗题目选项
const selectable = (row, index) => {
    return row.isFixed == false
}
//勾选表单选择项
const handleSelect = (selection, row) => {
    const target = selectList.value
    if (findIndex(row) === -1) {
        target.push(row)
    } else {
        cancelSelected(row)
    }
}
// 取消表单选择项
const cancelSelected = (row) => {
    const target = selectList.value
    const index = findIndex(row)
    target.splice(index, 1)
    setRowSelected()
}
//判断勾选或取消勾选
const setRowSelected = () => {
    const dataList = columnsData.value
    dataList.forEach((row) => {
        const matchedIndex = findIndex(row)
        nextTick(() => {
            multipleTableRef.value?.toggleRowSelection(row, matchedIndex != -1)
        })
    })
}
//全选操作
const handleSelectAll = (selection) => {
    const dataList = columnsData.value
    const isAllSelect = selection.length == dataList.length ? true : false
    if (!isAllSelect) {
        // 取消全选
        nextTick(() => {
            //全部数组
            const unDataList = JSON.parse(JSON.stringify(dataList))
            //禁止被取消选择的数组
            const unselectableList = []
            columnsData.value.forEach((item) => {
                if (item.isFixed) {
                    unselectableList.push(item)
                }
            })
            unselectableList.forEach((unList) => {
                const index = unDataList.findIndex((item) => item[props.rowKey] == unList[props.rowKey])
                unDataList.splice(index, 1)
            })
            unDataList.forEach((row) => {
                cancelSelected(row)
            })
        })
    } else {
        // 全选
        selection.forEach((row) => {
            if (selectList.value.findIndex((item) => item[props.rowKey] === row[props.rowKey]) === -1) {
                selectList.value.push(row)
            }
        })
    }
}
// 行点击事件
const handleRowClick = (row) => {
    if (!selectable(row)) return
    handleSelect([], row)
    setRowSelected()
}
const handleHeaderClick = () => {
    multipleTableRef.value?.toggleAllSelection()
}
const computedRowClass = ({ row }) => {
    return !selectable(row) ? 'fixed-row' : 'normal-row'
}
</script>
