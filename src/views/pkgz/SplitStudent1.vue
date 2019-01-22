<template>
  <div>
    <p class="tip">
      <label>温馨提示：</label>点击“开始自动分配”后，平台会按学生的选择结果进行教学分班，分班结果可以按“调整分班”对学生分班进行调整
    </p>
    <div v-area>
      <condition>
        <div class="condition">
          <label>教学班</label>
          <el-select v-model="listQuery['a.class_name01']" clearable placeholder="请选择">
            <el-option v-for="item in classesOption" :key="item.classId" :label="item.className" :value="item.className"></el-option>
          </el-select>
        </div>
        <div class="condition">
          <label>学号</label>
          <el-input v-model.trim="listQuery['a.to_choose_id06']" clearable></el-input>
        </div>
        <div class="condition">
          <label>姓名</label>
          <el-input v-model.trim="listQuery['a.stu_name06']" clearable></el-input>
        </div>
      </condition>
      <operation class="btns">
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary">调整分班</el-button>
        <el-button type="primary" @click="slitClasses" :disabled="disabledBtn">开始自动分配</el-button>
      </operation>
    </div>
    <div>
      <el-table ref="singleTable" :data="tableData" :height="tableH" highlight-current-row style="width: 100%" v-loading="listLoading">
        <el-table-column type="index" width="50"/>
        <el-table-column property="className" show-overflow-tooltip label="教学班"/>
        <el-table-column property="stuName" label="学生姓名"></el-table-column>
        <el-table-column property="toChooseId" label="学号"></el-table-column>
        <el-table-column property="sex" label="性别"></el-table-column>
        <el-table-column property="adminClassName" label="行政班"/>
        <el-table-column property="teaName" show-overflow-tooltip label="任课教师"></el-table-column>
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
import { getTableBestRows, paramsToString } from '@/utils/businessUtil'
import { qryTeachingClassInfoDetails, saveTeaClassRelyStu } from '@/api/pkgz'
export default {
  data() {
    const h = 330
    const tableH = document.body.clientHeight - h
    const pageSizes = getTableBestRows(tableH)
    return {
      disabledBtn: false,
      listLoading: false,
      arrangeId: sessionStorage.getItem('local_arrangeId'),
      listQuery: {
        'a.arrange_Id01': sessionStorage.getItem('local_arrangeId'),
        'a.to_choose_id06': '',
        'a.class_name01': '',
        'a.stu_name06': ''
      },
      classesOption: [],
      pageSizes: pageSizes,
      tableH: tableH,
      pageTot: {
        currentPage: 1,
        pageSize: pageSizes[0]
      },
      pageTotal: 0,
      tableData: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    initSearch() {
      Object.assign(this.listQuery, {
        'a.to_choose_id06': '',
        'a.class_name01': '',
        'a.stu_name06': ''
      })
    },
    fetchData() {
      this.listLoading = true
      const params = Object.assign(
        {},
        this.listQuery,
        paramsToString(this.pageTot)
      )
      qryTeachingClassInfoDetails({ dataStr: JSON.stringify(params) }).then(
        res => {
          this.pageTotal = res.NUM
          this.tableData = res.DATA
          if (this.tableData.length === 0) {
            this.$notify({
              title: '提示',
              duration: 0,
              message: this.$createElement(
                'i',
                { style: 'color: teal' },
                '请点击“开始自动分配”按钮，为学生分班'
              )
            })
          } else {
            this.disabledBtn = true
          }
          this.listLoading = false
        }
      )
    },
    // 开始自动分配按钮
    async slitClasses() {
      await saveTeaClassRelyStu({ arrangeId: this.arrangeId })
      this.initSearch()
      this.fetchData()
    },
    handleSizeChange(val) {
      this.pageTot.currentPage = 1
      this.pageTot.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.pageTot.currentPage = val
      this.fetchData()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.tip {
  margin: 10px 0;
}
</style>
