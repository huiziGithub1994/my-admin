<template>
  <div>
    <!-- 分班及教室-->
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
        <el-table-column label="走班(定二)班级名称" property="teachingClass"></el-table-column>
        <el-table-column label="人数" property="stuSum" width="100px"></el-table-column>
        <el-table-column label="固定选考科目" property="adminClassName" show-overflow-tooltip></el-table-column>
        <el-table-column label="常用教室">
          <template slot-scope="scope">
            <el-select v-model="scope.row.roomName" clearable placeholder="请选择">
              <el-option v-for="item in roomOptions" :key="item.classId" :label="item.classRoom" :value="item.classRoom"></el-option>
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
      tableData: [
        {
          dlSum: 0,
          stuSum: 32,
          lsSum: 0,
          teachingClass: '(定)高二1班',
          zzSum: 0,
          adminClassName: '1,化学选考,地理选考',
          wlSum: 0,
          jsSum: 0,
          hxSum: 0,
          swSum: 0,
          seq: 1,
          roomName: '101'
        },
        {
          dlSum: 0,
          stuSum: 29,
          lsSum: 0,
          teachingClass: '(定)高二2班',
          zzSum: 0,
          adminClassName: '2,地理选考,生物选考',
          wlSum: 0,
          jsSum: 0,
          hxSum: 0,
          swSum: 0,
          seq: 2,
          roomName: ''
        },
        {
          dlSum: 0,
          stuSum: 36,
          lsSum: 0,
          teachingClass: '(定)高二3班',
          zzSum: 0,
          adminClassName: '3,化学选考,物理选考',
          wlSum: 0,
          jsSum: 0,
          hxSum: 0,
          swSum: 0,
          seq: 3,
          roomName: ''
        },
        {
          dlSum: 0,
          stuSum: 39,
          lsSum: 0,
          teachingClass: '(定)高二4班',
          zzSum: 0,
          adminClassName: '4,历史选考,政治选考',
          wlSum: 0,
          jsSum: 0,
          hxSum: 0,
          swSum: 0,
          seq: 4,
          roomName: ''
        },
        {
          dlSum: 0,
          stuSum: 32,
          lsSum: 0,
          teachingClass: '(定)高二5班',
          zzSum: 0,
          adminClassName: '5,政治选考,物理选考',
          wlSum: 0,
          jsSum: 0,
          hxSum: 0,
          swSum: 0,
          seq: 5,
          roomName: ''
        }
      ]
    }
  },
  created() {
    this.getArrangeDetail()
  },
  methods: {
    // 获取任务信息
    async getArrangeDetail() {
      const res = await qryArrangeDetail({
        arrangeId: this.arrangeId
      })
      this.getGradeData(res.DATA.gradeId)
    },
    async getGradeData(gradeId) {
      const res = await qryClassesByGradeId({ gradeId })
      this.roomOptions = res.DATA
    },
    async getTableData(gradeId) {},
    // 保存按钮
    async saveBtn() {}
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
