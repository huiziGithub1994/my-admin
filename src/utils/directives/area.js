// area指令 ：根据功能页面的宽度，将页面的条件域和操作域显示出最优的布局
export default {
  inserted: function(el, binding) {
    // 功能页面宽度.25：条件域左边的margin和操作域右边的margin
    const pageWidth = document.getElementsByClassName('app-main')[0].offsetWidth
    // 条件域宽度，
    const areaConditionWidth = document.getElementById('area-condition')
      .offsetWidth
    // 操作域
    const areaOperation = document.getElementById('area-operation')
    // 操作宽度
    let areaOperationWidth = areaOperation.offsetWidth
    if (areaConditionWidth + areaOperationWidth < pageWidth) {
      document.getElementById('dropdown').style.display = 'none'
      return
    } else {
      document.getElementById('dropdown').style.display = 'initial'
      // 加上“更多条件”的宽度（80px）
      const moreConditionWidth = 80
      areaOperationWidth += moreConditionWidth
      let sum = 0
      const conditionsDOMNodes = document.getElementsByClassName('condition')
      const areaConditionNodes = Array.from(conditionsDOMNodes)
      // 更多条件
      const moreCondition = document.getElementById('moreCondition')
      // 更多条件中检索条件的个数
      let sumInMoreCondition = 0
      areaConditionNodes.forEach((item, index) => {
        sum += item.offsetWidth
        if (sum + areaOperationWidth > pageWidth) {
          moreCondition.appendChild(item.parentElement.removeChild(item))
          sumInMoreCondition++
        }
      })
      // 更多条件中的样式调整，如果大于4个检索，则两列展示，否则一列展示
      if (sumInMoreCondition >= 4) {
        moreCondition.setAttribute('class', 'moreConditionColumns')
      } else {
        moreCondition.removeAttribute('class')
      }
    }
  }
}
