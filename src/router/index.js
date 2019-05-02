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
    path: '/XxxxLayout',
    component: Layout,
    redirect: '/XxxxLayout/xxxx',
    name: 'XxxxLayout',
    children: [
      {
        path: '/xxxx',
        name: 'Xxxx',
        component: () => import('@/views/Xxxx/index'),
        meta: { title: '学校信息', icon: 'school' }
      }
    ]
  },
  {
    path: '/njkcLayout',
    component: Layout,
    redirect: '/njkcLayout/njkc',
    name: 'njkcLayout',
    children: [
      {
        path: 'njkc',
        name: 'Njkc',
        component: () => import('@/views/njkc/index'),
        meta: { title: '年级课程', icon: 'nested' }
      }
    ]
  },
  {
    path: '/njbjLayout',
    component: Layout,
    redirect: '/njbjLayout/njbj',
    name: 'njbjLayout',
    children: [
      {
        path: 'njbj',
        name: 'Njbj',
        component: () => import('@/views/njbj/index'),
        meta: { title: '年级班级', icon: 'class' }
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
        meta: { title: '排课任务', icon: 'pkcx' }
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
      // {
      //   path: 'pkgc',
      //   name: 'Pkgc',
      //   component: () => import('@/views/tree/index'),
      //   meta: { title: '排课过程', icon: 'pkgc' }
      // },
      {
        path: 'kbcx',
        name: 'kbcx',
        component: () => import('@/views/kbcx/index'),
        meta: { title: '课表查询', icon: 'table' }
      }
    ]
  }
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
        meta: { title: '排课任务', icon: 'pkcx' }
      },
      {
        path: 'skrwPt',
        name: 'SkrwPt',
        component: () => import('@/views/skrwPt/index'),
        meta: { title: '授课任务', icon: 'jxjh' }
      },
      {
        path: 'pkgzPt',
        name: 'PkgzPt',
        component: () => import('@/views/pkgzPt/index'),
        meta: { title: '排课规则', icon: 'pkgz' }
      },
      {
        path: 'kspkPt',
        name: 'KspkPt',
        component: () => import('@/views/kspkPt/index'),
        meta: { title: '开始排课', icon: 'kspk' }
      },
      {
        path: 'kbcxPt',
        name: 'KbcxPt',
        component: () => import('@/views/kbcxPt/index'),
        meta: { title: '课表查询', icon: 'table' }
      }
    ]
  }
]

// 选课平台路由
export const xkRouterMap = [
  {
    path: '/xkpt',
    component: Layout,
    redirect: '/xkpt/xkrw',
    name: 'Xkpt',
    meta: { title: '选课平台', icon: 'xkpt' },
    children: [
      {
        path: 'xkrw',
        name: 'Xkrw',
        component: () => import('@/views/xkrw/index'),
        meta: { title: '选课任务', icon: 'form' }
      },
      {
        path: 'xksz',
        name: 'Xksz',
        component: () => import('@/views/xksz/index'),
        meta: { title: '选课设置', icon: 'xksz' }
      },
      {
        path: 'fbrw',
        name: 'Fbrw',
        component: () => import('@/views/fbrw/index'),
        meta: { title: '发布任务', icon: 'fbrw' }
      },
      {
        path: 'xkfx',
        name: 'Xkfx',
        component: () => import('@/views/xkfx/index'),
        meta: { title: '选课分析', icon: 'pie' }
      }
    ]
  }
]

// 学生选课
export const stuRouterMap = [
  {
    path: '/stuLayout',
    component: Layout,
    redirect: '/stuLayout/xsxk',
    name: 'stuLayout',
    children: [
      {
        path: 'xsxk',
        name: 'Xsxk',
        component: () => import('@/views/xsxk/index'),
        meta: { title: '学生选课', icon: 'result' }
      },
      {
        path: '/qxk',
        name: 'Qxk',
        component: () => import('@/views/xsxk/chooseCourse.vue'),
        meta: { title: '选课', icon: 'result' },
        hidden: true
      }
    ]
  }
]

// 新高考选考
export const xgkRouterMap = [
  {
    path: '/xgkpk',
    component: Layout,
    redirect: '/xgkpk/xgkpkcx',
    name: 'Xgkpk',
    meta: { title: '新高考排课', icon: 'example' },
    children: [
      {
        path: 'xgkpkcx',
        name: 'Xgkpkcx',
        component: () => import('@/views/pkcx/index'),
        meta: { title: '排课任务', icon: 'pkcx' }
      },
      {
        path: 'xgkjxjh',
        name: 'Xgkjxjh',
        component: () => import('@/views/jxjh/index'),
        meta: { title: '教学计划', icon: 'jxjh' }
      },
      {
        path: 'xgkjxrw',
        name: 'Xgkjxrw',
        component: () => import('@/views/jxrwxgk/index'),
        meta: { title: '教学任务', icon: 'pkgc' }
      },
      {
        path: 'xgkpkgz',
        name: 'Xgkpkgz',
        component: () => import('@/views/pkgzXgk/index'),
        meta: { title: '排课规则', icon: 'pkgz' }
      }
    ]
  }
]

export const h5RouterMap = [
  {
    path: '/loginh5',
    component: () => import('@/views/h5/login'),
    hidden: true
  },
  {
    path: '/xsxkh5',
    name: 'Xsxkh5',
    component: () => import('@/views/h5/xsxk'),
    hidden: true
  },
  {
    path: '/detailh5',
    name: 'Detailh5',
    component: () => import('@/views/h5/detail'),
    hidden: true
  }
]

export default new Router({
  // mode: 'history', // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    ...baseRouterMap,
    ...zbRouterMap,
    ...ptRouterMap,
    ...xkRouterMap,
    ...stuRouterMap,
    ...xgkRouterMap,
    ...h5RouterMap
  ]
})
