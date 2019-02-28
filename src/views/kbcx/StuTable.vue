<template>
  <div>
    <div>
      <condition>
        <div class="condition">
          <label>学号</label>
          <el-input v-model.trim="search['a.stu_no01']" clearable></el-input>
        </div>
      </condition>
      <operation>
        <div class="checkboxGroup">
          <el-checkbox-group v-model="showType">
            <el-checkbox label="1">显示教室</el-checkbox>
            <el-checkbox label="2">显示时间</el-checkbox>
          </el-checkbox-group>
        </div>
        <el-button type="primary" plain @click="queryBtn">查询</el-button>
        <el-button type="primary" plain>下载</el-button>
      </operation>
    </div>
    <div v-loading="loading">
      <div class="pageBottom schedule-table" v-for="(tableData,index) in tableDatas" :key="index">
        <div class="teaTableName">
          <span>{{ tableData.stuName }}</span>学生的课表
        </div>
        <el-table ref="singleTable" :data="tableData.data" style="width:80%" border :cell-class-name="cellClassName">
          <el-table-column
            :property="index === 0 ? 'lessionSeq' : index-1+''"
            :label="item"
            v-for="(item,index) in colHeaders"
            :key="index"
            :width="index === 0 ? '100px':'auto'"
            :align="index === 0 ? 'center':'left'"
            header-align="center"
          >
            <template slot-scope="scope">
              <div v-if="index === 0">{{ scope.row.lessionSeq }}</div>
              <div v-else-if="Object.keys(scope.row[index-1]).length" class="scheduleCell hasClass">
                <div>{{ scope.row[index-1].cellValue }}</div>
                <div v-show="showType.length&&showType.includes('1')">{{ scope.row[index-1].cellPosition }}</div>
                <div v-show="showType.length&&showType.includes('2')">{{ scope.row[index-1].beginTime }}-{{ scope.row[index-1].endTime }}</div>
              </div>
              <template v-else>
                <div class="scheduleCell"></div>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import { stuTableInfoList } from '@/api/kbcx'
import { initTableData } from '@/utils/inlineEditTable'
export default {
  data() {
    return {
      loading: false,
      arrangeId: sessionStorage.getItem('local_arrangeId'),
      // 课程名称下拉菜单数据
      courseOptions: [],
      // 教师名称下拉菜单数据
      teacherOptions: [],
      showType: [],
      search: {
        'a.stu_no01': '',
        currentPage: '1',
        pageSize: '1000'
      },
      tableDatas: [],
      schedule: {},
      colHeaders: []
    }
  },
  methods: {
    queryBtn() {
      this.tableDatas = []
      this.getTeaSchedule()
    },
    async getTeaSchedule() {
      if (this.search['a.stu_no01'] === '') {
        this.$message.warning('请先输入查询条件')
        return
      }
      this.loading = true
      const res = await stuTableInfoList({
        arrangeId: this.arrangeId,
        dataStr: JSON.stringify(this.search)
      }).finally(() => {
        this.loading = false
      })
      this.schedule = res.DATA
      const { stuList } = this.schedule
      if (stuList.length === 0) {
        this.$message.info('未检索到数据')
        return
      }
      this.renderTable()
      this.loading = false
    },
    // 初始化表格的头部、行列、数据为空
    renderTable() {
      const baseHeader = ['节次/星期']
      const { colHeaders, defaultData } = initTableData(
        this.schedule,
        baseHeader,
        '2'
      )
      this.colHeaders = colHeaders
      const { stuList } = this.schedule
      stuList.forEach(item => {
        const theData = JSON.parse(JSON.stringify(defaultData))
        item.calFixList.forEach(cell => {
          const [row, col] = cell.cellKey.split(',').map(x => Number(x))
          theData[row][col] = cell
        })
        this.tableDatas.push({
          stuName: item.stuName,
          data: theData
        })
      })
    },
    // 表格单元添加样式
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (row[columnIndex - 1] && Object.keys(row[columnIndex - 1]).length) {
        return 'hasClass'
      }
      return ''
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.schedule-table .el-table__body tr > td.hasClass {
  background: #f5f7fa !important;
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
.checkboxGroup {
  display: inline-block;
  margin-right: 15px;
}
.pageBottom {
  margin-top: 15px;
  div.scheduleCell {
    // min-height: 60px;
  }
}
.teaTableName {
  margin-bottom: 5px;
  span {
    margin-right: 5px;
    color: #3887fe;
  }
}
</style>
