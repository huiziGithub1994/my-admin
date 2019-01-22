<template>
  <!-- 课时预排 -->
  <div>
    <div class="operation">
      <p class="tip">
        <label>温馨提示：</label>先选中左边的课时组,再点击右边的表格进行课时预排。
      </p>
      <div>
        <el-button type="primary" @click="saveBtn">保存</el-button>
        <el-button type="primary" @click="addBtn" :disabled="addBtnDisabled">新增课时组</el-button>
      </div>
    </div>
    <div class="area-data">
      <div class="left" :style="{height:treeHeight+'px'}">
        <div v-for="(item,gropuIndex) in hoursGroup" :key="item.teaGroupId" class="block">
          <div :class="{title:true,active:currentGroup == gropuIndex}" @click="currentGroupClick(gropuIndex)">
            <span>{{ item.teaGroupName }}</span>
            <span class="hours">{{ item.weekHours }}课时</span>
            <div>
              <span class="percent">({{ item.cellKey.length }}/{{ item.weekHours }})</span>
              <span class="header-icon" @click.stop="iconArrowClick(gropuIndex)">
                <i v-show="iconArrowMap[gropuIndex]" class="el-icon-arrow-down"></i>
                <i v-show="!iconArrowMap[gropuIndex]" class="el-icon-arrow-right"></i>
              </span>
            </div>
          </div>
          <div v-show="iconArrowMap[gropuIndex]" v-for="sClass in item.teachingClasses" :key="sClass.classId" class="class-style">{{ `${sClass.className} - ${sClass.teaName}` }}</div>
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
import {
  qryArrangeGroupInfo,
  saveCoursePlanInfo,
  saveGroupArrInfo
} from '@/api/pkgz'
import { initTableData } from '@/utils/inlineEditTable'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      addBtnDisabled: true, // 新增课时组
      arrangeId: sessionStorage.getItem('local_arrangeId'),
      treeHeight: document.body.clientHeight - 255,
      completeData: [],
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
  computed: {
    ...mapGetters(['calenderId'])
  },
  async created() {
    // 获取校历表格数据并初始化表格
    await this.fetchEditTableData()
    this.getArrangeData()
  },
  methods: {
    // 获取详情信息
    async getArrangeData() {
      const res = await qryArrangeGroupInfo({ arrangeId: this.arrangeId })
      if (!res.SUCCESS) return
      // 有课时组数据
      if (res.DATA.length) {
        this.completeData = res.DATA
        this.completeData.forEach((item, index) => {
          this.$set(this.iconArrowMap, index, true)
          this.$set(this.hoursGroup, index, item) // 课时组数据
          // 已排课时数据的回填
          item.cellKey = item.cellKey.filter(key => key)
          item.cellKey.forEach(cell => {
            const [row, col] = cell.split(',').map(x => Number(x))
            const tableCel = this.tableData[row][col]
            tableCel && (tableCel.value = item.teaGroupName)
          })
        })
        return
      }
      // 新增课时组数据
      this.addBtnDisabled = false
      const h = this.$createElement
      this.$notify({
        title: '提示',
        message: h('i', { style: 'color: teal' }, '请先点击“新增课时组”按钮'),
        duration: 8 * 1000
      })
    },
    currentGroupClick(index) {
      this.currentGroup = index
    },
    // group 展开或关闭
    iconArrowClick(index) {
      this.iconArrowMap[index] = !this.iconArrowMap[index]
    },
    // 获取校历表格数据并初始化表格
    async fetchEditTableData() {
      if (!this.arrangeId) {
        this.$message.error('请先选择排课任务')
        return
      }
      // 获取校历信息
      const res = await qryCalendar({ calenderId: this.calenderId })
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
      if (!this.calendarData) {
        return
      }
      const { colHeaders, defaultData } = initTableData(
        this.calendarData,
        baseHeader,
        '2'
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
      if (group.cellKey.length >= group.weekHours) {
        this.$message.warning('该课时组已经排满')
        return
      }
      // 表格填值
      row[column.property].value = group.teaGroupName
      // 课时组修改
      const reg = /[1-9][0-9]*/g

      group.cellKey.push(
        `${row.lessionSeq.match(reg)[0] - 1},${column.property}`
      )
    },
    async saveBtn() {
      const modelString = []
      this.completeData.forEach(item => {
        const { teaGroupId, cellKey } = item
        modelString.push({ teaGroupId, cellKeyStr: cellKey.join('#') })
      })
      await saveGroupArrInfo({
        arrangeId: this.arrangeId,
        modelString: JSON.stringify(modelString)
      })
      this.$message.success('保存成功')
    },
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
    },
    // 新增课时组
    async addBtn() {
      await saveCoursePlanInfo({ arrangeId: this.arrangeId })
      this.$message.success('已成功新增课时组')
      this.addBtnDisabled = true
      this.getArrangeData()
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
    width: 25%;
    margin-right: 0.5%;
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
  > div {
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

