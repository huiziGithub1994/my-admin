import { qryCalendar } from '@/api/base'
import { qryPreArrangeCell } from '@/api/pkgzPt'
export default {
  methods: {
    // 获取校历数据
    async fetchCalendarData() {
      // 获取校历信息
      const res = await qryCalendar({ calenderId: this.calenderId })
      this.calendarData = res.DATA
      const {
        countInMorning,
        countMorning,
        countAfternoon,
        countNight
      } = res.DATA
      this.count =
        Number(countInMorning) +
        Number(countMorning) +
        Number(countAfternoon) +
        Number(countNight)
      // 将校历信息填充表格 并 修改表格配置，校历信息中的内容为不可修改
      this.initEditTableData()
    },
    // 初始化表格的头部、行列、数据为空
    initEditTableData() {
      const baseHeader = ['节次/星期']
      if (!this.calendarData) {
        return
      }
      const weeks = [
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六',
        '星期日'
      ]
      const { workDays } = this.calendarData
      // 生成表头
      this.colHeaders = [...baseHeader, ...weeks.slice(0, workDays)]
    },
    // 获取排课表格数据，并填入校历数据
    async queryArrangeTableData(params) {
      const res = await qryPreArrangeCell(params)
      // 将校历数据填入表格
      const { calFixList } = this.calendarData
      this.calendarCell = []
      const tempCell = []
      calFixList.forEach(item => {
        const [row, col] = item.cellKey.split(',').map(x => Number(x))
        res.DATA[row][`col${col + 1}M`] = {
          cellMeaning: item.cellValue,
          cellType: '1'
        }
        tempCell.push(`${row},${col}`)
      })
      this.calendarCell.push(...tempCell)
      this.arrangeTableData = res.DATA
    },
    // 排课表格的点击 校验
    cellClickValid(row, column) {
      if (column.property === 'rowOrder') return false
      const sub = column.property.substring(3, column.property.length - 1)
      const pos = `${row.rowOrder - 1},${sub - 1}`
      if (this.calendarCell.includes(pos)) {
        this.$message.warning('校历维护中的数据不可以进行排课')
        return false
      }
      return true
    },
    // 表格单元添加样式
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) return ''
      if (this.calendarCell.includes(`${rowIndex},${columnIndex - 1}`)) {
        return 'isCalendar'
      }
      if (row[`col${columnIndex}M`]) return 'canRemove'
      return ''
    },
    // 删除课时预排
    removeArrange(row, index) {
      row['col' + index + 'M'] = null
    }
  }
}
