<template><!--  导入学生选课 tab页-->
  <div>
    <!-- <div v-area>
        <condition>
          <div class="condition">
            <label>学科分类</label>
            <selectChild v-model="search['schoolYear']" clearable tp="yearSelect"/>
          </div>
          <div class="condition">
            <label>学期</label>
            <selectChild v-model="search['termCode']" clearable tp="termSelect"/>
          </div>
        </condition>
        <operation>
          <el-button type="primary" plain>查询</el-button>
          <el-button type="primary" plain>导入/导出</el-button>
          <el-button type="primary" plain>增加</el-button>
          <el-button type="primary" plain>修改</el-button>
          <el-button type="primary" plain>选课分析</el-button>
        </operation>
      </div>-->
    <div class="table-wapper">
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" highlight-current-row style="width: 100%" :height="height">
        <el-table-column type="selection" width="55" fixed></el-table-column>
        <el-table-column type="index" width="55" label="序号" fixed></el-table-column>
        <el-table-column label="年级" property="grade"></el-table-column>
        <el-table-column label="行政班" property="classes"></el-table-column>
        <el-table-column label="学号" property="stuno"></el-table-column>
        <el-table-column label="姓名" property="stuname"></el-table-column>
        <el-table-column label="物理学考" property="wlxk"></el-table-column>
        <el-table-column label="物理选考" property="wlxuk"></el-table-column>
        <el-table-column label="化学选考" property="hxxuk"></el-table-column>
        <el-table-column label="化学学考" property="hxxk"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getChooseClassListInfo } from '@/api/pkcx'

export default {
  data() {
    return {
      tableData: [],
      height: document.body.clientHeight - 370
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取表格数据
    async fetchData() {
      const params = { id: 1 }
      const res = await getChooseClassListInfo(params)
      console.log(res.DAT)
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

