import request from '@/utils/request'
import URL from '@/api/url'

// 学段(专业)/年级
export function qrySegGradeTree() {
  return request({
    url: URL.qrySegGradeTree
  })
}

// 学段/专业增删改
export function handleSeg(params) {
  return request({
    url: URL.handleSeg,
    params
  })
}
// 学段年级增删改
export function saveSegGrade(params) {
  return request({
    url: URL.saveSegGrade,
    params
  })
}
// 根据年级查询课程列表
export function qryCourseByGradeId(params) {
  return request({
    url: URL.qryCourseByGradeId,
    params
  })
}

// 保存课程列表
export function saveCourseList(params) {
  return request({
    url: URL.saveCourseList,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    params
  })
}
