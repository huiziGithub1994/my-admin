import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dshboard',
    hidden: true,
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Home',
        meta: { title: '首页', icon: 'example' }
      }
    ]
  },
  {
    path: '/zbpk',
    component: Layout,
    redirect: '/zbpk/pkcx',
    name: 'Zbpk',
    meta: { title: '走班排课', icon: 'example' },
    children: [
      {
        path: 'pkcx',
        name: 'Pkcx',
        component: () => import('@/views/pkcx/index'),
        meta: { title: '排课查询', icon: 'table' }
      },
      {
        path: 'jxjh',
        name: 'jxjh',
        component: () => import('@/views/jxjh/index'),
        meta: { title: '教学计划', icon: 'tree' }
      },
      {
        path: 'pkgz',
        name: 'pkgz',
        component: () => import('@/views/tree/index'),
        meta: { title: '排课规则', icon: 'tree' }
      },
      {
        path: 'jxjh1',
        name: '教学计划',
        component: () => import('@/views/tree/index'),
        meta: { title: '教学计划', icon: 'tree' }
      },
      {
        path: 'pkgz1',
        name: '排课规则',
        component: () => import('@/views/tree/index'),
        meta: { title: '排课规则', icon: 'tree' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
