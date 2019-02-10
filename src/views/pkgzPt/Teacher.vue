<!-- 教师禁排Tab页-->
<template>
  <div class="content">
    <div class="left">
      <div :style="{height:treeHeight}" class="tree-wapper">
        <el-tree ref="tree" :data="treeData" class="filter-tree" @current-change="treeCurrentChange"/>
      </div>
    </div>
    <div class="right">
      <div class="teacher">
        <span>
          <label>{{ teacher.label }}</label>老师的教学任务
        </span>
        <el-button type="primary" plain>保存</el-button>
      </div>
      <div class="taskTable">
        <el-table ref="table" :data="tableData" tooltip-effect="dark" highlight-current-row style="width: 100%" @current-change="tableCurrentChange">
          <el-table-column type="index" width="55" label="序号"></el-table-column>
          <el-table-column label="任教班级" property="class_name"></el-table-column>
          <el-table-column label="任教课程" property="course_name"></el-table-column>
          <el-table-column label="总节次" property="class_hours"></el-table-column>
          <!-- <el-table-column label="已排节次" property="alreadyArrange"></el-table-column>
          <el-table-column label="未排节次" property="noArrange"></el-table-column>-->
        </el-table>
      </div>
      <p class="tip">
        <label>操作说明：</label>选择上面班级单击固排；双击下面列表可安排禁排
      </p>
      <div class="my-table advanceArrange">
        <el-table ref="singleTable" :data="arrangeTableData" style="width: 100%" border @cell-click="cellClick" :cell-class-name="cellClassName">
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
import {
  qryCourseListByArrangeId,
  qryTeaTaskListByTeaId,
  getTeacherTimetable
} from '@/api/pkgzPt'
import { qryCalendar } from '@/api/base'
import { mapGetters } from 'vuex'

export default {
  data() {
    const h = 360
    const treeH = document.body.clientHeight - h
    return {
      arrangeId: sessionStorage.getItem('local_arrangeId'),
      teacher: {},
      // tree 高度
      treeHeight: treeH + 'px',
      // tree 的数据s
      treeData: [],
      // 教学任务表格数据
      tableData: [],
      // 校历数据
      calendarData: [],
      // 排课任务表格数据
      arrangeTableData: [],
      // 表格表头
      colHeaders: []
    }
  },
  computed: {
    ...mapGetters(['calenderId'])
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getTreeData()
    this.fetchCalendarData()
  },
  mounted() {
    this.hotInstance = this.$refs.hotTable.hotInstance
  },
  methods: {
    // 获取树节点的数据
    async getTreeData() {
      const res = await qryCourseListByArrangeId({ arrangeId: this.arrangeId })
      this.treeData = res.DATA
    },
    // 树节点选中项改变时
    async treeCurrentChange(data) {
      if (data.children) return
      this.teacher = data
      const res = await qryTeaTaskListByTeaId({
        arrangeId: this.arrangeId,
        teaId: data.id
      })
      this.tableData = res.DATA
    },
    // 教学任务表格选中行
    async tableCurrentChange(currentRow) {
      this.initEditTableData()
      this.fillCalendarData()
      // 获取教师的课表
      const res = await getTeacherTimetable()
      // 填充课表
      res.DATA.calFixList.forEach(item => {
        const [row, col] = item.cellKey.split(',').map(x => Number(x))
        this.hotInstance.setDataAtRowProp(row, col, item.cellValue)
      })
    },
    // 获取校历表格数据并初始化表格
    async fetchCalendarData() {
      // 获取校历信息
      const res = await qryCalendar({ calenderId: this.calenderId })
      this.calendarData = res.DATA
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
    // 数据填充表格 并 修改表格配置，校历信息中的内容为不可修改
    fillCalendarData() {
      const { calFixList } = this.calendarData
      const readOnlyCell = []
      calFixList.forEach(item => {
        const [row, col] = item.cellKey.split(',').map(x => Number(x))
        readOnlyCell.push(`${row},${col + 1}`)
        this.hotInstance.setDataAtRowProp(row, col, item.cellValue)
      })
      this.hotInstance.updateSettings({
        cells: function(row, col) {
          var cellProperties = {}
          if (readOnlyCell.includes(`${row},${col}`)) {
            cellProperties.readOnly = true
          }
          return cellProperties
        }
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.content {
  > .left {
    float: left;
    width: 250px;
    > .tree-wapper {
      border: 1px solid #dddddd;
      overflow: auto;
    }
  }
  > .right {
    margin-left: 260px;
  }
}
.teacher {
  overflow: hidden;
  margin-bottom: 5px;
  span {
    margin-right: 5px;
    position: relative;
    top: 10px;
    > label {
      color: red;
    }
  }
  button {
    float: right;
  }
}
.taskTable {
  border: 1px solid #dddddd;
}
.tip {
  margin: 10px 0;
}
</style>

