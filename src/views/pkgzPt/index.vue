<template>
  <!-- 普通排课： 排课规则 -->
  <div class="conent">
    <div class="nav-block">
      <el-steps :active="2" finish-status="success" simple>
        <el-step title="教学计划"></el-step>
        <el-step title="排课规则"></el-step>
        <el-step title="排课过程"></el-step>
        <el-step title="课表查询"></el-step>
      </el-steps>
    </div>
    <div class="jxjh-tabs">
      <el-tabs v-model="activeTabName">
        <el-tab-pane label="固排禁排" name="one" :disabled="tabDisabled.one"></el-tab-pane>
        <el-tab-pane label="合班设置" name="two" :disabled="tabDisabled.two"></el-tab-pane>
        <el-tab-pane label="其他规则" name="three" :disabled="tabDisabled.three"></el-tab-pane>
      </el-tabs>
      <div class="next-wapper">
        <div>
          <el-button type="success" plain @click="baseInfoPre" v-show="activeTabName !== 'one'">上一步</el-button>
          <el-button type="success" plain @click="baseInfoNext" v-show="activeTabName !== 'three'">下一步</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
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

