<template>
  <div v-if="isImg" class="lesson-big-file-container">
    <img class="big-file" src="https://api-stage.keepwork.com/storage/v0/siteFiles/223/raw#1.jpg" alt="">
  </div>
</template>

<script>
export default {
  name: 'LessonBigFile',
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  mounted() {
    console.log(this.isImg)
  },
  computed: {
    bigFile() {
      return this.data.data.bigFile
    },
    isImg() {
      return this.fileExt === 'jpg'
    },
    imgSrc() {
      return this.bigFile.src
    },
    fileName() {
      return this.bigFile.fileName
    },
    fileSize() {
      return this.bigFile.size
    },
    fileExt() {
      return this.bigFile.ext
    }
  }
}
</script>


<style lang="scss">
.lesson-big-file-container {
  max-width: 1229px;
  margin: 0 auto;
  background: white;
  .big-file {
    max-width: 1229px;
  }
}
</style>
