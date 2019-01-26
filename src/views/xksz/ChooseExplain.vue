<template>
  <!-- 选课设置 -》 选课说明-->
  <div>
    <el-form :model="data" ref="baseInfoRef" :rules="baseInfoRules" label-width="120px">
      <el-row :gutter="10">
        <el-col :span="18">
          <el-form-item prop="chooseName" label="选课任务名称">
            <span>{{ data.chooseName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" plain class="saveBtn">保存</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="20">
          <el-form-item label="选课说明">
            <div ref="editor"></div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import E from 'wangeditor'
export default {
  name: 'BaseInfo',
  data() {
    return {
      // 表单数据
      data: {
        chooseName: '2018级高中一年级学生选考调查'
      },
      // 基础信息表单规则
      baseInfoRules: {
        chooseName: [{ required: true, trigger: 'blur' }]
      }
    }
  },
  created() {},
  mounted() {
    this.cerateEditor()
  },
  methods: {
    cerateEditor() {
      this.editor = new E(this.$refs.editor)
      this.editor.customConfig.onchange = html => {
        this.editorContent = html
      }
      // 隐藏“网络图片”tab,显示上传图片tab
      this.editor.customConfig.showLinkImg = false
      this.editor.customConfig.uploadImgShowBase64 = true
      this.editor.customConfig.zIndex = 10
      this.editor.create()
    },
    // 获取表单数据
    async fetchFormData() {}
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.saveBtn {
  float: right;
}
</style>
