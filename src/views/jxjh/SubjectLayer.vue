<template><!-- 学科分层及课时 tab页-->
  <div>
    <div>
      <condition>
        <div class="condition">
          <label>课程分类</label>
          <selectChild v-model="search['courseName']" clearable tp="yearSelect" @change="selectChange"/>
        </div>
      </condition>
      <operation>
        <el-button type="primary" plain @click="addBtn">增加</el-button>
        <el-button type="primary" plain @click="editBtn">修改</el-button>
        <el-button type="primary" plain @click="deleteBtn">删除</el-button>
      </operation>
    </div>
    <div class="table-wapper">
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" highlight-current-row style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"/>
        <el-table-column type="index" width="55" label="序号"></el-table-column>
        <el-table-column label="课程名称" property="courseName"></el-table-column>
        <el-table-column label="分层类型" property="courseLayerName"></el-table-column>
        <el-table-column label="周课时(节)" property="sumWeekClass"></el-table-column>
      </el-table>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="课程" prop="courseName">
          <el-input v-model="formData.courseName"></el-input>
        </el-form-item>
        <el-form-item label="分层名称" prop="courseLayerName">
          <el-input v-model="formData.courseLayerName"></el-input>
        </el-form-item>
        <el-form-item label="课时(节/周)" prop="sumWeekClass">
          <el-input-number v-model="formData.sumWeekClass" :min="1" :max="10"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getSbjestClassListInfo } from '@/api/pkcx'

export default {
  data() {
    return {
      tableData: [],
      multipleSelection: [], // 表格选中项
      height: document.body.clientHeight - 365,
      dialogFormVisible: false,
      dialogTitle: '新增',
      rules: {
        courseName: { required: true, message: '请输入课程', trigger: 'blur' },
        courseLayerName: {
          required: true,
          message: '请输入分层名称',
          trigger: 'blur'
        },
        sumWeekClass: {
          required: true,
          message: '请输入课时(节/周)',
          trigger: 'blur'
        }
      },
      formData: {},
      search: {
        courseName: ''
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取表格数据
    async fetchData() {
      const res = await getSbjestClassListInfo({
        arrangeId: this.$route.query.arrangeId
      })
      this.tableData = res.DATA
    },
    selectChange(val) {
      if (val === '') return
      console.log(val)
    },
    // 新增按钮
    addBtn() {
      this.dialogFormVisible = true
      this.dialogTitle = '新增'
      this.formData = {}
    },
    // 修改按钮
    editBtn() {
      const len = this.multipleSelection.length
      if (len === 0) {
        this.$message({
          message: '请选择要修改的数据',
          type: 'warning'
        })
        return
      }
      if (len > 1) {
        this.$message({
          message: '一次只能修改一条数据',
          type: 'warning'
        })
        return
      }
      this.dialogFormVisible = true
      this.dialogTitle = '修改'
      this.formData = this.multipleSelection[0]
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
        ids.push(item.arrangeId)
      })
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await getSbjestClassListInfo({
            arrangeId: ids.join(','),
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
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.operation-btns {
  overflow: hidden;
  margin-bottom: 10px;
  > div {
    float: right;
  }
}
.table-wapper {
  border: 1px solid #dddddd;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>

