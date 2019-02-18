<template>
  <!--  导入学生选课 / 学生成绩 tab页-->
  <div>
    <div v-area>
      <condition>
        <div class="condition">
          <label>课程分类</label>
          <el-cascader expand-trigger="hover" :options="completeCourseOptions" clearable v-model="choosedCourse" :props="selectProps"></el-cascader>
        </div>
        <div class="condition">
          <label>学号</label>
          <el-input v-model="search['a.stu_no01']" clearable></el-input>
        </div>
      </condition>
      <operation>
        <el-button type="primary" plain @click="queryBtn">查询</el-button>
        <el-button type="primary" plain @click="downTemplate">下载导入模板</el-button>
        <el-upload
          class="uploadBtn"
          action="http://47.107.255.128:8089/zxx/upChoseLayer"
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
        <el-button type="primary" plain>导出</el-button>
        <el-button type="primary" @click="addBtn" plain>增加</el-button>
        <!-- <el-button type="primary" plain>引入</el-button> -->
        <!-- <el-button type="primary" plain>分析</el-button> -->
        <el-button type="primary" @click="editBtn" plain>修改</el-button>
        <el-button type="primary" @click="deleteBtn" plain>删除</el-button>
      </operation>
    </div>
    <div class="table-wapper">
      <el-table ref="multipleTable" :data="tableData" :height="tableH" tooltip-effect="dark" @current-change="tableCurrentChange" highlight-current-row style="width: 100%">
        <el-table-column type="index" :index="getTableIndex" width="55" label="序号" fixed></el-table-column>
        <el-table-column label="学段/专业" property="segName" fixed></el-table-column>
        <el-table-column label="年级" property="gradeName" fixed></el-table-column>
        <el-table-column label="行政班" property="className" fixed></el-table-column>
        <el-table-column label="学号" property="stuNo" width="100" fixed></el-table-column>
        <el-table-column label="姓名" property="stuName" fixed></el-table-column>
        <el-table-column label="性别" property="stuSex" width="55" fixed></el-table-column>
        <!-- 按成绩分层 -->
        <template v-if="splitLayerType==='2'">
          <el-table-column :label="label" :property="item.property" v-for="item in tableCourseHeaders" :key="item.property"></el-table-column>
        </template>
        <!-- 学生自由选择分层 -->
        <el-table-column label="课程组合" property="allNameGroup" min-width="300" v-else></el-table-column>
      </el-table>
      <el-pagination
        :current-page="pageTot.currentPage"
        :page-sizes="pageSizes"
        :page-size="pageTot.pageSize"
        :total="pageTotal"
        layout="total,sizes,slot ,->, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <slot/>
      </el-pagination>
    </div>
    <!-- 新增修改弹窗-->
    <el-dialog :title="editDialogTitle" :visible.sync="editDialogFormVisible" width="700px">
      <el-form :model="editForm" :rules="editRules" ref="ruleFormRef" label-width="70px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="学号" prop="stuNo">
              <el-input v-model="editForm.stuNo" placeholder="请输入学号" :disabled="formItemDisabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="stuName">
              <el-input v-model="editForm.stuName" placeholder="请输入姓名" :disabled="formItemDisabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年级" prop="gradeName">
              <div>{{ editForm.segName }}/{{ editForm.gradeName }}</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="行政班" prop="className">
              <el-select v-model="editForm.className" clearable placeholder="请选择">
                <el-option v-for="item in xzbOptions" :key="item.classId" :label="item.className" :value="item.className"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="stuSex">
              <el-radio-group v-model="editForm.stuSex">
                <el-radio label="男">男</el-radio>
                <el-radio label="女">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="选课">
              <div v-for="course in courseOptions" :key="course.courseId">
                <div>{{ course.courseName }}</div>
                <el-radio-group v-model="layersData[course.courseId]">
                  <el-radio :label="layer.allName" v-for="layer in course.layersList" :key="layer.layerId">{{ layer.courseLayerName }}</el-radio>
                </el-radio-group>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false" plain>取 消</el-button>
        <el-button type="primary" @click="saveEditDialog" plain>保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getChooseClassListInfo,
  delChooseClassListInfo,
  getArrangeClasses,
  saveChooseCourseInfo,
  updatechooseCourseInfo,
  getChooseCourseInfo,
  exportChooseCourse,
  getCourseOptions,
  qryArrangeDetail,
  exportStuChoiceCourseExcel
} from '@/api/pkcx'
import {
  getTableBestRows,
  paramsToString,
  setDatas
} from '@/utils/businessUtil'
import { mapGetters } from 'vuex'
const initFromData = {
  stuSex: '',
  stuNo: '',
  stuName: '',
  className: ''
}
export default {
  data() {
    const h = 330
    const tableH = document.body.clientHeight - h
    const pageSizes = getTableBestRows(tableH + 30)
    return {
      arrangeId: sessionStorage.getItem('local_arrangeId'),
      uploadParams: {},
      search: {
        'a.arrange_id01': '',
        'a.stu_no01': '',
        'a.all_name_group06': ''
      },
      courseOptions: [], // 课程分类
      completeCourseOptions: [], // 新增时课程分类/完整
      choosedCourse: [], // 课程分类下拉列表选中值
      selectProps: {
        value: 'allName',
        label: 'allName',
        children: 'layersList'
      },
      httpHeaders: {},
      splitLayerType: undefined, // 学生分层方式
      tableData: [], // 表单数据
      tableCourseHeaders: [], // 按按成绩分层时，表格新增的课程表头
      pageSizes: pageSizes,
      tableH: tableH,
      pageTot: {
        currentPage: 1,
        pageSize: pageSizes[0]
      },
      pageTotal: 0,
      currentRow: null, // 表格当前选中行
      formItemDisabled: false, // 表单选项是否禁用
      // 新增修改弹窗的显示和隐藏
      editDialogFormVisible: false,
      // 新增修改弹窗的标题
      editDialogTitle: '',
      // 表单数据
      editForm: {
        arrangeId: '',
        segId: '',
        gradeName: '',
        segName: '',
        schoolYear: '',
        termCode: '',
        modelString: '',
        ...initFromData
      },
      // 表单规则
      editRules: {
        stuNo: [{ required: true, message: '请输入学号', trigger: 'blur' }],
        stuName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        gradeName: [{ required: true, message: '请输入年级', trigger: 'blur' }],
        className: [
          { required: true, message: '请选择行政班', trigger: 'change' }
        ],
        stuSex: [{ required: true, message: '请选择性别', trigger: 'blur' }]
      },
      layersData: {}, // 选课分层数据
      // 行政班数据
      xzbOptions: []
    }
  },
  computed: {
    ...mapGetters(['token'])
  },
  async created() {
    Object.assign(this.httpHeaders, { x_auth_token: this.token })
    Object.assign(this.search, { 'a.arrange_id01': this.arrangeId })
    this.uploadParams.arrangeId = this.arrangeId
    this.fetchCourseOption() // 课程分类
    this.fetchArrangeClasses() // 行政班级数据
    await this.fetchBaseInfo() // 获取基础信息，并初始化表单数据
    this.fetchTableData() // 表格数据
  },
  methods: {
    // 下载导入模板
    async downTemplate() {
      const params = {
        'a.arrange_id01': this.arrangeId,
        currentPage: '1',
        pageSize: '10000'
      }
      const res = await exportStuChoiceCourseExcel({
        dataStr: JSON.stringify(params)
      })
      const blob = new Blob([res])
      const fileName = '学生选课分层模板.xls'
      const elink = document.createElement('a')
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href)
      document.body.removeChild(elink)
    },
    // 查询按钮
    queryBtn() {
      this.pageTot.currentPage = 1
      this.fetchTableData() // 表格数据
    },
    getTableIndex(index) {
      const { currentPage, pageSize } = this.pageTot
      return (currentPage - 1) * pageSize + index + 1
    },
    // 课程分类
    async fetchCourseOption() {
      const res = await getCourseOptions({ arrangeId: this.arrangeId })
      res.DATA.forEach(item => {
        Object.assign(item, { allName: item.courseName })
      })
      this.completeCourseOptions = res.DATA
    },
    // 行政班级数据
    async fetchArrangeClasses() {
      const res = await getArrangeClasses({ arrangeId: this.arrangeId })
      this.xzbOptions = res.DATA
    },
    // 获取基础信息，并初始化表单数据
    async fetchBaseInfo() {
      const res = await qryArrangeDetail({
        arrangeId: this.arrangeId
      })
      const {
        arrangeId,
        segName,
        gradeName,
        schoolYear,
        termCode,
        segId,
        splitLayerType
      } = res.DATA
      this.splitLayerType = splitLayerType // 学生分层方式
      Object.assign(this.editForm, {
        arrangeId,
        segName,
        gradeName,
        schoolYear,
        segId,
        termCode
      })
    },
    // 获取表格数据
    async fetchTableData() {
      const params = { ...this.search, ...paramsToString(this.pageTot) }
      if (this.choosedCourse.length) {
        Object.assign(params, { 'a.all_name_group06': this.choosedCourse[1] })
      }
      await getChooseClassListInfo({
        dataStr: JSON.stringify(params)
      }).then(res => {
        this.pageTotal = res.NUM
        this.tableData = res.DATA
        // tableCourseHeaders
      })
    },
    // 新增按钮
    addBtn() {
      this.courseOptions = JSON.parse(
        JSON.stringify(this.completeCourseOptions)
      )
      this.courseOptions.forEach(item => {
        this.$set(this.layersData, item.courseId, '')
      })
      Object.assign(this.editForm, { ...initFromData })
      this.formItemDisabled = false
      this.editDialogFormVisible = true
      this.editDialogTitle = '新增学生选课'
      this.$nextTick(function() {
        this.$refs['ruleFormRef'].clearValidate()
      })
    },
    // 修改按钮
    async editBtn() {
      if (!this.currentRow) {
        this.$message.info('请选择要删除的数据')
        return
      }
      // 获取详情
      const res = await getChooseCourseInfo({ stuNo: this.currentRow.stuNo })
      setDatas(this.editForm, res.DATA)
      // layersData 选课分层数据
      const { courseLayers } = res.DATA
      courseLayers.forEach(item => {
        this.$set(this.layersData, item.courseId, item.allName)
      })
      this.courseOptions = [...courseLayers]
      this.formItemDisabled = true
      this.editDialogFormVisible = true
      this.editDialogTitle = '修改学生选课'
    },

    // 删除接口
    deleteBtn() {
      if (!this.currentRow) {
        this.$message.info('请选择要删除的数据')
        return
      }
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await delChooseClassListInfo({
            arrangeId: this.arrangeId,
            stuNo: this.currentRow.stuNo
          })
          this.$message({
            type: res.SUCCESS ? 'success' : 'error',
            message: res.SUCCESS ? '删除成功!' : '删除失败'
          })
          // 重新加载数据
          if (res.SUCCESS) this.fetchTableData()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 修改、新增弹窗中的保存按钮
    saveEditDialog() {
      this.$refs['ruleFormRef'].validate(async valid => {
        if (valid) {
          const modelString = []
          let isContinue = true
          Object.keys(this.layersData).forEach(key => {
            if (this.layersData[key] === '') {
              isContinue = false
              this.$message.warning('请选择分层')
              return
            }
            const item = {
              layerId: this.getLayerId(key, this.layersData[key]),
              allName: this.layersData[key]
            }
            if (this.editDialogTitle === '修改学生选课') {
              item.resultId = this.getResultId(key)
            }
            modelString.push(item)
          })
          if (!isContinue) return
          if (this.editDialogTitle === '新增学生选课') {
            await saveChooseCourseInfo(
              Object.assign({}, this.editForm, {
                modelString: JSON.stringify(modelString)
              })
            )
          } else {
            const params = {
              className: this.editForm.className,
              stuSex: this.editForm.stuSex
            }
            await updatechooseCourseInfo(
              Object.assign({}, params, {
                modelString: JSON.stringify(modelString)
              })
            )
          }

          this.$message.success('保存成功')
          this.editDialogFormVisible = false
          this.fetchTableData()
        } else {
          return false
        }
      })
    },
    getResultId(courseId) {
      const course = this.courseOptions.find(
        course => course.courseId === courseId
      )
      return course.resultId
    },
    getLayerId(courseId, allName) {
      const course = this.completeCourseOptions.find(
        course => course.courseId === courseId
      )
      const layer = course.layersList.find(layer => layer.allName === allName)
      return layer.layerId
    },
    // 导出按钮
    async exportBtn() {
      const params = {
        'a.arrange_id01': this.arrangeId,
        currentPage: '1',
        pageSize: '10000'
      }
      await exportChooseCourse({ dataStr: JSON.stringify(params) })
    },
    // 文件上传的回调函数
    uploadSuccess(res) {
      if (res.SUCCESS) {
        this.$message({
          message: '文件上传成功!',
          type: 'success'
        })
        this.fetchCourseOption() // 课程分类
        this.fetchTableData() // 表格数据
        this.fetchArrangeClasses() // 行政班级数据
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
    tableCurrentChange(val) {
      this.currentRow = val
    },
    handleSizeChange(val) {
      this.pageTot.currentPage = 1
      this.pageTot.pageSize = val
      this.fetchTableData()
    },
    handleCurrentChange(val) {
      this.pageTot.currentPage = val
      this.fetchTableData()
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.deleteBtn {
  color: red;
}
.table-wapper {
  border: 1px solid #dddddd;
  margin-top: 10px;
}
.uploadBtn {
  display: inline-block;
}
</style>

