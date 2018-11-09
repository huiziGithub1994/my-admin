<template><!--  导入学生选课 tab页-->
  <div>
    <div v-area v-if="initArea">
      <condition>
        <div class="condition">
          <label>学科分类</label>
          <selectChild v-model="search['schoolYear']" clearable tp="yearSelect"/>
        </div>
        <div class="condition">
          <label>学号</label>
          <el-input placeholder="请输入内容" v-model="search['xh']" clearable></el-input>
        </div>
      </condition>
      <operation>
        <el-button type="primary" plain>查询</el-button>
        <el-button type="primary" plain>导入</el-button>
        <el-button type="primary" plain>导出</el-button>
        <el-button type="primary" plain @click="addBtn">增加</el-button>
        <el-button type="primary" plain @click="editBtn">修改</el-button>
        <el-button type="primary" plain>模板下载</el-button>
        <el-button type="primary" plain>选课分析</el-button>
        <el-button type="primary" plain>选课分析</el-button>
      </operation>
    </div>
    <div class="table-wapper">
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" highlight-current-row style="width: 100%" :height="height">
        <el-table-column type="selection" width="55" fixed></el-table-column>
        <el-table-column type="index" width="55" label="序号" fixed></el-table-column>
        <el-table-column label="年级" property="grade"></el-table-column>
        <el-table-column label="行政班" property="classes"></el-table-column>
        <el-table-column label="学号" property="stuno"></el-table-column>
        <el-table-column label="姓名" property="stuname"></el-table-column>
        <el-table-column label="物理学考" property="wlxk"></el-table-column>
        <el-table-column label="物理选考" property="wlxuk"></el-table-column>
        <el-table-column label="化学选考" property="hxxuk"></el-table-column>
        <el-table-column label="化学学考" property="hxxk"></el-table-column>
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
      show: false,
      // 检索字段
      search: {},
      // 表格数据
      tableData: [],
      // 表格高度
      height: document.body.clientHeight - 370,
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
      this.editDialogTitle = '新增学生选课'
    },
    // 修改按钮
    editBtn() {
      this.editDialogFormVisible = true
      this.editDialogTitle = '修改学生选课'
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
.table-wapper {
  border: 1px solid #dddddd;
  margin: 10px 0;
}
</style>

