<template>
  <div>
    <div v-area>
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
          <label>平均人数/班</label>
          <el-input placeholder="30" v-model.trim="search['theAvgQty']" clearable></el-input>
        </div>
        <div class="condition next">
          <label>最优人数/班</label>
          <el-input placeholder="35" v-model.trim="search['theBestSum']" clearable></el-input>
        </div>
      </condition>
      <operation>
        <el-button type="primary" plain @click="saveClass">保存分班</el-button>
      </operation>
    </div>
    <div class="table-outer">
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" v-loading="loading">
        <el-table-column label="走班(定二)班级名称" property="teachingClass" width="150px"></el-table-column>
        <el-table-column label="人数" property="stuSum" width="70px" header-align="center" align="center"></el-table-column>
        <el-table-column label="选考科目" property="adminClassName" width="250px"></el-table-column>
        <el-table-column label="其他选考科目及走班人数" header-align="center">
          <el-table-column v-for="item in tableColumns" :key="item.property" :label="item.label" :property="item.property" header-align="center" align="center"></el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { saveMoveCourseList, qrySplitClassesList } from '@/api/jxjhXgk'
export default {
  data() {
    const h = 255
    const tableH = document.body.clientHeight - h
    return {
      arrangeId: sessionStorage.getItem('local_arrangeId'),
      loading: false, // 表格loading
      tableH,
      search: {
        theBestMinQty: undefined,
        theBestMaxQty: undefined,
        theAvgQty: undefined,
        theBestSum: undefined
      },
      activePos: {}, // input输入错误的位置
      tableColumns: [
        { label: '政治', property: 'zzSum' },
        { label: '历史', property: 'lsSum' },
        { label: '地理', property: 'dlSum' },
        { label: '物理', property: 'wlSum' },
        { label: '化学', property: 'hxSum' },
        { label: '生物', property: 'swSum' },
        { label: '技术', property: 'jsSum' }
      ],
      tableData: []
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    async getTableData() {
      const res = await qrySplitClassesList({ arrangeId: this.arrangeId })
      this.tableData = res.DATA
    },
    // 保存分班
    async saveClass() {
      if (!this.tableData.length) {
        this.$message.error('请先估算分班后，再点击保存分班')
        return
      }
      const res = await saveMoveCourseList({ arrangeId: this.arrangeId })
      this.$message.success(res.MSG)
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
.condition {
  > .el-input {
    width: 80px !important;
  }
  > label {
    margin-right: 4px;
    &::after {
      content: '*';
      color: red;
      position: relative;
      margin-left: 3px;
      top: 3px;
    }
  }
}
.readOnly {
  padding-left: 15px;
}
</style>
<style rel="stylesheet/scss" lang="scss">
div.splitClassSettingError > input.el-input__inner {
  border: 1px solid #de3b3b !important;
}
</style>
