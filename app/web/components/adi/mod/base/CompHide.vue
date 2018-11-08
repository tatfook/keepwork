<template>
  <div class="aaa">
    <div class="bbb">
      <div class="hideLogo"></div>
      <div>标题模块</div>
      <div>该内容被隐藏了，点击此处可再次编辑</div>
    </div>
  </div>
</template>

<script>
import BasicComponents from '@/components/adi/common/'
import { mapActions, mapGetters } from 'vuex'

export default {}
</script>

<style scoped>
.aaa{
  height: 100px;
  width: 100%;
  background-color: #ececec;
  opacity: 0.8;
  padding-top: 30px;
  padding-bottom: 40px;
}
.bbb{
  text-align: center;
}
.hideLogo {
  margin: 0 auto;
  background-image: url('../../../../assets/img/hideLogo.png');
  background-position: center center;
  background-repeat: no-repeat;
  width: 60px;
  height: 60px;
}
</style>
