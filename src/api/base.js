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

// 年级级联下拉列表数据
export function getSegGrade(params) {
  return request({
    url: URL.qrySegGrade,
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

// 课程计划列表查询接口
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
    params: data
  })
}

// 选课平台-》学校信息
export function qrySchoolInfo() {
  return request({
    url: URL.qrySchoolInfo
  })
}
// 选课平台-》学校信息 办学类型
export function getDicList(listQuery) {
  return request({
    url: URL.getDicList,
    params: listQuery
  })
}
// 选课平台-》学校信息 保存
export function saveSjsSchoolById(params) {
  return request({
    url: URL.saveSjsSchoolById,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    params
  })
}
