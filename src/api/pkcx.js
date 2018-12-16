import request from '@/utils/request'
import URL from '@/api/url'

// 排课查询列表
export function getPKCXListInfo(listQuery) {
  return request({
    url: URL.qryArrangeList,
    params: listQuery
  })
}

// 删除排课
export function delArrange(params) {
  return request({
    url: URL.delArrange,
    params
  })
}

// 排课查询详情接口
export function qryArrangeDetail(params) {
  return request({
    url: URL.qryArrangeDetail,
    params: params
  })
}

// 保存排课基础信息
export function saveArrange(params) {
  return request({
    url: URL.saveArrange,
    method: 'post',
    params
  })
}

// 学科分层查询列表接口
export function getSbjestClassListInfo(params) {
  return request({
    url: URL.qrylayerList,
    params: params
  })
}

// 学科分层课程名称查询接口
export function getlayerCourseName(params) {
  return request({
    url: URL.qrylayerCourseName,
    params: params
  })
}

// 学科分层详情查询接口
export function qrylayerInfo(params) {
  return request({
    url: URL.qrylayerInfo,
    params: params
  })
}

export function getChooseClassListInfo(listQuery) {
  return request({
    url: '/chooseclass/list',
    params: listQuery
  })
}

// 教学分班管理
export function getSplitClassManage(listQuery) {
  return request({
    url: '/splitClassManage/list',
    params: listQuery
  })
}

// 走班教室列表查询
export function getZbClassroomListInfo(listQuery) {
  return request({
    url: URL.qryZbClassroomList,
    params: listQuery
  })
}
// 走班教室详情查询
export function getZbClassroomInfo(listQuery) {
  return request({
    url: URL.qryZbClassroom,
    params: listQuery
  })
}
