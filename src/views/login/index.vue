<template>
  <div class="content">
    <div class="header">
      <div>蓝墨水 云平台</div>
      <div class="currentTime">
        {{ time.day }}
        <span>{{ time.week }}</span>
      </div>
    </div>
    <div class="article">
      <div class="login">
        <div class="title">登 录</div>
        <div class="form-wapper">
          <el-form :model="ruleForm" :rules="rules" ref="rule" label-width="0px" class="demo-ruleForm">
            <el-form-item label prop="loginid">
              <el-input v-model="ruleForm.loginid" size="middle" placeholder="已验证手机/邮箱/用户名" :maxlength="15">
                <i slot="prefix" class="login-ipt-img">
                  <svg-icon icon-class="user"/>
                </i>
              </el-input>
            </el-form-item>
            <el-form-item label prop="loginPwd">
              <el-input v-model="ruleForm.loginPwd" size="middle" placeholder="密码" :maxlength="15">
                <i slot="prefix" class="login-ipt-img">
                  <svg-icon icon-class="password"/>
                </i>
              </el-input>
            </el-form-item>
            <el-form-item label prop="validateCode">
              <div class="pwd-code">
                <div class="pwd-wapper">
                  <el-input v-model="ruleForm.validateCode" size="middle" placeholder="验证码" :maxlength="4">
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
            <div class="autoLogin">
              <el-checkbox v-model="autoLogin">自动登录</el-checkbox>
              <span class="pwdReg">
                <span>找回密码</span>
                <span>注册新用户</span>
              </span>
            </div>
            <div class="loginBtn" @click="submitForm">登 录</div>
            <div class="other">
              <p>你也可以使用以下账号登录</p>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <div class="footer">
      <div>Copyright c {{ currentYear }} 湖南蓝墨水软件科技有限公司</div>
    </div>
  </div>
</template>

<script>
// import { mapMutations } from 'vuex'
import { getValidCode } from '@/api/login'
import moment from 'moment'
export default {
  data() {
    return {
      codeSrc: '',
      ruleForm: {
        loginid: '', // 用户名
        loginPwd: '', // 密码
        validateCode: ''
      },
      rules: {
        loginid: {
          required: true,
          message: '请输入已验证手机/邮箱/用户名',
          trigger: 'blur'
        },
        loginPwd: {
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
  created() {
    this.getTime()
    this.fetchValidCode()
  },
  mounted() {},
  methods: {
    async fetchValidCode() {
      const res = await getValidCode()
      this.codeSrc = res.DATA
    },
    // 登录
    submitForm(fromRes) {
      this.$refs['rule'].validate(valid => {
        if (valid) {
          this.$store.dispatch('Login', this.ruleForm).then(res => {
            res.SUCCESS && this.$router.push({ name: 'Home' })
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
.content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.header {
  height: 80px;
  line-height: 80px;
  padding: 0 10%;
  display: flex;
  justify-content: space-between;
  span {
    letter-spacing: 3px;
    margin-left: 6px;
  }
}
.article {
  flex: 1;
  background: #b3d4db;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  > div.login {
    margin-right: 15%;
  }
}
.footer {
  height: 40px;
  color: white;
  line-height: 40px;
  text-align: center;
  background: #27576d;
  letter-spacing: 2px;
  font-size: 0.95rem;
}
.login {
  width: 380px;
  height: 420px;
  background: white;
  padding: 25px;
  > div.title {
    font-size: 1.4rem;
  }
}
.form-wapper {
  margin-top: 14px;
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
      color: #d10008;
    }
  }
}
.loginBtn {
  height: 35px;
  line-height: 35px;
  background: #96b7be;
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
    margin-left: 5px;
    border-radius: 4px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>

