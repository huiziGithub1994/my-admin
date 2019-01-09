<template>
  <!-- 选课设置 -》 基础信息-->
  <div>
    <el-form :model="data" ref="baseInfoRef" label-width="120px">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="选课模式">
            <el-radio-group v-model="data.chooseModel">
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
          <!-- 按单科自由选择 -->
          <div class="transfer-wapper" v-if="data.chooseModel=='1'">
            <el-transfer v-model="data.choosedIds" :data="data.course" :titles="['可选课程','已选列表']" :button-texts="['取消', '选择']"></el-transfer>
          </div>
          <!-- 指定选科组合 -->
          <div v-else class="transfer-wapper">
            <div class="transfer-select">
              <span>包含学科</span>
              <el-select v-model="value4" clearable placeholder="请选择">
                <el-option v-for="item in courseOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </div>
            <div>
              <el-transfer v-model="data.choosedIds" :data="data.course" :titles="['可选组合','已选组合']" :button-texts="['取消', '选择']"></el-transfer>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { getOptionalSubject, getAllCourse } from '@/api/xkrw'
export default {
  name: 'OptionalSubject',
  data() {
    return {
      data: {
        chooseModel: undefined, // 选课模式
        course: [], // 可选课程
        choosedIds: [], // 已选列表
        courseOptions: [] // 包含学科
      }
    }
  },
  created() {
    this.fetchInfo()
    // 包含学科下拉列表数据
    this.fetchAllCourse()
  },
  methods: {
    async fetchInfo() {
      const res = await getOptionalSubject()
      this.data = res.DATA
    },
    async fetchAllCourse() {
      await getAllCourse()
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
