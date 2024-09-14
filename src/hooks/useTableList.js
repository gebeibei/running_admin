import lodash from 'lodash'
import { request } from '@/config/axios'
import { setDefaultValue, getOrderWay, isEmptyObj } from '@/utils'

const humpOrLine = (name = '', type) => {
    // 驼峰式转下划线: toLine 下划线转驼峰式: toHump
    if (type === 'toLine') {
        return name.replace(/([A-Z])/g, '_$1').toLowerCase()
    } else if (type === 'toHump') {
        return name.replace(/\_(\w)/g, function (all, letter) {
            return letter.toUpperCase()
        })
    }
}

/**
 * @description 关于表格列表请求和分页相关的方法；
 * 当getAxiosConfig返回的对象autoHandleResponse为true时，callback可不传，会按照hook中预设的handleList方法处理response
 * @param { () => AxiosRequestConfig } getAxiosConfig 返回axios请求参数的方法；
 * @param { Function? } callback 请求成功后处理response的方法；
 * @date 2023-3-30
 */
export const useTableList = (getAxiosConfig, callback = () => {}) => {
    const isLoading = ref(false)
    /** @type { Ref<import('element-plus').TableInstance> } */
    const tableRef = ref()
    const list = ref([])
    const total = ref(0)
    const sorter = reactive({ orderWay: '', orderBy: '' })
    const paginator = reactive({ pageNum: 1, pageSize: 10 })

    const search = () => {
        paginator.pageNum = 1
        return getList()
    }

    const setSortParams = (obj, defaultValue, underLine) => {
        const _temps = !sorter.orderWay ? defaultValue : sorter

        if (underLine) {
            Object.assign(obj, {
                ..._temps,
                orderBy: humpOrLine(_temps.orderBy, 'toLine') || null
            })
        } else {
            Object.assign(obj, _temps)
        }
    }

    const getList = async () => {
        isLoading.value = true
        try {
            const requestBody = getAxiosConfig()

            // 自定义排序
            if (requestBody.sorterOptions) {
                const { underLine = false, defaultValue = {} } = requestBody.sorterOptions || {}
                if (requestBody.data && !isEmptyObj(requestBody.data)) {
                    setSortParams(requestBody.data, defaultValue, underLine)
                }

                if (requestBody.params && !isEmptyObj(requestBody.params)) {
                    setSortParams(requestBody.params, defaultValue, underLine)
                }
            }
            const res = await request(lodash.omit(requestBody, ['autoHandleResponse', 'sorterOptions']))

            // 如果getAxiosConfig中设置自动处理列表返回数据，则执行设置好的返回数据处理方法
            if (requestBody.autoHandleResponse) handleList(res)

            if (callback) callback(res)
        } catch (e) {
            list.value = []
            total.value = 0
        } finally {
            isLoading.value = false
        }
    }

    /**
     * @description 不改变位置（检索条件为默认值）获取当前页数据，用于删除时候请求列表
     * @date 2023-01-11
     */
    const getCurrentPageList = async () => {
        const oldPage = paginator.pageNum

        await getList()

        const maxPageSize = Math.floor(total.value / paginator.pageSize)
        // 通过total 来计算oldPage是否存在如果不存在，则减少1重新请求
        if (oldPage != 1 && maxPageSize < oldPage) {
            paginator.pageNum = maxPageSize
            getList()
        }
    }

    // 常用的列表数据处理方法
    const handleList = (res) => {
        try {
            const data = res?.data?.data || {}
            const { pageNum = 1, pageSize = 20 } = paginator

            total.value = data.total || 0

            list.value = (data.list || []).map((item, index) => {
                return {
                    ...setDefaultValue(item),
                    __INDEX: index + 1 + (pageNum - 1) * pageSize
                }
            })
        } catch (error) {
            console.log('🚀 ~ handleList ~ error:', error)
        }
    }

    const tableSort = ({ order, prop }) => {
        sorter.orderBy = prop
        sorter.orderWay = getOrderWay(order)

        getList()
    }

    // 监听分页
    watch(
        () => [paginator.pageNum, paginator.pageSize],
        (currentValues, oldValues) => {
            if (oldValues?.[1] != currentValues?.[1] && paginator.pageNum != 1) {
                paginator.pageNum = 1

                return
            }

            getList()
        }
    )

    return {
        sorter,
        list,
        total,
        tableRef,
        isLoading,
        paginator,
        search,
        getList,
        tableSort,
        getCurrentPageList
    }
}
