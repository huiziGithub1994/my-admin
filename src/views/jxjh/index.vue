<template>
  <div class="conent">
    <div class="nav-block active">
      <span>1</span>教学计划
    </div>
    <div class="jxjh-tabs">
      <el-tabs v-model="activeTabName" :disabled="tabDisabled.one" @tab-click="tabClick">
        <el-tab-pane label="基础信息" name="one" >
          <base-info />
        </el-tab-pane>
        <el-tab-pane label="学科分层及课时" name="two" :disabled="tabDisabled.two">
          <subject-layer v-if="activeTabName === 'two'" />
        </el-tab-pane>
        <el-tab-pane label="导入学生选课" name="three" :disabled="tabDisabled.three">
          <choose-course ref="chooseClassRef"/>
        </el-tab-pane>
        <el-tab-pane label="教学分班管理" name="four" :disabled="tabDisabled.four">
          <split-class-manage/>
        </el-tab-pane>
        <el-tab-pane label="走班教室" name="five" :disabled="tabDisabled.five">定时任务补偿</el-tab-pane>
        <el-tab-pane label="评估资源" name="six" :disabled="tabDisabled.six">定时任务补偿</el-tab-pane>
      </el-tabs>
    </div>
    <div class="nav-block next">
      <span>2</span>排课规则
    </div>
    <div class="next-wapper">
      <el-button type="success" plain @click="baseInfoPre" v-show="activeTabName !== 'one'">上一步</el-button>
      <el-button type="success" plain @click="baseInfoNext" v-show="activeTabName !== 'six'">下一步</el-button>
    </div>
    <div class="nav-block">
      <span>3</span>排课过程
    </div>
    <div class="nav-block">
      <span>4</span>课表查询
    </div>
  </div>
</template>
<script>
import BaseInfo from './BaseInfo' // 基础信息tab页组件
import SubjectLayer from './SubjectLayer' // 学科分层及学时tab页组件
import ChooseCourse from './ChooseCourse' // 导入学生选课tab页组件
import SplitClassManage from './SplitClassManage' // 教学分班管理tab页组件
export default {
  components: { BaseInfo, SubjectLayer, ChooseCourse, SplitClassManage },
  data() {
    return {
      activeTabName: 'one' // tab页高亮
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
        this.$refs.chooseClassRef.initArea = true
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.conent {
}
.nav-block {
  height: 35px;
  line-height: 35px;
  color: RGB(173, 173, 173);
  > span {
    border: 1px solid RGB(173, 173, 173);
    display: inline-block;
    width: 35px;
    height: 100%;
    border-radius: 50%;
    text-align: center;
    margin-right: 10px;
  }
}
.nav-block:not(:first-child) {
  margin-bottom: 5px;
}
.nav-block.active {
  color: RGB(51, 153, 255);
  > span {
    border: 1px solid RGB(51, 153, 255);
  }
}
.nav-block.next {
  display: inline-block;
  color: black;
  > span {
    color: white;
    background: RGB(51, 153, 255);
    border: 1px solid RGB(51, 153, 255);
  }
}
.jxjh-tabs {
  border-left: 1px solid RGB(51, 153, 255);
  margin-left: 17px;
  padding: 0 17px;
}
.next-wapper {
  display: inline-block;
  float: right;
  margin-right: 17px;
}
</style>

