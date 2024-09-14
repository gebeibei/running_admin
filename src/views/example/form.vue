<template>
    <div class="zrx-common-page p-t-16 p-b-56 of-y-auto" v-loading="isLoading">
        <div class="f-16 font-bold lh-40 m-b-16">企业信息</div>
        <el-form :model="formData" :rules ref="formRef" class="grid grid-cols-4 gap-col-32">
            <el-form-item label="统一社会信用代码" prop="creditCode">
                <el-input
                    maxlength="18"
                    show-word-limit
                    :disabled="!!route.query.id"
                    v-model="formData.creditCode"
                    placeholder="请输入统一社会信用代码"
                ></el-input>
            </el-form-item>
            <el-form-item label="企业名称" prop="companyName">
                <el-input
                    maxlength="64"
                    show-word-limit
                    :disabled="!!route.query.id"
                    placeholder="请输入企业名称"
                    v-model="formData.companyName"
                ></el-input>
            </el-form-item>
            <el-form-item label="企业类型" prop="industry" class="grid-col-start-3 grid-col-end--1">
                <el-cascader
                    filterable
                    popper-class="custom"
                    v-model="formData.industry"
                    placeholder="请选择企业类型"
                    :options="industryOptions"
                    :props="{ value: 'code', label: 'label', checkStrictly: true }"
                >
                    <template #default="{ data }">
                        <span :title="data.label">{{ data.label }}</span>
                    </template>
                </el-cascader>
            </el-form-item>
            <el-form-item label="主体类型" prop="companyType">
                <el-select placeholder="请选择主体类型" v-model="formData.companyType">
                    <el-option :label="item.label" :value="item.code" v-for="item in companyTypeOptions" :key="item.code"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="企业法人" prop="legalPerson">
                <el-input v-model="formData.legalPerson" placeholder="请输入企业法人" maxlength="32" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="企业法人电话" prop="legalPersonPhone">
                <el-input v-model="formData.legalPersonPhone" placeholder="请输入企业法人电话"></el-input>
            </el-form-item>
            <el-form-item label="企业联系人" prop="contactName">
                <el-input v-model="formData.contactName" placeholder="请输入企业联系人" maxlength="32" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="企业联系人职务">
                <el-input v-model="formData.contactDuty" placeholder="请输入企业联系人职务" maxlength="32" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="企业联系人电话" prop="contactPhone">
                <el-input v-model="formData.contactPhone" placeholder="请输入企业联系人电话"></el-input>
            </el-form-item>
            <el-form-item label="电子邮箱" prop="contactEmail">
                <el-input v-model="formData.contactEmail" placeholder="请输入电子邮箱" maxlength="32" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="注册地址" prop="registerAddress" class="grid-col-start-1">
                <el-cascader
                    filterable
                    ref="registerAddressStreetRef"
                    :options="zoneOptions"
                    placeholder="请选择省份/地市/区县"
                    v-model="formData.registerAddress"
                    @change="onChange('registerAddressStreet')"
                    :props="{ value: 'label', label: 'label' }"
                >
                    <template #default="{ data }">
                        <span :title="data.label">{{ data.label }}</span>
                    </template>
                </el-cascader>
            </el-form-item>
            <el-form-item prop="registerAddressStreet" class="no-required-form-item">
                <template #label><div class="h-20"></div></template>
                <el-select filterable placeholder="请选择镇街、园区" v-model="formData.registerAddressStreet">
                    <el-option
                        v-for="item in streetOptions.registerAddressStreet"
                        :key="item.label"
                        :label="item.label"
                        :value="item.label"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="registerAddressDetail" class="no-required-form-item">
                <template #label><div class="h-20"></div></template>
                <el-input
                    show-word-limit
                    maxlength="64"
                    placeholder="请输入详细地址"
                    v-model="formData.registerAddressDetail"
                ></el-input>
            </el-form-item>
            <el-form-item label="实际办公地址" prop="companyAddress" class="grid-col-start-1">
                <el-cascader
                    filterable
                    :options="zoneOptions"
                    ref="companyAddressStreetRef"
                    placeholder="请选择省份/地市/区县"
                    v-model="formData.companyAddress"
                    @change="onChange('companyAddressStreet')"
                    :props="{ value: 'label', label: 'label' }"
                >
                    <template #default="{ data }">
                        <span :title="data.label">{{ data.label }}</span>
                    </template>
                </el-cascader>
            </el-form-item>
            <el-form-item prop="companyAddressStreet" class="no-required-form-item">
                <template #label><div class="h-20"></div></template>
                <el-select filterable placeholder="请选择镇街、园区" v-model="formData.companyAddressStreet">
                    <el-option
                        v-for="item in streetOptions.companyAddressStreet"
                        :key="item.label"
                        :label="item.label"
                        :value="item.label"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="companyAddressDetail" class="no-required-form-item">
                <template #label><div class="h-20"></div></template>
                <el-input v-model="formData.companyAddressDetail" placeholder="请输入详细地址" maxlength="64" show-word-limit></el-input>
            </el-form-item>
            <el-button class="m-t-24" type="primary" @click="equalizeAddress">复制注册地址</el-button>
            <div class="f-16 font-bold lh-40 m-b-16 grid-col-start-1 grid-col-end--1">账号信息</div>
            <el-form-item label="注册手机号" prop="mobileNumber">
                <el-input v-model="formData.mobileNumber" placeholder="请输入注册手机号" maxlength="11" show-word-limit></el-input>
            </el-form-item>
        </el-form>

        <ZrxBottomBar>
            <el-button type="primary" @click="onSubmit">保存</el-button>
            <el-button @click="onBack">返回</el-button>
        </ZrxBottomBar>
    </div>
