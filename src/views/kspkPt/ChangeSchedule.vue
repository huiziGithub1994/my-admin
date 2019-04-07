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
        <el-table ref="singleTable" :data="baseTableData" style="width:850px" border :cell-class-name="cellClassName">
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
                <div>{{ scope.row[index-1].teaName }}</div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import { qrySegGradeTree } from '@/api/njkc'
import { qryClassTimetable } from '@/api/kbcxPt'
import { initTableData } from '@/utils/inlineEditTable'

export default {
  name: 'ChangeSchedule',

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
  },
  methods: {
    // 获取树节点的数据
    async getTreeData() {
      const res = await qrySegGradeTree({ arrangeId: this.arrangeId })
      this.treeData = [res.DATA]
    },
    // 树节点的点击事件
    async treeNodeClick(data) {
      if (data.level <= 2) return
      const res = await qryClassTimetable({
        arrangeId: this.arrangeId,
        classId: data.id
      })
      const { calenderData, timetableData } = res.DATA
      if (timetableData.length === 0) {
        this.baseTableData = []
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
      this.baseTableData = theData
    },
    // 表格单元添加样式
    cellClassName({ row, column, rowIndex, columnIndex }) {
      const cell = row[columnIndex - 1]
      if (!cell || cell.lessionSeq) return ''
      if (cell && cell.arrangeType) return 'deep'
      return 'canuse'
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.base-table {
  .el-table--enable-row-hover .el-table__body tr > td:hover {
    &.canuse {
      background: rgba(230, 162, 60, 0.2) !important;
      cursor: pointer;
    }
    &.deep {
      background: #e5e5e5 !important;
    }
  }

  .el-table__body tr:hover > td {
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
