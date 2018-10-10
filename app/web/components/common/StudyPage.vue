<template>
  <div class="study-page">
    <div class="study-page-title"><span class="study">学习</span>·不停超越</div>
    <div class="study-page-intro">
      <el-row>
        <el-col :span="6">
          <div class="plate" @click="enterLessonCenter">
            <img class="plate-cover" src="@/assets/pblImg/lesson_online.png" alt="">
            <h4 class="plate-title">在线课程</h4>
            <p class="plate-desc">随时随地、轻松愉快的在线学习</p>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="plate" @click="enterParacraftLesson">
            <img class="plate-cover" src="@/assets/pblImg/lesson_paracraft.png" alt="">
            <h4 class="plate-title">动画教学</h4>
            <p class="plate-desc">学习三维世界的动画创作，参加iicc大赛</p>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="plate" @click="enterCodeLesson">
            <img class="plate-cover" src="@/assets/pblImg/learn_codeblock.png" alt="">
            <h4 class="plate-title">编程方块</h4>
            <p class="plate-desc">图形化的方式学编程，创造自己的游戏</p>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="plate" @click="enterNPLLesson">
            <img class="plate-cover" src="@/assets/pblImg/NPL_CAD.png" alt="">
            <h4 class="plate-title">NPL CAD</h4>
            <p class="plate-desc">通过CAD学习计算机编程语言，一举两得</p>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  name: 'StudyPage',
  data() {
    return {}
  },
  methods: {
    enterLessonCenter(){
      window.open('/l/student/center')
    },
    enterParacraftLesson(){
      window.open('/l/student/package/8')
    },
    enterCodeLesson(){
      window.open('/l/student/package/6')
    },
    enterNPLLesson(){
      window.open('/l/student/package/6')
    }
  }
}
</script>
<style lang="scss">
.study-page {
  max-width: 1200px;
  margin: 0 auto;
  &-title {
    font-size: 26px;
    text-align: center;
    margin: 44px 0;
    font-weight: 700;
    .study {
      color: #2397f3;
    }
  }
  &-intro{
    .plate{
      text-align: center;
      padding: 64px 0 40px;
      cursor: pointer;
      &-cover{
        height: 120px;
        object-fit: contain;
      }
      &-title{
        line-height: 22px;
        font-size: 18px;
        color: #333;
        margin: 40px 0 12px;
      }
      &-desc{
        color: #909399;
        font-size: 13px;
      }
      &:hover{
        border: 1px solid #eee;
        box-shadow: 0 2px  8px rgb(230, 230, 230);
      }
    }
  }
}
</style>


