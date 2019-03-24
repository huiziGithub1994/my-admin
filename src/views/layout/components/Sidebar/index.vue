<template>
  <div>
    <div class="info">
      <div class="userInfo">
        <img src="../../../../assets/ui/Avatar.png">
        <label class="name">{{ userName }}</label>
      </div>
      <div class="year-term">
        <label>{{ `${listQuery['schoolYear']}-${+listQuery['schoolYear']+1}学年` }}</label>
        <label class="term">{{ +listQuery['termCode'] === 1 ? "第一学期" : "第二学期" }}</label>
        <i class="el-icon-more" v-popover:popover></i>
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
    <el-popover ref="popover" placement="bottom" trigger="click">
      <div class="condition-wapper">
        <div class="condition">
          <label>学年</label>
          <el-select v-model="listQuery['schoolYear']" placeholder="请选择" :clearable="false">
            <el-option v-for="item in xnOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="condition">
          <label>学期</label>
          <selectChild v-model="listQuery['termCode']" :clearable="false" tp="termSelect"/>
        </div>
        <div class="btns">
          <el-button type="primary" @click="selectChange">确 定</el-button>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { setCookie, getCookie } from '@/utils/auth'
import SidebarItem from './SidebarItem'
export default {
  components: { SidebarItem },
  data() {
    return {
      listQuery: {
        schoolYear: '',
        termCode: ''
      },
      xnOptions: []
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
      schoolYear: +this.curYear,
      termCode: this.curTerm
    })
    this.getXnOption()
  },
  methods: {
    getXnOption() {
      const year = getCookie('curTureYear')
      const resultArr = []
      for (let i = year; i > year - 3; i--) {
        resultArr.push({ value: +i, label: `${i} - ${+i + 1} 学年` })
      }
      this.xnOptions = resultArr
    },
    selectChange(val) {
      const { schoolYear, termCode } = this.listQuery
      this.$store.commit('SET_CURYEAR', schoolYear)
      this.$store.commit('SET_CURTERM', termCode)
      setCookie('curYear', schoolYear)
      setCookie('curTerm', termCode)
      this.$message.success('系统当前学年学期切换成功')
      this.$refs.popover.doClose()
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.condition-wapper {
  padding: 15px;
  > div.condition {
    & {
      margin-bottom: 20px;
    }
    > div {
      width: 200px;
    }
  }
  > .btns {
    overflow: hidden;
    > button {
      float: right;
    }
  }
}

.info {
  font-size: 15px;
  background: white;
  border-bottom: 1px solid #e8e9fd;
  padding: 8px 0;
  > div.userInfo {
    display: flex;
    vertical-align: middle;
    height: 60px;
    line-height: 60px;
    img {
      margin-left: 45px;
      margin-right: 10px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }
    .name {
      color: #3887fe;
      font-weight: bold;
      font-size: 16px;
    }
  }
  > div.year-term {
    padding: 15px 10px 10px 10px;
    font-size: 14px;
    .term {
      margin: 0 5px;
    }
    .el-icon-more:hover {
      cursor: pointer;
      color: #3887fe;
    }
  }
}
</style>
