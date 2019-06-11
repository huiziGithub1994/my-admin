import request from '@/utils/request'
import URL from '@/api/url'

/** 教学计划-教学开班管理 */
// 列表查询接口
export function qryClassCountList(params) {
  return request({
    url: URL.qryClassCountList,
    params
  })
}

// 保存分班接口
export function updClassCountList(params) {
  return request({
    url: URL.updClassCountList,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    params
  })
}

/** 教学计划-导入学生选课 */
// 保存选课数据
export function cleanArrangeDataAgain(params) {
  return request({
    url: URL.cleanArrangeDataAgain,
    params
  })
}

/** 教学计划-教学分班管理 */
// 分班估算- 列表查询
export function qryCalGroupListByArrId(params) {
  return request({
    url: URL.qryCalGroupListByArrId,
    params
  })
}
// 分班估算- 分班估算按钮
export function estimateClasses(params) {
  return request({
    url: URL.estimateClasses,
    params,
    timeout: 10000
  })
}
// 分班估算- 确认方案
export function splitStu2AdminClass(params) {
  return request({
    url: URL.splitStu2AdminClass,
    params
  })
}
// 分班估算- 详情
export function qryOneSjsGroupFix2(params) {
  return request({
    url: URL.qryOneSjsGroupFix2,
    params
  })
}

// 分班确认- 保存并分班
export function saveMoveCourseList(params) {
  return request({
    url: URL.saveMoveCourseList,
    params
  })
}

// 分班确认-查询分班
export function qrySplitClassesList(params) {
  return request({
    url: URL.qrySplitClassesList,
    params
  })
}

/** 教学计划-  教学班教学设置 */
// 列表查询接口
export function qryMove2ClassList(params) {
  return request({
    url: URL.qryMove2ClassList,
    params
  })
}

/** 教学任务-  教学任务报表 */
// 提取教师列表
export function qryTeaListByArrangeId(params) {
  return request({
    url: URL.qryTeaListByArrangeId,
    params
  })
}
// 提取班级列表
export function qryClassListByArrangeId(params) {
  return request({
    url: URL.qryClassListByArrangeId,
    params
  })
}
