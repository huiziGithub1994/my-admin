<template>
  <!-- 排课查询页面-->
  <div>
    <div v-area>
      <condition>
        <div class="condition">
          <label>学年</label>
          <selectChild v-model="listQuery['a.school_year01']" :clearable="false" tp="yearSelect"/>
        </div>
        <div class="condition">
          <label>学期</label>
          <selectChild v-model="listQuery['a.term_code01']" :clearable="false" tp="termSelect"/>
        </div>
        <div class="condition">
          <label>排课状态</label>
          <el-select v-model="listQuery['a.cur_status01']" clearable placeholder="请选择">
            <el-option v-for="item in ztOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </div>
      </condition>
      <operation>
        <el-button type="primary" @click="queryBtn">查询</el-button>
        <el-button type="primary" @click="addBtn">新增</el-button>
        <el-button type="primary">合并课表</el-button>
      </operation>
    </div>
    <div>
      <el-table ref="singleTable" :data="tableData" :height="tableH" highlight-current-row style="width: 100%" v-loading="listLoading">
        <el-table-column type="index" width="50"/>
        <el-table-column property="arrangeName" show-overflow-tooltip min-width="160px" label="排课名称"/>
        <el-table-column property="curStatus" label="状态" width="80px">
          <template slot-scope="scope">
            <span v-if="scope.row.curStatus === '1'" class="success">完成</span>
            <span v-else-if="scope.row.curStatus === '2'" class="danger">冲突</span>
            <span v-else class="primary">进行中</span>
          </template>
        </el-table-column>
        <el-table-column property="schoolYear" label="学年">
          <template slot-scope="scope">
            <span>{{ `${scope.row.schoolYear} - ${parseInt(scope.row.schoolYear)+1} 学年` }}</span>
          </template>
        </el-table-column>
        <el-table-column property="termCode" label="学期">
          <template slot-scope="scope">
            <span>{{ `第${scope.row.termCode == '1' ? '一' : '二'}学期` }}</span>
          </template>
        </el-table-column>
        <el-table-column property="gradeName" label="年级"/>
        <el-table-column property="createDate" show-overflow-tooltip label="创建时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createDate | filterTime }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="155px" label="操作">
          <template slot-scope="scope">
            <div class="table-btns">
              <el-button type="primary" size="mini" @click="arrangeClass(scope.row.arrangeId)" plain>排课</el-button>
              <el-button type="danger" size="mini" @click="deleteClass(scope.row.arrangeId)" plain>删除</el-button>
              <el-button type="primary" size="mini" plain>复制</el-button>
            </div>
          </template>
        </el-table-column>
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
import { getPKCXListInfo, delArrange } from '@/api/pkcx'
import { getTableBestRows, paramsToString } from '@/utils/businessUtil'
import moment from 'moment'
import { mapGetters } from 'vuex'
export default {
  filters: {
    filterTime(val) {
      return moment(val).format('YYYY-MM-DD  hh:mm')
    }
  },
  data() {
    const h = 185
    const tableH = document.body.clientHeight - h
    const pageSizes = getTableBestRows(tableH)
    return {
      listLoading: true,
      listQuery: {
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
      const params = Object.assign(this.listQuery, paramsToString(this.pageTot))
      getPKCXListInfo({ dataStr: JSON.stringify(params) }).then(res => {
        this.pageTotal = res.NUM
        this.tableData = res.DATA
        this.listLoading = false
      })
    },
    // 年级格式化
    gradeCodFormatter(row, column, cellValue, index) {
      return cellValue
    },
    // 新增按钮
    addBtn() {
      this.$router.push({
        name: 'Jxjh',
        query: {
          curYear: this.listQuery['a.school_year01'],
          curTerm: this.listQuery['a.term_code01']
        }
      })
    },
    // 查询按钮
    queryBtn() {
      this.pageTot.currentPage = 1
      this.fetchData()
    },
    // 删除按钮
    deleteClass(arrangeId) {
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await delArrange({ arrangeId: arrangeId })
          this.$message({
            type: res.SUCCESS ? 'success' : 'error',
            message: res.SUCCESS ? '删除成功!' : '删除失败'
          })
          // 重新加载数据
          if (res.SUCCESS) this.queryBtn()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 排课按钮
    arrangeClass(arrangeId) {
      const queryParams = {
        arrangeId,
        curYear: this.listQuery['a.school_year01'],
        curTerm: this.listQuery['a.term_code01']
      }
      this.$router.push({ name: 'Jxjh', query: queryParams })
    },
    handleSizeChange(val) {
      this.pageTot.curPage = 1
      this.pageTot.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.pageTot.curPage = val
      this.fetchData()
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
