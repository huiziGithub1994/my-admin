<template>
  <!-- 排课查询页面-->
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
          <label>排课状态</label>
          <el-select v-model="listQuery['curStatus']" clearable placeholder="请选择">
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
        <el-table-column property="arrangName" show-overflow-tooltip min-width="160px" label="排课名称"/>
        <el-table-column property="name" label="状态" width="80px">
          <template slot-scope="scope">
            <span :class="{'success': scope.row.name === '完成','primary':scope.row.name === '进行中','danger':scope.row.name === '冲突'}">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column property="schoolYear" width="120px" label="学年">
          <template slot-scope="scope">
            <span>{{ `${scope.row.schoolYear} 学年` }}</span>
          </template>
        </el-table-column>
        <el-table-column property="termCode" label="学期" width="80px"></el-table-column>
        <el-table-column property="gradeCode" label="年级"/>
        <el-table-column property="createTime" show-overflow-tooltip label="创建时间"/>
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
    <el-dialog title="新增排课任务" :visible.sync="dialogFormVisible" width="450px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px">
        <el-form-item label="学年/学期">
          <div class="text-red">{{ listQuery.schoolYear }}-{{ Number(listQuery.schoolYear)+1 }}学年第{{ listQuery.termCode==='1' ? '一' : '二' }}学期</div>
        </el-form-item>
        <el-form-item label="排课任务名称" prop="arrangName">
          <el-input v-model="ruleForm.arrangName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveBtn">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPKCXListInfo, qryArrangeDetail } from '@/api/pkcx'
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
      tableData: [],
      // 表单
      ruleForm: {},
      rules: {
        arrangName: {
          required: true,
          message: '请输入排课任务名称',
          trigger: 'blur'
        }
      },
      dialogFormVisible: false
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
    // 保存按钮
    saveBtn() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          const queryParams = { arrangeId: '100' }
          this.$router.push({ name: 'JxjhPt', query: queryParams })
        } else {
          return false
        }
      })
    },
    // 新增按钮
    addBtn() {
      this.dialogFormVisible = true
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
          const res = await qryArrangeDetail({ arrangeId: arrangeId, a: '2' })
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
      const queryParams = { arrangeId }
      this.$router.push({ name: 'JxjhPt', query: queryParams })
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
