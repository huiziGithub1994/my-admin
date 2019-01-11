<template>
  <!-- 选课设置 -》 基础信息-->
  <div>
    <el-form :model="data" ref="baseInfoRef" :rules="baseInfoRules" label-width="120px">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="当前学年" prop="schoolYear">
            <selectChild v-model="data.schoolYear" clearable tp="yearSelect"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" class="saveBtn" @click="saveBtn">保存</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="当前学期" prop="termCode">
            <selectChild v-model="data.termCode" clearable tp="termSelect"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="年级" prop="selectedGrade">
            <el-cascader style="width:100%" expand-trigger="hover" :options="gradeOptions" placeholder="请选择" clearable v-model="data.selectedGrade" :props="selectProps"></el-cascader>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="18">
          <el-form-item prop="chooseName" label="选课任务名称">
            <el-input placeholder="请输入内容" v-model="data.choseTaskName" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="18">
          <el-form-item prop="chooseType" label="任务类型">
            <el-radio-group v-model="data.choseType">
              <el-radio label="1">新高考选考</el-radio>
              <el-radio label="2">分层教学</el-radio>
              <el-radio label="3">校本课</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="选课时间段">
            <el-date-picker v-model="chooseTime" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :format="formatTime" :value-format="formatTime"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="18">
          <el-form-item prop="status" label="发布状态">
            <el-radio-group v-model="data.pubFlag">
              <el-radio label="1">发布</el-radio>
              <el-radio label="0">未发布</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="18">
          <el-form-item prop="desc" label="简要说明">
            <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="data.moreDesc"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { qrySjsChoseTaskByChoseId, saveSjsChoseCourseDef } from '@/api/xkrw'
import { getSegGrade } from '@/api/base'
import { setDatas } from '@/utils/businessUtil'
// import moment from 'moment'
export default {
  name: 'BaseInfo',
  data() {
    return {
      choseRsId: sessionStorage.getItem('local_arrangeId'),
      formatTime: 'yyyy-MM-dd HH:mm',
      // 表单数据
      data: {
        beginTime: '',
        choseType: '1',
        choseTaskName: '',
        endTime: '',
        moreDesc: null, // 简要说明
        pubFlag: '',
        schoolId: '',
        schoolYear: '',
        termCode: '',
        gradeId: undefined,
        segId: undefined,
        selectedGrade: []
      },
      selectProps: {
        value: 'gradeId',
        label: 'gradeName',
        children: 'gradesList'
      },
      gradeOptions: [], // 学段/专业/年级
      chooseTime: [],
      // 基础信息表单规则
      baseInfoRules: {
        schoolYear: [
          { required: true, message: '请选择学年', trigger: 'change' }
        ],
        termCode: [
          { required: true, message: '请选择学期', trigger: 'change' }
        ],
        choseTaskName: [
          { required: true, message: '请输入选课任务名称', trigger: 'blur' }
        ],
        choseType: [
          { required: true, message: '请选择选课类型', trigger: 'change' }
        ],
        selectedGrade: [
          { required: true, message: '请选择年级', trigger: 'change' }
        ],
        // chooseTime: [
        //   { required: true, message: '请选择选课时间段', trigger: 'change' }
        // ],
        pubFlag: [
          { required: true, message: '请选择发布状态', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    const { local_curYear, local_curTerm } = sessionStorage
    Object.assign(this.data, {
      schoolYear: local_curYear,
      termCode: local_curTerm
    })
    if (this.choseRsId) {
      this.fetchFormData()
    }
    this.fetchGrade()
  },
  methods: {
    // 年级下拉列表
    async fetchGrade() {
      const { local_curYear, local_curTerm } = sessionStorage
      const res = await getSegGrade({
        schoolYear: local_curYear,
        termCode: local_curTerm
      })
      res.DATA.forEach(item => {
        Object.assign(item, {
          gradeId: item.segId,
          gradeName: item.segName
        })
      })
      this.gradeOptions = res.DATA
    },
    // 获取表单数据
    async fetchFormData() {
      const res = await qrySjsChoseTaskByChoseId({ choseRsId: this.choseRsId })
      setDatas(this.data, res.DATA)
      const { segId, gradeId } = this.data
      this.data.selectedGrade = [segId, gradeId]
      const timeArr = ['beginTime', 'endTime']
      timeArr.forEach((key, index) => {
        this.$set(this.chooseTime, index, res.DATA[key])
      })
    },
    // 保存按钮
    saveBtn() {
      if (this.chooseTime === null || this.chooseTime.length === 0) {
        this.$message.error('选课时间段不能为空')
        return
      }
      this.$refs['baseInfoRef'].validate(async valid => {
        if (valid) {
          const params = {
            ...this.data,
            beginTime: this.chooseTime[0],
            endTime: this.chooseTime[1],
            segId: this.data.selectedGrade[0],
            gradeId: this.data.selectedGrade[1]
          }
          if (this.choseRsId) {
            params.choseRsId = this.choseRsId
          }
          await saveSjsChoseCourseDef(params)
          this.$message.success('保存成功')
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.saveBtn {
  float: right;
}
</style>
