<template>
  <!-- 学生选课 列表-->
  <div>
    <el-table ref="singleTable" :data="tableData" :height="tableH" highlight-current-row style="width: 100%" v-loading="listLoading">
      <el-table-column type="index" width="50"/>
      <el-table-column property="choseTaskName" show-overflow-tooltip min-width="160px" label="选课任务名称"/>
      <el-table-column property="choseTypeName" label="任务类型" width="110px"></el-table-column>
      <el-table-column property="beginTime" label="开始时间" width="140px"></el-table-column>
      <el-table-column property="endTime" label="结束时间" width="140px"></el-table-column>
      <el-table-column property="finishFlagName" label="执行状态" width="80px">
        <template slot-scope="scope">
          <span :class="scope.row.finishFlagName === '已选择' ? 'success' : 'danger'">{{ scope.row.finishFlagName }}</span>
        </template>
      </el-table-column>
      <el-table-column property="selectTime" label="选择时间" width="140px">
        <template slot-scope="scope">
          <span v-if="scope.row.selectTime">{{ scope.row.selectTime | filterTime }}</span>
        </template>
      </el-table-column>
      <el-table-column property="allName" label="已选课程" show-overflow-tooltip></el-table-column>
      <el-table-column fixed="right" width="80px" label="操作">
        <template slot-scope="scope">
          <div class="table-btns">
            <el-button
              :type="scope.row.finishFlagName === '已选择' ? 'default':'primary'"
              :disabled="scope.row.finishFlagName === '已选择'"
              size="mini"
              plain
              @click="stuSelectCourse(scope.row.choseRsId)"
            >去选课</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { qryStuChooseCourseList } from '@/api/xsxk'
import moment from 'moment'

export default {
  filters: {
    filterTime(val) {
      return moment(val).format('YYYY-MM-DD  hh:mm')
    }
  },
  data() {
    const h = 175
    const tableH = document.body.clientHeight - h
    return {
      listLoading: false,
      tableH: tableH,
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
      const res = await qryStuChooseCourseList()
      this.tableData = res.DATA
      this.listLoading = false
    },
    // 去选课按钮
    stuSelectCourse(choseRsId) {
      const params = { choseRsId }
      this.$router.push({ name: 'Qxk', query: params })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
