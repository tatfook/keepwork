<template>
  <div class="product-zoom">
    <div class="box" ref="box">
      <div class="small" ref="small" @mouseenter="smallMouseenter" @mouseleave="smallMouseleave" @mousemove="smallMouseMove($event)">
        <img class="small-img" :src="imageUrl" />
        <div class="mask" ref="mask"></div>
      </div>
      <div class="big" ref="big">
        <img width="200%" :src="imageUrl" ref="bigImg" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'productZoom',
  props: {
    imageUrl: ''
  },
  methods: {
    smallMouseenter() {
      this.$refs.big.style.display = 'block'
      this.$refs.mask.style.display = 'block'
    },
    smallMouseleave() {
      this.$refs.big.style.display = 'none'
      this.$refs.mask.style.display = 'none'
    },
    smallMouseMove(e) {
      let event = e || window.event
      let pagex = event.pageX || scroll().left + event.clientX
      let pagey = event.pageY || scroll().top + event.clientY

      let x =
        pagex - this.$refs.box.offsetLeft - this.$refs.mask.offsetWidth / 2
      let y =
        pagey - this.$refs.box.offsetTop - this.$refs.mask.offsetHeight / 2

      if (x < 0) {
        x = 0
      }
      if (x > this.$refs.small.offsetWidth - this.$refs.mask.offsetWidth) {
        x = this.$refs.small.offsetWidth - this.$refs.mask.offsetWidth
      }
      if (y < 0) {
        y = 0
      }
      if (y > this.$refs.small.offsetHeight - this.$refs.mask.offsetHeight) {
        y = this.$refs.small.offsetHeight - this.$refs.mask.offsetHeight
      }

      this.$refs.mask.style.left = x + 'px'
      this.$refs.mask.style.top = y + 'px'

      //bigImg随着mask的移动移动
      //比例 = 大图移动的距离/mask移动的距离 = 大图/小图
      var scale = this.$refs.bigImg.offsetWidth / this.$refs.small.offsetWidth

      this.$refs.bigImg.style.marginLeft = -scale * x + 'px'
      this.$refs.bigImg.style.marginTop = -scale * y + 'px'
    }
  }
}
</script>

<style lang="scss" scoped>
$smallWidth: 496px;
$smallHeight: 267px;
.product-zoom {
  .box {
    // margin: 100px;
    border: 1px solid #fff;
    position: relative;
  }
  .small {
    position: relative;
    width: $smallWidth;
    height: $smallHeight;
    &-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .mask {
    width: 175px;
    height: 175px;
    background: rgba(255, 255, 0, 0.4);
    position: absolute;
    left: 0;
    top: 0;
    display: none;
    cursor: move;
  }
  .big {
    width: 400px;
    height: 400px;
    border: 1px solid rgb(219, 238, 185);
    position: absolute;
    top: 0;
    left: $smallWidth + 8px;
    overflow: hidden;
    display: none;
  }
}
@media screen and (max-width: 769px) {
  .product-zoom {
    .small {
      width: 100%;
      height: 100% * 496 / 267;
    }
  }
}
</style>