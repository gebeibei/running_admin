import { getDict } from '@/utils'

/** 诉求来源 */
export const sourceOptions = /** @type { const } */ ([
    { label: '平台诉求', value: '01' },
    { label: '热线诉求', value: '02' },
    { label: '走访诉求', value: '03' },
    { label: '其他诉求', value: '04' }
])

/** @type { ToKeyValue<typeof sourceOptions, 'value', 'label'> } */
export const sourceOptionDict = getDict(sourceOptions, 'value', 'label')
