<template>
  <div>
    <el-tabs tab-position="left" v-model="activeTabName">
      <el-tab-pane label="分班估算" name="1">
        <resource-estimate v-if="activeTabName == '1'"/>
      </el-tab-pane>
      <el-tab-pane label="分班结果" name="2">
        <split-class-result v-if="activeTabName == '2'"/>
      </el-tab-pane>
      <el-tab-pane label="上课教室安排" name="3">
        <split-class-room v-if="activeTabName == '3'"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import ResourceEstimate from './ResourceEstimate'
import SplitClassRoom from './SplitClassRoom'
import SplitClassResult from './SplitClassResult'

export default {
  name: 'SplitClassXgk',
  components: {
    SplitClassRoom,
    ResourceEstimate,
    SplitClassResult
  },
  data() {
    return {
      activeTabName: '1'
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
