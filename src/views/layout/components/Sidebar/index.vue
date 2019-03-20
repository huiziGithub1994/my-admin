<template>
  <div>
    <div class="info">
      <div class="name">{{ userName }}</div>
      <div class="condition">
        <label>学年</label>
        <selectChild v-model="listQuery['schoolYear']" :clearable="false" tp="yearSelect" @change="selectChange"/>
      </div>
      <div class="condition">
        <label>学期</label>
        <selectChild v-model="listQuery['termCode']" :clearable="false" tp="termSelect" @change="selectChange"/>
      </div>
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :show-timeout="200"
        :default-active="$route.path"
        :collapse="false"
        :default-openeds="indexArr"
        mode="vertical"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path"/>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { setCookie } from '@/utils/auth'
import SidebarItem from './SidebarItem'
export default {
  components: { SidebarItem },
  data() {
    return {
      listQuery: {
        schoolYear: '',
        termCode: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'menutype',
      'userName',
      'userType',
      'curYear',
      'curTerm'
    ]),
    routes() {
      const allRoutes = this.$router.options.routes
      const { length } = allRoutes
      if (this.userType === '2') {
        return allRoutes.slice(length - 1, length)
      }
      if (this.menutype === 'zb') {
        return allRoutes.slice(0, 8)
      } else if (this.menutype === 'pt') {
        return [...allRoutes.slice(0, 7), ...allRoutes.slice(8, 9)]
      } else {
        return [...allRoutes.slice(0, 7), ...allRoutes.slice(9, length - 1)]
      }
    },
    isCollapse() {
      return !this.sidebar.opened
    },
    indexArr() {
      const arr = []
      this.routes.forEach(item => {
        arr.push(item.path)
      })
      return arr
    }
  },
  created() {
    Object.assign(this.listQuery, {
      schoolYear: this.curYear,
      termCode: this.curTerm
    })
  },
  methods: {
    selectChange(val) {
      const { schoolYear, termCode } = this.listQuery
      this.$store.commit('SET_CURYEAR', schoolYear)
      this.$store.commit('SET_CURTERM', termCode)
      setCookie('curYear', schoolYear)
      setCookie('curTerm', termCode)
      this.$message.success('系统当前学年学期切换成功')
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.info {
  font-size: 15px;
  border-bottom: 1px solid #e8e9fd;
  padding: 8px 0;
  text-align: center;
  > div.name {
    color: #3887fe;
    font-weight: bold;
    font-size: 16px;
  }
  .condition {
    margin-top: 5px;
    > div {
      width: 160px;
    }
  }
}
</style>
