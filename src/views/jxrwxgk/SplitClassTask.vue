<!-- 走班教学任务-->
<template>
  <div>
    <div class="opera-area">
      <p class="tip">
        <label>温馨提示：</label>请先在空白处填写任务，教学任务填写完毕后请点击“分拆教学任务”。
      </p>
      <operation>
        <el-button type="primary" plain @click="splitTaskBtn" :loading="splitTaskLoading">分拆教学任务</el-button>
        <el-button type="primary" plain @click="saveArrange" :loading="saveArrangeLoading">临时保存</el-button>
      </operation>
    </div>
    <div class="data-area" v-loading="loading">
      <hot-table :settings="settings" ref="hotTableComponent" v-if="showTable"></hot-table>
    </div>
  </div>
</template>
<script>
import { qryArrangeDetail } from '@/api/pkcx'
import { HotTable } from '@handsontable/vue'
import { qryCourseTaskList, saveCourseTaskList, splitTask } from '@/api/skrwPt'
import { numValidator } from '@/utils/validate'
export default {
  components: {
    HotTable
  },
  data() {
    const h = 240
    const tableH = document.body.clientHeight - h
    return {
      tableH,
      loading: false,
      saveArrangeLoading: false, // 保存按钮
      splitTaskLoading: false, // 分拆教学任务按钮
      hotInstance: null,
      showTable: false,
      arrangeId: sessionStorage.getItem('local_arrangeId'),
      gradeStr: '',
      // 表格数据
      remoteHeaders: [], // 保存时需要的参数
      settings: {
        className: 'htCenter',
        fixedColumnsLeft: 4,
        data: null,
        dataSchema: {
          segName: null,
          gradeName: null,
          className: null,
          chargeTeaName: null
        },
        rowHeaders: true,
        colHeaders: ['学段/专业', '年 级', '班级名称'],
        columns: [
          { data: 'segName', readOnly: true, trimWhitespace: true },
          { data: 'gradeName', readOnly: true, trimWhitespace: true },
          { data: 'className', readOnly: true, trimWhitespace: true }
        ],
        height: document.body.clientHeight - 250
      }
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    // 分拆教学任务
    async splitTaskBtn() {
      this.splitTaskLoading = true
      const res = await splitTask({
        arrangeId: this.arrangeId,
        taskType: '2'
      }).finally(() => {
        this.splitTaskLoading = false
      })
      if (res.SUCCESS) this.$message.success(res.MSG)
    },
    async getTableData() {
      // 获取表单数据
      const base = await qryArrangeDetail({
        arrangeId: this.arrangeId
      })
      const { gradeId } = base.DATA
      this.loading = true
      const res = await qryCourseTaskList({
        arrangeId: this.arrangeId,
        gradeId,
        moveFlag: 2
      }).finally(() => {
        this.loading = false
      })
      if (!Object.keys(res.DATA).length) return
      const { headers, classList } = res.DATA
      this.remoteHeaders = [...headers] // 保存任课安排时需要的参数
      this.settings.colHeaders.push(...headers)
      const len = headers.length
      const columns = []
      const dataSchema = {}
      for (let i = 1; i <= len; i++) {
        const temp = {
          data: `col${i}`,
          trimWhitespace: true
        }
        if (i % 2 === 0) {
          Object.assign(temp, {
            validator: numValidator,
            allowInvalid: true
          })
        } else {
          Object.assign(temp, {
            className: 'columnClass'
          })
        }
        columns.push(temp)
        dataSchema[`col${i}`] = null
      }
      this.settings.columns.push(...columns)
      Object.assign(this.settings.dataSchema, dataSchema)
      this.showTable = true
      this.$nextTick(() => {
        this.hotInstance = this.$refs.hotTableComponent.hotInstance
        if (classList.length) {
          this.hotInstance.loadData(classList)
          this.tableCellReadOnly()
        }
      })
    },
    tableCellReadOnly() {
      const datas = this.hotInstance.getSourceData()
      const theThis = this
      this.hotInstance.updateSettings({
        cells: function(row, col) {
          const cellProperties = {}
          if (col - 3 > -1) {
            const property1 = theThis.remoteHeaders[col - 3]
            const property2 = theThis.remoteHeaders[col - 4]
            const classDesc = datas[row].classDesc
            if (
              classDesc.indexOf(property1) > -1 ||
              classDesc.indexOf(property2) > -1
            ) {
              cellProperties.readOnly = false
            } else {
              cellProperties.readOnly = true
            }
          }
          return cellProperties
        }
      })
    },
    // 保存按钮
    async saveArrange() {
      const tableData = this.hotInstance.getSourceData()
      const params = {
        arrangeId: this.arrangeId,
        headerStr2: this.remoteHeaders.join(','),
        classList: tableData
      }
      const len = params.classList.length
      const validateRows = []
      for (let i = 0; i <= len; i++) {
        tableData[i] && (tableData[i].moveFlag = 2)
        validateRows.push(i)
      }
      this.hotInstance.validateRows(validateRows, async valid => {
        if (valid) {
          // if (!this.validNullLine(params.classList, len)) {
          //   this.$message.warning('所有单元格都必须填写')
          //   return
          // }
          this.saveArrangeLoading = true
          const res = await saveCourseTaskList(params).finally(() => {
            this.saveArrangeLoading = false
          })
          const { classList } = res.DATA
          this.hotInstance.loadData(classList)
          this.$message.success(res.MSG)
        } else {
          this.$message.warning('字段校验不通过')
        }
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
p.tip {
  display: inline-block;
  position: relative;
  top: 14px;
}
.opera-area {
  overflow: hidden;
  margin-bottom: 10px;
  > div {
    display: inline-block;
    float: right;
  }
}
.data-area {
  border: 1px solid #dddddd;
}
</style>
<style>
.columnClass {
  font-weight: bold;
  text-align: center;
}
</style>

