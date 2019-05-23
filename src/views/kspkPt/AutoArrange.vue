<template>
  <div v-loading="loading">
    <div class="operation">
      <el-button type="primary" class="float-right" @click="toAutoArrange" plain :loading="autoArrangeBtnLoading">开始排课</el-button>
    </div>
    <div class="area-data" :style="{height:areaHeight+'px'}">
      <div>
        <el-tag>自动排课处理逻辑</el-tag>
        <div class="block">
          <el-radio-group v-model="autoArrange">
            <p>
              <el-radio label="1">自动排课时如有冲突时继续直到排课安排完成</el-radio>
            </p>
            <p>
              <el-radio label="2">自动排课时如有冲突时不取消, 后面人工调整</el-radio>
            </p>
          </el-radio-group>
        </div>
      </div>
      <div>
        <el-tag>自动排课冲突时取消一下规则</el-tag>
        <div class="block">
          <el-checkbox-group v-model="checkList">
            <p>
              <el-checkbox label="1">学科禁固排</el-checkbox>
            </p>
            <p>
              <el-checkbox label="2">年级禁固排</el-checkbox>
            </p>
            <p>
              <el-checkbox label="3">教师禁固排</el-checkbox>
            </p>
          </el-checkbox-group>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { startAutoArrange } from '@/api/kspkPt'
import { arrangeNewExam } from '@/api/kspkXgk'
import { mapGetters } from 'vuex'
export default {
  name: 'AutoArrange',
  data() {
    return {
      loading: false,
      autoArrangeBtnLoading: false, // 开始排课按钮
      arrangeId: sessionStorage.getItem('local_arrangeId'),
      areaHeight: document.body.clientHeight - 250,
      autoArrange: '1',
      checkList: []
    }
  },
  computed: {
    ...mapGetters(['menutype'])
  },
  methods: {
    async toAutoArrange() {
      this.autoArrangeBtnLoading = true
      const params = { arrangeId: this.arrangeId }
      const pro =
        this.menutype === 'xgk'
          ? arrangeNewExam(params)
          : startAutoArrange(params)
      const res = await pro.finally(() => {
        this.autoArrangeBtnLoading = false
      })
      this.$message.success(res.MSG)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.operation {
  overflow: hidden;
  height: 33px;
  > button {
    float: right;
  }
}
.area-data {
  border: 1px solid #dddddd;
  margin-top: 10px;
  padding: 10px;
}
.block {
  margin-top: 15px;
  margin-bottom: 50px;
  p {
    margin-bottom: 10px;
  }
}
</style>
