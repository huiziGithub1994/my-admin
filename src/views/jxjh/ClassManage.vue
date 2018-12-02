<template>
  <!-- 学科分层及课时 tab页-->
  <div>
    <div class="operation-btns">
      <div>
        <el-button type="primary">增加</el-button>
        <el-button type="primary">修改</el-button>
        <el-button type="primary">删除</el-button>
      </div>
    </div>
    <div class="table-wapper">
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" highlight-current-row style="width: 100%" :height="height">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" width="55" label="序号"></el-table-column>
        <el-table-column label="课程名称" property="courseName"></el-table-column>
        <el-table-column label="分层类型" property="courseType"></el-table-column>
        <el-table-column label="周课时(节)" property="courseTime"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getSbjestClassListInfo } from '@/api/pkcx'

export default {
  data() {
    return {
      tableData: [],
      height: document.body.clientHeight - 410
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取表格数据
    async fetchData() {
      const params = { id: 1 }
      const res = await getSbjestClassListInfo(params)
      this.tableData = res.DATA
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.operation-btns {
  overflow: hidden;
  margin-bottom: 10px;
  > div {
    float: right;
  }
}
.table-wapper {
  border: 1px solid #dddddd;
  margin-bottom: 10px;
}
</style>

