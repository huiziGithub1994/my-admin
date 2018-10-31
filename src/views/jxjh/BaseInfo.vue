<template>
  <el-form :model="data" ref="baseInfoRef" :rules="baseInfoRules" label-width="120px">
    <el-form-item label="学年/学期/年级" class="require">
      <el-row :gutter="10">
        <el-col :span="7">
          <selectChild v-model="data.schoolYear" clearable tp="yearSelect"/>
        </el-col>
        <el-col :span="7">
          <selectChild v-model="data.termCode" clearable tp="termSelect"/>
        </el-col>
        <el-col :span="7">
          <selectChild v-model="data.gradeCode" clearable tp="gradeSelect"/>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="排课任务名称" class="require">
      <el-row :gutter="10">
        <el-col :span="21">
          <el-input placeholder="请输入内容" v-model="data.arrangeName" clearable></el-input>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="教学时间段">
      <el-row :gutter="10">
        <el-col :span="10">
          <el-date-picker v-model="data.beginDate" type="date" placeholder="选择开始日期"></el-date-picker>
        </el-col>
        <el-col :span="1">
          <div class="center-text">至</div>
        </el-col>
        <el-col :span="10">
          <el-date-picker v-model="data.endDate" type="date" placeholder="选择结束日期"></el-date-picker>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="作习安排" class="count-arrange require">
      <el-row :gutter="10">
        <el-col :span="21">
          <el-select v-model="data.workDays" clearable placeholder="">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>天/周，早晨
          <el-select v-model="data.countInMorning" clearable placeholder="">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>节，上午
          <el-select v-model="data.countMoring" clearable placeholder="">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>节，下午
          <el-select v-model="data.countAfternoon" clearable placeholder="">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>节，晚上
          <el-select v-model="data.countNight" clearable placeholder="">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>节
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="节次时间">
      <el-row :gutter="10">
        <el-col :span="21">
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
  </el-form>
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
        schoolYear: [{ validator: Validators.checkNull, trigger: 'blur' }]
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
  methods: {}
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .center-text {
  text-align: center;
}
.count-arrange .el-select {
  width: 70px;
  margin-right: 5px;
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
.time-block .el-col{
margin-bottom:10px;
}

</style>
