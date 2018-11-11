<template><!-- 学科分层及课时 tab页-->
  <div>
    <div>
      <condition>
        <div class="condition">
          <label>课程分类</label>
          <selectChild v-model="search['type']" clearable tp="yearSelect"/>
        </div>
      </condition>
      <operation>
        <el-button type="primary" plain @click="addBtn">增加</el-button>
        <el-button type="primary" plain>修改</el-button>
        <el-button type="primary" plain>删除</el-button>
      </operation>
    </div>
    <div class="table-wapper">
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" highlight-current-row style="width: 100%">
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
      height: document.body.clientHeight - 365,
      dialogFormVisible: false,
      dialogTitle: '新增',
      rules: {
        courseName: { required: true, message: '请输入课程', trigger: 'blur' },
        courseLayerName: { required: true, message: '请输入分层名称', trigger: 'blur' },
        sumWeekClass: { required: true, message: '请输入课时(节/周)', trigger: 'blur' }
      },
      formData: {},
      search: {}
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
    // 新增按钮
    addBtn() {
      this.dialogFormVisible = true
      this.dialogTitle = '新增'
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

