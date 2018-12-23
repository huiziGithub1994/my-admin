<template>
  <!-- 课程计划-->
  <div>
    <div>
      <condition>
        <div class="condition">
          <label>学段/专业/年级</label>
          <el-cascader expand-trigger="hover" :options="classOptions" clearable v-model="selectedClass" @change="selectedClassChange"></el-cascader>
        </div>
      </condition>
      <operation class="operation">
        <a :href="downloadUrl" download="蓝墨水-学段专业-年级-课程.xls">
          <el-button type="primary">模板下载</el-button>
        </a>
        <el-upload
          action="http://47.107.255.128:8089/zxx/uploadSeg"
          name="filename"
          :show-file-list="false"
          :headers="httpHeaders"
          :before-upload="beforeUpload"
          :on-success="uploadSuccess"
          ref="upload"
        >
          <el-button type="primary">导入</el-button>
        </el-upload>
      </operation>
    </div>
    <div class="table-wapper">
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" highlight-current-row style="width: 100%">
        <el-table-column label="学段/专业" property="periodSepciality"></el-table-column>
        <el-table-column label="年级" property="grade"></el-table-column>
        <el-table-column label="课程" property="course"></el-table-column>
        <el-table-column label="周课时(节)" property="weekTime"></el-table-column>
        <el-table-column label="授课方式" property="teachStyle"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { classCascaderSelect } from '@/components/selectChild/data'
import { getCoursePlain } from '@/api/base'
import { mapGetters } from 'vuex'
import URL from '@/api/url'
export default {
  data() {
    return {
      selectedClass: [], // 选中值
      classOptions: [], // 学段/专业/年级
      tableData: [], // 表格数据
      downloadUrl: URL.coursePlainExcelTemplate,
      httpHeaders: {}
    }
  },
  computed: {
    ...mapGetters(['token'])
  },
  created() {
    this.classOptions = [...classCascaderSelect]
    this.fetchData()
    Object.assign(this.httpHeaders, { x_auth_token: this.token })
  },
  methods: {
    toUpload() {
      this.$refs.upload.submit()
    },
    async fetchData() {
      const res = await getCoursePlain()
      this.tableData = res.DATA
    },
    selectedClassChange() {
      this.fetchData()
    },
    // 文件上传的回调函数
    uploadSuccess(res) {
      if (res.SUCCESS) {
        this.$message({
          message: '文件上传成功!',
          type: 'success'
        })
      } else {
        this.$message({
          message: '文件上传失败!',
          type: 'error'
        })
      }
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
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.operation {
  float: right;
  margin-top: 5px;
  > div {
    display: inline-block;
  }
}
</style>
