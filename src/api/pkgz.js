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
