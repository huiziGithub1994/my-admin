<template>
  <div class="conent">
    <div class="nav-block">
      <el-steps :active="2" finish-status="success" simple>
        <el-step title="教学计划"></el-step>
        <el-step title="排课规则"></el-step>
        <el-step title="排课过程"></el-step>
        <el-step title="课表查询"></el-step>
      </el-steps>
    </div>
    <div class="jxjh-tabs" :style="{'min-height':tabsHeight+'px'}">
      <el-tabs v-model="activeTabName">
        <el-tab-pane label="资源评估" name="one">
          <resource-assessment v-if="activeTabName === 'one'"/>
        </el-tab-pane>
        <el-tab-pane label="教学分组" name="two">
          <teach-group v-if="activeTabName === 'two'"/>
        </el-tab-pane>
        <el-tab-pane label="学生分班" name="three">
          <split-student v-if="activeTabName === 'three'"/>
        </el-tab-pane>
        <el-tab-pane label="课时预排" name="four">
          <advance-arrange v-if="activeTabName === 'four'"/>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import ResourceAssessment from './ResourceAssessment' // 资源评估tab页组件
import TeachGroup from './TeachGroup' // 教学分组tab页组件
import SplitStudent from './SplitStudent' // 教学分组tab页组件
import AdvanceArrange from './AdvanceArrange' // 课时预排tab页组件

export default {
  components: {
    ResourceAssessment,
    TeachGroup,
    SplitStudent,
    AdvanceArrange
  },
  data() {
    return {
      tabsHeight: document.body.clientHeight - 180,
      activeTabName: 'four' // tab页高亮
    }
  },
  created() {},
  methods: {}
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
    display: inline-block;
    float: right;
    margin-right: 17px;
  }
}
</style>

