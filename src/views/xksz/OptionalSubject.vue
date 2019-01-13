<template>
  <!-- 选课设置 -》 可选学科-->
  <div>
    <subject-layer v-if="componentName == '2'"></subject-layer>
    <optional-subject1 v-if="componentName == '1'" :base-data="baseData" @tonext="nextStep"></optional-subject1>
  </div>
</template>
<script>
import SubjectLayer from './OptionalSubject2' // 学科分层及学时tab页组件
import OptionalSubject1 from './OptionalSubject1' // 可选学科tab页组件
import { qrySjsChoseTaskByChoseId } from '@/api/xkrw'
export default {
  name: 'OptionalSubject',
  components: {
    SubjectLayer,
    OptionalSubject1
  },
  data() {
    return {
      baseData: {},
      choseRsId: sessionStorage.getItem('local_arrangeId'),
      componentName: ''
    }
  },
  created() {
    this.fetchBaseData() // 获取基础信息
  },
  methods: {
    // 获取基础信息
    async fetchBaseData() {
      const res = await qrySjsChoseTaskByChoseId({ choseRsId: this.choseRsId })
      this.baseData = res.DATA
      const { choseType } = res.DATA // 2:分层教学
      this.componentName = choseType === '2' ? '2' : '1'
    },
    nextStep(name) {
      this.$emit('tonext', name)
    }
  }
}
</script>
