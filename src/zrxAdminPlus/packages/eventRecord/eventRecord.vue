<template>
    <div class="zrx-event-record" :class="{ [pattern]: true, droppable: vmDroppable }">
        <div class="event-record-headline" v-if="slots.headline || sortable">
            <slot name="headline">
                <span class="event-record-headline-text">{{ title }}</span>
            </slot>
            <a class="btn zrx-icon-wrap" @click="onSort()" :title="{ desc: '切换为顺序', asc: '切换为倒序' }[vmSort]" v-if="sortable">
                <i class="svg-icon" :class="'zrx-icon-sort-' + vmSort"></i>
            </a>
        </div>
        <ul class="event-record-entity">
            <li
                class="event-record-panel"
                :class="{ current: current == n[rowKey] || n[setting.current], disabled: n[setting.disabled] }"
                v-for="(n, i) in record"
                :key="n[rowKey]"
            >
                <p class="event-record-dot-locate">
                    <slot name="icon" :row="n" :index="i">
                        <i class="event-record-dot-icon"></i>
                    </slot>
                </p>
                <p class="event-record-header" :class="{ active: active == n[rowKey] }" @click="onPanelClick(n)">
                    <span class="event-record-header-title" :title="n[setting.label]">{{ n[setting.label] }}</span>
                    <span class="event-record-header-date" :title="n[setting.date]" v-if="setting.date">{{ n[setting.date] }}</span>
                    <a class="btn zrx-icon-wrap" v-if="vmDroppable">
                        <i class="zrx-icon-draw-hook" :class="n.zrxEventRecordDropped && 'is-reversed'">
                            <i></i>
                            <i></i>
                        </i>
                    </a>
                </p>
                <slot :row="n" :index="i"></slot>
                <zrx-spring-box :value="n.zrxEventRecordDropped" :collapse-height="collapseHeight" v-if="vmDroppable">
                    <slot name="attachment" :row="n" :index="i"></slot>
                </zrx-spring-box>
                <slot name="attachment" :row="n" :index="i" v-else></slot>
            </li>
            <zrx-empty-state v-if="!record.length"></zrx-empty-state>
        </ul>
    </div>
</template>

<script setup>
import { generateUUID, toDateLong } from '@/zrxAdminPlus/utils'
defineOptions({ name: 'zrxEventRecord' })
const emit = defineEmits(['panelClick', 'checkChange'])
const slots = useSlots()
const defaultProp = {
    label: 'label',
    date: '', // 当prop.date定义时，才会显示时间
    current: '', // 当prop.current定义时，可以标记当前节点
    disabled: ''
}
const props = defineProps({
    value: {
        type: Array,
        default: () => []
    },
    prop: {
        type: Object,
        default: () => ({})
    },
    droppable: {
        type: Boolean,
        default: true
    },
    collapseHeight: [Number, String],
    accordion: {
        type: Boolean,
        default: false
    },
    rowKey: {
        type: String,
        default: 'zrxEventRecordId'
    },
    defaultExpandedKeys: {
        type: Array,
        default: () => []
    },
    defaultExpandAll: {
        type: Boolean,
        default: false
    },
    current: [String, Number],
    clickable: {
        type: Boolean,
        default: false
    },
    title: String,
    sortable: {
        // 组件自身是否可触发排序。注意与父组件是否可命令其排序无关
        type: Boolean,
        default: false
    },
    sortKey: String,
    sortMethod: Function, // 该属性优先于 sortKey
    initialSort: {
        // 默认初始数据的排序。如果初始时传入的数据排序方式不同，请在第一次赋值后调用sort方法同步排序
        type: String,
        default: 'desc',
        validator(v) {
            return ['desc', 'asc'].includes(v)
        }
    }
})
const record = ref([])
const active = ref('')
const vmSort = ref(props.initialSort)
const onToggle = (rowObj) => {
    if (props.accordion) {
        const exit = record.value.find((d) => d.zrxEventRecordDropped)
        if (exit && exit != rowObj && !rowObj.zrxEventRecordDropped) {
            exit.zrxEventRecordDropped = false
        }
    }
    rowObj.zrxEventRecordDropped = !rowObj.zrxEventRecordDropped
}
const onPanelClick = (rowObj) => {
    if (props.clickable) {
        if (active.value != rowObj[props.rowKey]) {
            emit('checkChange', rowObj, record.value.find((d) => d[props.rowKey] == active.value) ?? null)
            active.value = rowObj[props.rowKey]
        }
        emit('panelClick', rowObj)
    }
    if (vmDroppable.value) {
        onToggle(rowObj)
    }
}
const setExpanded = () => {
    if (props.defaultExpandAll) {
        return record.value.forEach((d) => (d.zrxEventRecordDropped = true))
    } else if (props.defaultExpandedKeys.length) {
        let list = []
        if (props.accordion) {
            list = [props.defaultExpandedKeys[0]]
        } else {
            list = [...props.defaultExpandedKeys]
        }
        list.forEach((d) => {
            const hit = record.value.find((t) => t[props.rowKey] == d)
            hit && (hit.zrxEventRecordDropped = true)
        })
    }
}
const onSort = (sortWay) => {
    if (!props.sortKey && !props.sortMethod) {
        return console.error('zrx-event-record: 请指定排序依据')
    }
    if (sortWay) {
        vmSort.value = sortWay
    } else {
        vmSort.value = ['desc', 'asc'][['desc', 'asc'].indexOf(vmSort.value) ^ 1]
    }
    if (props.sortMethod) {
        record.value.sort(props.sortMethod)
    } else if (props.sortKey) {
        record.value.sort((a, b) => (2 * ['desc', 'asc'].indexOf(vmSort.value) - 1) * (toDateLong(a[props.sortKey]) - toDateLong(b[props.sortKey])))
    }
}

const sort = (sortWay = props.initialSort) => {
    // 对外提供的排序方法不受sortable影响
    onSort(sortWay)
}

const updateSort = () => {
    // 对外提供的排序方法不受sortable影响
    onSort(vmSort.value)
}

watch(
    () => props.value,
    (newv) => {
        record.value = JSON.parse(JSON.stringify(newv)).map((d) => ({ ...d, zrxEventRecordId: generateUUID(), zrxEventRecordDropped: false }))
        setExpanded()
    },
    { immediate: true, deep: true }
)
const pattern = computed(() => {
    if (slots.attachment) {
        return 'composite'
    }
    if (props.clickable) {
        return 'clickable'
    }
})
const setting = computed(() => ({ ...defaultProp, ...props.prop }))
const vmDroppable = computed(() => props.droppable && slots.attachment)
defineExpose({ sort, updateSort })
</script>
