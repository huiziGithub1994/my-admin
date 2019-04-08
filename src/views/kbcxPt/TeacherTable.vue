<template>
  <div>
    <div class="left">
      <div class="checkboxGroup">
        <el-checkbox-group v-model="showType">
          <el-checkbox label="1">显示教室</el-checkbox>
          <el-checkbox label="2">显示时间</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="treeWrapper" :style="{height:treeHeight+ 'px'}">
        <el-tree ref="treeRef" :data="treeData" node-key="id" :expand-on-click-node="false" highlight-current @node-click="treeNodeClick"></el-tree>
      </div>
    </div>
    <div class="right">
      <div class="teaTableName"></div>
      <el-table ref="singleTable" :data="tableData" style="width:850px" border>
        <el-table-column
          :property="index === 0 ? 'lessionSeq' : index-1+''"
          :label="item"
          v-for="(item,index) in colHeaders"
          :key="index"
          :width="index === 0 ? '100px':'auto'"
          :align="index === 0 ? 'center':'left'"
          header-align="center"
        >
          <template slot-scope="scope">
            <div v-if="index === 0">{{ scope.row.lessionSeq }}</div>
            <div v-else-if="Object.keys(scope.row[index-1]).length">
              <div>{{ scope.row[index-1].courseName }} - {{ scope.row[index-1].className+'班' }}</div>
              <div v-show="showType.length&&showType.includes('1')">{{ scope.row[index-1].classRoom }}</div>
              <div v-show="showType.length&&showType.includes('2')">{{ scope.row[index-1].courseTime }}</div>
            </div>
            <template v-else>
              <div></div>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { qryCourseListByArrangeId } from '@/api/pkgzPt'
import { qryTeaTimetable } from '@/api/kbcxPt'
import { initTableData } from '@/utils/inlineEditTable'
export default {
  data() {
    const h = 230
    const treeH = document.body.clientHeight - h
    return {
      // tree 高度
      treeHeight: treeH,
      // tree 的数据s
      treeData: [],
      loading: false,
      arrangeId: sessionStorage.getItem('local_arrangeId'),
      showType: [],
      tableData: [],
      colHeaders: []
    }
  },
  created() {
    this.getTreeData()
  },
  methods: {
    // 获取树节点的数据
    async getTreeData() {
      const res = await qryCourseListByArrangeId({ arrangeId: this.arrangeId })
      this.treeData = res.DATA
    },
    // 班级的点击
    async treeNodeClick(data) {
      if (data.level !== '2') return
      const res = await qryTeaTimetable({
        arrangeId: this.arrangeId,
        tmpFieldVal: data.label
      })
      const { calenderData, timetableData } = res.DATA
      if (timetableData.length === 0) {
        this.tableData = []
        this.$message.info('未检索到数据')
        return
      }
      this.renderTable(calenderData, timetableData)
    },
    // 初始化表格的头部、行列、数据为空
    renderTable(calenderData, timetableData) {
      const baseHeader = ['节次/星期']
      const { colHeaders, defaultData } = initTableData(
        calenderData,
        baseHeader,
        '2'
      )
      this.colHeaders = colHeaders
      const theData = JSON.parse(JSON.stringify(defaultData))
      timetableData.forEach(item => {
        if (item.classRoom) {
          const [row, col] = item.cellKey.split(',').map(x => Number(x))
          theData[row][col] = item
        }
      })
      this.tableData = theData
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.left {
  float: left;
  width: 250px;
  margin-right: 10px;
}
.checkboxGroup {
  margin-bottom: 10px;
}
.treeWrapper {
  border: 1px solid #dddddd;
  overflow: auto;
}
.teaTableName {
  height: 20px;
  line-height: 20px;
  margin-bottom: 8px;
}
</style>
