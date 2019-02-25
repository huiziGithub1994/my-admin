<template>
  <!--  学科分层及课时 tab页  按成绩分层-->
  <div v-loading="loading">
    <div class="top">
      <el-button type="primary" plain @click="saveBtn" :loading="saveBtnLoading">保存</el-button>
    </div>
    <div class="hottable-wappper" v-if="showTable">
      <hot-table :settings="settings" ref="hotTableComponent"></hot-table>
    </div>
  </div>
</template>
<script>
import { HotTable } from '@handsontable/vue'
import 'handsontable/languages/zh-CN'
import {
  qryArrangeDetail,
  selectBatchStuScore,
  saveBatchStuScore
} from '@/api/pkcx'
// import { columnsWidth } from '@/utils/businessUtil'

export default {
  components: {
    HotTable
  },
  data() {
    const sexValidator = (val, callback) => {
      const arr = ['男', '女', '']
      if (!arr.includes(val)) {
        callback(false)
      } else {
        callback(true)
      }
    }
    return {
      showTable: false,
      saveBtnLoading: false,
      loading: true,
      arrangeId: sessionStorage.getItem('local_arrangeId'),
      // 表格数据
      hotInstance: null,
      settings: {
        language: 'zh-CN',
        contextMenu: ['row_above', 'row_below', 'remove_row'],
        className: 'htCenter',
        data: null,
        minRows: 15,
        dataSchema: {
          rsId: null,
          arrangeId: sessionStorage.getItem('local_arrangeId'),
          segName: null,
          gradeName: null,
          className: null,
          stuNo: null,
          stuName: null,
          stuSex: null
        },
        rowHeaders: true,
        colHeaders: [],
        fixedColumnsLeft: 6,
        columns: [
          { data: 'segName', trimWhitespace: true },
          { data: 'gradeName', trimWhitespace: true },
          { data: 'className', trimWhitespace: true },
          { data: 'stuNo', trimWhitespace: true },
          { data: 'stuName', trimWhitespace: true },
          {
            data: 'stuSex',
            trimWhitespace: true,
            validator: sexValidator,
            allowInvalid: true
          }
        ],
        height: document.body.clientHeight - 300,
        colWidths: [170, 120, 120, 140, 100, 60]
      }
    }
  },
  async created() {
    await this.fetchHeaders()
    this.getTableData()
  },
  methods: {
    // 获取表头
    async fetchHeaders() {
      const res = await qryArrangeDetail({
        arrangeId: this.arrangeId
      })
      const { headerStr } = res.DATA
      if (!headerStr) return
      const colHeaders = headerStr.split(',')
      const dataSchema = {}
      const columns = []
      const colWidths = []
      colHeaders.slice(6).forEach((item, index) => {
        dataSchema[`col${index + 1}`] = null
        columns.push({
          data: `col${index + 1}`,
          trimWhitespace: true,
          type: 'numeric',
          validator: this.scoreValidator,
          allowInvalid: true
        })
        colWidths.push(100)
      })
      this.settings.colHeaders.push(...colHeaders)
      this.settings.columns.push(...columns)
      this.settings.colWidths.push(...colWidths)
      Object.assign(this.settings.dataSchema, dataSchema)
      this.showTable = true
      this.$nextTick(() => {
        this.hotInstance = this.$refs.hotTableComponent.hotInstance
      })
    },
    scoreValidator(value, callback) {
      if (value !== '') {
        if (typeof value !== 'number') {
          callback(false)
        } else {
          const temp = value + ''
          if (temp.indexOf('.') > -1 && temp.split('.')[1].length > 1) {
            callback(false)
          } else {
            callback(true)
          }
        }
      } else {
        callback(true)
      }
    },
    // 获取表格数据
    async getTableData() {
      if (!this.showTable) {
        this.loading = false
        return
      }
      const res = await selectBatchStuScore({
        arrangeId: this.arrangeId
      }).finally(() => {
        this.loading = false
      })
      this.hotInstance.loadData(res.DATA)
    },
    queryBtn() {},
    validRows(row) {
      const { segName, gradeName, className, stuNo, stuName, stuSex } = row
      if (segName && gradeName && className && stuNo && stuName && stuSex) {
        return true
      }
      return false
    },
    // 保存按钮
    saveBtn() {
      if (!this.showTable) {
        return
      }
      const data = this.hotInstance.getSourceData()
      const newData = []
      const rows = []
      data.forEach((item, index) => {
        if (this.validRows(item)) {
          newData.push(item)
          rows.push(index)
        }
      })
      if (newData.length === 0) {
        return
      }
      this.hotInstance.validateRows(rows, async valid => {
        if (valid) {
          this.saveBtnLoading = true
          await saveBatchStuScore(newData).finally(() => {
            this.saveBtnLoading = false
          })
          this.getTableData()
          this.$message.success('保存成功')
        } else {
          this.$message.warning('输入数据不合法')
        }
      })
    }
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

