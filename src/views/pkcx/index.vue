<template>
  <div>
    <div v-area>
      <condition>
        <div class="condition">
          <label>学年</label>
          <selectChild
            v-model="search['xn']"
            clearable
            tp="yearSelect"/>
        </div>
        <div class="condition">
          <label>学期</label>
          <selectChild
            v-model="search['xq']"
            clearable
            tp="termSelect"/>
        </div>
        <div class="condition">
          <label>学年</label>
          <el-input v-model="input10" placeholder="请输入内容" clearable/>
        </div>
        <div class="condition">
          <label>学年</label>
          <el-input v-model="input10" placeholder="请输入内容" clearable/>
        </div>
        <div class="condition">
          <label>学年</label>
          <el-input v-model="input10" placeholder="请输入内容" clearable/>
        </div>
        <div class="condition">
          <label>学年</label>
          <el-input v-model="input10" placeholder="请输入内容" clearable/>
        </div>
        <div class="condition">
          <label>学年</label>
          <el-input v-model="input10" placeholder="请输入内容" clearable/>
        </div>
        <div class="condition">
          <label>学年</label>
          <el-input v-model="input10" placeholder="请输入内容" clearable/>
        </div>
      </condition>
      <operation>
        <el-button type="primary" plain>检索</el-button>
        <el-button type="primary" plain>导入</el-button>
        <el-button type="primary" plain>导出</el-button>
        <el-button type="primary" plain>模板下载</el-button>
      </operation>
    </div>
  </div>
</template>

<script>
import { getList } from '@/api/table'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      search: {
        xn: 2018,
        xq: '1'
      },
      input10: '',
      options: [{ label: '2018-2019学年', value: '2018' }]
    }
  },
  created() {
    // this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    }
  }
}
</script>
