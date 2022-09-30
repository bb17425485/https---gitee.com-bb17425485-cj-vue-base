import request from '@/utils/request'

export default {
    getSystemConfigList () {
        return request({
            url: '/api/system_config/getSystemConfigList',
            method: 'post'
        })
    },
    create (data) {
        return request({
            url: '/api/system_config/create',
            method: 'post',
            data
        })
    },
    updateParam (data) {
        return request({
            url: '/api/system_config/updateParam',
            method: 'post',
            data
        })
    },
    delete (data) {
        return request({
            url: '/api/system_config/delete',
            method: 'post',
            data
        })
    },
    clearCache () {
        return request({
            url: '/api/system_config/clearCache',
            method: 'post'
        })
    },
    getErrorLog () {
        return request({
            url: '/api/system_config/getErrorLog',
            method: 'post'
        })
    },
}