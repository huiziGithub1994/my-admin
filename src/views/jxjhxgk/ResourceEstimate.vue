<template>
  <div>
    <!-- 分班估算 -->
    <div class="opera-area">
      <div class="tip">
        <label>温馨提示：</label>1、点击“分班估算”平台会自动估算可拆分的教学班方案。
        <p>2、选中行点击“确认分案”进行确认分班分案.</p>
      </div>
      <operation class="btns">
        <el-button type="primary" plain @click="estimate" :loading="estimateLoading">分班估算</el-button>
        <el-button type="primary" plain @click="comfirm">确认方案</el-button>
      </operation>
    </div>
    <div class="data-area table-outer">
      <el-table :data="tableData" tooltip-effect="dark" style="width: 100%" v-loading="loading" border highlight-current-row @current-change="handleCurrentChange">
        <el-table-column label="序号" type="index" width="50px"></el-table-column>
        <el-table-column label="班级最小人数" property="minQty" width="150px"></el-table-column>
        <el-table-column label="班级最大人数" property="maxQty" width="150px"></el-table-column>
        <el-table-column label="教室资源要求" property="otherDesc" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="74px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="queryDetail(scope.row.mainRsId)" plain>详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="分班估算详细信息" :visible.sync="dialogTableVisible" width="850px">
      <el-table :data="dialogTableData" :height="tableH" style="width: 100%" v-loading="loadingDialog">
        <el-table-column label="人数" property="stuSum" width="70px" header-align="center" align="center"></el-table-column>
        <el-table-column label="选考科目" property="adminClassName"></el-table-column>
        <el-table-column label="其他选考科目及走班人数" header-align="center">
          <el-table-column v-for="item in tableColumns" :key="item.property" header-align="center" align="center" :label="item.label" :property="item.property" width="70px"></el-table-column>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import {
  qryCalGroupListByArrId,
  qryOneSjsGroupFix2,
  estimateClasses
} from '@/api/jxjhXgk'
export default {
  data() {
    const h = 255
    const tableH = document.body.clientHeight - h
    return {
      tableH,
      arrangeId: sessionStorage.getItem('local_arrangeId'),
      estimateLoading: false, // 分班估算按钮loading
      dialogTableVisible: false,
      loading: false, // 表格loading
      loadingDialog: false,
      tableData: [],
      dialogTableData: [],
      tableColumns: [
        { label: '政治', property: 'zz' },
        { label: '历史', property: 'ls' },
        { label: '地理', property: 'dl' },
        { label: '物理', property: 'wl' },
        { label: '化学', property: 'hx' },
        { label: '生物', property: 'sw' },
        { label: '技术', property: 'js' }
      ],
      currentRow: null
    }
  },
  created() {
    this.getTableDatas()
  },
  methods: {
    // 查询列表信息
    async getTableDatas() {
      this.loading = true
      const res = await qryCalGroupListByArrId({
        arrangeId: this.arrangeId
      }).finally(() => {
        this.loading = false
      })
      this.tableData = res.DATA
    },
    // 查询详情
    async queryDetail(mainRsId) {
      this.dialogTableData = []
      this.dialogTableVisible = true
      this.loadingDialog = true
      const res = await qryOneSjsGroupFix2({ mainRsId }).finally(() => {
        this.loadingDialog = false
      })
      this.dialogTableData = res.DATA.sjsGroupFix2DetailList
    },
    // 分班估算
    async estimate() {
      this.estimateLoading = true
      const res = await estimateClasses({
        arrangeId: this.arrangeId
      }).finally(() => {
        this.estimateLoading = false
      })
      this.getTableDatas()
      this.$message.success(res.MSG)
    },
    handleCurrentChange(val) {
      this.currentRow = val
    },
    // 确认方案
    comfirm() {
      if (!this.currentRow) {
        this.$message.warning('请先选中行，再点击“确认分案”进行确认分班分案')
        return
      }
      this.$emit('changeTab', '2')
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
