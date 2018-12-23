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
          <el-button type="primary" class="saveBtn">保存</el-button>
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
        <el-col :span="18">
          <el-form-item prop="chooseName" label="选课任务名称">
            <el-input placeholder="请输入内容" v-model="data.chooseName" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="18">
          <el-form-item prop="chooseType" label="选课类型">
            <el-radio-group v-model="data.chooseType">
              <el-radio label="1">6选3</el-radio>
              <el-radio label="2">7选3</el-radio>
              <el-radio label="3">分层教学</el-radio>
              <el-radio label="4">校本课</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item prop="chooseTime" label="选课时间段">
            <el-date-picker v-model="data.chooseTime" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="18">
          <el-form-item prop="status" label="发布状态">
            <el-radio-group v-model="data.status">
              <el-radio label="1">发布</el-radio>
              <el-radio label="2">未发布</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="18">
          <el-form-item prop="desc" label="简要说明">
            <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="data.desc"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import moment from 'moment'
// import { getChooseCourseBaseInfo } from '@/api/xkdy'
export default {
  name: 'BaseInfo',
  data() {
    return {
      // 表单数据
      data: {},
      // 基础信息表单规则
      baseInfoRules: {
        schoolYear: [
          { required: true, message: '请选择学年', trigger: 'change' }
        ],
        termCode: [
          { required: true, message: '请选择学期', trigger: 'change' }
        ],
        chooseName: [
          { required: true, message: '请输入选课任务名称', trigger: 'blur' }
        ],
        chooseType: [
          { required: true, message: '请选择选课类型', trigger: 'change' }
        ],
        chooseTime: [
          { required: true, message: '请选择选课时间段', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择发布状态', trigger: 'change' }
        ]
      }
    }
  },
  created() {},
  methods: {
    // 获取表单数据
    async fetchFormData() {},
    // 下一步按钮
    baseInfoNext() {
      this.$refs['baseInfoRef'].validate(valid => {
        if (valid) {
          console.log('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 节次时间数据的重组
    assembleLession(data) {
      data.forEach(item => {
        item.lessionsTime.forEach(lession => {
          Object.assign(lession, {
            time: [
              moment(lession.beginTime, 'HH:mm'),
              moment(lession.endTime, 'HH:mm')
            ]
          })
        })
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
