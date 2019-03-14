<template>
  <div class="org-package-cell">
    <img class="org-package-cover" src="https://api.keepwork.com/storage/v0/siteFiles/2910/raw#34_Black_4k_.jpg" alt="">
    <div class="org-package-desc">
      <div class="org-package-desc-title">Paracraft动画</div>
      <div class="org-package-desc-line">{{$t('lesson.include')}}:<span class="line-strong">11个课程</span></div>
      <div class="org-package-desc-line">{{$t('lesson.ages')}}:<span class="line-strong">100</span></div>
      <div class="org-package-desc-line">{{$t('lesson.intro')}}:<span class="line-strong">握手佛安家了发了房间辣椒粉垃圾发发拉法基拉风就拉菲垃圾费拉菲拉发了疯拉菲案例发发了发发发发阿发啊发了房间拉法基拉风就啊握手佛安家了发了房间辣椒粉垃圾发发拉法基拉风就拉菲垃圾费拉菲拉发了疯拉菲案例发发了发发发发阿发啊发了房间拉法基拉风就啊</span></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrgPackageCell'
}
</script>

<style lang="scss">
.org-package {
  &-cell {
    background: #fff;
    width: 288px;
    box-sizing: border-box;
    padding: 16px;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.16);
      transition: all 200ms ease-in;
    }
  }
  &-cover {
    width: 256px;
    height: 100%;
    border-radius: 4px;
  }
  &-desc {
    font-size: 12px;
    color: #c0c4cc;
    &-title {
      font-size: 14px;
      margin: 10px 0;
      color: #333;
      height: 20px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    &-line {
      font-size: 12px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: #c0c4cc;
      margin-top: 8px;
      .line-strong {
        color: #909399;
        margin-left: 7px;
      }
    }
  }
}
</style>

