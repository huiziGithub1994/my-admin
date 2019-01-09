<!-- 参选学生-->
<template>
  <div>
    <div>
      <condition>
        <div class="condition">
          <label>班级</label>
          <el-select v-model="search['bj']" clearable placeholder="请选择">
            <el-option v-for="item in classesOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="condition">
          <label>学生姓名</label>
          <el-input placeholder="可模糊检索" v-model="search['xm']" clearable></el-input>
        </div>
      </condition>
      <operation>
        <el-button type="primary">查询</el-button>
        <el-button type="primary">参选课表</el-button>
        <el-button type="primary">下载模板</el-button>
        <el-button type="primary">导入学生</el-button>
      </operation>
    </div>
    <div>
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" highlight-current-row style="width: 100%">
        <el-table-column type="index" width="55" label="序号" fixed></el-table-column>
        <el-table-column label="学段/专业" property="xd"></el-table-column>
        <el-table-column label="年级" property="grade"></el-table-column>
        <el-table-column label="班级名称" property="className"></el-table-column>
        <el-table-column label="唯一代码" property="code"></el-table-column>
        <el-table-column label="姓名" property="name"></el-table-column>
        <el-table-column label="学号(不可重复)" property="xh"></el-table-column>
        <el-table-column label="性别" property="sex">
          <template slot-scope="scope">
            <span>{{ scope.row.sex === '1' ? '男':'女' }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getClassesOptions, getJoinedStudents } from '@/api/xkrw'
export default {
  data() {
    return {
      search: {},
      // 班级下拉选项数据
      classesOptions: [],
      // 表格数据
      tableData: []
    }
  },
  created() {
    this.fetchClassesOptions()
    this.fetchJoinedStudents()
  },
  methods: {
    // 获取班级下拉选项数据
    async fetchClassesOptions() {
      const res = await getClassesOptions()
      this.classesOptions = res.DATA
    },
    // 获取表格信息
    async fetchJoinedStudents() {
      const res = await getJoinedStudents()
      this.tableData = res.DATA
    }
  }
}
</script>

