<template>
  <!-- 资源评估-->
  <div>
    <el-button type="primary">运算走班所需资源</el-button>
    <div class="desc">
      <table>
        <tr>
          <td width="150px">最低上课教室</td>
          <td width="70px">8 间</td>
          <td width="150px">当前可用上课教室</td>
          <td>10 间</td>
        </tr>
        <tr>
          <td>最少上课学时(节)</td>
          <td>15 课时</td>
          <td></td>
          <td></td>
        </tr>
      </table>
    </div>
    <p class="tip">
      <label>操作提示：</label>请单击表格指定上课节次，单击已指定的节次可取消指定。
    </p>
    <div class="hotTable">
      <hot-table :settings="settings" ref="hotTableComponent"></hot-table>
    </div>
    <div class="saveWapper">
      <el-button type="primary">保存</el-button>
    </div>
  </div>
</template>

<script>
import { HotTable } from '@handsontable/vue'
import { qrySourceAssessment } from '@/api/pkgz'
import { qryCalendar } from '@/api/base'
import { initTableData } from '@/utils/inlineEditTable'

export default {
  components: {
    HotTable
  },
  data() {
    const theThis = this
    return {
      // table实例
      hotInstance: null,
      // 表格数据
      settings: {
        data: null,
        colHeaders: [],
        columns: [],
        colWidths: 100,
        height: 220,
        beforeOnCellMouseDown: function(e, coords) {
          const { row, col } = coords
          const oldData = theThis.hotInstance.getDataAtCell(row, col)
          if (oldData === '√') {
            theThis.hotInstance.setDataAtCell(coords.row, coords.col, '')
          } else {
            theThis.hotInstance.setDataAtCell(coords.row, coords.col, '√')
          }
        },
        afterValidate: function() {
          console.log(1)
        }
      }
    }
  },
  created() {
    this.fetchEditTableData()
    // this.fetchFormData()
  },
  mounted() {
    this.hotInstance = this.$refs.hotTableComponent.hotInstance
    console.log(this.hotInstance)
  },
  methods: {
    // 获取表单数据
    async fetchFormData() {
      const res = await qrySourceAssessment({ schoolId: '111' })
      this.data = res.DATA
      // 数据回填时的实现方式:先根据作息安排初始化表格的头部、行列、数据为空。再根据请求返回的数据填充表格
      this.initEditTableData()
      // 数据填充表格
      this.fillTableData()
      this.$nextTick(function() {
        this.$refs['baseInfoRef'].clearValidate()
      })
    },
    // 获取校历表格数据并初始化表格
    async fetchEditTableData() {
      // 获取校历信息
      const res = await qryCalendar({ schoolId: '111' })
      this.calendarData = res.DATA
      this.initEditTableData()
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
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.f-right {
  float: right;
}
.desc {
  margin: 10px 0;
  > table {
    height: 60px;
  }
}
.hotTable {
  margin-top: 5px;
}
.saveWapper {
  width: 600px;
  overflow: hidden;
  button {
    float: right;
  }
}
</style>
