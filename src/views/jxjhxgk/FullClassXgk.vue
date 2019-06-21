<template>
  <div>
    <!-- 新高考排课-教学计划-走班教室(全走班) -->
    <div class="opera-area">
      <div class="tip">
        <label>温馨提示：</label>
        选课总人数{{ tip.stuSelCount }}人，原行政班每班大概XX人，至少需要{{ tip.needRoomCount }}间教室
      </div>
      <operation class="btns">
        <el-button type="primary" plain @click="addBtn" :disabled="btnDisabled">增加</el-button>
        <el-button type="primary" plain @click="editBtn" :disabled="btnDisabled">修改</el-button>
        <el-button type="primary" plain @click="deleteBtn" :disabled="btnDisabled">删除</el-button>
      </operation>
    </div>
    <div class="data-area table-outer">
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" highlight-current-row style="width: 100%" v-loading="loading" @current-change="tableCurrentChange">
        <el-table-column type="index" width="55" label="序号"></el-table-column>
        <el-table-column label="教室名称" property="roomName"></el-table-column>
        <el-table-column label="所在位置" property="buildingName"></el-table-column>
        <el-table-column label="可容纳人数" property="canHoldCount" width="130"></el-table-column>
        <el-table-column label="其他说明" property="otherDesc" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <!-- 新增修改弹窗-->
    <el-dialog :title="editDialogTitle" :visible.sync="editDialogFormVisible" width="500px">
      <el-form :model="editForm" :rules="editRules" ref="ruleFormRef" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="教室名称" prop="roomName">
              <el-input v-model.trim="editForm.roomName" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="所在位置" prop="buildingName">
              <el-input v-model.trim="editForm.buildingName" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="可容纳人数" prop="canHoldCount">
              <el-input v-model.trim="editForm.canHoldCount" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="其他说明">
              <el-input v-model.trim="editForm.otherDesc" clearable type="textarea" rows="6" placeholder="请输入内容" resize="none"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button plain @click="editDialogFormVisible = false">取 消</el-button>
        <el-button plain type="primary" @click="saveEditDialog">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { qryArrangeDetail } from '@/api/pkcx'
import {
  qryMoveClassRoomList,
  qryTeachingRoom,
  inUpTeachingRoom,
  delTeachingRoom
} from '@/api/jxjhXgk'
import { setDatas } from '@/utils/businessUtil'
const arrangeId = sessionStorage.getItem('local_arrangeId')
const initSearch = {
  'a.arrange_id01': arrangeId,
  currentPage: '1',
  pageSize: '1000'
}
const initFormData = () => ({
  arrangeId: arrangeId,
  buildingName: '',
  roomName: '',
  canHoldCount: null,
  otherDesc: null,
  schoolId: null
})
export default {
  data() {
    return {
      loading: false,
      btnDisabled: false,
      arrangeId,
      search: {
        ...initSearch
      },
      currentRow: null, // 表格当前选中行
      tableData: [],
      tip: {}, // 表格顶部提示信息
      // 表格高度
      // 新增修改弹窗的显示和隐藏
      editDialogFormVisible: false,
      // 新增修改弹窗的标题
      editDialogTitle: '',
      // 表单数据
      editForm: {
        ...initFormData()
      },
      // 表单规则
      editRules: {
        buildingName: [
          { required: true, message: '请输入所在位置', trigger: 'blur' }
        ],
        roomName: [
          { required: true, message: '请输入教室名称', trigger: 'blur' }
        ],
        canHoldCount: [
          { required: true, message: '请输入可容纳人数', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.editForm.arrangeId = this.arrangeId
    this.getBaseInfo()
    this.fetchData() // 获取表格数据
  },
  methods: {
    tableCurrentChange(val) {
      this.currentRow = val
    },
    // 获取基础信息数据
    async getBaseInfo() {
      const res = await qryArrangeDetail({
        arrangeId: this.arrangeId
      })
      const { stepArrangeState } = res.DATA
      this.btnDisabled = +stepArrangeState > 5
    },
    // 获取表格数据
    async fetchData() {
      Object.assign(this.search)
      this.loading = true
      const res = await qryMoveClassRoomList({
        dataStr: JSON.stringify(this.search)
      }).finally(() => {
        this.loading = false
      })
      const { DATA, stuSelCount, needRoomCount } = res
      this.tableData = DATA
      this.tip = { stuSelCount, needRoomCount }
    },
    addBtn() {
      Object.assign(this.editForm, initFormData())
      this.editDialogTitle = '新增'
      this.editDialogFormVisible = true
    },
    async editBtn() {
      if (!this.currentRow) {
        this.$message.info('请选择要修改的数据')
        return
      }
      const { roomId } = this.currentRow
      const res = await qryTeachingRoom({ roomId })
      setDatas(this.editForm, res.DATA)

      this.editDialogFormVisible = true
      this.editDialogTitle = '修改'
    },
    async deleteBtn() {
      if (!this.currentRow) {
        this.$message.info('请选择要删除的数据')
        return
      }

      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { roomId } = this.currentRow
          await delTeachingRoom({ roomId })
          this.$message.success('删除成功')
          this.fetchData() // 获取表格数据
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    saveEditDialog() {
      this.$refs['ruleFormRef'].validate(async valid => {
        if (valid) {
          const params = {
            ...this.editForm
          }
          if (this.editDialogTitle === '修改') {
            params.roomId = this.currentRow.roomId
          }
          await inUpTeachingRoom(params)
          if (this.editDialogTitle === '修改') {
            this.editDialogFormVisible = false
          }
          this.$message.success('保存成功')
          this.fetchData() // 获取表格数据
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
div.tip {
  display: inline-block;
}
</style>
