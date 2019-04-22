<template>
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
        <el-button class="loginBtn" type="primary" @click="submitForm" :loading="loginLoading">登 录</el-button>
      </el-form>
    </div>
  </div>
</template>
<script>
import { getValidCode } from '@/api/login'

export default {
  data() {
    return {
      loginLoading: false,
      codeSrc: '',
      ruleForm: {
        loginid: '13874689744', // 用户名 lmsadmin 190302
        loginpwd: '13874689744', // 密码 123456  190302
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
      }
    }
  },
  created() {
    this.fetchValidCode()
  },
  methods: {
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
                  name: 'Xsxkh5'
                })
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
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
div.login {
  width: 100%;
  height: 100%;
  background: white;
  position: relative;
  display: flex;
  flex-direction: column;
  padding-top: 1rem;
  > .logo {
    height: 3.5rem;
    text-align: center;
    > img {
      width: 7rem;
      height: 100%;
    }
  }
  > .form-wapper {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 75%;
    margin-left: 12.5%;
  }
}
.loginBtn {
  width: 100%;
  height: 35px;
  background: #3887fe;
  text-align: center;
  color: white;
  cursor: pointer;
  font-size: 17px;
}
.other {
  color: #333333;
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
</style>

