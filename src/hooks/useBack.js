import lodash from 'lodash'
import { breadcrumbs } from '@/config/breadcrumb'

/**
 * @description 关于页面返回需要校验是否操作数据的方法
 * @param { Object } props
 * @param { Function } props.getData 获取拷贝数据的方法
 * @date 2024-05-07
 */
export const useBack = (props = {}) => {
    const { getData } = props
    let dataCopy = null
    const needVolid = ref(true)
    const route = useRoute()
    const router = useRouter()
    const { getPathTrack } = useBreadcrumb()
    const pathTrack = getPathTrack(route)

    /** 拷贝数据 */
    const copyData = () => {
        return lodash.cloneDeep(getData())
    }

    /** 返回列表 */
    const onBack = () => {
        router.replace(pathTrack.at(-2))
    }

    /** 拷贝数据 */
    const setDataCopy = () => {
        dataCopy = copyData()
    }

    const setVolidBackMethod = (name, cb) => {
        const currentPageInfo = breadcrumbs.find((item) => item.name == name)
    
        if (currentPageInfo) {
            currentPageInfo.needBackTips = cb
        }
    }

    setVolidBackMethod(route.name, () => {
        return needVolid.value && !lodash.isEqual(dataCopy, copyData())
    })

    return {
        needVolid,
        setDataCopy,
        onBack
    }
}
