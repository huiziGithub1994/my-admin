<template>
  <!--  学科分层及课时 tab页  按成绩分层-->
  <div>
    <div class="top" style="margin-bottom:10px">
      <condition>
        <div class="condition">
          <label>课程名称</label>
          <el-select v-model="search['a.course_id01']" clearable @change="fetchData">
            <el-option v-for="(item,index) in courseOptions" :key="index" :label="item.courseName" :value="item.courseId"></el-option>
          </el-select>
        </div>
      </condition>
      <operation>
        <el-button type="primary" plain @click="queryBtn">查询</el-button>
        <el-button type="primary" plain @click="saveBtn">保存</el-button>
      </operation>
    </div>
    <div class="hottable-wappper">
      <hot-table :settings="settings" ref="hotTableComponent"></hot-table>
    </div>
  </div>
</template>
<script>
import { HotTable } from '@handsontable/vue'
import 'handsontable/languages/zh-CN'
import { columnsWidth } from '@/utils/businessUtil'

export default {
  components: {
    HotTable
  },
  data() {
    return {
      search: {
        'a.course_id01': ''
      },
      // 课程名称下拉菜单数据
      courseOptions: [],
      // 表格数据
      settings: {
        language: 'zh-CN',
        contextMenu: ['row_above', 'row_below', 'remove_row'],
        className: 'htCenter',
        data: null,
        minRows: 15,
        dataSchema: {
          courseName: null,
          sumWeek: null,
          layerFlag: null,
          teaType: null,
          dispOrder: null
        },
        rowHeaders: true,
        colHeaders: [
          '课程名称',
          '分层类型',
          '周课时(节)',
          '最高分',
          '最低分',
          '显示顺序'
        ],
        columns: [
          { data: 'courseName', trimWhitespace: true },
          { data: 'courseLayerName', trimWhitespace: true },
          { data: 'weekHours', type: 'numeric', trimWhitespace: true },
          { data: 'lowScore', type: 'numeric', trimWhitespace: true },
          { data: 'heightScore', type: 'numeric', trimWhitespace: true },
          { data: 'dispOrder', type: 'numeric', trimWhitespace: true }
        ],
        height: document.body.clientHeight - 170,
        colWidths: columnsWidth(
          ['25%', '20%', '15%', '15%', '15%', '10%'],
          document.body.clientWidth - 390
        )
      }
    }
  },
  methods: {
    // 获取表格数据
    async fetchData() {},
    queryBtn() {},
    saveBtn() {}
  }
}
</script>

<style scoped>
.top {
  margin-bottom: 10px;
}
</style>

