<template>
  <div>
    <div class="nav-block active">
      <span>1</span>教学计划
    </div>
    <div class="jxjh-tabs">
      <el-tabs v-model="activeTabName">
        <el-tab-pane label="基础信息" name="1">
          <el-form :model="baseInfo" ref="baseInfoRef" :rules="baseInfoRules" label-width="120px">
            <el-form-item label="学年/学期/年级">
              <el-row :gutter="10">
                <el-col :span="7">
                  <selectChild v-model="baseInfo.schoolYear" clearable tp="yearSelect"/>
                </el-col>
                <el-col :span="7">
                  <selectChild v-model="baseInfo.termCode" clearable tp="termSelect"/>
                </el-col>
                <el-col :span="7">
                  <selectChild v-model="baseInfo.gradeCode" clearable tp="gradeSelect"/>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="排课任务名称">
              <el-row :gutter="10">
                <el-col :span="21">
                  <el-input placeholder="请输入内容" v-model="baseInfo.arrangeName" clearable></el-input>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="教学时间段">
              <el-row :gutter="10">
                <el-col :span="10">
                  <el-date-picker v-model="baseInfo.beginDate" type="date" placeholder="选择开始日期"></el-date-picker>
                </el-col>
                <el-col :span="1">
                  <div class="center-text">至</div>
                </el-col>
                <el-col :span="10">
                  <el-date-picker v-model="baseInfo.endDate" type="date" placeholder="选择结束日期"></el-date-picker>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="作习安排" class="count-arrange">
              <el-row :gutter="10">
                <el-col :span="21">
                  <el-select v-model="baseInfo.workDays" clearable placeholder="">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                  </el-select>天/周，早晨
                  <el-select v-model="baseInfo.countInMorning" clearable placeholder="">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                  </el-select>节，上午
                  <el-select v-model="baseInfo.countMoring" clearable placeholder="">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                  </el-select>节，下午
                  <el-select v-model="baseInfo.countAfternoon" clearable placeholder="">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                  </el-select>节，晚上
                  <el-select v-model="baseInfo.countNight" clearable placeholder="">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                  </el-select>节
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="节次时间">
              <el-row :gutter="10">
                <el-col :span="21">
                  <span class="time-block morning">上午</span>
                  <el-row :gutter="40">
                    <el-col :span="3">第1节</el-col>
                    <el-col :span="9">
                      <el-time-picker is-range v-model="baseInfo.time" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围"></el-time-picker>
                    </el-col>
                    <el-col :span="3">第2节</el-col>
                    <el-col :span="9">
                      <el-time-picker is-range v-model="baseInfo.time" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围"></el-time-picker>
                    </el-col>
                  </el-row>
                  <span class="time-block afternoon">下午</span>
                  <div>r</div>
                  <span class="time-block night">晚午</span>
                  <div>r</div>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="学科分层及课时" name="2">配置管理</el-tab-pane>
        <el-tab-pane label="导入学生选课" name="3">角色管理</el-tab-pane>
        <el-tab-pane label="教学分班管理" name="4">定时任务补偿</el-tab-pane>
        <el-tab-pane label="走班教室" name="5">定时任务补偿</el-tab-pane>
        <el-tab-pane label="评估资源" name="6">定时任务补偿</el-tab-pane>
      </el-tabs>
    </div>
    <div class="nav-block next">
      <span>2</span>排课规则
    </div>
    <div class="nav-block">
      <span>3</span>排课过程
    </div>
    <div class="nav-block">
      <span>4</span>课表查询
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTabName: '1', // tab页高亮
      // 基础信息表单model
      baseInfo: {},
      // 基础信息表单规则
      baseInfoRules: {},
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
.nav-block {
  height: 35px;
  line-height: 35px;
  color: RGB(173, 173, 173);
  > span {
    border: 1px solid RGB(173, 173, 173);
    display: inline-block;
    width: 35px;
    height: 100%;
    border-radius: 50%;
    text-align: center;
    margin-right: 10px;
  }
}
.nav-block:not(:first-child) {
  margin-bottom: 5px;
}
.nav-block.active {
  color: RGB(51, 153, 255);
  > span {
    border: 1px solid RGB(51, 153, 255);
  }
}
.nav-block.next {
  color: black;
  > span {
    color: white;
    background: RGB(51, 153, 255);
  }
}
.jxjh-tabs {
  border-left: 1px solid RGB(51, 153, 255);
  margin-left: 17px;
  padding: 0 17px;
}
.center-text {
  text-align: center;
}
.count-arrange .el-select {
  width: 70px;
  margin-right: 5px;
}
.time-block {
  display: inline-block;
  color: white;
  width: 60px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 5px;
}
.time-block.morning {
  background: RGB(103, 194, 58);
}
.time-block.afternoon {
  background: RGB(70, 168, 224);
}
.time-block.night {
  background: RGB(254, 172, 50);
}
</style>
