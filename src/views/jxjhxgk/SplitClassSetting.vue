<template>
  <div>
    <div>
      <!-- 分班设置 -->
      <condition>
        <div class="condition">
          <label>最小人数/班</label>
          <el-input placeholder="26" v-model.trim="search['theBestMinQty']" clearable></el-input>
        </div>
        <div class="condition next">
          <label>最大人数/班</label>
          <el-input placeholder="41" v-model.trim="search['theBestMaxQty']" clearable></el-input>
        </div>
        <div class="condition next">
          <label>班级个数</label>
          <el-input placeholder="8" v-model.trim="search['theClassSum']" clearable></el-input>
        </div>
      </condition>
      <operation>
        <el-button type="primary" plain>估算分班</el-button>
        <el-button type="primary" plain>保存并分班</el-button>
      </operation>
    </div>
    <div class="table-outer">
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" :height="tableH" v-loading="loading" class="splitClassManage">
        <el-table-column label="走班(定二)班级名称" property="teachingClass"></el-table-column>
        <el-table-column label="人数" property="stuSum"></el-table-column>
        <el-table-column label="选考科目" property="adminClassName"></el-table-column>
        <el-table-column label="其他选考科目及走班人数">
          <el-table-column v-for="item in tableColumns" :key="item.property" :label="item.label" :property="item.property">
            <!-- <template slot-scope="scope">
              <el-input
                v-model.trim="scope.row[item.property]"
                v-if="scope.row.adminClassName.indexOf(item.label)>-1"
                @blur="validInput(scope.row[item.property],item.property,scope.row.seq)"
                :class="{'splitClassSettingError': activePos[`${item.property}${scope.row.seq}`]== true }"
              />
              <div v-else class="readOnly">{{ scope.row[item.property] }}</div>
            </template>-->
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { splitStu2AdminClass } from '@/api/jxjhXgk'
export default {
  data() {
    const h = 295
    const tableH = document.body.clientHeight - h
    return {
      arrangeId: sessionStorage.getItem('local_arrangeId'),
      loading: false, // 表格loading
      tableH,
      search: {
        theBestMinQty: undefined,
        theBestMaxQty: undefined,
        theClassSum: undefined
      },
      activePos: {}, // input输入错误的位置
      tableColumns: [
        { label: '政治', property: 'zzSum' },
        { label: '历史', property: 'lsSum' },
        { label: '地理', property: 'dlSum' },
        { label: '物理', property: 'wlSum' },
        { label: '化学', property: 'hxSum' },
        { label: '生物', property: 'swSum' },
        { label: '技术', property: 'jsSum' }
      ],
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
          seq: 1
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
          seq: 2
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
          seq: 3
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
          seq: 4
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
          seq: 5
        },
        {
          dlSum: 0,
          stuSum: 37,
          lsSum: 0,
          teachingClass: '(定)高二6班',
          zzSum: 0,
          adminClassName: '6,历史选考,物理选考',
          wlSum: 0,
          jsSum: 0,
          hxSum: 0,
          swSum: 0,
          seq: 6
        },
        {
          dlSum: 0,
          stuSum: 34,
          lsSum: 0,
          teachingClass: '(定)高二7班',
          zzSum: 0,
          adminClassName: '7,化学选考,政治选考',
          wlSum: 0,
          jsSum: 0,
          hxSum: 0,
          swSum: 0,
          seq: 7
        },
        {
          dlSum: 0,
          stuSum: 26,
          lsSum: 0,
          teachingClass: '(定)高二8班',
          zzSum: 0,
          adminClassName: '化学选考,历史选考,9',
          wlSum: 0,
          jsSum: 0,
          hxSum: 0,
          swSum: 0,
          seq: 8
        }
      ]
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    async getTableData() {
      const res = await splitStu2AdminClass({
        arrangeId: this.arrangeId,
        ...this.search
      })
      this.tableData = res.DATA
    },
    // 输入框的校验
    validInput(val, property, seq) {
      console.log(44)
      const reg = /^\d+$/
      this.$set(this.activePos, `${property}${seq}`, !reg.test(val))
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.condition.next {
  margin-left: 15px;
}
.table-outer {
  margin: 10px 0;
  border: 1px solid #dddddd;
}
.condition > label {
  margin-right: 4px;
  &::after {
    content: '*';
    color: red;
    position: relative;
    margin-left: 3px;
    top: 3px;
  }
}
.readOnly {
  padding-left: 15px;
}
</style>
<style rel="stylesheet/scss" lang="scss">
div.splitClassSettingError > input.el-input__inner {
  border: 1px solid #de3b3b !important;
}
</style>
