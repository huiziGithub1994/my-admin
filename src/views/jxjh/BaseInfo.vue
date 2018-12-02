<template>
  <div>
    <el-form :model="data" ref="baseInfoRef" :rules="baseInfoRules" label-width="120px">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="学年" prop="schoolYear">
            <selectChild v-model="data.schoolYear" clearable tp="yearSelect"/>
          </el-form-item>
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
          <el-form-item label="年级" prop="gradeCode">
            <selectChild v-model="data.gradeCode" clearable tp="gradeSelect"/>
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
import { qryArrangeDetail } from '@/api/pkcx'
import moment from 'moment'
export default {
  name: 'BaseInfo',
  filters: {
    segIdFilter(segId) {
      let val = ''
      switch (segId) {
        case '01':
          val = '早上'
          break
        case '02':
          val = '上午'
          break
        case '03':
          val = '下午'
          break
        default:
          val = '晚上'
      }
      return val
    },
    lessionSeqFilter(lessionSeq) {
      let val = ''
      switch (lessionSeq) {
        case 1:
          val = '一'
          break
        case 2:
          val = '二'
          break
        case 3:
          val = '三'
          break
        default:
          val = '四'
      }
      return val
    },
    lessionTimeFilter() {
      return 9
    }
  },
  data() {
    return {
      time: ['09:23', '13:08'],
      timeClass: {
        '01': 'earlyMorning',
        '02': 'morning',
        '03': 'afternoon',
        '04': 'night'
      },
      data: {
        arrangeId: undefined,
        schoolId: undefined,
        arrangeName: undefined,
        schoolYear: undefined,
        termCode: undefined,
        gradeCode: undefined, // 0302
        beginDate: undefined,
        endDate: undefined,
        workDays: undefined,
        countInMorning: undefined,
        countMorning: undefined,
        countAfternoon: undefined,
        countNight: undefined,
        curStatus: undefined,
        timeArrage: []
      },
      // 基础信息表单规则
      baseInfoRules: {
        schoolYear: [
          { required: true, message: '请选择学年', trigger: 'change' }
        ],
        termCode: [
          { required: true, message: '请选择学期', trigger: 'change' }
        ],
        gradeCode: [
          { required: true, message: '请选择年级', trigger: 'change' }
        ],
        arrangeName: [
          { required: true, message: '请输入排课任务名称', trigger: 'blur' }
        ]
      },
      options: [
        { value: '0', label: '0' },
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
        { value: '5', label: '5' },
        { value: '6', label: '6' },
        { value: '7', label: '7' },
        { value: '8', label: '8' }
      ]
    }
  },
  created() {
    this.fetchFormData()
  },
  methods: {
    // 获取表单数据
    async fetchFormData() {
      const res = await qryArrangeDetail({
        arrangeId: this.$route.query.arrangeId
      })
      this.assembleLession(res.DATA.timeArrage)
      this.data = res.DATA
      this.$nextTick(function() {
        this.$refs['baseInfoRef'].clearValidate()
      })
    },
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
</style>
