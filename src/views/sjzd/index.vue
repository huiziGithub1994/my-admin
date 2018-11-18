<template lang="html">
  <div class="sjzd">
    <div v-area>
      <condition>
        <div class="condition">
          <label>名称</label>
          <el-input v-model="listQuery.dicName" placeholder="请输入名称" clearable></el-input>
        </div>
        <div class="condition">
          <label>所属KEY</label>
          <el-select v-model="listQuery.dicKey" filterable placeholder="请选择" clearable>
            <el-option v-for="item in keySelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
      </condition>
      <operation>
        <el-button type="primary" plain @click="queryBtn">查询</el-button>
        <el-button type="primary" plain @click="deleteBtn">删除</el-button>
        <el-button type="primary" plain @click="editBtn">修改</el-button>
        <el-button type="primary" plain @click="addBtn">新增</el-button>
      </operation>
    </div>
    <div class="sjzd-middle">
      <el-table ref="singleTable" stripe highlight-current-row :data="tabData" v-loading="loading" element-loading-text="拼命加载中" @selection-change="handleSelectionChange" style="width: 100%" :height="tableH">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="dicCode" label="代码" width="100"></el-table-column>
        <el-table-column prop="dicName" label="名称" width="230"></el-table-column>
        <el-table-column prop="dicKey" label="所属KEY" width="90"></el-table-column>
        <el-table-column prop="dicDesc" label="用途" show-overflow-tooltip></el-table-column>
        <el-table-column prop="dispOrder" label="显示顺序" align="center" width="80"></el-table-column>
        <el-table-column prop="createName" label="创建人" align="center" width="120"></el-table-column>
        <el-table-column prop="strCreateTime" label="创建时间" width="180" show-overflow-tooltip></el-table-column>
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="名称" prop="dicName">
          <el-input v-model="formData.dicName"></el-input>
        </el-form-item>
        <el-form-item label="代码" prop="dicCode">
          <el-input v-model="formData.dicCode"></el-input>
        </el-form-item>
        <el-form-item label="所属KEY" prop="dicKey">
          <el-input v-model="formData.dicKey"></el-input>
        </el-form-item>
        <el-form-item label="显示顺序" prop="dispOrder">
          <el-input v-model="formData.dispOrder"></el-input>
        </el-form-item>
        <el-form-item label="用途">
          <el-input type="textarea" v-model="formData.dicDesc"></el-input>
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
import { getKeyList } from '@/api/sjzd'
import { getTableBestRows, validEditBtn, resetForm } from '@/utils/businessUtil'

export default {
  data() {
    const h = 190
    const tableH = document.body.clientHeight - h
    const pageSizes = getTableBestRows(tableH)
    return {
      // 检索条件
      listQuery: {
        dicName: '',
        dicKey: ''
      },
      keySelect: [], // 所属KEY下拉选项
      pageSizes: pageSizes,
      tableH: tableH,
      pageTot: {
        curPage: 1,
        pageSize: pageSizes[0],
        pageTotal: 0
      },
      tabData: [], // 表格数据
      multipleSelection: [], // 表格选中项
      loading: false, // 表格显示加载中
      dialogTitle: '',
      dialogFormVisible: false, // 弹窗的显示和隐藏
      formData: {
        // 表单数据
        dicId: '',
        dicCode: '',
        dicName: '',
        dispOrder: '',
        dicKey: '',
        dicDesc: ''
      },
      rules: {
        // 表单规则
        dicCode: { required: true, message: '请输入代码', trigger: 'blur' },
        dicName: { required: true, message: '请输入名称', trigger: 'blur' },
        dispOrder: {
          required: true,
          message: '请输入显示顺序',
          trigger: 'blur'
        },
        dicKey: { required: true, message: '请输入所属KEY', trigger: 'blur' }
      }
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    // 检索按钮
    queryBtn() {
      this.pageTot.curPage = 1
      this.getTableData()
    },
    // 获取表格数据
    async getTableData() {
      this.loading = true
      const params = Object.assign(this.listQuery, this.pageTot)
      const res = await getKeyList(params)
      this.loading = false
      this.tabData = res.DATA
      this.pageTot.pageTotal = res.SUM
    },
    // 修改按钮
    editBtn() {
      validEditBtn(this)
    },
    // 弹窗中的保存按钮
    saveBtn() {
      this.$refs['ruleForm'].validate(async valid => {
        if (valid) {
          const res = await getKeyList(Object.assign(this.formData, { a: '1' }))
          if (res.SUCCESS) this.queryBtn()
          this.$message({
            type: res.SUCCESS ? 'success' : 'error',
            message: res.SUCCESS ? '保存成功!' : '保存失败'
          })
          if (this.dialogTitle === '修改') {
            this.dialogFormVisible = false
          } else {
            if (res.SUCCESS) {
              resetForm(this.formData)
              this.formData.dispOrder = this.pageTot.pageTotal + 1
            }
          }
        } else {
          return false
        }
      })
    },
    // 新增按钮
    addBtn() {
      this.dialogFormVisible = true
      this.dialogTitle = '新增'
      resetForm(this.formData)
      this.formData.dispOrder = this.pageTot.pageTotal + 1
    },
    // 删除按钮
    deleteBtn() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请选择要删除的数据',
          type: 'warning'
        })
        return
      }
      const ids = []
      this.multipleSelection.forEach(item => {
        ids.push(item.dicId)
      })
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await getKeyList({
            dicId: ids.join(','),
            a: '2'
          })
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSizeChange(val) {
      this.pageTot.curPage = 1
      this.pageTot.pageSize = val
      this.$nextTick(function() {
        this.getTableData()
      })
    },
    handleCurrentChange(val) {
      this.pageTot.curPage = val
      this.$nextTick(function() {
        this.getTableData()
      })
    }
  }
}
</script>

<style lang="css" scoped>
.mod-inner {
  width: 450px;
}
.lab-name {
  margin: 10px 0;
}
</style>
