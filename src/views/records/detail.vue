<template>
    <div class="zrx-common-page p-t-16 p-b-56">
        <div class="zrx-page-header">数据</div>

        <div class="grid grid-cols-2">
            <div>
                <div class="grid grid-cols-3 gap-col-24 gap-row-24">
                    <div>
                        <div class="zrx-info-label lh-24 f-c m-b-8">
                            跑步距离
                            <el-image src="https://api.iconify.design/mdi:map-marker-distance.svg" class="ml-8 f-c"></el-image>
                        </div>
                        <div class="zrx-info-value empty">{{ info.distance }}KM</div>
                    </div>
                    <div>
                        <div class="zrx-info-label lh-24 f-c m-b-8">
                            跑步配速
                            <el-image src="https://api.iconify.design/ph:chart-line-up.svg" class="ml-8 f-c"></el-image>
                        </div>
                        <div class="zrx-info-value empty">{{ info.paceParts }}</div>
                    </div>
                    <div>
                        <div class="zrx-info-label lh-24 f-c m-b-8">
                            跑步心率
                            <el-image src="https://api.iconify.design/streamline:heart-rate-pulse-graph.svg" class="ml-8 f-c"></el-image>
                        </div>
                        <div class="zrx-info-value empty">{{ info.heartRate }}</div>
                    </div>
                    <div>
                        <div class="zrx-info-label lh-24 f-c m-b-8">
                            跑步时长
                            <el-image src="https://api.iconify.design/material-symbols:alarm.svg" class="ml-8 f-c"></el-image>
                        </div>
                        <div class="zrx-info-value empty">{{ info.runTime }}</div>
                    </div>
                    <div>
                        <div class="zrx-info-label lh-24 f-c m-b-8">
                            跑步日期
                            <el-image src="https://api.iconify.design/material-symbols:calendar-clock.svg" class="ml-8 f-c"></el-image>
                        </div>
                        <div class="zrx-info-value empty">{{ info.startDate }}</div>
                    </div>
                    <div>
                        <div class="zrx-info-label lh-24 f-c m-b-8">
                            地点
                            <el-image src="https://api.iconify.design/material-symbols:location-on.svg" class="ml-8 f-c"></el-image>
                        </div>
                        <div class="zrx-info-value empty">{{ info.address }}</div>
                    </div>
                </div>

                <div class="h-400 bg-primary mt-24">
                    <div ref="mapRef" class="wh-full"></div>
                </div>
            </div>

            <div></div>
        </div>
    </div>
</template>

<script setup>
import Mapboxgl from 'mapbox-gl'
import * as mapboxPolyline from '@mapbox/polyline'
import 'mapbox-gl/dist/mapbox-gl.css'
import MapboxLanguage from '@mapbox/mapbox-gl-language'
import { MAPBOX_TOKEN } from '@/utils/const'

defineOptions({ name: 'recordDetail' })

const route = useRoute()
const { getDetailById } = useRun()
const info = getDetailById(route.query.id)

const mapRef = useTemplateRef('mapRef')

let map = null
const initMap = () => {
    Mapboxgl.accessToken = MAPBOX_TOKEN
    map = new Mapboxgl.Map({
        container: mapRef.value,
        style: 'mapbox://styles/mapbox/dark-v10'
    })

    map.addControl(new MapboxLanguage({ defaultLanguage: 'zh-Hans' }))

    const points = mapboxPolyline.decode(info.origin.summary_polyline)

    map.addSource('source', { data: points })
    // console.log('🚀 ~ initMap ~ C:', points)

    // // 绘制跑步轨迹
}

onMounted(() => {
    initMap()
})
</script>

<style scoped lang="scss"></style>
