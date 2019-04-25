<template>
  <div>
    <div>
      <condition>
        <div class="condition">
          <label>教学班</label>
          <el-select v-model="search['a.class_id01']" clearable placeholder="请选择">
            <el-option v-for="item in classesOption" :key="item.classId" :label="item.className" :value="item.classId"></el-option>
          </el-select>
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
        <el-button type="primary" plain @click="handleDownload" v-popover:popover :loading="downloadLoading">下载</el-button>
      </operation>
    </div>
    <el-popover ref="popover" placement="top" title="提示" width="200" trigger="hover" content="未选中教学班时，下载所有教学班的课表。选中某一个教学班时，下载选中教学班的课表。"></el-popover>
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
import { qryTeachingClassList } from '@/api/pkgz'
import { expCourse2Excel } from '@/api/kbcxPt'
import { initTableData } from '@/utils/inlineEditTable'
import { parseTime } from '@/utils'
export default {
  data() {
    return {
      loading: false,
      downloadLoading: false,
      arrangeId: sessionStorage.getItem('local_arrangeId'),
      // 教学班下拉菜单数据
      classesOption: [],
      showType: [],
      search: {
        'a.class_id01': '',
        currentPage: '1',
        pageSize: '1000'
      },
      tableDatas: [],
      schedule: {},
      colHeaders: []
    }
  },
  created() {
    // 教学班下拉列表
    this.getClassesOption()
  },
  methods: {
    queryBtn() {
      this.tableDatas = []
      this.getTeaSchedule()
    },
    // 教学班下拉列表
    async getClassesOption() {
      const res = await qryTeachingClassList({ arrangeId: this.arrangeId })
      this.classesOption = res.DATA
    },
    async getTeaSchedule() {
      if (this.search['a.class_id01'] === '') {
        this.$message.warning('请先选择教学班')
        return
      }
      this.loading = true
      // const res = await teaTableInfoList({
      //   arrangeId: this.arrangeId,
      //   dataStr: JSON.stringify(this.search)
      // }).finally(() => {
      //   this.loading = false
      // })
      // this.schedule = res.DATA
      // const { teaList } = this.schedule
      // if (teaList.length === 0) {
      //   this.$message.info('未检索到数据')
      //   return
      // }
      // this.renderTable()
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
    },
    // 下载按钮
    async handleDownload() {
      const params = { arrangeId: this.arrangeId, taskType: 1 }
      if (this.search['a.class_id01']) {
        params.classId = this.search['a.class_id01']
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
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          const cell = v[j]
          if (j === 'timestamp') {
            return parseTime(cell)
          } else if (j === 'lessionSeq') {
            return cell
          } else {
            return `${cell.cellValue}`
          }
        })
      )
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
