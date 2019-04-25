<template>
  <div class="content">
    <div class="header">
      <!-- <div>蓝墨水 云平台</div>
      <div class="currentTime">
        {{ time.day }}
        <span>{{ time.week }}</span>
      </div>-->
    </div>
    <div class="article">
      <div class="desk"></div>
      <div class="login">
        <div class="logo">
          <img src="../../assets/ui/logo.png">
        </div>
        <div class="form-wapper">
          <el-form :model="ruleForm" :rules="rules" ref="rule" label-width="0px" class="demo-ruleForm">
            <el-form-item label prop="loginid">
              <el-input v-model.trim="ruleForm.loginid" size="middle" placeholder="已验证手机/邮箱/用户名" :maxlength="15">
                <i slot="prefix" class="login-ipt-img">
                  <svg-icon icon-class="user"/>
                </i>
              </el-input>
            </el-form-item>
            <el-form-item label prop="loginPwd">
              <el-input v-model.trim="ruleForm.loginpwd" size="middle" placeholder="密码" :maxlength="15" type="password">
                <i slot="prefix" class="login-ipt-img">
                  <svg-icon icon-class="password"/>
                </i>
              </el-input>
            </el-form-item>
            <el-form-item label prop="validateCode">
              <div class="pwd-code">
                <div class="pwd-wapper">
                  <el-input v-model.trim="ruleForm.validateCode" size="middle" placeholder="验证码" :maxlength="4" @keyup.enter.native="submitForm">
                    <i slot="prefix" class="login-ipt-img">
                      <svg-icon icon-class="code"/>
                    </i>
                  </el-input>
                </div>
                <div class="code-wapper">
                  <img :src="codeSrc" @click="fetchValidCode()">
                </div>
              </div>
            </el-form-item>
            <div class="school">
              <el-select size="middle" v-model.trim="schoolValue" filterable remote reserve-keyword placeholder="请输入学校名称" :remote-method="remoteMethod" :loading="selectLoading">
                <el-option v-for="item in schoolOptions" :key="item.schoolCode" :label="item.schoolName" :value="item.schoolCode"></el-option>
              </el-select>
            </div>
            <div class="autoLogin">
              <el-checkbox v-model="autoLogin">记住用户</el-checkbox>
              <!-- <span class="pwdReg">
                <span>找回密码</span>
                <span>注册新用户</span>
              </span>-->
            </div>
            <el-button class="loginBtn" type="primary" @click="submitForm" :loading="loginLoading">登 录</el-button>
            <!-- <div class="other">
              <p>使用第三方账号登录</p>
              <div>
                <img src="../../assets/ui/qq.png">
                <img src="../../assets/ui/zfb.png">
                <img src="../../assets/ui/weibo.png">
                <img src="../../assets/ui/360.png">
                <img src="../../assets/ui/baidu.png">
              </div>
            </div>-->
          </el-form>
        </div>
        <div class="copyright">Copyright c {{ currentYear }} 湖南蓝墨水软件科技有限公司</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getValidCode, qrySjsSchoolList } from '@/api/login'
