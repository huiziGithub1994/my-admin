<template>
  <!-- 单科分析 -->
  <div>
    <div class="top-operation">
      <div>
        <label>选课任务名称</label>
        <span>{{ data.taskName }}</span>
      </div>
      <div>
        <label>年级</label>
        <el-cascader expand-trigger="hover" :options="classOptions" v-model="selectedClass" @change="fetchData"></el-cascader>
      </div>
    </div>
    <div>
      <div class="left">
        <div class="desc">
          <div class="title">统计表:</div>
          <div class="list">
            <ul>
              <li>
                本次应选课
                <span class="text-green">{{ data.analysis.needNum }}</span>人
              </li>
              <li>
                实际选课
                <span class="text-red">{{ data.analysis.truthNum }}</span>人
              </li>
              <li>
                未完成选课
                <span class="text-red">{{ data.analysis.noChoose }}</span>人
              </li>
              <li>
                共
                <span class="text-green">{{ data.analysis.allClasses }}</span>个班级
              </li>
              <li>
                共完成选课班级
                <span class="text-green">{{ data.analysis.completeClass }}</span>个
              </li>
            </ul>
          </div>
        </div>
        <div class="table-outer">
          <el-table ref="multipleTable" :data="data.tableData" tooltip-effect="dark" highlight-current-row style="width: 100%" :height="325">
            <el-table-column label="科目" property="name"></el-table-column>
            <el-table-column label="选课人数" property="value"></el-table-column>
          </el-table>
        </div>
      </div>
      <div class="right">
        <div id="myChart"></div>
      </div>
    </div>
  </div>
</template>
<script>
// 引入基本模板
const echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/pie')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')

import { classCascaderSelect } from '@/components/selectChild/data'
import { getSingleSubjectAnalysis } from '@/api/xkdy'

export default {
  data() {
    return {
      // 年级选中值
      selectedClass: ['01', '01'],
      classOptions: [],
      data: {
        analysis: {},
        tableData: []
      },
      chartInstance: undefined
    }
  },
  computed: {
    legend() {
      return this.data.tableData.map(item => item.name)
    },
    series() {
      return this.data.tableData
    }
  },
  created() {
    this.classOptions = [...classCascaderSelect]
  },
  mounted() {
    this.drawLine() // 初始化
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const res = await getSingleSubjectAnalysis()
      this.data = res.DATA
      this.selectedClassChange()
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      this.chartInstance = echarts.init(document.getElementById('myChart'))
      // 绘制图表
      this.chartInstance.setOption({
        title: {
          text: '选课情况分布示意图',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: []
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    },
    selectedClassChange() {
      this.chartInstance.setOption({
        legend: {
          data: this.legend
        },
        series: [
          {
            data: this.series
          }
        ]
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.top-operation {
  > div {
    margin-bottom: 15px;
    > label {
      width: 100px;
      display: inline-block;
      &:after {
        content: '*';
        color: red;
        position: relative;
        top: 3px;
        margin-left: 3px;
      }
    }
  }
}
.left,
.right {
  float: left;
  border: 1px solid #dddddd;
  height: 450px;
}
.left {
  width: 250px;
  margin-right: 10px;
  padding: 5px;
  .desc {
    overflow: hidden;
    .title,
    .list {
      float: left;
    }
    .title {
      font-size: 1rem;
      font-weight: bold;
    }
    .list > ul {
      padding: 0;
      margin: 0;
      > li {
        list-style: none;
        padding-left: 15px;
        height: 20px;
        line-height: 20px;
        > span {
          margin: 0 6px 0 3px;
        }
      }
    }
  }
}
.right {
  width: 500px;
  > div {
    height: 100%;
    width: 100%;
  }
}
.text-green {
  color: #3986ac;
}
.table-outer {
  margin-top: 10px;
  border: 1px solid #dddddd;
}
</style>
