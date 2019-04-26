<template>
  <!-- 选课设置-->
  <div class="conent">
    <el-tabs v-model="activeTabName">
      <el-tab-pane label="单科分析" name="1"></el-tab-pane>
      <el-tab-pane label="选组合分析" name="2"></el-tab-pane>
      <el-tab-pane label="选课查询" name="3"></el-tab-pane>
    </el-tabs>
    <single-subject v-if="activeTabName==1"></single-subject>
    <group-subject v-if="activeTabName==2"></group-subject>
    <course-query v-if="activeTabName==3"></course-query>
  </div>
</template>
<script>
import SingleSubject from './SingleSubject' // 单科、组合分析tab页组件
import GroupSubject from './GroupSubject' // 单科、组合分析tab页组件
import CourseQuery from './CourseQuery' // 选课查询

export default {
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$notify.close()
      if (!sessionStorage.getItem('local_arrangeId')) {
        const h = vm.$createElement
        vm.$notify({
          title: '提示',
          message: h(
            'i',
            { style: 'color: teal' },
            '请在“选课任务”页面，点击分析进入“选课分析”页面'
          ),
          duration: 8 * 1000
        })
        vm.$router.push({ name: 'Xkrw' })
      }
    })
  },
  components: { SingleSubject, GroupSubject, CourseQuery },
  data() {
    return {
      activeTabName: '1' // tab页高亮
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>

