<template>
  <div>
    <el-table ref="singleTable" :data="tableData" highlight-current-row style="width: 100%" v-loading="listLoading">
      <el-table-column property="teaName" label="姓名"/>
      <el-table-column property="courseName" label="课程"/>
      <el-table-column property="className" label="班级"/>
      <el-table-column property="classHours" label="每周节次"/>
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
      const res = await qryTeaCourseCount({ arrangeId: this.arrangeId })
      this.tableData = res.DATA
    }
  }
}
</script>
