<!-- 授课录入-->
<template>
  <div>
    <div class="opera-area">
      <div class="right">
        <el-button type="primary" plain @click="saveArrange" :loading="saveBtn">保存</el-button>
      </div>
    </div>
    <div class="data-area" v-loading="loading">
      <hot-table :settings="settings" ref="hotTableComponent"></hot-table>
    </div>
  </div>
</template>
<script>
import { HotTable } from '@handsontable/vue'
import { qryCourseTaskList, splitTask } from '@/api/skrwPt'
export default {
  components: {
    HotTable
  },
  data() {
    return {
      loading: false,
      saveBtn: false, // 保存任课安排
      hotInstance: null,
      showTable: false,
      arrangeId: sessionStorage.getItem('local_arrangeId'),
      gradeStr: sessionStorage.getItem('gradeStr'),
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
        colHeaders: ['学段/专业', '年级', '教学班级', '班主任'],
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
        height: document.body.clientHeight - 270
      }
    }
  },
  created() {
    // this.getTableData()
  },
  methods: {
    async getTableData() {
      this.loading = true
      const res = await qryCourseTaskList({
        arrangeId: this.arrangeId,
        gradeIdsStr: this.gradeStr
      }).finally(() => {
        this.loading = false
      })
      const { headers, classList } = res.DATA
      const headerArr = []
      if (typeof headers === 'string') {
        headerArr.push(...headers.split(','))
      } else {
        headerArr.push(...headers)
      }
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
            validator: this.numValidator,
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
    numValidator(value, callback) {
      if (value !== '' && value !== undefined && value !== null) {
        if (value.indexOf('+') > -1) {
          const splitArr = value.split('+')
          let flag = true
          for (let i = 0; i < splitArr.length; i++) {
            const tVal = splitArr[i]
            if (typeof +tVal !== 'number') {
              flag = false
              break
            } else if (+tVal % 1 !== 0 || tVal.indexOf('.') > -1) {
              flag = false
              break
            }
          }
          callback(flag)
        } else {
          if (typeof +value !== 'number') {
            callback(false)
          } else {
            const valueStr = value + ''
            if (+value % 1 === 0 && valueStr.indexOf('.') < 0) {
              callback(true)
            } else {
              callback(false)
            }
          }
        }
      } else {
        callback(true)
      }
    },
    // 保存任课安排
    async saveArrange() {},
    validNullLine(data, len) {
      const schemaKeys = Object.keys(this.settings.dataSchema)
      const kLen = schemaKeys.length
      let isContinue = true
      for (let i = 0; i < len; i++) {
        for (let j = 0; j < kLen; j++) {
          const dataKey = schemaKeys[j]
          if (!data[i][dataKey]) {
            isContinue = false
            break
          }
        }
        if (!isContinue) break
      }
      return isContinue
    },
    // 分拆教学任务
    async splitTaskBtn() {
      this.splitTaskLoading = true
      const res = await splitTask({ arrangeId: this.arrangeId }).finally(() => {
        this.splitTaskLoading = false
      })
      if (res.SUCCESS) this.$message.success(res.MSG)
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
.tree-wapper {
  height: 300px;
  border: 1px solid #dddddd;
  overflow: auto;
}
</style>
<style>
.columnClass {
  font-weight: bold;
  text-align: center;
}
</style>

