<!--
    功能页面操作域组件。将条件域中的条件放入操作域中的“更多条件”下拉按钮中
-->
<template lang="html">
  <div id="area-operation">
    <div id="dropdown">
      <el-popover placement="bottom" trigger="click" >
        <div id="moreCondition" @keyup.enter="searchByEnterKey"/>
        <span slot="reference" class="el-dropdown-link">更多条件<i class="el-icon-caret-bottom el-icon--right"/>
        </span>
      </el-popover>
    </div>
    <slot/>
  </div>
</template>
<script>
export default {
  props: {
    searchByEnterKey: {
      // 点击回车键触发父级组件传给来的函数：检索按钮绑定的方法
      type: Function,
      default: function() {
        return function() {}
      }
    }
  }
}
</script>
<style scoped>
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
#dropdown {
  display: none;
}
#moreCondition {
  margin: 0 0 -5px 3px;
}
#moreCondition .condition {
  margin-bottom: 5px;
}
</style>
