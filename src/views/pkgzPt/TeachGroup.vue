<!-- 教研组排Tab页-->
<template>
  <div class="content">
    <div class="left">
      <el-input v-model="filterText" placeholder="可按课程模糊检索" ref="filter"/>
      <div :style="{height:treeHeight}" class="tree-wapper">
        <el-tree ref="treeRef" :data="treeData" node-key="id" default-expand-all :filter-node-method="filterNode" highlight-current :expand-on-click-node="false" @node-click="treeNodeClick"/>
      </div>
    </div>
    <div class="right">
      <div class="tip">
        <label>操作说明：</label>选择左边的教研组再点击右边的表格进行禁排。建议在同一位置不要多个教研组禁排
        <el-button type="primary" plain @click="saveBtn">保存</el-button>
      </div>
      <div class="my-table advanceArrange">
        <el-table ref="singleTable" :data="arrangeTableData" style="width: 80%;max-width:900px;min-width:750px" border @cell-click="cellClick" :cell-class-name="cellClassName">
          <el-table-column :property="index === 0 ? 'rowOrder' : 'col'+index+'M'" :label="item" v-for="(item,index) in colHeaders" :key="index">
            <template slot-scope="scope">
              <div v-if="index === 0">第{{ scope.row.rowOrder }}节</div>
              <div v-else-if="scope.row['col'+index+'M']" class="cell-arrange">
                {{ scope.row['col'+index+'M'].cellMeaning }}
                <i class="el-icon-error" v-if="scope.row['col'+index+'M']" @click.stop="removeArrange(scope.row,index)"></i>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import { getTeachGroupTreeData, saveCommPreArrangeList } from '@/api/pkgzPt'
import { mapGetters } from 'vuex'
import mixin from './handle'
export default {
  mixins: [mixin],
  data() {
    const h = 320
    const treeH = document.body.clientHeight - h
    return {
      // 按姓名模糊检索
      arrangeId: sessionStorage.getItem('local_arrangeId'),
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
      // 排课任务表格数据
      arrangeTableData: [],
      // 表格表头
      colHeaders: [],
      count: undefined // 表格的行
    }
  },
  computed: {
    ...mapGetters(['calenderId'])
  },
  watch: {
    filterText(val) {
      this.$refs.treeRef.filter(val)
    }
  },
  created() {
    this.getTreeData()
    this.fetchCalendarData()
  },
  mounted() {},
  methods: {
    // 获取树节点的数据
    async getTreeData() {
      const res = await getTeachGroupTreeData({ arrangeId: this.arrangeId })
      this.treeData = res.DATA
    },
    // 按姓名模糊检索
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 树节点选中项改变时
    treeNodeClick(data) {
      this.arrangeTableData = []
      const params = {
        arrangeId: this.arrangeId,
        rows: this.count,
        gradeClassId: data.id,
        arrangeType: '4'
      }
      this.queryArrangeTableData(params)
    },
    // 排课表格的点击
    cellClick(row, column) {
      const valid = this.cellClickValid(row, column)
      if (!valid) return
      // 表格填值
      row[column.property] = {
        cellMeaning: '禁排',
        cellType: '1'
      }
    },
    async saveBtn() {
      const currentNode = this.$refs.treeRef.getCurrentNode()
      if (!currentNode) {
        this.$message.warning('请选择教研组')
        return
      }
      const params = {
        arrangeId: this.arrangeId,
        sjsCommPreArrangeList: this.arrangeTableData,
        gradeClassId: currentNode.id,
        arrangeType: '4'
      }
      await saveCommPreArrangeList(params)
      this.$message.success('保存成功')
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
.content {
  overflow: hidden;
  > .left {
    float: left;
    width: 250px;
    > .tree-wapper {
      border: 1px solid #dddddd;
      margin-top: 10px;
      overflow: auto;
    }
  }
  > .right {
    margin-left: 260px;
  }
}
.taskTable {
  border: 1px solid #dddddd;
}
.tip {
  height: 32px;
  line-height: 32px;
  margin-bottom: 10px;
  > button {
    float: right;
  }
}
.cell-arrange {
  position: relative;
  width: 100%;
  .el-icon-error {
    position: absolute;
    right: -5px;
    top: 4px;
    z-index: 10;
    font-size: 1.2rem;
    display: none;
  }
}
.cell-arrange > span {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  max-width: 100%;
  text-overflow: ellipsis;
}
</style>

