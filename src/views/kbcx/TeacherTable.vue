<template>
  <div>
    <div>
      <condition>
        <div class="condition">
          <label>课程名称</label>
          <el-select v-model="search['a.course_id01']" clearable>
            <el-option v-for="(item,index) in courseOptions" :key="index" :label="item.courseName" :value="item.courseId"></el-option>
          </el-select>
        </div>
        <div class="condition">
          <label>教师名称</label>
          <el-input v-model.trim="search['a.tea_name06']" clearable></el-input>
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
          <span>{{ tableData.teaName }}</span>老师的课表
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
import { getlayerCourseName } from '@/api/pkcx'
import { teaTableInfoList } from '@/api/kbcx'
import { initTableData } from '@/utils/inlineEditTable'
export default {
  data() {
    return {
      loading: false,
      arrangeId: sessionStorage.getItem('local_arrangeId'),
      // 课程名称下拉菜单数据
      courseOptions: [],
      showType: [],
      search: {
        'a.course_id01': '',
        'a.tea_name06': '',
        currentPage: '1',
        pageSize: '1000'
      },
      tableDatas: [],
      schedule: {},
      colHeaders: []
    }
  },
  created() {
    this.getCourseName()
  },
  methods: {
    queryBtn() {
      this.tableDatas = []
      this.getTeaSchedule()
    },
    // 课程名称下拉列表数据
    async getCourseName() {
      const res = await getlayerCourseName({
        arrangeId: this.arrangeId
      })
      this.courseOptions = res.DATA
    },
    async getTeaSchedule() {
      if (
        this.search['a.course_id01'] === '' ||
        this.search['a.tea_name06'] === ''
      ) {
        this.$message.warning('请先输入查询条件')
        return
      }
      this.loading = true
      const res = await teaTableInfoList({
        arrangeId: this.arrangeId,
        dataStr: JSON.stringify(this.search)
      })
      this.schedule = res.DATA
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
      const { teaList } = this.schedule
      teaList.forEach(item => {
        const theData = JSON.parse(JSON.stringify(defaultData))
        item.calFixList.forEach(cell => {
          const [row, col] = cell.cellKey.split(',').map(x => Number(x))
          theData[row][col] = cell
        })
        this.tableDatas.push({
          teaName: item.teaName,
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
