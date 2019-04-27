<template>
  <!-- 组合分析 -->
  <div>
    <div class="top-operation">
      <div>
        <label>选课任务名称：</label>
        <span>{{ arrangeName }}</span>
      </div>
    </div>
    <div>
      <div class="left" :style="{height:panelHeight+'px'}">
        <div class="desc">
          <div class="title">统计表:</div>
          <div class="list">
            <ul>
              <li>
                本次应选课
                <span class="text-green">{{ data.needNum }}</span>人
              </li>
              <li>
                实际选课
                <span class="text-red">{{ data.truthNum }}</span>人
              </li>
              <li>
                未完成选课
                <span class="text-red">{{ data.noChoose }}</span>人
              </li>
              <li>
                共
                <span class="text-green">{{ data.allClasses }}</span>个班级
              </li>
              <!-- <li>
                共完成选课班级
                <span class="text-green">{{ data.completeClass }}</span>个
              </li>-->
            </ul>
          </div>
        </div>
        <div class="table-outer">
          <el-table ref="multipleTable" :data="data.tableData" tooltip-effect="dark" highlight-current-row style="width: 100%" :height="panelHeight-105">
            <el-table-column label="科目" property="courseName"></el-table-column>
            <el-table-column label="选课人数" property="tmpCount" width="80px"></el-table-column>
          </el-table>
        </div>
      </div>
      <div class="right" :style="{height:panelHeight+'px'}">
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

import { getSingleSubjectAnalysis } from '@/api/xkrw'
import { setDatas } from '@/utils/businessUtil'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      choseRsId: sessionStorage.getItem('local_arrangeId'),
      panelHeight: document.body.clientHeight - 200,
      // 年级选中值
      selectedClass: ['01', '01'],
      data: {
        needNum: 0,
        truthNum: 0,
        noChoose: 0,
        allClasses: 0,
        completeClass: 0,
        tableData: [{ courseName: '', tmpCount: 0 }]
      },
      chartInstance: undefined
    }
  },
  computed: {
    legend() {
      return this.data.tableData.map(item => item.courseName)
    },
    series() {
      const newData = []
      this.data.tableData.forEach(item => {
        newData.push({
          name: item.courseName,
          value: item.tmpCount
        })
      })
      return newData
    },
    ...mapGetters(['arrangeName'])
  },
  created() {},
  mounted() {
    this.drawLine() // 初始化
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const res = await getSingleSubjectAnalysis({
        choseRsId: this.choseRsId,
        groupType: '2'
      })
      setDatas(this.data, res.DATA)
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
          top: '30',
          data: [],
          formatter: function(name) {
            return name
          }
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '65%'],
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
@import './graphic.scss';
</style>
