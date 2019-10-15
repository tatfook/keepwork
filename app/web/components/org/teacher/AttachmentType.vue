<template>
  <div class="attachment-type">
    <div class="attachment-type-main">
      <img class="attachment-type-main-image" v-if="isImage" :src="attachmentUrl | miniPic" alt="">
      <div class="attachment-type-main-video" v-else-if="isVideo">
        <img class="video-logo" :src="defaultVideoLogo">
        <span>
          <span class="play-icon">
            <i class="el-icon-caret-right"></i>
          </span>
        </span>
      </div>
      <div class="" v-else>
        不支持的格式
      </div>
    </div>
    <div class="attachment-type-filename">
      {{ filename }}
    </div>

    <span class="remove-button" @click="handleRemove">
      <i class="el-icon-close"></i>
    </span>
  </div>
</template>

<script>
export default {
  name: 'AttachmentType',
  filters: {
    miniPic(url) {
      if (/#/.test(url)) {
        return `${url.replace(/#.+/, '')}?imageView2/2/w/400`
      }
      return `${url}&imageView2/2/w/400`
    }
  },
  data() {
    return {
      defaultVideoLogo: require('@/assets/img/video_cover.jpg')
    }
  },
  props: {
    data: {},
    index: ''
  },
  methods: {
    handleRemove() {
      console.log('remvoe', this.index)
      this.$emit('remove', this.index)
    }
  },
  computed: {
    isImage() {
      return this.data.type === 'images'
    },
    isVideo() {
      return this.data.type === 'videos'
    },
    filename() {
      return this.data.filename
    },
    attachmentUrl() {
      return this.data.url
    }
  }
}
</script>

<style lang="scss" scoped>
.attachment-type {
  width: 140px;
  margin-right: 3px;
  margin-bottom: 10px;
  position: relative;
  &-main {
    width: 140px;
    height: 140px;
    background: #d1d1d1;
    &-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    &-video {
      position: relative;
      .video-logo {
        width: 140px;
        height: 140px;
        object-fit: cover;
      }
      .play-icon {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: block;
        background: rgba(0, 0, 0, 0.5);
        color: #fff;
        font-size: 22px;
        text-align: center;
        line-height: 32px;
      }
    }
  }
  &-filename {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 12px;
    line-height: 20px;
    color: #606266;
  }
  &:hover {
    .remove-button {
      display: block;
    }
  }
  .remove-button {
    display: none;
    width: 21px;
    height: 21px;
    line-height: 21px;
    text-align: center;
    position: absolute;
    cursor: pointer;
    top: 0;
    right: 0;
    background: #f60e0e;
    color: #fff;
  }
}
</style>