</template>

<script setup>
import lodash from 'lodash'
import { ElMessage } from 'zrx-admin-plus'
import validateRules from '@/utils/validateRules'
import { apiKeyMap } from '@/config/apiKeyMap'
import { request } from '@/config/axios'
import { getDictInfo } from '@/utils/common'
import { G } from '@/config/global'

const route = useRoute()
const { setActivated } = useAlive()
const { updateBreadcrumb } = useBreadcrumb()
const industryOptions = ref([])
const zoneOptions = ref([])
const registerAddressStreetRef = ref()
const companyAddressStreetRef = ref()
const streetOptions = reactive({
    registerAddressStreet: [],
    companyAddressStreet: []
})
const companyTypeOptions = ref([])
const { formData, formRef, validate } = useForm({
    creditCode: '',
    companyName: '',
    industry: [],
    companyType: '',
    legalPerson: '',
    legalPersonPhone: '',
    contactName: '',
    contactPhone: '',
    contactDuty: '',
    contactEmail: '',
    registerAddress: [...G.defaultOrg] || [],
    registerAddressDetail: '',
    registerAddressStreet: '',
    companyAddress: [...G.defaultOrg] || [],
    companyAddressStreet: '',
    companyAddressDetail: '',
    mobileNumber: ''
})
const rules = {
    creditCode: [
        { required: true, message: '请输入统一社会信用代码', trigger: 'blur' },
        { validator: validateRules.usccValidator, trigger: 'blur' }
    ],
    companyName: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
    legalPerson: [{ required: true, message: '请输入企业法人', trigger: 'blur' }],
    industry: [{ required: true, message: '请选择企业类型', trigger: 'change' }],
    companyType: [{ required: true, message: '请选择主体类型', trigger: 'change' }],
    legalPersonPhone: [
        { required: false, message: '请输入企业法人电话', trigger: 'blur' },
        { validator: validateRules.checkPhoneNum, trigger: 'blur' }
    ],
    contactName: [{ required: true, message: '请输入企业联系人', trigger: 'blur' }],
    contactPhone: [
        { required: true, message: '请输入企业联系人电话', trigger: 'blur' },
        { validator: validateRules.checkPhoneNum, trigger: 'blur' }
    ],
    contactEmail: [{ required: false }, { validator: validateRules.checkMail, trigger: 'blur' }],
    registerAddress: [{ required: true, message: '请选择省份/地市/区县', trigger: 'change' }],
    registerAddressStreet: [{ required: true, message: '请选择镇街、园区', trigger: 'change' }],
    registerAddressDetail: [{ required: true, message: '请输入详细地址', trigger: ['blur', 'change'] }],
    companyAddress: [{ required: true, message: '请选择省份/地市/区县', trigger: 'change' }],
    companyAddressStreet: [{ required: true, message: '请选择镇街、园区', trigger: 'change' }],
    companyAddressDetail: [{ required: true, message: '请输入详细地址', trigger: ['blur', 'change'] }],
    mobileNumber: [
        { required: false, message: '请输入注册手机号', trigger: 'blur' },
        { validator: validateRules.checkPhone, trigger: 'blur' }
    ]
}

const { needVolid, onBack, setDataCopy } = useBack({ getData: () => formData })

