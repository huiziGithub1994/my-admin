<!-- 年级/班级固排禁排Tab页-->
<template>
  <div>
    <div class="operation-area">
      <div>
        <el-radio-group v-model="arrangeType">
          <el-radio :label="1">禁排</el-radio>
          <el-radio :label="2">固排</el-radio>
        </el-radio-group>
        <el-button type="primary" plain @click="saveBtn">保存</el-button>
      </div>
    </div>
    <div class="content" :style="{'min-height':treeHeight+20+ 'px'}">
      <div class="left" :style="{height:treeHeight+ 'px'}">
        <el-tree ref="treeRef" :data="treeData" node-key="id" default-expand-all :expand-on-click-node="false" highlight-current @node-click="treeNodeClick"></el-tree>
      </div>
      <div class="right my-table advanceArrange">
        <p class="tip">
          <label>操作提示：</label>如选择年级是对整个以下的班级进行批量设置禁排或固排
        </p>
        <el-table ref="singleTable" :data="arrangeTableData" style="width: 80%;max-width:900px;" border @cell-click="cellClick" :cell-class-name="cellClassName">
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
import { qrySegGradeTree } from '@/api/njkc'
import { saveCommPreArrangeList } from '@/api/pkgzPt'
import { mapGetters } from 'vuex'
import mixin from './handle'
export default {
  mixins: [mixin],
  data() {
    const h = 340
    const treeH = document.body.clientHeight - h
    return {
      arrangeType: 1,
      arrangeId: sessionStorage.getItem('local_arrangeId'),
      // 学段/专业
      options: [
        { value: '01', label: '小学' },
        { value: '02', label: '初中' },
        { value: '03', label: '高中' }
      ],
      // tree 高度
      treeHeight: treeH,
      // tree 的数据s
      treeData: [],
      // 校历数据
      calendarData: [],
      calendarCell: [], // 记录校历数据
      // 表格数据
      arrangeTableData: [],
      // 表格表头
      colHeaders: [],
      count: undefined // 表格的行
    }
  },
  computed: {
    ...mapGetters(['calenderId'])
  },
  created() {
    this.getTreeData()
    this.fetchCalendarData()
  },
  mounted() {},
  methods: {
    // 获取树节点的数据
    async getTreeData() {
      const res = await qrySegGradeTree({ arrangeId: this.arrangeId })
      this.treeData = [res.DATA]
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
    // 树节点的点击事件
    treeNodeClick(data) {
      this.arrangeTableData = []
      if (data.level <= 1) return
      const { gradeId, classId } = data
      const params = { arrangeId: this.arrangeId, rows: this.count }
      if (classId) {
        params.gradeClassId = classId
        params.arrangeType = '2'
      } else {
        params.gradeClassId = gradeId
        params.arrangeType = '1'
      }
      // 获取排课表格数据，并填入校历数据
      this.queryArrangeTableData(params)
    },
    // 保存按钮
    async saveBtn() {
      const currentNode = this.$refs.treeRef.getCurrentNode()
      if (!currentNode) {
        this.$message.warning('请选择年级或班级')
        return
      }
      const { gradeId, classId } = currentNode
      const params = {
        arrangeId: this.arrangeId,
        sjsCommPreArrangeList: this.arrangeTableData
      }
      if (classId) {
        params.gradeClassId = classId
        params.arrangeType = '2'
      } else {
        params.gradeClassId = gradeId
        params.arrangeType = '1'
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
  > .left {
    float: left;
    width: 250px;
    overflow: auto;
    border: 1px solid #dddddd;
  }
  > .right {
    > p {
      margin: 10px 0 5px 0;
    }
    margin-left: 260px;
  }
}
.operation-area {
  overflow: hidden;
  > div {
    overflow: hidden;
    float: right;
    > button {
      margin-left: 30px;
    }
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

