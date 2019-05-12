<!-- 行政班教学任务-->
<template>
  <div>
    <div class="opera-area">
      <div class="right">
        <el-button type="primary" plain @click="splitTaskBtn" :loading="splitTaskLoading">分拆教学任务</el-button>
        <el-button type="primary" plain @click="saveArrange" :loading="saveArrangeLoading">保存</el-button>
      </div>
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
      splitTaskLoading: false, // 分拆教学任务
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
        colHeaders: ['学段/专业', '年 级', '行政班级', '班 主 任'],
        columns: [
          { data: 'segName', readOnly: true, trimWhitespace: true },
          { data: 'gradeName', readOnly: true, trimWhitespace: true },
          { data: 'className', readOnly: true, trimWhitespace: true },
          {
            data: 'chargeTeaName',
            trimWhitespace: true,
            className: 'columnClass'
          }
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
      const res = await splitTask({ arrangeId: this.arrangeId }).finally(() => {
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
        moveFlag: 1
      }).finally(() => {
        this.loading = false
      })
      if (!Object.keys(res.DATA).length) return
      const { headers, classList } = res.DATA
      const headerArr = headers
      this.remoteHeaders = [...headerArr] // 保存任课安排时需要的参数
      this.settings.colHeaders.push(...headerArr)
      const len = headerArr.length
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
        this.hotInstance.loadData(classList)
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
        tableData[i] && (tableData[i].moveFlag = 1)
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
.opera-area {
  overflow: hidden;
  > .right {
    float: right;
  }
}
.data-area {
  padding-top: 10px;
}
</style>
<style>
.columnClass {
  font-weight: bold;
  text-align: center;
}
</style>

