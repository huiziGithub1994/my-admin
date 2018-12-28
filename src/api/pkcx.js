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

// 学科分层保存接口
export function saveLayerInfo(params) {
  return request({
    url: URL.savelayerInfo,
    method: 'post',
    params: params
  })
}

// 学科分层保存接口
export function delLayerInfo(params) {
  return request({
    url: URL.dellayerInfo,
    params
  })
}

// 导入学生选课 表格数据查询
export function getChooseClassListInfo(listQuery) {
  return request({
    url: URL.qryStuChoiceInfoList,
    params: listQuery
  })
}
// 导入学生选课 表格数据删除
export function delChooseClassListInfo(listQuery) {
  return request({
    url: URL.delStuChoiceInfoList,
    params: listQuery
  })
}

// 导入学生选课 课程分类下拉列表
export function getCourseOptions(params) {
  return request({
    url: URL.qryArrangeCourseLayerRela,
    params
  })
}

// 导入学生选课 行政班下拉列表
export function getArrangeClasses(params) {
  return request({
    url: URL.qryArrangeClasses,
    params
  })
}
// 导入学生选课 新增选课的保存
export function saveChooseCourseInfo(params) {
  return request({
    url: URL.saveChooseCourseInfo,
    method: 'post',
    params
  })
}

// 教学分班管理 表格查询
export function getSplitClassManage(listQuery) {
  return request({
    url: '/splitClassManage/list',
    params: listQuery
  })
}

// 教学分班管理 导出接口
export function exportChooseCourse(params) {
  return request({
    url: URL.exportChooseCourse,
    params
  })
}

// 教学分班管理 试分班
export function splitClasses() {
  return request({
    url: URL.splitClasses
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
