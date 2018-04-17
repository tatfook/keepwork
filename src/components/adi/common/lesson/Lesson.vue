<template>
  <div class="block">

    <video :src='src'>
      您的浏览器不支持 video 标签
    </video>
    <div>
      <el-radio-group>
        <el-radio-button label="Overview"></el-radio-button>
        <el-radio-button label="Related Animations"></el-radio-button>
        <el-radio-button label="Students' performance"></el-radio-button>
        <el-radio-button label="Summary"></el-radio-button>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'

export default {
  name: 'AdiLesson',
  mixins: [compBaseMixin],
  computed: {
    src() {
      return this.properties.VedioSrc
    }
  }
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
