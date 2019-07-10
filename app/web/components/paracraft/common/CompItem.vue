<template>
  <div class="comp-item">
    <div class="comp-item-cover" :style="{background:bgColor}">
      <span class="comp-item-badge">{{compDetail.id}}</span>
      <img class="comp-item-preview" :src="compDetail.gifUrl" alt="">
      <!-- <model-gltf :key="previewUrl" class="comp-item-gltf" v-loading="isLoading" :rotation="rotation" :src="previewUrl" :backgroundColor="bgColor" @on-load="onLoadGltf"></model-gltf> -->
    </div>
    <div class="comp-item-info">
      <div class="comp-item-info-left">
        <div class="comp-item-type-name">
          <span class="comp-item-type">{{compDetail.filetype}}</span>
          {{compDetail.name}}
        </div>
        <div class="comp-item-author">贡献者：{{compDetail.contributor}}</div>
      </div>
      <el-button @click="useComp">使用</el-button>
    </div>
  </div>
</template>

<script>
const BgColors = [
  '#ff7875',
  '#ff9c6e',
  '#ffc069',
  '#ffd666',
  '#fff566',
  '#d3f261',
  '#95de64',
  '#5cdbd3',
  '#69c0ff',
  '#85a5ff',
  '#b37feb',
  '#ff85c0'
]
import { ModelGltf } from 'vue-3d-model'
export default {
  name: 'CompItem',
  props: {
    compDetail: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isLoading: true,
      bgColor: BgColors[_.random(0, BgColors.length - 1)],
      rotation: {
        x: 0,
        y: 0,
        z: 0
      }
    }
  },
  computed: {
    downloadUrl() {
      return _.get(this.compDetail, 'fileUrl')
    },
    previewUrl() {
      return _.get(this.compDetail, 'previewUrl')
    }
  },
  methods: {
    onLoadGltf() {
      this.isLoading = false
      this.rotate()
    },
    rotate() {
      this.rotation.y -= 0.01
      requestAnimationFrame(this.rotate)
    },
    useComp() {
      alert(this.downloadUrl)
    }
  },
  components: {
    ModelGltf
  },
  watch: {
    previewUrl() {
      this.isLoading = true
    }
  }
}
</script>
<style lang="scss" scoped>
.comp-item {
  padding: 12px;
  background-color: #fff;
  &-cover {
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    font-size: 0;
    padding-bottom: 56%;
  }
  &-preview {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  &-gltf {
    position: absolute !important;
    /deep/canvas {
      width: 100% !important;
      height: 100% !important;
    }
  }
  &-badge {
    position: absolute;
    left: 0;
    top: 0;
    padding: 0 6px;
    height: 24px;
    line-height: 24px;
    color: #fff;
    font-size: 12px;
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 4px;
  }
  &-info {
    display: flex;
    align-items: center;
    margin-top: 8px;
    &-left {
      flex: 1;
    }
    .el-button {
      font-size: 14px;
      padding: 0 12px;
      height: 28px;
      line-height: 26px;
      color: #2397f3;
      border-color: #2397f3;
      border-radius: 28px;
    }
  }
  &-type-name {
    font-size: 14px;
    color: #303133;
  }
  &-type {
    font-size: 12px;
    color: #fff;
    background-color: #e6a23c;
    display: inline-block;
    border-radius: 4px;
    padding: 2px;
    min-width: 24px;
    text-align: center;
  }
  &-author {
    font-size: 12px;
    color: #909399;
    margin-top: 8px;
  }
}
</style>
