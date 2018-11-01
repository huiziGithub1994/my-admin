<template><!-- 排课查询页面-->
  <div>
    <div v-area>
      <condition>
        <div class="condition">
          <label>学年</label>
          <selectChild
            v-model="search['schoolYear']"
            clearable
            tp="yearSelect"/>
        </div>
        <div class="condition">
          <label>学期</label>
          <selectChild
            v-model="search['termCode']"
            clearable
            tp="termSelect"/>
        </div>
        <div class="condition">
          <label>排课状态</label>
          <el-select v-model="search['zt']" clearable placeholder="请选择">
            <el-option
              v-for="item in ztOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </div>
      </condition>
      <operation>
        <el-button type="primary" plain @click="addBtn">新增</el-button>
        <el-button type="primary" plain>合并课表</el-button>
      </operation>
    </div>
    <div>
      <el-table
        ref="singleTable"
        :data="tableData"
        :height="tableH"
        highlight-current-row
        style="width: 100%">
        <el-table-column
          type="index"
          width="50"/>
        <el-table-column
          property="arrangName"
          show-overflow-tooltip
          min-width="160px"
          label="排课名称"/>
        <el-table-column
          property="name"
          label="状态"
          width="80px"/>
        <el-table-column
          property="schoolYear"
          width="120px"
          label="学年">
          <template slot-scope="scope">
            <span>{{ `${scope.row.schoolYear}-${Number(scope.row.schoolYear)+1}学年` }}</span>
          </template>
        </el-table-column>
        <el-table-column
          property="termCode"
          label="学期"
          width="80px">
          <template slot-scope="scope">
            <span>第{{ `${scope.row.termCode === '1' ? '一':'二'}` }}学期</span>
          </template>
        </el-table-column>
        <el-table-column
          :formatter="gradeCodFormatter"
          property="gradeCode"
          label="年级"/>
        <el-table-column
          property="createTime"
          show-overflow-tooltip
          label="创建时间"/>
        <el-table-column
          fixed="right"
          width="130px"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini">排课</el-button>
            <el-button type="text" size="mini">删除</el-button>
            <el-button type="text" size="mini">复制</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="pageTot.pageNum"
        :page-sizes="pageSizes"
        :page-size="pageTot.pageSize"
        :total="pageTot.pagetotal"
        layout="total,sizes,slot ,->, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
        <slot/>
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getListInfo } from '@/api/pkcx'
import { getTableBestRows } from '@/utils/businessUtil'
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
    return {
      search: {
        schoolYear: '2018',
        termCode: '1'
      },
      ztOptions: [{ label: '完成', value: '1' }],
      pageSizes: pageSizes,
      tableH: tableH,
      pageTot: {
        pageNum: 1,
        pageSize: pageSizes[0],
        pagetotal: 10
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
      getListInfo(this.listQuery).then(res => {
        this.pageTot.pagetotal = res.SUM
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
    handleSizeChange() {},
    handleCurrentChange() {}
  }
}
</script>
