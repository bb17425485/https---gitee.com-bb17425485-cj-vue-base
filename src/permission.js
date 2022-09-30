import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
    NProgress.start()
    document.title = getPageTitle(to.meta.title)
    if (getToken()) {
        if (to.path === '/login') {
            next({ path: '/login' })
            NProgress.done()
        } else {
            try {
                if (store.getters.info.username === undefined) {
                    await store.dispatch('GetInfo')
                    router.addRoutes(store.getters.routers)//添加后台路由表
                    router.options.routes = store.getters.routers
                    next({ ...to, replace: true })
                } else if (router.options.routes.length < 4) {
                    router.addRoutes(store.getters.routers)//添加后台路由表
                    router.options.routes = store.getters.routers
                    next({ ...to, replace: true })
                } else {
                    next()
                }
            } catch (error) {
                // remove token and go to login page to re-login
                Message.error(error || 'Has Error')
                next({ path: '/login' })
                NProgress.done()
            }
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            next('/login')
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    // finish progress bar
    NProgress.done()
})
