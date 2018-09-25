<template>
  <div class="item">
    <img class="item-cover" src="http://star.rayli.com.cn/public/upload/share/000/001/658/04/bcfec7af1f18a45ddc90ec7f9d40a649OJWppZ.jpeg" alt="">
    <h4 class="item-title">告诉果果</h4>
    <div class="item-like">
      <i class="iconfont icon-browse_fill"></i>
      <span>123456</span>
      <i class="iconfont icon-like-fill"></i>
      <span>123456</span>
    </div>
    <div class="item-author">
      <div class="item-author-name"><img src="http://star.rayli.com.cn/public/upload/share/000/001/658/04/bcfec7af1f18a45ddc90ec7f9d40a649OJWppZ.jpeg" alt="portrait">鱼丸粗面</div>
      <div class="item-author-time">27天前</div>
    </div>
  </div>
</template>
<style lang='scss'>
.item {
  width: 290px;
  padding: 16px;
  box-sizing: border-box;
  border: 1px solid #e8e8e8;
  background: #fff;
  &-cover {
    width: 100%;
    height: 143px;
    object-fit: cover;
    border-radius: 4px;
  }
  &-title {
    font-size: 14px;
    margin: 10px 0;
  }
  &-like {
    font-size: 12px;
    color: #909399;
  }
  &-author {
    display: flex;
    align-items: center;
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    &-name {
      flex: 1;
      display: flex;
      align-items: center;
      padding-top: 12px;
      img {
        width: 30px;
        height: 30px;
        object-fit: cover;
        border-radius: 50%;
        margin-right: 8px;
      }
    }
    &-time {
      width: 80px;
      text-align: right;
    }
  }
}
</style>
