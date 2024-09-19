<template>
    <div
        ref="dateTimePickerRef"
        tabindex="-1"
        @focusout="focusOutFunc"
        @mouseover="mouseover = true"
        @mouseleave="mouseover = false"
        @keydown.enter="keydownEnterFunc"
        :class="['zrx-date-time-picker', type, size, visible && 'focus', disabled && 'disabled']"
    >
        <template v-if="types.includes(type)">
            <input
                ref="inputRef"
                @focusin="!readonly && !disabled && (visible = true)"
                readonly="readonly"
                :placeholder="placeholder"
                :style="`text-align: ${align};`"
            />
        </template>
        <span :class="['clear-btn', clearIcon, computeClearBtnClassName()]" @click="clearValue" v-if="!readonly && clearable"></span>
        <span :class="['zrx-time-picker-icon', prefixIcon]"></span>
        <div class="range-input-value" v-if="rangeTypes.includes(type)">
            <input
                ref="daterangeStartInputRef"
                @focusin="daterangeFocus('start')"
                readonly="readonly"
                :placeholder="startPlaceholder"
                :style="`text-align: ${align};`"
            />
            <span :class="['icon']" ref="dateRangeIconRef">{{ rangeSeparator }}</span>
            <input
                ref="daterangeEndInputRef"
                @focusin="daterangeFocus('end')"
                readonly="readonly"
                :placeholder="endPlaceholder"
                :style="`text-align: ${align};`"
            />
        </div>
        <span class="active-dot" :style="computedActiveDotStyle()"></span>
        <div
            :class="['zrx-date-time-picker-panel', popperClass, type]"
            v-if="types.includes(type)"
            @mouseover.stop
            @mouseleave.stop
            :style="panelStyle"
            ref="panelRef"
            tabindex="-1"
            @focusout.stop="panelFocusOut"
        >
            <div class="panel-header">
                <i class="prev-btn svg-icon zrx-icon-angles-left" @click="prevPanel('year')"></i>
                <i
                    class="prev-btn svg-icon zrx-icon-left-angle"
                    @click="prevPanel('month')"
                    v-if="['date', 'week', 'datetime', 'dates'].includes(type)"
                ></i>
                <div class="panel-header-text" v-if="type === 'year'">
                    {{ yearData.options[1] }}-{{ yearData.options[yearData.options.length - 2] }}
                </div>
                <div class="panel-header-text" v-if="type === 'month'">{{ monthData.year }}</div>
                <div class="panel-header-text" v-if="type === 'date'">{{ dateData.year }}年&nbsp;&nbsp;{{ dateData.month + 1 }}月</div>
                <div class="panel-header-text" v-if="type === 'dates'">{{ datesData.year }}年&nbsp;&nbsp;{{ datesData.month + 1 }}月</div>
                <div class="panel-header-text" v-if="type === 'week'">{{ weekData.year }}年&nbsp;&nbsp;{{ weekData.month + 1 }}月</div>
                <div class="panel-header-text" v-if="type === 'datetime'">{{ datetimeData.year }}年&nbsp;&nbsp;{{ datetimeData.month + 1 }}月</div>
                <i
                    class="next-btn svg-icon zrx-icon-right-angle"
                    @click="nextPanel('month')"
                    v-if="['date', 'week', 'datetime', 'dates'].includes(type)"
                ></i>
                <i class="next-btn svg-icon zrx-icon-angles-right" @click="nextPanel('year')"></i>
            </div>
            <div class="panel-body">
                <template v-if="type === 'year'">
                    <div
                        :class="['year-item', new Date(value).getFullYear() === item && 'current', (index === 0 || index === 11) && 'gray']"
                        v-for="(item, index) in yearData.options"
                        @click="changeValue(item)"
                        :key="index"
                    >
                        <span class="num">{{ item }}</span>
                    </div>
                </template>
                <template v-if="type === 'month'">
                    <div
                        :class="['month-item', new Date(value).getFullYear() === monthData.year && new Date(value).getMonth() === item && 'current']"
                        v-for="(item, index) in monthData.options"
                        @click="changeValue(item)"
                        :key="index"
                    >
                        <span class="num">{{ item + 1 }}月</span>
                    </div>
                </template>
                <template v-if="['date'].includes(type)">
                    <div :class="['date-item', 'week-label']" v-for="week in weekDays" :key="week">
                        {{ week }}
                    </div>
                    <div
                        :key="index"
                        :class="[
                            'date-item',
                            compareSameTime(value, item, 'yyyy-MM-dd') && 'current',
                            dateData.year === item.getFullYear() && dateData.month === item.getMonth() ? 'same-month' : 'different-month',
                            compareSameTime(new Date(), item, 'yyyy-MM-dd') && 'today'
                        ]"
                        v-for="(item, index) in dateData.options"
                        @click="changeValue(item)"
                    >
                        <span class="num">{{ item.getDate() }}</span>
                    </div>
                </template>
                <template v-if="['dates'].includes(type)">
                    <div :class="['date-item', 'week-label']" v-for="week in weekDays" :key="week">
                        {{ week }}
                    </div>
                    <div
                        :key="index"
                        :class="[
                            'date-item',
                            compareDatesCurrent(item) && 'current',
                            datesData.year === item.getFullYear() && datesData.month === item.getMonth() ? 'same-month' : 'different-month',
                            compareSameTime(new Date(), item, 'yyyy-MM-dd') && 'today'
                        ]"
                        v-for="(item, index) in datesData.options"
                        @click="changeValue(item)"
                    >
                        <span class="num">{{ item.getDate() }}</span>
                    </div>
                </template>
                <template v-if="type === 'week'">
                    <div :class="['date-item', 'week-label']" v-for="week in weekDays" :key="week">
                        {{ week }}
                    </div>
                    <div
                        :key="index"
                        :class="['date-item', computeWeekItemClassName(item), compareSameTime(new Date(), item, 'yyyy-MM-dd') && 'today']"
                        v-for="(item, index) in weekData.options"
                        @click="changeValue(item)"
                        @mousemove="weekData.hoverTimestamp = item"
                        @mouseleave="weekData.hoverTimestamp = null"
                    >
                        <span class="num">{{ item.getDate() }}</span>
                    </div>
                </template>
                <template v-if="type === 'datetime'">
                    <div :class="['date-item', 'week-label']" v-for="week in weekDays" :key="week">
                        {{ week }}
                    </div>
                    <div
                        :key="index"
                        :class="[
                            'date-item',
                            compareSameTime(datetimeData.timestamp, item) && 'current',
                            datetimeData.year === item.getFullYear() && datetimeData.month === item.getMonth() ? 'same-month' : 'different-month',
                            compareSameTime(new Date(), item, 'yyyy-MM-dd') && 'today'
                        ]"
                        v-for="(item, index) in datetimeData.options"
                        @click="
                            () => {
                                datetimeData.year = item.getFullYear()
                                datetimeData.month = item.getMonth()
                                datetimeData.day = item.getDate()
                                datetimeData.timestamp = item
                                computeOptions()
                            }
                        "
                    >
                        <span class="num">{{ item.getDate() }}</span>
                    </div>
                </template>
            </div>
            <div class="panel-footer" v-if="type === 'datetime'">
                <el-button type="primary" @click="changeValue" ref="confirmBtnRef">确定</el-button>
            </div>
            <div class="time-panel-header" v-if="['datetime'].includes(type)">
                {{ datetimeData.hour.toString().padStart(2, 0) }}:{{ datetimeData.minute.toString().padStart(2, 0) }}:{{
                    datetimeData.second.toString().padStart(2, 0)
                }}
            </div>
            <div
                class="time-panel-body"
                v-if="['datetime'].includes(type)"
                :style="`height: ${Math.ceil(datetimeData.options.length / 7) * 36 + 36 + 17}px;`"
            >
                <el-scrollbar class="hour">
                    <div
                        :class="['time-item', n - 1 === datetimeData.hour && 'current']"
                        v-for="n in 24"
                        :key="n"
                        @click="
                            () => {
                                datetimeData.hour = n - 1
                            }
                        "
                    >
                        {{ (n - 1).toString().padStart(2, 0) }}
                    </div>
                </el-scrollbar>
                <el-scrollbar class="minute">
                    <div
                        :class="['time-item', n - 1 === datetimeData.minute && 'current']"
                        v-for="n in 60"
                        :key="n"
                        @click="
                            () => {
                                datetimeData.minute = n - 1
                            }
                        "
                    >
                        {{ (n - 1).toString().padStart(2, 0) }}
                    </div>
                </el-scrollbar>
                <el-scrollbar class="second">
                    <div
                        :class="['time-item', n - 1 === datetimeData.second && 'current']"
                        v-for="n in 60"
                        :key="n"
                        @click="
                            () => {
                                datetimeData.second = n - 1
                            }
                        "
                    >
                        {{ (n - 1).toString().padStart(2, 0) }}
                    </div>
                </el-scrollbar>
            </div>
        </div>
        <div
            :class="['zrx-date-time-picker-panel', popperClass, type]"
            v-if="['daterange', 'monthrange'].includes(type)"
            :style="panelStyle"
            @mouseover.stop
            @mouseleave.stop
            ref="panelRef"
            tabindex="-1"
            @focusout.stop="panelFocusOut"
        >
            <template v-for="n in 2" :key="`panel-${n}`">
                <div class="panel-header">
                    <template v-if="n === 1">
                        <i class="prev-btn svg-icon zrx-icon-angles-left" @click="prevPanel('year')"></i>
                        <i class="prev-btn svg-icon zrx-icon-left-angle" @click="prevPanel('month')" v-if="type === 'daterange'"></i>
                    </template>
                    <div class="panel-header-text" v-if="type === 'daterange'">
                        {{ daterangeData.year + (daterangeData.month + n === 13 ? 1 : 0) }}年
                        <template v-if="type === 'daterange'">{{ daterangeData.month + n === 13 ? 1 : daterangeData.month + n }}月</template>
                    </div>
                    <div class="panel-header-text" v-if="type === 'monthrange'">{{ monthrangeData.year + n - 1 }}年</div>
                    <template v-if="n === 2">
                        <i class="next-btn svg-icon zrx-icon-right-angle" @click="nextPanel('month')" v-if="type === 'daterange'"></i>
                        <i class="next-btn svg-icon zrx-icon-angles-right" @click="nextPanel('year')"></i>
                    </template>
                </div>
                <div class="panel-body">
                    <template v-if="type === 'daterange'">
                        <div :class="['date-item', 'week-label']" v-for="week in weekDays" :key="week">
                            {{ week }}
                        </div>
                        <div
                            :key="index"
                            :class="['date-item', computeDateItemClassName(item, ['first', 'last'][n - 1])]"
                            v-for="(item, index) in [daterangeData.firstPanelOptions, daterangeData.lastPanelOptions][n - 1]"
                            @mousemove="daterangeData.hoverTimestamp = item"
                            @mouseleave="daterangeData.hoverTimestamp = null"
                            @click="changeDaterangeValue(item)"
                        >
                            <span class="num">{{ item.getDate() }}</span>
                        </div>
                    </template>
                    <template v-if="type === 'monthrange'">
                        <div
                            :key="index"
                            :class="['date-item', computeDateItemClassName(item, ['first', 'last'][n - 1])]"
                            v-for="(item, index) in [monthrangeData.firstPanelOptions, monthrangeData.lastPanelOptions][n - 1]"
                            @mousemove="monthrangeData.hoverTimestamp = item"
                            @mouseleave="monthrangeData.hoverTimestamp = null"
                            @click="changeDaterangeValue(item)"
                        >
                            <span class="num">{{ item.getMonth() + 1 }}月</span>
                        </div>
                    </template>
                </div>
            </template>
        </div>
        <div
            :class="['zrx-date-time-picker-panel', popperClass, type]"
            v-if="['datetimerange'].includes(type)"
            :style="panelStyle"
            ref="panelRef"
            tabindex="-1"
            @focusout.stop="panelFocusOut"
        >
            <div class="panel-header">
                <i class="prev-btn svg-icon zrx-icon-angles-left" @click="prevPanel('year')"></i>
                <i class="prev-btn svg-icon zrx-icon-left-angle" @click="prevPanel('month')"></i>
                <div class="panel-header-text">{{ datetimerangeData.year }}年 {{ datetimerangeData.month + 1 }}月</div>
                <i class="next-btn svg-icon zrx-icon-right-angle" @click="nextPanel('month')"></i>
                <i class="next-btn svg-icon zrx-icon-angles-right" @click="nextPanel('year')"></i>
            </div>
            <div class="panel-body">
                <div :class="['date-item', 'week-label']" v-for="week in weekDays" :key="week">
                    {{ week }}
                </div>
                <div
                    :key="index"
                    :class="['date-item', computeDateItemClassName(item, datetimerangeData.operateKey)]"
                    v-for="(item, index) in datetimerangeData.panelOptions"
                    @mousemove="datetimerangeData.hoverTimestamp = item"
                    @mouseleave="datetimerangeData.hoverTimestamp = null"
                    @click="changeDaterangeValue(item)"
                >
                    <span class="num">{{ item.getDate() }}</span>
                </div>
            </div>
            <div class="time-panel-header">
                {{ datetimerangeData.hour.toString().padStart(2, 0) }}:{{ datetimerangeData.minute.toString().padStart(2, 0) }}:{{
                    datetimerangeData.second.toString().padStart(2, 0)
                }}
            </div>
            <div class="time-panel-body" :style="`height: ${Math.ceil(datetimerangeData.panelOptions.length / 7) * 36 + 36 + 17}px;`">
                <el-scrollbar class="hour">
                    <div
                        :class="['time-item', n - 1 === datetimerangeData.hour && 'current']"
                        v-for="n in 24"
                        :key="n"
                        @click="changeDatetimerangeTime('hour', n - 1)"
                    >
                        {{ (n - 1).toString().padStart(2, 0) }}
                    </div>
                </el-scrollbar>
                <el-scrollbar class="minute">
                    <div
                        :class="['time-item', n - 1 === datetimerangeData.minute && 'current']"
                        v-for="n in 60"
                        :key="n"
                        @click="changeDatetimerangeTime('minute', n - 1)"
                    >
                        {{ (n - 1).toString().padStart(2, 0) }}
                    </div>
                </el-scrollbar>
                <el-scrollbar class="second">
                    <div
                        :class="['time-item', n - 1 === datetimerangeData.second && 'current']"
                        v-for="n in 60"
                        :key="n"
                        @click="changeDatetimerangeTime('second', n - 1)"
                    >
                        {{ (n - 1).toString().padStart(2, 0) }}
                    </div>
                </el-scrollbar>
            </div>
            <div class="panel-footer">
                <el-button type="primary" @click="changeValue" ref="confirmBtnRef">确定</el-button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { formatDate, transformToDate } from '@/zrxAdminPlus/utils'
