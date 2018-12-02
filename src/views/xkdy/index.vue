<template>
  <!-- 选课调研 列表-->
  <div>
    <div v-area>
      <condition>
        <div class="condition">
          <label>学年</label>
          <selectChild v-model="listQuery['schoolYear']" :clearable="false" tp="yearSelect"/>
        </div>
        <div class="condition">
          <label>学期</label>
          <selectChild v-model="listQuery['termCode']" :clearable="false" tp="termSelect"/>
        </div>
        <div class="condition">
          <label>执行状态</label>
          <el-select v-model="listQuery['curStatus']" clearable placeholder="请选择">
            <el-option v-for="item in ztOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </div>
      </condition>
      <operation>
        <el-button type="primary" @click="queryBtn">查询</el-button>
        <el-button type="primary" @click="addBtn">新增</el-button>
      </operation>
    </div>
    <div>
      <el-table ref="singleTable" :data="tableData" :height="tableH" highlight-current-row style="width: 100%" v-loading="listLoading">
        <el-table-column type="index" width="50"/>
        <el-table-column property="name" show-overflow-tooltip min-width="160px" label="选课任务名称"/>
        <el-table-column property="status" label="状态" width="80px">
          <template slot-scope="scope">
            <el-tag size="mini" :type="scope.row.status === '完成' ? 'success': 'danger'">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column property="schoolYear" width="120px" label="学年">
          <template slot-scope="scope">
            <span>{{ `${scope.row.schoolYear} 学年` }}</span>
          </template>
        </el-table-column>
        <el-table-column property="termCode" label="学期" width="80px"></el-table-column>
        <el-table-column property="createTime" show-overflow-tooltip label="创建时间"/>
        <el-table-column fixed="right" width="130px" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="arrangeClass(scope.row.arrangeId)">分析</el-button>
            <el-button type="text" size="mini" class="text-red" @click="deleteClass(scope.row.arrangeId)">删除</el-button>
            <el-button type="text" size="mini">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="pageTot.curPage"
        :page-sizes="pageSizes"
        :page-size="pageTot.pageSize"
        :total="pageTot.pageTotal"
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
import { getXKDYListInfo } from '@/api/xkdy'
import { getTableBestRows, getCurSchoolYearTerm } from '@/utils/businessUtil'
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    const h = 175
    const tableH = document.body.clientHeight - h
    const pageSizes = getTableBestRows(tableH)
    const yearAndTerm = getCurSchoolYearTerm()
    return {
      listLoading: true,
      listQuery: {
        schoolYear: yearAndTerm.currentYear,
        termCode: yearAndTerm.termCode,
        curStatus: '1'
      },
      // 排课状态
      ztOptions: [
        { label: '未完成', value: '0' },
        { label: '完成', value: '1' }
      ],
      pageSizes: pageSizes,
      tableH: tableH,
      pageTot: {
        curPage: 1,
        pageSize: pageSizes[0],
        pageTotal: 0
      },
      tableData: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取表格数据
    fetchData() {
      this.listLoading = true
      const params = Object.assign(this.listQuery, this.pageTot)
      getXKDYListInfo(params).then(res => {
        this.pageTot.pageTotal = res.SUM
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
      this.$router.push({ name: 'Jxjh' })
    },
    // 查询按钮
    queryBtn() {
      this.pageTot.curPage = 1
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
          // const res = await qryArrangeDetail({ arrangeId: arrangeId, a: '2' })
          // this.$message({
          //   type: res.SUCCESS ? 'success' : 'error',
          //   message: res.SUCCESS ? '删除成功!' : '删除失败'
          // })
          // // 重新加载数据
          // if (res.SUCCESS) this.queryBtn()
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
      const queryParams = { arrangeId }
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
