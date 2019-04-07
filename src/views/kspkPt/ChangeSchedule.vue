<template>
  <div class="wrapper">
    <div class="left" :style="{height:treeHeight+ 'px'}">
      <el-tree ref="treeRef" :data="treeData" node-key="id" default-expand-all :expand-on-click-node="false" highlight-current @node-click="treeNodeClick"></el-tree>
    </div>
    <div class="right">
      <div class="my-tag">
        <el-tag type="danger"></el-tag>
        <label class="danger">禁调节次(教师或课程禁调)</label>
        <el-tag type="deep"></el-tag>
        <label class="deep">禁调节次</label>
        <el-tag type="info"></el-tag>
        <label class="info">禁调节次(教师课表冲突)</label>
        <el-tag type="warning"></el-tag>
        <label class="warning">选定节次</label>
        <el-tag></el-tag>
        <label class="default">可调节次</label>
      </div>
      <div class="base-table">
        <el-table ref="singleTable" :data="baseTableData" style="width:100%" border :cell-class-name="cellClassName">
          <el-table-column :property="index === 0 ? 'rowOrder' : 'col'+index+'M'" :label="item" v-for="(item,index) in colHeaders" :key="index">
            <template slot-scope="scope">
              <div v-if="index === 0">{{ scope.row.rowOrder|callessionSeq }}</div>
              <div v-else-if="scope.row['col'+index+'M']">{{ scope.row['col'+index+'M'].cellMeaning }}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import { qrySegGradeTree } from '@/api/njkc'
import { qryCalendarByXnXq } from '@/api/base'
import { qryPreArrangeCell } from '@/api/pkgzPt'
let timeDuration = {}

export default {
  name: 'ChangeSchedule',
  filters: {
    callessionSeq(val) {
      const i = val - 1
      const { countInMorning, countMorning, countAfternoon } = timeDuration
      const sum1 = Number(countInMorning) + Number(countMorning)
      const sum2 = sum1 + Number(countAfternoon)
      let lessionSeq = ''
      if (countInMorning > 0) {
        if (i < countInMorning) lessionSeq = `早上第${i + 1}节`
        else if (i < sum1) {
          lessionSeq = `上午第${i - Number(countInMorning) + 1}节`
        } else if (i < sum2) {
          lessionSeq = `下午第${i - sum1 + 1}节`
        } else {
          lessionSeq = `晚上第${i - sum2 + 1}节`
        }
      } else {
        if (i < sum1) {
          lessionSeq = `上午第${i - Number(countInMorning) + 1}节`
        } else if (i < sum2) {
          lessionSeq = `下午第${i - sum1 + 1}节`
        } else {
          lessionSeq = `晚上第${i - sum2 + 1}节`
        }
      }
      return lessionSeq
    }
  },
  data() {
    const h = 205
    const treeH = document.body.clientHeight - h
    return {
      curYear: sessionStorage.getItem('local_curYear'),
      curTerm: sessionStorage.getItem('local_curTerm'),
      arrangeId: sessionStorage.getItem('local_arrangeId'),
      // tree 高度
      treeHeight: treeH,
      // tree 的数据s
      treeData: [],
      // 基本表格数据
      baseTableData: [],
      calendarData: [],
      colHeaders: [],
      count: undefined // 表格行
    }
  },
  created() {
    this.getTreeData()
    // 获取校历表格数据并初始化表格
    this.fetchCalendarTableData()
  },
  methods: {
    // 获取树节点的数据
    async getTreeData() {
      const res = await qrySegGradeTree({ arrangeId: this.arrangeId })
      this.treeData = [res.DATA]
    },
    // 树节点的点击事件
    treeNodeClick(data) {
      this.baseTableData = []
      if (data.level <= 2) return
      const { classId } = data
      const params = { arrangeId: this.arrangeId, rows: this.count }
      params.gradeClassId = classId
      params.arrangeType = '2'
      // 获取排课表格数据，并填入校历数据
      this.queryArrangeTableData(params)
    },
    // 获取排课表格数据，并填入校历数据
    async queryArrangeTableData(params) {
      const res = await qryPreArrangeCell(params)
      this.baseTableData = res.DATA
    },
    // 获取校历表格数据并初始化表格
    async fetchCalendarTableData() {
      const res = await qryCalendarByXnXq({
        xn: this.curYear,
        xq: this.curTerm
      })
      this.calendarData = res.DATA
      const {
        countInMorning,
        countMorning,
        countAfternoon,
        countNight
      } = res.DATA
      timeDuration = {
        countInMorning,
        countMorning,
        countAfternoon,
        countNight
      }
      this.count =
        Number(countInMorning) +
        Number(countMorning) +
        Number(countAfternoon) +
        Number(countNight)
      const baseHeader = ['节次/星期']
      if (!this.calendarData) {
        return
      }
      const weeks = [
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六',
        '星期日'
      ]
      const { workDays } = this.calendarData
      // 生成表头
      this.colHeaders = [...baseHeader, ...weeks.slice(0, workDays)]
    },

    // 表格单元添加样式
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) return ''
      const cell = row[`col${columnIndex}M`]
      if (cell && cell.cellType) return 'deep'
      return 'canuse'
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.base-table {
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: transparent !important;
  }

  .el-table__body tr:hover > td {
    background-color: transparent !important;
  }
  .el-table__body tr > td.deep {
    background: #e5e5e5;
  }
  .el-table__body tr > td.canuse {
    background: rgba(64, 158, 255, 0.1);
  }
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
.wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  > .left {
    width: 250px;
    overflow: auto;
    border: 1px solid #dddddd;
  }
  > .right {
    padding-left: 10px;
    flex: 1;
    > .my-tag {
      > .el-tag {
        width: 50px;
        margin-bottom: 5px;
        &.el-tag--deep {
          background-color: #e5e5e5;
          border: 1px solid #d0d0d0;
        }
      }
      > label {
        margin-right: 15px;
        position: relative;
        bottom: 11px;
        &.danger {
          color: #f56c6c;
        }
        &.default {
          color: #409eff;
        }
        &.warning {
          color: #e6a23c;
        }
        &.info {
          color: #b3b3b3;
        }
        &.deep {
          color: #909399;
        }
      }
    }
  }
}
</style>
