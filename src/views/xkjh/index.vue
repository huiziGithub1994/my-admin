<template>
  <!-- 选课计划-->
  <div class="conent">
    <el-tabs v-model="activeTabName">
      <el-tab-pane label="学期课程计划" name="one">
        <course-plain></course-plain>
      </el-tab-pane>
      <el-tab-pane label="班级列表" name="two"></el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import CoursePlain from './CoursePlain' // 学期课程计划tab页组件

export default {
  components: { CoursePlain },
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

