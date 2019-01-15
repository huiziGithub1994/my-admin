<template>
  <div>
    <el-form :model="fromData" ref="baseInfoRef" label-width="120px">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="学号">
            <div>19023</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <div class="btns-right">
            <el-button type="primary">确认提交</el-button>
            <el-button type="primary" @click="$router.go(-1)">返&nbsp;&nbsp;&nbsp;回</el-button>
          </div>
        </el-col>
        <el-col :span="24">
          <el-form-item label="姓名">
            <div>李洪喜</div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="班级">
            <div>高二3班</div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="选课说明">
            <div v-html="fromData.moreDesc" :class="{'moreDescShowMore':showMore,'moreDescNotShowMore':!showMore}"></div>
            <div class="showMoreBtn">
              <span v-if="!showMore" @click="showMore = true">
                展开
                <i class="el-icon-arrow-down"></i>
              </span>
              <span v-else @click="showMore = false">
                收起
                <i class="el-icon-arrow-up"></i>
              </span>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="任务类型">
            <div>新高考选考</div>
          </el-form-item>
        </el-col>
        <template>
          <el-col :span="24">
            <el-form-item label="必选课程">
              <el-checkbox-group v-model="fromData.checkList">
                <el-checkbox label="政治"></el-checkbox>
                <el-checkbox label="历史"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="自由选课程">
              <el-checkbox-group v-model="fromData.checkList">
                <el-checkbox label="地理"></el-checkbox>
                <el-checkbox label="物理"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </template>
        <template>
          <el-col :span="24">
            <el-form-item label="可选组合课程">
              <el-radio-group v-model="fromData.radio2">
                <el-radio :label="3">政治+物理+化学</el-radio>
                <el-radio :label="9">政治+物理+生物</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </template>
        <template>
          <el-col :span="24">
            <el-form-item label="语文">
              <el-radio-group v-model="fromData.radio2">
                <el-radio :label="3">语文A层</el-radio>
                <el-radio :label="9">语文B层</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="数学">
              <el-radio-group v-model="fromData.radio2">
                <el-radio :label="3">数学A层</el-radio>
                <el-radio :label="9">数学B层</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </template>
      </el-row>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showMore: false,
      fromData: {
        moreDesc: `细分起来，必修课又分为全校公共必修课和专业必修课，选修课有全校性任选课
        、专业限选课、专业任选课和跨院系选修课。必修课的分类各校差别一般不大，选修课的分类有一定差异。
        有的学校这几类课程同时存在；有的学校把专业限选课和专业任选课合并，叫专业选修课；有的学校全校性任选课和跨院系选修课是一回事，
        有的学校则分开，当然叫法会不一样。你选课前要做的一件主要的事就是搞清楚自己学校的课程设置和每门课程的类型。
        因为学校和各院系对本科期间应修习的各种类型的课程都作了相应的规定。如果你不清楚或搞错了，有可能连毕业证书都拿不到。
        前几天，一个马上要毕业的大四学生对我说，有一种类型的课程他没选，原因是他一直以为自己选的一门课是那种类型的课程，问我有没有补救的办法，
        我只能摇摇头，对他说，刚入学时就让你们好好看发给你们的本科生手册，你偏不好好看，没办法，错误只能由你自己承担了。
        举这个例子就是希望你们不要再犯和他一样的错误，后悔药可没得吃`
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.btns-right {
  float: right;
  button.el-button {
    width: 80px !important;
  }
}
.showMoreBtn {
  text-align: right;
  > span {
    color: rgb(64, 158, 255);
    &:hover {
      cursor: pointer;
      color: #0066ff;
    }
  }
}
.moreDescNotShowMore {
  overflow: hidden;
  text-overflow: ellipsis; //文本溢出显示省略号
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>

