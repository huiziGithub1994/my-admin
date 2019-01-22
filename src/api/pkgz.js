import request from '@/utils/request'
import URL from '@/api/url'
/**
 * 走班排课
 */

// 排课规则 资源评估,运算走班排课资源按钮
export function qrySourceAssessment(listQuery) {
  return request({
    url: URL.qrySourceAssessment,
    params: listQuery
  })
}
// 学生分班 按选课结果将学生分班 列表
export function qryTeachingClassInfoDetails(listQuery) {
  return request({
    url: URL.qryTeachingClassInfoDetails,
    params: listQuery
  })
}
// 学生自动分到教学班
export function saveTeaClassRelyStu(listQuery) {
  return request({
    url: URL.saveTeaClassRelyStu,
    method: 'post',
    params: listQuery
  })
}
// 排课规则 教学分组
export function qryTeachGroupsTree(listQuery) {
  return request({
    url: URL.qryTeachGroupsTree,
    params: listQuery
  })
}

// 排课规则 课时预排查询
export function qryArrangeGroupInfo(listQuery) {
  return request({
    url: URL.qryArrangeGroupInfo,
    params: listQuery
  })
}
// 排课规则 新增课时组
export function saveCoursePlanInfo(listQuery) {
  return request({
    url: URL.saveCoursePlanInfo,
    method: 'post',
    params: listQuery
  })
}
// 排课规则 课时预排保存
export function saveGroupArrInfo(listQuery) {
  return request({
    url: URL.saveGroupArrInfo,
    method: 'post',
    params: listQuery
  })
}
