<template>
  <div class="compHideA">
    <div class="compHideB">
      <div class="hideLogo"></div>
      <div>标题模块</div>
      <div>该内容被<span class="compHideClose" @click="compHideShow()">隐藏了</span>，点击此处可再次编辑</div>
    </div>
  </div>
</template>

<script>
import BasicComponents from '@/components/adi/common/'
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    compHideData: Object
  },
  methods: {
    ...mapActions({
      updateActiveModAttribute: 'updateActiveModAttribute'
    }),
    compHideShow(){
      _.forEach(this.compHideData, (item, key) => {
        if (key == 'styleID') {
          return true
        }
        item.hidden = false
        this.updateActiveModAttribute({"key": key, "value": item})
      })
    }
  }
}
</script>

<style scoped>
.compHideA{
  height: 100px;
  width: 100%;
  background-color: #ececec;
  opacity: 0.8;
  padding-top: 30px;
  padding-bottom: 40px;
}
.compHideB{
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
.compHideClose {
  color: #48a3ff;
}
</style>
