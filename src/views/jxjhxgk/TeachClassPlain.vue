<template>
  <div>
    <!-- 教学开班方案 -->
    <div class="opera-area">
      <div class="tip">
        <label>温馨提示：</label>1、根据实际情况填写预计开班个数。
        <p>2、完成后点击“确认分班”进行确认开班方案</p>
      </div>
      <operation class="btns">
        <el-button type="primary" plain @click="comfirm" :loading="comfirmLoading">确认分班</el-button>
      </operation>
    </div>
    <div class="data-area table-outer">
      <el-table :data="tableData" tooltip-effect="dark" style="width: 100%" v-loading="loading" border highlight-current-row>
        <el-table-column label="序号" type="index" width="50px"></el-table-column>
        <el-table-column label="学科" property="layerName" width="150px"></el-table-column>
        <el-table-column label="选课人数" property="stuSelCount" width="150px"></el-table-column>
        <el-table-column label="预计教学开班个数" property="teachingClassCount">
          <template slot-scope="scope">
            <el-input type="text" clearable v-model.trim="scope.row.teachingClassCount"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="每班人数" property="averageCount"></el-table-column>
        <el-table-column label="预计每班平均人数" property="minAverageCount"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { qryClassCountList, updClassCountList } from '@/api/jxjhXgk'
export default {
  data() {
    const h = 255
    const tableH = document.body.clientHeight - h
    return {
      tableH,
      arrangeId: sessionStorage.getItem('local_arrangeId'),
      comfirmLoading: false, // 确认方案按钮loading
      dialogTableVisible: false,
      loading: false, // 表格loading
      tableData: []
    }
  },
  created() {
    this.getTableDatas()
  },
  methods: {
    // 查询列表信息
    async getTableDatas() {
      this.loading = true
      const res = await qryClassCountList({
        arrangeId: this.arrangeId
      }).finally(() => {
        this.loading = false
      })
      this.tableData = res.DATA
    },
    async comfirm() {
      // 校验数据
      const data = this.tableData
      const len = data.length
      let isContinue = true
      for (let i = 0; i < len; i++) {
        if (!this.validField(data[i].teachingClassCount, i)) {
          isContinue = false
          break
        }
      }
      if (!isContinue) return
      this.comfirmLoading = true
      const res = await updClassCountList(this.tableData).finally(() => {
        this.comfirmLoading = false
      })
      this.$message.success(res.MSG)
    },
    validField(filed, row) {
      if (filed === '' || filed === null || filed === undefined) {
        this.$message.warning(`第${row + 1}行数据不能为空`)
        return false
      }
      const test = /^[1-9]\d*$/.test(filed)
      if (!test) {
        this.$message.warning(`第${row + 1}行数据必须为正整数`)
        return false
      }
      return true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
div.tip {
  display: inline-block;
  > p {
    margin: 5px 0;
    padding-left: 70px;
  }
}
.opera-area {
  overflow: hidden;
  > div.btns {
    display: inline-block;
    float: right;
  }
}
.data-area {
  margin-top: 5px;
  max-width: 900px;
}
</style>
