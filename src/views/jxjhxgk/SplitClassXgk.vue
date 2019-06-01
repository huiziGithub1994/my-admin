<template>
  <div>
    <el-tabs tab-position="left" v-model="activeTabName">
      <el-tab-pane label="分班估算" name="1">
        <resource-estimate v-if="activeTabName == '1'" @changeTab="changeTab"/>
      </el-tab-pane>
      <el-tab-pane label="分班确认" name="2">
        <split-class-setting v-if="activeTabName == '2'"/>
      </el-tab-pane>
      <el-tab-pane label="上课教室安排" name="3">
        <split-class-room v-if="activeTabName == '3'"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import SplitClassSetting from './SplitClassSetting'
import ResourceEstimate from './ResourceEstimate'
import SplitClassRoom from './SplitClassRoom'

export default {
  name: 'SplitClassXgk',
  components: {
    SplitClassSetting,
    SplitClassRoom,
    ResourceEstimate
  },
  data() {
    return {
      activeTabName: '1'
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
</style>
