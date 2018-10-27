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
        name: '教学计划',
        component: () => import('@/views/tree/index'),
        meta: { title: '教学计划', icon: 'tree' }
      },
      {
        path: 'pkgz',
        name: '排课规则',
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
  {
    path: '/ptpk',
    component: Layout,
    redirect: '/ptpk/kbcx',
    name: 'ptpk',
    meta: { title: '普通排课', icon: 'example' },
    children: [
      {
        path: 'kbcx',
        name: 'kbcx',
        component: () => import('@/views/tree/index'),
        meta: { title: '课表查询', icon: 'tree' }
      },
      {
        path: 'pkgc',
        name: 'pkgc',
        component: () => import('@/views/tree/index'),
        meta: { title: '排课过程', icon: 'tree' }
      },
      {
        path: 'kbcx2',
        name: 'kbcx2',
        component: () => import('@/views/tree/index'),
        meta: { title: '课表查询', icon: 'tree' }
      },
      {
        path: 'pkgc2',
        name: 'pkgc2',
        component: () => import('@/views/tree/index'),
        meta: { title: '排课过程', icon: 'tree' }
      }
    ]
  },
  {
    path: '/ptpk1',
    component: Layout,
    redirect: '/ptpk/kbcx1',
    name: 'ptpk1',
    meta: { title: '普通排课', icon: 'example' },
    children: [
      {
        path: 'kbcx1',
        name: 'kbcx1',
        component: () => import('@/views/tree/index'),
        meta: { title: '课表查询', icon: 'tree' }
      },
      {
        path: 'pkgc1',
        name: 'pkgc1',
        component: () => import('@/views/tree/index'),
        meta: { title: '排课过程', icon: 'tree' }
      },
      {
        path: 'kbcx12',
        name: 'kbcx12',
        component: () => import('@/views/tree/index'),
        meta: { title: '课表查询', icon: 'tree' }
      },
      {
        path: 'pkgc12',
        name: 'pkgc12',
        component: () => import('@/views/tree/index'),
        meta: { title: '排课过程', icon: 'tree' }
      },
      {
        path: 'kbcx122',
        name: 'kbcx122',
        component: () => import('@/views/tree/index'),
        meta: { title: '课表查询', icon: 'tree' }
      },
      {
        path: 'pkgc122',
        name: 'pkgc122',
        component: () => import('@/views/tree/index'),
        meta: { title: '排课过程', icon: 'tree' }
      },
      {
        path: 'kbcx123',
        name: 'kbcx123',
        component: () => import('@/views/tree/index'),
        meta: { title: '课表查询', icon: 'tree' }
      },
      {
        path: 'pkgc123',
        name: 'pkgc123',
        component: () => import('@/views/tree/index'),
        meta: { title: '排课过程', icon: 'tree' }
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
