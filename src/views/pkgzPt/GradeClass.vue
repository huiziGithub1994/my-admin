<!-- 年级/班级固排禁排Tab页-->
<template>
  <div>
    <div class="operation-area">
      <el-button type="primary" plain>保存</el-button>
    </div>
    <div class="content">
      <p class="tip">
        <label>操作提示：</label>如选择年级是对整个以下的班级进行批量设置禁排或固排
      </p>
      <div class="left" :style="{height:treeHeight}">
        <el-tree ref="treeRef" :data="treeData" node-key="id" default-expand-all :expand-on-click-node="false" highlight-current @node-click="treeNodeClick"></el-tree>
      </div>
      <div class="right">
        <hot-table :settings="settings" ref="gradeClassHotTable"></hot-table>
      </div>
    </div>
  </div>
</template>
<script>
import { qrySegGradeTree } from '@/api/njkc'
import { HotTable } from '@handsontable/vue'
import { qryCalendar } from '@/api/base'
import { initTableData } from '@/utils/inlineEditTable'
import { mapGetters } from 'vuex'

export default {
  components: {
    HotTable
  },
  data() {
    const h = 380
    const treeH = document.body.clientHeight - h
    return {
      arrangeId: sessionStorage.getItem('local_arrangeId'),
      // 学段/专业
      options: [
        { value: '01', label: '小学' },
        { value: '02', label: '初中' },
        { value: '03', label: '高中' }
      ],
      // tree 高度
      treeHeight: treeH + 'px',
      // tree 的数据s
      treeData: [],
      // 校历数据
      calendarData: [],
      // 表格数据
      data: [],
      // 表格配置项
      settings: {
        data: null,
        colHeaders: [],
        columns: [],
        colWidths: 120,
        height: treeH
      }
    }
  },
  computed: {
    ...mapGetters(['calenderId'])
  },
  created() {
    this.getTreeData()
    this.fetchTableData()
  },
  mounted() {
    this.hotInstance = this.$refs.gradeClassHotTable.hotInstance
  },
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
      this.initEditTableData()
      // 将校历信息填充表格 并 修改表格配置，校历信息中的内容为不可修改
      this.fillCalendarData()
      // 获取表格信息并填充表格
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
    // 将校历信息填充表格  并 修改表格配置，校历信息中的内容为不可修改
    fillCalendarData() {
      const { calFixList } = this.calendarData
      const readOnlyCell = []
      console.log(calFixList)
      calFixList.forEach(item => {
        const [row, col] = item.cellKey.split(',').map(x => Number(x))
        readOnlyCell.push(`${row},${col + 1}`)
        this.hotInstance.setDataAtRowProp(row, col, item.cellValue)
      })
      // console.log(readOnlyCell)
      this.hotInstance.updateSettings({
        cells: function(row, col) {
          var cellProperties = {}
          if (readOnlyCell.includes(`${row},${col}`)) {
            cellProperties.readOnly = true
          }
          return cellProperties
        }
      })
    },
    treeNodeClick(data) {
      console.log(data)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.content {
  > p {
    margin: 10px 0 5px 0;
    padding-left: 260px;
  }
  > .left {
    float: left;
    width: 250px;
    overflow: auto;
    border: 1px solid #dddddd;
  }
  > .right {
    margin-left: 260px;
  }
}
.operation-area {
  float: right;
}
</style>

