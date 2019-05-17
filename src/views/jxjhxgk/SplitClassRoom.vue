<template>
  <div>
    <!-- 教学班教学设置-->
    <div class="opera-area">
      <p class="tip">
        <label>温馨提示：</label>下面表格中“常用教室”列所选中的数据不能相同。
      </p>
      <operation>
        <el-button type="primary" plain @click="saveBtn">保存</el-button>
      </operation>
    </div>
    <div class="data-area table-outer">
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" :height="tableH" v-loading="loading" border>
        <el-table-column label="序号" type="index" width="50px"></el-table-column>
        <el-table-column label="走班(定二)班级名称" property="className"></el-table-column>
        <el-table-column label="人数" property="stuSum" width="100px"></el-table-column>
        <el-table-column label="固定选考科目" property="classDesc" show-overflow-tooltip></el-table-column>
        <el-table-column label="常用教室">
          <template slot-scope="scope">
            <el-select v-model="scope.row.relaClassId" clearable placeholder="请选择">
              <el-option v-for="item in roomOptions" :key="item.classId" :label="`${item.building}/${item.classRoom}`" :value="item.classId"></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { qryArrangeDetail } from '@/api/pkcx'
import { qryClassesByGradeId } from '@/api/njbj'
import { qryMove2ClassList } from '@/api/jxjhXgk'
import { saveClassesList } from '@/api/njbj'

export default {
  data() {
    const h = 295
    const tableH = document.body.clientHeight - h
    return {
      arrangeId: sessionStorage.getItem('local_arrangeId'),
      loading: false, // 表格loading
      tableH,
      // 教室信息
      roomOptions: [],
      tableData: [],
      originDataIds: []
    }
  },
  created() {
    this.getArrangeDetail()
  },
  methods: {
    // 获取任务信息，得到年级id
    async getArrangeDetail() {
      this.loading = true
      const res = await qryArrangeDetail({
        arrangeId: this.arrangeId
      })
      this.getGradeData(res.DATA.gradeId)
    },
    // 根据年级id获取教室信息
    async getGradeData(gradeId) {
      const res = await qryClassesByGradeId({ gradeId })
      this.roomOptions = res.DATA
      this.getTableData()
    },
    async getTableData() {
      const res = await qryMove2ClassList({ arrangeId: this.arrangeId })
      this.loading = false
      this.tableData = res.DATA
      this.originDataIds = this.tableData.map(item => item.relaClassId)
    },
    // 保存按钮
    async saveBtn() {
      const result = this.handleSaveData()
      console.log(result)
      if (!result) return
      const res = await saveClassesList(result)
      this.$message.success(res.MSG)
    },
    handleSaveData() {
      const result = []
      const datas = this.tableData
      const len = datas.length
      let flag = true
      const uniqueIds = []
      for (let i = 0; i < len; i++) {
        const item = datas[i]
        const { relaClassId } = item
        if (!relaClassId) {
          this.$message.error(`第${i + 1}行常用教室不能为空`)
          flag = false
          break
        }
        const pos = uniqueIds.indexOf(relaClassId)
        if (pos > -1) {
          this.$message.error(`第${i + 1}行和第${pos + 1}行常用教室不能重复`)
          flag = false
          break
        }
        uniqueIds.push(relaClassId)
        result.push(
          Object.assign({}, item, {
            action: this.originDataIds[i] === null ? '0' : '1'
          })
        )
      }
      return result.length === len ? result : flag
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
p.tip {
  display: inline-block;
  position: relative;
  top: 14px;
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
  max-width: 900px;
}
</style>
