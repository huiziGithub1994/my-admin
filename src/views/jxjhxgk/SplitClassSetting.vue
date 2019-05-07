<template>
  <div>
    <div>
      <!-- 分班设置 -->
      <condition>
        <div class="condition">
          <label>最小人数/班</label>
          <el-input placeholder="26" v-model.trim="search['theBestMinQty']" clearable></el-input>
        </div>
        <div class="condition next">
          <label>最大人数/班</label>
          <el-input placeholder="41" v-model.trim="search['theBestMaxQty']" clearable></el-input>
        </div>
        <div class="condition next">
          <label>班级个数</label>
          <el-input placeholder="8" v-model.trim="search['theClassSum']" clearable></el-input>
        </div>
      </condition>
      <operation>
        <el-button type="primary" plain>估算分班</el-button>
        <el-button type="primary" plain>保存并分班</el-button>
      </operation>
    </div>
    <div class="table-outer">
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" :height="tableH" v-loading="loading" class="splitClassManage">
        <el-table-column label="走班(定二)班级名称" property="teachingClass"></el-table-column>
        <el-table-column label="人数" property="stuSum"></el-table-column>
        <el-table-column label="选考科目" property="adminClassName"></el-table-column>
        <el-table-column label="其他选考科目及走班人数">
          <el-table-column label="政治" property="zzSum"></el-table-column>
          <el-table-column label="历史" property="lsSum"></el-table-column>
          <el-table-column label="地理" property="dlSum"></el-table-column>
          <el-table-column label="物理" property="wlSum"></el-table-column>
          <el-table-column label="化学" property="hxSum"></el-table-column>
          <el-table-column label="生物" property="swSum"></el-table-column>
          <el-table-column label="技术" property="jsSum"></el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { splitStu2AdminClass } from '@/api/jxjhXgk'
export default {
  data() {
    const h = 295
    const tableH = document.body.clientHeight - h
    return {
      arrangeId: sessionStorage.getItem('local_arrangeId'),
      loading: false, // 表格loading
      tableH,
      search: {
        theBestMinQty: undefined,
        theBestMaxQty: undefined,
        theClassSum: undefined
      },
      tableData: []
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    async getTableData() {
      const res = await splitStu2AdminClass({
        arrangeId: this.arrangeId,
        ...this.search
      })
      this.tableData = res.DATA
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.condition.next {
  margin-left: 15px;
}
.table-outer {
  margin: 10px 0;
  border: 1px solid #dddddd;
}
.condition > label {
  margin-right: 4px;
  &::after {
    content: '*';
    color: red;
    position: relative;
    margin-left: 3px;
    top: 3px;
  }
}
</style>
