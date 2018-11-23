<template><!--教学任务 tab页-->
  <div>
    <div class="operation">
      <div>
        <el-button type="primary" plain>下载模板</el-button>
        <el-button type="primary" plain>上传任务</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      initArea: false
    }
  },
  created() {},
  methods: {}
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.operation {
  overflow: hidden;
  > div {
    float: right;
  }
}
</style>

