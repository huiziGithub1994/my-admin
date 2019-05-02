<template>
  <div>
    <!-- 分班及教室-->
    <div class="opera-area">
      <operation>
        <el-button type="primary" plain @click="saveBtn">保存</el-button>
      </operation>
    </div>
    <div class="data-area">
      <hot-table :settings="settings" ref="hotTableComponent"></hot-table>
    </div>
  </div>
</template>
<script>
import { HotTable } from '@handsontable/vue'
import 'handsontable/languages/zh-CN'

export default {
  components: {
    HotTable
  },
  data() {
    const sumWeekValidator = (value, callback) => {
      if (value !== '') {
        if (typeof +value !== 'number') {
          callback(false)
        } else {
          const valueStr = value + ''
          if (+value % 1 === 0 && valueStr.indexOf('.') < 0) {
            callback(true)
          } else {
            callback(false)
          }
        }
      } else {
        callback(true)
      }
    }
    return {
      hotInstance: null,
      // 表格数据
      settings: {
        language: 'zh-CN',
        contextMenu: ['row_above', 'row_below', 'remove_row'],
        className: 'htCenter',
        data: null,
        minRows: 15,
        dataSchema: {
          className: null,
          stuSum: null,
          roomAddress: null
        },
        rowHeaders: true,
        colHeaders: ['教学班级', '学生人数', '教学地点'],
        columns: [
          { data: 'className', trimWhitespace: true },
          {
            data: 'stuSum',
            type: 'numeric',
            trimWhitespace: true,
            validator: sumWeekValidator,
            allowInvalid: true
          },
          {
            data: 'roomAddress',
            trimWhitespace: true,
            type: 'dropdown',
            source: ['高二1班', '高二2班']
          }
        ],
        height: document.body.clientHeight - 280,
        colWidths: [300, 150, 350]
      }
    }
  },
  mounted() {
    this.hotInstance = this.$refs.hotTableComponent.hotInstance
  },
  methods: {
    async getTableData(gradeId) {},
    // 保存按钮
    async saveBtn() {}
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.opera-area {
  overflow: hidden;
  > div {
    display: inline-block;
    float: right;
  }
}
.data-area {
  margin-top: 10px;
}
</style>
