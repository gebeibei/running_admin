import lodash from 'lodash'

/**
 * @description 表格检索重置相关的hook
 * @template T
 * @param { T } defaultCondition 包含搜索框各个字段和默认值的对象
 * @date 2022-10-27
 */
export const useReset = defaultCondition => {
    /**@type { T } */
    const searchCondition = reactive(lodash.cloneDeep(defaultCondition))

    /**
     * @description 重置传入对象
     * @param { Function } callback 重置后的回调
     * @date 2023-03-13
     */
    const reset = callback => {
        Object.assign(searchCondition, lodash.cloneDeep(defaultCondition))

        if (callback && lodash.isFunction(callback)) callback()
    }

    return {
        searchCondition,
        reset
    }
}
