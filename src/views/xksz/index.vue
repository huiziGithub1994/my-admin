<template>
  <!-- 选课设置-->
  <div class="conent">
    <el-tabs v-model="activeTabName">
      <el-tab-pane label="基础信息" name="one">
        <base-info v-if="activeTabName == 'one'" @tonext="nextStep" :visible.sync="tabDisabled"></base-info>
      </el-tab-pane>
      <el-tab-pane label="可选学科" name="two" :disabled="tabDisabled">
        <optional-subject v-if="activeTabName == 'two'" @tonext="nextStep"></optional-subject>
      </el-tab-pane>
      <el-tab-pane label="参选学生" name="three" :disabled="tabDisabled">
        <joined-student v-if="activeTabName == 'three'"></joined-student>
      </el-tab-pane>
    </el-tabs>
    <!-- <div class="next-wapper">
      <div>
        <el-button type="success" @click="baseInfoPre" v-show="activeTabName !== 'one'">上一步</el-button>
        <el-button type="success" @click="baseInfoNext" v-show="activeTabName !== 'six'">下一步</el-button>
      </div>
    </div>-->
  </div>
</template>
<script>
import BaseInfo from './BaseInfo' // 基础信息tab页组件
import OptionalSubject from './OptionalSubject' // 可选学科tab页组件
import JoinedStudent from './JoinedStudent' // 本次参选学生tab页组件
import ChooseExplain from './ChooseExplain' // 选课说明tab页组件
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
            '请在“选课任务”页面，点击新增或者修改进入“选课设置”页面'
          ),
          duration: 8 * 1000
        })
        vm.$router.push({ name: 'Xkrw' })
      }
    })
  },
  components: { BaseInfo, OptionalSubject, JoinedStudent, ChooseExplain },
  data() {
    return {
      activeTabName: 'one', // tab页高亮
      tabDisabled: false
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
    nextStep(name) {
      if (this.tabDisabled) {
        this.$message.info('请先保存基本信息，再点击下一步')
        return
      }
      this.activeTabName = name
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
  }
}
</style>

