<template lang="html">
  <div class="sjzd">
    <div v-area>
      <condition>
        <div class="condition">
          <label>名称</label>
          <el-input v-model="dicName" placeholder="请输入名称" clearable></el-input>
        </div>
        <div class="condition">
          <label>所属KEY</label>
          <el-select v-model="dicKey" filterable placeholder="请选择" clearable>
            <el-option v-for="item in keySelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
      </condition>
      <operation>
        <el-button type="primary" plain @click="searchMsg">检索</el-button>
        <el-button type="primary" plain @click="toDele">删除</el-button>
        <el-button type="primary" plain @click="toUpdate">修改</el-button>
        <el-button type="primary" plain @click="toAdd">新增</el-button>
      </operation>
    </div>
    <div class="sjzd-middle">
      <el-table ref="singleTable" stripe highlight-current-row @selection-change="handleSelectionChange" @current-change="handleCurrentChange" :data="tabData" v-loading="loading" element-loading-text="拼命加载中" style="width: 100%" :height="Height">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="dicCode" label="代码" width="100"></el-table-column>
        <el-table-column prop="dicName" label="名称" width="230"></el-table-column>
        <el-table-column prop="dicKey" label="所属KEY" width="90"></el-table-column>
        <el-table-column prop="dicDesc" label="用途" show-overflow-tooltip></el-table-column>
        <el-table-column prop="dispOrder" label="显示顺序" align="center" width="100"></el-table-column>
        <el-table-column prop="createName" label="创建人" align="center" width="220"></el-table-column>
        <el-table-column prop="strCreateTime" label="创建时间" width="220" show-overflow-tooltip></el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handlePageNumChange"
        :current-page="pageTot.pageNum"
        :page-sizes="[10,15,20,25,30]"
        :page-size="pageTot.pageSize"
        layout="total,sizes,slot ,->, prev, pager, next"
        :total="pageTot.pagetotal">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dicName: '',
      dicKey: '',
      pageTot: {
        // 页码
        pageNum: 1,
        pageSize: 20,
        pagetotal: 100
      },
      tabData: [],
      rowData: null,
      loading: false,
      showModel: false,
      obj: {
        dicId: '',
        dicCode: '',
        dicName: '',
        dispOrder: '',
        dicKey: '',
        dicDesc: ''
      },
      isAdd: true,
      Height: 0,
      keySelect: [], // 表格数据
      multipleSelection: []
    }
  },
  created() {
    this.Height = document.body.clientHeight - 220
    this.getTabData()
  },
  mounted() {
    // this.getAllDicKey()
  },
  methods: {
    handleSizeChange(val) {
      this.pageTot.pageSize = val
      this.$nextTick(function() {
        this.getTabData()
      })
    },
    handlePageNumChange(val) {
      this.pageTot.pageNum = val
      this.$nextTick(function() {
        this.getTabData()
      })
    }
  }
}
</script>

<style lang="css" scoped>
.mod-inner {
  width: 450px;
}
.lab-name {
  margin: 10px 0;
}
</style>
