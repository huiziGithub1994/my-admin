<template>
  <!--  教学分班管理 tab页-->
  <div>
    <div>
      <condition>
        <div class="condition">
          <label>班额范围(人/班)</label>
          <el-input placeholder="38" v-model.trim="search['minSize']" clearable></el-input>&nbsp;-
          <el-input placeholder="45" v-model.trim="search['maxSize']" clearable></el-input>
        </div>
      </condition>
      <operation>
        <el-button type="primary" plain @click="splitClassesBtn" :disabled="btnDisabled">试分班</el-button>
        <el-button type="primary" plain @click="saveBtn" :disabled="btnDisabled">保存教学任务</el-button>
        <el-button type="primary" plain :disabled="btnDisabled">任课统计</el-button>
      </operation>
    </div>
    <div class="table-wapper">
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" v-loading="loading" class="splitClassManage">
        <el-table-column type="index" width="55" label="序号" fixed></el-table-column>
        <el-table-column label="课程" property="layerName"></el-table-column>
        <el-table-column label="选课人数" property="stuChoseCount"></el-table-column>
        <el-table-column label="开班数" property="classCount"></el-table-column>
        <el-table-column label="教学班">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.classList" :key="index">
              <el-tag size="medium">{{ item.layerClassName }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="预计人数">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.classList" :key="index" class="stuCount">{{ item.stuCount }}</div>
          </template>
        </el-table-column>
        <el-table-column label="任课教师">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.classList" :key="index">
              <el-input size="mini" v-model.trim="item.teaName"/>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="课时">
          <template slot-scope="scope">
            <span>{{ scope.row.classList[0]&&scope.row.classList[0].weekHours }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import {
  getSplitClassManage,
  splitClasses,
  saveTeachTask,
  qryArrangeDetail
} from '@/api/pkcx' //
export default {
  data() {
    return {
      btnDisabled: false, // 按钮的禁用
      arrangeId: sessionStorage.getItem('local_arrangeId'),
      loading: false,
      // 检索字段
      search: {
        minSize: 38,
        maxSize: 45
      },
      currentSplitNum: {}, // 最后一次试分班的班额数据
      // 表格数据
      tableData: [],
      // 表格高度
      height: document.body.clientHeight - 365
    }
  },
  async created() {
    if (this.arrangeId) {
      await this.fetchFormData()
    }
    this.fetchData()
  },
  methods: {
    // 获取基础信息数据
    async fetchFormData() {
      const res = await qryArrangeDetail({
        arrangeId: this.arrangeId
      })
      const { stepArrangeState } = res.DATA
      this.btnDisabled = +stepArrangeState > 4
    },
    // 获取表格数据
    async fetchData() {
      this.loading = true
      const res = await getSplitClassManage({
        arrangeId: this.arrangeId
      }).finally(() => {
        this.loading = false
      })
      const { dataList, minSize, maxSize } = res.DATA
      this.tableData = dataList
      if (minSize && maxSize) {
        Object.assign(this.search, { minSize, maxSize })
      }

      Object.assign(this.currentSplitNum, { minSize, maxSize })
    },
    // 试分班按钮
    async splitClassesBtn() {
      const { minSize = '', maxSize = '' } = this.search
      if (minSize === '' || maxSize === '') {
        this.$message.warning('班额范围不能为空')
        return
      }
      const params = {
        arrangeId: this.arrangeId,
        ...this.search
      }
      this.loading = true
      const res = await splitClasses(params).finally(() => {
        this.loading = false
      })
      this.tableData = res.DATA

      Object.assign(this.currentSplitNum, this.search)
      this.$notify({
        title: '提示',
        duration: 0,
        message: this.$createElement(
          'i',
          { style: 'color: teal' },
          '试分班成功，请填写任课教师后保存教学任务，否则试分班数据不会保存。'
        )
      })
    },
    // 保存教学任务
    async saveBtn() {
      if (this.tableData.length === 0) return
      let continueFlag = true
      this.tableData.forEach(item => {
        item.classList.forEach(tempClass => {
          if (tempClass.teaName === '') {
            continueFlag = false
            this.$message.warning('任课教师不能为空')
            return
          }
        })
      })
      if (!continueFlag) return
      await saveTeachTask({
        arrangeId: this.arrangeId,
        ...this.currentSplitNum,
        modelString: JSON.stringify(this.tableData)
      })
      this.$message.success('保存成功')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.table-wapper {
  border: 1px solid #dddddd;
  margin: 10px 0;
}
.stuCount {
  line-height: 33px;
}
</style>

