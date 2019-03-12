<template>
  <div>
    <p class="tip">
      <label>温馨提示：</label>点击“开始自动分配”后，平台会按学生的选择结果进行教学分班，分班结果可以按“调整分班”对学生分班进行调整
    </p>
    <div v-area>
      <condition>
        <div class="condition">
          <label>教学班</label>
          <el-select v-model="listQuery['a.class_id01']" clearable placeholder="请选择">
            <el-option v-for="item in classesOption" :key="item.classId" :label="item.className" :value="item.classId"></el-option>
          </el-select>
        </div>
        <div class="condition">
          <label>学号</label>
          <el-input v-model.trim="listQuery['a.to_choose_id06']" clearable></el-input>
        </div>
        <div class="condition">
          <label>姓名</label>
          <el-input v-model.trim="listQuery['a.stu_name06']" clearable></el-input>
        </div>
      </condition>
      <operation class="btns">
        <el-button type="primary" plain @click="queryBtn">查询</el-button>
        <el-button type="primary" plain @click="changeClass">调整分班</el-button>
        <el-button type="primary" plain @click="slitClasses" :disabled="disabledBtn">开始自动分配</el-button>
      </operation>
    </div>
    <div>
      <el-table ref="singleTable" :data="tableData" :height="tableH" highlight-current-row style="width: 100%" v-loading="listLoading">
        <el-table-column type="index" width="50"/>
        <el-table-column property="className" show-overflow-tooltip label="教学班"/>
        <el-table-column property="stuName" label="学生姓名"></el-table-column>
        <el-table-column property="toChooseId" label="学号"></el-table-column>
        <el-table-column property="sex" label="性别"></el-table-column>
        <el-table-column property="adminClassName" label="行政班"/>
        <el-table-column property="teaName" show-overflow-tooltip label="任课教师"></el-table-column>
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
    <el-dialog title="调整分班" :visible.sync="dialogTableVisible" width="1200px" class="my-dialog">
      <el-row>
        <el-col :span="12">
          <div>
            <condition>
              <div class="condition">
                <label>学号</label>
                <el-input v-model.trim="leftListQuery['a.to_choose_id06']" clearable></el-input>
              </div>
              <div class="condition">
                <label>姓名</label>
                <el-input v-model.trim="leftListQuery['a.stu_name06']" clearable></el-input>
              </div>
            </condition>
            <operation>
              <el-button type="primary" plain @click="leftQuery">查询</el-button>
            </operation>
          </div>
          <div class="leftTable">
            <el-table :data="leftTable" :height="400" highlight-current-row style="width: 100%" @current-change="leftTableCurrentChange">
              <el-table-column type="index" width="30"/>
              <el-table-column property="stuName" label="学生姓名" width="80"></el-table-column>
              <el-table-column property="toChooseId" label="学号"></el-table-column>
              <el-table-column property="adminClassName" label="行政班"/>
              <el-table-column property="className" show-overflow-tooltip label="教学班"/>
            </el-table>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="btns-block">
            <el-button :type="disabledToRightBtn ? 'info':'primary'" :plain="disabledToRightBtn" :disabled="disabledToRightBtn" @click="toRightBtn">
              <i class="el-icon-arrow-right"></i>
              <i class="el-icon-arrow-right"></i>
            </el-button>
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <condition>
              <div class="condition">
                <label>教学班</label>
                <el-select v-model="rightTableQueryValue" clearable placeholder="请选择">
                  <el-option v-for="item in classesOption" :key="item.classId" :label="item.className" :value="item.classId"></el-option>
                </el-select>
              </div>
            </condition>
          </div>
          <div class="leftTable">
            <el-table :data="rightTable" :height="400" highlight-current-row style="width: 100%">
              <el-table-column type="index" width="30"/>
              <el-table-column property="stuName" label="学生姓名" width="80"></el-table-column>
              <el-table-column property="toChooseId" label="学号"></el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { getTableBestRows, paramsToString } from '@/utils/businessUtil'
