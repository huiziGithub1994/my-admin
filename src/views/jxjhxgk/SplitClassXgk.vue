<template>
  <div>
    <el-tabs tab-position="left" v-model="activeTabName">
      <el-tab-pane label="分班设置" name="1">
        <split-class-setting v-if="activeTabName == '1'"/>
      </el-tab-pane>
      <el-tab-pane label="教学班设置" name="2">
        <split-class-room v-if="activeTabName == '2'"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import SplitClassSetting from './SplitClassSetting'
import SplitClassRoom from './SplitClassRoom'

export default {
  name: 'SplitClassXgk',
  components: {
    SplitClassSetting,
    SplitClassRoom
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
