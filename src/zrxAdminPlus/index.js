// 对外入口
import './assets/style/index.scss'
import { h } from 'vue'
import elementPlus from 'element-plus'
export { ElMessage } from './utils/message'
export { ElMessageBox } from './utils/messageBox'
import { ZrxDateTimePicker } from './packages/dateTimePicker'
import { ZrxEmptyState } from './packages/emptyState'
import { ZrxInspectTable } from './packages/inspectTable'
import { ZrxLayout } from './packages/layout'
import { ZrxPagination } from './packages/pagination'
import { ZrxRollNumber } from './packages/rollNumber'
import { ZrxSearchBox } from './packages/searchBox'
import { ZrxSearchItem } from './packages/searchItem'
import { ZrxStatus } from './packages/status'
import { ZrxTableWidgets } from './packages/tableWidgets'
import { ZrxTransfer } from './packages/transfer'
import { ZrxTreeSelect } from './packages/treeSelect'
import { ZrxUpload } from './packages/upload'
import { ZrxProcess } from './packages/process'
import { ZrxPassword } from './packages/password'
import { ZrxSpringBox } from './packages/springBox'
import { ZrxEventRecord } from './packages/eventRecord'
import { ZrxTooltip } from './packages/tooltip'

const zrxComponents = [
    ZrxDateTimePicker,
    ZrxEmptyState,
    ZrxInspectTable,
    ZrxLayout,
    ZrxPagination,
    ZrxRollNumber,
    ZrxSearchBox,
    ZrxSearchItem,
    ZrxStatus,
    ZrxTableWidgets,
    ZrxTransfer,
    ZrxTreeSelect,
    ZrxUpload,
    ZrxPassword,
    ZrxSpringBox,
    ZrxEventRecord,
    ZrxTooltip
]
// const zrxComponentsObj = { ElMessage, ElMessageBox }
// const vmModules = import.meta.glob('./packages/*/*.vue', { eager: true })
// for (const path in vmModules) {
//     zrxComponents.push(vmModules[path].default)
//     zrxComponentsObj[vmModules[path].default.name.replace('zrx', 'Zrx')] = vmModules[path].default
// }

const install = (app, options = {}) => {
    const suffixIcon = () => h('i', { className: 'svg-icon zrx-icon-down-angle' })
    const clearIcon = () => h('i', { className: 'svg-icon zrx-icon-close-round' })
    const treeIcon = () => h('i', { className: 'svg-icon zrx-icon-right-angle' })
    const calendearIcon = () => h('i', { className: 'svg-icon zrx-icon-calendar' })
    const clockIcon = () => h('i', { className: 'svg-icon zrx-icon-clock' })
    const prevIcon = () => h('i', { className: 'svg-icon zrx-icon-left-angle-large' })
    const nextIcon = () => h('i', { className: 'svg-icon zrx-icon-right-angle-large' })

    app.use(elementPlus, options)
    app.use(ZrxProcess)
    zrxComponents.forEach((com) => {
        app.component(com.name, com)
    })

    // 全局重置element-plus相关组件的属性
    app._context.components.ElButton.props.type.default = 'default'
    app._context.components.ElSelect.props.clearIcon.default = clearIcon
    app._context.components.ElSelect.props.suffixIcon.default = suffixIcon
    app._context.components.ElSelectV2.props.clearIcon.default = clearIcon
    app._context.components.ElSelectV2.props.suffixIcon = 'el-select-v2'

    app._context.components.ElTimePicker.props.clearIcon.default = clearIcon
    app._context.components.ElTimePicker.props.prefixIcon.default = clockIcon
    app._context.components.ElDatePicker.props.prefixIcon.default = calendearIcon
    app._context.components.ElDatePicker.props.clearIcon.default = clearIcon
    app._context.components.ElTooltip.props.effect.default = 'light'
    app._context.components.ElTooltip.props.popperClass.default = 'zrx-tooltip'
    app._context.components.ElInputNumber.props.controlsPosition.default = 'right'

    app._context.components.ElTree.props.icon.default = treeIcon
    app._context.components.ElForm.props.labelPosition.default = 'top'
    app._context.components.ElForm.props.requireAsteriskPosition.default = 'right'

    app._context.components.ElPagination.props.prevIcon.default = prevIcon
    app._context.components.ElPagination.props.nextIcon.default = nextIcon
    app._context.components.ElPagination.props.pageSizes.default = [10, 15, 20, 40]
    // console.log('🚀 ~ install ~ app._context.components:', app._context.components)
}

export {
    ZrxDateTimePicker,
    ZrxEmptyState,
    ZrxInspectTable,
    ZrxLayout,
    ZrxPagination,
    ZrxRollNumber,
    ZrxSearchBox,
    ZrxSearchItem,
    ZrxStatus,
    ZrxTableWidgets,
    ZrxTransfer,
    ZrxTreeSelect,
    ZrxUpload,
    ZrxTooltip
}

export default {
    install
}
