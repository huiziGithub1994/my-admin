<template>
  <!-- 普通排课： 排课规则 -->
  <div class="conent">
    <div class="nav-block">
      <el-steps :active="2" finish-status="success" simple>
        <el-step title="授课任务"></el-step>
        <el-step title="排课规则"></el-step>
        <el-step title="排课过程"></el-step>
        <el-step title="课表查询"></el-step>
      </el-steps>
    </div>
    <div>
      <el-tabs v-model="activeTabName">
        <!-- 固排禁排 -->
        <el-tab-pane label="固排禁排" name="one" :disabled="tabDisabled.one">
          <el-tabs type="card" class="pkgzPt" v-model="gpjpTabActive">
            <el-tab-pane label="年级/班级禁排固排" name="1"></el-tab-pane>
            <el-tab-pane label="教师禁排固排" name="2"></el-tab-pane>
            <el-tab-pane label="教研组禁排" name="3"></el-tab-pane>
            <el-tab-pane label="课程禁排固排" name="4"></el-tab-pane>
          </el-tabs>
        </el-tab-pane>
        <div class="my-tabs" v-show="activeTabName==='one'">
          <!-- 年级/班级禁排固排 -->
          <grade-class v-if="gpjpTabActive === '1'"></grade-class>
          <!-- 教师禁排固排 -->
          <teacher v-else-if="gpjpTabActive === '2'"></teacher>
          <!-- 教研组禁排 -->
          <teach-group v-else-if="gpjpTabActive === '3'"></teach-group>
          <!-- 教研组禁排 -->
          <course v-else-if="gpjpTabActive === '4'"></course>
        </div>
        <!-- end  固排禁排 -->
        <el-tab-pane label="合班设置" name="two" :disabled="tabDisabled.two">
          <merge-class v-if="activeTabName === 'two'"></merge-class>
        </el-tab-pane>
        <el-tab-pane label="其他规则" name="three" :disabled="tabDisabled.three"></el-tab-pane>
      </el-tabs>
      <!-- <div class="next-wapper">
        <div>
          <el-button type="success" plain @click="baseInfoPre" v-show="activeTabName !== 'one'">上一步</el-button>
          <el-button type="success" plain @click="baseInfoNext" v-show="activeTabName !== 'three'">下一步</el-button>
        </div>
      </div>-->
    </div>
  </div>
</template>
<script>
import GradeClass from './GradeClass' // 固排禁排tab页：年级/班级禁排固排tab页组件
import Teacher from './Teacher' // 固排禁排tab页：教师禁排固排tab页组件
import TeachGroup from './TeachGroup' // 固排禁排tab页：教研组禁排tab页组件
import Course from './Course' // 固排禁排tab页：课程禁排固排tab页组件
import MergeClass from './MergeClass' // 合班设置

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
  components: { GradeClass, Teacher, TeachGroup, MergeClass, Course },
  data() {
    return {
      activeTabName: 'one', // tab页高亮
      gpjpTabActive: '1' // 固排禁排
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
.my-tabs {
  border-top: none;
  border-left: 1px solid #dddddd;
  border-right: 1px solid #dddddd;
  border-bottom: 1px solid #dddddd;
  padding: 10px;
}
</style>

