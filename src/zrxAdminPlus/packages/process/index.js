import ZrxProcess from './process'

ZrxProcess.install = function (app, option = {}) {
    // const Mask = defineComponent(Process)
    app.component(ZrxProcess.name, ZrxProcess)
    app.directive('process', {
        mounted(el, binding) {
            if (!el.zrxProcess) {
                const _el = document.createElement('div')
                el.zrxProcess = createApp(ZrxProcess, { option }).mount(_el)
                const parent = 'body' in binding.modifiers ? document.body : el
                parent.append(_el)
            }
            const background = el.getAttribute('zrx-process-background')
            background && el.zrxProcess.setBackground(background)
            for (const key in binding.modifiers) {
                if (['right', 'bottom', 'left'].includes(key)) {
                    el.zrxProcess.setLocation(key)
                }
                key == 'penetrate' && el.zrxProcess.setPenetrate()
            }
            el.zrxProcess.visible = !!binding.value
        },
        updated(el, binding) {
            if (binding.oldValue !== binding.value) {
                nextTick(() => {
                    if (binding.value) {
                        el.zrxProcess.visible = true
                        nextTick(() => el.zrxProcess.start(binding.arg))
                    } else {
                        el.zrxProcess.finish().then(() => (el.zrxProcess.visible = false))
                    }
                })
            }
        },
        unmounted(el, binding) {
            if (el.zrxProcess) {
                Reflect.deleteProperty(el, 'zrxProcess')
            }
        }
    })
}
export { ZrxProcess, ZrxProcess as default }
