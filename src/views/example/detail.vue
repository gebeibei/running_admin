<template>
    <div class="zrx-common-page p-t-16 p-b-56" v-loading="isLoading">
        <div class="f-16 font-bold lh-40 m-b-16">企业信息</div>
        <div class="grid grid-cols-4 gap-col-32 gap-row-24">
            <div v-for="item in tableKeys" :key="item.key" :class="item.extraClass">
                <div class="zrx-info-label m-b-4">{{ item.label }}</div>
                <zrx-tooltip :content="formData[item.key]" :lines="item.lines || 1" inner-class="is-empty zrx-info-value"></zrx-tooltip>
            </div>
        </div>

        <div class="f-16 font-bold lh-40 m-t-24 m-b-16">账号信息</div>
        <div class="grid grid-cols-4 gap-col-32 gap-row-24">
            <div>
                <div class="zrx-info-label m-b-4">注册手机号</div>
                <div class="is-empty zrx-info-value">{{ formData.mobileNumber }}</div>
            </div>
        </div>

        <ZrxBottomBar>
            <el-button @click="onBack">返回</el-button>
        </ZrxBottomBar>
    </div>
</template>

<script setup>
import { request } from '@/config/axios'
import { apiKeyMap } from '@/config/apiKeyMap'

const route = useRoute()
const formData = ref({})

const tableKeys = [
    { label: '统一社会信用代码', key: 'creditCode' },
    { label: '企业名称', key: 'companyName' },
    { label: '企业类型', key: 'industryName', extraClass: 'grid-col-start-3 grid-col-end--1' },
    { label: '主体类型', key: 'companyType' },
    { label: '企业法人', key: 'legalPerson' },
    { label: '企业法人电话', key: 'legalPersonPhone' },
    { label: '企业联系人', key: 'contactName' },
    { label: '企业联系人职务', key: 'contactDuty' },
    { label: '企业联系人电话', key: 'contactPhone' },
    { label: '电子邮箱', key: 'contactEmail' },
    { label: '注册地址', key: 'registerAddress', extraClass: 'grid-col-start-1 grid-col-end--1' },
    { label: '实际办公地址', key: 'companyAddress', extraClass: 'grid-col-start-1 grid-col-end--1' },
    { label: '创建人', key: 'createBy' },
    { label: '创建时间', key: 'createDate' }
]

const isLoading = ref(true)
const onBack = () => {
    history.back()
}

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

            data.companyAddress = data.companyAddress?.replace(/,|\//g, '') + (data.companyAddressDetail || '')
            data.registerAddress = data.registerAddress?.replace(/,|\//g, '') + (data.registerAddressDetail || '')

            formData.value = data
        })
        .catch((err) => {
            console.log('🚀 ~ getDetail ~ err:', err)
        })
        .finally(() => {
            isLoading.value = false
        })
}

formData.value = {
    id: '96572fe7daf8415e98b68a97322c3663',
    creditCode: '123456789987654321',
    companyName: '测试账号202407111729',
    mobileNumber: '18100186611',
    legalPerson: '测试账号202407111729',
    industry: 'A/01',
    companyType: '内资企业',
    industryName: '农、林、牧、渔业/农业',
    legalPersonPhone: '15927311095',
    contactName: '测试账号202407111729',
    contactDuty: '测试账号202407111729',
    contactPhone: '15927311095',
    contactEmail: '测试账号202407111729@qq.com',
    registerAddress: '广东省珠海市香洲区翠香街道测试账号202407111729@qq.com',
    registerAddressDetail: '测试账号202407111729@qq.com',
    companyAddress: '广东省珠海市香洲区翠香街道测试账号202407111729@qq.com',
    companyAddressDetail: '测试账号202407111729@qq.com',
    accountStatus: '1',
    createBy: 'admin_test',
    createDate: '2024-07-11 17:30:57'
}

isLoading.value = false

// getDetail()
</script>
