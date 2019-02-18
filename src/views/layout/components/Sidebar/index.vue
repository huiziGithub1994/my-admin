<template>
  <div>
    <div class="userInfo">
      <img src="../../../../assets/ui/Avatar.png">
      <div>{{ userName }}</div>
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
import SidebarItem from './SidebarItem'
export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters(['sidebar', 'menutype', 'userName', 'userType']),
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
  created() {}
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.userInfo {
  font-size: 12px;
  text-align: center;
  padding-top: 5px;
  img {
    width: 70px;
    height: 70px;
    border-radius: 50%;
  }
  > div {
    font-size: 16px;
    padding: 5px 0;
    border-bottom: 1px solid #e8e9fd;
  }
}
</style>