import { ElMessage } from 'element-plus'

defineOptions({ name: 'zrxDateTimePicker', inheritAttrs: false })

const emit = defineEmits(['input', 'change', 'focus', 'blur', 'visible-change'])
const props = defineProps({
    // 完全只读
    readonly: {
        type: Boolean,
        default: false
    },
    // 禁用
    disabled: {
        type: Boolean,
        default: false
    },
    // 是否显示清除按钮
    clearable: {
        type: Boolean,
        default: true
    },
    // 输入框尺寸, lager、small、mimi
    size: {
        type: String,
        default: ''
    },
    // 非范围选择时的占位内容
    placeholder: {
        type: String,
        default: '请选择'
    },
    // 范围选择时开始日期的占位内容
    startPlaceholder: {
        type: String,
        default: '开始日期'
    },
    // 范围选择时结束日期的占位内容
    endPlaceholder: {
        type: String,
        default: '结束日期'
    },
    // 显示类型, 'year/month/date/week/datetime/datetimerange/daterange/dates'
    type: {
        type: String,
        default: 'date'
    },
    // 显示在输入框中的格式
    format: {
        type: String,
        default: ''
    },
    // 对齐方式 'left, center, right'
    align: {
        type: String,
        default: 'left'
    },
    // DateTimePicker 下拉框的类名
    popperClass: {
        type: String,
        default: ''
    },
    // 选择范围时的分隔符
    rangeSeparator: {
        type: String,
        default: '-'
    },
    valueFormat: {
        type: String,
        default: ''
    },
    prefixIcon: {
        type: String,
        default: 'svg-icon zrx-icon-calendar'
    },
    clearIcon: {
        type: String,
        default: 'svg-icon zrx-icon-close'
    },
    popperAppendToBody: {
        type: Boolean,
        default: true
    }
})

