<template>
  <div class="block">
    <el-carousel :height="options.height">
      <el-carousel-item v-for="(item, index) in forImgs" :key="index">
        <a v-if="!item.type || item.type === 'images'" :target="item.target" :href="item.link">
          <div class="imgs" :style="loadImg(item)"></div>
        </a>
        <a v-if="item.type === 'videos'" :target="item.target" :href="item.link">
          <div class="imgs">
            <video :src="item.video" :autoplay="item.autoplay" :loop="item.playloop" :poster="item.poster" controls="controls"></video>
          </div>
        </a>
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
      if (item && item.img) {
        return this.generateStyleString({
          'background-image': 'url(' + item.img + ')'
        })
      } else {
        if (this.options.emptyGallery && this.options.emptyGallery.img) {
          return this.generateStyleString({
            'background-image': 'url(' + this.options.emptyGallery.img + ')'
          })
        } else {
          return {}
        }
      }
    }
  },
  computed: {
    forImgs() {
      if (!this.properties.data || this.properties.data && this.properties.data.length === 0) {
        return [
          {
            img: this.options.emptyGallery.img,
            link: this.options.emptyGallery.link,
            target: this.options.emptyGallery.target,
            autoplay: this.options.emptyGallery.autoplay,
            playloop: this.options.emptyGallery.playloop,
            poster: this.options.emptyGallery.poster
          }
        ]
      } else {
        return this.properties.data
      }
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

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
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
