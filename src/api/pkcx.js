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

// 排课查询详情接口
export function qryArrangeDetail(params) {
  return request({
    url: URL.qryArrangeDetail,
    method: 'get',
    params: params
  })
}

// 学科分层查询列表接口
export function getSbjestClassListInfo(params) {
  return request({
    url: URL.qrylayerList,
    method: 'get',
    params: params
  })
}
export function getChooseClassListInfo(listQuery) {
  return request({
    url: '/chooseclass/list',
    method: 'get',
    params: listQuery
  })
}