const modelValue = defineModel({
    type: [String, Number, Date, Array],
    default() {
        return ''
    }
})

const overflowAttrs = ['overflow', 'overflow-x', 'overflow-y']
const types = ['year', 'month', 'date', 'week', 'datetime', 'dates']
const rangeTypes = ['daterange', 'datetimerange', 'monthrange']
const weekDays = ['一', '二', '三', '四', '五', '六', '日']
const mouseover = ref(false)
const visible = ref(false)

const yearData = ref({
    timestamp: null,
    year: null,
    options: []
})
const monthData = ref({
    timestamp: null,
    year: null,
    month: null,
    options: []
})
const dateData = ref({
    timestamp: null,
    year: null,
    month: null,
    options: []
})
const weekData = ref({
    timestamp: null,
    year: null,
    month: null,
    hoverTimestamp: null,
    options: []
})
const datetimeData = ref({
    timestamp: null,
    year: null,
    month: null,
    day: null,
    hour: 0,
    minute: 0,
    second: 0,
    options: []
})
const daterangeData = ref({
    startTimestamp: null,
    endTimestamp: null,
    hoverTimestamp: null,
    year: null,
    month: null,
    firstPanelOptions: [],
    lastPanelOptions: [],
    operateKey: 'start',
    operateTimes: 0
})
const datetimerangeData = ref({
    startTimestamp: null,
    endTimestamp: null,
    hoverTimestamp: null,
    year: null,
    month: null,
    hour: 0,
    minute: 0,
    second: 0,
    panelOptions: [],
    operateKey: 'start',
    operateTimes: 0
})
const monthrangeData = ref({
    startTimestamp: null,
    endTimestamp: null,
    hoverTimestamp: null,
    year: null,
    month: null,
    firstPanelOptions: [],
    lastPanelOptions: [],
    operateKey: 'start',
    operateTimes: 0
})
const datesData = ref({
    year: null,
    month: null,
    options: []
})
const panelStyle = ref({})

const inputRef = ref()
const daterangeStartInputRef = ref()
const daterangeEndInputRef = ref()
const confirmBtnRef = ref()
const panelRef = ref()
const dateTimePickerRef = ref()
const refRaw = { start: daterangeStartInputRef.value, end: daterangeEndInputRef.value }

const toggleMenu = (which) => {
    if (types.includes(props.type)) {
        inputRef.value?.focus()
    } else {
        refRaw[which]?.focus()
    }
}

const changeDatetimerangeTime = (key, value) => {
    datetimerangeData.value[key] = value
    key = `${datetimerangeData.value.operateKey}Timestamp`
    if (!datetimerangeData.value[key]) {
        datetimerangeData.value[key] = new Date()
    }
    datetimerangeData.value[key].setHours(datetimerangeData.value.hour)
    datetimerangeData.value[key].setMinutes(datetimerangeData.value.minute)
    datetimerangeData.value[key].setSeconds(datetimerangeData.value.second)
    computeInputShowValue()
}

const keydownEnterFunc = (event) => {
    if (rangeTypes.includes(props.type)) {
        const operateKey = typeMap[props.type].value.operateKey
        refRaw[operateKey].blur()
    } else {
        inputRef.value.blur()
    }
}

const toArray = (value) => {
    if (Array.isArray(value)) return value
    return [value]
}

const compareDatesCurrent = (dateItem) => {
    const tempArr = toArray(modelValue.value).map((n) => transformToDate(n))
    return tempArr.map((n) => compareSameTime(n, dateItem, 'yyyy-MM-dd')).includes(true)
}

const panelFocusOut = (event) => {
    if (props.popperAppendToBody && ['datetime', 'datetimerange'].includes(props.type)) {
        event.relatedTarget !== confirmBtnRef.value?.ref && !props.disabled && (visible.value = event.relatedTarget === panelRef.value)
    } else {
        !props.disabled && (visible.value = event.relatedTarget === panelRef.value)
    }
}

const compareSameTime = (prev, next, format = 'yyyy-MM-dd') => formatDate(prev, format) === formatDate(next, format)
const computePanelStyle = () => {
    const panelMargin = 4
    if (panelRef.value) {
        const tempstyle = {
            opacity: visible.value ? 1 : 0,
            pointerEvents: visible.value ? 'auto' : 'none',
            position: props.popperAppendToBody ? 'fixed' : 'absolute'
        }
        const boundingClientRect = dateTimePickerRef.value.getBoundingClientRect()
        if (!props.popperAppendToBody) {
            boundingClientRect.left + panelRef.value.offsetWidth <= window.innerWidth ? (tempstyle.left = 0) : (tempstyle.right = 0)
            if (boundingClientRect.bottom + panelRef.value.offsetHeight + panelMargin <= window.innerHeight) {
                tempstyle.bottom = `-${panelMargin}px`
                tempstyle.transformOrigin = '50% 0%'
                tempstyle.transform = `translate(0, 100%) scale(1, ${visible.value ? 1 : 0})`
            } else {
                tempstyle.top = `-${panelMargin}px`
                tempstyle.transformOrigin = '50% 100%'
                tempstyle.transform = `translate(0, -100%) scale(1, ${visible.value ? 1 : 0})`
            }
        } else {
            boundingClientRect.left + panelRef.value.offsetWidth <= window.innerWidth
                ? (tempstyle.left = `${boundingClientRect.left}px`)
                : (tempstyle.left = `${boundingClientRect.right - panelRef.value.offsetWidth}px`)
            if (boundingClientRect.bottom + panelRef.value.offsetHeight + panelMargin <= window.innerHeight) {
                tempstyle.top = `${boundingClientRect.bottom + panelMargin}px`
                tempstyle.transformOrigin = '50% 0%'
                tempstyle.transform = `scale(1, ${visible.value ? 1 : 0})`
            } else {
                tempstyle.bottom = `${window.innerHeight - boundingClientRect.top + panelMargin}px`
                tempstyle.transformOrigin = '50% 100%'
                tempstyle.transform = `scale(1, ${visible.value ? 1 : 0})`
            }
        }
        panelStyle.value = tempstyle
    }
}
const typeMap = {
    year: yearData,
    month: monthData,
    date: dateData,
    week: weekData,
    datetime: datetimeData,
    daterange: daterangeData,
    datetimerange: datetimerangeData,
    monthrange: monthrangeData,
    dates: datesData
}
const setDataByType = (type, key, value) => {
    if (typeMap?.[type]?.value?.[key]) typeMap[type].value[key] = value
}
const getValueByType = (type, key) => {
    return typeMap[type]?.value?.[key]
}

const inputVal = (val) => {
    if (props.valueFormat) {
        val = Array.isArray(val) ? val.map((n) => formatDate(n, props.valueFormat)) : formatDate(val, props.valueFormat)
    }

    modelValue.value = val
    emit('input', val)
}
const changeVal = (val) => {
    if (props.valueFormat) {
        val = Array.isArray(val) ? val.map((n) => formatDate(n, props.valueFormat)) : formatDate(val, props.valueFormat)
    }
    modelValue.value = val
    emit('change', val)
}

const inputValue = (value) => {
    inputVal(value)
    nextTick(() => changeVal(value))
}

