<template>
  <div>
    <p class="tip">
      <label>温馨提示：</label>点击“开始自动分配”后，平台会按学生的选择结果进行教学分班，分班结果可以按“调整分班”对学生分班进行调整
    </p>
    <div v-area>
      <condition>
        <div class="condition">
          <label>教学班</label>
          <el-select v-model="listQuery['a.room_name06']" clearable placeholder="请选择">
            <el-option v-for="item in classesOption" :key="item.classId" :label="item.className" :value="item.className"></el-option>
          </el-select>
        </div>
        <div class="condition">
          <label>学号</label>
          <el-input v-model="listQuery['a.room_name06']" clearable></el-input>
        </div>
        <div class="condition">
          <label>姓名</label>
          <el-input v-model="listQuery['a.room_name06']" clearable></el-input>
        </div>
      </condition>
      <operation class="btns">
        <el-button type="primary" @click="queryBtn">查询</el-button>
        <el-button type="primary">调整分班</el-button>
        <el-button type="primary">“开始自动分配</el-button>
      </operation>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      listQuery: {},
      classesOption: []
    }
  },
  methods: {
    queryBtn() {}
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.tip {
  margin: 10px 0;
}
</style>
