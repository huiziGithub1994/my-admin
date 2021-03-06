import request from '@/utils/request'
import URL from '@/api/url'

// 用户基础信息
export function getBaseInfo() {
  return request({
    url: URL.qryBaseInfo
  })
}

// 年级下拉列表数据
export function getGrade(params) {
  return request({
    url: URL.qryGrade,
    params
  })
}

// 数据字典列表
export function getKeyList(listQuery) {
  return request({
    url: URL.qryKeyList,
    params: listQuery
  })
}

// 校历维护 详情
export function qryCalendar(listQuery) {
  return request({
    url: URL.qryCalendar,
    params: listQuery
  })
}

// 校历维护 保存
export function saveCalendar(listQuery) {
  return request({
    url: URL.saveCalendar,
    method: 'post',
    params: listQuery
  })
}

// 课程计划
export function getCoursePlain(listQuery) {
  return request({
    url: URL.qryCoursePlain,
    params: listQuery
  })
}

// 上传课程计划模板
export function uploadCoursePlain(data) {
  return request({
    url: URL.uploadCoursePlain,
    method: 'post',
    params: data,
    formData: true
  })
}
