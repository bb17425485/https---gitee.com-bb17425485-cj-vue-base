import request from '@/utils/request'

export default {
    getRoleList (data) {
        return request({
            url: '/api/role_info_http/getRoleList',
            method: 'post',
            data
        })
    },
    createRole (data) {
        return request({
            url: '/api/role_info_http/createRole',
            method: 'post',
            data
        })
    },
    deleteRole (data) {
        return request({
            url: '/api/role_info_http/deleteRole',
            method: 'post',
            data
        })
    },
    getAllRoleList () {
        return request({
            url: '/api/role_info_http/getAllRoleList',
            method: 'post'
        })
    },
    updatePath (data) {
        return request({
            url: '/api/role_info_http/updatePath',
            method: 'post',
            data
        })
    },
}