const changeValue = (value) => {
    if (props.type === 'year') {
        yearData.value.timestamp = new Date(value, 0)
        inputValue(yearData.value.timestamp)
        yearData.value.year = value
        computeOptions()
        visible.value = false
    }
    if (props.type === 'month') {
        monthData.value.timestamp = new Date(monthData.value.year, value)
        inputValue(monthData.value.timestamp)
        visible.value = false
    }
    if (props.type === 'date') {
        dateData.value.timestamp = value
        inputValue(dateData.value.timestamp)
        if (value.getMonth() !== dateData.value.month) {
            dateData.value.month = value.getMonth()
            dateData.value.year = value.getFullYear()
            computeOptions()
        }
        visible.value = false
    }
    if (props.type === 'dates') {
        datesData.value.timestamp = value
        const tempArr = toArray(modelValue.value)
            .filter((n) => new Date(n).toString() !== 'Invalid Date' && ![null, undefined, '', NaN].includes(n))
            .map((n) => formatDate(n, 'yyyy-MM-dd'))
        const index = tempArr.indexOf(formatDate(value, 'yyyy-MM-dd'))
        index < 0 ? tempArr.push(value) : tempArr.splice(index, 1)
        const result = tempArr.map((n) => new Date(n))
        inputValue(result)
        if (value.getMonth() !== datesData.value.month) {
            datesData.value.month = value.getMonth()
            datesData.value.year = value.getFullYear()
            computeOptions()
        }
    }
    if (props.type === 'week') {
        const date = new Date(value)
        const day = date.getDay()
        date.setDate(date.getDate() - [6, 0, 1, 2, 3, 4, 5][day])
        weekData.value.timestamp = date
        inputValue(date)
        if (value.getMonth() !== weekData.value.month) {
            weekData.value.month = value.getMonth()
            weekData.value.year = value.getFullYear()
            computeOptions()
        }
        visible.value = false
    }
    if (props.type === 'datetime') {
        const date = new Date(
            datetimeData.value.year,
            datetimeData.value.month,
            datetimeData.value.day,
            datetimeData.value.hour,
            datetimeData.value.minute,
            datetimeData.value.second
        )
        inputValue(date)
        if (date.getMonth() !== datetimeData.value.month) {
            datetimeData.value.month = date.getMonth()
            datetimeData.value.year = date.getFullYear()
            computeOptions()
        }
        visible.value = false
    }
    if (props.type === 'datetimerange') {
        datetimerangeData.value.operateTimes = (datetimerangeData.value.operateTimes + 1) % 2
        if (datetimerangeData.value.operateKey === 'end') {
            if (!datetimerangeData.value.endTimestamp) {
                const now = new Date()
                now.setHours(datetimerangeData.value.hour)
                now.setMinutes(datetimerangeData.value.minute)
                now.setSeconds(datetimerangeData.value.second)
                datetimerangeData.value.endTimestamp = now
            }
            if (
                datetimerangeData.value.startTimestamp &&
                datetimerangeData.value.endTimestamp.getTime() < datetimerangeData.value.startTimestamp.getTime()
            ) {
                return (visible.value = false)
            }
            datetimerangeData.value.endTimestamp.setHours(datetimerangeData.value.hour)
            datetimerangeData.value.endTimestamp.setMinutes(datetimerangeData.value.minute)
            datetimerangeData.value.endTimestamp.setSeconds(datetimerangeData.value.second)
            if (datetimerangeData.value.startTimestamp) {
                datetimerangeData.value.hour = datetimerangeData.value.startTimestamp.getHours()
                datetimerangeData.value.minute = datetimerangeData.value.startTimestamp.getMinutes()
                datetimerangeData.value.second = datetimerangeData.value.startTimestamp.getSeconds()
                datetimerangeData.value.year = datetimerangeData.value.startTimestamp.getFullYear()
                datetimerangeData.value.month = datetimerangeData.value.startTimestamp.getMonth()
            } else {
                datetimerangeData.value.hour = datetimerangeData.value.minute = datetimerangeData.value.second = 0
            }
            if (datetimerangeData.value.operateTimes === 0) {
                visible.value = false
                datetimerangeData.value.hoverTimestamp = null
                datetimerangeData.value.startTimestamp &&
                    datetimerangeData.value.endTimestamp &&
                    inputValue([datetimerangeData.value.startTimestamp, datetimerangeData.value.endTimestamp])
            }
            datetimerangeData.value.operateKey = 'start'
            computedActiveDotStyle()
        } else if (datetimerangeData.value.operateKey === 'start') {
            if (!datetimerangeData.value.startTimestamp) {
                const now = new Date()
                now.setHours(datetimerangeData.value.hour)
                now.setMinutes(datetimerangeData.value.minute)
                now.setSeconds(datetimerangeData.value.second)
                datetimerangeData.value.startTimestamp = now
            }
            if (
                datetimerangeData.value.endTimestamp &&
                datetimerangeData.value.endTimestamp.getTime() < datetimerangeData.value.startTimestamp.getTime()
            ) {
                return (visible.value = false)
            }
            datetimerangeData.value.startTimestamp.setHours(datetimerangeData.value.hour)
            datetimerangeData.value.startTimestamp.setMinutes(datetimerangeData.value.minute)
            datetimerangeData.value.startTimestamp.setSeconds(datetimerangeData.value.second)
            if (datetimerangeData.value.endTimestamp) {
                datetimerangeData.value.hour = datetimerangeData.value.endTimestamp.getHours()
                datetimerangeData.value.minute = datetimerangeData.value.endTimestamp.getMinutes()
                datetimerangeData.value.second = datetimerangeData.value.endTimestamp.getSeconds()
                datetimerangeData.value.year = datetimerangeData.value.endTimestamp.getFullYear()
                datetimerangeData.value.month = datetimerangeData.value.endTimestamp.getMonth()
            } else {
                datetimerangeData.value.hour = datetimerangeData.value.minute = datetimerangeData.value.second = 0
            }
            if (datetimerangeData.value.operateTimes === 0) {
                visible.value = false
                datetimerangeData.value.hoverTimestamp = null
                datetimerangeData.value.startTimestamp &&
                    datetimerangeData.value.endTimestamp &&
                    inputVal([datetimerangeData.value.startTimestamp, datetimerangeData.value.endTimestamp])
            }
            datetimerangeData.value.operateKey = 'end'
            computedActiveDotStyle()
        }
        computeOptions()
    }
    nextTick(computeInputShowValue)
}

const clearValue = () => {
    if (['year', 'month', 'date', 'week', 'datetime'].includes(props.type)) {
        setDataByType(props.type, 'timestamp', null)
        inputVal(null)
        nextTick(() => changeVal(null))
    } else if (['dates'].includes(props.type)) {
        inputVal([])
        nextTick(() => changeVal([]))
    } else {
        setDataByType(props.type, 'startTimestamp', null)
        setDataByType(props.type, 'endTimestamp', null)
        inputVal([])
        nextTick(() => changeVal([]))
    }
    nextTick(computeInputShowValue)
}

const computeClearBtnClassName = () => {
    if (!mouseover.value || props.disabled || props.readonly) return 'hide'
    if (['year', 'month', 'date', 'week', 'datetime'].includes(props.type)) {
        return modelValue.value ? 'visible' : 'hide'
    }
    if (rangeTypes.includes(props.type)) {
        return modelValue.value && modelValue.value.length === 2 ? 'visible' : 'hide'
    }
    if (['dates'].includes(props.type)) {
        if (Array.isArray(modelValue.value)) {
            return modelValue.value.length ? 'visible' : 'hide'
        }
        return ![null, undefined, NaN, ''].includes(modelValue.value) ? 'visible' : 'hide'
    }
}

const focusOutFunc = (event) => {
    if (props.readonly) return false
    if (props.disabled) {
        return (visible.value = false)
    }
    if (!props.popperAppendToBody) {
        if (!event.relatedTarget) {
            return (visible.value = false)
        }
        visible.value = dateTimePickerRef.value === event.relatedTarget ? true : dateTimePickerRef.value?.contains(event.relatedTarget)
    } else {
        if (['datetime', 'datetimerange'].includes(props.type)) {
            confirmBtnRef.value?.ref !== event.relatedTarget && (visible.value = event.relatedTarget === panelRef.value)
        } else {
            visible.value = event.relatedTarget === panelRef.value
        }
    }
}

const changeDaterangeValue = (dateItem) => {
    const currentObj = typeMap[props.type].value
    const operateKey = currentObj.operateKey
    if (operateKey === 'start') {
        if (currentObj.endTimestamp && currentObj.endTimestamp < dateItem && currentObj.operateTimes === 0) {
            currentObj.endTimestamp = null
        }

        currentObj.startTimestamp = dateItem
        if (['daterange', 'monthrange'].includes(props.type)) currentObj.operateKey = 'end'
    } else if (operateKey === 'end') {
        if (currentObj.startTimestamp && currentObj.startTimestamp > dateItem && currentObj.operateTimes === 0) {
            currentObj.startTimestamp = null
        }

        currentObj.endTimestamp = dateItem
        if (['daterange', 'monthrange'].includes(props.type)) currentObj.operateKey = 'start'
    }
    if (['daterange', 'monthrange'].includes(props.type)) {
        currentObj.operateTimes = (currentObj.operateTimes + 1) % 2
        if (currentObj.operateTimes === 0) {
            currentObj.operateKey = 'start'
            visible.value = false
            currentObj.hoverTimestamp = null
            if (currentObj.startTimestamp && currentObj.endTimestamp && currentObj.startTimestamp > currentObj.endTimestamp) {
                return ElMessage.warning('起始时间不能大于结束时间')
            }
        }
        if (currentObj.startTimestamp && currentObj.endTimestamp) {
            inputVal([currentObj.startTimestamp, currentObj.endTimestamp])
            nextTick(() => changeVal([currentObj.startTimestamp, currentObj.endTimestamp]))
        }
    }
    currentObj.year = dateItem.getFullYear()
    currentObj.month = dateItem.getMonth()
    currentObj.day = dateItem.getDate()
    computeOptions()
    computeInputShowValue()
}

