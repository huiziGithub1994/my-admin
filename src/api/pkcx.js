import request from '@/utils/request'
import URL from '@/api/url'

// 排课查询列表
export function getPKCXListInfo(listQuery) {
  return request({
    url: URL.qryArrangeList,
    method: 'get',
    params: listQuery
  })
}

export function qryArrangeDetail(id) {
  return request({
    url: URL.qryArrangeDetail,
    method: 'get',
    params: {
      arrangeId: id
    }
  })
}
export function getSbjestClassListInfo(listQuery) {
  return request({
    url: '/sbjestclass/list',
    method: 'get',
    pparams: listQuery
  })
}
export function getChooseClassListInfo(listQuery) {
  return request({
    url: '/chooseclass/list',
    method: 'get',
    params: listQuery
  })
}
