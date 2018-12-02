<template>
  <div>
    <div v-area>
      <div id="area-condition">
        <div class="condition">
          <div>学校标识码</div>
          <el-input placeholder="可模糊查询" clearable></el-input>
        </div>
      </div>
      <operation id="area-operation">
        <el-button size="small" type="primary" @click="getDataBtn">数据</el-button>
      </operation>
    </div>
    <div class="handson-table">
      <HotTable :root="root" ref="testHot" :settings="hotSettings"></HotTable>
    </div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageTot.pageNum"
      :page-sizes="pageSizes"
      :page-size="pageTot.pageSize"
      layout="total,sizes,slot ,->, prev, pager, next"
      :total="pageTot.pagetotal"
    >
      <slot></slot>
    </el-pagination>
  </div>
</template>

<script>
// import Vue from "vue";
import HotTable from '@handsontable/vue'
import 'handsontable/dist/handsontable.full.css'
import 'handsontable/languages/zh-CN'
import { getStudentInfo } from 'src/api/test'
import { getTableBestRows } from 'src/utils/businessUtil'
export default {
  name: 'HelloWorld',
  components: {
    HotTable
  },
  data() {
    let calWidth = function(width, wapperWidth) {
      let columnsWidth = [...width]
      columnsWidth.forEach((item, index) => {
        columnsWidth[index] =
          (Number(item.replace(/%/, '')) / 100) * wapperWidth
      })
      return columnsWidth
    }
    let tableH = document.body.clientHeight - 210
    let pageSizes = getTableBestRows(tableH)
    return {
      pageSizes: pageSizes,
      pageTot: {
        //页码
        pageNum: 1,
        pageSize: pageSizes[0],
        pagetotal: 0
      },
      root: 'test-hot',
      selectOptions: 'nihao',
      hotSettings: {
        language: 'zh-CN',
        startRows: 8,
        colWidths: calWidth(
          ['10%', '15%', '15%', '15%', '15%', '15%', '15%'],
          document.body.clientWidth - 240
        ),
        rowHeights: 50,
        manualColumnResize: true,
        manualRowResize: true,
        rowHeights: 23,
        height: tableH,
        width: '100%',
        fixedColumnsLeft: 1,
        maxRows: 7,
        colHeaders: [
          '姓名',
          '学年',
          '学期',
          '出生年月',
          '是否党员',
          '创建时间',
          '部门'
        ],
        data: [
          {
            id: null,
            xn: null,
            xq: null,
            xm: null,
            birth: null,
            dy: null,
            time: null,
            bm: null
          }
        ],
        columns: [
          { data: 'xm' },
          { data: 'xn' },
          { data: 'xq' },
          { data: 'birth', type: 'date', dateFormat: 'YYYY-MM-DD' },
          { data: 'dy', type: 'checkbox' },
          {
            data: 'time',
            type: 'time',
            timeFormat: 'k:mm:ss',
            correctFormat: true
          },
          {
            data: 'bm',
            type: 'dropdown',
            source: function(query, callback) {
              let params = {
                dataStr: JSON.stringify({
                  currentPage: '1',
                  pageSize: '6',
                  't1.cur_year01': '2017',
                  't1.cur_term01': '2'
                })
              }
              getStudentInfo(params).then(res => {
                let data = ['教育资源部', '市场部']
                callback(data)
              })
            }
          }
        ]
      }
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    getTableData() {
      let params = {
        dataStr: JSON.stringify({
          currentPage: '1',
          pageSize: '6',
          't1.cur_year01': '2017',
          't1.cur_term01': '2'
        })
      }
      getStudentInfo(params).then(res => {
        if (res.SUCCESS == 1) {
          let data = [
            {
              id: '1',
              xn: '2018',
              xq: '2',
              xm: '小明',
              birth: '2017-09-24',
              dy: true,
              time: '19:09:00',
              bm: '教育资源部'
            },
            {
              id: '2',
              xn: '2018',
              xq: '2',
              xm: '李涛',
              birth: '2017-12-08',
              dy: true,
              time: '12:09:00',
              bm: '市场部'
            },
            {
              id: '3',
              xn: '2018',
              xq: '2',
              xm: '黄锋',
              birth: '2017-09-24',
              dy: false,
              time: '08:00:00',
              bm: '市场部'
            },
            {
              id: '1',
              xn: '2018',
              xq: '2',
              xm: '小明',
              birth: '2017-09-24',
              dy: true,
              time: '19:09:00',
              bm: '市场部'
            },
            {
              id: '2',
              xn: '2018',
              xq: '2',
              xm: '李涛',
              birth: '2017-12-08',
              dy: true,
              time: '12:09:00',
              bm: '市场部'
            },
            {
              id: '3',
              xn: '2018',
              xq: '2',
              xm: '黄锋',
              birth: '2017-09-24',
              dy: false,
              time: '08:00:00',
              bm: '市场部'
            },
            {
              id: '1',
              xn: '2018',
              xq: '2',
              xm: '小明',
              birth: '2017-09-24',
              dy: true,
              time: '19:09:00',
              bm: '教育资源部'
            }
          ]
          this.$refs.testHot.table.loadData(data)
        }
      })
    },
    getDataBtn() {
      console.log(this.$refs.testHot.table.getData()) //获取所有数据
    },
    //处理每页多少条西湖局
    handleSizeChange(val) {
      this.pageTot.pageSize = val
      this.$nextTick(function() {
        this.getSchoolInfo()
      })
    },
    //处理翻页
    handleCurrentChange(val) {
      this.pageTot.pageNum = val
      this.$nextTick(function() {
        this.getSchoolInfo()
      })
    }
  }
}
</script>

<style scoped>
/*table background*/
.ht_master tr td {
  background-color: #fff;
}
/*table backgroung*/
/* All headers */
.handsontable th {
  background-color: #fff;
}
/* Row headers */
.ht_clone_left th {
  background-color: #fff;
}
/* Column headers */
.ht_clone_top th {
  background-color: #fff;
}

.handson-table {
  border-bottom: 1px solid #dddddd;
}
</style>
