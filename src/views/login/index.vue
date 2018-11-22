<template>
  <div class="personLogin">
    <div class="login-header">
      <div class="header-content">
        <span>理水永昌实验中学</span>
        <div class="time-font">{{ time }}</div>
      </div>
    </div>
    <div class="login-middle">
      <div class="middle-content">
        <div class="form-box">
        </div>
        <div class="form-area">
          <div class="form-conter">
            <p class="login-title">用户登录</p>
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="demo-ruleForm">
              <el-form-item prop="loginid">
                <el-input class="input-margin" placeholder="用户名" v-model.trim="ruleForm.loginid">
                </el-input>
              </el-form-item>
              <el-form-item prop="loginpwd">
                <el-input class="input-margin" placeholder="密码" type="password" v-model.trim="ruleForm.loginpwd" auto-complete="off">
                </el-input>
              </el-form-item>
              <el-form-item prop="validateCode">
                <el-row class="input-margin" :gutter="20">
                  <el-col :span="13">
                    <el-input placeholder="验证码" readonly @keyup.enter.native ="submitForm('ruleForm')" v-model.trim="ruleForm.validateCode" auto-complete="off"> </el-input>
                  </el-col>
                  <el-col :span="11">
                    <div class="log-img" v-loading="imgLoading" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0,0,0, 0.5)">
                      这是验证码
                    </div>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item>
                <div>
                  <el-button class="btn-sub" type="primary" @click="submitForm('ruleForm')">立即登录</el-button>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
    <div class="login-bottom">
      <p>COPYRIGHT © {{ currentTime }} BY 湖南<span class="t-color"><a target="_Blank" href="http://www.kingosoft.com/"> 青果软件 </a> </span>有限公司  版权所有  湘ICP备11014513号-1</p>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import moment from 'moment'
export default {
  data() {
    return {
      showFloat: false,
      currentTime: new Date().getFullYear(),
      Showanimat: true,
      ShowImg: '', // 上方显示图片
      styleObject: {
        borderColor: '#f56c6c'
      },
      ruleForm: {
        loginid: '', // 用户名
        loginpwd: '', // 密码
        validateCode: '' // 验证码
      },
      rules: {},
      queryString: [],
      queryStringtk: [],
      time: null,
      checkCode: null,
      picSrc: '',
      imgLoading: false
    }
  },
  mounted() {
    this.showFloat = true
  },
  created() {
    this.getTime()
  },
  methods: {
    ...mapMutations(['SET_LOGINID']),
    // 登录
    submitForm(fromRes) {
      console.log('nm')
      this.$router.push({ name: 'Home' })
    },
    requestVali() {},
    getTime: function() {
      this.time = moment().format('YYYY 年 MM 月 DD 日 HH:mm')
    }
  }
}
</script>

<style>
.form-conter .el-input--small .el-input__inner {
  height: 38px;
  line-height: 38px;
}
.form-conter .el-input--small .el-input__inner:focus {
  box-shadow: #409eff 0px 0px 8px;
}
.log-img .el-loading-spinner {
  margin-top: -15px;
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.login-title {
  width: 95px;
  margin: 30px auto;
  font-size: 20px;
  letter-spacing: 3px;
}
.fa {
  margin: 13px 8px 0 5px;
  color: #ccc;
}
.personLogin {
  width: 100%;
  height: 100%;
}
.time-font {
  font-size: 15px;
  float: right;
}
.header-content {
  width: 72%;
  margin: 0 auto;
  > span {
    font-size: 1.5rem;
  }
}
.login-header {
  height: 100px;
  line-height: 100px;
}
.login-middle {
  height: 60%;
  background: url('../../assets/login/Newlogin.png') no-repeat left center;
  background-size: 100%;
}
.middle-content {
  width: 72%;
  height: 100%;
  margin: 0 auto;
  position: relative;
  /* border:1px solid red; */
}
.form-box {
  width: 472px;
  height: 152px;
  position: absolute;
  right: -79px;
  bottom: -61px;
  background: url('../../assets/login/bg.png') no-repeat left center;
}
.form-area {
  width: 350px;
  height: 384px;
  position: absolute;
  right: 0;
  bottom: -61px;
  z-index: 99;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.6);
  /* box-shadow: 2px 3px 1px #e4e4e4; */
  box-shadow: 0px 1px 1px #e4e4e4;
}
.form-conter {
  width: 80%;
  margin: 30px auto;
  /* border:1px solid red; */
}
.input-margin {
  margin-bottom: 5px;
  font-size: 14px;
}

.btn-sub {
  width: 100%;
  height: 38px;
  border-radius: 3px;
  font-size: 16px;
  letter-spacing: 3px;
  margin-top: 20px;
}
.log-img {
  width: 100%;
  height: 100%;
  height: 38px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

.login-bottom {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 35px;
  line-height: 35px;
  background: #f0eef5;
  z-index: 100;
  font-size: 0.9rem;
}
.login-bottom > p {
  text-align: center;
  margin: 0;
}
.t-color a {
  color: #f3a100;
}
.code-style {
  width: 100%;
  height: 100%;
}
.img-login {
  position: absolute;
  left: 31%;
  top: -82px;
}
.img-login img {
  width: 9rem;
}
</style>
