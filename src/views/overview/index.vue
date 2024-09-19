<template>
    <div class="h-full p-l-16 p-r-8">
        <div class="h-110 grid grid-cols-4 gap-col-16px">
            <div v-for="item in indexList" :key="item.key" :class="['zrx-common-shadow f-c rd-2px p-l-26', item.bg || 'bg-white']">
                <div :class="['size-40 rd-50% m-r-10 f-c-c', item.iconBg]">
                    <el-image :src="item.icon" class="size-24"></el-image>
                </div>
                <div>
                    <div class="c-font op-70 f-14 lh-24px m-b-6">{{ item.label }}</div>
                    <zrx-roll-number
                        breakSign
                        :value="indexData[item.key]"
                        v-if="item.type === 'number'"
                        class="font-bold f-24 c-font op-90 lh-24px"
                        :retainDecimals="item.retainDecimals || 0"
                    >
                        <span class="f-16 lh-24px font-400 c-font op-90">{{ item.unit }}</span>
                    </zrx-roll-number>
                    <div class="font-bold f-24 c-font op-90 lh-24px" v-else>{{ indexData[item.key] }}</div>
                </div>
            </div>
        </div>

        <div class="zrx-common-shadow bg-white p-24 m-t-24">
            <div v-for="(run, idx) in years" :key="idx" class="mb-24">
                <div class="zrx-page-header">{{ run[0] }}</div>

                <div class="f-c gap-col-24">
                    <template v-for="n in indexList" :key="n.key">
                        <div class="f-c" v-if="indexData[run[0]][n.key]">
                            <div class="zrx-info-label">{{ n.label }} :</div>
                            <div class="zrx-info-value empty">
                                {{ indexData[run[0]][n.key] }}
                                <span>{{ n.unit }}</span>
                            </div>
                        </div>
                    </template>
                </div>

                <el-image class="w-full" :src="icons[run[0]]"></el-image>

                <!-- <svg class="w-full">
                    <use class="wh-full" :xlink:href="icons[run[0]]"></use>
                </svg> -->
            </div>
        </div>
    </div>
</template>

<script setup>
defineOptions({ name: 'overview' })

// const yearStats = import.meta.glob('../../../assets/year_*.svg', { eager: true })
const totalStat = import.meta.glob('../../../assets/github_*.svg', { eager: true })

const icons = {}
for (const [key, value] of Object.entries(totalStat)) {
    //名称  因为这里拿到的是  ./modules/app.js ，所以需要两层处理
  var moduleName = key.split('/').at(-1)
  const name = moduleName.split('.')[0].replace('github_', '')
 
  //具体的内容，都是每个js中返回值  value.default
  icons[name] = value.default
}
console.log("🚀 ~ totalStat:", icons)

const indexList = ref([
    {
        label: '总里程',
        key: 'totalDistance',
        type: 'number',
        unit: 'KM',
        icon: 'https://api.iconify.design/arcticons:weekly-runs.svg',
        iconBg: 'bg-#E8EAF0'
    },
    {
        label: '总次数',
        key: 'totalRuns',
        unit: '次',
        type: 'number',
        icon: 'https://api.iconify.design/radix-icons:counter-clockwise-clock.svg',
        iconBg: 'bg-#E8EAF0'
    },
    { label: '平均配速', key: 'avgPace', type: 'text', unit: '', icon: 'https://api.iconify.design/bi:speedometer2.svg', iconBg: 'bg-#E8EAF0' },
    {
        label: '平均心率',
        key: 'avgHeartRate',
        type: 'number',
        unit: '',
        icon: 'https://api.iconify.design/material-symbols:favorite.svg',
        iconBg: 'bg-#E8EAF0'
    }
])

const { runRecords, years, analysisRunData, groupAllData } = useRun()
const indexData = ref({
    totalDistance: '',
    totalRuns: 0,
    avgPace: '',
    avgHeartRate: 0
})

const colorsMap = [
    { min: 0, max: 10, color: 'rgb(59 130 246 / .5)' },
    { min: 10, max: 15, color: 'rgb(239 68 246 /.5)' },
    { min: 15, max: 999, color: 'rgb(249 115 22 /.5)' }
]

indexData.value = analysisRunData(runRecords)
groupAllData()
years.forEach((value, key) => {
    indexData.value[key] = analysisRunData(value)
})
</script>

<style scoped lang="scss"></style>