const computeInputShowValue = () => {
    let format
    const formatIsEmpty = [null, undefined, '', NaN].includes(props.format)
    switch (props.type) {
        case 'year':
            format = formatIsEmpty ? 'yyyy年' : props.format
            break
        case 'month':
        case 'monthrange':
            format = formatIsEmpty ? 'yyyy年 MM月' : props.format
            break
        case 'date':
        case 'dates':
            format = formatIsEmpty ? 'yyyy年 MM月 dd日' : props.format
            break
        case 'week':
            break
        case 'daterange':
            format = formatIsEmpty ? 'yyyy-MM-dd' : props.format
            break
        case 'datetime':
        case 'datetimerange':
            format = formatIsEmpty ? 'yyyy-MM-dd HH:mm:ss' : props.format
            break
    }
    props.type === 'year' && nextTick(() => (inputRef.value.value = formatDate(yearData.value.timestamp, format)))
    props.type === 'month' && nextTick(() => (inputRef.value.value = formatDate(monthData.value.timestamp, format)))
    props.type === 'date' && nextTick(() => (inputRef.value.value = formatDate(dateData.value.timestamp, format)))
    props.type === 'week' &&
        nextTick(() => {
            if (!modelValue.value) {
                return (inputRef.value.value = '')
            }
            let yearFirstDay = new Date(weekData.value.timestamp.getFullYear(), 0)
            let day = yearFirstDay.getDay()
            day !== 1 && yearFirstDay.setDate(yearFirstDay.getDate() + [1, 0, 6, 5, 4, 3, 2][day])
            const thisWeekFirstDay = new Date(
                weekData.value.timestamp.getFullYear(),
                weekData.value.timestamp.getMonth(),
                weekData.value.timestamp.getDate()
            )
            day = thisWeekFirstDay.getDay()
            day !== 1 && thisWeekFirstDay.setDate(thisWeekFirstDay.getDate() - [6, 0, 1, 2, 3, 4, 5][day])
            if (thisWeekFirstDay < yearFirstDay) {
                yearFirstDay = new Date(yearFirstDay.getFullYear() - 1, 0)
                day = yearFirstDay.getDay()
                day !== 1 && yearFirstDay.setDate(yearFirstDay.getDate() + [1, 0, 6, 5, 4, 3, 2][day])
            }
            const milliseconds = thisWeekFirstDay.getTime() - yearFirstDay.getTime()
            inputRef.value.value = `${thisWeekFirstDay.getFullYear()}年第${milliseconds / 1000 / 24 / 3600 / 7 + 1}周`
        })
    props.type === 'datetime' && nextTick(() => (inputRef.value.value = formatDate(modelValue.value, format)))
    if (props.type === 'daterange') {
        daterangeStartInputRef.value.value = daterangeData.value.startTimestamp ? formatDate(daterangeData.value.startTimestamp, format) : ''
        daterangeEndInputRef.value.value = daterangeData.value.endTimestamp ? formatDate(daterangeData.value.endTimestamp, format) : ''
    }
    props.type === 'datetimerange' &&
        nextTick(() => {
            daterangeStartInputRef.value.value = datetimerangeData.value.startTimestamp
                ? formatDate(datetimerangeData.value.startTimestamp, format)
                : ''
            daterangeEndInputRef.value.value = datetimerangeData.value.endTimestamp ? formatDate(datetimerangeData.value.endTimestamp, format) : ''
        })
    props.type === 'monthrange' &&
        nextTick(() => {
            daterangeStartInputRef.value.value = monthrangeData.value.startTimestamp ? formatDate(monthrangeData.value.startTimestamp, format) : ''
            daterangeEndInputRef.value.value = monthrangeData.value.endTimestamp ? formatDate(monthrangeData.value.endTimestamp, format) : ''
        })
    props.type === 'dates' &&
        nextTick(() => {
            let tempArr = toArray(modelValue.value)
            tempArr = tempArr.filter((n) => new Date(n).toString() !== 'Invalid Date' && ![null, undefined, '', NaN].includes(n))
            inputRef.value.value = modelValue.value ? tempArr.map((n) => formatDate(n, format)).join(',') : ''
        })
}

const computedActiveDotStyle = () => {
    if (!daterangeStartInputRef.value || !visible.value) return {}
    let left = parseInt(window.getComputedStyle(dateTimePickerRef.value).paddingLeft)
    const refDom = getValueByType(props.type, 'operateKey') === 'end' ? daterangeEndInputRef.value : daterangeStartInputRef.value
    left = refDom.getBoundingClientRect().left - dateTimePickerRef.value.getBoundingClientRect().left
    return {
        left: `${left}px`,
        display: 'inline-block',
        width: `${daterangeStartInputRef.value.offsetWidth}px`
    }
}

const daterangeFocus = (type) => {
    if (props.readonly) return false
    if (props.disabled) {
        return (visible.value = false)
    }
    visible.value = true
    const currentObj = typeMap[props.type].value
    setDataByType(props.type, 'operateTimes', 0)
    setDataByType(props.type, 'operateKey', type)
    computedActiveDotStyle()
    if (currentObj.startTimestamp && currentObj.endTimestamp) {
        let flag = false
        if (
            currentObj.startTimestamp.getFullYear() === currentObj.endTimestamp.getFullYear() &&
            currentObj.startTimestamp.getMonth() === currentObj.endTimestamp.getMonth()
        ) {
            currentObj.year = currentObj.startTimestamp.getFullYear()
            currentObj.month = currentObj.startTimestamp.getMonth()
            flag = true
            computeOptions()
        }
        if (!flag) {
            const timestampKey = type === 'start' ? 'startTimestamp' : 'endTimestamp'
            currentObj.year = currentObj[timestampKey].getFullYear()
            currentObj.month = currentObj[timestampKey].getMonth()
            if (props.type === 'daterange') {
                currentObj.month = currentObj.month - (type === 'end' ? 1 : 0)
            }
        }
    }
    if (props.type === 'datetimerange') {
        if (type === 'start' && datetimerangeData.value.startTimestamp) {
            datetimerangeData.value.hour = datetimerangeData.value.startTimestamp.getHours()
            datetimerangeData.value.minute = datetimerangeData.value.startTimestamp.getMinutes()
            datetimerangeData.value.second = datetimerangeData.value.startTimestamp.getSeconds()
        }
        if (type === 'end' && datetimerangeData.value.endTimestamp) {
            datetimerangeData.value.hour = datetimerangeData.value.endTimestamp.getHours()
            datetimerangeData.value.minute = datetimerangeData.value.endTimestamp.getMinutes()
            datetimerangeData.value.second = datetimerangeData.value.endTimestamp.getSeconds()
        }
    }

    computeOptions()
}

