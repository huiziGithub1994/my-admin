<!-- 合班设置 -->
<template>
  <div class="content">
    <div class="block">
      <div class="title">选择班级</div>
      <div class="group" :style="{height:groupHeiht}">
        <el-cascader expand-trigger="hover" :options="classOptions" v-model="selectedClass" @change="selectedClassChange"></el-cascader>
        <ul class="classInfo">
          <li v-for="(item,index) in classInfo" :key="item.id+index" @click="classClick(item)" :class="{active:selectedClassIds.includes(item.id)}">{{ item.text }}</li>
        </ul>
      </div>
    </div>
    <div class="block">
      <div class="title">选择课程</div>
      <div class="group" :style="{height:groupHeiht}">
        <ul class="classInfo">
          <li v-for="(item,index) in courseInfo" :key="item.id+index" @click="selectedCurseInfo = item" :class="{active:selectedCurseInfo.id === item.id}">{{ item.text }}</li>
        </ul>
      </div>
    </div>
    <div class="btns" :style="{height:groupHeiht}">
      <div>
        <el-button type="success" plain @click="mergeClick">合班＞＞</el-button>
        <el-button type="primary" plain class="marginLeft" @click="cancelBtn">＜＜解散</el-button>
      </div>
    </div>
    <div class="block block-last">
      <div class="title">合班上课列表</div>
      <div class="group" :style="{height:groupHeiht}">
        <ul class="classInfo">
          <li v-for="(item,index) in mergeInfo" :key="index" @click="selectedMergeInfo = item" :class="{active:selectedMergeInfo.id === item.id}">{{ item.text }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { classCascaderSelect } from '@/components/selectChild/data'
import { getClasses, getCourse } from '@/api/pkgzPt'
export default {
  data() {
    const h = 260
    const heightG = document.body.clientHeight - h
    return {
      groupHeiht: heightG + 'px',
      // 班级级联下拉选项
      classOptions: [],
      // 班级级联下拉选项选中的声音
      selectedClass: [],
      // 班级信息
      classInfo: [],
      selectedClassIds: [],
      selectedClassName: [],
      // 课程信息
      courseInfo: [],
      selectedCurseInfo: {},
      // 合班信息
      mergeInfo: [],
      selectedMergeInfo: {}
    }
  },
  created() {
    this.classOptions = [...classCascaderSelect]
    this.fetchCourse()
  },
  methods: {
    // 获取课程信息
    async fetchCourse() {
      const res = await getCourse()
      this.courseInfo = res.DATA
    },
    // 班级级联下拉选项改变时
    async selectedClassChange(value) {
      const res = await getClasses()
      this.classInfo = res.DATA
    },
    // 选择班级
    classClick(val) {
      const pos = this.selectedClassIds.indexOf(val.id)
      if (pos === -1) {
        this.selectedClassIds.push(val.id)
        this.selectedClassName.push(val.text)
      } else {
        this.selectedClassIds.splice(pos, 1)
        this.selectedClassName.splice(pos, 1)
      }
    },
    // 合班按钮的点击
    mergeClick() {
      const classLen = this.selectedClassIds.length
      if (classLen === 0) {
        this.$message.warning('请选择班级')
        return
      }
      if (classLen === 1) {
        this.$message.warning('班级最少为两个')
        return
      }
      if (Object.keys(this.selectedCurseInfo).length === 0) {
        this.$message.warning('请选择课程')
        return
      }
      const text =
        this.selectedClassName.join('-') + ' ' + this.selectedCurseInfo.text
      this.mergeInfo.push({ id: Number.parseInt(Math.random() * 1000), text })
      console.log(this.mergeInfo)
      this.$message.success('合班成功')
      this.clearSelectInfo()
    },
    // 解散按钮
    cancelBtn() {
      if (Object.keys(this.selectedMergeInfo).length === 0) {
        this.$message.warning('请先选则要解散的班级')
        return
      }
      const len = this.mergeInfo.length
      const mergeInfo = this.mergeInfo
      for (let i = 0; i < len; i++) {
        if (mergeInfo[i].id === this.selectedMergeInfo.id) {
          this.mergeInfo.splice(i, 1)
          this.$message.success('解散成功')
          this.selectedMergeInfo = {} // 清空数据
          return
        }
      }
    },
    // 清空选中的班级和课程信息
    clearSelectInfo() {
      this.selectedClassIds = []
      this.selectedClassName = []
      this.selectedCurseInfo = {}
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.content > div {
  float: left;
  margin-right: 10px;
}
.block {
  width: 250px;
  .title {
    margin-bottom: 10px;
  }
  &.block-last {
    width: 350px;
  }
}
.btns {
  width: 82px;
  display: flex;
  justify-content: center;
  align-items: center;
  > div {
    vertical-align: middle;
  }
}
.group {
  border-radius: 5px;
  padding: 5px;
  border: 1px solid #dddddd;
  overflow: auto;
}
.marginLeft {
  margin-top: 10px;
  margin-left: 0;
}
.el-cascader {
  width: 100%;
}
.classInfo {
  padding: 0;
  margin: 0;
  > li {
    text-decoration: none;
    margin-bottom: 5px;
    line-height: 35px;
    padding-left: 5px;
    &.active {
      background: #d5d5d5 !important;
    }
    &:hover {
      background: #efefef;
      cursor: pointer;
    }
  }
}
</style>

