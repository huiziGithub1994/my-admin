<template>
  <div>
    <div class="opera-area">
      <p class="tip">
        <label>温馨提示：</label>平台可根据学校的办学类型可自动生成相关学段和对应的学科，用户只需要根据结果微调即可。
      </p>
      <operation>
        <el-button type="primary" plain>自动生成</el-button>
        <el-button type="primary" plain>下载模板</el-button>
        <el-button type="primary" plain>导入</el-button>
        <el-button type="primary" plain>保存</el-button>
      </operation>
    </div>
    <div class="data-area">
      <div class="left" :style="{height:treeHeight+'px'}">
        <el-tree :data="treeData" node-key="id" default-expand-all :expand-on-click-node="false">
          <span class="njkc-tree-node" slot-scope="{ node, data }">
            <span class="nodeName">{{ node.label }}</span>
            <span class="btns">
              <el-button type="text" size="mini" v-if="node.level !== 3" @click="openDialog">新增</el-button>
              <el-button type="text" size="mini" @click="() => remove(node, data)">删除</el-button>
            </span>
          </span>
        </el-tree>
      </div>
      <div class="right">
        <hot-table :settings="settings" ref="hotTableComponent"></hot-table>
      </div>
    </div>
    <el-dialog title="新增" :visible.sync="dialogVisible" width="300px">
      <div>
        <el-form :model="addForm" :rules="formRules" ref="ruleForm" label-width="50px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { HotTable } from '@handsontable/vue'
let id = 1000
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
      treeData: [
        {
          id: 1,
          label: '学段(专业)/年级',
          children: [
            {
              id: 4,
              label: '高中',
              children: [
                {
                  id: 9,
                  label: '高一'
                },
                {
                  id: 10,
                  label: '高二'
                }
              ]
            },
            {
              id: 3,
              label: '初中',
              children: [
                {
                  id: 5,
                  label: '初一'
                },
                {
                  id: 7,
                  label: '初二'
                }
              ]
            }
          ]
        }
      ],
      // 表格数据
      settings: {
        className: 'htCenter',
        data: [
          {
            id: '111',
            courseName: '语文',
            weekHours: '5',
            isLayer: true,
            teaType: '理论',
            desc: 'XXX'
          },
          {
            id: '112',
            courseName: '数学',
            weekHours: '5',
            isLayer: true,
            teaType: '理论',
            desc: 'XXX'
          }
        ],
        dataSchema: {
          id: null,
          courseName: null,
          weekHours: null,
          isLayer: null,
          teaType: null,
          desc: null
        },
        colHeaders: ['学科名称', '周课时', '是否分层', '授课方式', '备注'],
        columns: [
          { data: 'courseName' },
          { data: 'weekHours' },
          { data: 'isLayer', type: 'checkbox' },
          { data: 'teaType' },
          { data: 'desc', className: 'htLeft' }
        ],
        height: document.body.clientHeight - 170,
        colWidths: [170, 100, 100, 100, 400]
      },
      // 表单数据
      addForm: {
        name: ''
      },
      // 表单规则
      formRules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.hotInstance = this.$refs.hotTableComponent.hotInstance
  },
  methods: {
    openDialog() {
      this.dialogVisible = true
    },
    append(data) {
      const newChild = { id: id++, label: 'testtest', children: [] }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },
    remove(node, data) {
      this.$confirm('确认删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          const parent = node.parent
          const children = parent.data.children || parent.data
          const index = children.findIndex(d => d.id === data.id)
          // console.log(children)
          // console.log(index)
          children.splice(index, 1)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>
<style  rel="stylesheet/scss" lang="scss">
.njkc-tree-node {
  .nodeName {
    margin-right: 15px;
  }
  &:hover .btns {
    display: inline;
  }
  .btns {
    display: none;
  }
}
</style>

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
  }
  // > div.right {
  //   > div {
  //     border: 1px solid #dddddd;
  //   }
  // }
}
</style>
