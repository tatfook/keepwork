<template>
  <div class="teaching-video">
    <div class="teaching-video-course">
      <el-row>
        <el-col :sm="8">
          <div class="box" @click="goLessonPackage(8)">
            <img src="@/assets/lessonImg/teaching-video_1.png" alt="">
            <p>动画教学</p>
          </div>
        </el-col>
        <el-col :sm="8">
          <div class="box" @click="goLessonPackage(8)">
            <img src="@/assets/lessonImg/teaching-video_2.png" alt="">
            <p>编程教学</p>
          </div>
        </el-col>
        <el-col :sm="8">
          <div class="box" @click="goLessonPackage(8)">
            <img src="@/assets/lessonImg/teaching-video_3.png" alt="">
            <p>CAD教学</p>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TeachingVideo',
  data() {
    return {}
  },
  methods: {
    goLessonPackage(packageId) {
      return this.$router.push(`/student/package/${packageId}`)
    }
  }
}
</script>

<style lang="scss">
.teaching-video {
  &-course {
    .box {
      padding: 20px;
      text-align: center;
      font-size: 16px;
      cursor: pointer;
      img {
        width: 100%;
      }
    }
  }
}
</style>

