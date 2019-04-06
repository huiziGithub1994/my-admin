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
        <ul class="classInfo" v-if="mergeInfo.length">
          <li v-for="(item,index) in mergeInfo" :key="index" @click="selectedMergeInfo = item" :class="{active:selectedMergeInfo.joinId === item.joinId}">{{ item.classStr }}</li>
        </ul>
        <p v-else>暂无合班信息</p>
      </div>
    </div>
  </div>
</template>
<script>
import { qrySegGradeTree } from '@/api/njkc'
import {
  getTeachGroupTreeData,
  qryJoinClassL,
  saveSjsJoinClasses
} from '@/api/pkgzPt'
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
    // 获取班级信息
    this.fetchClassesData()
    // 获取课程信息
    this.fetchCourseData()
    // 获取合班信息
    this.fetchMergeClass()
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
    // 获取合班信息
    async fetchMergeClass() {
      const res = await qryJoinClassL({ arrangeId: this.arrangeId })
      this.mergeInfo = res.DATA || []
    },
    // 合班按钮的点击
    async mergeClick() {
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
      const onlyClasses = selectClasses.filter(item => item.classId)
      const courseName = selectCourse.label
      const joinStr = []
      const className = []
      onlyClasses.forEach(item => {
        joinStr.push(item.classId)
        className.push(item.className)
      })
      if (this.existThisInfo(joinStr.join(','), courseName)) {
        this.$message.warning('该合班信息已存在，不要重复添加')
        return
      }
      await saveSjsJoinClasses({
        joinStr: joinStr.join(','),
        classStr: `${className.join('-')} ${courseName}`,
        courseName,
        arrangeId: this.arrangeId,
        act: 0
      })
      this.fetchMergeClass()
    },
    existThisInfo(joinStr, courseName) {
      const index = this.mergeInfo.findIndex(value => {
        return joinStr === value.joinStr && courseName === value.courseName
      })
      const no = -1
      return index > no
    },
    // 解散按钮
    async cancelBtn() {
      if (Object.keys(this.selectedMergeInfo).length === 0) {
        this.$message.warning('请先选则要解散的班级')
        return
      }
      const {
        joinId,
        joinStr,
        classStr,
        courseName,
        arrangeId
      } = this.selectedMergeInfo
      await saveSjsJoinClasses({
        joinId,
        joinStr,
        classStr,
        courseName,
        arrangeId,
        act: 1
      })
      this.fetchMergeClass()
      this.$message.success('解散成功')
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
  > p {
    text-align: center;
    color: #b3b3b3;
  }
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

