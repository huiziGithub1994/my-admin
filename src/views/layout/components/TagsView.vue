<template>
  <div class="tags-view-container" ref="tagView">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
    <scroll-pane ref="scrollPane" class="tags-view-wrapper">
      <router-link
        v-for="tag in visitedViews"
        ref="tag"
        :class="isActive(tag)?'active':''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        :key="tag.path"
        tag="span"
        class="tags-view-item"
        @click.middle.native="closeSelectedTag(tag)"
        @contextmenu.prevent.native="openMenu(tag,$event)"
      >
        {{ tag.title }}
        <span class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)"/>
      </router-link>
    </scroll-pane>
    <span class="arrangeName" id="arrangeName">{{ arrangeName }}</span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ScrollPane from '@/components/ScrollPane'
import Hamburger from '@/components/Hamburger'
export default {
  components: { ScrollPane, Hamburger },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      tagsViewWidth: undefined
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'arrangeName', 'cachedViews']),
    visitedViews() {
      return this.$store.state.tagsView.visitedViews
    }
  },
  watch: {
    $route() {
      this.addViewTags()
      this.moveToCurrentTag()
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  mounted() {
    this.addViewTags()
    this.tagsViewWidth = this.$refs.tagView.offsetWidth - 40
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    // generateTitle, // generateTitle by vue-i18n
    isActive(route) {
      return route.path === this.$route.path
    },
    addViewTags() {
      const { name } = this.$route
      if (name === 'Qxk') return
      console.log()
      if (!this.validWidth() && !this.cachedViews.includes(name)) {
        // 宽度超出
        const { length } = this.visitedViews
        for (let i = 0; i < length; i++) {
          if (this.visitedViews[i].name !== 'Home') {
            this.closeSelectedTag(this.visitedViews[i])
            break
          }
        }
      }
      this.$store.dispatch('addView', this.$route)
    },
    validWidth() {
      const arrangeNameWidth = document.getElementById('arrangeName')
        .offsetWidth
      const scrollPaneWidth = this.$refs.scrollPane.$el.offsetWidth || 0
      if (arrangeNameWidth + scrollPaneWidth + 85 > this.tagsViewWidth) {
        return false
      }
      return true
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag)
            // when query is different then update
            if (tag.to.fullPath !== this.$route.fullPath) {
              this.$store.dispatch('updateVisitedView', this.$route)
            }

            break
          }
        }
      })
    },
    refreshSelectedTag(view) {
      this.$store.dispatch('delCachedView', view).then(() => {
        const { fullPath } = view
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          })
        })
      })
    },
    closeSelectedTag(view) {
      if (view.name === 'Home' || view.name === 'Xsxk') {
        this.$message({
          message: '首页不可以关闭！',
          type: 'warning'
        })
        return
      }
      this.$store.dispatch('delView', view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          const latestView = visitedViews.slice(-1)[0]
          if (latestView) {
            this.$router.push(latestView)
          } else {
            this.$router.push({ name: 'Home' })
          }
        }
      })
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag)
      this.$store.dispatch('delOthersViews', this.selectedTag).then(() => {
        this.moveToCurrentTag()
      })
    },
    closeAllTags() {
      this.$store.dispatch('delAllViews')
      this.$router.push('/')
    },
    openMenu(tag, e) {
      this.visible = true
      this.selectedTag = tag
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      this.left = e.clientX - offsetLeft + 15 // 15: margin right
      this.top = e.clientY
    },
    closeMenu() {
      this.visible = false
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" >
.tags-view-container .tags-view-wrapper {
  .el-scrollbar__wrap {
    margin: 0 !important;
    overflow: unset !important;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.arrangeName {
  float: right;
  margin-top: 10px;
  margin-right: 15px;
  color: #10d821;
}
.tags-view-container {
  height: 36px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  // box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  .hamburger-container {
    overflow: hidden;
    float: left;
    margin-left: 10px;
    margin-top: 7px;
  }
  .tags-view-wrapper {
    float: left;
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        // background-color: #409eff;
        color: #409eff;
        border-color: #409eff;
        &::before {
          content: '';
          background: #409eff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 100;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      border: 1px solid;
      &:before {
        transform: scale(0.7);
        display: inline-block;
        vertical-align: -2px;
      }
      &:hover {
        background-color: #409eff;
        color: #fff;
      }
    }
  }
}
</style>
