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
    <div class="jxjh-tabs" :style="{'min-height':tabsHeight+'px'}">
      <el-tabs v-model="activeTabName">
        <el-tab-pane label="基础信息" name="1">
          <base-info v-if="activeTabName == 1"/>
        </el-tab-pane>
        <el-tab-pane label="学科分层及课时" name="2" :disabled="tabDisabled">
          <subject-layer v-if="activeTabName == 2"/>
        </el-tab-pane>
        <el-tab-pane label="导入学生选课" name="3" :disabled="tabDisabled">
          <choose-course v-if="activeTabName == 3"/>
        </el-tab-pane>
        <el-tab-pane label="教学分班管理" name="4" :disabled="tabDisabled">
          <split-class-manage v-if="activeTabName == 4"/>
        </el-tab-pane>
        <el-tab-pane label="走班教室" name="5" :disabled="tabDisabled">
          <zb-classroom v-if="activeTabName == 5"/>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="next-wapper">
      <div>
        <el-button type="success" @click="baseInfoPre" v-show="activeTabName != 1">上一步</el-button>
        <el-button type="success" @click="baseInfoNext">下一步</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import BaseInfo from './BaseInfo' // 基础信息tab页组件
import SubjectLayer from './SubjectLayer' // 学科分层及学时tab页组件
import ChooseCourse from './ChooseCourse' // 导入学生选课tab页组件
import SplitClassManage from './SplitClassManage' // 学生分班管理tab页组件
import ZbClassroom from './ZbClassroom' // 走班教室tab页组件

export default {
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$notify.close()
      if (
        !sessionStorage.getItem('local_curTerm') ||
        !sessionStorage.getItem('local_curYear')
      ) {
        const h = vm.$createElement
        vm.$notify({
          title: '提示',
          message: h(
            'i',
            { style: 'color: teal' },
            '请在“排课任务”页面，点击新增或者排课进入“教学计划”页面'
          ),
          duration: 8 * 1000
        })
        vm.$router.push({ name: 'Pkcx' })
      }
    })
  },
  components: {
    BaseInfo,
    SubjectLayer,
    ChooseCourse,
    SplitClassManage,
    ZbClassroom
  },
  data() {
    return {
      tabsHeight: document.body.clientHeight - 190,
      activeTabName: '1' // tab页高亮
    }
  },
  computed: {
    tabDisabled() {
      return sessionStorage.getItem('local_arrangeId') === undefined
    }
  },
  methods: {
    // 基础信息 上一步 按钮
    baseInfoPre() {
      const temp = parseInt(this.activeTabName) - 1
      this.activeTabName = temp + ''
    },
    // 基础信息 下一步 按钮
    baseInfoNext() {
      if (this.tabDisabled) {
        this.$message.warning('请先保存基础信息，再进行下一步操作')
        return
      }
      const temp = parseInt(this.activeTabName) + 1
      if (temp <= 5) {
        this.activeTabName = temp + ''
      } else {
        this.$router.push({ name: 'Pkgz' })
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
    margin-left: 17px;
  }
}
</style>

