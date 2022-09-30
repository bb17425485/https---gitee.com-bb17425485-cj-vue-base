import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
//静态网页
export const constantRouterMap = [
    {
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [{
            path: '/redirect/:path*',
            component: () => import('@/views/redirect/index')
        }]
    }, {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login/index'),
        hidden: true
    }, {
        path: '/404',
        component: Layout,
        hidden: true,
        children: [{
            path: "",
            component: () => import('@/views/404')
        }]
    },
]
export const notFoundRouter = [{
    path: '*',
    redirect: '/404',
    hidden: true
},]

const createRouter = () => new Router({
    scrollBehavior: () => ({
        y: 0
    }),
    routes: constantRouterMap
})

const router = createRouter()

export function resetRouter () {
    // reset路由表
    const newRouter = createRouter()
    router.matcher = newRouter.matcher
}

export default router

// export default new Router({
//     // mode: 'history', //后端支持可开
//     scrollBehavior: () => ({
//         y: 0
//     }),
//     routes: constantRouterMap
// })
