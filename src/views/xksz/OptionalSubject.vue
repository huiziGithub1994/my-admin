<template>
  <!-- 选课设置 -》 可选学科-->
  <div>
    <el-form :model="fromData" ref="baseInfoRef" label-width="120px">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="选课模式">
            <el-radio-group v-model="fromData.choseCourseType" @change="radioChange">
              <el-radio label="1">按单科自由选择</el-radio>
              <el-radio label="2">指定选科组合</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" class="saveBtn" @click="saveBtn">保存</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <!-- 按单科自由选择时展示 -->
          <div class="transfer-wapper" v-if="fromData.choseCourseType === '1'">
            <el-transfer v-model="fromData.choseValue" :data="course" :titles="['可选课程','已选列表']" :button-texts="['取消', '选择']" :props="propsParam"></el-transfer>
          </div>
          <!-- 指定选科组合 -->
          <div v-else class="transfer-wapper">
            <div class="transfer-select">
              <span>包含学科</span>
              <el-select v-model="filterCourse" clearable placeholder="请选择" @change="courseChange">
                <el-option v-for="item in courseOptions" :key="item.key1" :label="item.label" :value="item.label"></el-option>
              </el-select>
            </div>
            <div>
              <el-transfer v-model="fromData.choseValue" :data="course" :titles="['可选组合','已选组合']" :button-texts="['取消', '选择']" :props="propsParam"></el-transfer>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import {
  qrySjsChoseTaskByChoseId,
  qrySGKCourseList,
  saveSGKCourseList
} from '@/api/xkrw'
// import { setDatas } from '@/utils/businessUtil'
export default {
  name: 'OptionalSubject',
  data() {
    return {
      choseRsId: sessionStorage.getItem('local_arrangeId'),
      filterCourse: '', // 包含学科的过滤
      fromData: {
        choseRsId: sessionStorage.getItem('local_arrangeId'),
        choseCourseType: '1', // 选课模式
        choseValue: [], // 已选列表
        choseType: undefined // 为选课任务中的“新高考选考
      },
      course: [], // 可选课程
      originCourse: [], // 可选课程
      courseOptions: [], // 包含学科
      propsParam: {
        key: 'key1',
        label: 'label'
      }
    }
  },
  created() {
    this.fetchBaseData() // 获取基础信息
    this.getCourseOptions() // 包含学科下拉列表数据
  },
  methods: {
    // 获取基础信息
    async fetchBaseData() {
      const res = await qrySjsChoseTaskByChoseId({ choseRsId: this.choseRsId })
      const { choseCourseType, choseType } = res.DATA
      Object.assign(this.fromData, {
        choseCourseType,
        choseType
      })
      this.fetchData(choseCourseType)
    },
    // 获取可选数据
    async fetchData(val) {
      const res = await qrySGKCourseList({
        choseRsId: this.choseRsId,
        choseCourseType: val
      })
      const { DATA, choseValue } = res
      Object.assign(this.fromData, {
        choseValue
      })
      this.course = [...DATA]
      this.originCourse = [...DATA]
    },
    // 选课模式 切换时
    radioChange(val) {
      this.fetchData(val)
    },
    // 包含学科下拉列表数据
    async getCourseOptions() {
      const res = await qrySGKCourseList({
        choseRsId: this.choseRsId,
        choseCourseType: '1'
      })
      this.courseOptions = [...res.DATA]
    },
    // 包含学科下拉列表改变时
    courseChange(val) {
      if (val) {
        const { choseValue } = this.fromData
        const newArr = this.originCourse.filter(item => {
          if (item.label.indexOf(val) > -1 || choseValue.includes(item.key1)) {
            return item
          }
        })
        this.course = newArr
      } else {
        this.course = [...this.originCourse]
      }
    },
    // 保存
    async saveBtn() {
      const choseNames = this.getChoseNames(this.fromData.choseValue)
      await saveSGKCourseList({
        choseRsId: this.choseRsId,
        choseCourseType: this.fromData.choseCourseType,
        choseValue: this.fromData.choseValue.join(','), // 已选列表
        choseType: this.fromData.choseType, // 为选课任务中的“新高考选考
        choseNames: choseNames.join(',')
      })
      this.$message.success('保存成功')
    },
    getChoseNames(choseValue) {
      const names = []
      this.course.forEach(item => {
        if (choseValue.includes(item.key1)) {
          names.push(item.label)
        }
      })
      return names
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.saveBtn {
  float: right;
}
.transfer-wapper {
  padding-left: 45px;
  .transfer-select {
    margin-bottom: 10px;
  }
}
</style>
