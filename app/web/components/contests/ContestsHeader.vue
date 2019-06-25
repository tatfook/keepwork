<template>
  <div class="contests-header">
    <div class="contests-header-left">
      <ul class="contests-header-left-menu">
        <li class="contests-header-left-menu-item"><img src="@/assets/contests/little_1.png" alt=""></li>|
        <li class="contests-header-left-menu-item"><img src="@/assets/contests/little_2.png" alt=""></li>|
        <li class="contests-header-left-menu-item"><img src="@/assets/contests/little_5.png" alt=""></li>|
        <li class="contests-header-left-menu-item"><img src="@/assets/contests/little_4.png" alt=""></li><span class="phone-menu-item">|</span>
        <li class="contests-header-left-menu-item phone-menu-item"><img src="@/assets/contests/little_3.png" alt="">官方指定创作软件：Paracraft创意空间</li>
      </ul>
    </div>
    <div class="contests-header-phone-suggest">
      <img src="@/assets/contests/little_3.png" alt="">
      官方指定创作软件：paracraft创意空间
    </div>
    <div class="contests-header-right">
      <p class="contests-header-right-text">大赛时间： 二零一九年四月 至 二零一九年十二月</p>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.contests-header {
  display: flex;
  max-width: 1020px;
  margin: 0 auto;
  font-family: 'STKaiti';
  font-weight: bold;
  &-left {
    flex: 2;
    &-menu {
      list-style: none;
      display: flex;
      align-items: center;
      font-size: 14px;
      padding: 0;
      &-item {
        display: flex;
        align-items: center;
        padding: 0 8px;
      }
    }
  }
  &-right {
    flex: 1;
    &-text {
      text-align: right;
      font-size: 14px;
      padding-top: 13px;
    }
  }
  &-phone-suggest {
    display: none;
  }
}
@media screen and (max-width: 768px) {
.contests-header {
    display: block;
  &-left {
    &-menu {
      color: #fff;
      justify-content: center;
      .phone-menu-item {
        display: none
      }
    }
  }
  &-right {
    display: none;
  }
  &-phone-suggest{
    display: flex;
    line-height: 44px;
    justify-content: center;
    border: 1px solid #fff;
    width: 96%;
    margin: 0 auto;
    color: #fff;
  }
}  
}
</style>

