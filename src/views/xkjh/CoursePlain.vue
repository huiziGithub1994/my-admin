<template>
  <div>
    <div>
      <condition>
        <div class="condition">
          <label>学段/专业/年级</label>
          <el-cascader expand-trigger="hover" :options="classOptions" v-model="selectedClass" @change="selectedClassChange"></el-cascader>
        </div>
      </condition>
      <operation>
        <el-button type="primary">下载模板</el-button>
        <el-button type="primary">导入</el-button>
      </operation>
    </div>
    <div class="table-wapper">
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" highlight-current-row style="width: 100%">
        <el-table-column label="年级" property="grade"></el-table-column>
        <el-table-column label="行政班" property="classes"></el-table-column>
        <el-table-column label="学号" property="stuno"></el-table-column>
        <el-table-column label="姓名" property="stuname"></el-table-column>
        <el-table-column label="性别" property="sex" width="55"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { classCascaderSelect } from '@/components/selectChild/data'
export default {
  data() {
    return {
      selectedClass: [], // 选中值
      classOptions: [], // 学段/专业/年级
      tableData: [] // 表格数据
    }
  },
  computed: {},
  created() {
    this.classOptions = [...classCascaderSelect]
  },
  methods: {
    selectedClassChange() {}
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
