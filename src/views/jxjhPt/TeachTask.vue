<template>
  <!--教学任务 tab页-->
  <div>
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
        <a :href="downloadUrl" download="普通排课任课表_排课班级">
          <el-button type="primary" plain>模板下载</el-button>
        </a>
        <el-upload action="http://localhost:9999/base/uploadTeachingTask" :show-file-list="false" :before-upload="beforeUpload" :on-success="uploadSuccess">
          <el-button type="primary" plain>点击上传</el-button>
        </el-upload>
      </div>
    </div>
    <div class="area-data">
      <p class="tip">
        <label>操作说明：</label>请下载模板后按格式填写，然后点击“上传任务”上传即可,上传文件的类型为xls或xlsx
      </p>
      <div>
        <el-table ref="multipleTable" :data="data.tableData" tooltip-effect="dark" highlight-current-row style="width: 100%">
          <el-table-column type="index" width="55" label="序号" fixed></el-table-column>
          <el-table-column label="学段/专业" property="c0" fixed></el-table-column>
          <el-table-column label="年级" property="c1" fixed></el-table-column>
          <el-table-column label="班级" property="c2" fixed></el-table-column>
          <el-table-column :label="item" :property="`c${index+3}`" v-for="(item,index) in tableHeader" :key="index"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import { getTeachTaskInfo } from '@/api/pkcxPt'
import URL from '@/api/url'
export default {
  data() {
    return {
      initArea: false,
      data: {
        tableData: []
      },
      tableHeader: [],
      arrangeId: this.$route.query.arrangeId,
      downloadUrl: URL.teachTaskExcelTemplate
    }
  },
  mounted() {
    this.arrangeId && this.fetchData()
  },
  methods: {
    // 获取表格数据
    async fetchData() {
      const res = await getTeachTaskInfo({ arrangeId: this.arrangeId })
      this.data = res.DATA
      this.filterTableHeader(res.DATA.tableHeader)
      // this.filterTableData(res.DATA.tableData)
    },
    // 重组表格头部
    filterTableHeader(data) {
      const newData = []
      data.forEach(item => {
        newData.push(item)
        newData.push('节数')
      })
      this.tableHeader = newData
    },
    // 文件上传的回调函数
    uploadSuccess(res) {
      this.$message({
        message: '文件上传成功!',
        type: 'success'
      })
      this.data = res.DATA
      this.filterTableHeader(res.DATA.tableHeader)
    },
    // 文件上传前的钩子
    beforeUpload(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension = testmsg === 'xls'
      const extension2 = testmsg === 'xlsx'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!extension && !extension2) {
        this.$message({
          message: '上传文件只能是 xls、xlsx格式!',
          type: 'warning'
        })
      }
      if (!isLt2M) {
        this.$message({
          message: '上传文件大小不能超过 10MB!',
          type: 'warning'
        })
      }
      return extension || (extension2 && isLt2M)
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
  margin-top: 10px;
  > div {
    border: 1px solid #dddddd;
    margin: 5px 0;
    min-height: 400px;
  }
}
</style>

