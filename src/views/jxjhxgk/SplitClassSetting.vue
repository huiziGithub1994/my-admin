<template>
  <div>
    <div>
      <!-- 分班设置 -->
      <condition>
        <div class="condition">
          <label>班额范围(人/班)</label>
          <el-input placeholder="5" v-model.trim="search['minSize']" clearable></el-input>&nbsp;-
          <el-input placeholder="8" v-model.trim="search['maxSize']" clearable></el-input>
        </div>
        <div class="condition last">
          <label>最优班额(人/班)</label>
          <el-input placeholder="7" v-model.trim="search['minSize']" clearable></el-input>
        </div>
      </condition>
      <operation>
        <el-button type="primary" plain>估算分班</el-button>
        <el-button type="primary" plain>保存并分班</el-button>
      </operation>
    </div>
    <div class="table-outer">
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" :height="tableH" v-loading="loading" class="splitClassManage">
        <el-table-column type="index" width="55" label="序号" fixed></el-table-column>
        <el-table-column label="选课组合" property="allName" min-width="200px" show-overflow-tooltip></el-table-column>
        <el-table-column label="学生人数" property="stuCount"></el-table-column>
        <el-table-column label="预计教学开班个数">
          <template slot-scope="scope">
            <el-input size="mini" v-model.trim="scope.row.classNum"/>
          </template>
        </el-table-column>
        <el-table-column label="余数" property="classCount"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    const h = 295
    const tableH = document.body.clientHeight - h
    return {
      loading: false, // 表格loading
      tableH,
      search: {},
      tableData: [
        {
          allName: '化学,物理，地理',
          stuCount: '13',
          classNum: '2',
          classCount: '0'
        },
        {
          allName: '化学,物理，地理',
          stuCount: '13',
          classNum: '2',
          classCount: '0'
        },
        {
          allName: '化学,物理，地理',
          stuCount: '13',
          classNum: '2',
          classCount: '0'
        }
      ]
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.condition.last {
  margin-left: 15px;
}
.table-outer {
  margin: 10px 0;
  border: 1px solid #dddddd;
}
</style>
