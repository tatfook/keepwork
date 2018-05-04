<template>
  <div class="block">
    <el-carousel :height="options.height">
      <el-carousel-item v-for="(item, index) in forImgs" :key="index" v-if="item.img && item.img.length != 0">
        <a :target="properties.target" :href="item.link"><div class="imgs" :style="loadImg(item)"></div></a>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'

export default {
  name: 'AdiImgLoop',
  mixins: [compBaseMixin],
  methods: {
    loadImg(item) {
      return this.generateStyleString({
        'background-image': 'url(' + item.img + ')'
      })
    }
  },
  computed: {
    forImgs() {
      return this.properties.data.length == 0
        ? this.options.data
        : this.properties.data
    }
  }
}
</script>

<style lang="scss" scoped>
.imgs {
  width: 100%;
  height: 100%;
  background-position: center;
  background-size: cover;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
