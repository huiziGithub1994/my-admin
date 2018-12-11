<template>
  <!-- 教学分组 -->
  <div>
    <el-button type="primary">运算教学分组</el-button>
    <div class="wapper">
      <div class="treeLeft" :style="{height:treeHeight+'px'}">tree</div>
      <div class="blockRight" :style="{height:treeHeight+'px'}">ff</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      treeHeight: document.body.clientHeight - 250
    }
  },
  created() {},
  mounted() {}
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.wapper {
  margin-top: 10px;
  > div {
    border: 1px solid #dddddd;
    overflow: auto;
  }
}
.treeLeft {
  width: 250px;
  float: left;
}
.blockRight {
  margin-left: 260px;
}
</style>

