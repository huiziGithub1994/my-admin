<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
    <div class="app-header">
      <img class="logo" src="../../assets/ui/logo_baise.png">
      <div class="app-title">
        <p class="big">蓝墨水</p>
        <p class="small">教育云平台</p>
      </div>
      <div class="buttons">
        <label v-for="item in menus" :key="item.command" :class="{choosedMenu:choosedMenu.command ==item.command }" @click="handleMenuChange(item)">{{ item.name }}</label>
        <span>
          <el-tooltip class="item" effect="dark" content="修改密码" placement="bottom">
            <img src="../../assets/ui/icon_suo.png" @click="dialogUpdatePwd = true">
          </el-tooltip>
        </span>
        <span>
          <el-tooltip class="item" effect="dark" content="更换皮肤" placement="bottom">
            <img src="../../assets/ui/icon_pifu.png">
          </el-tooltip>
        </span>
        <span @click="logoutBtn">
          <el-tooltip class="item" effect="dark" content="退出" placement="bottom">
            <img src="../../assets/ui/icon_tuichu.png">
          </el-tooltip>
        </span>
      </div>
    </div>
    <sidebar class="sidebar-container"/>
    <div class="main-container">
      <tags-view/>
      <app-main/>
    </div>
    <el-dialog title="修改密码" :visible.sync="dialogUpdatePwd" width="400px">
      <el-form :model="pwdForm" :rules="rules" ref="ruleForm" label-width="80px">
        <el-form-item label="原密码" prop="oldPwd">
          <el-input v-model.trim="pwdForm.oldPwd" type="password" clearable></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input v-model.trim="pwdForm.newPwd" type="password" clearable></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="newPwdSame">
          <el-input v-model.trim="pwdForm.newPwdSame" type="password" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUpdatePwd = false">取 消</el-button>
        <el-button type="primary" @click="saveBtn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { initUserPwd } from '@/api/base'
import { mapGetters } from 'vuex'
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
      dialogUpdatePwd: false,
      // 密码
      pwdForm: {
        oldPwd: '',
        newPwd: '',
        newPwdSame: ''
      },
      rules: {
        oldPwd: [
          { required: true, message: '请输入原始密码', trigger: 'blur' }
        ],
        newPwd: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        newPwdSame: [
          { required: true, message: '请输入确认密码', trigger: 'blur' }
        ]
      },
      choosedMenu: {
        name: '',
        command: ''
      }
    }
  },
  computed: {
    ...mapGetters(['menutype', 'userType']),
    menus() {
      if (this.userType === '2') {
        return [{ command: 'xk', name: '选课平台' }]
      }
      return [
        { command: 'zb', name: '走班排课' },
        { command: 'pt', name: '普通排课' },
        { command: 'xk', name: '选课平台' }
      ]
    },
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
  mounted() {
    Object.assign(this.choosedMenu, this.menus[0])
  },
  methods: {
    // 修改密码
    saveBtn() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          const { newPwd, newPwdSame } = this.pwdForm
          if (newPwd !== newPwdSame) {
            this.$message.warning('新密码和确认密码不一致，请重新输入')
            return
          }
          await initUserPwd(this.pwdForm)
          this.$message.success('修改密码成功')
          this.dialogUpdatePwd = false
        } else {
          return false
        }
      })
    },
    // 退出登录
    logoutBtn() {
      this.$store.dispatch('LogOut').then(() => {
        this.$router.push({ path: '/login' })
        // location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    handleMenuChange(choosed) {
      if (this.choosedMenu.command === choosed.command) return
      this.choosedMenu = choosed
      this.$store.commit('SET_MENUTYPE', choosed.command)
      this.initLocal() // local 变量
      this.$store.dispatch('delAllViews')
      if (this.userType !== '2') this.$router.push({ name: 'Home' })
      this.$store.dispatch('addView', this.$route)
    },
    initLocal() {
      this.$store.commit('SET_ARRANGENAME', '')
      const sessions = [
        'local_arrangeId',
        'arrangeName',
        'local_curYear',
        'local_curTerm',
        'gradeStr'
      ]
      sessions.forEach(key => {
        sessionStorage.removeItem(key)
      })
      // sessionStorage.setItem('local_curYear', getCookie('curYear'))
      // sessionStorage.setItem('local_curTerm', getCookie('curTerm'))
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
  background: #3887fe;
  .logo {
    width: 35px;
    height: 50px;
    margin-top: 5px;
    margin-left: 24px;
    float: left;
  }
  .app-title {
    display: inline-block;
    height: 100%;
    float: left;
    margin-left: 10px;
    padding-top: 10px;
    p {
      margin: 0;
      line-height: 20px;
      color: white;
      &.big {
        font-size: 17px;
      }
    }
  }
  .buttons {
    float: right;
    margin-right: 24px;
    height: 60px;
    line-height: 60px;
    > label {
      margin-left: 10px;
      color: white;
      background: #5a9cfc;
      padding: 7px 12px;
      border-radius: 15px;
      &.choosedMenu {
        background: white !important;
        color: #3788fe !important;
      }
      &:hover {
        cursor: pointer;
        background: #0066ff;
      }
    }
    > span {
      margin-left: 10px;
      display: inline-block;
      height: 60px;
      img {
        width: 38px;
        height: 38px;
        position: relative;
        top: 12px;
      }
    }
    > span:hover {
      cursor: pointer;
      opacity: 0.8;
    }
  }
}
</style>
