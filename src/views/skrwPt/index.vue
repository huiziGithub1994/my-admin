<template>
  <div class="conent">
    <div class="nav-block">
      <el-steps :active="1" finish-status="success" simple>
        <el-step title="授课任务"></el-step>
        <el-step title="排课规则"></el-step>
        <el-step title="排课过程"></el-step>
        <el-step title="课表查询"></el-step>
      </el-steps>
    </div>
    <div class="jxjh-tabs">
      <el-tabs v-model="activeTabName">
        <el-tab-pane label="授课录入" name="one">
          <teach-input v-if="activeTabName == 'one'" @updateTab="changeTab"></teach-input>
        </el-tab-pane>
        <el-tab-pane label="课程计划汇总表" name="two">
          <course-plain-table v-if="activeTabName == 'two'"></course-plain-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
// import TeachTask from './TeachTask' // 教学任务tab页组件
import TeachInput from './TeachInput' // 授课录入tab页组件
import CoursePlainTable from './CoursePlainTable' // 课程计划汇总表组件

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
            '请在“排课任务”页面，点击排课进入“授课任务”页面'
          ),
          duration: 8 * 1000
        })
        vm.$router.push({ name: 'PkcxPt' })
      }
    })
  },
  components: {
    TeachInput,
    CoursePlainTable
  },
  data() {
    return {
      activeTabName: sessionStorage.getItem('local_arrangeId') ? 'one' : '' // tab页高亮
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
.nav-block {
  > .el-steps--simple {
    padding: 8px 8%;
  }
}
.next-wapper {
  overflow: hidden;
  > div {
    float: right;
    display: inline-block;

    margin-right: 17px;
  }
}
</style>

