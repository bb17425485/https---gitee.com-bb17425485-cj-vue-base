import request from '@/utils/request'

export default {
    login (data) {
        return request({
            // url: '/vue-admin-template/user/login',
            url: '/api/users_info_http/login',
            method: 'post',
            data
        })
    },
    getInfo (token) {
        return request({
            // url: '/vue-admin-template/user/info',
            url: '/api/users_info_http/getInfo',
            method: 'post',
            data: { token }
        })
    },
    getUserList (data) {
        return request({
            url: '/api/users_info_http/getUserList',
            method: 'post',
            data
        })
    },
    logout () {
        return request({
            url: '/vue-admin-template/user/logout',
            method: 'post'
        })
    },
    createUser (data) {
        return request({
            url: '/api/users_info_http/createUser',
            method: 'post',
            data
        })
    },
    updateUser (data) {
        return request({
            url: '/api/users_info_http/updateUser',
            method: 'post',
            data
        })
    },
    deleteUser (data) {
        return request({
            url: '/api/users_info_http/deleteUser',
            method: 'post',
            data
        })
    },
    findSourceByUser (data) {
        return request({
            url: '/api/users_info_http/findSourceByUser',
            method: 'post',
            data
        })
    },
    updateSourceByUser (data) {
        return request({
            url: '/api/users_info_http/updateSourceByUser',
            method: 'post',
            data
        })
    },
}