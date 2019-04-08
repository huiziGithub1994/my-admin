<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <div>
          <div>{{ leftTeacher }} 老师的课表</div>
          <el-table :data="leftData" border>
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
                <div v-else-if="Object.keys(scope.row[index-1]).length">
                  <div>{{ scope.row[index-1].courseName }}</div>
                  <div>{{ scope.row[index-1].className+'班' }}</div>
                </div>
                <template v-else>
                  <div></div>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="12">
        <div>
          <div>目标格子 {{ rightTeacher }} 老师的课表</div>
          <el-table :data="rightData" border>
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
                <div v-else-if="Object.keys(scope.row[index-1]).length">
                  <div>{{ scope.row[index-1].courseName }}</div>
                  <div>{{ scope.row[index-1].className+'班' }}</div>
                </div>
                <template v-else>
                  <div></div>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { qryTeaTimetable } from '@/api/kbcxPt'
export default {
  props: {
    defaultData: {
      type: Array,
      default: () => []
    },
    colHeaders: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      arrangeId: sessionStorage.getItem('local_arrangeId'),
      leftData: [],
      leftTeacher: '',
      rightTeacher: '',
      rightData: [],
      flag: 1 // 哪个表格 1：左边 0：右边
    }
  },
  methods: {
    // 获取选中格子教师的课表
    async getSchedule(teaName, flag) {
      this.flag = flag
      this[flag ? 'leftTeacher' : 'rightTeacher'] = teaName

      const res = await qryTeaTimetable({
        arrangeId: this.arrangeId,
        tmpFieldVal: teaName
      })
      const { calenderData, timetableData } = res.DATA
      this.renderRefTable(calenderData, timetableData)
    },
    // 初始化表格的头部、行列、数据为空
    renderRefTable(calenderData, timetableData) {
      const theData = JSON.parse(JSON.stringify(this.defaultData))
      timetableData.forEach(item => {
        if (item.classRoom) {
          const [row, col] = item.cellKey.split(',').map(x => Number(x))
          theData[row][col] = item
        }
      })
      this[this.flag ? 'leftData' : 'rightData'] = theData
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.schedule-table .el-table__body tr > td.hasClass {
  background: #f5f7fa !important;
}
</style>

