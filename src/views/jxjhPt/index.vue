<template>
  <div class="conent">
    <div class="nav-block">
      <el-steps :active="1" finish-status="success" simple>
        <el-step title="教学计划" ></el-step>
        <el-step title="排课规则" ></el-step>
        <el-step title="排课过程" ></el-step>
        <el-step title="课表查询" ></el-step>
      </el-steps>
    </div>
    <div class="jxjh-tabs">
      <el-tabs v-model="activeTabName" >
        <el-tab-pane label="教学任务" name="one" :disabled="tabDisabled.one">
          <teach-task></teach-task>
        </el-tab-pane>
        <el-tab-pane label="班级列表" name="two" :disabled="tabDisabled.two">
          <class-list></class-list>
        </el-tab-pane>
        <el-tab-pane label="教师列表" name="three" :disabled="tabDisabled.three">
        </el-tab-pane>
        <el-tab-pane label="课程列表" name="four" :disabled="tabDisabled.four">
        </el-tab-pane>
        <el-tab-pane label="场地信息" name="five" :disabled="tabDisabled.five">
        </el-tab-pane>
        <el-tab-pane label="课程计划汇总表" name="fix" :disabled="tabDisabled.fix">
        </el-tab-pane>
      </el-tabs>
      <div class="next-wapper">
        <div>
          <el-button type="success" plain @click="baseInfoPre" v-show="activeTabName !== 'one'">上一步</el-button>
          <el-button type="success" plain @click="baseInfoNext" v-show="activeTabName !== 'six'">下一步</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import TeachTask from './TeachTask' // 教学任务tab页组件
import ClassList from './ClassList' // 班级列表tab页组件

export default {
  components: { TeachTask, ClassList },
  data() {
    return {
      activeTabName: 'one', // tab页高亮
      // 基础信息表单model
      baseInfo: {
        schoolYear: ''
      }
    }
  },
  computed: {
    tabDisabled() {
      const tabDisabled = {}
      const arr = ['one', 'two', 'three', 'four', 'five', 'six']
      arr.forEach(item => {
        // if (item === this.activeTabName) {
        //   Reflect.set(tabDisabled, item, false)
        // } else {
        Reflect.set(tabDisabled, item, false)
        // }
      })
      return tabDisabled
    }
  },
  created() {},
  methods: {
    // 基础信息 上一步 按钮
    baseInfoPre() {
      this.activeTabName = 'two'
    },
    // 基础信息 下一步 按钮
    baseInfoNext() {
      this.activeTabName = 'two'
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.nav-block {
  margin-bottom: 10px;
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

