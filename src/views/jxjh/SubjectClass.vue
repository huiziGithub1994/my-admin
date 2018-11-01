<template><!-- 学科分层及课时 tab页-->
  <div>
    <div class="operation-btns">
      <div>
        <el-button type="primary" plain>增加</el-button>
        <el-button type="primary" plain>修改</el-button>
        <el-button type="primary" plain>删除</el-button>
      </div>
    </div>
    <div class="table-wapper">
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" highlight-current-row style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" width="55" label="序号"></el-table-column>
        <el-table-column label="课程名称"></el-table-column>
        <el-table-column label="分层类型"></el-table-column>
        <el-table-column label="周课时"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: []
    }
  },
  methods: {}
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

