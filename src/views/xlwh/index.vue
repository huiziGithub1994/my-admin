<template>
  <!-- 校历维护-->
  <div>
    <div class="operation">
      <p class="tip">
        <label>温馨提示：</label>节次时间表格中除“节次/星期”列不可以编辑，双击可进入编辑状态
      </p>
      <el-button type="primary" plain @click="saveBtn">保存</el-button>
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
              <el-select v-model="data.workDays" :clearable="false" placeholder @change="studyArrangeChange">
                <el-option v-for="item in workDaysOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>天/周，早晨
              <el-select v-model="data.countInMorning" :clearable="false" placeholder @change="studyArrangeChange">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>节，上午
              <el-select v-model="data.countMorning" :clearable="false" placeholder @change="studyArrangeChange">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>节，下午
              <el-select v-model="data.countAfternoon" :clearable="false" placeholder @change="studyArrangeChange">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>节，晚上
              <el-select v-model="data.countNight" :clearable="false" placeholder @change="studyArrangeChange">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>节
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-form-item label="节次时间">
            <el-col :span="24">
              <hot-table :settings="settings" ref="hotTableComponent"></hot-table>
            </el-col>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
import { qryCalendar } from '@/api/base'
import { HotTable } from '@handsontable/vue'
import { initTableData } from '@/utils/inlineEditTable'

const weeks = [
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六',
  '星期日'
]
export default {
  name: 'BaseInfo',
  components: {
    HotTable
  },
  data() {
    return {
      // table实例
      hotInstance: null,
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
        { value: '4', label: '4' }
      ],
      // 节次时间表格
      loading: false, // 表格加载
      // 表格数据
      settings: {
        data: null,
        colHeaders: [],
        columns: [],
        height: 330
      },
      // 标记原始数据
      markTableData: {}
    }
  },
  created() {
    this.assembleWorkDaysOptions()
    this.fetchFormData()
  },
  mounted() {
    this.hotInstance = this.$refs.hotTableComponent.hotInstance
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
      this.initEditTableData()
    },
    // 获取表单数据
    async fetchFormData() {
      const res = await qryCalendar({ schoolId: '111' })
      this.data = res.DATA
      // 数据回填时的实现方式:先根据作息安排初始化表格的头部、行列、数据为空。再根据请求返回的数据填充表格
      this.initEditTableData()
      // 数据填充表格
      this.fillTableData()
      this.$nextTick(function() {
        this.$refs['baseInfoRef'].clearValidate()
      })
    },
    // 数据填充表格
    fillTableData() {
      const { timeArrage } = this.data
      timeArrage.forEach(item => {
        const [row, col] = item.cellKey.split(',').map(x => Number(x))
        this.hotInstance.setDataAtRowProp(row, col, item.cellValue)
        this.hotInstance.setDataAtRowProp(row, 'beginTime', item.beginTime)
        this.hotInstance.setDataAtRowProp(row, 'endTime', item.endTime)
      })
    },
    // 作息安排初始化表格的头部、行列、数据为空
    initEditTableData() {
      const baseHeader = ['上课开始时间', '上课结束时间', '节次/星期']
      const { colHeaders, columns, defaultData } = initTableData(
        this.data,
        baseHeader
      )
      this.settings.colHeaders = colHeaders
      this.settings.columns = columns
      this.settings.data = defaultData
      this.hotInstance.loadData(defaultData)
    },
    // 保存按钮
    async saveBtn() {
      let isContinue = true
      this.hotInstance.validateColumns([0, 1], valid => {
        if (!valid) {
          isContinue = false
          this.$message({
            type: 'warning',
            message: '请输入正确的时间，例如(16:20)。'
          })
        }
      })
      if (!isContinue) return
      const data = this.hotInstance.getSourceData()
      const newData = []
      const flag = ['beginTime', 'endTime', 'lessionSeq']
      data.forEach((item, index) => {
        if (!isContinue) return
        for (const [key, val] of Object.entries(item)) {
          if (val !== '' && !flag.includes(key)) {
            if (item.beginTime === '' || item.endTime === '') {
              this.$message.error(
                `${weeks[key]}第${index + 1}节开始时间或结束时间不能为空`
              )
              isContinue = false
              return
            }
            newData.push({
              beginTime: item.beginTime,
              endTime: item.endTime,
              lessionSeq: index + 1,
              cellKey: `${index},${key}`,
              cellValue: val,
              segId: this.getSegId(index + 1) // 通过节次获取 segId
            })
          }
        }
      })
      if (!isContinue) return
      console.log(newData)
      const res = await qryCalendar({ data: newData, a: '1' })
      if (res.SUCCESS) {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
      }
    },
    getSegId(lessionSeq) {
      const {
        countInMorning,
        countMorning,
        countAfternoon,
        countNight
      } = this.data
      if (lessionSeq <= +countInMorning) {
        return '01' // 早晨
      }
      if (lessionSeq <= +countMorning + +countInMorning) {
        return '02' // 上午
      }
      if (lessionSeq <= +countMorning + +countInMorning + +countAfternoon) {
        return '03' // 下午
      }
      if (
        lessionSeq <=
        +countMorning + +countInMorning + +countAfternoon + +countNight
      ) {
        return '04' // 晚上
      }
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
  > p {
    position: relative;
    top: 17px;
    display: inline-block;
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