const computeDateItemClassName = (dateItem, panelType) => {
    const currentObj = typeMap[props.type].value
    const classNames = []
    let month = currentObj.month
    if (props.type === 'daterange') {
        month = month + (panelType === 'first' ? 0 : 1)
    }
    const date = new Date(currentObj.year, month)
    if (props.type === 'monthrange') {
        classNames.push('same-month')
    } else {
        classNames.push(date.getFullYear() === dateItem.getFullYear() && date.getMonth() === dateItem.getMonth() ? 'same-month' : 'different-month')
    }
    if (
        currentObj.startTimestamp &&
        currentObj.endTimestamp &&
        dateItem.getTime() > currentObj.startTimestamp.getTime() &&
        dateItem.getTime() < currentObj.endTimestamp.getTime()
    ) {
        classNames.push('during')
    }
    const format = ['daterange', 'datetimerange'].includes(props.type) ? 'yyyy-MM-dd' : 'yyyy-MM'
    if (currentObj.startTimestamp && formatDate(currentObj.startTimestamp, format) === formatDate(dateItem, format)) {
        if (props.type === 'daterange') {
            currentObj.month + (panelType === 'first' ? 0 : 1) === dateItem.getMonth() && classNames.push('current')
        } else {
            classNames.push('current')
        }
        classNames.push('start')
        classNames.push('during')
    }
    if (currentObj.endTimestamp && formatDate(currentObj.endTimestamp, format) === formatDate(dateItem, format)) {
        if (props.type === 'daterange') {
            currentObj.month + (panelType === 'first' ? 0 : 1) === dateItem.getMonth() && classNames.push('current')
        } else {
            classNames.push('current')
        }
        classNames.push('end')
        classNames.push('during')
    }
    ;['daterange', 'datetimerange'].includes(props.type) && dateItem.getDay() === 1 && classNames.push('start')
    ;['daterange', 'datetimerange'].includes(props.type) && dateItem.getDay() === 0 && classNames.push('end')
    const today = new Date()
    if (dateItem.getFullYear() === today.getFullYear() && dateItem.getMonth() === today.getMonth() && dateItem.getDate() === today.getDate()) {
        classNames.push('today')
    }
    if (currentObj.operateKey === 'start' && currentObj.endTimestamp) {
        const date = new Date(currentObj.endTimestamp)
        date.setHours(23)
        date.setMinutes(59)
        date.setSeconds(59)
        date.setMilliseconds(999)
        if (currentObj.hoverTimestamp) {
            if (
                dateItem.getTime() <= date.getTime() &&
                dateItem.getTime() >= currentObj.hoverTimestamp.getTime() &&
                ['daterange', 'datetimerange'].includes(props.type)
            ) {
                classNames.push('hover-during')
                if (dateItem.getDay() === 1) {
                    classNames.push('start-hover-during')
                }
                if (dateItem.getDate() === 1) {
                    classNames.push('start-hover-during')
                }
                if (formatDate(currentObj.hoverTimestamp, format) === formatDate(dateItem, format)) {
                    classNames.push('start-hover-during')
                }
                if (dateItem.getDay() === 0) {
                    classNames.push('end-hover-during')
                }
                if (new Date(dateItem.getFullYear(), dateItem.getMonth() + 1, 0).getDate() === dateItem.getDate()) {
                    classNames.push('end-hover-during')
                }
                if (formatDate(currentObj.start, format) === formatDate(dateItem, format)) {
                    classNames.push('start-hover-during')
                }

                // 添加一个类名表示是hoving的最后一个
                if (dateItem.getTime() == currentObj.hoverTimestamp.getTime()) classNames.push('current-hovering')
            }
            if (
                dateItem.getTime() <= date.getTime() &&
                dateItem.getTime() >= currentObj.hoverTimestamp.getTime() &&
                ['monthrange'].includes(props.type)
            ) {
                classNames.push('hover-during')
                if ([0, 3, 6, 9].includes(dateItem.getMonth())) {
                    classNames.push('start-hover-during')
                }
                if ([2, 5, 8, 11].includes(dateItem.getMonth())) {
                    classNames.push('end-hover-during')
                }
                if (formatDate(currentObj.endTimestamp, format) === formatDate(dateItem, format)) {
                    classNames.push('end-hover-during')
                }
                if (formatDate(currentObj.hoverTimestamp, format) === formatDate(dateItem, format)) {
                    classNames.push('start-hover-during')
                }
            }
        }
        if (dateItem.getTime() > date.getTime() && currentObj.operateTimes === 1) {
            classNames.push('disabled')
        }
    }
    if (currentObj.operateKey === 'end' && currentObj.startTimestamp) {
        const date = new Date(currentObj.startTimestamp)
        date.setHours(0)
        date.setMinutes(0)
        date.setSeconds(0)
        date.setMilliseconds(0)
        if (currentObj.hoverTimestamp) {
            if (
                dateItem.getTime() >= date.getTime() &&
                dateItem.getTime() <= currentObj.hoverTimestamp.getTime() &&
                ['daterange', 'datetimerange'].includes(props.type)
            ) {
                classNames.push('hover-during')
                if (dateItem.getDay() === 1) {
                    classNames.push('start-hover-during')
                }
                if (dateItem.getDate() === 1) {
                    classNames.push('start-hover-during')
                }
                if (formatDate(currentObj.hoverTimestamp, format) === formatDate(dateItem, format)) {
                    classNames.push('end-hover-during')
                }
                if (dateItem.getDay() === 0) {
                    classNames.push('end-hover-during')
                }
                if (new Date(dateItem.getFullYear(), dateItem.getMonth() + 1, 0).getDate() === dateItem.getDate()) {
                    classNames.push('end-hover-during')
                }
                if (currentObj.endTimestamp && formatDate(currentObj.endTimestamp, format) === formatDate(dateItem, format)) {
                    classNames.push('end-hover-during')
                }

                // 添加一个类名表示是hoving的最后一个
                if (dateItem.getTime() == currentObj.hoverTimestamp.getTime()) classNames.push('current-hovering')
            }
            if (
                dateItem.getTime() >= date.getTime() &&
                dateItem.getTime() <= currentObj.hoverTimestamp.getTime() &&
                ['monthrange'].includes(props.type)
            ) {
                classNames.push('hover-during')
                if ([0, 3, 6, 9].includes(dateItem.getMonth())) {
                    classNames.push('start-hover-during')
                }
                if ([2, 5, 8, 11].includes(dateItem.getMonth())) {
                    classNames.push('end-hover-during')
                }
                if (formatDate(currentObj.endTimestamp, format) === formatDate(dateItem, format)) {
                    classNames.push('end-hover-during')
                }
                if (formatDate(currentObj.hoverTimestamp, format) === formatDate(dateItem, format)) {
                    classNames.push('end-hover-during')
                }
            }
        }
        if (dateItem.getTime() < date.getTime() && currentObj.operateTimes === 1) {
            classNames.push('disabled')
        }
    }
    return classNames
}

const computeOptions = () => {
    if (props.type === 'year') {
        const startYear = Math.floor(yearData.value.year / 10) * 10 - 1
        yearData.value.options = []
        for (let i = 0; i < 12; i++) {
            yearData.value.options.push(startYear + i)
        }
    }
    if (props.type === 'month') {
        monthData.value.options = []
        for (let i = 0; i < 12; i++) {
            monthData.value.options.push(i)
        }
    }
    const currentObj = typeMap[props.type].value

    if (['date', 'dates'].includes(props.type)) {
        currentObj.options = []
        const startDate = new Date(currentObj.year, currentObj.month)
        let day = startDate.getDay()
        day !== 1 && startDate.setDate(startDate.getDate() - [6, 0, 1, 2, 3, 4, 5][day])
        const endDate = new Date(currentObj.year, currentObj.month + 1, 0)
        day = endDate.getDay()
        day !== 0 && endDate.setDate(endDate.getDate() + [0, 6, 5, 4, 3, 2, 1][day])
        while (startDate <= endDate) {
            currentObj.options.push(new Date(startDate))
            startDate.setDate(startDate.getDate() + 1)
        }
    }
    if (props.type === 'week') {
        weekData.value.options = []
        const startDate = new Date(weekData.value.year, weekData.value.month)
        let day = startDate.getDay()
        day !== 1 && startDate.setDate(startDate.getDate() - [6, 0, 1, 2, 3, 4, 5][day])
        const endDate = new Date(weekData.value.year, weekData.value.month + 1, 0)
        day = endDate.getDay()
        day !== 0 && endDate.setDate(endDate.getDate() + [0, 6, 5, 4, 3, 2, 1][day])
        while (startDate <= endDate) {
            weekData.value.options.push(new Date(startDate))
            startDate.setDate(startDate.getDate() + 1)
        }
    }
    if (props.type === 'datetime') {
        datetimeData.value.options = []
        const startDate = new Date(datetimeData.value.year, datetimeData.value.month)
        let day = startDate.getDay()
        day !== 1 && startDate.setDate(startDate.getDate() - [6, 0, 1, 2, 3, 4, 5][day])
        const endDate = new Date(datetimeData.value.year, datetimeData.value.month + 1, 0)
        day = endDate.getDay()
        day !== 0 && endDate.setDate(endDate.getDate() + [0, 6, 5, 4, 3, 2, 1][day])
        while (startDate <= endDate) {
            datetimeData.value.options.push(new Date(startDate))
            startDate.setDate(startDate.getDate() + 1)
        }
    }
    if (['daterange'].includes(props.type)) {
        const panelOptions = ['firstPanelOptions', 'lastPanelOptions']
        panelOptions.forEach((key, index) => {
            daterangeData.value[key] = []
            const startDate = new Date(daterangeData.value.year, daterangeData.value.month + index)
            let day = startDate.getDay()
            day !== 1 && startDate.setDate(startDate.getDate() - [6, 0, 1, 2, 3, 4, 5][day])
            const endDate = new Date(daterangeData.value.year, daterangeData.value.month + 1 + index, 0)
            day = endDate.getDay()
            day !== 0 && endDate.setDate(endDate.getDate() + [0, 6, 5, 4, 3, 2, 1][day])
            while (startDate <= endDate) {
                daterangeData.value[key].push(new Date(startDate))
                startDate.setDate(startDate.getDate() + 1)
            }
        })
    }
    if (props.type === 'monthrange') {
        const panelOptions = ['firstPanelOptions', 'lastPanelOptions']
        panelOptions.forEach((key, index) => {
            monthrangeData.value[key] = []
            for (let i = 0; i < 12; i++) {
                monthrangeData.value[key].push(new Date(monthrangeData.value.year + index, i))
            }
        })
    }
    if (props.type === 'datetimerange') {
        datetimerangeData.value.panelOptions = []
        const startDate = new Date(datetimerangeData.value.year, datetimerangeData.value.month)
        let day = startDate.getDay()
        day !== 1 && startDate.setDate(startDate.getDate() - [6, 0, 1, 2, 3, 4, 5][day])
        const endDate = new Date(datetimerangeData.value.year, datetimerangeData.value.month + 1, 0)
        day = endDate.getDay()
        day !== 0 && endDate.setDate(endDate.getDate() + [0, 6, 5, 4, 3, 2, 1][day])
        while (startDate <= endDate) {
            datetimerangeData.value.panelOptions.push(new Date(startDate))
            startDate.setDate(startDate.getDate() + 1)
        }
    }
}

