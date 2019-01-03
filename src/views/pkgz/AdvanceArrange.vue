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
      <div class="right my-table advanceArrange">
        <el-table ref="singleTable" :data="tableData" style="width: 800px" border @cell-click="cellClick" :cell-class-name="cellClassName">
          <el-table-column :label="item" v-for="(item,index) in colHeaders" :key="index">
            <template slot-scope="scope">
              <div v-if="index === 0">{{ scope.row.lessionSeq }}</div>
              <div v-else>{{ scope.row[index-1+''].value }}</div>
            </template>
          </el-table-column>
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
      completeData: [
        {
          teaGroupId: '001',
          teaGroupName: '数学课时组1',
          weekHours: 5,
          cellKey: ['0,1', '1,1', '2,1', '3,1', '4,1'],
          arrangeId: '001',
          arrangeName: '回龙中学2018-2019第一学期高一走班排课',
          teachingClasses: [
            {
              classId: 'w23132923keo',
              className: '数A-1班',
              roomId: 'asdiwerk',
              roomFullName: '第一教学楼101',
              teaName: '张清纯'
            },
            {
              classId: 'DKkdiekei2230',
              className: '数B-1班',
              roomId: '1234123',
              roomFullName: '第一教学楼102',
              teaName: '王春红'
            }
          ]
        },
        {
          teaGroupId: '002',
          teaGroupName: '数学课时组2',
          weekHours: 5,
          cellKey: ['0,2', '1,2', '2,2', '3,2', '4,2'],
          arrangeId: '001',
          arrangeName: '回龙中学2018-2019第一学期高一走班排课',
          teachingClasses: [
            {
              classId: 'askkasdkl',
              className: '数A-2班',
              roomId: '299393',
              roomFullName: '第一教学楼101',
              teaName: '张清纯'
            },
            {
              classId: 'dskksldklf',
              className: '数B-2班',
              roomId: '1234123',
              roomFullName: '第一教学楼102',
              teaName: '王春红'
            }
          ]
        }
      ],
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
  async created() {
    // 获取校历维护数据
    await this.fetchEditTableData()
    this.getTreeAndArrangeData()
  },
  methods: {
    getTreeAndArrangeData() {},
    // 获取校历表格数据并初始化表格
    async fetchEditTableData() {
      // 获取校历信息
      const res = await qryCalendar({ calenderId: this.$route.query.arrangeId })
      this.calendarData = res.DATA
      this.initEditTableData()
      // 数据填充表格
      this.fillTableData()
    },
    // 数据填充表格
    fillTableData() {
      const { calFixList } = this.calendarData
      calFixList.forEach(item => {
        const [row, col] = item.cellKey.split(',').map(x => Number(x))
        // 将每个cell的数据变成对象
        if (item.cellValue) {
          this.tableData[row][col] = { value: item.cellValue, isCalendar: true }
        } else {
          this.tableData[row][col] = { value: item.cellValue }
        }
      })
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
      if (val.isCalendar) {
        this.$message.warning('校历维护中的数据不可以进行课时预排')
        return
      }
      if (val !== '') {
        row[column.property].value = ''
      } else {
        row[column.property].value = this.choosedTreeNode.label
      }
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
    saveBtn() {},
    // 表格单元添加样式
    cellClassName({ row, column, rowIndex, columnIndex }) {
      console.log(row[columnIndex])

      if (row[columnIndex - 1] && row[columnIndex - 1].isCalendar === true) {
        return 'isCalendar'
      }
      return ''
    }
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

.advanceArrange .el-table__body tr > td.isCalendar {
  background: #e6e6e6 !important;
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

