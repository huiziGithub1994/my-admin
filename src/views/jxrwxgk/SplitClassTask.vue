<!-- 走班教学任务-->
<template>
  <div>
    <div class="opera-area">
      <div class="right">
        <el-button type="primary" plain @click="saveArrange" :loading="saveBtn">保存</el-button>
      </div>
    </div>
    <div class="data-area">
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" :height="tableH" v-loading="loading" border>
        <el-table-column label="学段/专业" property="segName" fixed width="100px"></el-table-column>
        <el-table-column label="年级" property="gradeName" fixed></el-table-column>
        <el-table-column label="教学班级" property="className" fixed></el-table-column>
        <el-table-column label="科目" property="chargeTeaName" min-width="250px" show-overflow-tooltip fixed></el-table-column>
        <el-table-column :label="item.label" v-for="(item,index) in tableColumns" :key="item.property" width="100px">
          <template slot-scope="scope">
            <el-input v-model="scope.row[item.property]" v-if="scope.row.chargeTeaName.indexOf(item.label)>-1 || index&&scope.row.chargeTeaName.indexOf(tableColumns[index-1].label)>-1"/>
            <div v-else>{{ scope.row[item.property] }}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { qryCourseTaskList } from '@/api/skrwPt'
export default {
  data() {
    const h = 240
    const tableH = document.body.clientHeight - h
    return {
      tableH,
      loading: false,
      saveBtn: false, // 保存任课安排
      hotInstance: null,
      showTable: false,
      arrangeId: sessionStorage.getItem('local_arrangeId'),
      gradeStr: sessionStorage.getItem('gradeStr'),
      tableColumns: [
        { label: '政治', property: 'col1' },
        { label: '节数', property: 'col2' },
        { label: '历史', property: 'col3' },
        { label: '节数', property: 'col4' },
        { label: '地理', property: 'col5' },
        { label: '节数', property: 'col6' },
        { label: '物理', property: 'col7' },
        { label: '节数', property: 'col8' },
        { label: '化学', property: 'col9' },
        { label: '节数', property: 'col10' },
        { label: '生物', property: 'col11' },
        { label: '节数', property: 'col12' },
        { label: '技术', property: 'col13' },
        { label: '节数', property: 'col14' }
      ],
      tableData: [
        {
          arrangeId: 'c7f54c579e94448794f637cc90b758aa',
          chargeTeaName: '化学选考、地理选考',
          classId: '66eac589488042198b22f3e0c330c9a1',
          className: 'C1701',
          col1: '李静',
          col2: '4',
          col3: '颜婷',
          col4: '4',
          col5: '彭阳',
          col6: '4',
          col7: '张长鹰',
          col8: '2',
          col9: '黄德昌',
          col10: '2',
          col11: '张鑫慧',
          col12: '2',
          col13: '张鑫慧',
          col14: '2',
          rsId: 'dab9b9aa049e4838a16de2e578c24d55',
          segId: 'db40e982d29144309c568f8ee8449721',
          segName: '初中',
          gradeName: '初二'
        }
      ]
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    async getTableData() {
      this.loading = true
      await qryCourseTaskList({
        arrangeId: this.arrangeId,
        gradeIdsStr: 'c9fe41ddc32643779c31df8b0e7dadc7'
      }).finally(() => {
        this.loading = false
      })
    },
    saveArrange() {}
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.opera-area {
  overflow: hidden;
  > .right {
    float: right;
  }
}
</style>
<style>
.columnClass {
  font-weight: bold;
  text-align: center;
}
</style>

