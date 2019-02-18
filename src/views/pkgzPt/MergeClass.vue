<!-- 合班设置 -->
<template>
  <div class="content">
    <div class="block">
      <div class="title">选择班级</div>
      <div class="group" :style="{height:groupHeiht}">
        <el-tree ref="classesTreeRef" :data="classesData" show-checkbox node-key="id" default-expand-all :expand-on-click-node="false" highlight-current></el-tree>
      </div>
    </div>
    <div class="block">
      <div class="title">选择课程</div>
      <div class="group" :style="{height:groupHeiht}">
        <el-tree ref="courseTreeRef" :data="courseData" node-key="id" default-expand-all highlight-current :expand-on-click-node="false"/>
      </div>
    </div>
    <div class="btns" :style="{height:groupHeiht}">
      <div>
        <el-button type="success" @click="mergeClick">合班＞＞</el-button>
        <el-button type="primary" class="marginLeft" @click="cancelBtn">＜＜解散</el-button>
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
import { qrySegGradeTree } from '@/api/njkc'
import { getTeachGroupTreeData } from '@/api/pkgzPt'
export default {
  data() {
    const h = 260
    const heightG = document.body.clientHeight - h
    return {
      arrangeId: sessionStorage.getItem('local_arrangeId'),
      groupHeiht: heightG + 'px',
      // 班级信息
      classesData: [],
      // 课程信息
      courseData: [],
      // 合班信息
      mergeInfo: [],
      selectedMergeInfo: {}
    }
  },
  created() {
    this.fetchClassesData()
    this.fetchCourseData()
  },
  methods: {
    // 获取班级信息
    async fetchClassesData() {
      const res = await qrySegGradeTree({ arrangeId: this.arrangeId })
      this.classesData = res.DATA.children
    },
    // 获取课程信息
    async fetchCourseData() {
      const res = await getTeachGroupTreeData({ arrangeId: this.arrangeId })
      this.courseData = res.DATA
    },
    // 合班按钮的点击
    mergeClick() {
      const selectClasses = this.$refs.classesTreeRef.getCheckedNodes()
      if (selectClasses.length === 0) {
        this.$message.warning('请选择班级')
        return
      }
      if (selectClasses.length < 2) {
        this.$message.warning('班级最少为两个')
        return
      }
      const selectCourse = this.$refs.courseTreeRef.getCurrentNode()
      if (!selectCourse) {
        this.$message.warning('请选择课程')
        return
      }

      const names = selectClasses.filter(item => item.classId)
      const classesName = names.map(val => val.label).join('-')
      console.log(classesName)
      const text = classesName + ' ' + selectCourse.label
      this.mergeInfo.push({ id: parseInt(Math.random() * 1000), text })
      // this.$message.success('合班成功')
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

