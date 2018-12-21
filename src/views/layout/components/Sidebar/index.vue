<template>
  <div>
    <div class="userInfo">
      <img src="../../../../assets/ui/Avatar.png">
      <div>系统管理员</div>
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
    ...mapGetters(['sidebar', 'menutype']),
    routes() {
      const allRoutes = this.$router.options.routes
      if (this.menutype === 'zb') {
        return allRoutes.slice(0, 6)
      } else if (this.menutype === 'pt') {
        return [...allRoutes.slice(0, 5), ...allRoutes.slice(6, 7)]
      } else {
        return [
          ...allRoutes.slice(0, 5),
          ...allRoutes.slice(7, allRoutes.length)
        ]
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
