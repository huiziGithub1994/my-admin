<template>
  <div>
    <el-table ref="singleTable" :data="tableData" :height="360" highlight-current-row style="width: 100%" v-loading="listLoading" @current-change="tableCurrentChange">
      <el-table-column type="index" width="50"/>
      <el-table-column property="choseTaskName" show-overflow-tooltip min-width="260px" label="选课任务名称"/>
      <el-table-column property="choseTypeName" label="任务类型"></el-table-column>
      <el-table-column property="pubFlag" label="任务状态" width="80px">
        <template slot-scope="scope">
          <span :class="scope.row.pubFlag === '已发布' ? 'success' : 'danger'">{{ scope.row.pubFlag }}</span>
        </template>
      </el-table-column>
      <el-table-column property="beginTime" label="开始时间" width="150px"></el-table-column>
      <el-table-column property="endTime" label="结束时间" width="150px"></el-table-column>
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
    <div></div>
  </div>
</template>
<script>
import { qryChoseCourseList } from '@/api/xkrw'
import { getTableBestRows, paramsToString } from '@/utils/businessUtil'
import { mapGetters } from 'vuex'
export default {
  data() {
    const tableH = 360
    const pageSizes = getTableBestRows(tableH + 40)
    return {
      listLoading: true,
      listQuery: {
        'a.school_year01': '',
        'a.term_code01': '',
        'a.pub_flag01': ''
      },
      // 选课状态
      ztOptions: [
        { label: '可用', value: '0' },
        { label: '不可用', value: '1' }
      ],
      pageSizes: pageSizes,
      tableH: tableH,
      pageTot: {
        currentPage: 1,
        pageSize: pageSizes[0]
      },
      pageTotal: 0,
      currentRow: null, // 表格当前选中行
      tableData: []
    }
  },
  computed: {
    ...mapGetters(['curYear', 'curTerm'])
  },
  created() {
    Object.assign(this.listQuery, {
      'a.school_year01': this.curYear,
      'a.term_code01': this.curTerm
    })
    this.fetchData()
  },
  methods: {
    getParams() {
      return this.currentRow
    },
    fetchData() {
      this.listLoading = true
      const params = Object.assign(this.listQuery, paramsToString(this.pageTot))
      qryChoseCourseList({ dataStr: JSON.stringify(params) }).then(res => {
        this.pageTotal = res.NUM
        this.tableData = res.DATA
        this.listLoading = false
      })
    },
    tableCurrentChange(val) {
      this.currentRow = val
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