const computeCurrentValue = (firstTime = false) => {
    let date = ['year', 'month', 'date', 'week', 'datetime'].includes(props.type) ? transformToDate(modelValue.value) : ''
    const valueIsEmptyOrInvalidDate =
        ![null, undefined, '', NaN].includes(modelValue.value) && new Date(modelValue.value).toString() !== 'Invalid Date'

    if (props.type === 'year') {
        yearData.value.year = date.getFullYear()
        valueIsEmptyOrInvalidDate && (yearData.value.timestamp = date)
    }
    if (props.type === 'month') {
        monthData.value.year = date.getFullYear()
        monthData.value.month = date.getMonth()
        valueIsEmptyOrInvalidDate && (monthData.value.timestamp = date)
    }
    if (props.type === 'date') {
        dateData.value.year = date.getFullYear()
        dateData.value.month = date.getMonth()
        valueIsEmptyOrInvalidDate && (dateData.value.timestamp = date)
    }
    if (props.type === 'week') {
        weekData.value.year = date.getFullYear()
        weekData.value.month = date.getMonth()
        valueIsEmptyOrInvalidDate && (weekData.value.timestamp = date)
    }
    if (props.type === 'datetime') {
        datetimeData.value.year = date.getFullYear()
        datetimeData.value.month = date.getMonth()
        datetimeData.value.day = date.getDate()
        valueIsEmptyOrInvalidDate && (datetimeData.value.timestamp = date)
    }
    if (props.type === 'daterange') {
        try {
            if (Array.isArray(modelValue.value) && modelValue.value.length === 2) {
                daterangeData.value.startTimestamp = new Date(modelValue.value[0])
                daterangeData.value.endTimestamp = new Date(modelValue.value[1])
                daterangeData.value.year = daterangeData.value.startTimestamp.getFullYear()
                daterangeData.value.month = daterangeData.value.startTimestamp.getMonth()
            } else {
                throw new Error()
            }
        } catch (e) {
            const now = new Date()
            daterangeData.value.year = now.getFullYear()
            daterangeData.value.month = now.getMonth()
        }
    }
    if (props.type === 'datetimerange') {
        try {
            if (Array.isArray(modelValue.value) && modelValue.value.length === 2) {
                datetimerangeData.value.startTimestamp = new Date(modelValue.value[0])
                datetimerangeData.value.endTimestamp = new Date(modelValue.value[1])
                datetimerangeData.value.year = datetimerangeData.value.startTimestamp.getFullYear()
                datetimerangeData.value.month = datetimerangeData.value.startTimestamp.getMonth()
            } else {
                throw new Error()
            }
        } catch (e) {
            const now = new Date()
            datetimerangeData.value.year = now.getFullYear()
            datetimerangeData.value.month = now.getMonth()
        }
    }
    if (props.type === 'dates' && firstTime) {
        const tempArr = toArray(modelValue.value)
        tempArr.filter((n) => ![null, undefined, '', NaN].includes(n) && new Date(n).toString() !== 'Invalid Date')
        date = tempArr.length ? new Date(tempArr[0]) : new Date()
        datesData.value.year = date.getFullYear()
        datesData.value.month = date.getMonth()
    }
    if (props.type === 'monthrange') {
        try {
            if (Array.isArray(modelValue.value) && modelValue.value.length === 2) {
                monthrangeData.value.startTimestamp = new Date(modelValue.value[0])
                monthrangeData.value.endTimestamp = new Date(modelValue.value[1])
                monthrangeData.value.year = monthrangeData.value.startTimestamp.getFullYear()
                monthrangeData.value.month = monthrangeData.value.startTimestamp.getMonth()
            } else {
                throw new Error()
            }
        } catch (e) {
            const now = new Date()
            monthrangeData.value.year = now.getFullYear()
            monthrangeData.value.month = now.getMonth()
        }
    }
}
const prevPanel = (type) => {
    if (type === 'year') {
        if (props.type === 'year') {
            yearData.value.year = yearData.value.year - 10
        }
        if (props.type === 'month') {
            monthData.value.year = monthData.value.year - 1
        }
        if (props.type === 'date') {
            dateData.value.year = dateData.value.year - 1
        }
        if (props.type === 'dates') {
            datesData.value.year = datesData.value.year - 1
        }
        if (props.type === 'week') {
            weekData.value.year = weekData.value.year - 1
        }
        if (props.type === 'datetime') {
            datetimeData.value.year = datetimeData.value.year - 1
        }
        if (props.type === 'daterange') {
            daterangeData.value.year = daterangeData.value.year - 1
        }
        if (props.type === 'monthrange') {
            monthrangeData.value.year = monthrangeData.value.year - 1
        }
        if (props.type === 'datetimerange') {
            datetimerangeData.value.year = datetimerangeData.value.year - 1
        }
    }
    if (type === 'month') {
        if (props.type === 'date') {
            dateData.value.month = dateData.value.month - 1
            if (dateData.value.month === -1) {
                dateData.value.month = 11
                dateData.value.year = dateData.value.year - 1
            }
        }
        if (props.type === 'dates') {
            datesData.value.month = datesData.value.month - 1
            if (datesData.value.month === -1) {
                datesData.value.month = 11
                datesData.value.year = datesData.value.year - 1
            }
        }
        if (props.type === 'week') {
            weekData.value.month = weekData.value.month - 1
            if (weekData.value.month === -1) {
                weekData.value.month = 11
                weekData.value.year = weekData.value.year - 1
            }
        }
        if (props.type === 'datetime') {
            datetimeData.value.month = datetimeData.value.month - 1
            if (datetimeData.value.month === -1) {
                datetimeData.value.month = 11
                datetimeData.value.year = datetimeData.value.year - 1
            }
        }
        if (props.type === 'daterange') {
            daterangeData.value.month = daterangeData.value.month - 1
            if (daterangeData.value.month === -1) {
                daterangeData.value.month = 11
                daterangeData.value.year = daterangeData.value.year - 1
            }
        }
        if (props.type === 'datetimerange') {
            datetimerangeData.value.month = datetimerangeData.value.month - 1
            if (datetimerangeData.value.month === -1) {
                datetimerangeData.value.month = 11
                datetimerangeData.value.year = datetimerangeData.value.year - 1
            }
        }
    }
    computeOptions()
}

