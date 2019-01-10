<template>
  <!-- 选课设置 -》 可选学科-->
  <div>
    <el-form :model="fromData" ref="baseInfoRef" label-width="120px">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="选课模式">
            <el-radio-group v-model="fromData.choseCourseType">
              <el-radio label="1">按单科自由选择</el-radio>
              <el-radio label="2">指定选科组合</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" class="saveBtn">保存</el-button>
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
              <el-select v-model="fromData.value4" clearable placeholder="请选择">
                <el-option v-for="item in courseOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
import { qrySGKCourseList } from '@/api/xkrw'
import { setDatas } from '@/utils/businessUtil'
export default {
  name: 'OptionalSubject',
  data() {
    return {
      choseRsId: sessionStorage.getItem('local_arrangeId'),
      fromData: {
        choseRsId: '',
        choseCourseType: '1', // 选课模式
        choseValue: [], // 已选列表
        choseType: undefined // 为选课任务中的“新高考选考
      },
      course: [], // 可选课程
      courseOptions: [], // 包含学科
      propsParam: {
        key: 'key1',
        label: 'label'
      }
    }
  },
  async created() {
    // await this.fetchBaseData()
    await this.fetchData()
  },
  methods: {
    // // 获取基础信息
    // async fetchBaseData() {
    //   await qrySjsChoseTaskByChoseId({ choseRsId: this.choseRsId })
    // },
    async fetchData() {
      const res = await qrySGKCourseList({
        choseRsId: this.choseRsId,
        choseCourseType: '2'
      })
      setDatas(this.fromData, res)
      const { choseCourseType } = this.fromData
      // 按单科自由选择
      this.course = [...res.DATA]
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
