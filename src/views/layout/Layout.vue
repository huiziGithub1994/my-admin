<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
    <div class="app-header">
      <img class="logo" src="/src/assets/logo.jpg">
      <!-- <span class="app-title">理水永昌实验中学</span> -->
      <div class="buttons">
        <el-dropdown @command="handleMenuChange">
          <span class="el-dropdown-link">
            <!-- <i class="el-icon-arrow-down"/> -->
            {{ choosedMenu.name }}
            <i class="el-icon-arrow-down el-icon--right"/>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="{command:'zb',name:'走班排课'}">走班排课</el-dropdown-item>
            <el-dropdown-item :command="{command:'pt',name:'普通排课'}">普通排课</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span>
          <el-tooltip class="item" effect="dark" content="修改密码" placement="bottom">
            <svg-icon icon-class="password1"/>
          </el-tooltip>
        </span>
        <span>
          <el-tooltip class="item" effect="dark" content="更换皮肤" placement="bottom">
            <svg-icon icon-class="skin1"/>
          </el-tooltip>
        </span>
        <span @click="logoutBtn">
          <el-tooltip class="item" effect="dark" content="退出" placement="bottom">
            <svg-icon icon-class="logout1" class="logout"/>
          </el-tooltip>
        </span>
      </div>
    </div>
    <sidebar class="sidebar-container"/>
    <div class="main-container">
      <!-- <navbar/> -->
      <tags-view/>
      <app-main/>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  },
  mixins: [ResizeMixin],
  data() {
    return {
      choosedMenu: {
        name: '走班排课',
        command: 'zb'
      }
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    // 退出登录
    logoutBtn() {
      console.log('退出')
      this.$store.dispatch('LogOut').then(() => {
        this.$router.push({ path: '/login' })
        // location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    handleMenuChange(choosed) {
      if (this.choosedMenu.command === choosed.command) return
      this.choosedMenu = choosed
      this.$store.commit('SET_MENUTYPE', choosed.command)
      this.$store.dispatch('delAllViews')
      this.$router.push({ name: 'Home' })
    },
    handleClickOutside() {
      this.$store.dispatch('closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  &.mobile.openSidebar {
    position: fixed;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
.app-header {
  height: 60px;
  line-height: 60px;
  border-bottom: 1px solid #42b983;
  .logo {
    height: 50px;
    width: 50px;
    border-radius: 50%;
    margin: 5px 30px 5px 60px;
    float: left;
  }
  .app-title {
    font-size: 25px;
    letter-spacing: 4px;
  }
  .buttons {
    float: right;
    margin-right: 20px;
    height: 100%;
    > div.el-dropdown {
      height: 25px;
      line-height: 25px;
      bottom: 5px;
      margin-right: 10px;
      font-size: 1.1rem;
      > .el-dropdown-link {
        color: #008ad4;
        cursor: pointer;
      }
    }
    > span {
      display: inline-block;
      height: 40px;
      width: 40px;
      line-height: 40px;
      padding-left: 7px;
      padding-top: 7px;
      margin-top: 10px;
      border-radius: 50%;
      background-color: rgb(48, 65, 86);
      > svg {
        width: 25px;
        height: 25px;
      }
    }
    > span:hover {
      background: rgba(88, 104, 123, 0.7);
      cursor: pointer;
    }
  }
}
</style>
