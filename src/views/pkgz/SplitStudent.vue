<template>
  <div>
    <!-- <el-radio-group v-model="splitType">
      <el-radio :label="1">按选课结果将学生分班</el-radio>
      <el-radio :label="2">按考试成绩将学生分班</el-radio>
    </el-radio-group>-->
    <split-student1></split-student1>
    <!-- <split-student2 v-if="splitType==2"></split-student2> -->
  </div>
</template>
<script>
import SplitStudent1 from './SplitStudent1' // 按选课结果将学生分班
import SplitStudent2 from './SplitStudent2' // 按考试成绩将学生分班
export default {
  components: {
    SplitStudent1,
    SplitStudent2
  },
  data() {
    return {
      splitType: 1
    }
  }
}
</script>
