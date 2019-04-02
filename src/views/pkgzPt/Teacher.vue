<!-- 教师禁排Tab页-->
<template>
  <div class="content">
    <div class="left">
      <div :style="{height:treeHeight}" class="tree-wapper">
        <el-tree ref="tree" :data="treeData" class="filter-tree" highlight-current @current-change="treeCurrentChange"/>
      </div>
    </div>
    <div class="right">
      <div class="teacher">
        <span>
          <label>{{ teacher.label }}</label>老师的教学任务
        </span>
        <div>
          <el-radio-group v-model="arrangeType">
            <el-radio :label="1">禁排</el-radio>
            <el-radio :label="2">固排</el-radio>
          </el-radio-group>
          <el-button type="primary" plain @click="saveBtn">保存</el-button>
        </div>
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
        <label>操作说明：</label>1.选择“禁排”单选框，再点击下面的表格可设置禁排。2.选择“固排”单选框，先选中上面表格的，再点击下面的表格可设置固排。
      </p>
      <div class="my-table advanceArrange">
        <el-table ref="singleTable" :data="arrangeTableData" style="width: 100%" border @cell-click="cellClick" :cell-class-name="cellClassName">
          <el-table-column :property="index === 0 ? 'rowOrder' : 'col'+index+'M'" :label="item" v-for="(item,index) in colHeaders" :key="index">
            <template slot-scope="scope">
              <div v-if="index === 0">{{ scope.row.rowOrder|callessionSeq }}</div>
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
import {
  saveCommPreArrangeList,
  qryCourseListByArrangeId,
  qryTeaTaskListByTeaId
} from '@/api/pkgzPt'
import { mapGetters } from 'vuex'
import mixin from './handle'
export default {
  mixins: [mixin],
  data() {
    const h = 360
    const treeH = document.body.clientHeight - h
    return {
      arrangeType: 1, // 禁排、固排
      arrangeId: sessionStorage.getItem('local_arrangeId'),
      teacher: {},
      // tree 高度
      treeHeight: treeH + 'px',
      // tree 的数据s
      treeData: [],
      // 教学任务表格数据
      tableData: [],
      currentRow: null, // 教学任务表格选中行
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
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getTreeData()
    this.fetchCalendarData()
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
      this.arrangeTableData = []
      this.teacher = data
      // 获取任教表格数据
      const res = await qryTeaTaskListByTeaId({
        arrangeId: this.arrangeId,
        teaId: data.id
      })
      this.tableData = res.DATA
      // 获取排课表格数据，并填入校历数据
      const params = {
        arrangeId: this.arrangeId,
        rows: this.count,
        gradeClassId: data.id,
        arrangeType: '3'
      }
      this.queryArrangeTableData(params)
    },
    // 教学任务表格选中行
    tableCurrentChange(row) {
      this.currentRow = row
    },
    // 排课表格的点击
    cellClick(row, column) {
      if (this.arrangeType === 2 && !this.currentRow) {
        this.$message.warning('请先选择要固排的任教课程')
        return
      }
      const valid = this.cellClickValid(row, column)
      if (!valid) return
      // 表格填值
      let tempMean = '禁排'
      if (this.arrangeType === 2) {
        const { class_name, course_name } = this.currentRow
        tempMean = class_name + ',' + course_name
      }
      row[column.property] = {
        cellMeaning: tempMean,
        cellType: this.arrangeType + ''
      }
    },
    // 保存按钮
    async saveBtn() {
      if (Object.keys(this.teacher).length === 0) {
        this.$message.warning('请先选择教师')
        return
      }
      const params = {
        arrangeId: this.arrangeId,
        sjsCommPreArrangeList: this.arrangeTableData,
        gradeClassId: this.teacher.id,
        arrangeType: '3'
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
  > div {
    float: right;
    > button {
      margin-left: 20px;
    }
  }
}
.taskTable {
  border: 1px solid #dddddd;
}
.tip {
  margin: 10px 0;
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

