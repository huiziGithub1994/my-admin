<template>
  <div>
    <el-table ref="singleTable" :data="tableData" :height="360" highlight-current-row style="width: 100%" v-loading="listLoading">
      <el-table-column type="index" width="50"/>
      <el-table-column property="arrangeName" show-overflow-tooltip min-width="160px" label="排课名称"/>
      <el-table-column property="splitLayerType" label="分层类型" width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.splitLayerType == 1 ? '学生自由选择分层' : '按成绩分层' }}</span>
        </template>
      </el-table-column>
      <el-table-column property="curStatus" label="状态" width="80px">
        <template slot-scope="scope">
          <span v-if="scope.row.curStatus === '1'" class="success">完成</span>
          <span v-else-if="scope.row.curStatus === '2'" class="danger">冲突</span>
          <span v-else class="primary">进行中</span>
        </template>
      </el-table-column>
      <el-table-column property="schoolYear" label="学年" width="130px">
        <template slot-scope="scope">
          <span>{{ `${scope.row.schoolYear}-${parseInt(scope.row.schoolYear)+1}学年` }}</span>
        </template>
      </el-table-column>
      <el-table-column property="termCode" label="学期" width="100px">
        <template slot-scope="scope">
          <span>{{ `第${scope.row.termCode == '1' ? '一' : '二'}学期` }}</span>
        </template>
      </el-table-column>
      <el-table-column property="gradeName" label="年级" width="100px"/>
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
import { getPKCXListInfo } from '@/api/pkcx'
import { getTableBestRows, paramsToString } from '@/utils/businessUtil'
import { mapGetters } from 'vuex'
export default {
  data() {
    const tableH = 360
    const pageSizes = getTableBestRows(tableH + 40)
    return {
      listLoading: true,
      listQuery: {
        'a.arrange_type01': '2',
        'a.school_year01': '',
        'a.term_code01': '',
        'a.cur_status01': ''
      },
      // 排课状态
      ztOptions: [
        { label: '进行中', value: '0' },
        { label: '完成', value: '1' },
        { label: '冲突', value: '2' }
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
    if (this.curTerm === '' || this.curYear === '') {
      this.$store.dispatch('GetInfo').then(() => {
        this.getInitData()
      })
      return
    }
    this.getInitData()
  },
  methods: {
    getInitData() {
      Object.assign(this.listQuery, {
        'a.school_year01': this.curYear,
        'a.term_code01': this.curTerm
      })
      this.fetchData()
    },
    // 获取表格数据
    fetchData() {
      this.listLoading = true
      const params = Object.assign(
        {},
        this.listQuery,
        paramsToString(this.pageTot)
      )
      getPKCXListInfo(params).then(res => {
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
