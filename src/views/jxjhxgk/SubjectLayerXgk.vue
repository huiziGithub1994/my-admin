<template>
  <!-- 学科分层及课时-->
  <div v-loading="loading">
    <div style="overflow:hidden">
      <condition></condition>
      <!-- 2: 走二定一 -->
      <operation v-if="moveMode == 2">
        <el-button type="primary" plain @click="saveOrder" :loading="orderLoading" :disabled="btnDisabled">保存顺序</el-button>
        <el-button type="primary" plain @click="addBtn" :disabled="btnDisabled">增加</el-button>
        <el-button type="primary" plain @click="editBtn" :disabled="btnDisabled">修改</el-button>
        <el-button type="primary" plain @click="deleteBtn" :loading="deleteLoading" :disabled="btnDisabled">删除</el-button>
      </operation>
    </div>
    <div class="table-wapper">
      <el-table ref="multipleTable" :data="tableData" row-key="layerId" fit tooltip-effect="dark" highlight-current-row style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"/>
        <el-table-column type="index" width="55" label="序号"></el-table-column>
        <el-table-column label="课程名称">
          <template slot-scope="scope">
            <span>{{ scope.row.courseName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="分层类型">
          <template slot-scope="scope">
            <span>{{ scope.row.courseLayerName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="周课时(节)">
          <template slot-scope="scope">
            <span>{{ scope.row.weekHours }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="拖拽" width="80" v-if="moveMode == 2">
          <template slot-scope="scope">
            <svg-icon class="drag-handler" icon-class="drag"/>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="课程" prop="courseId">
          <el-select v-model="formData.courseId" clearable :change="dialogSelectChange(formData.courseId)">
            <el-option v-for="(item,index) in courseOptionsFrom" :key="index" :label="item.courseName" :value="item.courseId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分层名称" prop="courseLayerName">
          <el-input v-model="formData.courseLayerName"></el-input>
        </el-form-item>
        <el-form-item label="课时(节/周)" prop="weekHours">{{ formData.weekHours }}</el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button plain @click="dialogFormVisible = false">取 消</el-button>
        <el-button plain type="primary" @click="saveBtn" :loading="saveBtnLoading">保 存</el-button>
      </div>
    </el-dialog>
    <el-dialog title="导入选课任务" :visible.sync="dialogTableVisible" width="80%" class="dialog-padding">
      <import-task v-if="dialogTableVisible" ref="importTask"></import-task>
      <div slot="footer" class="dialog-footer">
        <el-button plain @click="dialogTableVisible = false">取 消</el-button>
        <el-button plain type="primary" @click="importTask">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import ImportTask from '../jxjh/ImportTask'
import Sortable from 'sortablejs'
import {
  getlayerCourseName,
  saveLayerInfo,
  delLayerInfo,
  getSbjestClassListInfo,
  saveCourseLayerListDisp,
  qryArrangeDetail,
  choseTaskRsId
} from '@/api/pkcx'
import {
  validEditBtn,
  resetForm,
  setDatas,
  paramsToString
} from '@/utils/businessUtil'
import { mapGetters } from 'vuex'
import apUrl from '@/api/url'
export default {
  components: {
    ImportTask
  },
  data() {
    return {
      dialogTableVisible: false, // 弹窗
      loading: true,
      btnDisabled: false, // 按钮的禁用
      saveBtnLoading: false,
      uploadLoading: false,
      orderLoading: false,
      deleteLoading: false,
      downloadUrl: apUrl.subjectLayerExcelTemplate, // 下载模板地址
      httpHeaders: {}, // 导入 请求header
      uploadParams: {}, // 导入 参数
      // 表格数据
      tableData: [],
      sortable: null,
      oldList: [],
      newList: [],
      // 检索条件
      search: {},
      // 分页数据
      pageTot: {
        currentPage: 1,
        pageSize: 1000
      },
      // 课程名称下拉菜单数据
      courseOptions: [],
      courseOptionsFrom: [],
      multipleSelection: [], // 表格选中项
      height: document.body.clientHeight - 365,
      // 弹窗数据
      dialogFormVisible: false,
      dialogTitle: '新增',
      rules: {
        courseId: { required: true, message: '请选择课程', trigger: 'change' },
        courseLayerName: {
          required: true,
          message: '请输入分层名称',
          trigger: 'blur'
        },
        weekHours: {
          required: true,
          message: '请输入课时(节/周)',
          trigger: 'blur'
        }
      },
      // 表单数据
      formData: {
        schoolYear: '',
        termCode: '',
        courseId: '',
        courseLayerName: '',
        allName: '',
        weekHours: 1,
        arrangeId: '',
        dispSeq: undefined, // 显示顺序
        lowScore: undefined,
        heighScore: undefined
      },
      query: {
        curYear: sessionStorage.getItem('local_curYear'),
        curTerm: sessionStorage.getItem('local_curTerm'),
        arrangeId: sessionStorage.getItem('local_arrangeId')
      },
      moveMode: null // 走班模式
    }
  },
  computed: {
    ...mapGetters(['token'])
  },
  async created() {
    Object.assign(this.httpHeaders, { x_auth_token: this.token })
    const { curYear, curTerm, arrangeId } = this.query
    // 检索条件赋初始值
    Object.assign(this.search, {
      'a.school_year01': curYear,
      'a.term_code01': curTerm,
      'a.arrange_id01': arrangeId
    })
    this.uploadParams.arrangeId = arrangeId
    // 获取基础信息
    await this.getBaseInfo()
    this.fetchData()
    this.getCourseName()
  },
  methods: {
    // 导入教学任务
    async importTask() {
      const row = this.$refs.importTask.getParams()
      if (!row) {
        this.$message.warning('请先选择“选课任务”')
        return
      }
      this.dialogTableVisible = false
      const res = await choseTaskRsId({
        arrangeId: this.query.arrangeId,
        choseRsId: row.choseRsId
      })
      this.$message.success(res.MSG)
    },
    // 获取基础信息
    async getBaseInfo() {
      const res = await qryArrangeDetail({
        arrangeId: this.query.arrangeId
      })
      const { stepArrangeState } = res.DATA
      this.btnDisabled = +stepArrangeState > 2
    },
    // 获取表格数据
    async fetchData() {
      this.loading = true
      const getStrParams = paramsToString({
        ...this.pageTot,
        ...this.search
      })
      const res = await getSbjestClassListInfo({
        dataStr: JSON.stringify(getStrParams)
      }).finally(() => {
        this.loading = false
      })
      this.tableData = res.DATA
      this.oldList = this.tableData.map(v => v.courseId)
      this.newList = this.oldList.slice()
      if (+this.moveMode !== 2) return
      this.$nextTick(() => {
        this.setSort()
        this.loading = false
      })
    },
    setSort() {
      const el = document.querySelectorAll(
        '.el-table__body-wrapper > table > tbody'
      )[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost',
        setData: function(dataTransfer) {
          dataTransfer.setData('Text', '')
          // to avoid Firefox bug
          // Detail see : https://github.com/RubaXa/Sortable/issues/1012
        },
        onEnd: evt => {
          const targetRow = this.tableData.splice(evt.oldIndex, 1)[0]
          this.tableData.splice(evt.newIndex, 0, targetRow)

          // for show the changes, you can delete in you code
          const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
          this.newList.splice(evt.newIndex, 0, tempIndex)
        }
      })
    },
    // 课程名称下拉列表数据
    async getCourseName() {
      const res = await getlayerCourseName({
        arrangeId: this.query.arrangeId
      })
      this.courseOptions = res.DATA
      this.courseOptionsFrom = [...res.DATA]
    },
    // 新增按钮
    addBtn() {
      this.dialogFormVisible = true
      this.dialogTitle = '新增'
      resetForm(this.formData)
      const { curYear, curTerm, arrangeId } = this.query
      Object.assign(this.formData, {
        schoolYear: curYear,
        termCode: curTerm,
        arrangeId: arrangeId
      })
    },
    // 修改按钮
    async editBtn() {
      if (!validEditBtn(this)) return
      setDatas(this.formData, this.multipleSelection[0])
    },
    dialogSelectChange(id) {
      if (!id) {
        this.formData.weekHours = ''
        return
      }
      const filterItem = this.courseOptions.filter(item => {
        return item.courseId === id
      })
      this.formData.weekHours = filterItem[0].sumWeek
    },
    // 弹窗中的保存按钮
    saveBtn() {
      this.$refs['ruleForm'].validate(async valid => {
        if (valid) {
          const params = {}
          if (this.dialogTitle === '修改') {
            Object.assign(params, {
              layerId: this.multipleSelection[0].layerId
            })
          }
          const { courseId, courseLayerName } = this.formData
          this.saveBtnLoading = true
          const res = await saveLayerInfo(
            Object.assign(params, this.formData, {
              allName: this.matchCourseName(courseId) + courseLayerName
            })
          ).finally(() => {
            this.saveBtnLoading = false
          })
          if (res.SUCCESS) {
            this.fetchData()
          }
          this.$message({
            type: res.SUCCESS ? 'success' : 'error',
            message: res.SUCCESS ? '保存成功!' : '保存失败'
          })
          if (this.dialogTitle === '修改') {
            this.dialogFormVisible = false
          } else {
            if (res.SUCCESS) {
              Object.assign(this.formData, {
                courseId: '',
                courseLayerName: '',
                allName: '',
                weekHours: undefined
              })
            }
          }
        } else {
          return false
        }
      })
    },
    matchCourseName(id) {
      return this.courseOptionsFrom.find(item => id === item.courseId)
        .courseName
    },
    // 删除按钮
    deleteBtn() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请选择要删除的数据',
          type: 'warning'
        })
        return
      }
      const ids = []
      this.multipleSelection.forEach(item => {
        ids.push(item.layerId)
      })
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          this.deleteLoading = true
          const res = await delLayerInfo({
            layerId: ids.join(',')
          }).finally(() => {
            this.deleteLoading = false
          })
          this.$message({
            type: res.SUCCESS ? 'success' : 'error',
            message: res.SUCCESS ? '删除成功!' : '删除失败'
          })
          // 重新加载数据
          if (res.SUCCESS) {
            this.fetchData()
            this.getCourseName()
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
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
    },
    // 保存顺序
    async saveOrder() {
      if (this.tableData.length === 0) return
      const newData = []
      this.tableData.forEach((item, index) => {
        const { layerId } = item
        newData.push({ layerId, dispSeq: index + 1 + '' })
      })
      this.orderLoading = true
      await saveCourseLayerListDisp({
        modelString: JSON.stringify(newData)
      }).finally(() => {
        this.orderLoading = false
      })
      this.$message.success('保存成功')
    }
  }
}
</script>
<style  rel="stylesheet/scss" lang="scss">
.sortable-ghost {
  opacity: 0.8;
  color: #fff !important;
  background: #42b983 !important;
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
.operation-btns {
  overflow: hidden;
  margin-bottom: 10px;
  > div {
    float: right;
  }
}
.table-wapper {
  border: 1px solid #dddddd;
  margin-top: 10px;
  margin-bottom: 10px;
}
.uploadBtn {
  display: inline-block;
}
.drag-handler {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
</style>

