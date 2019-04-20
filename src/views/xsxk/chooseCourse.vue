<template>
  <!-- 学生选课 -详细信息页面 -->
  <div>
    <div class="operation">
      <div>
        <el-button type="primary" plain @click="submitBtn" :disabled="disabledSubmit">确认提交</el-button>
        <el-button type="primary" plain @click="backBtn">返&nbsp;&nbsp;&nbsp;回</el-button>
      </div>
    </div>
    <div class="content" :style="{'min-height':minHeight+'px'}">
      <el-form :model="fromData" ref="baseInfoRef" label-width="120px">
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
                  <el-checkbox :label="item.layerId" v-for="item in mustChoseData" :key="item.layerId">{{ item.courseName }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="自由选课程">
                <el-checkbox-group v-model="freeChoose">
                  <el-checkbox :label="item.layerId" v-for="item in fromData.sjsCourseLayer" :key="item.layerId">{{ item.courseName }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </template>
          <!-- 新高考选考&&指定选科组合-->
          <template v-else-if="fromData.choseType == '1' && fromData.choseCourseType == '2'">
            <el-col :span="24">
              <el-form-item label="可选组合课程">
                <el-radio-group v-model="chooseGroup">
                  <el-radio :label="item.layerId" v-for="item in fromData.sjsCourseLayer" :key="item.layerId">{{ item.courseName }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </template>
          <!-- 分层教学-->
          <template v-else>
            <el-col :span="24" v-for="course in fromData.sjsCourseLayer" :key="course.courseId">
              <el-form-item :label="course.courseName">
                <el-radio-group v-model="chooseLayer[course.courseId]">
                  <el-radio :label="layer.layerId" v-for="layer in course.layersList" :key="layer.layerId">{{ layer.allName }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
import { qryStuChooseTaskDef, doStuChose } from '@/api/xsxk'
export default {
  data() {
    const h = 155
    const mheight = document.body.clientHeight - h
    return {
      disabledSubmit: false, // 确认提交按钮
      minHeight: mheight,
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
    backBtn() {
      this.$router.push({ name: 'Xsxk' })
    },
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
.el-form-item--small {
  margin-bottom: 10px;
}
.operation {
  overflow: hidden;
  margin-bottom: 10px;
  > div {
    float: right;
    button.el-button {
      width: 80px !important;
    }
  }
}
.content {
  border: 1px solid #dddddd;
  padding: 10px 0;
}
.taskName {
  text-align: center;
  font-size: 1.2rem;
}
.collapse {
  border: 1px solid #dddddd;
  margin-right: 10px;
  padding-left: 10px;
}
.el-collapse-item__arrow {
  float: unset;
}
.collapse-title {
  display: inline-block;
  color: #409eff;
  > i {
    margin-right: 5px;
  }
}
</style>

