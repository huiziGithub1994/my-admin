<template>
  <div class="conent">
    <div class="nav-block">
      <el-steps :active="4" finish-status="success" simple>
        <el-step title="教学计划"></el-step>
        <el-step title="排课规则"></el-step>
        <el-step title="排课过程"></el-step>
        <el-step title="课表查询"></el-step>
      </el-steps>
    </div>
    <div class="jxjh-tabs" :style="{'min-height':tabsHeight+'px'}">
      <el-tabs v-model="activeTabName">
        <el-tab-pane label="教师课表" name="1">
          <teacher-table v-if="activeTabName == 1"/>
        </el-tab-pane>
        <el-tab-pane label="学生课表" name="2"></el-tab-pane>
        <el-tab-pane label="教室课表" name="3"></el-tab-pane>
        <el-tab-pane label="教室任务报表" name="4"></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import TeacherTable from './TeacherTable' // 基础信息tab页组件

export default {
  components: {
    TeacherTable
  },
  data() {
    return {
      tabsHeight: document.body.clientHeight - 160,
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

