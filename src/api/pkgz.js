import request from '@/utils/request'
import URL from '@/api/url'
/**
 * 走班排课
 */

// 排课规则 资源评估
export function qrySourceAssessment(listQuery) {
  return request({
    url: URL.qrySourceAssessment,
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

// 排课规则 课时预排 treedata
export function qryTeachHours(listQuery) {
  return request({
    url: URL.qryTeachHoursTree,
    params: listQuery
  })
}
