<template>
  <div>
    <div class="opera-area">
      <p class="tip">
        <label>温馨提示：</label>"批量生成班级"可以生成相同前缀的班级名称。
      </p>
      <operation>
        <el-button type="primary" plain>批量生成班级</el-button>
        <el-button type="primary" plain @click="saveBtn">保存</el-button>
      </operation>
    </div>
    <div class="data-area">
      <div class="left" :style="{height:treeHeight+'px'}">
        <el-tree ref="treeRef" :data="treeData" node-key="id" default-expand-all :expand-on-click-node="false" highlight-current @node-click="treeNodeClick"></el-tree>
      </div>
      <div class="right">
        <hot-table :settings="settings" ref="hotTableComponent"></hot-table>
      </div>
    </div>
  </div>
</template>
<script>
import { HotTable } from '@handsontable/vue'
import 'handsontable/languages/zh-CN'
import { qrySegGradeTree } from '@/api/njkc'
import { qryClassesByGradeId, saveClassesList } from '@/api/njbj'
import { columnsWidth } from '@/utils/businessUtil'
// 原始表格数据
let originTableData = {}
let delTableData = []
export default {
  components: {
    HotTable
  },
  data() {
    return {
      hotInstance: null,
      dialogVisible: false, // 弹窗
      treeHeight: document.body.clientHeight - 170,
      // 树数组
      treeData: [],
      // 表格数据
      settings: {
        language: 'zh-CN',
        contextMenu: ['row_above', 'row_below', 'remove_row'],
        className: 'htCenter',
        data: null,
        minRows: 15,
        dataSchema: {
          className: null,
          building: null,
          classRoom: null,
          chargeTea: null,
          schoolZone: null,
          dispOrder: null
        },
        rowHeaders: true,
        colHeaders: [
          '班级名称(简称)',
          '楼房',
          '教室',
          '班主任',
          '所在校区',
          '显示顺序'
        ],
        columns: [
          { data: 'className', trimWhitespace: true },
          { data: 'building', trimWhitespace: true },
          { data: 'classRoom', trimWhitespace: true },
          { data: 'chargeTea', trimWhitespace: true },
          { data: 'schoolZone', trimWhitespace: true },
          { data: 'dispOrder', type: 'numeric', trimWhitespace: true }
        ],
        height: document.body.clientHeight - 170,
        colWidths: columnsWidth(
          ['20%', '15%', '15%', '15%', '20%', '15%'],
          document.body.clientWidth - 200 - 390
        ),
        beforeRemoveRow: (index, amount, physicalRows, source) => {
          const data = this.hotInstance.getSourceData()
          physicalRows.forEach(row => {
            if (data[row].classId) {
              delTableData.push(Object.assign({}, data[row], { action: '2' }))
            }
          })
        }
      }
    }
  },
  mounted() {
    this.hotInstance = this.$refs.hotTableComponent.hotInstance
    this.getTreeData()
  },
  methods: {
    // 学段(专业)/年级
    async getTreeData() {
      const res = await qrySegGradeTree()
      this.treeData = [res.DATA]
    },
    // 树节点被点击时
    treeNodeClick(data) {
      const { gradeId } = data
      if (!gradeId) {
        originTableData = {}
        delTableData = []
        this.hotInstance.loadData([])
        return
      }
      this.getTableData(gradeId)
    },
    async getTableData(gradeId) {
      const res = await qryClassesByGradeId({ gradeId })
      const data = res.DATA
      originTableData = {}
      delTableData = []
      data.forEach(item => {
        originTableData[item.classId] = Object.assign({}, item)
      })
      this.hotInstance.loadData(data)
    },
    // 保存按钮
    async saveBtn() {
      const currentNode = this.$refs.treeRef.getCurrentNode()
      if (!currentNode || (currentNode && !currentNode.gradeId)) {
        this.$message.warning('请选择年级')
        return
      }

      const data = this.hotInstance.getSourceData()
      const ressult = this.handleSaveData(data, originTableData)
      const len = ressult.length
      if (len === 0) {
        this.$message.warning('请先修改数据后，再保存')
        return
      }
      const validateRows = []
      for (let i = 0; i <= len; i++) {
        validateRows.push(i)
      }
      this.hotInstance.validateRows(validateRows, async valid => {
        if (valid) {
          await saveClassesList(ressult)

          this.$message.success('保存成功')
          this.getTableData(currentNode.gradeId)
        } else {
          this.$message.warning('字段校验不通过')
        }
      })
    },
    handleSaveData(newData, oldData) {
      const result = []
      const currentNode = this.$refs.treeRef.getCurrentNode()
      if (!currentNode) return
      const { segId, gradeId } = currentNode
      newData.forEach((item, index) => {
        const { className, classId } = item
        if (className) {
          if (JSON.stringify(oldData[classId]) !== JSON.stringify(item)) {
            // 修改
            if (item.classId) {
              result.push(Object.assign({}, item, { action: '1' }))
            } else {
              // 新增
              result.push(
                Object.assign({}, item, { action: '0', segId, gradeId })
              )
            }
          }
        }
      })
      return [...result, ...delTableData]
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
p.tip {
  display: inline-block;
  position: relative;
  top: 10px;
}
.opera-area {
  overflow: hidden;
  > div {
    display: inline-block;
    float: right;
  }
}
.data-area {
  margin-top: 10px;
  > .left {
    float: left;
    width: 300px;
    margin-right: 10px;
    border: 1px solid #dddddd;
    overflow: auto;
  }
  // > div.right {
  //   > div {
  //     border: 1px solid #dddddd;
  //   }
  // }
}
</style>
