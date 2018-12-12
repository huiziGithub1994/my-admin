<template>
  <div>
    <el-radio-group v-model="splitType">
      <el-radio :label="1">按选课结果将学生分班</el-radio>
      <el-radio :label="2">按考试成绩将学生分班</el-radio>
    </el-radio-group>
    <div class="content">
      <div class="left">
        <div class="operation-btn">
          <el-button type="primary">导入成绩</el-button>
        </div>
        <div class="table-wapper">
          <el-table ref="multipleTable" :data="gradeData" tooltip-effect="dark" highlight-current-row style="width: 100%">
            <el-table-column type="index" width="55" label="序号" fixed></el-table-column>
            <el-table-column label="学段/专业" property="c0" fixed></el-table-column>
            <el-table-column label="年级" property="c1" fixed></el-table-column>
            <el-table-column label="班级" property="c2" fixed></el-table-column>
            <el-table-column :label="item" :property="`c${index+3}`" v-for="(item,index) in tableHeader" :key="index"></el-table-column>
          </el-table>
        </div>
      </div>
      <div class="right">
        <div class="operation-btn">
          <el-button type="primary">保存分班标准</el-button>
        </div>
        <div class="table-wapper">d</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      splitType: 2,
      gradeData: [],
      tableHeader: []
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.content {
  display: flex;
  margin-top: 10px;
  .left {
    flex: 1;
  }
  .right {
    margin-left: 10px;
    width: 400px;
  }
}
.operation-btn {
  overflow: hidden;
  margin-bottom: 10px;
  > button {
    float: right;
  }
}
.table-wapper {
  border: 1px solid #dddddd;
  overflow: auto;
}
</style>

