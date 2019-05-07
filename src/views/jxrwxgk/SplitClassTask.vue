<!-- 走班教学任务-->
<template>
  <div>
    <div class="opera-area">
      <div class="right">
        <el-button type="primary" plain @click="saveArrange" :loading="saveBtn">保存</el-button>
      </div>
    </div>
    <div class="data-area">
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" :height="tableH" v-loading="loading">
        <el-table-column label="学段/专业" property="segName"></el-table-column>
        <el-table-column label="年级" property="gradeName"></el-table-column>
        <el-table-column label="教学班级" property="className"></el-table-column>
        <el-table-column label="科目" property="chargeTeaName"></el-table-column>
        <el-table-column label="政治">
          <template slot-scope="scope">
            <split-input :row="scope.row"/>
          </template>
        </el-table-column>
        <el-table-column label="节数">
          <template slot-scope="scope">
            <split-input :row="scope.row"/>
          </template>
        </el-table-column>
        <el-table-column label="历史">
          <template slot-scope="scope">
            <split-input :row="scope.row"/>
          </template>
        </el-table-column>
        <el-table-column label="节数">
          <template slot-scope="scope">
            <split-input :row="scope.row"/>
          </template>
        </el-table-column>
        <el-table-column label="地理">
          <template slot-scope="scope">
            <split-input :row="scope.row"/>
          </template>
        </el-table-column>
        <el-table-column label="节数">
          <template slot-scope="scope">
            <split-input :row="scope.row"/>
          </template>
        </el-table-column>
        <el-table-column label="物理">
          <template slot-scope="scope">
            <split-input :row="scope.row"/>
          </template>
        </el-table-column>
        <el-table-column label="节数">
          <template slot-scope="scope">
            <split-input :row="scope.row"/>
          </template>
        </el-table-column>
        <el-table-column label="化学">
          <template slot-scope="scope">
            <split-input :row="scope.row"/>
          </template>
        </el-table-column>
        <el-table-column label="节数">
          <template slot-scope="scope">
            <split-input :row="scope.row"/>
          </template>
        </el-table-column>
        <el-table-column label="生物">
          <template slot-scope="scope">
            <split-input :row="scope.row"/>
          </template>
        </el-table-column>
        <el-table-column label="节数">
          <template slot-scope="scope">
            <split-input :row="scope.row"/>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import SplitInput from './SplitInput'
export default {
  components: {
    SplitInput
  },
  data() {
    const h = 295
    const tableH = document.body.clientHeight - h
    return {
      tableH,
      loading: false,
      saveBtn: false, // 保存任课安排
      hotInstance: null,
      showTable: false,
      arrangeId: sessionStorage.getItem('local_arrangeId'),
      gradeStr: sessionStorage.getItem('gradeStr'),
      tableData: []
    }
  },
  created() {
    // this.getTableData()
  },
  methods: {}
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.opera-area {
  overflow: hidden;
  > .right {
    float: right;
  }
}
.tree-wapper {
  height: 300px;
  border: 1px solid #dddddd;
  overflow: auto;
}
</style>
<style>
.columnClass {
  font-weight: bold;
  text-align: center;
}
</style>

