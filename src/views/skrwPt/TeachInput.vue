<!-- 授课录入-->
<template>
  <div>
    <div class="opera-area">
      <div class="left tip">
        <div class="left">操作说明:</div>
        <div class="right">
          <p>1、请先“选择排课年级”，然后在表格中编辑任课信息即可</p>
          <p>2、连课堂请用格式如3+2表示5节课有2节连课堂</p>
          <p>3、如某一节有两位教师请用+号连接</p>
        </div>
      </div>
      <div class="right">
        <el-button type="primary" plain @click="chooseGrade" :disabled="disabledChooseGrade">选择参排年级</el-button>
        <el-button type="primary" plain @click="saveArrange" :loading="saveArrangeLoading">保存任课安排</el-button>
        <el-button type="primary" plain @click="splitTaskBtn" :loading="splitTaskLoading">分拆教学任务</el-button>
      </div>
    </div>
    <div class="data-area" v-loading="loading">
      <hot-table :settings="settings" ref="hotTableComponent" v-if="showTable"></hot-table>
    </div>
    <el-dialog title="选择参排年级" :visible.sync="dialogVisible" width="400px">
      <div class="tree-wapper">
        <el-tree ref="treeRef" :data="treeData" node-key="id" default-expand-all show-checkbox :expand-on-click-node="false"></el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { HotTable } from '@handsontable/vue'
import { qrySegGradeTree } from '@/api/njkc'
import { qryCourseTaskList, saveCourseTaskList, splitTask } from '@/api/skrwPt'
import { numValidator } from '@/utils/validate'
export default {
  components: {
    HotTable
  },
  data() {
    return {
      loading: false,
      saveArrangeLoading: false, // 保存任课安排
      splitTaskLoading: false, // 分拆教学任务
      disabledChooseGrade: false, // 选择参排年级
      hotInstance: null,
      showTable: false,
      dialogVisible: false, // 弹窗
      arrangeId: sessionStorage.getItem('local_arrangeId'),
      gradeStr: sessionStorage.getItem('gradeStr'),
      treeData: [],
      // 表格数据
      remoteHeaders: [], // 保存任课安排时需要的参数
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
        colHeaders: ['学段/专业', '年级', '班级名称', '班主任'],
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
    this.getTreeData()
    if (this.gradeStr) {
      this.getTableData()
      this.disabledChooseGrade = true
    } else {
      const h = this.$createElement
      this.$notify({
        title: '提示',
        message: h(
          'i',
          { style: 'color: teal' },
          '请点击“请选择参排年级”按钮进行排课'
        ),
        duration: 8 * 1000
      })
      return
    }
  },
  methods: {
    // 学段(专业)/年级
    async getTreeData() {
      const res = await qrySegGradeTree()
      this.treeData = [res.DATA]
    },
    async getTableData() {
      this.loading = true
      const res = await qryCourseTaskList({
        arrangeId: this.arrangeId,
        gradeIdsStr: this.gradeStr,
        moveFlag: 0
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
        this.hotInstance.loadData(classList)
      })
    },

    // 选择参排年级
    chooseGrade() {
      this.dialogVisible = true
    },
    // 选择参排年级 弹窗中的确定按钮
    confirmBtn() {
      const keys = this.$refs.treeRef.getCheckedKeys(true)
      if (keys.length === 0) {
        this.$message.warning('请选择年级')
        return
      }
      if (this.showTable) {
        this.$confirm('原来的课程安排数据会被清空, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.refreshData(keys)
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
            this.dialogVisible = false
          })
      } else {
        this.refreshData(keys)
      }
    },
    refreshData(keys) {
      this.gradeStr = keys.join(',')
      this.getTableData()
      this.dialogVisible = false
    },
    // 保存任课安排
    async saveArrange() {
      const params = {
        arrangeId: this.arrangeId,
        headerStr: this.remoteHeaders.join(','),
        gradeStr: this.gradeStr,
        classList: this.hotInstance.getSourceData()
      }
      const len = params.classList.length
      const validateRows = []
      for (let i = 0; i <= len; i++) {
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
          sessionStorage.setItem('gradeStr', this.gradeStr)
          const { classList } = res.DATA
          this.hotInstance.loadData(classList)
          this.$message.success('保存成功')
          this.$emit('updateTab', 'two')
        } else {
          this.$message.warning('字段校验不通过')
        }
      })
    },
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
  display: flex;
  > .left {
    flex: 1;
  }
  > div.tip {
    height: 60px;
    > div.left {
      float: left;
      width: 70px;
      height: 100%;
      color: #67c23a;
    }
    > div.right p {
      margin: 0 0 5px 0;
    }
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

