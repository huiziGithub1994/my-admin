<template><!-- 走班教室 tab页-->
  <div>
    <div v-area v-if="initArea">
      <condition>
        <div class="condition">
          <label>课程分类</label>
          <selectChild v-model="search['type']" clearable tp="yearSelect"/>
        </div>
        <div class="condition">
          <label>教室名称</label>
          <el-input v-model="search['type']"></el-input>
        </div>
      </condition>
      <operation>
        <el-button type="primary" plain>查询</el-button>
        <el-button type="primary" plain @click="addBtn">增加</el-button>
      </operation>
    </div>
    <div class="table-wapper">
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" highlight-current-row style="width: 100%">
        <el-table-column type="index" width="55" label="序号" fixed></el-table-column>
        <el-table-column label="教学楼" property="grade" fixed></el-table-column>
        <el-table-column label="教室名称" property="classes" fixed></el-table-column>
        <el-table-column label="可上课门数" property="stuno" width="100" fixed></el-table-column>
        <el-table-column label="课程列表" property="stuname"></el-table-column>
        <el-table-column fixed="right" width="90px" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini">修改</el-button>
            <el-button type="text" size="mini" class="deleteBtn">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增修改弹窗-->
    <el-dialog :title="editDialogTitle" :visible.sync="editDialogFormVisible" width="700px">
      <el-form :model="editForm" :rules="editRules" ref="ruleFormRef" label-width="70px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="学号" prop="xh">
              <el-input v-model="editForm.xh" placeholder="请输入学号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="xm">
              <el-input v-model="editForm.xm" placeholder="请输入姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年级" prop="gradeCode">
              <selectChild v-model="editForm.gradeCode" tp="gradeSelect"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="行政班" prop="xzb">
              <el-select v-model="editForm.xzb" clearable placeholder="请选择">
                <el-option v-for="item in xzbOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
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
                <div> {{ course.courseName }} </div>
                <el-radio-group v-model="editForm[course.layerId]">
                  <el-radio :label="courseLayer.dispSeq" v-for="(courseLayer,indexNo) in course.courseLayers" :key="indexNo"> {{ courseLayer.courseLayerName }} </el-radio>
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
import { getChooseClassListInfo, getSbjestClassListInfo } from '@/api/pkcx' // getSbjestClassListInfo:学生分层课时数据
import { Validators } from '@/utils/businessUtil'
export default {
  data() {
    return {
      initArea: false,
      search: {
        type: undefined
      },
      tableData: [],
      // 表格高度
      height: document.body.clientHeight - 365,
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
  created() {
    this.fetchData()
    this.fetchSbjestClass()
  },
  methods: {
    // 获取表格数据
    async fetchData() {
      const params = { id: 1 }
      const res = await getChooseClassListInfo(params)
      this.tableData = res.DATA
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
      this.editDialogFormVisible = true
      this.editDialogTitle = '新增走班教室'
    },
    // 修改按钮
    editBtn() {
      this.editDialogFormVisible = true
      this.editDialogTitle = '修改走班教室'
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

