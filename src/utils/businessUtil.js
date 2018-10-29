/* 业务帮助类 */
/* 2.根据表格高度，自动计算出表格显示数据的最佳行数。
    入参：tableHeight(el-table表格高度)
    返回：pageSize(每页显示条数数组),pageSize[0]:表格显示数据的最佳行数
    tableHeight不包含表格底部的分页和页数高度，表头高度：40px;表格不换行的行高：40px;
*/
export function getTableBestRows(tableHeight) {
  const bestRows = Number.parseInt((tableHeight - 40) / 40)
  const pageSize = [bestRows]
  let i = bestRows + 10
  do {
    if (i % 5 === 0) {
      pageSize.push(i)
    }
    i++
  }
  while (pageSize.length < 5)
  return pageSize
}
