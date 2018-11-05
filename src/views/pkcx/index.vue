<template><!-- 排课查询页面-->
  <div>
    <div v-area>
      <condition>
        <div class="condition">
          <label>学年</label>
          <selectChild v-model="listQuery['schoolYear']" clearable tp="yearSelect"/>
        </div>
        <div class="condition">
          <label>学期</label>
          <selectChild v-model="listQuery['termCode']" clearable tp="termSelect"/>
        </div>
        <div class="condition">
          <label>排课状态</label>
          <el-select v-model="listQuery['curStatus']" clearable placeholder="请选择">
            <el-option v-for="item in ztOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </div>
      </condition>
      <operation>
        <el-button type="primary" plain @click="addBtn">新增</el-button>
        <el-button type="primary" plain>合并课表</el-button>
      </operation>
    </div>
    <div>
      <el-table ref="singleTable" :data="tableData" :height="tableH" highlight-current-row style="width: 100%" v-loading="listLoading">
        <el-table-column type="index" width="50"/>
        <el-table-column property="arrangName" show-overflow-tooltip min-width="160px" label="排课名称"/>
        <el-table-column property="name" label="状态" width="80px"/>
        <el-table-column property="schoolYear" width="120px" label="学年">
          <template slot-scope="scope">
            <span>{{ `${scope.row.schoolYear} 学年` }}</span>
          </template>
        </el-table-column>
        <el-table-column property="termCode" label="学期" width="80px"></el-table-column>
        <el-table-column :formatter="gradeCodFormatter" property="gradeCode" label="年级"/>
        <el-table-column property="createTime" show-overflow-tooltip label="创建时间"/>
        <el-table-column fixed="right" width="130px" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="arrangeClass(scope.row.arrangeId)">排课</el-button>
            <el-button type="text" size="mini">删除</el-button>
            <el-button type="text" size="mini">复制</el-button>
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
        @current-change="handleCurrentChange">
        <slot/>
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getPKCXListInfo } from '@/api/pkcx'
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
    const h = 190
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
        { label: '进行中', value: '0' },
        { label: '完成', value: '1' },
        { label: '冲突', value: '2' }
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
      getPKCXListInfo(params).then(res => {
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
      this.$router.push({ name: 'jxjh' })
    },
    // 排课按钮
    arrangeClass(arrangeId) {
      console.log(arrangeId)
      // this.$router.push({ name: 'jxjh', query: { arrangeId } })
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
