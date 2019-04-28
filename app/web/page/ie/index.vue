<template>
  <div :style="backgroundStyle">
    <div class="browser-version" style="width: 450px; text-align: center; margin: 0 auto; padding-top:250px; font-size: 20px; color: #333;">
      <img class="browser-version-logo" style="width:300px;display: block; margin: 0 auto;" :src="logo" alt="keepwork">
      <div class="tips-title" style="font-size: 28px;margin-top:20px;font-weight: bold; display: inline-block;">温馨提示</div>
      <div class="margin-top-lg" style="font-size: 18px;margin-top: 50px;">您的浏览器版本过低，为保证正常显示，请升级。</div>
      <div style="font-size: 18px; margin-top: 20px;">推荐： <a style="color: #409eff" href="https://www.google.cn/chrome/">Google Chrome[打开官网]</a> </div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'ie',
  data() {
    return {
      logo: require('@/assets/img/logo_old.png'),
      bg: require('@/assets/img/old_browser.jpg')
    }
  },
  computed: {
    backgroundStyle() {
      return `width: 1920px; height: 1080px; margin: 0 auto;background: url('${this.bg}') no-repeat center;`
    }
  }
}
</script>
