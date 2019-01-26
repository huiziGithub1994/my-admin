<template>
  <!-- 教学分组 -->
  <div>
    <el-button type="primary" plain>运算教学分组</el-button>
    <div class="wapper">
      <div class="treeLeft" :style="{height:treeHeight+'px'}">
        <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </div>
      <div class="blockRight" :style="{height:treeHeight+'px'}">
        <div class="block">
          <div class="top">
            <span>教学1组 3课时</span>
            <el-button type="primary" plain size="mini">删除</el-button>
          </div>
          <div class="bottom">
            <ul>
              <li>英语1选考 1班</li>
              <li>英语1选考 1班</li>
              <li>英语1选考 1班</li>
              <li>英语1选考 1班</li>
              <li>英语1选考 1班</li>
              <li>英语1选考 1班</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { qryTeachGroupsTree } from '@/api/pkgz'

export default {
  data() {
    return {
      treeHeight: document.body.clientHeight - 260,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  created() {
    this.getTreeData()
  },
  mounted() {},
  methods: {
    async getTreeData() {
      const res = await qryTeachGroupsTree()
      this.treeData = res.DATA
    },
    // 树节点的点击事件
    handleNodeClick(data) {
      console.log(data)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.wapper {
  margin-top: 10px;
  > div {
    overflow: auto;
  }
}
.treeLeft {
  border: 1px solid #dddddd;
  width: 250px;
  float: left;
}
.blockRight {
  margin-left: 260px;
}
.block {
  border: 1px solid #dddddd;
  width: 200px;
  overflow: hidden;
  .top {
    padding: 0 10px;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #dddddd;
    > button {
      float: right;
      margin-top: 5px;
    }
  }
  .bottom {
    ul {
      margin: 0;
      padding: 10px 0;
    }
    li {
      list-style: none;
      padding-left: 10px;
      height: 25px;
      line-height: 25px;
    }
  }
}
</style>

