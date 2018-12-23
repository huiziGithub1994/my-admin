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
    children: [
      {
        path: 'xlwh',
        name: 'Home',
        component: () => import('@/views/xlwh/index'),
        meta: { title: '校历维护', icon: 'calendar' }
      }
    ]
  },
  {
    path: '/kcjhLayout',
    component: Layout,
    redirect: '/kcjhLayout/kcjh',
    name: 'kcjhLayout',
    children: [
      {
        path: '/kcjh',
        name: 'Kcjh',
        component: () => import('@/views/kcjh/index'),
        meta: { title: '课程计划', icon: 'nested' }
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
        meta: { title: '排课查询', icon: 'pkcx' }
      },
      {
        path: 'jxjh',
        name: 'Jxjh',
        component: () => import('@/views/jxjh/index'),
        meta: { title: '教学计划', icon: 'jxjh' }
      },
      {
        path: 'pkgz',
        name: 'Pkgz',
        component: () => import('@/views/pkgz/index'),
        meta: { title: '排课规则', icon: 'pkgz' }
      },
      {
        path: 'pkgc',
        name: 'Pkgc',
        component: () => import('@/views/tree/index'),
        meta: { title: '排课过程', icon: 'pkgc' }
      },
      {
        path: 'kbcx',
        name: 'Kbxc',
        component: () => import('@/views/tree/index'),
        meta: { title: '课表查询', icon: 'table' }
      }
    ]
  }
  // {
  //   path: '/xtgl',
  //   component: Layout,
  //   redirect: '/xtgl/sjzd',
  //   name: 'Xtgl',
  //   meta: { title: '系统管理', icon: 'example' },
  //   children: [
  //     {
  //       path: 'sjzd',
  //       name: 'Sjzd',
  //       component: () => import('@/views/sjzd/index'),
  //       meta: { title: '数据字典', icon: 'table' }
  //     },
  //     {
  //       path: 'xlwh',
  //       name: 'Xlwh',
  //       component: () => import('@/views/Xlwh/index'),
  //       meta: { title: '校历维护', icon: 'table' }
  //     }
  //   ]
  // }
]

// 普通排课路由
export const ptRouterMap = [
  {
    path: '/ptpk',
    component: Layout,
    redirect: '/ptpk/pkcxPt',
    name: 'Ptpk',
    meta: { title: '普通排课', icon: 'ptpk' },
    children: [
      {
        path: 'pkcxPt',
        name: 'PkcxPt',
        component: () => import('@/views/pkcxPt/index'),
        meta: { title: '排课查询', icon: 'pkcx' }
      },
      {
        path: 'jxjhPt',
        name: 'JxjhPt',
        component: () => import('@/views/jxjhPt/index'),
        meta: { title: '教学计划', icon: 'jxjh' }
      },
      {
        path: 'pkgzPt',
        name: 'PkgzPt',
        component: () => import('@/views/pkgzPt/index'),
        meta: { title: '排课规则', icon: 'pkgz' }
      }
    ]
  }
]

// 选课平台路由
export const xkRouterMap = [
  {
    path: '/xkpt',
    component: Layout,
    redirect: '/xkpt/xxdy',
    name: 'Xkpt',
    meta: { title: '选课平台', icon: 'xkpt' },
    children: [
      {
        path: 'xxdy',
        name: 'Xxdy',
        component: () => import('@/views/xkdy/index'),
        meta: { title: '选学调研', icon: 'form' }
      },
      {
        path: 'xksz',
        name: 'Xksz',
        component: () => import('@/views/xksz/index'),
        meta: { title: '选课设置', icon: 'xksz' }
      },
      {
        path: 'xkjg',
        name: 'Xkjg',
        component: () => import('@/views/xkjg/index'),
        meta: { title: '选课结果', icon: 'result' }
      }
    ]
  }
]
export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: [...baseRouterMap, ...zbRouterMap, ...ptRouterMap, ...xkRouterMap]
})
