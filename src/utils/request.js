import axios from 'axios'
import { MessageBox, Message, Loading } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

let loading

function startLoading () {
    // element-ui loading 服务调用方式  
    // console.log('loading :>> ', loading);
    // loading = Loading.service({
    //     lock: true,
    //     text: '拼命加载中...',
    //     spinner: 'el-icon-loading',  // 自定义图标
    //     background: 'rgba(0, 0, 0, 0.7)'
    // })
}

// loading结束 方法
function endLoading () {
    // console.log('close :>> ', "close");
    // loading.close()
}

// create an axios instance
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 8000 // request timeout
})

// request interceptor
service.interceptors.request.use(
    config => {
        // do something before request is sent
        if (getToken()) {
            // let each request carry token
            // ['X-Token'] is a custom headers key
            // please modify it according to the actual situation
            config.headers['token'] = getToken()
        }
        startLoading()
        return config
    },
    error => {
        // do something with request error
        console.log(error) // for debug
        endLoading()
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
    */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
        endLoading()
        const res = response.data
        // if the custom code is not 20000, it is judged as an error.
        if (res.code !== 20000) {
            Message({
                message: res.message || 'Error',
                type: 'error',
                duration: 5 * 1000
            })

            // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
            if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
                // to re-login
                MessageBox.confirm('您已登出,请重新登录', '登出提示', {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    store.dispatch('FedLogOut').then(() => {
                        location.reload()
                    })
                })
            }
            return Promise.reject(new Error(res.message || 'Error'))
        } else {
            return res
        }
    },
    error => {
        endLoading()
        console.log('err---' + error) // for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service
