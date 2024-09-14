<template>
    <div class="zrx-common-page flex-col">
        <zrx-search-box padding-x="0" @search="search" @reset="reset(search)" class="m-t-20 m-b-24">
            <zrx-search-item label="配速">
                <el-input placeholder="请输入最小配速(mm:ss)" v-model="searchCondition.pace"></el-input>
            </zrx-search-item>
            <zrx-search-item label="心率">
                <el-input placeholder="请输入最小心率" v-model="searchCondition.heartRate"></el-input>
            </zrx-search-item>
            <zrx-search-item label="距离">
                <el-input placeholder="请输入最小距离" v-model="searchCondition.distance">
                    <template #suffix>KM</template>
                </el-input>
            </zrx-search-item>
            <zrx-search-item label="运动时长">
                <el-input placeholder="请输入最小运动时长(hh:mm:ss)" v-model="searchCondition.runTime"></el-input>
            </zrx-search-item>
            <zrx-search-item label="运动日期">
                <el-date-picker
                    type="daterange"
                    end-placeholder="结束日期"
                    start-placeholder="开始日期"
                    v-model="searchCondition.dates"
                ></el-date-picker>
            </zrx-search-item>
            <zrx-search-item label="地点">
                <el-input placeholder="请输入关键词" v-model="searchCondition.address"></el-input>
            </zrx-search-item>
        </zrx-search-box>

        <div class="h-10 flex-auto">
            <el-table :data="list" height="100%">
                <el-table-column prop="moment" label="Moment" show-overflow-tooltip></el-table-column>
                <el-table-column prop="startDate" label="Date" show-overflow-tooltip></el-table-column>
                <el-table-column prop="distance" label="KM" show-overflow-tooltip></el-table-column>
                <el-table-column prop="paceParts" label="Pace" show-overflow-tooltip></el-table-column>
                <el-table-column prop="heartRate" label="BPM" show-overflow-tooltip></el-table-column>
                <el-table-column prop="runTime" label="Time" show-overflow-tooltip></el-table-column>
                <el-table-column prop="address" label="Address" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" width="160" show-overflow-tooltip>
                    <template #default="{ row }">
                        <el-button link type="primary" @click="toView(row)">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <zrx-pagination :total="total" v-model:page-size="paginator.pageSize" v-model:current-page="paginator.pageNum"></zrx-pagination>
    </div>
</template>

<script setup>
defineOptions({ name: 'records' })

const router = useRouter()
const { total, getList } = useRun()

const { searchCondition, reset } = useReset({
    pace: '',
    distance: '',
    heartRate: '',
    runTime: '',
    address: '',
    dates: []
})

const paginator = reactive({
    pageNum: 1,
    pageSize: 15
})
const list = ref([])

const search = () => {
    list.value = getList({ ...paginator, ...searchCondition })
}

// 监听分页
watch(
    () => [paginator.pageNum, paginator.pageSize],
    (currentValues, oldValues) => {
        if (oldValues?.[1] != currentValues?.[1] && paginator.pageNum != 1) {
            paginator.pageNum = 1

            return
        }

        search()
    },
    {
        immediate: true
    }
)

const toView = (row) => {
    router.push({
        path: 'recordDetail',
        query: { id: row.id }
    })
}
</script>
