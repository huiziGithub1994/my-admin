<template>
  <div>
    <!-- 学校信息-->
    <el-form :model="data" ref="baseInfoRef" :rules="baseInfoRules" label-width="120px">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="学校名称" prop="schoolName">
            <el-input placeholder="请输入内容" v-model.trim="data.schoolName" clearable maxlength="60"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" class="float-right" @click="saveBtn" plain>保存</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="办学类型" prop="dicId">
            <el-select v-model="data.dicId" placeholder="请选择">
              <el-option v-for="item in schoolOptions" :key="item.dicId" :label="item.dicLabel" :value="item.dicId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="联系人" prop="contact" clearable>
            <el-input placeholder="请输入内容" v-model.trim="data.contact" clearable maxlength="16"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="手机号码" prop="tontackPhone" clearable>
            <el-input placeholder="请输入内容" v-model.number="data.tontackPhone" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="登陆账号" prop="adminCode" clearable>
            <div>{{ data.adminCode }}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="登陆密码" prop="loginpwd" clearable>
            <el-input placeholder="请输入内容" v-model.trim="data.loginpwd" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { qrySchoolInfo, getDicList, saveSjsSchoolById } from '@/api/base'
import { setDatas } from '@/utils/businessUtil'

export default {
  name: 'BaseInfo',
  data() {
    return {
      arrangeId: sessionStorage.getItem('local_arrangeId'),
      data: {
        schoolId: undefined,
        schoolName: undefined,
        dicId: undefined,
        adminCode: undefined,
        useFlag: undefined,
        contact: undefined,
        tontackPhone: undefined,
        provinceId: undefined,
        cityId: undefined,
        countryId: undefined
      },
      schoolOptions: [], // 办学类型
      // 表单规则
      baseInfoRules: {
        schoolName: [
          { required: true, message: '请输入学校名称', trigger: 'blur' }
        ],
        dicId: [
          { required: true, message: '请选择办学类型', trigger: 'change' }
        ],
        contact: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        tontackPhone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { type: 'number', message: '手机号码必须为数字', trigger: 'blur' }
        ],
        adminCode: [{ required: true, message: '登陆账号', trigger: 'blur' }],
        loginpwd: [
          { required: true, message: '登陆密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  async created() {
    const { local_curYear, local_curTerm } = sessionStorage
    Object.assign(this.data, {
      schoolYear: local_curYear,
      termCode: local_curTerm
    })
    this.getSchoolType()
    this.fetchFormData()
  },
  methods: {
    // 获取办学类型
    async getSchoolType() {
      const res = await getDicList({ dicGroup: 'bxlx' })
      this.schoolOptions = res.DATA
    },
    // 获取表单数据
    async fetchFormData() {
      const res = await qrySchoolInfo()
      setDatas(this.data, res.DATA)
      this.$nextTick(function() {
        this.$refs['baseInfoRef'].clearValidate()
      })
    },
    saveBtn() {
      this.$refs['baseInfoRef'].validate(async valid => {
        if (valid) {
          await saveSjsSchoolById(this.data)
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
