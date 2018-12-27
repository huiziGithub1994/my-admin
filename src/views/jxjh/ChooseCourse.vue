<template>
  <!--  导入学生选课 tab页-->
  <div>
    <div v-area>
      <condition>
        <div class="condition">
          <label>课程分类</label>
          <el-cascader expand-trigger="hover" :options="courseOptions" clearable v-model="choosedCourse" :props="selectProps"></el-cascader>
        </div>
        <div class="condition">
          <label>学号</label>
          <el-input v-model="search['a.stu_no01']" clearable></el-input>
        </div>
      </condition>
      <operation>
        <el-button type="primary" @click="fetchTableData">查询</el-button>
        <a :href="downloadUrl" download="蓝墨水-分层教学学生选课结果.xls">
          <el-button type="primary">模板下载</el-button>
        </a>
        <el-upload
          class="uploadBtn"
          action="http://47.107.255.128:8089/zxx/upChoseLayer"
          name="filename"
          :show-file-list="false"
          :headers="httpHeaders"
          :before-upload="beforeUpload"
          :on-success="uploadSuccess"
          ref="upload"
        >
          <el-button type="primary">导入</el-button>
        </el-upload>
        <!-- <el-button type="primary" @click="exportBtn">导出</el-button> -->
        <el-button type="primary" @click="addBtn">增加</el-button>
        <!-- <el-button type="primary">引入</el-button> -->
        <!-- <el-button type="primary">分析</el-button> -->
        <el-button type="primary" @click="editBtn">修改</el-button>
        <el-button type="primary" @click="deleteBtn">删除</el-button>
      </operation>
    </div>
    <div class="table-wapper">
      <el-table ref="multipleTable" :data="tableData" :height="tableH" tooltip-effect="dark" @current-change="tableCurrentChange" highlight-current-row style="width: 100%">
        <el-table-column type="index" width="55" label="序号" fixed></el-table-column>
        <el-table-column label="年级" property="gradeName" fixed></el-table-column>
        <el-table-column label="行政班" property="className" fixed></el-table-column>
        <el-table-column label="学号" property="stuNo" width="100" fixed></el-table-column>
        <el-table-column label="姓名" property="stuName" fixed></el-table-column>
        <el-table-column label="性别" property="stuSex" width="55" fixed></el-table-column>
        <el-table-column label="课程组合" property="allNameGroup" min-width="300"></el-table-column>
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
            <el-form-item label="学号" prop="xh">
              <el-input v-model="editForm.xh" placeholder="请输入学号" :disabled="formItemDisabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="xm">
              <el-input v-model="editForm.xm" placeholder="请输入姓名" :disabled="formItemDisabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年级" prop="gradeCode">
              <selectChild v-model="editForm.gradeCode" tp="gradeSelect" :disabled="formItemDisabled"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="行政班" prop="xzb">
              <el-select v-model="editForm.xzb" clearable placeholder="请选择" :disabled="formItemDisabled">
                <el-option v-for="item in xzbOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别" prop="xb">
              <el-radio-group v-model="editForm.xb">
                <el-radio label="1">男</el-radio>
                <el-radio label="2">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="选课">
              <div v-for="(course,index) in sbjestClass" :key="index">
                <div>{{ course.courseName }}</div>
                <el-radio-group v-model="editForm[course.layerId]">
                  <el-radio :label="courseLayer.dispSeq" v-for="(courseLayer,indexNo) in course.courseLayers" :key="indexNo">{{ courseLayer.courseLayerName }}</el-radio>
                </el-radio-group>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEditDialog">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getChooseClassListInfo,
  delChooseClassListInfo,
  getSbjestClassListInfo,
  exportChooseCourse,
  getCourseOptions
} from '@/api/pkcx' // getSbjestClassListInfo:学生分层课时数据
import {
  Validators,
  getTableBestRows,
  paramsToString
} from '@/utils/businessUtil'
import { mapGetters } from 'vuex'
import URL from '@/api/url'
export default {
  data() {
    const h = 330
    const tableH = document.body.clientHeight - h
    const pageSizes = getTableBestRows(tableH + 70)
    return {
      search: {
        'a.arrange_id01': '',
        'a.stu_no01': '',
        'a.all_name_group06': ''
      },
      courseOptions: [], // 课程分类
      choosedCourse: [], // 课程分类下拉列表选中值
      selectProps: {
        value: 'allName',
        label: 'allName',
        children: 'layersList'
      },
      downloadUrl: URL.chooseCourseExcelTemplate,
      httpHeaders: {},
      tableData: [],
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
        xh: undefined
      },
      // 表单规则
      editRules: {
        xh: [
          { required: true, validator: Validators.checkNull, trigger: 'blur' }
        ],
        xm: [
          { required: true, validator: Validators.checkNull, trigger: 'blur' }
        ],
        gradeCode: [
          { required: true, validator: Validators.checkNull, trigger: 'change' }
        ],
        xzb: [
          { required: true, validator: Validators.checkNull, trigger: 'change' }
        ],
        xb: [
          { required: true, validator: Validators.checkNull, trigger: 'blur' }
        ]
      },
      // 行政班数据
      xzbOptions: [],
      // 学生分层及课时数据
      sbjestClass: []
    }
  },
  computed: {
    ...mapGetters(['token']),
    arrangeId() {
      return this.$route.query.arrangeId
    }
  },
  created() {
    Object.assign(this.httpHeaders, { x_auth_token: this.token })
    Object.assign(this.search, { 'a.arrange_id01': this.arrangeId })
    this.fetchCourseOption()
    this.fetchTableData()
    // this.fetchSbjestClass()
  },
  methods: {
    // 课程分类
    async fetchCourseOption() {
      const res = await getCourseOptions({ arrangeId: this.arrangeId })
      res.DATA.forEach(item => {
        Object.assign(item, { allName: item.courseName })
      })
      this.courseOptions = res.DATA
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
      })
    },
    // 获取学生分层及课时数据
    async fetchSbjestClass() {
      const res = await getSbjestClassListInfo({
        arrangeId: this.$route.query.arrangeId
      })
      const courseIds = []
      const newData = []
      res.DATA.forEach(item => {
        const indexPos = courseIds.indexOf(item.courseId)
        const tempCourseLayer = {
          courseLayerName: item.courseLayerName,
          dispSeq: item.dispSeq,
          sumWeekClass: item.sumWeekClass
        }
        if (indexPos > -1) {
          newData[indexPos].courseLayers.push(tempCourseLayer)
        } else {
          newData.push({
            layerId: item.layerId,
            arrangeId: item.arrangeId,
            courseId: item.courseId,
            courseLayers: [tempCourseLayer],
            courseName: item.courseName
          })
          courseIds.push(item.courseId)
        }
      })
      this.sbjestClass = newData
    },
    // 新增按钮
    addBtn() {
      this.formItemDisabled = false
      this.editDialogFormVisible = true
      this.editDialogTitle = '新增学生选课'
    },
    // 修改按钮
    editBtn() {
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
      this.$refs['ruleFormRef'].validate(valid => {
        if (valid) {
          console.log('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 导出按钮
    async exportBtn() {
      const params = {
        'a.arrange_id01': this.$route.query.arrangeId,
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
      } else {
        this.$message({
          message: '文件上传失败!',
          type: 'error'
        })
      }
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

