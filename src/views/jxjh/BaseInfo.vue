<template>
  <div>
    <el-form :model="data" ref="baseInfoRef" :rules="baseInfoRules">
      <div class="form-item-wapper">
        <div class="form-label">
          <label class="require">学年/学期/年级</label>
        </div>
        <div class="form-content">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item prop="schoolYear">
                <selectChild v-model="data.schoolYear" clearable tp="yearSelect"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="termCode">
                <selectChild v-model="data.termCode" clearable tp="termSelect"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="gradeCode">
                <selectChild v-model="data.gradeCode" clearable tp="gradeSelect"/>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="form-item-wapper">
        <div class="form-label">
          <label class="require">排课任务名称</label>
        </div>
        <div class="form-content">
          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item prop="arrangeName">
                <el-input placeholder="请输入内容" v-model="data.arrangeName" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="form-item-wapper">
        <div class="form-label">
          <label>教学时间段</label>
        </div>
        <div class="form-content">
          <el-row :gutter="10">
            <el-col :span="11">
              <el-form-item>
                <el-date-picker v-model="data.beginDate" type="date" placeholder="选择开始日期"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <div class="center-text">至</div>
            </el-col>
            <el-col :span="11">
              <el-form-item>
                <el-date-picker v-model="data.endDate" type="date" placeholder="选择结束日期"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="form-item-wapper">
        <div class="form-label">
          <label class="require">作习安排</label>
        </div>
        <div class="form-content">
          <el-form-item class="count-arrange">
            <el-row :gutter="10">
              <el-col :span="24">
                <el-form-item prop="workDays">
                  <el-select v-model="data.workDays" clearable placeholder="">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                  </el-select>天/周，早晨
                </el-form-item>
                <el-form-item prop="countInMorning">
                  <el-select v-model="data.countInMorning" clearable placeholder="">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                  </el-select>节，上午
                </el-form-item>
                <el-form-item prop="countMorning">
                  <el-select v-model="data.countMorning" clearable placeholder="">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                  </el-select>节，下午
                </el-form-item>
                <el-form-item prop="countAfternoon">
                  <el-select v-model="data.countAfternoon" clearable placeholder="">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                  </el-select>节，晚上
                </el-form-item>
                <el-form-item prop="countNight">
                  <el-select v-model="data.countNight" clearable placeholder="">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                  </el-select>节
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </div>
      </div>
      <div class="form-item-wapper">
        <div class="form-label">
          <label>节次时间</label>
        </div>
        <div class="form-content">
          <el-form-item>
            <el-row :gutter="10">
              <el-col :span="24">
                <div v-for="(item,index) in data.timeArrage" :key="index">
                  <span class="time-title " :class="timeClass[item.segId]">{{ item.segId | segIdFilter }}</span>
                  <el-row :gutter="40" class="time-block">
                    <div v-for="(lession,indexNo) in item.lessionsTime" :key="indexNo">
                      <el-col :span="3">第{{ lession.lessionSeq | lessionSeqFilter }}节</el-col>
                      <el-col :span="9"><!-- [lession.beginTime,lession.endTime]-->
                        <el-time-picker is-range v-model="lession.time" range-separator="至" format="HH:mm" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围"></el-time-picker>
                      </el-col>
                    </div>
                  </el-row>
                </div>
              </el-col>
            </el-row>
          </el-form-item>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import { Validators } from '@/utils/businessUtil'
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
        schoolYear: [{ validator: Validators.checkNull, trigger: 'change' }],
        termCode: [{ validator: Validators.checkNull, trigger: 'change' }],
        gradeCode: [{ validator: Validators.checkNull, trigger: 'change' }],
        arrangeName: [{ validator: Validators.checkNull, trigger: 'change' }],
        workDays: [{ validator: Validators.checkNull, trigger: 'change' }],
        countInMorning: [
          { validator: Validators.checkNull, trigger: 'change' }
        ],
        countMorning: [{ validator: Validators.checkNull, trigger: 'change' }],
        countAfternoon: [
          { validator: Validators.checkNull, trigger: 'change' }
        ],
        countNight: [{ validator: Validators.checkNull, trigger: 'change' }]
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
.form-item-wapper {
  overflow: hidden;
}
.form-label {
  float: left;
  width: 120px;
  padding-right: 10px;
  //表单 自定义 必填字段 * 号
  label {
    float: right;
    margin-top: 5px;
  }
  label:not(.require) {
    margin-right: 8px;
  }
  label.require:after {
    content: '*';
    color: #f56c6c;
    margin-left: 3px;
    position: relative;
    top: 2px;
  }
}
.form-content {
  float: left;
  width: calc(100% - 120px);
}

.center-text {
  text-align: center;
  margin-top: 10px;
}
.count-arrange .el-form-item {
  display: inline-block;
  .el-select {
    display: inline-block;
    width: 80px;
    margin-right: 5px;
  }
}
.time-title {
  display: inline-block;
  color: white;
  width: 60px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 5px;
}
.time-title.earlyMorning {
  background: #409eff;
}
.time-title.morning {
  background: #67c23a;
}
.time-title.afternoon {
  background: #e6a23c;
}
.time-title.night {
  background: #f56c6c;
}
.time-block .el-col {
  margin-bottom: 10px;
}
</style>
