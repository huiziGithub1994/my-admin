<template>
  <!-- 选课设置 -》 可选学科-->
  <div>
    <subject-layer3 v-if="componentName == '3'"></subject-layer3>
    <subject-layer v-if="componentName == '2'"></subject-layer>
    <optional-subject1 v-if="componentName == '1'" :base-data="baseData" @tonext="nextStep"></optional-subject1>
  </div>
</template>
<script>
import SubjectLayer from './OptionalSubject2' // 学科分层及学时tab页组件  分层教学
import SubjectLayer3 from './OptionalSubject3' // 学科分层及学时tab页组件 校本课
import OptionalSubject1 from './OptionalSubject1' // 可选学科tab页组件 新高考选考
import { qrySjsChoseTaskByChoseId } from '@/api/xkrw'
export default {
  name: 'OptionalSubject',
  components: {
    SubjectLayer,
    SubjectLayer3,
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
      const { choseType } = res.DATA // 1:新高考选考   2:分层教学  3:校本课
      this.componentName = choseType
    },
    nextStep(name) {
      this.$emit('tonext', name)
    }
  }
}
</script>
