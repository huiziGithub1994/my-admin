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
// 基础路由
export const baseRouterMap = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/login',
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
  { path: '*', redirect: '/404', hidden: true }
]
// 走班排课路由
export const zbRouterMap = [
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
        name: 'Jxjh',
        component: () => import('@/views/jxjh/index'),
        meta: { title: '教学计划', icon: 'tree' }
      },
      {
        path: 'pkgz',
        name: 'Pkgz',
        component: () => import('@/views/tree/index'),
        meta: { title: '排课规则', icon: 'tree' }
      },
      {
        path: 'pkgc',
        name: 'Pkgc',
        component: () => import('@/views/tree/index'),
        meta: { title: '排课过程', icon: 'tree' }
      },
      {
        path: 'kbcx',
        name: 'Kbxc',
        component: () => import('@/views/tree/index'),
        meta: { title: '课表查询', icon: 'tree' }
      }
    ]
  },
  {
    path: '/xtgl',
    component: Layout,
    redirect: '/xtgl/sjzd',
    name: 'Xtgl',
    meta: { title: '系统管理', icon: 'example' },
    children: [
      {
        path: 'sjzd',
        name: 'Sjzd',
        component: () => import('@/views/sjzd/index'),
        meta: { title: '数据字典', icon: 'table' }
      },
      {
        path: 'xlwh',
        name: 'Xlwh',
        component: () => import('@/views/Xlwh/index'),
        meta: { title: '校历维护', icon: 'table' }
      }
    ]
  }
]

// 普通排课路由
export const ptRouterMap = [
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
        name: 'Jxjh',
        component: () => import('@/views/jxjh/index'),
        meta: { title: '教学计划', icon: 'tree' }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: [...baseRouterMap, ...zbRouterMap, ...ptRouterMap]
})
