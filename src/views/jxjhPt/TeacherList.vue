<template>
  <!--教师列表 tab页-->
  <div class="container">
    <div class="top">
      <div class="desc">
        <p>
          <label>学年/学期</label>
          <span class="text-red">{{ data.schoolYear }}-{{ Number(data.schoolYear)+1 }}学年第{{ data.termCode==='1' ? '一' : '二' }}学期</span>
        </p>
        <p>
          <label>排课任务名称</label>
          {{ data.arrangeName }}
        </p>
      </div>
      <div class="operation">
        <el-button type="primary">重新上传任务</el-button>
      </div>
    </div>
    <div class="area-data">
      <el-table ref="multipleTable" border :data="data.tableData" tooltip-effect="dark" highlight-current-row>
        <el-table-column type="index" width="55" label="序号"></el-table-column>
        <el-table-column label="姓名" property="teacherName"></el-table-column>
        <el-table-column label="所属教研组" property="ssjyz"></el-table-column>
        <el-table-column label="行政职务" property="xzzw"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getTeacherList } from '@/api/pkcxPt'
export default {
  data() {
    return {
      initArea: false,
      data: {
        tableData: []
      },
      arrangeId: this.$route.query.arrangeId
    }
  },
  mounted() {
    this.arrangeId && this.fetchData()
  },
  methods: {
    // 获取表格数据
    async fetchData() {
      const res = await getTeacherList({ arrangeId: this.arrangeId })
      this.data = res.DATA
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.container {
  max-width: 800px;
}
.top {
  margin-top: -5px;
  > div {
    display: inline-block;
  }
  .operation {
    float: right;
    margin-top: 5px;
    > div {
      display: inline-block;
    }
  }
  .desc {
    > p {
      margin: 0;
      line-height: 2rem;
    }
    label {
      margin-right: 15px;
      min-width: 90px;
      display: inline-block;
      color: #7f7f7f;
    }
  }
}
.area-data {
  margin: 10px 0;
  width: 500px;
}
</style>

