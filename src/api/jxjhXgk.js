import request from '@/utils/request'
import URL from '@/api/url'
/** 分班设置 */
// 估算分班
export function splitStu2AdminClass(params) {
  return request({
    url: URL.splitStu2AdminClass,
    params
  })
}

// 保存并分班
export function saveMoveCourseList(params) {
  return request({
    url: URL.saveMoveCourseList,
    params
  })
}

// 查询分班
export function qrySplitClassesList(params) {
  return request({
    url: URL.qrySplitClassesList,
    params
  })
}

/** 教学班教学设置 */
// 列表查询接口
export function qryMove2ClassList(params) {
  return request({
    url: URL.qryMove2ClassList,
    params
  })
}
