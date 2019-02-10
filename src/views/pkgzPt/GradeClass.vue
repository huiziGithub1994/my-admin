<!-- 年级/班级固排禁排Tab页-->
<template>
  <div>
    <div class="operation-area">
      <div>
        <el-radio-group v-model="arrangeType">
          <el-radio :label="1">禁排</el-radio>
          <el-radio :label="2">固排</el-radio>
        </el-radio-group>
        <el-button type="primary" plain @click="saveBtn">保存</el-button>
      </div>
    </div>
    <div class="content" :style="{'min-height':treeHeight+20+ 'px'}">
      <div class="left" :style="{height:treeHeight+ 'px'}">
        <el-tree ref="treeRef" :data="treeData" node-key="id" default-expand-all :expand-on-click-node="false" highlight-current @node-click="treeNodeClick"></el-tree>
      </div>
      <div class="right my-table advanceArrange">
        <p class="tip">
          <label>操作提示：</label>如选择年级是对整个以下的班级进行批量设置禁排或固排
        </p>
        <el-table ref="singleTable" :data="tableData" style="width: 80%;max-width:900px;" border @cell-click="cellClick" :cell-class-name="cellClassName">
          <el-table-column :property="index === 0 ? 'rowOrder' : 'col'+index" :label="item" v-for="(item,index) in colHeaders" :key="index">
            <template slot-scope="scope">
              <div v-if="index === 0">第{{ scope.row.rowOrder }}节</div>
              <div v-else class="cell-arrange">
                {{ scope.row['col'+index] }}
                <i class="el-icon-error" v-if="scope.row['col'+index]" @click.stop="removeArrange(scope.row,index)"></i>
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
import { qryPreArrangeCell, saveCommPreArrangeList } from '@/api/pkgzPt'
import { qryCalendar } from '@/api/base'
import { mapGetters } from 'vuex'

export default {
  data() {
    const h = 340
    const treeH = document.body.clientHeight - h
    return {
      arrangeType: 1,
      arrangeId: sessionStorage.getItem('local_arrangeId'),
      // 学段/专业
      options: [
        { value: '01', label: '小学' },
        { value: '02', label: '初中' },
        { value: '03', label: '高中' }
      ],
      // tree 高度
      treeHeight: treeH,
      // tree 的数据s
      treeData: [],
      // 校历数据
      calendarData: [],
      calendarCell: [], // 记录校历数据
      // 表格数据
      tableData: [],
      // 表格表头
      colHeaders: [],
      count: undefined // 表格的行
    }
  },
  computed: {
    ...mapGetters(['calenderId'])
  },
  created() {
    this.getTreeData()
    this.fetchTableData()
  },
  mounted() {},
  methods: {
    // 获取树节点的数据
    async getTreeData() {
      const res = await qrySegGradeTree({ arrangeId: this.arrangeId })
      this.treeData = [res.DATA]
    },
    // 获取表格数据
    async fetchTableData() {
      // 获取校历信息
      const res = await qryCalendar({ calenderId: this.calenderId })
      this.calendarData = res.DATA
      const {
        countInMorning,
        countMorning,
        countAfternoon,
        countNight
      } = res.DATA
      this.count =
        Number(countInMorning) +
        Number(countMorning) +
        Number(countAfternoon) +
        Number(countNight)
      // 将校历信息填充表格 并 修改表格配置，校历信息中的内容为不可修改
      this.initEditTableData()
    },
    // 初始化表格的头部、行列、数据为空
    initEditTableData() {
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
    // 表格的点击
    cellClick(row, column, cell, event) {
      if (column.property === 'rowOrder') return
      const pos = `${row.rowOrder - 1},${column.property.substr(3) - 1}`
      if (this.calendarCell.includes(pos)) {
        this.$message.warning('校历维护中的数据不可以进行排课')
        return
      }
      // 表格填值
      row[column.property] = '禁排'
    },
    // 表格单元添加样式
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) return ''
      if (this.calendarCell.includes(`${rowIndex},${columnIndex - 1}`)) {
        return 'isCalendar'
      }
      const posCol = `col${columnIndex}`
      if (row[posCol] && row[posCol].length) {
        return 'canRemove'
      }
      return ''
    },
    // 删除课时预排
    removeArrange(row, index) {
      row['col' + index] = ''
    },
    // 树节点的点击事件
    async treeNodeClick(data) {
      this.tableData = []
      if (data.level <= 1) return
      const { gradeId, classId } = data
      const params = { arrangeId: this.arrangeId, rows: this.count }
      if (classId) {
        params.gradeClassId = classId
        params.arrangeType = '2'
      } else {
        params.gradeClassId = gradeId
        params.arrangeType = '1'
      }
      const res = await qryPreArrangeCell(params)
      // 将校历数据填入表格
      const { calFixList } = this.calendarData
      this.calendarCell = []
      const tempCell = []
      calFixList.forEach(item => {
        const [row, col] = item.cellKey.split(',').map(x => Number(x))
        res.DATA[row][`col${col + 1}`] = item.cellValue
        tempCell.push(`${row},${col}`)
      })
      this.calendarCell.push(...tempCell)
      this.tableData = res.DATA
    },
    // 保存按钮
    async saveBtn() {
      const currentNode = this.$refs.treeRef.getCurrentNode()
      if (!currentNode) {
        this.$message.warning('请选择年级或班级')
        return
      }
      const { gradeId, classId } = currentNode
      const params = {
        arrangeId: this.arrangeId,
        sjsCommPreArrangeList: this.tableData
      }
      if (classId) {
        params.gradeClassId = classId
        params.arrangeType = '2'
      } else {
        params.gradeClassId = gradeId
        params.arrangeType = '1'
      }
      console.log(params)
      await saveCommPreArrangeList(params)
      this.$message.success('保存成功')
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.advanceArrange .el-table__body tr > td.isCalendar {
  background: #e6e6e6 !important;
}
.advanceArrange .el-table__body tr > td.canRemove:hover {
  background: #e8e9fd !important;
  .el-icon-error {
    display: inline-block;
    cursor: pointer;
  }
}
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
.content {
  > .left {
    float: left;
    width: 250px;
    overflow: auto;
    border: 1px solid #dddddd;
  }
  > .right {
    > p {
      margin: 10px 0 5px 0;
    }
    margin-left: 260px;
  }
}
.operation-area {
  overflow: hidden;
  > div {
    overflow: hidden;
    float: right;
    > button {
      margin-left: 30px;
    }
  }
}
.cell-arrange {
  position: relative;
  width: 100%;
  .el-icon-error {
    position: absolute;
    right: -5px;
    top: 4px;
    z-index: 10;
    font-size: 1.2rem;
    display: none;
  }
}
.cell-arrange > span {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  max-width: 100%;
  text-overflow: ellipsis;
}
</style>

