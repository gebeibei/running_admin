/**
 * @description 关于表单的一些通用方法
 * @template T
 * @param { T } data 表单初始化数据的对象
 * @date 2024-05-06
 */
export const useForm = (data) => {
    /** @type { Rwf<import('element-plus').FormInstance> } */
    const formRef = ref()
    const { searchCondition: formData, reset } = useReset(data)

    /**
     * @description 简化表单的校验方法，若校验失败，则滚动页面到第一个报错的表单项
     * @param { Function } onValidSuccess 校验通过需要执行的方法
     * @param { Function } onValidError 校验失败需要执行的方法
     * @date 2024-05-06
     */
    const validate = (onValidSuccess = () => {}, onValidError = () => {}) => {
        formRef.value?.validate((valid) => {
            if (valid) {
                onValidSuccess()
            } else {
                onValidError()
                const errorDom = formRef.value?.$el.querySelector('.el-form-item.is-error')

                if (errorDom) errorDom.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
        })
    }

    return {
        formRef,
        formData,
        reset,
        validate
    }
}
