<template>
  <div v-loading="loading">
    <div class="operation">
      <el-button type="primary" class="float-right" @click="saveBtn" plain :loading="saveBtnLoading">保存</el-button>
    </div>
    <div class="area-data" :style="{height:areaHeight+'px'}">
      <el-form :model="data" ref="baseInfoRef" :rules="baseInfoRules" label-width="120px">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="学年" prop="schoolYear">{{ `${data.schoolYear}-${+data.schoolYear+1}学年` }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="学期" prop="termCode">{{ +data.termCode === 1 ? "第一学期" : "第二学期" }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="年级" prop="selectedGrade">
              <el-cascader style="width:100%" expand-trigger="hover" :options="gradeOptions" placeholder="请选择" clearable v-model="data.selectedGrade" :props="selectProps" :disabled="btnDisabled"></el-cascader>
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
        <el-row :gutter="10">
          <el-col :span="18">
            <el-form-item prop="splitLayerType" label="学生分层方式">
              <div v-if="menutype === 'xgk'">新高考排课</div>
              <el-radio-group v-model="data.splitLayerType" :disabled="btnDisabled" v-else>
                <el-radio :label="1">学生自由选择分层</el-radio>
                <el-radio :label="2">按成绩分层</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { qryArrangeDetail, saveArrange } from '@/api/pkcx'
import { getSegGrade } from '@/api/base'
import { setDatas } from '@/utils/businessUtil'
import { mapGetters } from 'vuex'

export default {
  name: 'BaseInfo',
  data() {
    return {
      loading: true,
      saveBtnLoading: false,
      btnDisabled: false, // 保存按钮的禁用
      arrangeId: sessionStorage.getItem('local_arrangeId'),
      areaHeight: document.body.clientHeight - 250,
      data: {
        gradeId: undefined,
        gradeName: undefined,
        arrangeName: undefined,
        schoolYear: undefined,
        termCode: undefined,
        segId: undefined,
        selectedGrade: [],
        splitLayerType: 1,
        arrangeType: '2',
        stepArrangeState: undefined // 步骤
      },
      selectProps: {
        value: 'gradeId',
        label: 'gradeName',
        children: 'gradesList'
      },
      gradeOptions: [], // 学段/专业/年级
      // arrangeId: undefined,
      // 基础信息表单规则
      baseInfoRules: {
        schoolYear: [
          { required: true, message: '请选择学年', trigger: 'change' }
        ],
        termCode: [
          { required: true, message: '请选择学期', trigger: 'change' }
        ],
        selectedGrade: [
          { required: true, message: '请选择年级', trigger: 'change' }
        ],
        arrangeName: [
          { required: true, message: '请输入排课任务名称', trigger: 'blur' }
        ],
        splitLayerType: [
          { required: true, message: '请选择学生分层方式', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['menutype'])
  },
  async created() {
    if (this.menutype === 'xgk') {
      Object.assign(this.data, { arrangeType: '3', splitLayerType: '3' })
    }
    const { local_curYear, local_curTerm } = sessionStorage
    Object.assign(this.data, {
      schoolYear: local_curYear,
      termCode: local_curTerm
    })
    await this.fetchGrade()
    if (this.arrangeId) {
      await this.fetchFormData()
    }
    this.loading = false
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
      const res = await qryArrangeDetail({
        arrangeId: this.arrangeId
      })
      setDatas(this.data, res.DATA)
      const { segId, gradeId, splitLayerType, stepArrangeState } = this.data
      this.btnDisabled = +stepArrangeState > 1
      this.data.selectedGrade = [segId, gradeId]
      this.$nextTick(function() {
        this.$refs['baseInfoRef'].clearValidate()
      })
      this.$emit('changeTab', splitLayerType) // 根据 ‘学生分层方式’展示不同的tab页
    },
    saveBtn() {
      this.$refs['baseInfoRef'].validate(async valid => {
        if (valid) {
          if (this.arrangeId) {
            Object.assign(this.data, { arrangeId: this.arrangeId })
          }
          const [segId, gradeId] = this.data.selectedGrade
          Object.assign(this.data, { segId, gradeId })
          // 获取年级名称
          const seg = this.gradeOptions.filter(
            item => item.segId === this.data.segId
          )[0]
          const grade = seg.gradesList.filter(
            grade => grade.gradeId === this.data.gradeId
          )
          Object.assign(this.data, { gradeName: grade[0].gradeName })
          this.saveBtnLoading = true
          const res = await saveArrange(this.data).finally(() => {
            this.saveBtnLoading = false
          })
          this.$message.success('保存成功')
          Object.assign(this.data, { arrangeId: res.DATA })
          this.$nextTick(function() {
            this.$refs['baseInfoRef'].clearValidate()
          })
          this.$emit('changeTab', this.data.splitLayerType) // 根据 ‘学生分层方式’展示不同的tab页
          // 存储数据
          const { schoolYear, termCode, arrangeName } = this.data
          sessionStorage.setItem('local_curYear', schoolYear)
          sessionStorage.setItem('local_curTerm', termCode)
          const nameStr = `${schoolYear} - ${+schoolYear + 1} 学年,第 ${
            +termCode === 1 ? '一' : '二'
          } 学期 , ${arrangeName}`
          sessionStorage.setItem('arrangeName', nameStr)
          this.$store.commit('SET_ARRANGENAME', nameStr)
          if (!this.arrangeId) {
            sessionStorage.setItem('local_arrangeId', res.DATA)
            this.arrangeId = res.DATA
          }
          this.$emit('update:visible', false) // 保存后，其他tab页可用
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.operation {
  overflow: hidden;
  height: 33px;
  > button {
    float: right;
  }
}
.area-data {
  border: 1px solid #dddddd;
  margin-top: 10px;
  padding: 10px 10px 0 0;
}
</style>