import { getCookie, setCookie, removeCookie } from '@/utils/auth'
import moment from 'moment'
export default {
  data() {
    return {
      selectLoading: false, // 学校搜索loading
      schoolOptions: [], // 学校下拉数据
      schoolValue: '', // 学校下拉选中值
      loginLoading: false,
      codeSrc: '',
      ruleForm: {
        loginid: '', // 用户名 lmsadmin 190302
        loginpwd: '', // 密码 123456  190302
        validateCode: ''
      },
      rules: {
        loginid: {
          required: true,
          message: '请输入已验证手机/邮箱/用户名',
          trigger: 'blur'
        },
        loginpwd: {
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        },
        validateCode: {
          required: true,
          message: '请输入验证码',
          trigger: 'blur'
        }
      },
      time: {},
      currentYear: new Date().getFullYear(),
      autoLogin: false // 自动登录
    }
  },
  computed: {
    ...mapGetters(['userType'])
  },
  created() {
    this.getTime()
    this.fetchValidCode()
    this.isRememberUser()
  },
  methods: {
    // 学校名称搜索
    async remoteMethod(query) {
      if (query !== '') {
        this.selectLoading = true
        const res = await qrySjsSchoolList({ schoolName: query })
        this.schoolOptions = res.DATA
        this.selectLoading = false
      } else {
        this.schoolOptions = []
      }
    },
    // 记住用户
    isRememberUser() {
      const loginid = getCookie('loginid')
      if (loginid) {
        Object.assign(this.ruleForm, { loginid })
        this.autoLogin = true
      }
    },
    async fetchValidCode() {
      const res = await getValidCode()
      this.codeSrc = res.DATA
    },
    // 登录
    submitForm() {
      this.$refs['rule'].validate(valid => {
        if (valid) {
          this.loginLoading = true
          this.$store
            .dispatch('Login', this.ruleForm)
            .then(
              res => {
                this.$router.push({
                  name: this.userType === '2' ? 'Xsxk' : 'Home'
                })
                // 记住用户
                if (this.autoLogin) {
                  setCookie('loginid', this.ruleForm.loginid, 7)
                } else {
                  removeCookie('loginid')
                }
              },
              errorRes => {
                this.fetchValidCode()
              }
            )
            .finally(() => {
              this.loginLoading = false
            })
        } else {
          return false
        }
      })
    },
    requestVali() {},
    getTime: function() {
      moment.locale('zh-cn')
      this.time = {
        day: moment().format('YYYY - MM - DD'),
        week: moment().format('dddd')
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.school {
  margin-bottom: 10px;
  > div {
    width: 100%;
  }
}
.content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background: #5e80fe;
}
.header {
  height: 80px;
  line-height: 80px;
  padding: 0 10%;
  display: flex;
  justify-content: space-between;
  color: white;
  span {
    letter-spacing: 3px;
    margin-left: 6px;
  }
}
.article {
  padding: 0 15%;
  flex: 1;
  background: url(../../assets/ui/bg_dlym.png) no-repeat bottom;
  background-size: 100% 20%;
  display: flex;
  > div.desk {
    flex: 1;
    background: url(../../assets/ui/chahua.png) no-repeat;
    background-size: 100% 100%;
    height: 520px;
  }
  > div.login {
    width: 358px;
    height: 520px;
    background: white;
    padding: 20px;
    position: relative;
    .logo {
      height: 130px;
      padding: 0 25px;
      > img {
        width: 100%;
        height: 100%;
      }
    }
  }
}

.form-wapper {
  margin-top: 28px;
}
// 自动登录找回密码，注册新用户
.autoLogin {
  font-size: 1rem;
  > div.el-form-item__content {
    line-height: 25px !important;
  }
  .pwdReg {
    float: right;
    > span:first-child {
      margin-right: 3px;
      padding-right: 5px;
      border-right: 1px solid #333333;
      color: #333333;
    }
    > span:last-child {
      color: #3887ff;
    }
  }
}
.loginBtn {
  width: 100%;
  height: 35px;
  background: #3887fe;
  text-align: center;
  color: white;
  margin-top: 15px;
  cursor: pointer;
  font-size: 1.1rem;
}
.other {
  margin-top: 15px;
  color: #333333;
}
.currentTime {
  font-size: 1.2rem;
}
.login-ipt-img {
  position: relative;
  top: 3px;
}
.pwd-code {
  display: flex;
  .pwd-wapper {
    flex: 1;
  }
  .code-wapper {
    border: 1px solid #dcdfe6;
    width: 100px;
    height: 40px;
    margin-left: 5px;
    border-radius: 4px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.copyright {
  color: #e7e9fc;
  font-size: 13px;
  position: absolute;
  bottom: -22px;
  right: 0;
}
</style>

