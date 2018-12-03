<template>
  <!-- 选课设置 -》 选课说明-->
  <div>
    <el-form :model="data" ref="baseInfoRef" :rules="baseInfoRules" label-width="120px">
      <el-row :gutter="10">
        <el-col :span="18">
          <el-form-item prop="chooseName" label="选课任务名称">
            <span>{{ data.chooseName }}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'BaseInfo',
  data() {
    return {
      // 表单数据
      data: {},
      // 基础信息表单规则
      baseInfoRules: {
        chooseName: [{ required: true, trigger: 'blur' }]
      }
    }
  },
  created() {},
  methods: {
    // 获取表单数据
    async fetchFormData() {}
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.saveBtn {
  float: right;
}
</style>
