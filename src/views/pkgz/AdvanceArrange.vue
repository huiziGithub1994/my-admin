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
        <el-collapse class="my-collapse">
          <el-collapse-item :name="index" v-for="(item,index) in hoursGroup" :key="item.teaGroupId">
            <template slot="title">
              <div :class="{title:true,active:currentGroup == index}" @click="currentGroup=index">
                <span>{{ item.teaGroupName }}</span>
                <span class="hours">{{ item.weekHours }}课时</span>
                <span class="percent">({{ item.teachingClasses.length }}/{{ item.cellKey.length }})</span>
              </div>
            </template>
            <div v-for="sClass in item.teachingClasses" :key="sClass.classId" class="class-style">{{ `${sClass.className} - ${sClass.teaName}` }}</div>
          </el-collapse-item>
        </el-collapse>
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
      calendaCell: [], // 记录校历数据
      currentGroup: {}, // 当前选中的group
      hoursGroup: [],
      tableData: [],
      colHeaders: [],
      choosedTreeNode: {}
    }
  },
  async created() {
    // 获取校历维护数据
    await this.fetchEditTableData()
    this.getArrangeData()
  },
  methods: {
    getArrangeData() {
      this.completeData.forEach((item, index) => {
        this.$set(this.hoursGroup, index, item)
        item.cellKey.forEach(cell => {
          const [row, col] = cell.split(',').map(x => Number(x))
          this.tableData[row][col].value = item.teaGroupName
        })
      })
      const len = this.completeData.length
      const names = []
      for (let i = 1; i <= len; i++) {
        names.push(i)
      }
      this.activeNames = [...names]
      // console.log(this.activeNames)
    },
    // 当前group改变时
    collapseChange(index) {},
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
    saveBtn() {},
    // 表格单元添加样式
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (row[columnIndex - 1] && row[columnIndex - 1].isCalendar === true) {
        return 'isCalendar'
      }
      return ''
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.advanceArrange .el-table__body tr > td.isCalendar {
  background: #e6e6e6 !important;
}
.my-collapse .title.active {
  color: #409eff;
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
    padding: 0 10px;
    div.title {
      .hours {
        margin-left: 10px;
        font-size: 0.8rem;
      }
      .percent {
        float: right;
        margin-right: 10px;
      }
    }
    .class-style {
      padding-left: 10px;
    }
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

