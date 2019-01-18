<!-- 参选学生-->
<template>
  <div>
    <div>
      <condition>
        <div class="condition">
          <label>班级</label>
          <el-select v-model="search['a.class_name01']" clearable placeholder="请选择">
            <el-option v-for="item in classesOptions" :key="item.classId" :label="item.className" :value="item.className"></el-option>
          </el-select>
        </div>
        <div class="condition">
          <label>学生姓名</label>
          <el-input placeholder="可模糊检索" v-model="search['a.stu_name06']" clearable></el-input>
        </div>
      </condition>
      <operation class="operation">
        <el-button type="primary" @click="queryBtn">查询</el-button>
        <!-- <el-button type="primary">参选课表</el-button> -->
        <a :href="downloadUrl" download="蓝墨水-选课参选学生.xls">
          <el-button type="primary">模板下载</el-button>
        </a>
        <el-upload
          action="http://47.107.255.128:8089/zxx/chose/upStuAttendSel"
          name="filename"
          :data="uloadParams"
          :show-file-list="false"
          :headers="httpHeaders"
          :before-upload="beforeUpload"
          :on-success="uploadSuccess"
          ref="upload"
        >
          <el-button type="primary">导入学生</el-button>
        </el-upload>
      </operation>
    </div>
    <div>
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" :height="tableH" highlight-current-row style="width: 100%">
        <el-table-column type="index" width="55" fixed></el-table-column>
        <el-table-column label="学段/专业" property="segName"></el-table-column>
        <el-table-column label="年级" property="gradeName"></el-table-column>
        <el-table-column label="班级名称" property="className"></el-table-column>
        <!-- <el-table-column label="唯一代码" property="rsId" show-overflow-tooltip></el-table-column> -->
        <el-table-column label="姓名" property="stuName" width="80px"></el-table-column>
        <el-table-column label="学号" property="stuCode"></el-table-column>
        <el-table-column label="性别" property="stuSex" width="80px"></el-table-column>
      </el-table>
      <el-pagination
        :current-page="pageTot.currentPage"
        :page-sizes="pageSizes"
        :page-size="pageTot.pageSize"
        :total="pageTotal"
        layout="total,sizes,slot ,->, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <slot/>
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { getJoinedStudents, getClassesOptions } from '@/api/xkrw'
import { getTableBestRows, paramsToString } from '@/utils/businessUtil'
import { mapGetters } from 'vuex'
import URL from '@/api/url'
export default {
  data() {
    const h = 270
    const tableH = document.body.clientHeight - h
    const pageSizes = getTableBestRows(tableH)
    return {
      search: {
        'a.class_name01': '',
        'a.stu_name06': '',
        'a.chose_rs_id01': sessionStorage.getItem('local_arrangeId')
      },
      // 班级下拉选项数据
      classesOptions: [],
      pageSizes: pageSizes,
      tableH: tableH,
      pageTot: {
        currentPage: 1,
        pageSize: pageSizes[0]
      },
      pageTotal: 0,
      // 表格数据
      tableData: [],
      httpHeaders: {},
      // 模板下载
      downloadUrl: URL.joinedStudentExcelTemplate,
      uloadParams: {
        choseRsId: sessionStorage.getItem('local_arrangeId')
      }
    }
  },
  computed: {
    ...mapGetters(['token'])
  },
  created() {
    Object.assign(this.httpHeaders, { x_auth_token: this.token })
    this.fetchClassesOptions()
    this.fetchJoinedStudents()
  },
  methods: {
    // 获取班级下拉选项数据
    async fetchClassesOptions() {
      const res = await getClassesOptions({
        choseRsId: sessionStorage.getItem('local_arrangeId')
      })
      this.classesOptions = res.DATA
    },
    // 查询按钮
    queryBtn() {
      this.pageTot.currentPage = 1
      this.fetchJoinedStudents()
    },
    // 获取表格信息
    async fetchJoinedStudents() {
      const params = {
        ...this.search,
        ...paramsToString(this.pageTot)
      }
      const res = await getJoinedStudents({ dataStr: JSON.stringify(params) })
      this.tableData = res.DATA
      this.pageTotal = res.NUM
    },
    handleSizeChange(val) {
      this.pageTot.currentPage = 1
      this.pageTot.pageSize = val
      this.fetchJoinedStudents()
    },
    handleCurrentChange(val) {
      this.pageTot.currentPage = val
      this.fetchJoinedStudents()
    },
    // 文件上传的回调函数
    uploadSuccess(res) {
      if (res.SUCCESS) {
        this.$message({
          message: '文件上传成功!',
          type: 'success'
        })
        Object.assign(this.search, {
          'a.class_name01': '',
          'a.stu_name06': ''
        })
        this.queryBtn()
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
  > div {
    display: inline-block;
  }
  button {
    width: 80px;
  }
}
</style>

