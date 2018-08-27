<template>
  <div class="catalogue-manager">
    <div class="catalogue-manager-title">目录:
      <el-button type="success" round size="small" v-show="catalogues.length > 0">添加课程</el-button>
    </div>
    <div class="catalogue-manager-empty" v-show="catalogues.length <= 0">
      <div class="catalogue-manager-empty-info">请先添加课程</div>
      <el-button type="primary">添加课程</el-button>
    </div>
    <div class="catalogue-manager-list" v-show="catalogues.length > 0">
      <div class="catalogue-manager-item" v-for="(lesson, index) in catalogues" :key='index'>
        <div class="catalogue-manager-item-index">{{index}}</div>
        <div class="catalogue-manager-item-cover">
          <img :src='lesson.extra.coverUrl' alt="">
        </div>
        <div class="catalogue-manager-item-name">{{lesson.lessonName}}</div>
        <div class="catalogue-manager-item-date">{{lesson.updatedAt}}</div>
        <div class="catalogue-manager-item-operations">
          <el-tooltip effect="dark" content="下移" placement="top">
            <span class="iconfont icon-move-up"></span>
          </el-tooltip>
          <el-tooltip effect="dark" content="上移" placement="top">
            <span class="iconfont icon-move-up"></span>
          </el-tooltip>
          <el-tooltip effect="dark" content="删除" placement="top">
            <span class="iconfont icon-delete1"></span>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CatalogueManager',
  data() {
    return {
      catalogues: [
        {
          lessonName: 'Enjoy the beauty of your youth',
          updatedAt: '2018-06-02 10:20',
          extra: {
            coverUrl:
              'http://g.hiphotos.baidu.com/image/h%3D300/sign=a102682e4fa7d933a0a8e2739d4ad194/6f061d950a7b0208d5456ddb6fd9f2d3572cc878.jpg'
          }
        },
        {
          lessonName: 'Enjoy the beauty of your youth',
          updatedAt: '2018-06-02 10:20',
          extra: {
            coverUrl:
              'http://g.hiphotos.baidu.com/image/h%3D300/sign=a102682e4fa7d933a0a8e2739d4ad194/6f061d950a7b0208d5456ddb6fd9f2d3572cc878.jpg'
          }
        },
        {
          lessonName: 'Enjoy the beauty of your youth',
          updatedAt: '2018-06-02 10:20',
          extra: {
            coverUrl:
              'http://g.hiphotos.baidu.com/image/h%3D300/sign=a102682e4fa7d933a0a8e2739d4ad194/6f061d950a7b0208d5456ddb6fd9f2d3572cc878.jpg'
          }
        }
      ]
    }
  }
}
</script>
<style lang="scss">
.catalogue-manager {
  font-size: 16px;
  color: #414141;
  background-color: #fff;
  padding: 30px 28px;
  &-title {
    color: #333;
    padding-bottom: 10px;
    border-bottom: 1px solid #b9bcc2;
    position: relative;
    .el-button--success {
      background-color: #17da98;
      position: absolute;
      right: 0;
      border-color: #17da98;
      bottom: 12px;
      font-size: 16px;
      height: 32px;
      line-height: 32px;
      padding: 0;
      width: 128px;
    }
  }
  &-empty {
    text-align: center;
    margin: 100px 0;
    &-info {
      margin-bottom: 15px;
      color: #414141;
    }
  }
  &-item {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #414141;
    padding: 15px 0;
    border-bottom: 1px solid #f4f4f4;
    &-index {
      width: 32px;
    }
    &-cover {
      font-size: 0;
      img {
        width: 120px;
        height: 70px;
        object-fit: cover;
      }
    }
    &-name {
      flex: 1;
      padding: 0 20px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
    }
    &-operations {
      width: 100px;
      color: #b3b3b3;
      margin-left: 100px;
      display: flex;
      justify-content: space-between;
      .iconfont {
        font-size: 18px;
        cursor: pointer;
      }
    }
  }
  &-item:last-child {
    border-bottom: none;
  }
}
</style>

