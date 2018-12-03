<template>
  <!-- 选课设置-->
  <div class="conent">
    <el-tabs v-model="activeTabName">
      <el-tab-pane label="基础信息" name="one">
        <base-info></base-info>
      </el-tab-pane>
      <el-tab-pane label="可选学科" name="two">
        <optional-subject></optional-subject>
      </el-tab-pane>
      <el-tab-pane label="参选学生" name="three">
        <joined-student></joined-student>
      </el-tab-pane>
      <el-tab-pane label="选课说明" name="four"></el-tab-pane>
    </el-tabs>
    <div class="next-wapper">
      <div>
        <el-button type="success" @click="baseInfoPre" v-show="activeTabName !== 'one'">上一步</el-button>
        <el-button type="success" @click="baseInfoNext" v-show="activeTabName !== 'six'">下一步</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import BaseInfo from './BaseInfo' // 基础信息tab页组件
import OptionalSubject from './OptionalSubject' // 可选学科tab页组件
import JoinedStudent from './JoinedStudent' // 本次参选学生tab页组件
export default {
  components: { BaseInfo, OptionalSubject, JoinedStudent },
  data() {
    return {
      activeTabName: 'three' // tab页高亮
    }
  },
  computed: {},
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
    display: inline-block;
    float: right;
    margin-right: 17px;
  }
}
</style>