const onSubmit = () => {
    needVolid.value = false
    validate(
        () => {
            const requestBody = {
                ...lodash.omit(formData, ['companyAddressStreet', 'registerAddressStreet']),
                industry: formData.industry.join('/'),
                companyAddress: `${formData.companyAddress.join(',')}/${formData.companyAddressStreet}`,
                registerAddress: `${formData.registerAddress.join(',')}/${formData.registerAddressStreet}`
            }

            if (route.query.id) requestBody.id = route.query.id
            request({
                method: 'post',
                data: requestBody,
                url: apiKeyMap.enterpriseManage.addEdit
            })
                .then((res) => {
                    const data = res.data?.data || {}

                    setActivated(route.query.id ? 'edit' : 'add')
                    ElMessage.success(`${route.query.id ? '编辑' : '新增'}成功`)

                    onBack()
                })
                .catch(() => {
                    needVolid.value = true
                })
                .finally(() => {
                    // 接口通过
                    // needVolid.value = true
                })
        },
        () => {
            needVolid.value = true
        }
    )
}

const equalizeAddress = () => {
    if (formData.registerAddress) {
        formData.companyAddress = formData.registerAddress
    }
    if (formData.registerAddressDetail) {
        formData.companyAddressDetail = formData.registerAddressDetail
    }
    if (formData.registerAddressStreet) {
        formData.companyAddressStreet = formData.registerAddressStreet
    }
}

/**
 * @description 请求镇街、园区数据
 * @param { String } code 所选区的code
 * @param { 'companyAddressStreet' | 'registerAddressStreet' | '' } key 需要赋值变量的key
 * @date 2024-05-30
 */
const getStreetOptions = (code, key) => {
    request({
        method: 'get',
        params: { parentCode: code },
        url: apiKeyMap.common.dicInfoByParentCode
    })
        .then((res) => {
            const data = res.data.data || []
            if (key) {
                streetOptions[key] = data
            } else {
                streetOptions.companyAddressStreet = data
                streetOptions.registerAddressStreet = data
            }
        })
        .catch((err) => err)
}

/**
 * @description 获取级联组件选中节点
 * @param { 'companyAddressStreet' | 'registerAddressStreet' } key 需要赋值变量的key
 * @date 2024-05-30
 */
const getCheckedNodes = (key) => {
    const vm = key === 'companyAddressStreet' ? companyAddressStreetRef.value : registerAddressStreetRef.value

    return vm?.getCheckedNodes() || null
}

/**
 * @description 根据指定级联组件选中节点获取园区、镇街数据
 * @param { 'companyAddressStreet' | 'registerAddressStreet' } key 需要赋值变量的key
 * @date 2024-05-30
 */
const getStreetOptionsByKey = (key) => {
    const code = getCheckedNodes(key)?.[0].data.code || ''
    if (code) getStreetOptions(code, key)
}

/** 省市区 */
const onChange = (key) => {
    if (formData[key]) formData[key] = ''

    getStreetOptionsByKey(key)
}

/**
 * @param { Object } obj 值对象
 * @param { 'companyAddress' | 'registerAddress' } key 对应的key
 */
const handleStreetValue = (obj, key) => {
    const temp = obj[key]?.split('/') || []
    const streetKey = key === 'companyAddress' ? 'companyAddressStreet' : 'registerAddressStreet'
    obj[key] = temp?.[0]?.split(',') || []
    obj[streetKey] = temp?.[1] || null
}

const isLoading = ref(false)
const getDetail = () => {
    return request({
        method: 'get',
        params: {
            id: route.query.id
        },
        url: apiKeyMap.enterpriseManage.detail
    })
        .then((res) => {
            const data = res.data?.data || {}

            data.industry = data.industry?.split('/') || []
            handleStreetValue(data, 'companyAddress')
            handleStreetValue(data, 'registerAddress')

            for (let key in formData) {
                formData[key] = data[key]
            }
        })
        .catch((err) => {
            console.log('🚀 ~ getDetail ~ err:', err)
        })
}

const init = async () => {
    try {
        if (route.query.id) {
            isLoading.value = true
            // 编辑。修改面包屑
            updateBreadcrumb({ index: -1, payload: { label: '编辑企业', path: '' } })

            // 请求详情并赋值
            await getDetail()
        }

        const [data1, data2, data3] = await Promise.all([getDictInfo('grid'), getDictInfo('industry'), getDictInfo('companyType')])
        zoneOptions.value = data1
        industryOptions.value = data2
        companyTypeOptions.value = data3

        // 新增，两个下拉数据相同
        nextTick(() => {
            getStreetOptionsByKey('companyAddressStreet')
            getStreetOptionsByKey('registerAddressStreet')
        })

        isLoading.value = false
    } catch (error) {
        console.log('🚀 ~ init ~ error:', error)
    } finally {
        // 数据处理好之后，复制一份用户操作之前的数据，用于返回时候比较
        setDataCopy()
    }
}

init()
</script>

<style scoped lang="scss">
.el-form-item.no-required-form-item {
    :deep(.el-form-item__label::after) {
        display: none;
    }
}
</style>
