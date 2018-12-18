<template>
  <!-- 学科分层及课时 tab页-->
  <div>
    <div>
      <condition>
        <div class="condition">
          <label>课程名称</label>
          <el-select v-model="search['a.course_id01']" clearable @change="fetchData">
            <el-option v-for="(item,index) in courseOptions" :key="index" :label="item.courseName" :value="item.courseId"></el-option>
          </el-select>
        </div>
      </condition>
      <operation>
        <el-button type="primary">设置课程计划</el-button>
        <el-button type="primary" @click="addBtn">增加</el-button>
        <el-button type="primary" @click="editBtn">修改</el-button>
        <el-button type="primary" @click="deleteBtn">删除</el-button>
      </operation>
    </div>
    <div class="table-wapper">
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" highlight-current-row style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"/>
        <el-table-column type="index" width="55" label="序号"></el-table-column>
        <el-table-column label="课程名称" property="courseName"></el-table-column>
        <el-table-column label="分层类型" property="courseLayerName"></el-table-column>
        <el-table-column label="周课时(节)" property="weekHours"></el-table-column>
      </el-table>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="课程" prop="courseId">
          <el-select v-model="formData.courseId" clearable>
            <el-option v-for="(item,index) in courseOptionsFrom" :key="index" :label="item.courseName" :value="item.courseId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分层名称" prop="courseLayerName">
          <el-input v-model="formData.courseLayerName"></el-input>
        </el-form-item>
        <el-form-item label="课时(节/周)" prop="weekHours">
          <el-input-number v-model="formData.weekHours" :min="1" :max="10"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveBtn">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getSbjestClassListInfo,
  getlayerCourseName,
  delLayerInfo,
  saveLayerInfo
} from '@/api/pkcx'
import { validEditBtn, resetForm, setDatas } from '@/utils/businessUtil'

export default {
  data() {
    return {
      // 表格数据
      tableData: [],
      search: {
        'a.course_id01': ''
      },
      pageTot: {
        currentPage: 1,
        pageSize: 1000
      },
      // 课程名称下拉菜单数据
      courseOptions: [],
      courseOptionsFrom: [],
      multipleSelection: [], // 表格选中项
      height: document.body.clientHeight - 365,
      dialogFormVisible: false,
      dialogTitle: '新增',
      rules: {
        courseId: { required: true, message: '请选择课程', trigger: 'change' },
        courseLayerName: {
          required: true,
          message: '请输入分层名称',
          trigger: 'blur'
        },
        sumWeekClass: {
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
        weekHours: 0,
        arrangeId: ''
        // layerId
      }
    }
  },
  created() {
    const { curYear, curTerm } = this.$route.query
    Object.assign(this.search, {
      'a.school_year01': curYear,
      'a.term_code01': curTerm
    })
    this.fetchData()
    this.getCourseName()
  },
  methods: {
    // 获取表格数据
    async fetchData() {
      const res = await getSbjestClassListInfo({
        ...this.pageTot,
        ...this.search
      })
      this.tableData = res.DATA
    },
    // 课程名称下拉列表数据
    async getCourseName() {
      const res = await getlayerCourseName({
        arrangeId: this.$route.query.arrangeId
      })
      this.courseOptions = res.DATA
      this.courseOptionsFrom = [...res.DATA]
    },
    // 新增按钮
    addBtn() {
      this.dialogFormVisible = true
      this.dialogTitle = '新增'
      resetForm(this.formData)
      const { curYear, curTerm, arrangeId } = this.$route.query
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
          const res = await saveLayerInfo(
            Object.assign(params, this.formData, {
              allName: this.matchCourseName(courseId) + courseLayerName
            })
          )
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
              resetForm(this.formData)
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
          const res = await delLayerInfo({
            layerId: ids.join(','),
            arrangeId: this.$route.query.arrangeId,
            a: '2'
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
    }
  }
}
</script>
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
</style>

