<template>
  <!-- 学科分层及课时 tab页-->
  <div>
    <div>
      <condition>
        <div class="condition">
          <label>课程名称</label>
          <el-select v-model="search['courseId']" clearable @change="fetchData">
            <el-option v-for="(item,index) in courseOptions" :key="index" :label="item.courseName" :value="item.courseId"></el-option>
          </el-select>
        </div>
      </condition>
      <operation>
        <el-button type="primary" @click="addBtn">增加</el-button>
        <el-button type="primary" @click="editBtn">修改</el-button>
        <el-button type="primary" @click="deleteBtn">删除</el-button>
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
        <el-button type="primary" @click="saveBtn">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getSbjestClassListInfo,
  getlayerCourseName,
  qrylayerInfo
} from '@/api/pkcx'
import { validEditBtn, resetForm } from '@/utils/businessUtil'

export default {
  data() {
    return {
      // 表格数据
      tableData: [],
      search: {
        courseId: ''
      },
      // 课程名称下拉菜单数据
      courseOptions: [],
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
      // 表单数据
      formData: {
        layerId: '',
        arrangeId: '',
        courseId: '',
        courseName: '',
        courseLayerName: '',
        dispSeq: 0,
        sumWeekClass: 0
      }
    }
  },
  created() {
    this.fetchData()
    this.getCourseName()
  },
  methods: {
    // 获取表格数据
    async fetchData() {
      const res = await getSbjestClassListInfo({
        arrangeId: this.$route.query.arrangeId,
        courseId: this.search.courseId
      })
      this.tableData = res.DATA
    },
    // 课程名称下拉列表数据
    async getCourseName() {
      const res = await getlayerCourseName({
        arrangeId: this.$route.query.arrangeId
      })
      this.courseOptions = res.DATA
    },
    // 新增按钮
    addBtn() {
      this.dialogFormVisible = true
      this.dialogTitle = '新增'
      resetForm(this.formData)
      this.formData.arrangeId = this.$route.query.arrangeId
      console.log(this.formData.arrangeId)
    },
    // 修改按钮
    async editBtn() {
      if (!validEditBtn(this)) return
      const res = await qrylayerInfo({
        layerId: this.multipleSelection[0].layerId
      })
      this.formData = res.DATA
    },
    // 弹窗中的保存按钮
    saveBtn() {
      this.$refs['ruleForm'].validate(async valid => {
        if (valid) {
          const res = await qrylayerInfo(
            Object.assign(this.formData, { a: '1' })
          )
          if (res.SUCCESS) {
            this.fetchData()
            this.getCourseName()
          }
          this.$message({
            type: res.SUCCESS ? 'success' : 'error',
            message: res.SUCCESS ? '保存成功!' : '保存失败'
          })
          if (this.dialogTitle === '修改') {
            this.dialogFormVisible = false
          } else {
            if (res.SUCCESS) {
              resetForm(this.formData)
            }
          }
        } else {
          return false
        }
      })
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
        ids.push(item.layerId)
      })
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await qrylayerInfo({
            layerId: ids.join(','),
            arrangeId: this.$route.query.arrangeId,
            a: '2'
          })
          this.$message({
            type: res.SUCCESS ? 'success' : 'error',
            message: res.SUCCESS ? '删除成功!' : '删除失败'
          })
          // 重新加载数据
          if (res.SUCCESS) {
            this.fetchData()
            this.getCourseName()
          }
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

