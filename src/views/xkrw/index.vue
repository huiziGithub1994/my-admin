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
        <el-button type="primary" plain @click="publicBtn">发布</el-button>
        <el-button type="primary" plain @click="queryBtn">查询</el-button>
        <el-button type="primary" plain @click="addBtn">新增</el-button>
      </operation>
    </div>
    <div>
      <el-table ref="singleTable" :data="tableData" :height="tableH" highlight-current-row style="width: 100%" @current-change="tableCurrentChange" v-loading="listLoading">
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
        <el-table-column fixed="right" width="155px" label="操作">
          <template slot-scope="scope">
            <div class="table-btns">
              <el-button type="primary" size="mini" plain @click="editXk(scope.row)">修改</el-button>
              <el-button type="danger" size="mini" @click="deleteXK(scope.row.choseRsId)" plain>删除</el-button>
              <el-button type="primary" size="mini" @click="analysisXK(scope.row)" plain>分析</el-button>
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
import { qryChoseCourseList, delChooseCourse, pubChoseTask } from '@/api/xkrw'
import { getTableBestRows, paramsToString } from '@/utils/businessUtil'
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  filters: {
    filterTime(val) {
      return moment(val).format('YYYY-MM-DD  HH:mm')
    }
  },
  data() {
    const h = 175
    const tableH = document.body.clientHeight - h
    const pageSizes = getTableBestRows(tableH)
    return {
      listLoading: false,
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
    // 获取表格数据
    fetchData() {
      this.listLoading = true
      const params = Object.assign(this.listQuery, paramsToString(this.pageTot))
      qryChoseCourseList({ dataStr: JSON.stringify(params) }).then(res => {
        this.pageTotal = res.NUM
        this.tableData = res.DATA
        this.listLoading = false
      })
    },
    // 发布按钮
    async publicBtn() {
      if (!this.currentRow) {
        this.$message.info('请选择要发布的数据')
        return
      }
      const res = await pubChoseTask({ choseRsId: this.currentRow.choseRsId })
      if (res.SUCCESS) {
        this.$message.success('选课任务发布成功')
      }
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
      this.pageTot.currentPage = 1
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
      const { schoolYear, termCode, choseRsId, choseTaskName } = row
      if (sessionStorage) {
        sessionStorage.setItem('local_curYear', schoolYear)
        sessionStorage.setItem('local_curTerm', termCode)
        sessionStorage.setItem('local_arrangeId', choseRsId) // choseRsId
        const nameStr = `${schoolYear} - ${+schoolYear + 1} 学年,第 ${
          +termCode === 1 ? '一' : '二'
        } 学期 , ${choseTaskName}`
        sessionStorage.setItem('arrangeName', nameStr) // choseTaskName
        this.$store.commit('SET_ARRANGENAME', nameStr)
      }
      this.$router.push({ name: 'Xksz' })
    },
    // 分析按钮
    analysisXK(row) {
      const { schoolYear, termCode, choseRsId, choseTaskName } = row
      const nameStr = `${schoolYear} - ${+schoolYear + 1} 学年,第 ${
        +termCode === 1 ? '一' : '二'
      } 学期 , ${choseTaskName}`
      sessionStorage.setItem('arrangeName', nameStr) // choseTaskName
      this.$store.commit('SET_ARRANGENAME', nameStr)
      sessionStorage.setItem('local_arrangeId', choseRsId)
      this.$router.push({ name: 'Xkfx' })
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
<style rel="stylesheet/scss" lang="scss" scoped>
</style>
