<template>
  <div class="conent">
    <div class="nav-block">
      <el-steps :active="3" finish-status="success" simple>
        <el-step title="授课任务"></el-step>
        <el-step title="排课规则"></el-step>
        <el-step title="排课过程"></el-step>
        <el-step title="课表查询"></el-step>
      </el-steps>
    </div>
    <div class="jxjh-tabs">
      <el-tabs v-model="activeTabName">
        <el-tab-pane label="自动排课" name="one">
          <auto-arrange></auto-arrange>
        </el-tab-pane>
        <el-tab-pane label="规则一览表" name="two"></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import AutoArrange from './AutoArrange' // 自动排课tab页组件

export default {
  components: { AutoArrange },
  data() {
    return {
      activeTabName: 'one' // tab页高亮
    }
  },
  methods: {
    changeTab(val) {
      this.activeTabName = val
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.nav-block {
  > .el-steps--simple {
    padding: 8px 8%;
  }
}
.next-wapper {
  overflow: hidden;
  > div {
    float: right;
    display: inline-block;

    margin-right: 17px;
  }
}
</style>

