<template>
  <!-- 课时预排 -->
  <div>
    <div class="operation">
      <p class="tip">
        <label>温馨提示：</label>先选中左边的课时组,再点击右边的表格进行课时预排。
      </p>
      <el-button type="primary" @click="saveBtn">保存</el-button>
    </div>
    <div class="area-data">
      <div class="left" :style="{height:treeHeight+'px'}">
        <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick" highlight-current :expand-on-click-node="false" :render-content="renderContent"></el-tree>
      </div>
      <div class="right my-table">
        <el-table ref="singleTable" :data="tableData" style="width: 800px" border @cell-click="cellClick">
          <el-table-column :property="index === 0 ? 'lessionSeq': index-1+''" :label="item" v-for="(item,index) in colHeaders" :key="index"/>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { qryCalendar } from '@/api/base'
import { qryTeachHours } from '@/api/pkgz'
import { initTableData } from '@/utils/inlineEditTable'

export default {
  data() {
    return {
      treeHeight: document.body.clientHeight - 250,
      calendarData: {},
      calendaCell: [],
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tableData: [],
      colHeaders: [],
      choosedTreeNode: {}
    }
  },
  created() {
    this.fetchEditTableData()
    this.getTreeData()
  },
  methods: {
    // 获取校历表格数据并初始化表格
    async fetchEditTableData() {
      // 获取校历信息
      const res = await qryCalendar({ schoolId: '111' })
      this.calendarData = res.DATA
      this.initEditTableData()
      // 数据填充表格
      this.fillTableData()
    },
    // 数据填充表格
    fillTableData() {
      const { calFixList } = this.calendarData
      const calendaCell = []
      calFixList.forEach(item => {
        const [row, col] = item.cellKey.split(',').map(x => Number(x))
        this.tableData[row][col] = item.cellValue
        calendaCell.push(item.cellKey)
      })
      this.calendaCell = calendaCell
    },
    // 初始化表格的头部、行列、数据为空
    initEditTableData() {
      const baseHeader = ['节次/星期']
      const { colHeaders, defaultData } = initTableData(
        this.calendarData,
        baseHeader
      )
      this.colHeaders = colHeaders
      this.tableData.push(...defaultData)
    },
    // 表格的点击
    cellClick(row, column, cell, event) {
      if (column.property === 'lessionSeq') return
      if (Object.keys(this.choosedTreeNode).length === 0) {
        this.$message.warning('请先选择教学组')
        return
      }
      const val = row[column.property]
      if (this.isCalenderData(row, column.property)) {
        this.$message.warning('校历维护中的数据不可以进行课时预排')
        return
      }
      if (val !== '') {
        row[column.property] = ''
      } else {
        row[column.property] = this.choosedTreeNode.label
      }
    },
    isCalenderData(rowData, column) {
      const reg = /[1-9][0-9]*/g
      const row = rowData.lessionSeq.match(reg)[0]
      return this.calendaCell.includes(`${row - 1},${column}`)
    },
    // 获取教学组信息
    async getTreeData() {
      const res = await qryTeachHours()
      this.treeData = res.DATA
    },
    // 树节点的点击事件
    handleNodeClick(data) {
      console.log(data)
      this.choosedTreeNode = data
    },
    renderContent(h, { node, data, store }) {
      if (node.isLeaf) {
        return <span>{data.label}</span>
      } else {
        return (
          <span class="mycustom-tree-node">
            <span>{data.label}</span>
            <span class="nodeSpan-right">
              <span>{data.hours}课时</span>(0/3)
            </span>
          </span>
        )
      }
    },
    saveBtn() {}
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.mycustom-tree-node {
  width: 270px;

  .nodeSpan-right {
    float: right;
    > span {
      margin-right: 20px;
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.area-data {
  margin-top: 10px;
  display: flex;
  > .left {
    border: 1px solid #dddddd;
    width: 300px;
    margin-right: 10px;
    overflow: auto;
  }
  > .right {
    flex: 1;
  }
}

.operation {
  overflow: hidden;
  height: 33px;
  > p {
    position: relative;
    top: 17px;
    display: inline-block;
  }
  > button {
    float: right;
  }
}
</style>

