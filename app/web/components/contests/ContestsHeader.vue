<template>
  <div class="contests-header">
    <div class="contests-header-left">
      <ul class="contests-header-left-menu">
        <li class="contests-header-left-menu-item"><img src="@/assets/contests/little_1.png" alt=""></li>|
        <li class="contests-header-left-menu-item"><img src="@/assets/contests/little_2.png" alt=""></li>|
        <li class="contests-header-left-menu-item"><img src="@/assets/contests/little_5.png" alt=""></li>|
        <li class="contests-header-left-menu-item"><img src="@/assets/contests/little_4.png" alt=""></li>|
        <li class="contests-header-left-menu-item"><img src="@/assets/contests/little_3.png" alt="">官方指定创作软件：paracraft创意空间</li>
      </ul>
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
      font-family: 'STKaitiSC-Black';
      padding-top: 13px;
    }
  }
}
</style>

