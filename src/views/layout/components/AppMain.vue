<template>
  <section class="app-main">
    <div class="content-wapper">
      <transition name="fade-transform" mode="out-in">
        <router-view/>
        <!-- or name="fade" -->
        <!-- <router-view :key="key"></router-view> -->
      </transition>
    </div>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  height: calc(100vh - 96px);
  background: #f2f2f2;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  /* padding-top: 8px; */
  /* padding-left: 10px; */
}
.content-wapper {
  background: white;
  width: 100%;
  min-height: 100%;
  padding: 10px 10px 5px 10px;
}
</style>

