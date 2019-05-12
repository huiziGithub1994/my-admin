<!--教学任务报表-->
<template>
  <div>
    <div>
      <condition>
        <div class="condition">
          <label>教师名称</label>
          <el-select v-model="search['a.teaName01']" clearable placeholder="请选择">
            <el-option v-for="(item,index) in teachNameOptions" :key="index" :label="item.teaName" :value="item.teaName"></el-option>
          </el-select>
        </div>
        <div class="condition">
          <label>班级</label>
          <el-select v-model="search['a.className01']" clearable placeholder="请选择">
            <el-option v-for="(item,index) in classesOptions" :key="index" :label="item.className" :value="item.className"></el-option>
          </el-select>
        </div>
      </condition>
      <operation class="operation">
        <el-button type="primary" plain @click="queryBtn">查询</el-button>
      </operation>
    </div>
    <div>
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" :height="tableH" highlight-current-row style="width: 100%">
        <el-table-column label="姓名" property="teaName" width="120px"></el-table-column>
        <el-table-column label="课程" property="courseName"></el-table-column>
        <el-table-column label="班级" property="className" show-overflow-tooltip></el-table-column>
        <el-table-column label="每周节次" property="classHours"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { qryTeaCourseCount } from '@/api/skrwPt'
import { qryTeaListByArrangeId, qryClassListByArrangeId } from '@/api/jxjhXgk'

export default {
  data() {
    const h = 240
    const tableH = document.body.clientHeight - h
    return {
      arrangeId: sessionStorage.getItem('local_arrangeId'),
      search: {
        'a.arrangeId': sessionStorage.getItem('local_arrangeId'),
        'a.className01': '',
        'a.teaName01': ''
      },
      // 教师名称下拉选项数据
      teachNameOptions: [],
      // 班级下拉选项数据
      classesOptions: [],
      tableH: tableH,
      // 表格数据
      tableData: []
    }
  },
  created() {
    this.getTeachers()
    this.getClasses()
    this.queryBtn()
  },
  methods: {
    // 获取教师下拉列表数据
    async getTeachers() {
      const res = await qryTeaListByArrangeId({
        arrangeId: this.arrangeId
      })
      this.teachNameOptions = res.DATA
    },
    // 获取班级下拉列表数据
    async getClasses() {
      const res = await qryClassListByArrangeId({
        arrangeId: this.arrangeId
      })
      this.classesOptions = res.DATA
    },
    // 查询按钮
    async queryBtn() {
      const res = await qryTeaCourseCount({
        ...this.search
      })
      this.tableData = res.DATA
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.operation {
  > div {
    display: inline-block;
  }
  button {
    width: 80px;
  }
}
</style>

