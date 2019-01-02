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
        <el-button type="primary" @click="splitClassesBtn">试分班</el-button>
        <el-button type="primary" @click="saveBtn">保存教学任务</el-button>
        <el-button type="primary">任课统计</el-button>
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
import { getSplitClassManage, splitClasses, saveTeachTask } from '@/api/pkcx' //
export default {
  data() {
    return {
      loading: false,
      // 检索字段
      search: {
        minSize: 38,
        maxSize: 45
      },
      // 表格数据
      tableData: [],
      // 表格高度
      height: document.body.clientHeight - 365
    }
  },
  computed: {
    arrangeId() {
      return this.$route.query.arrangeId
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取表格数据
    async fetchData() {
      const res = await getSplitClassManage({ arrangeId: this.arrangeId })
      this.tableData = res.DATA
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
      const res = await splitClasses(params)
      this.tableData = res.DATA
      this.loading = false
    },
    // 保存教学任务
    async saveBtn() {
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
      await saveTeachTask({ modelString: JSON.stringify(this.tableData) })
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

