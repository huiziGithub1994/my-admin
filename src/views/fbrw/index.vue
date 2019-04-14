<template>
  <div>
    <div class="operation">
      <div class="btns-right">
        <el-button type="primary" plain @click="publishTask" :disabled="btnDisabled">确认发布</el-button>
      </div>
    </div>
    <div class="area-data">
      <div>
        <span class="title">学年学期</span>
        {{ `${fromData.schoolYear}-${+fromData.schoolYear+1}学年` }}{{ +fromData.termCode === 1 ? "第一学期" : "第二学期" }}
      </div>
      <div>
        <span class="title">选课任务名称</span>
        {{ fromData.choseTaskName }}
      </div>
      <div>
        <span class="title">任务类型</span>
        {{ taskType[fromData.choseType] }}
      </div>
      <div>
        <span class="title">分层类型</span>
        {{ fromData.choseCourseType }}
      </div>
      <div>
        <span class="title">选课时间段</span>
        {{ fromData.beginTime }} ~ {{ fromData.endTime }}
      </div>
      <div>
        <span class="title">发布状态</span>
        {{ fromData.pubFlag == '1' ? '发布':'未发布' }}
      </div>
      <div class="table-wrapper">
        <div class="left">参选班级及任务</div>
        <div class="right">
          <el-table ref="singleTable" :data="tableData" highlight-current-row>
            <el-table-column property="segName" label="学段专业"/>
            <el-table-column property="gradeName" label="年级"></el-table-column>
            <el-table-column property="className" label="班级"></el-table-column>
            <el-table-column property="stuQty" label="人数"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { qryChoseStuSumList, pubChoseTask } from '@/api/xkrw'

export default {
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$notify.close()
      if (
        !sessionStorage.getItem('local_curTerm') ||
        !sessionStorage.getItem('local_curYear')
      ) {
        const h = vm.$createElement
        vm.$notify({
          title: '提示',
          message: h(
            'i',
            { style: 'color: teal' },
            '请在“选课任务”页面，点击发布按钮进入“发布任务”页面'
          ),
          duration: 8 * 1000
        })
        vm.$router.push({ name: 'Xkrw' })
      }
    })
  },
  data() {
    return {
      btnDisabled: false,
      choseRsId: sessionStorage.getItem('local_arrangeId'),
      fromData: {},
      tableData: [],
      taskType: {
        '1': '新高考选考',
        '2': '分层教学',
        '3': '校本课'
      }
    }
  },
  created() {
    this.getFormData()
  },
  methods: {
    async getFormData() {
      const res = await qryChoseStuSumList({ choseRsId: this.choseRsId })
      const { sjsChoseCourseDef, returnLOut } = res.DATA
      this.btnDisabled = sjsChoseCourseDef.pubFlag === '1'
      this.fromData = sjsChoseCourseDef
      const len = returnLOut.length
      returnLOut[len - 1] = {
        gradeName: '',
        stuQty: 382,
        segName: '',
        className: '合计'
      }
      this.tableData = returnLOut
    },
    async publishTask() {
      await pubChoseTask({ choseRsId: this.choseRsId })
      this.$message.success('选课任务发布成功')
      this.btnDisabled = true
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.operation {
  overflow: hidden;
  height: 33px;
  > div {
    float: right;
  }
}
.area-data {
  border: 1px solid #dddddd;
  margin-top: 10px;
  padding: 10px 10px 0 0;
  > div {
    margin-bottom: 15px;
  }
}
.title {
  width: 120px;
  display: inline-block;
  text-align: right;
  margin-right: 10px;
}
.table-wrapper {
  display: flex;
  > .left {
    text-align: right;
    width: 135px;
    padding-right: 10px;
  }
  > .right {
    flex: 1;
    max-width: 800px;
    border: 1px solid #dddddd;
    // width: 500px;
  }
}
</style>
