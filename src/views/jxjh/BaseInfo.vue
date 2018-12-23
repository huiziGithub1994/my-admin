<template>
  <div>
    <el-form :model="data" ref="baseInfoRef" :rules="baseInfoRules" label-width="120px">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="学年" prop="schoolYear">
            <selectChild v-model="data.schoolYear" clearable tp="yearSelect"/>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-button type="primary" class="float-right" @click="saveBtn">保存</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="学期" prop="termCode">
            <selectChild v-model="data.termCode" clearable tp="termSelect"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="年级" prop="gradeId">
            <el-select v-model="data.gradeId" placeholder="请选择">
              <el-option v-for="item in gradeOptions" :key="item.gradeId" :label="item.gradeName" :value="item.gradeId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="18">
          <el-form-item prop="arrangeName" label="排课任务名称">
            <el-input placeholder="请输入内容" v-model="data.arrangeName" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { qryArrangeDetail, saveArrange } from '@/api/pkcx'
import { getGrade } from '@/api/base'
import { setDatas } from '@/utils/businessUtil'

export default {
  name: 'BaseInfo',
  data() {
    return {
      data: {
        gradeId: undefined,
        gradeName: undefined,
        arrangeName: undefined,
        schoolYear: undefined,
        termCode: undefined
      },
      // arrangeId: undefined,
      // 基础信息表单规则
      baseInfoRules: {
        schoolYear: [
          { required: true, message: '请选择学年', trigger: 'change' }
        ],
        termCode: [
          { required: true, message: '请选择学期', trigger: 'change' }
        ],
        gradeId: [{ required: true, message: '请选择年级', trigger: 'change' }],
        arrangeName: [
          { required: true, message: '请输入排课任务名称', trigger: 'blur' }
        ]
      },
      gradeOptions: []
    }
  },
  computed: {
    arrangeId() {
      return this.$route.query.arrangeId
    }
  },
  async created() {
    const { curYear, curTerm } = this.$route.query
    Object.assign(this.data, { schoolYear: curYear, termCode: curTerm })
    await this.fetchGrade()
    if (this.arrangeId) {
      this.fetchFormData()
    }
  },
  methods: {
    // 年级下拉列表
    async fetchGrade() {
      const { curYear, curTerm } = this.$route.query
      const res = await getGrade({
        schoolYear: curYear,
        termCode: curTerm
      })
      this.gradeOptions = res.DATA
    },
    // 获取表单数据
    async fetchFormData() {
      const res = await qryArrangeDetail({
        arrangeId: this.arrangeId
      })
      setDatas(this.data, res.DATA)
      this.$nextTick(function() {
        this.$refs['baseInfoRef'].clearValidate()
      })
    },
    saveBtn() {
      this.$refs['baseInfoRef'].validate(async valid => {
        if (valid) {
          if (this.arrangeId) {
            Object.assign(this.data, { arrangeId: this.arrangeId })
          }
          const temp = this.gradeOptions.filter(item => {
            return item.gradeId === this.data.gradeId
          })
          Object.assign(this.data, { gradeName: temp[0].gradeName })
          const res = await saveArrange(this.data)
          this.$message.success('保存成功')
          this.$nextTick(function() {
            this.$refs['baseInfoRef'].clearValidate()
          })
          if (!this.arrangeId) {
            this.$router.replace({
              name: 'Jxjh',
              query: { arrangeId: res.DATA, ...this.$route.query }
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
