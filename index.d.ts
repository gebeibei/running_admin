import type { GlobalComponents, Ref } from 'vue'

export { }
declare global {
    type ComponentInstance = {
        [Property in keyof GlobalComponents]: InstanceType<GlobalComponents[Property]>
    }

    // vue组件ref对应的类型
    type VmRef<T> = Ref<InstanceType<T>>
}

declare module 'axios/dist/types' {
    interface AxiosRequestConfig<D = any> {
        /** @description 是否携带token，默认为true */
        credentials?: boolean,
        /** @description 是否为formdata格式，默认为false */
        useFormData?: boolean,
        /** 是否自动处理返回数据 */
        autoHandleResponse: boolean,
        // /** @description 是否接口在error分支，自定义消息提示 */
        // customMessage?: boolean
    }
}