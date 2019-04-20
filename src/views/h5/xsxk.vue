<template>
  <div class="wrapper">
    <el-collapse v-model="activeNames">
      <el-collapse-item v-for="(item,index) in tableData" :name="index" :key="index">
        <template slot="title">
          <div class="title">{{ item.choseTaskName }}</div>
        </template>
        <div class="content">
          <div class="tips">
            <span class="choseTypeName">{{ item.choseTypeName }}</span>
            <span :class="{'finishFlagName':true,'choosed':item.finishFlag == '1'}">{{ item.finishFlagName }}</span>
            <div @click="toDetail(item.choseRsId)" v-if="item.finishFlag == '0'">
              <el-tag>去选课</el-tag>
            </div>
          </div>
          <div v-if="item.finishFlag == '1'">选课结果：{{ item.allName }}</div>
          <div>选课时间：{{ `${item.beginTime} - ${item.endTime}` }}</div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import { qryStuChooseCourseList } from '@/api/xsxk'

export default {
  data() {
    return {
      activeNames: [],
      tableData: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取表格数据
    async fetchData() {
      this.listLoading = true
      const res = await qryStuChooseCourseList().finally(
        () => (this.listLoading = false)
      )
      const len = 3
      const arrIndex = []
      for (let i = 0; i < len; i++) {
        arrIndex.push(i)
      }
      this.activeNames = arrIndex
      this.tableData = [...res.DATA, ...res.DATA, ...res.DATA]
    },
    toDetail(choseRsId) {
      const params = { choseRsId }
      this.$router.push({ name: 'Detailh5', query: params })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.title {
  padding-left: 10px;
}
.content {
  padding-left: 10px;
}
.choseTypeName {
  display: inline-block;
  width: 100px;
}
.finishFlagName {
  color: #f56c6c;
  &.choosed {
    color: #67c23a;
  }
}
.tips {
  height: 30px;
  line-height: 30px;
  > div {
    float: right;
    margin-right: 10px;
  }
}
</style>

