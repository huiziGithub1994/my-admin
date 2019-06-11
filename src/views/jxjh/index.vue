<template>
  <div class="conent">
    <div class="nav-block">
      <el-steps :active="1" finish-status="success" simple>
        <el-step title="教学计划"></el-step>
        <el-step title="教学任务" v-if="menutype == 'xgk'"></el-step>
        <el-step title="排课规则"></el-step>
        <el-step title="排课过程"></el-step>
        <el-step title="课表查询"></el-step>
      </el-steps>
    </div>
    <div class="jxjh-tabs" :style="{'min-height':tabsHeight+'px'}">
      <el-tabs v-model="activeTabName">
        <el-tab-pane label="基础信息" name="1">
          <base-info :visible.sync="tabDisabled" v-if="activeTabName == 1" @changeTab="changeTab" @changeMoveMode="changeMoveMode"/>
        </el-tab-pane>
        <el-tab-pane label="学科分层及课时" name="2" :disabled="tabDisabled">
          <template v-if="activeTabName == 2">
            <subject-layer-xgk v-if="menutype == 'xgk'"></subject-layer-xgk>
            <subject-layer v-else/>
          </template>
        </el-tab-pane>
        <el-tab-pane :label="splitLayerType === 2 ? '学生成绩' : '导入学生选课'" name="3" :disabled="tabDisabled">
          <template v-if="activeTabName == 3">
            <stu-grade v-if="splitLayerType == 2"/>
            <choose-course v-else/>
          </template>
        </el-tab-pane>
        <el-tab-pane :label="labelNameByMoveMode" name="4" :disabled="tabDisabled">
          <template v-if="activeTabName == 4">
            <template v-if="menutype=='xgk'">
              <!--  全走班 教学开班方案-->
              <teach-class-plain v-if="moveMode==1"/>
              <split-class-xgk v-if="moveMode==2"/>
            </template>
            <split-class-manage v-else/>
          </template>
        </el-tab-pane>
        <el-tab-pane label="走班教室" name="5" :disabled="tabDisabled">
          <zb-classroom v-if="activeTabName == 5"/>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import BaseInfo from './BaseInfo' // 基础信息tab页组件
import SubjectLayer from './SubjectLayer' // 学科分层及学时tab页组件
import StuGrade from './StuGrade' // 学科分层及学时tab页组件（按成绩分层时）
import ChooseCourse from './ChooseCourse' // 导入学生选课tab页组件
import SplitClassXgk from '../jxjhxgk/SplitClassXgk' // 新高考-选课分班
import SubjectLayerXgk from '../jxjhxgk/SubjectLayerXgk' // 新高考-学科分层及课时
import TeachClassPlain from '../jxjhxgk/TeachClassPlain' // 新高考-教学开班方案

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
    StuGrade,
    ChooseCourse,
    SplitClassManage,
    ZbClassroom,
    SplitClassXgk,
    SubjectLayerXgk,
    TeachClassPlain
  },
  data() {
    return {
      tabsHeight: document.body.clientHeight - 190,
      activeTabName: '1', // tab页高亮
      tabDisabled: true,
      splitLayerType: undefined,
      moveMode: undefined // 新高考排课-走班模式
    }
  },
  computed: {
    ...mapGetters(['menutype']),
    labelNameByMoveMode() {
      const moveMode = this.moveMode
      if (+moveMode === 0 || +moveMode === 2) {
        return '教学分班管理'
      } else if (+moveMode === 1) {
        return '教学开班方案'
      }
      return ''
    }
  },
  created() {
    if (
      sessionStorage.getItem('local_arrangeId') === null ||
      sessionStorage.getItem('local_arrangeId') === undefined
    ) {
      this.tabDisabled = true
    } else {
      this.tabDisabled = false
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
        this.$router.push({
          name: this.menutype === 'xgk' ? 'Xgkjxrw' : 'Pkgz'
        })
      }
    },
    // 根据 ‘学生分层方式’展示不同的tab页 1:学生自由选择分层  2:按成绩分层
    changeTab(val) {
      this.splitLayerType = val
    },
    changeMoveMode(val) {
      this.moveMode = val
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

