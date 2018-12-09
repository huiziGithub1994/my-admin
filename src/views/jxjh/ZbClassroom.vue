<template>
  <!-- 走班教室 tab页-->
  <div>
    <div v-area>
      <condition>
        <div class="condition">
          <label>课程分类</label>
          <el-select v-model="search['layerId']" clearable @change="fetchData">
            <el-option v-for="(item,index) in courseOptions" :key="index" :label="item.courseLayerName" :value="item.layerId"></el-option>
          </el-select>
        </div>
        <div class="condition">
          <label>教室名称</label>
          <el-input v-model="search['building']"></el-input>
        </div>
      </condition>
      <operation>
        <el-button type="primary" @click="queryBtn">查询</el-button>
        <el-button type="primary" @click="addBtn">增加</el-button>
      </operation>
    </div>
    <div class="table-wapper">
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" highlight-current-row style="width: 100%">
        <el-table-column type="index" width="55" label="序号" fixed></el-table-column>
        <el-table-column label="教学楼" property="building" width="130" fixed></el-table-column>
        <el-table-column label="教室名称" property="room" width="130" fixed></el-table-column>
        <el-table-column label="可上课门数" property="number" width="100" fixed></el-table-column>
        <el-table-column label="课程列表" property="courses"></el-table-column>
        <el-table-column fixed="right" width="110px" label="操作">
          <template slot-scope="scope">
            <div class="table-btns">
              <el-button type="primary" size="mini" plain @click="editBtn(scope.row.zbClassroomId)">修改</el-button>
              <el-button type="danger" size="mini" plain @click="deleteBtn(scope.row.zbClassroomId)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增修改弹窗-->
    <el-dialog :title="editDialogTitle" :visible.sync="editDialogFormVisible" width="700px">
      <el-form :model="editForm" :rules="editRules" ref="ruleFormRef" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="教学楼" prop="building">
              <el-input v-model="editForm.building"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="教室名称" prop="room">
              <el-input v-model="editForm.room"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="可上课程">
              <el-checkbox v-model="editForm.number">全选</el-checkbox>
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
  getZbClassroomListInfo,
  getZbClassroomInfo,
  getSbjestClassListInfo
} from '@/api/pkcx' // getSbjestClassListInfo:学生分层课时数据
import { Validators } from '@/utils/businessUtil'
export default {
  data() {
    return {
      initArea: false,
      search: {
        courseId: '',
        building: ''
      },
      courseOptions: [], // 课程分类选项
      tableData: [],
      // 表格高度
      height: document.body.clientHeight - 365,
      // 新增修改弹窗的显示和隐藏
      editDialogFormVisible: false,
      // 新增修改弹窗的标题
      editDialogTitle: '',
      // 表单数据
      editForm: {
        building: '',
        room: ''
      },
      // 表单规则
      editRules: {
        building: [
          { required: true, validator: Validators.checkNull, trigger: 'blur' }
        ],
        room: [
          { required: true, validator: Validators.checkNull, trigger: 'blur' }
        ],
        gradeCode: [
          { required: true, validator: Validators.checkNull, trigger: 'change' }
        ]
      },
      // 行政班数据
      xzbOptions: [],
      // 学生分层及课时数据
      sbjestClass: []
    }
  },
  created() {
    this.fetchData()
    this.fetchSbjestClass()
  },
  methods: {
    // 查询按钮
    queryBtn() {
      this.fetchData()
    },
    // 获取表格数据
    async fetchData() {
      const params = { id: 1 }
      Object.assign(params, this.search)
      const res = await getZbClassroomListInfo(params)
      this.tableData = res.DATA
    },
    // 获取学科分层及课时数据, 重组数据成弹窗中的可选科目
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
      this.courseOptions = [...res.DATA]
    },
    // 新增按钮
    addBtn() {
      this.editDialogFormVisible = true
      this.editDialogTitle = '新增走班教室'
    },
    // 修改按钮
    async editBtn(id) {
      this.editDialogFormVisible = true
      this.editDialogTitle = '修改走班教室'
      const res = await getZbClassroomInfo({ id })
      this.editForm = res.DATA
    },
    // 删除按钮
    deleteBtn(id) {
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await getZbClassroomInfo({ id, a: '2' })
          this.$message({
            type: res.SUCCESS ? 'success' : 'error',
            message: res.SUCCESS ? '删除成功!' : '删除失败'
          })
          // 重新加载数据
          if (res.SUCCESS) this.queryBtn()
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
  margin: 10px 0;
}
</style>

