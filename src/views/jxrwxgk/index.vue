<template>
  <div>
    <div class="nav-block">
      <el-steps :active="2" finish-status="success" simple>
        <el-step title="教学计划"></el-step>
        <el-step title="教学任务"></el-step>
        <el-step title="排课规则"></el-step>
      </el-steps>
    </div>
    <div class="jxjh-tabs">
      <el-tabs v-model="activeTabName">
        <el-tab-pane label="走班教学任务" name="1">
          <split-class-task v-if="activeTabName == '1'"/>
        </el-tab-pane>
        <el-tab-pane label="行政班教学任务" name="2">
          <class-task v-if="activeTabName == '2'"/>
        </el-tab-pane>
        <el-tab-pane label="教学任务报表" name="3">
          <teach-task-report v-if="activeTabName == '3'"/>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import SplitClassTask from './SplitClassTask' // 走班教学任务
import ClassTask from './ClassTask' // 行政班教学任务
import TeachTaskReport from './TeachTaskReport' // 教学任务报表

export default {
  components: {
    SplitClassTask,
    ClassTask,
    TeachTaskReport
  },
  data() {
    return {
      activeTabName: '1' // tab页高亮
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
</style>