const nextPanel = (type) => {
    if (type === 'year') {
        if (props.type === 'year') {
            yearData.value.year = yearData.value.year + 10
        }
        if (props.type === 'month') {
            monthData.value.year = monthData.value.year + 1
        }
        if (props.type === 'date') {
            dateData.value.year = dateData.value.year + 1
        }
        if (props.type === 'dates') {
            datesData.value.year = datesData.value.year + 1
        }
        if (props.type === 'week') {
            weekData.value.year = weekData.value.year + 1
        }
        if (props.type === 'datetime') {
            datetimeData.value.year = datetimeData.value.year + 1
        }
        if (props.type === 'daterange') {
            daterangeData.value.year = daterangeData.value.year + 1
        }
        if (props.type === 'monthrange') {
            monthrangeData.value.year = monthrangeData.value.year + 1
        }
        if (props.type === 'datetimerange') {
            datetimerangeData.value.year = datetimerangeData.value.year + 1
        }
    }
    if (type === 'month') {
        if (props.type === 'date') {
            dateData.value.month = dateData.value.month + 1
            if (dateData.value.month === 12) {
                dateData.value.month = 0
                dateData.value.year = dateData.value.year + 1
            }
        }
        if (props.type === 'dates') {
            datesData.value.month = datesData.value.month + 1
            if (datesData.value.month === 12) {
                datesData.value.month = 0
                datesData.value.year = datesData.value.year + 1
            }
        }
        if (props.type === 'week') {
            weekData.value.month = weekData.value.month + 1
            if (weekData.value.month === 12) {
                weekData.value.month = 0
                weekData.value.year = weekData.value.year + 1
            }
        }
        if (props.type === 'datetime') {
            datetimeData.value.month = datetimeData.value.month + 1
            if (datetimeData.value.month === 12) {
                datetimeData.value.month = 0
                datetimeData.value.year = datetimeData.value.year + 1
            }
        }
        if (props.type === 'daterange') {
            daterangeData.value.month = daterangeData.value.month + 1
            if (daterangeData.value.month === 12) {
                daterangeData.value.month = 0
                daterangeData.value.year = daterangeData.value.year + 1
            }
        }
        if (props.type === 'datetimerange') {
            datetimerangeData.value.month = datetimerangeData.value.month + 1
            if (datetimerangeData.value.month === 12) {
                datetimerangeData.value.month = 0
                datetimerangeData.value.year = datetimerangeData.value.year + 1
            }
        }
    }
    computeOptions()
}

const computeWeekItemClassName = (dateItem) => {
    const classNames = []
    const date = new Date(dateItem)
    let day = date.getDay()
    date.setDate(date.getDate() - [6, 0, 1, 2, 3, 4, 5][day])
    const currentDate = new Date(modelValue.value)
    day = currentDate.getDay()
    currentDate.setDate(currentDate.getDate() - [6, 0, 1, 2, 3, 4, 5][day])
    if (date.getFullYear() === currentDate.getFullYear() && date.getMonth() === currentDate.getMonth() && date.getDate() === currentDate.getDate()) {
        classNames.push('current')
    }
    if (weekData.value.hoverTimestamp) {
        const startDate = new Date(weekData.value.hoverTimestamp)
        day = startDate.getDay()
        day !== 1 && startDate.setDate(startDate.getDate() - [6, 0, 1, 2, 3, 4, 5][day])
        const endDate = new Date(weekData.value.hoverTimestamp)
        day = endDate.getDay()
        day !== 0 && endDate.setDate(endDate.getDate() + [0, 6, 5, 4, 3, 2, 1][day])
        startDate.setHours(0)
        startDate.setMinutes(0)
        startDate.setSeconds(0)
        startDate.setMilliseconds(0)
        endDate.setHours(23)
        endDate.setMinutes(59)
        endDate.setSeconds(59)
        endDate.setMilliseconds(999)
        if (dateItem.getTime() >= startDate.getTime() && dateItem.getTime() <= endDate.getTime()) {
            classNames.push('hover')
        }
    }
    classNames.push(weekData.value.year === dateItem.getFullYear() && weekData.value.month === dateItem.getMonth() ? 'same-month' : 'different-month')
    return classNames
}

watch(
    () => modelValue.value,
    (newVal) => {
        const currentObj = typeMap[props.type].value
        if (['year', 'month', 'date', 'week', 'datetime'].includes(props.type) && !newVal) {
            currentObj.timestamp = null
        }
        if (['datetime'].includes(props.type) && !newVal) {
            datetimeData.value.hour = datetimeData.value.minute = datetimeData.value.second = 0
        }
        if (rangeTypes.includes(props.type)) {
            if (newVal[0] && newVal[1]) {
                currentObj.startTimestamp = transformToDate(newVal[0])
                currentObj.endTimestamp = transformToDate(newVal[1])
            } else {
                currentObj.startTimestamp = currentObj.endTimestamp = null
                currentObj.hour = currentObj.minute = currentObj.second = 0
            }
        }
        nextTick(computeInputShowValue)
    }
)

watch(
    () => visible.value,
    (newVal) => {
        emit(newVal ? 'focus' : 'blur')
        const currentObj = typeMap[props.type].value
        if (rangeTypes.includes(props.type) && !newVal && modelValue.value.length !== 2) {
            currentObj.startTimestamp = currentObj.endTimestamp = null
            props.type === 'datetimerange' && (datetimerangeData.value.hour = datetimerangeData.value.minute = datetimerangeData.value.second = 0)
        }
        // datetime 需要点确认按钮，没有点确认按钮的时候，panel 展示的时间需要还原到原来
        if (newVal && ['datetime'].includes(props.type) && ![null, undefined, NaN, ''].includes(modelValue.value)) {
            datetimeData.value.timestamp = transformToDate(modelValue.value)
            datetimeData.value.hour = Number(formatDate(datetimeData.value.timestamp, 'HH'))
            datetimeData.value.minute = Number(formatDate(datetimeData.value.timestamp, 'mm'))
            datetimeData.value.second = Number(formatDate(datetimeData.value.timestamp, 'ss'))
        }
        // datetimerange 需要点确认按钮，没有点确认按钮的时候，panel 展示的时间需要还原到原来
        if (['datetimerange'].includes(props.type) && modelValue.value.length === 2) {
            datetimerangeData.value.startTimestamp = transformToDate(modelValue.value[0])
            datetimerangeData.value.endTimestamp = transformToDate(modelValue.value[1])
        }
        if (newVal && props.popperAppendToBody) {
            const maxZIndex = Math.max(...[...document.body.children].map((dom) => Number(window.getComputedStyle(dom).zIndex) || 0))
            panelRef.value.style.zIndex = (maxZIndex || 0) + 1
        }
        computeCurrentValue(false)
        computeInputShowValue()
        computeOptions()
        computePanelStyle()
        emit('visible-change', newVal)
    }
)

const addScrollEvent = () => {
    const node = dateTimePickerRef.value?.parentNode
    if (!node) return
    const parentNodeStyle = window.getComputedStyle(node)
    overflowAttrs.map((attribute) => parentNodeStyle[attribute]).some((n) => ['scroll', 'auto'].includes(n)) &&
        node?.addEventListener('scroll', computePanelStyle)
}

const removeScrollEvent = () => {
    const node = dateTimePickerRef.value?.parentNode
    if (!node) return
    props.popperAppendToBody && [...document.body.children].includes(panelRef.value) && document.body.removeChild(panelRef.value)
    node?.removeEventListener('scroll', computePanelStyle)
}

onMounted(() => {
    computeCurrentValue(true)
    computeInputShowValue()
    computeOptions()
    nextTick(computePanelStyle)
    if (props.popperAppendToBody && ![...document.body.children].includes(panelRef.value)) {
        const maxZIndex = Math.max(...[...document.body.children].map((dom) => Number(window.getComputedStyle(dom).zIndex) || 0))
        panelRef.value.style.zIndex = (maxZIndex || 0) + 1
        document.body.appendChild(panelRef.value)
    }
    addScrollEvent()
})

onActivated(() => {
    if (props.popperAppendToBody && ![...document.body.children].includes(panelRef.value)) {
        const maxZIndex = Math.max(...[...document.body.children].map((dom) => Number(window.getComputedStyle(dom).zIndex) || 0))
        panelRef.value.style.zIndex = (maxZIndex || 0) + 1
        document.body.appendChild(panelRef.value)
    }
    addScrollEvent()
})

onDeactivated(removeScrollEvent)

onBeforeUnmount(removeScrollEvent)
</script>
