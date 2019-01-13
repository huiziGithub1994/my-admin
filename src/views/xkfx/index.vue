<template>
  <!-- 选课设置-->
  <div class="conent">
    <el-tabs v-model="activeTabName">
      <el-tab-pane label="单科分析" name="one">
        <single-subject v-if="activeTabName === 'one'"></single-subject>
      </el-tab-pane>
      <el-tab-pane label="选组合分析" name="two">
        <assemble-subject v-if="activeTabName === 'two'"></assemble-subject>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import SingleSubject from './SingleSubject' // 单科分析tab页组件
import AssembleSubject from './AssembleSubject' // 选课组合分析tab页组件

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
  components: { SingleSubject, AssembleSubject },
  data() {
    return {
      activeTabName: 'one' // tab页高亮
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>

