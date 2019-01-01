<template>
  <!-- 走班教室 tab页-->
  <div>
    <div v-area>
      <condition>
        <div class="condition">
          <label>课程分类</label>
          <el-cascader expand-trigger="hover" :options="courseOptions" clearable v-model="choosedCourse" :props="selectProps"></el-cascader>
        </div>
        <div class="condition">
          <label>教室名称</label>
          <el-input v-model="search['a.room_name06']" clearable></el-input>
        </div>
      </condition>
      <operation>
        <el-button type="primary" @click="fetchData">查询</el-button>
        <el-button type="primary" @click="addBtn">增加</el-button>
        <el-button type="primary" @click="editBtn">修改</el-button>
        <el-button type="primary" @click="deleteBtn">删除</el-button>
      </operation>
    </div>
    <div class="table-wapper">
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" highlight-current-row style="width: 100%" @current-change="tableCurrentChange">
        <el-table-column type="index" width="55" label="序号" fixed></el-table-column>
        <el-table-column label="教学楼" property="buildingName" width="130" fixed></el-table-column>
        <el-table-column label="教室名称" property="roomName" width="130" fixed></el-table-column>
        <el-table-column label="可上课门数" property="number" width="100" fixed></el-table-column>
        <el-table-column label="课程组合" property="allNameGroup"></el-table-column>
      </el-table>
    </div>
    <!-- 新增修改弹窗-->
    <el-dialog :title="editDialogTitle" :visible.sync="editDialogFormVisible" width="700px">
      <el-form :model="editForm" :rules="editRules" ref="ruleFormRef" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="教学楼" prop="buildingName">
              <el-input v-model.trim="editForm.buildingName" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="教室名称" prop="roomName">
              <el-input v-model.trim="editForm.roomName" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="可上课程">
              <el-checkbox v-model="selectAll" @change="checkbokAllChange">全选</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="选课">
              <div v-for="course in courseOptions" :key="course.courseId">
                <div>{{ course.courseName }}</div>
                <el-checkbox-group v-model="layersData[course.courseId]" @change="checkboxGroupChange">
                  <el-checkbox :label="layer.layerId" v-for="layer in course.layersList" :key="layer.layerId">{{ layer.courseLayerName }}</el-checkbox>
                </el-checkbox-group>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEditDialog">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getCourseOptions,
  getZbClassroomListInfo,
  getZbClassroomInfo,
  delClassRoomById,
  saveAddArrangeClassRoom
} from '@/api/pkcx'
import { setDatas } from '@/utils/businessUtil'
const initSearch = {
  'a.arrange_id01': '',
  'a.room_name06': '',
  'a.all_name_group06': '',
  currentPage: '1',
  pageSize: '1000'
}
export default {
  data() {
    return {
      initArea: false,
      search: {
        ...initSearch
      },
      courseOptions: [], // 课程分类选项
      choosedCourse: [],
      selectProps: {
        value: 'allName',
        label: 'allName',
        children: 'layersList'
      },
      currentRow: null, // 表格当前选中行
      tableData: [],
      // 表格高度
      height: document.body.clientHeight - 365,
      // 新增修改弹窗的显示和隐藏
      editDialogFormVisible: false,
      // 新增修改弹窗的标题
      editDialogTitle: '',
      selectAll: true, // 全选
      layersData: {}, // 选中分层
      // 表单数据
      editForm: {
        arrangeId: '',
        buildingName: '',
        roomName: ''
      },
      // 表单规则
      editRules: {
        buildingName: [
          { required: true, message: '请输入教学楼', trigger: 'blur' }
        ],
        roomName: [
          { required: true, message: '请输入教室名称', trigger: 'blur' }
        ]
      },
      // 行政班数据
      xzbOptions: [],
      // 学生分层及课时数据
      sbjestClass: []
    }
  },
  computed: {
    arrangeId() {
      return this.$route.query.arrangeId
    }
  },
  created() {
    this.editForm.arrangeId = this.arrangeId
    this.fetchCourseOption() // 课程分类
    this.fetchData()
  },
  methods: {
    tableCurrentChange(val) {
      this.currentRow = val
    },
    // 全选点击
    checkbokAllChange(val) {
      if (val) {
        this.courseOptions.forEach(item => {
          item.layersList.forEach(layer => {
            this.layersData[item.courseId].push(layer.layerId)
          })
        })
      } else {
        this.courseOptions.forEach(item => {
          this.layersData[item.courseId] = []
        })
      }
    },
    checkboxGroupChange(val) {
      const len = this.courseOptions.length
      let selectAllFlag = true
      for (let i = 0; i < len; i++) {
        const course = this.courseOptions[i]
        if (
          this.layersData[course.courseId].length < course.layersList.length
        ) {
          selectAllFlag = false
          break
        } else {
          continue
        }
      }
      this.selectAll = selectAllFlag
    },
    // 课程分类
    async fetchCourseOption() {
      const res = await getCourseOptions({ arrangeId: this.arrangeId })
      res.DATA.forEach(item => {
        Object.assign(item, { allName: item.courseName })
      })
      res.DATA.forEach(item => {
        this.$set(this.layersData, item.courseId, [])
      })
      this.courseOptions = res.DATA
      this.checkbokAllChange(true)
    },
    // 获取表格数据
    async fetchData() {
      Object.assign(this.search, {
        'a.arrange_id01': this.arrangeId,
        'a.all_name_group06': this.choosedCourse.length
          ? this.choosedCourse[1]
          : ''
      })
      const res = await getZbClassroomListInfo({
        dataStr: JSON.stringify(this.search)
      })
      this.tableData = res.DATA
    },
    // 新增按钮
    addBtn() {
      this.editDialogFormVisible = true
      this.editDialogTitle = '新增走班教室'
    },
    // 修改按钮
    async editBtn(id) {
      if (!this.currentRow) {
        this.$message.info('请选择要修改的数据')
        return
      }
      this.editDialogFormVisible = true
      this.editDialogTitle = '修改走班教室'
      setDatas(this.editForm, this.currentRow)
      await getZbClassroomInfo()
      console.log(this.layersData)
    },
    // 删除按钮
    deleteBtn() {
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
          await delClassRoomById({ roomId: this.currentRow.roomId })
          this.$message.success('删除成功')
          Object.assign(this.search, initSearch)
          this.choosedCourse = []
          this.fetchData()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 修改、新增弹窗中的保存按钮
    saveEditDialog() {
      this.$refs['ruleFormRef'].validate(async valid => {
        if (valid) {
          let continueFlag = 0
          Object.keys(this.layersData).forEach(key => {
            continueFlag += this.layersData[key].length
          })
          if (!continueFlag) {
            this.$message.warning('请选择选课')
            return
          }
          if (this.editDialogTitle === '新增走班教室') {
            const layerIdStrArr = []
            Object.keys(this.layersData).forEach(key => {
              layerIdStrArr.push(this.layersData[key].join(','))
            })
            const layerIdStr = {
              layerIdStr: layerIdStrArr.filter(item => item.length).join(',')
            }
            await saveAddArrangeClassRoom({
              ...this.editForm,
              ...layerIdStr
            })
            this.$message.success('保存成功')
            Object.assign(this.search, initSearch)
            this.choosedCourse = []
            this.fetchData()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.deleteBtn {
  color: red;
}
.table-wapper {
  border: 1px solid #dddddd;
  margin: 10px 0;
}
</style>

