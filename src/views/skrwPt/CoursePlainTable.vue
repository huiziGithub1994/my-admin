<template>
  <div>
    <el-table ref="singleTable" :data="tableData" highlight-current-row style="width: 100%" v-loading="listLoading">
      <el-table-column type="index" width="50"/>
      <el-table-column property="tea_name" label="姓名"/>
      <el-table-column property="class_name" label="班级"/>
      <el-table-column property="course_name" label="课程"/>
      <el-table-column property="class_hours" label="每周节次"/>
    </el-table>
  </div>
</template>
<script>
import { qryTeaCourseCount } from '@/api/skrwPt'
export default {
  data() {
    return {
      listLoading: false,
      arrangeId: sessionStorage.getItem('local_arrangeId'),
      tableData: []
    }
  },
  created() {
    if (this.arrangeId) this.fetchTableData()
  },
  methods: {
    async fetchTableData() {
      const res = qryTeaCourseCount({ arrangeId: this.arrangeId })
      this.tableData = res.DATA
    }
  }
}
</script>
