import lodash from 'lodash'
import { G } from '@/config/global'

/**
 * @description 表格的select相关hook
 * @param { Ref<[]> } list 表格的数据列表;
 * @param { Ref<import('element-plus').TableInstance> } tableRef 表格的$refs;
 * @param { String } rowKey 表格行对象的唯一key，默认为id;
 * @param { Function } selectable 判断表格行是否可以勾选的方法
 * @date 2022-10-21
 */
export const useSelection = (list, tableRef, rowKey = 'id', selectable) => {
    const multipleSelection = ref([])
    /** @description 全选是否禁用*/
    const disabledAll = ref(false)
    const _getIndex = (key) => {
        return multipleSelection.value.findIndex((item) => item[rowKey] === key)
    }

    // 列表默认选中
    const setTableRowSelected = () => {
        list.value.forEach((row) => {
            const matchedIndex = _getIndex(row[rowKey])
            nextTick(() => {
                tableRef.value?.toggleRowSelection(row, matchedIndex != -1)
            })
        })

        if (selectable && lodash.isFunction(selectable)) disabledAll.value = list.value.every((row) => !selectable(row))
    }
    // 取消选中
    const handleCancelSelection = (key) => {
        const index = _getIndex(key)
        if (index > -1) {
            multipleSelection.value.splice(index, 1)
            setTableRowSelected()
        }
    }
    // 勾选
    const handleSelectionChange = (_selection, row) => {
        if (_getIndex(row[rowKey]) === -1) {
            multipleSelection.value.push(row)
        } else {
            handleCancelSelection(row[rowKey])
        }
    }
    // 设置点击一行任意位置即选中
    const rowClick = (row) => {
        tableRef.value.toggleRowSelection(row)
        handleSelectionChange(null, row)
    }

    // 通过flag设置是否选中
    const setRowChecked = (row, flag) => {
        tableRef.value.toggleRowSelection(row, flag)
        const index = _getIndex(row[rowKey])
        if (index === -1 && flag) {
            multipleSelection.value.push(row)
        }
        if (index !== -1 && !flag) {
            multipleSelection.value.splice(index, 1)
        }
    }

    // 全选
    const handleSelectionAllChange = (selection) => {
        if (!selection.length) {
            // 取消全选
            list.value.forEach((row) => {
                handleCancelSelection(row[rowKey])
            })
        } else {
            // 全选
            selection.forEach((row) => {
                if (_getIndex(row[rowKey]) === -1) {
                    multipleSelection.value.push(row)
                }
            })
        }
    }
    // 清空选中列表
    const clearMultipleSelection = () => {
        multipleSelection.value = []
        setTableRowSelected()
    }

    const setDisabledAll = (disabled) => {
        nextTick(() => {
            setTimeout(() => {
                const parentNode = document.querySelector('.el-table__header-wrapper .el-table-column--selection')
                if (!parentNode) return

                if (disabled) {
                    parentNode.querySelector('.el-checkbox__input')?.classList.add('is-disabled')
                    parentNode.querySelector('.el-checkbox')?.classList.add('is-disabled')
                    parentNode.querySelector('.el-checkbox__original')?.setAttribute('disabled', 'disabled')
                } else {
                    parentNode.querySelector('.el-checkbox__input')?.classList.remove('is-disabled')
                    parentNode.querySelector('.el-checkbox')?.classList.remove('is-disabled')
                    parentNode.querySelector('.el-checkbox__original')?.removeAttribute('disabled')
                }
            }, 50)
        })
    }

    watch(disabledAll, (disabled) => {
        setDisabledAll(disabled)
    })

    return {
        disabledAll,
        selectionWidth: G.selectionWidth,
        multipleSelection,
        setDisabledAll,
        setTableRowSelected,
        handleSelectionChange,
        handleSelectionAllChange,
        handleCancelSelection,
        clearMultipleSelection,
        rowClick,
        setRowChecked
    }
}
