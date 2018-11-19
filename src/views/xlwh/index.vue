<template><!-- 校历维护-->
  <div>
    <div class="operation">
      <span><label>温馨提示：</label>时间中除灰色的可编辑，双击可进入编辑状态</span>
      <el-button type="primary" plain>保存</el-button>
    </div>
    <div class="area-data">
      <el-form :model="data" ref="baseInfoRef" :rules="baseInfoRules" label-width="100px">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="当前学年" prop="schoolYear">
              <selectChild v-model="data.schoolYear" :clearable="false" tp="yearSelect"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="当前学期" prop="termCode">
              <selectChild v-model="data.termCode" :clearable="false" tp="termSelect"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-form-item label="教学时间">
            <el-col :span="8">
              <el-date-picker v-model="data.beginDate" type="date" placeholder="选择开始日期"></el-date-picker>
            </el-col>
            <el-col :span="1">
              <div class="center-text">至</div>
            </el-col>
            <el-col :span="8">
              <el-date-picker v-model="data.endDate" type="date" placeholder="选择结束日期"></el-date-picker>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row :gutter="10" class="studyArrange">
          <el-col :span="24">
            <el-form-item label="作习安排" prop="workDays">
              <el-select v-model="data.workDays" :clearable="false" placeholder="" @change="studyArrangeChange">
                <el-option v-for="item in workDaysOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>天/周，早晨
              <el-select v-model="data.countInMorning" :clearable="false" placeholder="" @change="studyArrangeChange">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>节，上午
              <el-select v-model="data.countMorning" :clearable="false" placeholder="" @change="studyArrangeChange">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>节，下午
              <el-select v-model="data.countAfternoon" :clearable="false" placeholder="" @change="studyArrangeChange">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>节，晚上
              <el-select v-model="data.countNight" :clearable="false" placeholder="" @change="studyArrangeChange">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>节
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-form-item label="节次时间">
            <el-col :span="24">
              <el-table ref="singleTable" border stripe highlight-current-row :data="tabData" v-loading="loading" element-loading-text="拼命加载中" style="width: 100%" :height="300">
                <el-table-column prop="time" label="上课时间" width="150"></el-table-column>
                <el-table-column prop="lessionSeq" label="节次/星期" width="90"></el-table-column>
                <el-table-column v-for="(item,index) in tabHeader" :key="index" :label="item" :prop="`contnet${index}`"></el-table-column>
              </el-table>
            </el-col>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { qryArrangeDetail } from '@/api/pkcx'
import moment from 'moment'
export default {
  name: 'BaseInfo',
  data() {
    return {
      // 表单数据
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
        countInMorning: 0,
        countMorning: 0,
        countAfternoon: 0,
        countNight: 0,
        curStatus: undefined,
        timeArrage: []
      },
      // 基础信息表单规则
      baseInfoRules: {
        schoolYear: [
          { required: true, message: '请选择当前学年', trigger: 'change' }
        ],
        termCode: [
          { required: true, message: '请选择当前学期', trigger: 'change' }
        ],
        workDays: [
          { required: true, message: '请选择作息安排', trigger: 'change' }
        ]
      },
      workDaysOptions: [], // 天/周
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
      ],
      // 节次时间表格
      tabData: [],
      loading: false, // 表格加载
      tabHeader: []
    }
  },
  created() {
    this.assembleWorkDaysOptions()
    this.fetchFormData()
  },
  methods: {
    // 作习安排 天/周 下拉选项数据
    assembleWorkDaysOptions() {
      const arr = []
      for (let i = 5; i <= 30; i++) {
        arr.push({ value: i, label: i })
      }
      this.workDaysOptions = arr
    },
    // 作习安排改变时
    studyArrangeChange() {
      const {
        workDays,
        countInMorning,
        countMorning,
        countAfternoon,
        countNight
      } = this.data
      const weeks = [
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六',
        '星期日'
      ]
      if (workDays <= 7) {
        this.tabHeader = weeks.slice(0, workDays)
        const count =
          countInMorning + countMorning + countAfternoon + countNight
        const tempTabData = []
        for (let i = 1; i <= count; i++) {
          tempTabData.push({ time: '09:20-10:00' })
        }
      }
    },
    // 获取表单数据
    async fetchFormData() {
      const res = await qryArrangeDetail({
        arrangeId: this.$route.query.arrangeId
      })
      this.assembleLession(res.DATA.timeArrage)
      this.data = res.DATA
      this.studyArrangeChange()
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
.area-data {
  border: 1px solid #dddddd;
  margin-top: 10px;
  padding: 10px 10px 0 0;
}
.center-text {
  text-align: center;
}
.operation {
  overflow: hidden;
  height: 33px;
  > span {
    position: relative;
    top: 17px;
    color: #909399;
    > label {
      color: #67c23a;
    }
  }
  > button {
    float: right;
  }
}
</style>
<style>
.studyArrange .el-select.el-select--small > .el-input.el-input--small {
  display: inline-block !important;
  width: 80px;
}
</style>

