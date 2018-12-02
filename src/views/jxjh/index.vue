<template>
  <div class="conent">
    <div class="nav-block">
      <el-steps :active="1" finish-status="success" simple>
        <el-step title="教学计划"></el-step>
        <el-step title="排课规则"></el-step>
        <el-step title="排课过程"></el-step>
        <el-step title="课表查询"></el-step>
      </el-steps>
    </div>
    <div class="jxjh-tabs">
      <el-tabs v-model="activeTabName" :disabled="tabDisabled.one" @tab-click="tabClick">
        <el-tab-pane label="基础信息" name="one">
          <base-info/>
        </el-tab-pane>
        <el-tab-pane label="学科分层及课时" name="two" :disabled="tabDisabled.two">
          <subject-layer v-if="activeTabName === 'two'"/>
        </el-tab-pane>
        <el-tab-pane label="导入学生选课" name="three" :disabled="tabDisabled.three">
          <choose-course ref="chooseCourseRef"/>
        </el-tab-pane>
        <el-tab-pane label="教学分班管理" name="four" :disabled="tabDisabled.four">
          <split-class-manage/>
        </el-tab-pane>
        <el-tab-pane label="走班教室" name="five" :disabled="tabDisabled.five">
          <zb-classroom ref="zbClassroomRef"/>
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
import BaseInfo from './BaseInfo' // 基础信息tab页组件
import SubjectLayer from './SubjectLayer' // 学科分层及学时tab页组件
import ChooseCourse from './ChooseCourse' // 导入学生选课tab页组件
import ClassManage from './ClassManage' // 学生分班管理tab页组件
import SplitClassManage from './SplitClassManage' // 学生分班管理tab页组件
import ZbClassroom from './ZbClassroom' // 走班教室tab页组件

export default {
  components: {
    BaseInfo,
    SubjectLayer,
    ChooseCourse,
    ClassManage,
    SplitClassManage,
    ZbClassroom
  },
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
    },
    // tab页被点击
    tabClick(tab) {
      const { name: tabName } = tab
      if (tabName === 'three') {
        this.$refs.chooseCourseRef.initArea = true
      } else if (tabName === 'five') {
        this.$refs.zbClassroomRef.initArea = true
      }
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
    display: inline-block;
    float: right;
    margin-right: 17px;
  }
}
</style>

