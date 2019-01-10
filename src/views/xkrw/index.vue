<template>
  <!-- 选课调研 列表-->
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
          <label>选课状态</label>
          <el-select v-model="listQuery['a.pub_flag01']" clearable placeholder="请选择">
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
        <el-table-column property="choseTaskName" show-overflow-tooltip min-width="160px" label="选课任务名称"/>
        <el-table-column property="pubFlag" label="排课状态" width="80px"></el-table-column>
        <el-table-column property="createDate" show-overflow-tooltip label="创建时间" width="150px">
          <template slot-scope="scope">
            <span>{{ scope.row.createDate | filterTime }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="155px" label="操作">
          <template slot-scope="scope">
            <div class="table-btns">
              <el-button type="primary" size="mini" plain @click="editXk(scope.row)">修改</el-button>
              <el-button type="danger" size="mini" @click="deleteXK(scope.row.choseRsId)" plain>删除</el-button>
              <el-button type="primary" size="mini" @click="analysisXK(scope.row.choseRsId)" plain>分析</el-button>
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
import { qryChoseCourseList, delChooseCourse } from '@/api/xkrw'
import { getTableBestRows, paramsToString } from '@/utils/businessUtil'
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  filters: {
    filterTime(val) {
      return moment(val).format('YYYY-MM-DD  hh:mm')
    }
  },
  data() {
    const h = 175
    const tableH = document.body.clientHeight - h
    const pageSizes = getTableBestRows(tableH)
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
    // 获取表格数据
    fetchData() {
      this.listLoading = true
      const params = Object.assign(this.listQuery, paramsToString(this.pageTot))
      qryChoseCourseList({ dataStr: JSON.stringify(params) }).then(res => {
        this.pageTotal = res.SUM
        this.tableData = res.DATA
        this.listLoading = false
      })
    },
    // 新增按钮
    addBtn() {
      if (sessionStorage) {
        sessionStorage.setItem(
          'local_curYear',
          this.listQuery['a.school_year01']
        )
        sessionStorage.setItem('local_curTerm', this.listQuery['a.term_code01'])
        sessionStorage.removeItem('local_arrangeId') // choseRsId
        sessionStorage.removeItem('arrangeName') // choseTastName
        this.$store.commit('SET_ARRANGENAME', '')
      }
      this.$router.push({ name: 'Xksz' })
    },
    // 查询按钮
    queryBtn() {
      this.fetchData()
    },
    // 删除按钮
    deleteXK(choseRsId) {
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await delChooseCourse({ choseRsId })
          this.$message.success('删除成功')
          // 重新加载数据
          this.pageTot.currentPage = 1
          this.queryBtn()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 修改按钮
    editXk(row) {
      const { schoolYear, termCode, choseRsId, choseTastName } = row
      if (sessionStorage) {
        sessionStorage.setItem('local_curYear', schoolYear)
        sessionStorage.setItem('local_curTerm', termCode)
        sessionStorage.setItem('local_arrangeId', choseRsId) // choseRsId
        const nameStr = `${schoolYear} - ${+schoolYear + 1} 学年,第 ${
          +termCode === 1 ? '一' : '二'
        } 学期 , ${choseTastName}`
        sessionStorage.setItem('arrangeName', nameStr) // choseTastName
        this.$store.commit('SET_ARRANGENAME', nameStr)
      }
      this.$router.push({ name: 'Xksz' })
    },
    // 分析按钮
    analysisXK() {},
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
</style>
