import request from '@/utils/request'

export function getPKCXListInfo(listQuery) {
  return request({
    url: '/pkcx/list',
    method: 'get',
    parems: listQuery
  })
}
export function getSbjestClassListInfo(listQuery) {
  return request({
    url: '/sbjestclass/list',
    method: 'get',
    parems: listQuery
  })
}
export function getChooseClassListInfo(listQuery) {
  return request({
    url: '/chooseclass/list',
    method: 'get',
    parems: listQuery
  })
}