import {
  qryTeachingClassInfoDetails,
  saveTeaClassRelyStu,
  qryTeachingClassList,
  arrangeStuChange
} from '@/api/pkgz'
export default {
  data() {
    const h = 330
    const tableH = document.body.clientHeight - h
    const pageSizes = getTableBestRows(tableH)
    return {
      disabledBtn: false, // 开始自动分配的禁用
      listLoading: false, // 表格loading
      arrangeId: sessionStorage.getItem('local_arrangeId'),
      // 表格查询参数
      listQuery: {
        'a.arrange_Id01': sessionStorage.getItem('local_arrangeId'),
        'a.to_choose_id06': '',
        'a.class_id01': '',
        'a.stu_name06': ''
      },
      classesOption: [], // 教学班下拉列表数据
      pageSizes: pageSizes,
      tableH: tableH,
      pageTot: {
        currentPage: 1,
        pageSize: pageSizes[0]
      },
      pageTotal: 0,
      tableData: [], // 教学班表格数据
      // 弹窗数据
      dialogTableVisible: false, // 调整分班弹窗
      leftListQuery: {
        'a.arrange_Id01': sessionStorage.getItem('local_arrangeId'),
        'a.to_choose_id06': '',
        'a.stu_name06': ''
      },
      leftTable: [],
      rightTable: [],
      // 选中的教学班
      rightTableQueryValue: '',
      disabledToRightBtn: true,
      leftCurrentRow: undefined
    }
  },
  watch: {
    rightTableQueryValue() {
      this.rightTable = []
    },
    leftCurrentRow(val) {
      if (val) {
        this.disabledToRightBtn = false
      } else {
        this.disabledToRightBtn = true
      }
    }
  },
  created() {
    // 教学班下拉列表
    this.getClassesOption()
    this.fetchData()
  },
  methods: {
    // 教学班下拉列表
    async getClassesOption() {
      const res = await qryTeachingClassList({ arrangeId: this.arrangeId })
      this.classesOption = res.DATA
    },
    initSearch() {
      Object.assign(this.listQuery, {
        'a.to_choose_id06': '',
        'a.class_id01': '',
        'a.stu_name06': ''
      })
    },
    queryBtn() {
      this.pageTot.currentPage = 1
      this.fetchData()
    },
    // 获取表格数据
    fetchData() {
      this.listLoading = true
      const params = Object.assign(
        {},
        this.listQuery,
        paramsToString(this.pageTot)
      )
      qryTeachingClassInfoDetails({ dataStr: JSON.stringify(params) }).then(
        res => {
          this.pageTotal = res.NUM
          this.tableData = res.DATA
          if (this.tableData.length === 0 && !this.disabledBtn) {
            this.$notify({
              title: '提示',
              duration: 0,
              message: this.$createElement(
                'i',
                { style: 'color: teal' },
                '请点击“开始自动分配”按钮，为学生分班'
              )
            })
          } else {
            this.disabledBtn = true
          }
          this.listLoading = false
        }
      )
    },
    // 开始自动分配按钮
    async slitClasses() {
      await saveTeaClassRelyStu({ arrangeId: this.arrangeId })
      this.initSearch()
      this.fetchData()
    },
    // 调整分班
    changeClass() {
      this.rightTable = []
      this.dialogTableVisible = true
    },
    // 弹窗查询按钮
    leftQuery() {
      if (
        this.leftListQuery['a.to_choose_id06'] === '' &&
        this.leftListQuery['a.stu_name06'] === ''
      ) {
        this.$message.warning('请输入查询条件')
        this.leftTable = []
        return
      }
      const params = Object.assign(
        {
          pageSize: '1000',
          currentPage: '1'
        },
        this.leftListQuery
      )
      qryTeachingClassInfoDetails({ dataStr: JSON.stringify(params) }).then(
        res => {
          this.leftTable = res.DATA
        }
      )
    },
    // 左边表格当前行改变时
    leftTableCurrentChange(row) {
      this.leftCurrentRow = row
    },
    async toRightBtn() {
      if (!this.rightTableQueryValue) {
        this.$message.warning('请选择教学班')
        return
      }
      // 服务端转移
      const { classId, arrangeId, toChooseId } = this.leftCurrentRow
      if (classId === this.rightTableQueryValue) {
        this.$message.warning('请不要选择该学生所在的教学班')
        return
      }
      await arrangeStuChange({
        layerClassId: classId,
        arrangeId,
        toChooseId,
        newLayerClassId: this.rightTableQueryValue
      })
      this.$message.success('调整分班成功')
      this.queryBtn()
      // 本地转移
      this.rightTable.push({ ...this.leftCurrentRow })
      const len = this.leftTable.length
      for (let i = 0; i < len; i++) {
        if (this.leftTable[i].toChooseId === this.leftCurrentRow.toChooseId) {
          this.leftTable.splice(i, 1)
          break
        }
      }
      this.leftCurrentRow = undefined
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
.tip {
  margin: 10px 0;
}
.btns-block {
  height: 440px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: Center;
  > button {
    width: 100px;
  }
}
.leftTable {
  margin-top: 10px;
  border: 1px solid #dddddd;
}
</style>
