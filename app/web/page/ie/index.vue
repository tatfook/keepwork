<template>
  <div class="browser-version" style="width: 450px; margin: 250px auto; font-size: 20px; color: #333;">
    <img class="browser-version-logo" style="width:300px;display: block; margin: 0 auto;" :src="logo" alt="keepwork">
    <div class="tips-title" style="font-size: 34px;text-align:center;margin-top:20px;font-weight: bold;">温馨提示</div>
    <div class="margin-top-lg" style="margin-top: 60px;">您的浏览器版本过低，为保证正常显示，请升级。</div>
    <div>推荐：</div>
    <div style="margin-top: 30px;">Google Chrome <a class="black-link" style="color: #333;text-decoration:none;" href="https://www.google.cn/chrome/">[打开官网]</a> </div>
  </div>
</template>


<script>
export default {
  name: 'ie',
  data() {
    return {
      logo: require('@/assets/img/logo_old.png')
    }
  }
}
</script>
