<template>
  <!--  学科分层及课时 tab页  按成绩分层-->
  <div>
    <div class="top">
      <el-button type="primary" plain @click="saveBtn">保存</el-button>
    </div>
    <div class="hottable-wappper" v-if="showTable">
      <hot-table :settings="settings" ref="hotTableComponent"></hot-table>
    </div>
  </div>
</template>
<script>
import { HotTable } from '@handsontable/vue'
import 'handsontable/languages/zh-CN'
// import { columnsWidth } from '@/utils/businessUtil'

export default {
  components: {
    HotTable
  },
  data() {
    return {
      showTable: false,
      // 表格数据
      settings: {
        language: 'zh-CN',
        contextMenu: ['row_above', 'row_below', 'remove_row'],
        className: 'htCenter',
        data: null,
        minRows: 15,
        dataSchema: {
          segName: null,
          className: null,
          stuNo: null,
          stuName: null,
          stuSex: null
        },
        rowHeaders: true,
        colHeaders: ['学段/专业', '年级', '行政班', '学号', '姓名', '性别'],
        fixedColumnsLeft: 6,
        columns: [
          { data: 'segName', trimWhitespace: true },
          { data: 'className', trimWhitespace: true },
          { data: 'stuNo', trimWhitespace: true },
          { data: 'stuName', trimWhitespace: true },
          { data: 'stuSex', trimWhitespace: true }
        ],
        height: document.body.clientHeight - 300,
        colWidths: [170, 120, 120, 140, 100, 60]
      }
    }
  },
  created() {
    this.fetchHeaders()
  },
  methods: {
    // 获取表头
    fetchHeaders() {
      const colHeaders = [
        '语文',
        '数学',
        '英语',
        '生物',
        '物理',
        '化学',
        '化学',
        '地理',
        '政治'
      ]
      const dataSchema = {}
      const columns = []
      const colWidths = []
      colHeaders.forEach((item, index) => {
        dataSchema[`col${index}`] = null
        columns.push({ data: `col${index}`, trimWhitespace: true })
        colWidths.push(100)
      })
      this.settings.colHeaders.push(...colHeaders)
      this.settings.columns.push(...columns)
      this.settings.colWidths.push(...colWidths)
      Object.assign(this.settings.dataSchema, dataSchema)
      this.showTable = true
    },
    queryBtn() {},
    saveBtn() {}
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.top {
  margin-bottom: 10px;
  overflow: hidden;
  > button {
    float: right;
  }
}
</style>

