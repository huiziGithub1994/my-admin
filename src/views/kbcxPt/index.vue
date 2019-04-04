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
        <el-tab-pane label="班级课表" name="1">
          <class-table v-if="activeTabName == 1"/>
        </el-tab-pane>
        <el-tab-pane label="教师课表" name="2">
          <teacher-table v-if="activeTabName == 2"/>
        </el-tab-pane>
        <el-tab-pane label="场地课表" name="3"></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import TeacherTable from './TeacherTable' // 教师课表tab页组件
import ClassTable from './ClassTable' // 班级课表tab页组件

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
            '请先在“排课任务”页面选择排课任务'
          ),
          duration: 8 * 1000
        })
        vm.$router.push({ name: 'PkcxPt' })
      }
    })
  },
  components: {
    TeacherTable,
    ClassTable
  },
  data() {
    return {
      tabsHeight: document.body.clientHeight - 160,
      activeTabName: sessionStorage.getItem('local_arrangeId') ? '1' : '' // tab页高亮
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

