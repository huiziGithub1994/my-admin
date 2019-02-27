<template>
  <div>
    <div class="opera-area">
      <p class="tip">
        <label>温馨提示：</label>平台可根据学校的办学类型可自动生成相关学段和对应的学科，用户只需要根据结果微调即可。
      </p>
      <operation>
        <span class="weekTip">
          <label>
            <svg-icon icon-class="point-down"></svg-icon>
          </label>
          共 {{ calculateWeeks }} 周课时
        </span>
        <!-- <el-button type="primary" plain>自动生成</el-button> -->
        <a :href="downloadUrl" download="蓝墨水-走班学科课程分层定义.xls">
          <el-button type="primary" plain>模板下载</el-button>
        </a>
        <el-upload
          class="uploadBtn"
          action="http://47.107.255.128:8089/zxx/upCourseLayer"
          name="filename"
          :show-file-list="false"
          :headers="httpHeaders"
          :before-upload="beforeUpload"
          :on-success="uploadSuccess"
          :data="uploadParams"
          ref="upload"
        >
          <el-button type="primary" plain>导入</el-button>
        </el-upload>
        <el-button type="primary" plain @click="saveBtn">保存</el-button>
      </operation>
    </div>
    <div class="data-area">
      <div class="left" :style="{height:treeHeight+'px'}">
        <el-tree ref="treeRef" :data="treeData" node-key="id" default-expand-all :expand-on-click-node="false" highlight-current @node-click="treeNodeClick">
          <span class="njkc-tree-node" slot-scope="{ node, data }">
            <span class="nodeName">{{ node.label }}</span>
            <span class="btns">
              <el-button type="text" size="mini" v-if="node.level == 1" @click="openDialog('新增学段')">新增学段</el-button>
              <el-button type="text" size="mini" v-if="node.level == 2" @click="openDialog('新增年级',data)">新增年级</el-button>
              <el-button type="text" size="mini" v-if="node.level == 2" @click="openDialog('修改学段',data)">修改</el-button>
              <el-button type="text" size="mini" v-if="node.level == 2" @click="() => remove(node, data,'学段')">删除</el-button>
              <el-button type="text" size="mini" v-if="node.level == 3" @click="openDialog('修改年级',data)">修改</el-button>
              <el-button type="text" size="mini" v-if="node.level == 3" @click="() => remove(node, data,'年级')">删除</el-button>
            </span>
          </span>
        </el-tree>
      </div>
      <div class="right">
        <hot-table :settings="settings" ref="hotTableComponent"></hot-table>
      </div>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="330px">
      <div>
        <el-form :model="addForm" :rules="formRules" ref="ruleForm" label-width="80px">
          <el-form-item label="名称" prop="name">
            <el-input v-model.trim="addForm.name"></el-input>
          </el-form-item>
          <el-form-item label="显示顺序">
            <el-input v-model.trim="addForm.dispOrder"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmBtn">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { HotTable } from '@handsontable/vue'
import 'handsontable/languages/zh-CN'
import {
  qrySegGradeTree,
  handleSeg,
  saveSegGrade,
  qryCourseByGradeId,
  saveCourseList
} from '@/api/njkc'
import { mapGetters } from 'vuex'
import apUrl from '@/api/url'
import { columnsWidth } from '@/utils/businessUtil'

