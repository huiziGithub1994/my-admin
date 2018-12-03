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
          <div v-else>dd</div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { getOptionalSubject } from '@/api/xkdy'
export default {
  name: 'OptionalSubject',
  data() {
    return {
      data: {
        chooseModel: undefined,
        course: [], // 可选课程
        choosedIds: [] // 已选列表
      }
    }
  },
  created() {
    this.fetchInfo()
  },
  methods: {
    async fetchInfo() {
      const res = await getOptionalSubject()
      this.data = res.DATA
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
}
</style>
