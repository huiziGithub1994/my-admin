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
        <el-button type="primary" plain @click="queryBtn">查询</el-button>
        <el-button type="primary" plain @click="addBtn">新增</el-button>
        <el-button type="primary" plain>合并课表</el-button>
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
        <el-table-column property="createDate" show-overflow-tooltip label="创建时间" width="150px">
          <template slot-scope="scope">
            <span>{{ scope.row.createDate | filterTime }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="120px" label="操作">
          <template slot-scope="scope">
            <div class="table-btns">
              <el-button type="primary" size="mini" @click="arrangeClass(scope.row)" plain>排课</el-button>
              <el-button type="danger" size="mini" @click="deleteClass(scope.row.arrangeId)" plain>删除</el-button>
              <!-- <el-button type="primary" size="mini" plain>复制</el-button> -->
            </div>
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="450px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px">
        <el-form-item label="学年/学期">
          <div class="text-red">{{ ruleForm.schoolYear }}-{{ Number(ruleForm.schoolYear)+1 }}学年 第{{ ruleForm.termCode==='1' ? '一' : '二' }}学期</div>
        </el-form-item>
        <el-form-item label="排课任务名称" prop="arrangeName">
          <el-input v-model="ruleForm.arrangeName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button plain @click="dialogFormVisible = false">取 消</el-button>
        <el-button plain type="primary" @click="saveBtn">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPKCXListInfo, saveArrange, delArrange } from '@/api/pkcx'
import { getTableBestRows } from '@/utils/businessUtil'
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
  filters: {
    filterTime(val) {
      return moment(val).format('YYYY-MM-DD  HH:mm')
    }
  },
  data() {
    const h = 185
    const tableH = document.body.clientHeight - h
    const pageSizes = getTableBestRows(tableH)
    return {
      listLoading: true,
      listQuery: {
        'a.arrange_type01': '1',
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
      tableData: [],
      // 表单
      dialogTitle: '新增排课任务',
      ruleForm: {
        arrangeName: '',
        schoolYear: '',
        termCode: ''
      },
      rules: {
        arrangeName: {
          required: true,
          message: '请输入排课任务名称',
          trigger: 'blur'
        }
      },
      dialogFormVisible: false
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
      const params = Object.assign(this.listQuery, this.pageTot)
      getPKCXListInfo(params).then(res => {
        this.pageTot.pageTotal = res.NUM
        this.tableData = res.DATA
        this.listLoading = false
      })
    },
    // 新增按钮
    addBtn() {
      this.dialogFormVisible = true
      Object.assign(this.ruleForm, {
        schoolYear: this.curYear,
        termCode: this.curTerm,
        arrangeName: ''
      })
    },
    // 保存按钮
    saveBtn() {
      this.$refs['ruleForm'].validate(async valid => {
        if (valid) {
          const params = Object.assign({ arrangeType: '1' }, this.ruleForm)
          await saveArrange(params)
          this.$message.success('保存成功')
          this.queryBtn()
          this.dialogFormVisible = false
          if (this.dialogTitle === '新增排课任务') {
            this.clearStorage()
          }
        } else {
          return false
        }
      })
    },
    clearStorage() {
      sessionStorage.removeItem('local_curYear')
      sessionStorage.removeItem('local_curTerm')
      sessionStorage.removeItem('local_arrangeId')
      sessionStorage.removeItem('gradeStr')
      sessionStorage.removeItem('arrangeName')
      this.$store.commit('SET_ARRANGENAME', '')
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
          const res = await delArrange({ arrangeId: arrangeId })
          this.$message({
            type: res.SUCCESS ? 'success' : 'error',
            message: res.SUCCESS ? '删除成功!' : '删除失败'
          })
          // 重新加载数据
          if (res.SUCCESS) {
            this.queryBtn()
            if (arrangeId === sessionStorage.getItem('local_arrangeId')) {
              this.clearStorage()
            }
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 排课按钮
    arrangeClass(row) {
      const { schoolYear, termCode, arrangeId, arrangeName, gradeStr } = row
      if (sessionStorage) {
        sessionStorage.setItem('local_curYear', schoolYear)
        sessionStorage.setItem('local_curTerm', termCode)
        sessionStorage.setItem('local_arrangeId', arrangeId)
        gradeStr && sessionStorage.setItem('gradeStr', gradeStr)
        const nameStr = `${schoolYear} - ${+schoolYear + 1} 学年,第 ${
          +termCode === 1 ? '一' : '二'
        } 学期 , ${arrangeName}`
        sessionStorage.setItem('arrangeName', nameStr)
        this.$store.commit('SET_ARRANGENAME', nameStr)
      }
      this.$router.push({ name: 'SkrwPt' })
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
