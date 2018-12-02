<template>
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
        return allRoutes.slice(0, 5)
      } else if (this.menutype === 'pt') {
        return [...allRoutes.slice(0, 4), ...allRoutes.slice(5, 6)]
      } else {
        return [
          ...allRoutes.slice(0, 4),
          ...allRoutes.slice(6, allRoutes.length)
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
