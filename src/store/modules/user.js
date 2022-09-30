import userApi from '@/api/user'
import {
    getToken,
    setToken,
    removeToken
} from '@/utils/auth'
import routerFormat from '@/utils/router'
import {
    constantRouterMap,
    notFoundRouter,
    resetRouter
} from '@/router';
const user = {
    state: {
        token: getToken(),
        name: '',
        avatar: '',
        roles: [],
        routers: constantRouterMap,
        addRouters: [],
        info: {}
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_NAME: (state, name) => {
            state.name = name
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
        },
        SET_INFO: (state, info) => {
            state.info = info
        },
        SET_ROUTERS: (state, routers) => {
            state.addRouters = routers; //路由访问
            state.routers = constantRouterMap.concat(routers).concat(notFoundRouter); //菜单显示,404最后加入
        },
        LOGOUT: (state) => {
            state.addRouters = []
            state.routers = []
            state.name = ''
            state.roles = []
            state.token = ''
            state.info = {}
        },
    },

    actions: {
        // 登录
        Login ({
            commit
        }, userInfo) {
            return new Promise((resolve, reject) => {
                userApi.login(userInfo).then(response => {
                    let { data, token } = response
                    setToken(token)
                    commit('SET_TOKEN', token)
                    commit('SET_INFO', data.user)
                    commit('SET_ROUTERS', routerFormat(data.routers))
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 获取用户信息
        GetInfo ({
            commit,
            state
        }) {
            return new Promise((resolve, reject) => {
                userApi.getInfo(state.token).then(response => {
                    let { data } = response
                    commit('SET_INFO', data.user)
                    commit('SET_ROUTERS', routerFormat(data.routers))
                    resetRouter()
                    resolve(data.user)
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 登出
        LogOut ({
            commit,
            state
        }) {
            return new Promise((resolve, reject) => {
                userApi.logout(state.token).then(() => {
                    commit('LOGOUT', '')
                    removeToken()
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        // 前端 登出
        FedLogOut ({
            commit
        }) {
            return new Promise(resolve => {
                commit('LOGOUT', '')
                removeToken()
                resolve()
            })
        }
    }
}

export default user
