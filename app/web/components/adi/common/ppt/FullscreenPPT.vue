<template>
  <div class="fullscreen-ppt">
    <PPT-page :showList="showList" :currentPage="currentPage" :percent="percent"></PPT-page>
    <div class="fullscreen-ppt-operation">
      <i @click="trunLeft" :class="['fullscreen-ppt-operation-icon', 'el-icon-arrow-left', { 'faker-click': leftClick }]"></i>
      <i @click="trunRight" :class="['fullscreen-ppt-operation-icon', 'el-icon-arrow-right', { 'faker-click': rightClick }]"></i>
    </div>
  </div>
</template>

<script>
import videoPlayer from '@/components/common/VideoPlayer'
import PPTPage from './PPTPage'
const RIGHT_CODE = 39
const LEFT_CODE = 37
const SPACE_CODE = 32
const ENTER_CODE = 13
const NEXT_PAGE = [RIGHT_CODE, SPACE_CODE, ENTER_CODE]
export default {
  name: 'FullscreenPPT',
  components: {
    videoPlayer,
    PPTPage
  },
  data() {
    return {
      currentPage: 1,
      isFullsreen: false,
      rightClick: false,
      leftClick: false
    }
  },
  props: {
    pptList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    onKeydown(evt) {
      const keyCode = evt.keyCode
      if (NEXT_PAGE.includes(keyCode)) {
        this.fakerClickRight()
      }
      if (keyCode === LEFT_CODE) {
        this.fakerClickLeft()
      }
    },
    trunLeft() {
      this.currentPage = Math.max(this.currentPage - 1, 1)
    },
    trunRight() {
      this.currentPage =
        this.currentPage < this.maxPage ? this.currentPage + 1 : this.maxPage
    },
    fakerClickRight() {
      if (!this.rightClick) {
        this.rightClick = true
        this.trunRight()
        setTimeout(() => (this.rightClick = false), 300)
      }
    },
    fakerClickLeft() {
      if (!this.leftClick) {
        this.leftClick = true
        this.trunLeft()
        setTimeout(() => (this.leftClick = false), 300)
      }
    }
  },
  mounted() {
    window.addEventListener('keydown', this.onKeydown)
  },
  destroyed() {
    window.removeEventListener('keydown', this.onKeydown)
  },
  computed: {
    maxPage() {
      return Math.max(this.pptList.length - 1, 0)
    },
    showList() {
      const prevLoadSize = 3
      const maxNextIndex = Math.min(
        this.currentPage + prevLoadSize,
        this.maxPage
      )
      return this.pptList.filter(item => item.page <= maxNextIndex)
    },
    percent() {
      return this.currentPage === 1
        ? 0
        : (this.currentPage / this.maxPage) * 100
    }
  }
}
</script>

<style lang="scss" scoped>
.fullscreen-ppt {
  background: #191919;
  position: relative;
  height: 100%;
  overflow: hidden;
  &-operation {
    position: absolute;
    bottom: 30px;
    right: 20px;
    color: #fff;
    font-size: 50px;
    user-select: none;
    &-icon {
      font-size: 60px;
      cursor: pointer;
      &:hover {
        color: rgb(83, 168, 255);
      }
      &.faker-click {
        color: rgb(83, 168, 255);
      }
    }
  }
}
</style>