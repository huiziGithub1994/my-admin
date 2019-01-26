<template>
  <div class="content">
    <div class="left">
      <div class="operation-btn">
        <div>
          <el-upload action="http://localhost:9999/base/qryCoursePlain" :show-file-list="false" :before-upload="beforeUpload" :on-success="uploadSuccess">
            <el-button type="primary" plain>导入成绩</el-button>
          </el-upload>
        </div>
      </div>
      <div class="table-wapper" :style="{'min-height':tableMinHeight+'px'}">
        <el-table ref="multipleTable" :data="gradeData" tooltip-effect="dark" highlight-current-row style="width: 100%">
          <el-table-column type="index" width="55" label="序号" fixed></el-table-column>
          <el-table-column label="学段/专业" property="c0" fixed></el-table-column>
          <el-table-column label="年级" property="c1" fixed></el-table-column>
          <el-table-column label="班级" property="c2" fixed></el-table-column>
          <el-table-column :label="item" :property="`c${index+3}`" v-for="(item,index) in tableHeader" :key="index"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="right">
      <div class="operation-btn">
        <el-button type="primary" plain @click="saveSplitStandard">保存分班标准</el-button>
      </div>
      <div class="table-wapper" :style="{'min-height':tableMinHeight+'px'}">
        <el-table ref="multipleTable" :data="splitClassData" tooltip-effect="dark" highlight-current-row style="width: 100%">
          <el-table-column type="index" width="55" label="序号"></el-table-column>
          <el-table-column label="教学班" property="classes" show-overflow-tooltip header-align="center"></el-table-column>
          <el-table-column label="最低分" property="minGrade" width="80"></el-table-column>
          <el-table-column label="最高分" property="maxGrade" width="80"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableMinHeight: document.body.clientHeight - 280,
      gradeData: [], // 成绩表格
      tableHeader: [], // 成绩表格的表头
      splitClassData: [] // 分班标准表格
    }
  },
  methods: {
    // 保存分班标准按钮
    saveSplitStandard() {
      if (this.gradeData.length === 0) {
        this.$message.warning('请先导入学生成绩')
        return
      }
    },
    // 文件上传的回调函数
    uploadSuccess(res) {
      this.$message({
        message: '文件上传成功!',
        type: 'success'
      })
      this.data = res.DATA
    },
    // 文件上传前的钩子
    beforeUpload(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension = testmsg === 'xls'
      const extension2 = testmsg === 'xlsx'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!extension && !extension2) {
        this.$message({
          message: '上传文件只能是 xls、xlsx格式!',
          type: 'warning'
        })
      }
      if (!isLt2M) {
        this.$message({
          message: '上传文件大小不能超过 10MB!',
          type: 'warning'
        })
      }
      return extension || (extension2 && isLt2M)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.content {
  display: flex;
  margin-top: 10px;
  .left {
    flex: 1;
  }
  .right {
    margin-left: 10px;
    width: 400px;
  }
}
.operation-btn {
  overflow: hidden;
  margin-bottom: 10px;
  > button,
  > div {
    float: right;
  }
}
.table-wapper {
  border: 1px solid #dddddd;
  overflow: auto;
}
</style>
