<template><!--教学任务 tab页-->
  <div>
    <div class="top">
      <div class="desc">
        <p ><label>学年/学期</label><span class="text-red">{{ data.schoolYear }}-{{ Number(data.schoolYear)+1 }}学年第{{ data.termCode==='1' ? '一' : '二' }}学期</span></p>
        <p><label>排课任务名称</label>{{ data.arrangeName }}</p>
      </div>
      <div class="operation">
        <el-button type="primary" plain>下载模板</el-button>
        <el-button type="primary" plain>上传任务</el-button>
      </div>
    </div>
    <div class="area-data">
      <p><label>操作说明：</label>请下载模板后按格式填写，然后点击“上传任务”上传即可</p>
      <el-table ref="multipleTable" :data="data.tableData" tooltip-effect="dark" highlight-current-row style="width: 100%">
        <el-table-column type="index" width="55" label="序号" fixed></el-table-column>
        <el-table-column label="学段/专业" property="grade" fixed></el-table-column>
        <el-table-column label="年级" property="classes" fixed></el-table-column>
        <el-table-column label="班级" property="classes" fixed></el-table-column>
        <el-table-column :label="item" property="classes" v-for="(item,index) in tableHeader" :key="index"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getTeachTaskInfo } from '@/api/pkcxPt'
export default {
  data() {
    return {
      initArea: false,
      data: {
        tableData: []
      },
      tableHeader: [],
      arrangeId: this.$route.query.arrangeId
    }
  },
  mounted() {
    this.arrangeId && this.fetchData()
  },
  methods: {
    async fetchData() {
      const res = await getTeachTaskInfo({ arrangeId: this.arrangeId })
      this.data = res.DATA
      this.filterTableHeader(res.DATA.tableHeader)
      this.filterTableData(res.DATA.tableData)
    },
    filterTableHeader(data) {
      const newData = []
      data.forEach(item => {
        newData.push(item)
        newData.push('节数')
      })
      this.tableHeader = newData
    },
    filterTableData(data) {
      data.forEach(item => {})
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.top {
  margin-top: -5px;
  > div {
    display: inline-block;
  }
  .operation {
    float: right;
    margin-top: 5px;
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
  margin-top: 10px;
  > p {
    color: #909399;
    margin: 0;
    font-size: 0.9rem;
    > label {
      color: #67c23a;
    }
  }
}
</style>

