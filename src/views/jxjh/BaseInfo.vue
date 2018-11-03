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
                <span class="time-title morning">上午</span>
                <el-row :gutter="40" class="time-block">
                  <el-col :span="3">第1节</el-col>
                  <el-col :span="9">
                    <el-time-picker is-range v-model="data.time" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围"></el-time-picker>
                  </el-col>
                  <el-col :span="3">第2节</el-col>
                  <el-col :span="9">
                    <el-time-picker is-range v-model="data.time" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围"></el-time-picker>
                  </el-col>
                  <el-col :span="3">第3节</el-col>
                  <el-col :span="9">
                    <el-time-picker is-range v-model="data.time" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围"></el-time-picker>
                  </el-col>
                  <el-col :span="3">第4节</el-col>
                  <el-col :span="9">
                    <el-time-picker is-range v-model="data.time" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围"></el-time-picker>
                  </el-col>
                </el-row>
                <span class="time-title afternoon">下午</span>
                <el-row :gutter="40" class="time-block">
                  <el-col :span="3">第1节</el-col>
                  <el-col :span="9">
                    <el-time-picker is-range v-model="data.time" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围"></el-time-picker>
                  </el-col>
                  <el-col :span="3">第2节</el-col>
                  <el-col :span="9">
                    <el-time-picker is-range v-model="data.time" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围"></el-time-picker>
                  </el-col>
                  <el-col :span="3">第3节</el-col>
                  <el-col :span="9">
                    <el-time-picker is-range v-model="data.time" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围"></el-time-picker>
                  </el-col>
                  <el-col :span="3">第4节</el-col>
                  <el-col :span="9">
                    <el-time-picker is-range v-model="data.time" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围"></el-time-picker>
                  </el-col>
                </el-row>
                <span class="time-title night">晚上</span>
                <el-row :gutter="40" class="time-block">
                  <el-col :span="3">第1节</el-col>
                  <el-col :span="9">
                    <el-time-picker is-range v-model="data.time" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围"></el-time-picker>
                  </el-col>
                  <el-col :span="3">第2节</el-col>
                  <el-col :span="9">
                    <el-time-picker is-range v-model="data.time" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围"></el-time-picker>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div class="next-wapper">
      <el-button type="success" plain @click="baseInfoNext">下一步</el-button>
    </div>
  </div>
</template>

<script>
import { Validators } from '@/utils/businessUtil'
export default {
  name: 'BaseInfo',
  props: {
    data: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
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
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' }
      ]
    }
  },
  created() {},
  methods: {
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
.time-title.morning {
  background: RGB(103, 194, 58);
}
.time-title.afternoon {
  background: RGB(70, 168, 224);
}
.time-title.night {
  background: RGB(254, 172, 50);
}
.time-block .el-col {
  margin-bottom: 10px;
}
.next-wapper {
  overflow: auto;
  > .el-button {
    float: right;
  }
}
</style>
