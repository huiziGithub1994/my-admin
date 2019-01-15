<template>
  <!-- 选课调研 列表-->
  <div>
    <el-table ref="singleTable" :data="tableData" :height="tableH" highlight-current-row style="width: 100%" v-loading="listLoading">
      <el-table-column type="index" width="50"/>
      <el-table-column property="choseTaskName" show-overflow-tooltip min-width="160px" label="选课任务名称"/>
      <el-table-column property="choseTypeName" label="任务类型"></el-table-column>
      <el-table-column property="beginTime" label="开始时间" width="170px"></el-table-column>
      <el-table-column property="endTime" label="结束时间" width="170px"></el-table-column>
      <el-table-column property="finishFlagName" label="执行状态" width="80px">
        <template slot-scope="scope">
          <span :class="scope.row.finishFlagName === '已选择' ? 'success' : 'danger'">{{ scope.row.finishFlagName }}</span>
        </template>
      </el-table-column>
      <el-table-column property="selectTime" label="选择时间" width="170px"></el-table-column>
      <el-table-column property="allName" label="已选课程"></el-table-column>
      <el-table-column fixed="right" width="155px" label="操作">
        <template slot-scope="scope">
          <div class="table-btns">
            <el-button type="primary" size="mini" plain @click="stuSelectCourse(scope.row)">去选课</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { qryStuChooseCourseList } from '@/api/xsxk'

export default {
  data() {
    const h = 175
    const tableH = document.body.clientHeight - h
    return {
      listLoading: false,
      tableH: tableH,
      tableData: [
        {
          choseRsId: '2cf5e917b6834d23b50776e8f9da4e9d', // 任务编号
          allName: null, // 已选课程
          finishFlag: '0', // 完成标识
          choseTypeName: '新高考选考', // 任务类型
          selectTime: null, // 选择时间
          choseCourseType: '2', // 选课模式
          finishFlagName: '未选择', // 执行状态
          beginTime: '2019-01-08 22:06', // 开始时间
          endTime: '2019-01-08 22:06', // 结束时间
          choseTaskName: '2018高一走班选课111', // 选课任务名称
          choseType: '1' // 任务类型标识
        },
        {
          choseRsId: 'ldoewr99214-1sk',
          allName: null,
          finishFlag: '0',
          choseTypeName: '新高考选考',
          selectTime: null,
          choseCourseType: '1', // 选课模式
          finishFlagName: '未选择',
          beginTime: '2019-01-08 00:00',
          endTime: '2019-01-18 00:00',
          choseTaskName: '2019高二3+3选课',
          choseType: '1'
        }
      ]
    }
  },
  created() {
    // this.fetchData()
  },
  methods: {
    // 获取表格数据
    fetchData() {
      this.listLoading = true
      qryStuChooseCourseList().then(res => {
        this.tableData = res.DATA
        this.listLoading = false
      })
    },
    // 去选课按钮
    stuSelectCourse() {
      this.$router.push({ name: 'Qxk' })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
