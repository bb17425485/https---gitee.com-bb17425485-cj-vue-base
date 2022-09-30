import request from '@/utils/request'

export default {
    getList (data) {
        return request({
            // url: '/vue-admin-template/table/list',
            url: '/api/menu_info_http/menuList',
            method: 'post',
            data
        })
    },
    menuFatherList () {
        return request({
            url: '/api/menu_info_http/menuFatherList',
            method: 'post'
        })
    },
    createMenu (data) {
        return request({
            url: '/api/menu_info_http/createMenu',
            method: 'post',
            data
        })
    },
    updateMenu (data) {
        return request({
            url: '/api/menu_info_http/updateMenu',
            method: 'post',
            data
        })
    },
    deleteMenu (data) {
        return request({
            url: '/api/menu_info_http/deleteMenu',
            method: 'post',
            data
        })
    },
    findMenuByFatherId (data) {
        return request({
            url: '/api/menu_info_http/findMenuByFatherId',
            method: 'post',
            data
        })
    },
    getMenuByRole (data) {
        return request({
            url: '/api/menu_info_http/getMenuByRole',
            method: 'post',
            data
        })
    },
    updateRole (data) {
        return request({
            url: '/api/menu_info_http/updateRole',
            method: 'post',
            data
        })
    },
}
