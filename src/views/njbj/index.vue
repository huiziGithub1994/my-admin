<template>
  <div>
    <div class="opera-area">
      <p class="tip">
        <label>温馨提示：</label>"批量生成班级"可以生成相同前缀的班级名称。
      </p>
      <operation>
        <el-button type="primary" plain>批量生成班级</el-button>
        <el-button type="primary" plain>保存</el-button>
      </operation>
    </div>
    <div class="data-area">
      <div class="left" :style="{height:treeHeight+'px'}">
        <el-tree :data="treeData" node-key="id" default-expand-all :expand-on-click-node="false"></el-tree>
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
            classeName: '高一1班',
            buildName: '教学楼',
            classRoom: 201,
            teacher: '彭丽',
            schoolArea: '老校区',
            desc: 'xxx'
          },
          {
            id: '112',
            classeName: '高一2班',
            buildName: '教学楼',
            classRoom: 203,
            teacher: '张媛',
            schoolArea: '新校区',
            desc: 'xxx'
          }
        ],
        dataSchema: {
          id: null,
          classeName: null,
          buildName: null,
          classRoom: null,
          teacher: null,
          schoolArea: null,
          desc: null
        },
        colHeaders: [
          '班级名称(简称)',
          '楼房',
          '教室',
          '班主任',
          '所在校区',
          '备注'
        ],
        columns: [
          { data: 'classeName' },
          { data: 'buildName' },
          { data: 'classRoom' },
          { data: 'teacher' },
          { data: 'schoolArea' },
          { data: 'desc', className: 'htLeft' }
        ],
        height: document.body.clientHeight - 170,
        colWidths: [170, 100, 100, 100, 100, 300]
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
  methods: {}
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
