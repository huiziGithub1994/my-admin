<template>
  <div>
    <div>
      <condition>
        <div class="condition">
          <label>课程名称</label>
          <el-select v-model="search['courseId']" clearable>
            <el-option v-for="(item,index) in courseOptions" :key="index" :label="item.courseName" :value="item.courseId"></el-option>
          </el-select>
        </div>
        <div class="condition">
          <label>教师名称</label>
          <el-input v-model.trim="search['teaName']" clearable></el-input>
        </div>
      </condition>
      <operation>
        <div class="checkboxGroup">
          <el-checkbox-group v-model="showType">
            <el-checkbox label="1">显示教室</el-checkbox>
            <el-checkbox label="2">显示时间</el-checkbox>
          </el-checkbox-group>
        </div>
        <el-button type="primary">查询</el-button>
        <el-button type="primary">下载</el-button>
      </operation>
    </div>
    <div class="pageBottom schedule-table">
      <el-table ref="singleTable" :data="tableData" style="width:80%" border :cell-class-name="cellClassName">
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
              <div>{{ scope.row[index-1].cellPosition }}</div>
              <div>{{ scope.row[index-1].beginTime }}-{{ scope.row[index-1].endTime }}</div>
            </div>
            <template v-else>
              <div class="scheduleCell"></div>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getlayerCourseName } from '@/api/pkcx'
import { initTableData } from '@/utils/inlineEditTable'
export default {
  data() {
    return {
      arrangeId: sessionStorage.getItem('local_arrangeId'),
      // 课程名称下拉菜单数据
      courseOptions: [],
      showType: [],
      search: {
        arrangeId: sessionStorage.getItem('local_arrangeId'),
        teaName: '',
        courseId: ''
      },
      tableData: [],
      schedule: {
        countAfternoon: 4,
        workDays: 5,
        countInMorning: 0,
        countNight: 0,
        countMorning: 4,
        schoolId: '001',
        schoolYear: '2018',
        calenderId: '001',
        termCode: '1',
        teaList: [
          {
            teaName: '王清平',
            calFixList: [
              {
                cellKey: '4,0',
                cellValue: '物理A-1班',
                cellPosition: '第一教学楼 101室',
                beginTime: '13:20',
                endTime: '14:00'
              },
              {
                cellKey: '6,0',
                cellValue: '物理A-2班',
                cellPosition: '第一教学楼 201室',
                beginTime: '15:20',
                endTime: '16:00'
              }
            ]
          },
          {
            teaName: '李好靖',
            calFixList: [
              {
                cellKey: '4,0',
                cellValue: '物理B-1班',
                cellPosition: '第三教学楼 101室',
                beginTime: '13:20',
                endTime: '14:00'
              },
              {
                cellKey: '5,0',
                cellValue: '物理B-2班',
                cellPosition: '第三教学楼 201室',
                beginTime: '14:20',
                endTime: '15:00'
              }
            ]
          }
        ]
      }
    }
  },
  created() {
    this.getCourseName()
    this.initTableData()
  },
  methods: {
    // 课程名称下拉列表数据
    async getCourseName() {
      const res = await getlayerCourseName({
        arrangeId: this.arrangeId
      })
      this.courseOptions = res.DATA
    },
    // 初始化表格的头部、行列、数据为空
    initTableData() {
      const baseHeader = ['节次/星期']
      const { colHeaders, defaultData } = initTableData(
        this.schedule,
        baseHeader,
        '2'
      )
      this.colHeaders = colHeaders
      const { teaList } = this.schedule
      teaList.forEach(item => {
        item.calFixList.forEach(cell => {
          const [row, col] = cell.cellKey.split(',').map(x => Number(x))
          defaultData[row][col] = cell
        })
      })
      this.tableData = defaultData
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
    min-height: 60px;
  }
}
</style>
