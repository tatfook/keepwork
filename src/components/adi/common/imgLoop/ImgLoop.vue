<template>
  <div class="block">
    <el-carousel :height="options.height">
      <el-carousel-item v-for="(item, index) in properties.data" :key="index">
        <div class="imgs" :style="loadImg(item)"></div>
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
        background: 'url(' + item.img + ')',
        'background-position': 'center',
        'background-size': 'cover'
      })
    }
  },
  computed: {}
}
</script>

<style lang="scss" scoped>
.imgs {
  width: 100%;
  height: 100%;
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
