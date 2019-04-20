<template>
  <div>
    <el-form :model="fromData" ref="baseInfoRef" label-width="80px">
      <el-row :gutter="10">
        <el-col :span="24">
          <div class="taskName">{{ fromData.choseTaskName }}</div>
        </el-col>
        <el-col :span="12">
          <el-form-item label="学号">
            <div>{{ stuData.stuCode }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="姓名">
            <div>{{ stuData.stuName }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="班级">
            <div>{{ stuData.gradeName + stuData.className }}</div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="选课说明">
            <el-collapse accordion v-if="fromData.moreDesc" class="collapse">
              <el-collapse-item>
                <template slot="title">
                  <div class="collapse-title">
                    <i class="header-icon el-icon-info"></i>
                    选课前请先仔细阅读选课说明
                  </div>
                </template>
                <div v-html="fromData.moreDesc"></div>
              </el-collapse-item>
            </el-collapse>
            <div v-else>无</div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="任务类型">
            <div>{{ taskType[fromData.choseType] }}</div>
          </el-form-item>
        </el-col>
        <!-- 新高考选考&&按单科选择-->
        <template v-if="fromData.choseType == '1' && fromData.choseCourseType == '1'">
          <!--必选科目数-->
          <el-col :span="24" v-if="fromData.mustChoseType !='0'">
            <el-form-item label="必选课程">
              <el-checkbox-group v-model="mustChoose">
                <div v-for="item in mustChoseData" :key="item.layerId" class="chooseItem">
                  <el-checkbox :label="item.layerId">{{ item.courseName }}</el-checkbox>
                </div>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="自由选课程">
              <el-checkbox-group v-model="freeChoose">
                <div v-for="item in fromData.sjsCourseLayer" :key="item.layerId" class="chooseItem">
                  <el-checkbox :label="item.layerId">{{ item.courseName }}</el-checkbox>
                </div>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </template>
        <!-- 新高考选考&&指定选科组合-->
        <template v-else-if="fromData.choseType == '1' && fromData.choseCourseType == '2'">
          <el-col :span="24">
            <el-form-item label="可选组合课程">
              <el-radio-group v-model="chooseGroup">
                <div v-for="item in fromData.sjsCourseLayer" :key="item.layerId" class="chooseItem">
                  <el-radio :label="item.layerId">{{ item.courseName }}</el-radio>
                </div>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </template>
        <!-- 分层教学-->
        <template v-else>
          <el-col :span="24" v-for="course in fromData.sjsCourseLayer" :key="course.courseId">
            <el-form-item :label="course.courseName">
              <el-radio-group v-model="chooseLayer[course.courseId]">
                <div v-for="layer in course.layersList" :key="layer.layerId" class="chooseItem">
                  <el-radio :label="layer.layerId">{{ layer.allName }}</el-radio>
                </div>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>
    <div class="btn">
      <el-button type="primary" plain @click="submitBtn" :disabled="disabledSubmit">确认提交</el-button>
    </div>
  </div>
</template>
<script>
import { qryStuChooseTaskDef, doStuChose } from '@/api/xsxk'
export default {
  data() {
    return {
      disabledSubmit: false,
      taskType: {
        '1': '新高考选考',
        '2': '分层教学',
        '3': '校本课'
      },
      fromData: {
        moreDesc: ''
      },
      stuData: {}, // 学生信息
      chooseGroup: '', // 新高考选考&&指定选科组合 结果
      mustChoose: [], //  新高考选考&&按单科选择,必选科目数 结果
      freeChoose: [], //  新高考选考&&按单科选择,自由选课程 结果
      chooseLayer: {}, // 分层教学 结果
      choseRsId: '',
      mustChoseData: [] //  新高考选考&&按单科选择,必选科目数 课程数据
    }
  },
  created() {
    this.choseRsId = this.$route.query.choseRsId
    this.getDetail()
  },
  methods: {
    async getDetail() {
      const res = await qryStuChooseTaskDef({ choseRsId: this.choseRsId })
      this.fromData = res.DATA
      this.stuData = res.EXTRA
      const {
        choseType,
        choseCourseType,
        // mustChoseType,
        // mustChoseStr,
        sjsCourseLayer
      } = this.fromData
      // 新高考选考&&按单科选择-->
      if (choseType === '1' && choseCourseType === '1') {
        if (sjsCourseLayer.length) {
          this.fromData.sjsCourseLayer = sjsCourseLayer.filter(
            item => item.mustChoseFlag === '0'
          )
          this.mustChoseData = sjsCourseLayer.filter(
            item => item.mustChoseFlag === '1'
          )
        }
      }
      // 分层教学
      if (choseType === '2') {
        // 分层教学 结果 chooseLayer 赋初始值
        sjsCourseLayer.forEach(item => {
          this.$set(this.chooseLayer, item.courseId, '')
        })
      }
    },
    async submitBtn() {
      const { choseType, choseCourseType, mustChoseType } = this.fromData
      let choseStr = ''
      // 新高考选考&&按单科选择-->
      if (choseType === '1' && choseCourseType === '1') {
        if (+mustChoseType !== this.mustChoose.length) {
          this.$message.warning('必选课程为' + mustChoseType + '门')
          return
        }
        if (this.mustChoose.length + this.freeChoose.length !== 3) {
          this.$message.warning('选择课数必须为3科')
          return
        }
        choseStr = this.mustChoose.join(',') + ',' + this.freeChoose.join(',')
      } else if (choseType === '1' && choseCourseType === '2') {
        // 新高考选考&&指定选科组合-->
        choseStr = this.chooseGroup
      } else if (choseType === '2') {
        // 分层教学
        const tempLayerId = []
        Object.keys(this.chooseLayer).forEach(key => {
          if (this.chooseLayer[key]) {
            tempLayerId.push(this.chooseLayer[key])
          }
        })
        choseStr = tempLayerId.join(',')
      }
      if (choseStr.length === 0) {
        this.$message.warning('请选择课程')
        return
      }
      this.disabledSubmit = true
      await doStuChose({ choseRsId: this.choseRsId, choseStr })
      this.$message.success('选课成功')
      this.$router.go(-1)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.taskName {
  font-size: 0.5rem;
  text-align: center;
  height: 50px;
  line-height: 50px;
}
.chooseItem {
  height: 30px;
  line-height: 30px;
}
.btn {
  text-align: center;
  > button {
    width: 80%;
    font-size: 0.35rem;
  }
}
</style>

