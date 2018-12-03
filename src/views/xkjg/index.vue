<template>
  <!-- 选课设置-->
  <div class="conent">
    <el-tabs v-model="activeTabName">
      <el-tab-pane label="单科分析" name="one"></el-tab-pane>
      <el-tab-pane label="选组合分析" name="two">
        <optional-subject></optional-subject>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      activeTabName: 'one' // tab页高亮
    }
  },
  computed: {},
  created() {},
  methods: {}
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>

