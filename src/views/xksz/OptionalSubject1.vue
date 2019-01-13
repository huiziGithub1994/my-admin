<template>
  <!-- 选课设置 -》 可选学科  :新高考选考、校本课-->
  <div>
    <el-form :model="fromData" ref="baseInfoRef" label-width="90px" v-loading="loading">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="选课模式">
            <el-radio-group v-model="fromData.choseCourseType" @change="radioChange">
              <el-radio label="1">按单科选择</el-radio>
              <el-radio label="2">指定选科组合</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <div class="btns-right">
            <el-button type="primary" @click="saveBtn">保 存</el-button>
            <el-button type="success" @click="nextStep">下一步</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="必选类型">
            <el-radio-group v-model="fromData.mustChoseType" @change="mustChoseTypeChange">
              <el-radio label="0">无</el-radio>
              <el-radio label="1" :disabled="fromData.choseCourseType === '2'">必选一科</el-radio>
              <el-radio label="2" :disabled="fromData.choseCourseType === '2'">必选两科</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="选择课程">
            <transfer :datas="course" :height="blockHeight" :ismust="fromData.mustChoseType" :choose-data="chooseData" :key="transferKey" ref="transfer" :search="fromData.choseCourseType==2"></transfer>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { qrySGKCourseList, saveSGKCourseList } from '@/api/xkrw'
import Transfer from '@/components/Transfer'
export default {
  name: 'OptionalSubject',
  components: { Transfer },
  props: {
    baseData: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      loading: false,
      transferKey: 1,
      blockHeight: document.body.clientHeight - 330,
      choseRsId: sessionStorage.getItem('local_arrangeId'),
      filterCourse: '', // 包含学科的过滤
      fromData: {
        choseRsId: sessionStorage.getItem('local_arrangeId'),
        choseCourseType: '1', // 选课模式
        mustChoseType: '0',
        choseValue: [], // 已选列表
        choseType: undefined // 为选课任务中的“新高考选考
      },
      course: [], // 可选课程
      chooseData: {},
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
    fetchBaseData() {
      const { choseCourseType, choseType } = this.baseData
      Object.assign(this.fromData, {
        choseCourseType,
        choseType
      })
      this.fetchData(choseCourseType)
    },
    // 获取可选数据
    async fetchData(val) {
      this.loading = true
      const res = await qrySGKCourseList({
        choseRsId: this.choseRsId,
        choseCourseType: val
      })

      const { DATA, choseValue, mustChoseType, mustChoseStr } = res
      Object.assign(this.chooseData, {
        choseValue,
        mustChoseStr
      })
      Object.assign(this.fromData, {
        choseValue,
        mustChoseType: val === '2' ? '0' : mustChoseType,
        mustChoseStr
      })
      this.course = [...DATA]
      this.allOriginData = res
      this.loading = false
    },
    // 选课模式 切换时
    radioChange(val) {
      this.transferKey = this.transferKey * 2
      this.fetchData(val)
    },
    mustChoseTypeChange() {
      this.transferKey = this.transferKey * 2
      this.$nextTick(() => {
        const { DATA } = this.allOriginData
        const noData = {
          choseValue: [],
          mustChoseStr: ''
        }
        Object.assign(this.fromData, noData)
        Object.assign(this.chooseData, noData)
        this.course = [...DATA]
      })
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
      // const choseNames = this.getChoseNames(this.fromData.choseValue)
      const datas = this.$refs.transfer.getData()
      if (datas === false) return
      await saveSGKCourseList({
        choseRsId: this.choseRsId,
        mustChoseType: this.fromData.mustChoseType,
        choseCourseType: this.fromData.choseCourseType,
        choseType: this.fromData.choseType, // 为选课任务中的“新高考选考
        ...datas
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
    },
    nextStep() {
      this.$emit('tonext', 'three')
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.btns-right {
  float: right;
  button.el-button {
    width: 70px !important;
  }
}
</style>
