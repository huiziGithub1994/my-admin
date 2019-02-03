import request from '@/utils/request'
import URL from '@/api/url'

// 根据年级查询班级列表
export function qryClassesByGradeId(params) {
  return request({
    url: URL.qryClassesByGradeId,
    params
  })
}

// 保存班级列表
export function saveClassesList(params) {
  return request({
    url: URL.saveClassesList,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    params
  })
}
