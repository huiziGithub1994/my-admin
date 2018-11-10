<template><!--  教学分班管理 tab页-->
  <div>
    <div>
      <condition>
        <div class="condition">
          <label>班额范围(人/班)</label>
          <el-input placeholder="38-45" v-model="search['xh']" clearable></el-input>
        </div>
      </condition>
      <operation>
        <el-button type="primary" plain>试分班</el-button>
        <el-button type="primary" plain>任课统计</el-button>
      </operation>
    </div>
    <div class="table-wapper">
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" highlight-current-row style="width: 100%" :height="height">
        <el-table-column type="index" width="55" label="序号" fixed></el-table-column>
        <el-table-column label="课程" property="courseLayer"></el-table-column>
        <el-table-column label="选课人数" property="studentNum"></el-table-column>
        <el-table-column label="开班数" property="classesNum"></el-table-column>
        <el-table-column label="教学班" property="classNames">
          <template slot-scope="scope">
            <el-tag size="medium" v-for="(className,index) in scope.row.className" :key="index">{{ className }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="预计人数" property="expectNum"></el-table-column>
        <el-table-column label="任课教师" property="teachers">
          <template slot-scope="scope">
            <div v-for="(teacher,index) in scope.row.teachers" :key="index"><el-input v-model="scope.row.teacher"/></div>
          </template>
        </el-table-column>
        <el-table-column label="课时" property="classTime"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getSplitClassManage } from '@/api/pkcx' // getSbjestClassListInfo:学生分层课时数据
export default {
  data() {
    return {
      // 检索字段
      search: {},
      // 表格数据
      tableData: [],
      // 表格高度
      height: document.body.clientHeight - 365
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取表格数据
    async fetchData() {
      const params = { id: 1 }
      const res = await getSplitClassManage(params)
      this.tableData = res.DATA
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.table-wapper {
  border: 1px solid #dddddd;
  margin: 10px 0;
}
</style>

