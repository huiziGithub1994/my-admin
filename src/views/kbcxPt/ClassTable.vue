<template>
  <div>
    <div class="checkboxGroup">
      <el-checkbox-group v-model="showType" v-if="menutype == 'xgk'">
        <el-checkbox label="1">教学班</el-checkbox>
        <el-checkbox label="3">教师</el-checkbox>
        <el-checkbox label="2">显示时间</el-checkbox>
      </el-checkbox-group>
      <el-checkbox-group v-model="showType" v-else>
        <el-checkbox label="1">显示教室</el-checkbox>
        <el-checkbox label="2">显示时间</el-checkbox>
      </el-checkbox-group>
      <div class="excel-btn">
        <el-button type="primary" plain v-if="menutype == 'xgk'" @click="getAllSchedule">全部班级课表</el-button>
        <el-button type="primary" v-popover:popover plain @click="exportExcel">下载</el-button>
      </div>
    </div>
    <el-popover ref="popover" placement="top" title="提示" width="200" trigger="hover" content="未选中班级时，下载所有班级的课表。选中某一个班级时，下载选中班级的课表。"></el-popover>

    <div class="content">
      <div class="treeWrapper" :style="{height:treeHeight+ 'px'}">
        <el-tree ref="treeRef" :data="treeData" node-key="id" default-expand-all :expand-on-click-node="false" highlight-current @node-click="treeNodeClick"></el-tree>
      </div>
      <div class="right">
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
                <div v-show="showType.length&&showType.includes('1')">{{ scope.row[index-1][menutype == 'xgk' ? 'className' : 'classRoom'] }}</div>
                <div v-show="showType.length&&showType.includes('3')">{{ scope.row[index-1].teaName }}</div>
                <div v-show="showType.length&&showType.includes('2')">{{ scope.row[index-1].courseTime }}</div>
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
import { mapGetters } from 'vuex'
import { qrySegGradeTree } from '@/api/njkc'
import { expCourse2Excel } from '@/api/kbcxPt'
import { qryClassTimetableXgk } from '@/api/kbcxXgk'
import url from '@/api/url'
import { initTableData } from '@/utils/inlineEditTable'
export default {
  data() {
    const h = 245
    const treeH = document.body.clientHeight - h
    return {
      // tree 高度
      treeHeight: treeH,
      // tree 的数据s
      treeData: [],
      loading: false,
      arrangeId: sessionStorage.getItem('local_arrangeId'),
      showType: [],
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
    this.getTreeData()
  },
  methods: {
    // 全部班级课表
    getAllSchedule() {
      this.showAllTable = true
    },
    // 获取树节点的数据
    async getTreeData() {
      const res = await qrySegGradeTree({ arrangeId: this.arrangeId })
      this.treeData = [res.DATA]
    },
    // 班级的点击
    async treeNodeClick(data) {
      if (data.level !== '3') return
      this.showAllTable = false
      const res = await qryClassTimetableXgk({
        arrangeId: this.arrangeId,
        classId: data.id
      })
      const { calenderData, timetableData } = res.DATA
      if (timetableData.length === 0) {
        this.tableData = []
        this.$message.info('未检索到数据')
        return
      }
      this.renderTable(calenderData, timetableData)
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
    },
    // 下载excel
    async exportExcel() {
      const params = { arrangeId: this.arrangeId, taskType: 0 }
      const node = this.$refs.treeRef.getCurrentNode()
      if (+node.level === 3) {
        params.classId = node.classId
        if (this.tableData.length === 0) {
          this.$message.warning('该班级未检索到课表数据，无法进行下载')
          return
        }
      }
      const res = await expCourse2Excel(params)
      const url = window.URL.createObjectURL(res)
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', '课程表.xls')
      document.body.appendChild(link)
      link.click()
      link.remove()
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
  overflow: hidden;
  margin-bottom: 5px;
  > div {
    float: left;
  }
  > .excel-btn {
    position: relative;
    float: right;
  }
}
.content {
  display: flex;
  > .treeWrapper {
    width: 250px;
    border: 1px solid #dddddd;
    overflow: auto;
  }
  > .right {
    padding-left: 10px;
    flex: 1;
  }
}
iframe {
  border: 1px solid #dddddd;
  width: 100%;
}
</style>
