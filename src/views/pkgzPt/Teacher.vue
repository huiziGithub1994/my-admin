<!-- 教师禁排Tab页-->
<template>
  <div class="content">
    <div class="left">
      <el-input v-model="filterText" placeholder="可按姓名模糊检索" ref="filter"/>
      <div :style="{height:treeHeight}" class="tree-wapper">
        <el-tree ref="tree" :data="treeData" :props="defaultProps" :filter-node-method="filterNode" class="filter-tree" default-expand-all @current-change="treeCurrentChange"/>
      </div>
    </div>
    <div class="right">
      <div class="teacher">
        <span>{{ teacher.label }}</span>老师的教学任务
      </div>
      <div class="taskTable">
        <el-table ref="table" :data="tableData" tooltip-effect="dark" highlight-current-row style="width: 100%" @current-change="tableCurrentChange">
          <el-table-column type="index" width="55" label="序号"></el-table-column>
          <el-table-column label="任教班级" property="teachClass"></el-table-column>
          <el-table-column label="任教课程" property="teachCourse"></el-table-column>
          <el-table-column label="总节次" property="sum"></el-table-column>
          <el-table-column label="已排节次" property="alreadyArrange"></el-table-column>
          <el-table-column label="未排节次" property="noArrange"></el-table-column>
        </el-table>
      </div>
      <p class="tip">
        <label>操作说明：</label>选择上面班级单击固排；双击下面列表可安排禁排
      </p>
      <div>
        <hot-table :settings="settings" ref="hotTable"></hot-table>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getTeacherTreeData,
  getTeacherTeachTask,
  getTeacherTimetable
} from '@/api/pkgzPt'
import { HotTable } from '@handsontable/vue'
import { qryCalendar } from '@/api/base'
import { initTableData } from '@/utils/inlineEditTable'

export default {
  components: {
    HotTable
  },
  data() {
    const h = 360
    const treeH = document.body.clientHeight - h
    return {
      // 按姓名模糊检索
      filterText: '',
      teacher: {},
      // tree 高度
      treeHeight: treeH + 'px',
      // tree 的prop
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // tree 的数据s
      treeData: [],
      // 教学任务表格数据
      tableData: [],
      // 校历数据
      calendarData: [],
      // 安排教学任务表格数据
      editTableData: [],
      // 表格配置项
      settings: {
        data: null,
        colHeaders: [],
        columns: [],
        colWidths: 120,
        height: 220
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getTreeData()
    this.fetchEditTableData()
  },
  mounted() {
    this.hotInstance = this.$refs.hotTable.hotInstance
  },
  methods: {
    // 获取树节点的数据
    async getTreeData() {
      const res = await getTeacherTreeData()
      this.treeData = res.DATA
    },
    // 按姓名模糊检索
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 树节点选中项改变时
    async treeCurrentChange(data) {
      if (data.children) return
      this.teacher = data
      const res = await getTeacherTeachTask()
      this.tableData = res.DATA
      this.initEditTableData()
      // 将校历信息填充表格 并 修改表格配置，校历信息中的内容为不可修改
      this.fillCalendarData()
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
    async fetchEditTableData() {
      // 获取校历信息
      const res = await qryCalendar({ schoolId: '111' })
      this.calendarData = res.DATA
      this.initEditTableData()
      // 将校历信息填充表格 并 修改表格配置，校历信息中的内容为不可修改
      this.fillCalendarData()
    },
    // 初始化表格的头部、行列、数据为空
    initEditTableData() {
      const baseHeader = ['节次/星期']
      const { colHeaders, columns, defaultData } = initTableData(
        this.calendarData,
        baseHeader
      )
      this.settings.colHeaders = colHeaders
      this.settings.columns = columns
      this.settings.data = defaultData
      this.hotInstance.loadData(defaultData)
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
      margin-top: 10px;
    }
  }
  > .right {
    margin-left: 260px;
  }
}
.teacher {
  height: 32px;
  line-height: 32px;
  margin-bottom: 10px;
  span {
    margin-right: 5px;
    color: red;
  }
}
.taskTable {
  border: 1px solid #dddddd;
}
.tip {
  margin: 10px 0;
}
</style>

