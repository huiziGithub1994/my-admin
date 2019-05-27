<template>
  <div>
    <div v-area class="top">
      <condition>
        <div class="condition">
          <label>学生学号</label>
          <el-input v-model.trim="classTeaStuId" clearable/>
        </div>
      </condition>
      <operation>
        <el-button type="primary" plain @click="queryBtn">查询</el-button>
        <el-button type="primary" plain @click="getAllSchedule">全部学生课表</el-button>
      </operation>
    </div>
    <div class="content">
      <div class="box">
        <el-checkbox-group v-model="showType">
          <el-checkbox label="1">上课教室</el-checkbox>
          <el-checkbox label="2">教学班</el-checkbox>
          <el-checkbox label="3">授课教师</el-checkbox>
          <el-checkbox label="4">上课时间</el-checkbox>
        </el-checkbox-group>
      </div>
      <iframe v-if="showAllTable" :src="hrefSrc" :style="{height:treeHeight+ 'px'}"></iframe>
      <el-table ref="singleTable" :data="tableData" style="width:90%;max-width:900px;" border :cell-class-name="cellClassName" v-else>
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
              <div>{{ scope.row[index-1].courseName }}</div>
              <div v-show="showType.length&&showType.includes('1')">{{ scope.row[index-1].classRoom }}</div>
              <div v-show="showType.length&&showType.includes('2')">{{ scope.row[index-1].className }}</div>
              <div v-show="showType.length&&showType.includes('3')">{{ scope.row[index-1].teaName }}</div>
              <div v-show="showType.length&&showType.includes('4')">{{ scope.row[index-1].courseTime }}</div>
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
import { mapGetters } from 'vuex'
import { qryOneStuTeaTimetable } from '@/api/kbcxXgk'
import url from '@/api/url'
import { initTableData } from '@/utils/inlineEditTable'
export default {
  data() {
    const h = 245
    const treeH = document.body.clientHeight - h
    return {
      classTeaStuId: '',
      treeHeight: treeH,
      loading: false,
      arrangeId: sessionStorage.getItem('local_arrangeId'),
      showType: ['1', '2', '3'],
      tableData: [],
      colHeaders: [],
      showAllTable: false,
      hrefSrc: `${url.qryAllClassTimetable}arrangeId=${sessionStorage.getItem(
        'local_arrangeId'
      )}`
    }
  },
  computed: {
    ...mapGetters(['menutype'])
  },
  created() {
    if (this.menutype === 'xgk') this.showType.push('1')
  },
  methods: {
    // 查询按钮
    async queryBtn() {
      if (!this.classTeaStuId) {
        this.$message.warning('请输入学生学号')
        return
      }
      this.showAllTable = false
      const res = await qryOneStuTeaTimetable({
        arrangeId: this.arrangeId,
        classTeaStuId: this.classTeaStuId,
        qryType: '2'
      })
      const { calenderData, timetableData } = res.DATA
      if (timetableData.length === 0) {
        this.tableData = []
        this.$message.info('未检索到数据')
        return
      }
      this.renderTable(calenderData, timetableData)
    },
    // 全部班级课表
    getAllSchedule() {
      // this.showAllTable = true
    },
    // 初始化表格的头部、行列、数据为空
    renderTable(calenderData, timetableData) {
      const baseHeader = ['节次/星期']
      const { colHeaders, defaultData } = initTableData(
        calenderData,
        baseHeader,
        '2'
      )
      this.colHeaders = colHeaders
      const theData = JSON.parse(JSON.stringify(defaultData))
      timetableData.forEach(item => {
        Object.keys(item).forEach(key => {
          if (item[key].classRoom) {
            const [row, col] = item[key].cellKey.split(',').map(x => Number(x))
            theData[row][col] = item[key]
          }
        })
      })
      this.tableData = theData
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
.top,
.box {
  margin-bottom: 5px;
}
iframe {
  border: 1px solid #dddddd;
  width: 100%;
}
</style>
