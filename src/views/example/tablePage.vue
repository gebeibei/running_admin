<template>
    <div class="zrx-common-page flex-col" v-loading="isLoading">
        <zrx-search-box padding-x="0" @search="search" @reset="reset(search)" class="m-t-20 m-b-24">
            <zrx-search-item label="企业名称">
                <el-input placeholder="请输入关键字" v-model="searchCondition.companyName"></el-input>
            </zrx-search-item>

            <zrx-search-item label="企业类型">
                <el-cascader
                    filterable
                    clearable
                    placeholder="请选择企业类型"
                    :options="industryOptions"
                    v-model="searchCondition.industry"
                    :props="{ value: 'code', label: 'label', checkStrictly: true }"
                ></el-cascader>
            </zrx-search-item>

            <zrx-search-item label="注册手机号">
                <el-input placeholder="请输入关键字" v-model="searchCondition.mobileNumber"></el-input>
            </zrx-search-item>

            <zrx-search-item label="创建时间">
                <el-date-picker
                    type="daterange"
                    end-placeholder="结束时间"
                    start-placeholder="开始时间"
                    v-model="searchCondition.createDates"
                ></el-date-picker>
            </zrx-search-item>

            <zrx-search-item label="账号状态">
                <el-select placeholder="请选择账号状态" v-model="searchCondition.accountStatus">
                    <el-option label="全部" value=""></el-option>
                    <el-option :label="item.label" :value="item.value" v-for="item in statusOptions" :key="item.value"></el-option>
                </el-select>
            </zrx-search-item>
        </zrx-search-box>

        <div class="h-32 m-b-16">
            <el-button @click="toNew()">
                <i class="svg-icon zrx-icon-add"></i>
                新增
            </el-button>
            <el-button @click="toView()">
                <i class="svg-icon zrx-icon-eye"></i>
                详情
            </el-button>
            <zrx-dropdown class="m-x-12" btnText="更改账号状态" @command="onCommand">
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item v-for="n in statusOptions.filter((item) => item.label != '注销')" :command="n.value" :key="n.value">
                            {{ n.label }}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </zrx-dropdown>
        </div>
        <div class="h-10 flex-auto">
            <el-table
                ref="tableRef"
                :data="list"
                height="100%"
                @sort-change="tableSort"
                @select="handleSelectionChange"
                @select-all="handleSelectionAllChange"
                :default-sort="{ prop: 'createDate', order: 'descending' }"
            >
                <el-table-column type="selection" :width="selectionWidth" :selectable />
                <el-table-column prop="companyName" label="企业名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="industry" label="企业类型" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ row.industry?.replace(/,/g, '/') }}
                    </template>
                </el-table-column>
                <el-table-column prop="mobileNumber" label="注册手机号" width="150" show-overflow-tooltip></el-table-column>
                <el-table-column prop="createBy" label="创建人" width="150" show-overflow-tooltip>
                    <template #default="{ row }">
                        {{ row._origin.createBy || '企业注册' }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="createDate"
                    label="创建时间"
                    sortable="custom"
                    :width="G.dateWidth"
                    show-overflow-tooltip
                    :sort-orders="['ascending', 'descending']"
                ></el-table-column>
                <el-table-column prop="accountStatus" label="账号状态" width="120" show-overflow-tooltip>
                    <template #default="{ row }">
                        <zrx-status :type="statusOptions.find((item) => item.value === row.accountStatus)?.type" v-if="row?._origin?.accountStatus">
                            {{ statusOptions.find((item) => item.value === row.accountStatus)?.label }}
                        </zrx-status>
                        <span v-else class="is-empty"></span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="160" show-overflow-tooltip>
                    <template #default="{ row }">
                        <el-button link type="primary" @click="toNew(row)">编辑</el-button>
                        <el-button link type="primary">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <zrx-pagination :total="total" v-model:page-size="paginator.pageSize" v-model:current-page="paginator.pageNum"></zrx-pagination>
    </div>
</template>

<script setup>
import lodash from 'lodash'
import { G } from '@/config/global'
import { apiKeyMap } from '@/config/apiKeyMap'
import { formatDate } from '@/utils'
// import { request } from '@/config/axios'
// import { ElMessage } from '@/zrxAdminPlus'
import { getDictInfo } from '@/utils/common'

defineOptions({ name: 'tablePage' })

const { onAlive } = useAlive()
const router = useRouter()
const industryOptions = ref([])
const FLAG = /** @type { const } */ ({
    启用: '1',
    禁用: '0',
    注销: '2'
})
const statusOptions = [
    { label: '启用', value: FLAG['启用'], type: 'success' },
    { label: '禁用', value: FLAG['禁用'], type: 'warning' },
    { label: '注销', value: FLAG['注销'], type: 'error' }
]
const { searchCondition, reset } = useReset({
    companyName: '',
    industry: [],
    accountStatus: '',
    mobileNumber: '',
    createDates: []
})

const getAxiosConfig = () => {
    return {
        method: 'post',
        data: {
            ...paginator,
            ...lodash.omit(searchCondition, ['createDates', 'industry']),
            industry: searchCondition.industry?.join('/'),
            createDateStart: formatDate(searchCondition.createDates?.[0]),
            createDateEnd: formatDate(searchCondition.createDates?.[1], 'yyyy-MM-dd 23:59:59')
        },
        sorterOptions: {
            defaultValue: {
                orderWay: 'desc',
                orderBy: 'createDate'
            }
        },
        autoHandleResponse: true,
        url: apiKeyMap.enterpriseManage.page
    }
}
const { isLoading, tableRef, paginator, list, total, search, getList, tableSort } = useTableList(getAxiosConfig, () => {
    setTableRowSelected()
})
search()

const selectable = (row) => row.accountStatus != FLAG['注销']
const { selectionWidth, multipleSelection, setTableRowSelected, handleSelectionChange, handleSelectionAllChange } = useSelection(
    list,
    tableRef,
    'id',
    selectable
)

getDictInfo('industry')
    .then((data) => {
        industryOptions.value = data
    })
    .catch((err) => err)

const toNew = (row) => {
    router.push({
        path: 'form',
        query: row ? { id: row.id } : null
    })
}

const toView = (row) => {
    router.push({
        path: 'detail',
        query: row ? { id: row.id } : null
    })
}

const onCommand = (command) => {
    request({
        method: 'post',
        params: {
            accountStatus: command,
            userIdList: multipleSelection.value.map((n) => n.id)?.join(',')
        },
        url: apiKeyMap.enterpriseManage.changeStatus
    })
        .then((res) => {
            ElMessage.success(`成功更改状态为${command === FLAG['禁用'] ? '禁用' : '启用'}`)

            multipleSelection.value = []
            // 列表按照创建时间排序，操作不改变排序
            getList()
        })
        .catch((err) => err)
}

onAlive((action) => {
    action == 'add' ? search() : getList()
})
</script>
