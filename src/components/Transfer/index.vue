<template>
  <div>
    <div class="transfer-wapper">
      <div class="transfer-bock" :style="{'height':height+'px'}">
        <div class="head">
          可选课程
          <span>{{ canSelectedLength }}/{{ canData.length }}</span>
        </div>
        <div class="content" :style="{'height':height-40+'px'}">
          <div v-if="search">
            <el-input placeholder="请输入课程" prefix-icon="el-icon-search" v-model.trim="filterValue" clearable></el-input>
          </div>
          <p v-for="item in canData" :key="item.key1">
            <el-checkbox v-model="canSelect[item.key1]" @change="selectChange('canSelect')">{{ item.label }}</el-checkbox>
          </p>
        </div>
      </div>
      <div class="transfer-btns" :style="{'height':height+'px'}">
        <div>
          <p>
            <el-button :type="disabledBtn.one ? 'info':'primary'" :plain="disabledBtn.one" :disabled="disabledBtn.one" @click="twoToOne">
              <i class="el-icon-arrow-left"></i>取消
            </el-button>
          </p>
          <p>
            <el-button :type="disabledBtn.two ? 'info':'primary'" :plain="disabledBtn.two" :disabled="disabledBtn.two" @click="oneToTwo">
              选择
              <i class="el-icon-arrow-right"></i>
            </el-button>
          </p>
        </div>
      </div>
      <div class="transfer-bock" :style="{'height':height+'px'}">
        <div class="head">
          已选课程
          <span>{{ alreadySelectedLength }}/{{ alreadyData.length }}</span>
        </div>
        <div class="content" :style="{'height':height-40+'px'}">
          <p v-for="item in alreadyData" :key="item.key1">
            <el-checkbox v-model="alreadySelect[item.key1]" @change="selectChange('alreadySelect')">{{ item.label }}</el-checkbox>
          </p>
        </div>
      </div>
      <div class="transfer-btns" :style="{'height':height+'px'}" v-if="ismust !== '0'">
        <div>
          <p>
            <el-button :type="disabledBtn.three ? 'info':'primary'" :plain="disabledBtn.three" :disabled="disabledBtn.three" @click="threeToTwo">
              <i class="el-icon-arrow-left"></i>取消
            </el-button>
          </p>
          <p>
            <el-button :type="disabledBtn.four ? 'info':'primary'" :plain="disabledBtn.four" :disabled="disabledBtn.four" @click="twoToThree">
              选择
              <i class="el-icon-arrow-right"></i>
            </el-button>
          </p>
        </div>
      </div>
      <div class="transfer-bock" :style="{'height':height+'px'}" v-if="ismust !== '0'">
        <div class="head">
          必选课程
          <span>{{ mustSelectedLength }}/{{ mustData.length }}</span>
        </div>
        <div class="content" :style="{'height':height-40+'px'}">
          <p v-for="item in mustData" :key="item.key1">
            <el-checkbox v-model="mustSelect[item.key1]" @change="selectChange('mustSelect')">{{ item.label }}</el-checkbox>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const init = {
  disabledBtn: {
    one: true,
    two: true,
    three: true,
    four: true
  },
  // 可选课程
  canSelectedLength: 0,
  canData: [],
  canSelect: {},
  // filterTempData: [],
  // 已选课程
  alreadySelectedLength: 0,
  alreadyData: [],
  alreadySelect: {},
  // 必选课程
  mustSelectedLength: 0,
  mustData: [],
  mustSelect: {}
}
export default {
  props: {
    search: {
      type: Boolean,
      default: false
    },
    chooseData: {
      type: Object,
      default: function() {
        return {}
      }
    },
    datas: {
      type: Array,
      default: function() {
        return []
      }
    },
    height: {
      type: Number,
      default: 0
    },
    ismust: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      ...init,
      filterValue: ''
    }
  },
  watch: {
    datas(val) {
      this.canData = [...val]
      // this.filterTempData = [...val]
      // 数据回填
      const { choseValue, mustChoseStr } = this.chooseData
      // 已选课程
      choseValue.forEach(key => {
        this.canSelect[key] = true
      })
      this.transfer('can', 'already')
      // 必选课程
      mustChoseStr &&
        mustChoseStr.split(',').forEach(item => {
          this.canSelect[item.split('*')[0]] = true
        })
      this.transfer('can', 'must')
    },
    filterValue() {
      this.filterData()
    }
  },
  // 可选课程
  created() {
    this.initSelect('datas', 'canSelect')
  },
  methods: {
    getData() {
      if (this.ismust === '1' && this.mustData.length !== 1) {
        this.$message.warning('必选课程不能为空')
        return false
      }
      if (this.ismust === '2' && this.mustData.length !== 2) {
        this.$message.warning('必须选择两门必选课程')
        return false
      }
      const choseValue = []
      const choseNames = []
      this.alreadyData.forEach(item => {
        choseValue.push(item.key1)
        choseNames.push(item.label)
      })
      const mustChoseStr = []
      this.mustData.forEach(item => {
        mustChoseStr.push(item.key1 + '*' + item.label)
      })
      return {
        choseValue: choseValue.join(','),
        choseNames: choseNames.join(','),
        mustChoseStr: mustChoseStr.join(',')
      }
    },
    initSelect(flag, select) {
      this[select] = {}
      this[flag].forEach(item => {
        this.$set(this[select], item.key1, false)
      })
    },
    filterData() {
      if (this.canData.length === 0) return
      if (!this.filterValue) {
        // this.canData = [...this.filterTempData]
        return
      }
      const newArr = []
      this.canData.forEach(item => {
        if (item.label.indexOf(this.filterValue) > -1) {
          newArr.unshift(item)
        } else {
          newArr.push(item)
        }
      })
      this.canData = newArr
    },
    // checkbox改变时
    selectChange(flag) {
      const arr = Object.keys(this[flag])
      this[flag + 'edLength'] = arr.filter(key => this[flag][key]).length
      const isChoosed = arr.some(key => this[flag][key])
      switch (flag) {
        // 可选课程
        case 'canSelect':
          this.disabledBtn.two = !isChoosed
          break
        case 'alreadySelect':
          this.disabledBtn.one = !isChoosed
          this.disabledBtn.four = !isChoosed
          break
        case 'mustSelect':
          this.disabledBtn.three = !isChoosed
          break
      }
    },
    // 选择按钮 可选课程-》已选课程
    oneToTwo() {
      this.transfer('can', 'already')
    },
    // 取消按钮 已选课程-》可选课程
    twoToOne() {
      this.transfer('already', 'can')
    },
    // 选择按钮 》已选课程->必选课程
    twoToThree() {
      const selectedKeys = Object.keys(this.alreadySelect).filter(key => {
        if (this.alreadySelect[key]) return key
      })
      if (selectedKeys.length + this.mustData.length > +this.ismust) {
        this.$message.warning('必选课程不能超过' + this.ismust + '科')
        return
      }
      this.transfer('already', 'must')
    },
    // 选择按钮 》必选课程->已选课程
    threeToTwo() {
      this.transfer('must', 'already')
    },
    transfer(from, to) {
      const fromSelect = from + 'Select'
      const toSelect = to + 'Select'
      const fromData = from + 'Data'
      const toData = to + 'Data'
      const selectedKeys = Object.keys(this[fromSelect]).filter(key => {
        if (this[fromSelect][key]) return key
      })
      const newArr = this[fromData].filter(item =>
        selectedKeys.includes(item.key1)
      )
      this[toData] = [...this[toData], ...newArr]
      this[fromData] = this[fromData].filter(
        item => !selectedKeys.includes(item.key1)
      )
      // if (from === 'can') {
      //   this.filterTempData = this.filterTempData.filter(
      //     item => !selectedKeys.includes(item.key1)
      //   )
      // }
      this.initSelect(fromData, fromSelect)
      this.initSelect(toData, toSelect)
      this.selectChange(fromSelect)
      this.selectChange(toSelect)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.transfer-wapper {
  > div {
    float: left;
  }
  .transfer-bock {
    border: 1px solid #dddddd;
    width: 25%;
    max-width: 300px;
    .head {
      height: 40px;
      line-height: 40px;
      background: #f5f7fa;
      border-bottom: 1px solid #dddddd;
      padding: 0 15px;
      > span {
        float: right;
        color: #9c93b1;
      }
    }
    .content {
      padding: 10px 15px;
      overflow: auto;
      p {
        margin: 0;
      }
    }
  }
  .transfer-btns {
    width: 100px;
    display: flex;
    justify-content: center;
    align-items: Center;
  }
}
</style>

