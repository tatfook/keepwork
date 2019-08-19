<template>
  <div class="not-verified-page">
    <div class="not-verified-page-content">
      <img class="not-verified-page-img" src="../../assets/pblImg/not-verified.jpg" alt="not verified">
      <div class="not-verified-page-tips">
        <p>{{$t('project.verifiedTips')}}</p>
        <p>{{$t('project.verifiedContent')}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotVerifiedPage'
}
</script>

<style lang="scss" scoped>
.not-verified-page {
  &-content {
    margin: 30px auto;
    width: 680px;
    text-align: center;
  }
  &-img {
    width: 456px;
    margin: 0 auto;
  }
  &-tips {
    text-align: left;
    color: #303133;
    font-weight: bold;
    font-size: 26px;
  }
}

@media (max-width: 760px) {
  .not-verified-page {
    &-content {
      width: 90%;
    }
    &-img {
      width: 90%;
      object-fit: contain;
    }
    &-tips {
      text-align: left;
      color: #303133;
      font-weight: bold;
      font-size: 14px;
    }
  }
}
</style>