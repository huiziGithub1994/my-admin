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
        <div :name="index" v-for="(item,index) in hoursGroup" :key="item.teaGroupId" class="block">
          <div :class="{title:true,active:currentGroup == index}" @click="currentGroup = index">
            <span>{{ item.teaGroupName }}</span>
            <span class="hours">{{ item.weekHours }}课时</span>
            <div>
              <span class="percent">({{ item.cellKey.length }}/{{ item.weekHours }})</span>
              <span class="header-icon" @click="iconArrowClick(index)">
                <i v-if="iconArrowMap[index]" class="el-icon-arrow-down"></i>
                <i v-else class="el-icon-arrow-right"></i>
              </span>
            </div>
          </div>
          <div v-show="iconArrowMap[index]" v-for="sClass in item.teachingClasses" :key="sClass.classId" class="class-style">{{ `${sClass.className} - ${sClass.teaName}` }}</div>
        </div>
      </div>
      <div class="right my-table advanceArrange">
        <el-table ref="singleTable" :data="tableData" style="width: 800px" border @cell-click="cellClick" :cell-class-name="cellClassName">
          <el-table-column :property="index === 0 ? 'lessionSeq' : index-1+''" :label="item" v-for="(item,index) in colHeaders" :key="index">
            <template slot-scope="scope">
              <div v-if="index === 0">{{ scope.row.lessionSeq }}</div>
              <div v-else>
                {{ scope.row[index-1+''].value }}
                <i class="el-icon-error" v-if="scope.row[index-1+''].value && !scope.row[index-1+''].isCalendar" @click.stop="removeArrange(scope.row,index)"></i>
              </div>
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
          cellKey: ['0,1', '1,1'],
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
          cellKey: ['2,2', '3,2', '4,2'],
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
      currentGroup: undefined, // 当前选中的group
      hoursGroup: [], // 课时组数据
      iconArrowMap: {}, // group 展开或关闭集合
      tableData: [],
      colHeaders: [],
      choosedTreeNode: {}
    }
  },
  async created() {
    // 获取校历表格数据并初始化表格
    await this.fetchEditTableData()
    this.getArrangeData()
  },
  methods: {
    // 获取详情信息
    getArrangeData() {
      this.completeData.forEach((item, index) => {
        this.$set(this.hoursGroup, index, item) // 课时组数据
        this.iconArrowMap[index] = true // group 展开或关闭集合赋初始值
        // 已排课时数据的回填
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
    },
    // group 展开或关闭
    iconArrowClick(index) {
      console.log(index)
      this.iconArrowMap[index] = !this.iconArrowMap[index]
      console.log(this.iconArrowMap)
    },
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
      if (this.currentGroup === undefined) {
        this.$message.warning('请先选择教学组')
        return
      }
      const val = row[column.property]
      if (val.isCalendar) {
        this.$message.warning('校历维护中的数据不可以进行课时预排')
        return
      }
      if (val.value !== '') {
        return
      }
      const group = this.hoursGroup[this.currentGroup]
      // 表格填值
      row[column.property].value = group.teaGroupName
      // 课时组修改
      const reg = /[1-9][0-9]*/g

      group.cellKey.push(
        `${row.lessionSeq.match(reg)[0] - 1},${column.property}`
      )
      console.log(group)
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
      } else if (row[columnIndex - 1] && row[columnIndex - 1].value.length) {
        return 'canRemove'
      }
      return ''
    },
    // 删除课时预排
    removeArrange(row, index) {
      const oldValue = row[index - 1].value
      const reg = /[1-9][0-9]*/g
      this.hoursGroup.forEach(item => {
        if (item.teaGroupName === oldValue) {
          const pos = item.cellKey.findIndex(key => {
            key === `${row.lessionSeq.match(reg)[0]},${index - 1}`
          })
          item.cellKey.splice(pos, 1)
        }
      })
      row[index - 1].value = ''
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
.area-data {
  margin-top: 10px;
  display: flex;
  > .left {
    border: 1px solid #dddddd;
    width: 300px;
    margin-right: 10px;
    overflow: auto;
    padding: 0 10px;
    div.block {
      border-bottom: 1px solid #dddddd;
      line-height: 25px;
      padding-bottom: 10px;
      margin-bottom: 10px;
    }
    div.title {
      font-size: 1.08rem;
      cursor: pointer;
      .hours {
        margin-left: 10px;
        font-size: 1rem;
      }
      > div {
        float: right;
        .percent {
          margin-right: 10px;
        }
        .header-icon {
        }
      }
      &:hover {
        color: #409eff;
      }
      &.active {
        color: #409eff;
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
.advanceArrange .el-icon-error {
  float: right;
  margin-top: 5px;
  font-size: 1.2rem;
  display: none;
}
</style>

