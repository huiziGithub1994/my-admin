<template>
  <!-- 校历维护-->
  <div>
    <div v-area>
      <condition>
        <div class="condition">
          <label>学年</label>
          <selectChild v-model="listQuery['xn']" :clearable="false" tp="yearSelect"/>
        </div>
        <div class="condition">
          <label>学期</label>
          <selectChild v-model="listQuery['xq']" :clearable="false" tp="termSelect"/>
        </div>
      </condition>
      <operation class="btns">
        <el-button type="primary" @click="queryBtn" plain>查询</el-button>
        <el-button type="primary" @click="saveBtn" plain>保存</el-button>
      </operation>
    </div>
    <p class="tip">
      <label>温馨提示：</label>表格中灰色为不可以编辑，全校固定非课程编排请表格中设置，如每周五下午第7节为“班会”，时间格式如 08:30。
    </p>
    <div class="area-data" :style="{height:pageHeight+'px'}">
      <el-form :model="data" ref="baseInfoRef" :rules="baseInfoRules" label-width="100px">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="当前学年" prop="schoolYear">{{ `${data.schoolYear}-${+data.schoolYear+1}学年` }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="当前学期" prop="termCode">{{ +data.termCode === 1 ? "第一学期" : "第二学期" }}</el-form-item>
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
            <el-form-item label="上课节次" prop="workDays">
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
import { qryCalendar, saveCalendar } from '@/api/base'
import { HotTable } from '@handsontable/vue'
import { initTableData } from '@/utils/inlineEditTable'
import { setDatas } from '@/utils/businessUtil'
import { setCookie } from '@/utils/auth'
import moment from 'moment'
import { mapGetters } from 'vuex'

const initFormData = () => ({
  data: {
    calenderId: undefined,
    schoolId: undefined,
    arrangeName: undefined,
    schoolYear: undefined,
    termCode: undefined,
    gradeCode: undefined, // 0302
    beginDate: undefined,
    endDate: undefined,
    workDays: 5,
    countInMorning: 0,
    countMorning: 4,
    countAfternoon: 4,
    countNight: 0,
    curStatus: undefined,
    calFixList: [],
    rows: 0,
    cols: 0
  }
})
export default {
  name: 'BaseInfo',
  components: {
    HotTable
  },
  data() {
    return {
      listQuery: {
        xn: '',
        xq: ''
      },
      disabledItem: true,
      pageHeight: document.body.clientHeight - 190,
      // table实例
      hotInstance: null,
      // 表单数据
      ...initFormData(),
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
        height: 300
      },
      // 标记原始数据
      markTableData: {}
    }
  },
  computed: {
    ...mapGetters(['curYear', 'curTerm', 'schoolId'])
  },
  mounted() {
    Object.assign(this.listQuery, {
      xn: this.curYear,
      xq: this.curTerm
    })
    Object.assign(this.data, {
      schoolYear: this.curYear,
      termCode: this.curTerm
    })
    this.hotInstance = this.$refs.hotTableComponent.hotInstance
    this.assembleWorkDaysOptions() // 作习安排 天/周 下拉选项数据 的初始化
    this.initEditTableData() // 作息安排初始化表格的头部、行列、数据为空
    if (this.curYear && this.curTerm) {
      this.fetchFormData({ xn: this.curYear, xq: this.curTerm })
    }
  },
  methods: {
    // 查询按钮
    queryBtn() {
      this.fetchFormData(this.listQuery)
    },
    // 新增 按钮
    addBtn() {
      Object.assign(this.$data, initFormData())
      this.disabledItem = false
      this.initEditTableData() // 作息安排初始化表格的头部、行列、数据为空
    },
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
    async fetchFormData(params) {
      await qryCalendar(params).then(
        res => {
          setDatas(this.data, res.DATA)
          // 数据回填时的实现方式:先根据作息安排初始化表格的头部、行列、数据为空。再根据请求返回的数据填充表格
          this.initEditTableData()
          // 数据填充表格
          this.fillTableData()
          this.$nextTick(function() {
            this.$refs['baseInfoRef'].clearValidate()
          })
          // 修改本地缓存
          this.updateStore()
        },
        errorRes => {
          Object.assign(this.$data, initFormData())
          Object.assign(this.data, {
            schoolYear: this.listQuery['xn'],
            termCode: this.listQuery['xq']
          })
          // 数据回填时的实现方式:先根据作息安排初始化表格的头部、行列、数据为空。再根据请求返回的数据填充表格
          this.initEditTableData()
        }
      )
    },
    // 修改本地缓存
    updateStore() {
      const { schoolYear, termCode } = this.data
      this.$store.commit('SET_CURYEAR', schoolYear)
      this.$store.commit('SET_CURTERM', termCode)
      setCookie('curYear', schoolYear)
      setCookie('curTerm', termCode)
    },
    // 数据填充表格
    fillTableData() {
      const { calFixList } = this.data
      calFixList.forEach(item => {
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
      this.$refs['baseInfoRef'].validate(valid => {
        if (valid) {
          // 教学时间的校验
          const { beginDate, endDate } = this.data
          if ((beginDate || endDate) && !moment(beginDate).isBefore(endDate)) {
            this.$message.error('教学开始时间必须<教学结束时间')
            return
          }
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
              if (flag.includes(key)) {
                continue
              }
              newData.push({
                arrangeId: this.data.arrangeId,
                beginTime: item.beginTime,
                endTime: item.endTime,
                lessionSeq: index + 1,
                cellKey: `${index},${key}`,
                cellValue: val,
                segId: this.getSegId(index + 1) // 通过节次获取 segId
              })
            }
          })
          if (!isContinue) return
          Object.assign(this.data, { calFixList: newData })
          saveCalendar({
            modelString: JSON.stringify(this.data)
          }).then(res => {
            if (res.SUCCESS) {
              this.$message({ type: 'success', message: '保存成功' })
              if (!this.calenderId) {
                this.$store.commit('SET_CALENDERID', res.DATA)
                setCookie('calenderId', res.DATA)
              }
              this.$nextTick(function() {
                this.$refs['baseInfoRef'].clearValidate()
              })
            }
          })
        } else {
          return false
        }
      })
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
p.tip {
  margin-top: 10px;
}
</style>
<style>
.studyArrange .el-select.el-select--small > .el-input.el-input--small {
  display: inline-block !important;
  width: 80px;
}
</style>

