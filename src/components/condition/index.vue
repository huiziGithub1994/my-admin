<!--
    功能页面操作域组件。将条件域中的条件放入操作域中的“更多条件”下拉按钮中
-->
<template lang="html">
  <div id="area-condition">
    <slot/>
  </div>
</template>
<script>
export default {}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
#area-condition {
  display: inline-block;
  .condition {
    display: inline-block;
    margin-right: 10px;
    > label {
      font-weight: unset;
      font-size: 1rem;
    }
    > div {
      width: auto;
    }
  }
  .condition:last-child {
    margin-right: 0;
  }
}
#moreCondition .condition {
  margin-bottom: 5px;
  > label {
    font-weight: unset;
    font-size: 1rem;
  }
}
</style>
