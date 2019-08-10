<template>
  <div class="wraper">
    <div
      v-for="(item,index) in items"
      :key="index"
      :id="index"
      draggable="true"
      @drop="drop($event)"
      @dragstart="dragstart($event,index)"
      @dragenter="dragenter($event)"
      @dragover="dragover"
    >{{ item }}</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      copyItems: [],
      dragIndex: undefined
    }
  },
  mounted() {
    this.copyItems.push(...this.items)
  },
  methods: {
    dragstart(e, index) {
      this.dragIndex = index
    },
    dragenter(e) {},
    dragover(e) {
      e.preventDefault()
    },
    drop(e) {
      e.preventDefault()
      const targetIndex = e.target.id
      if (targetIndex !== this.dragIndex) {
        const dragtData = this.items[this.dragIndex]
        this.copyItems[targetIndex] = dragtData
        this.copyItems[this.dragIndex] = this.items[targetIndex]
        this.items = [...this.copyItems]
      }
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.wraper {
  width: 300px;
  height: 300px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  > div {
    width: 100px;
    height: 100px;
    border: 1px solid #dddddd;
    text-align: center;
    line-height: 100px;
  }
}
</style>