// 原始表格数据
let originTableData = {}
let delTableData = []
export default {
  components: {
    HotTable
  },
  data() {
    const sumWeekValidator = (value, callback) => {
      if (value !== '') {
        if (typeof +value !== 'number') {
          callback(false)
        } else {
          if (+value % 1 === 0) {
            callback(true)
          } else {
            callback(false)
          }
        }
      } else {
        callback(true)
      }
    }
    return {
      downloadUrl: apUrl.coursePlainExcelTemplate, // 下载模板地址
      httpHeaders: {}, // 导入 请求header
      uploadParams: {}, // 导入 参数
      hotInstance: null,
      dialogVisible: false, // 弹窗
      treeHeight: document.body.clientHeight - 170,
      // 树数组
      treeData: [],
      // 表格数据
      calculateWeeks: 0,
      settings: {
        language: 'zh-CN',
        contextMenu: ['row_above', 'row_below', 'remove_row'],
        className: 'htCenter',
        data: null,
        minRows: 15,
        dataSchema: {
          courseName: null,
          sumWeek: null,
          layerFlag: null,
          teaType: null,
          dispOrder: null
        },
        rowHeaders: true,
        colHeaders: ['学科名称', '周课时', '是否分层', '授课方式', '显示顺序'],
        columns: [
          { data: 'courseName', trimWhitespace: true },
          {
            data: 'sumWeek',
            type: 'numeric',
            trimWhitespace: true,
            validator: sumWeekValidator,
            allowInvalid: true
          },
          {
            data: 'layerFlag',
            trimWhitespace: true,
            type: 'dropdown',
            source: ['是', '否']
          },
          {
            data: 'teaType',
            trimWhitespace: true,
            type: 'dropdown',
            source: ['理论', '实践']
          },
          { data: 'dispOrder', type: 'numeric', trimWhitespace: true }
        ],
        height: document.body.clientHeight - 170,
        colWidths: columnsWidth(
          ['25%', '20%', '20%', '20%', '15%'],
          document.body.clientWidth - 200 - 390
        ),
        beforeRemoveRow: (index, amount, physicalRows, source) => {
          const data = this.hotInstance.getSourceData()
          physicalRows.forEach(row => {
            if (data[row].gradeId) {
              delTableData.push(Object.assign({}, data[row], { action: '2' }))
            }
          })
        },
        afterRemoveRow: () => {
          if (this) {
            this.calculateSumWeek()
          }
        },
        afterChange: () => {
          if (this) {
            this.calculateSumWeek()
          }
        }
      },
      // 表单数据
      addForm: {
        name: '',
        dispOrder: undefined
      },
      // 表单规则
      formRules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      dialogTitle: ''
    }
  },
  computed: {
    ...mapGetters(['token'])
  },
  created() {
    Object.assign(this.httpHeaders, { x_auth_token: this.token })
  },
  mounted() {
    this.hotInstance = this.$refs.hotTableComponent.hotInstance

    this.getTreeData()
  },
  methods: {
    calculateSumWeek() {
      if (this.hotInstance) {
        const data = this.hotInstance.getSourceData()
        let sum = 0
        data.forEach(item => {
          const { sumWeek } = item
          if (sumWeek && !isNaN(+sumWeek)) {
            sum = +sumWeek + sum
          }
        })
        this.calculateWeeks = sum
      }
    },
    // 树节点被点击时
    treeNodeClick(data) {
      const { gradeId } = data
      if (!gradeId) {
        originTableData = {}
        delTableData = []
        this.hotInstance.loadData([])
        return
      }
      this.getTableData(gradeId)
    },
    async getTableData(gradeId) {
      const res = await qryCourseByGradeId({ gradeId })
      const data = res.DATA
      originTableData = {}
      delTableData = []
      data.forEach(item => {
        originTableData[item.courseId] = Object.assign({}, item)
      })
      this.hotInstance.loadData(data)
    },
    // 学段(专业)/年级
    async getTreeData() {
      const res = await qrySegGradeTree()
      this.treeData = [res.DATA]
    },
    // 弹窗中的保存按钮
    confirmBtn() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          const { segId, gradeId } = this.addForm
          switch (this.dialogTitle) {
            case '新增学段':
              this.learningSection(0)
              break
            case '修改学段':
              this.learningSection(1, { segId })
              break
            case '新增年级':
              this.handleGrade(0)
              break
            case '修改年级':
              this.handleGrade(1, { gradeId })
              break
          }
        } else {
          return false
        }
      })
    },
    // 年级
    async handleGrade(action, data) {
      const { name, segId, segName, dispOrder } = this.addForm
      const params = {
        action,
        segId: segId,
        segName,
        gradeName: name,
        dispOrder
      }
      // 修改、删除
      if (data) {
        params.gradeId = data.gradeId
      }
      await saveSegGrade(params)
      if (action < 2) {
        this.$message.success('保存成功')
        this.dialogVisible = false
      }
      this.getTreeData()
    },
    // 学段
    async learningSection(action, data) {
      const { name, dispOrder } = this.addForm
      const params = {
        action,
        segName: name,
        dispOrder
      }
      // 修改、删除
      if (data) {
        params.segId = data.segId
      }
      await handleSeg(params)
      if (action < 2) {
        this.$message.success('保存成功')
        this.dialogVisible = false
      }
      this.getTreeData()
    },
    // 树 新增、修改-》打开弹窗
    openDialog(title, data) {
      this.dialogTitle = title
      this.dialogVisible = true
      if (data) {
        const { segName, gradeName, segId, gradeId, dispOrder } = data
        Object.assign(this.addForm, {
          name: title.indexOf('学段') > -1 ? segName : gradeName,
          segName,
          segId,
          gradeId,
          dispOrder
        })
      } else {
        // 新增
        Object.assign(this.addForm, { name: '', dispOrder: undefined })
      }
    },
    // 树 删除
    remove(node, data, flag) {
      this.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (flag.indexOf('学段') > -1) {
            this.learningSection(2, data)
          } else {
            this.handleGrade(2, data)
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 保存按钮
    saveBtn() {
      const currentNode = this.$refs.treeRef.getCurrentNode()
      if (!currentNode || (currentNode && !currentNode.gradeId)) {
        this.$message.warning('请选择年级')
        return
      }
      const data = this.hotInstance.getSourceData()
      const ressult = this.handleSaveData(data, originTableData)
      const len = ressult.length
      if (len === 0) {
        this.$message.warning('请先修改数据后，再保存')
        return
      }
      const validateRows = []
      for (let i = 0; i <= len; i++) {
        validateRows.push(i)
      }
      this.hotInstance.validateRows(validateRows, async valid => {
        if (valid) {
          await saveCourseList(ressult)

          this.$message.success('保存成功')
          this.getTableData(currentNode.gradeId)
        } else {
          this.$message.warning('字段校验不通过')
        }
      })
    },
    handleSaveData(newData, oldData) {
      const result = []
      const currentNode = this.$refs.treeRef.getCurrentNode()
      if (!currentNode) return
      const { segId, gradeId } = currentNode
      newData.forEach((item, index) => {
        const { courseName, courseId } = item
        if (courseName) {
          if (JSON.stringify(oldData[courseId]) !== JSON.stringify(item)) {
            // 修改
            if (item.courseId) {
              result.push(Object.assign({}, item, { action: '1' }))
            } else {
              // 新增
              result.push(
                Object.assign({}, item, { action: '0', segId, gradeId })
              )
            }
          }
        }
      })
      return [...result, ...delTableData]
    },
    // 文件上传的回调函数
    uploadSuccess(res) {
      if (res.SUCCESS) {
        this.$message({
          message: '文件上传成功!',
          type: 'success'
        })
        // 重新加载数据
        this.fetchData()
        this.getCourseName()
      } else {
        this.$message({
          message: '文件上传失败!',
          type: 'error'
        })
      }
      this.loading = false
    },
    // 文件上传前的钩子
    beforeUpload(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension = testmsg === 'xls'
      const extension2 = testmsg === 'xlsx'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!extension && !extension2) {
        this.$message({
          message: '上传文件只能是 xls、xlsx格式!',
          type: 'warning'
        })
      }
      if (!isLt2M) {
        this.$message({
          message: '上传文件大小不能超过 10MB!',
          type: 'warning'
        })
      }
      this.loading = true
      return extension || (extension2 && isLt2M)
    }
  }
}
</script>
<style  rel="stylesheet/scss" lang="scss">
.njkc-tree-node {
  .nodeName {
    margin-right: 15px;
  }
  &:hover .btns {
    display: inline;
  }
  .btns {
    display: none;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
p.tip {
  display: inline-block;
  position: relative;
  top: 10px;
}
.opera-area {
  overflow: hidden;
  > div {
    display: inline-block;
    float: right;
  }
}
.data-area {
  margin-top: 10px;
  > .left {
    float: left;
    width: 300px;
    margin-right: 10px;
    border: 1px solid #dddddd;
    overflow: auto;
  }
  // > div.right {
  //   > div {
  //     border: 1px solid #dddddd;
  //   }
  // }
}
.uploadBtn {
  display: inline-block;
}
.weekTip {
  margin-right: 10px;
  color: #707070;
  > label {
    color: #f56c6c;
    position: relative;
    top: 4px;
    font-size: 19px;
    margin-right: 4px;
  }
}
</style>
