<template>
  <div class="activated-teacher-role">
    <el-container class="teacher">
      <el-aside width="260px">
        <div :class="['item',{active: 0 === itmeActive}]" @click="showItem('TEACH')">
          <i class='iconfont icon-teach'></i>
          <span class="item-title">{{$t('lesson.teach')}}</span>
        </div>
        <div :class="['item',{active: 1 === itmeActive}]" @click="showItem('REVIEW')">
          <i class='iconfont icon-review'></i>
          <span class="item-title">{{$t('lesson.review')}}</span>
        </div>
        <div :class="['item',{active: 2 === itmeActive}]" @click="showItem('MANAGEMENT')">
          <i class='iconfont icon-setting'></i>
          <span class="item-title">{{$t('lesson.lessonManagement')}}</span>
        </div>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>

</template>

<script>
export default {
  name: "ActivatedTeacherRole",
  data() {
    return {
      itmeActive: 0
    }
  },
  methods: {
    showItem(itemName) {
      switch (itemName) {
        case 'TEACH':
          this.itmeActive = 0
          this.$router.push({
            path: `/teacher`
          })
          break
        case 'REVIEW':
          this.itmeActive = 1
          this.$router.push({
            path: `/teacher/review`
          })
          break
        case 'MANAGEMENT':
          this.itmeActive = 2
          break
        default:
          break
      }
    }
  }
}
</script>

<style lang="scss">
.activated-teacher-role {
  .teacher {
    margin: 0 auto;
    max-width: 1150px;
    .el-aside {
      padding: 80px 0;
      background: #fff;
      border-right: 10px solid #409efe;
      overflow: hidden;
      margin-right: 38px;
      .item {
        height: 63px;
        line-height: 63px;
        cursor: pointer;
        border-bottom: 1px solid #d2d2d2;
        padding: 0 10px;
        &-title {
          margin-left: 12px;
        }
        &:hover {
          background: rgb(236, 233, 233);
        }
      }
      .active {
        background: #409efe;
        color: #fff;
        &:hover {
          background: #409efe;
        }
      }
    }
    .el-main {
      overflow: hidden;
      padding: 0;
    }
  }
}
</style>


