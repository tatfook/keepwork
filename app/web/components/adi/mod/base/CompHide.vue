<template>
  <div class="comp-hide-abroad"  @dblclick="compHideShow()">
    <div class="comp-hide-inner">
      <div class="hide-logo"></div>
      <div>{{ $t(compTitle()) }}</div>
      <div>{{ $t('compHideText.anteriorSegmentText') }}<span class="comp-hide-text-blue">{{ $t('compHideText.blueCompHideText') }}</span>{{ $t('compHideText.posteriorSegmentText') }}</div>
    </div>
  </div>
</template>

<script>
import BasicComponents from '@/components/adi/common/'
import { mapActions, mapGetters } from 'vuex'
import modsName from '../modsName'

export default {
  props: {
    compHideData: Object,
    compHideName: String
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
    },
    compTitle(){
      return modsName[this.compHideName]
    }
  }
}
</script>

<style scoped>
.comp-hide-abroad{
  height: 100px;
  width: 100%;
  background-color: #ececec;
  opacity: 0.8;
  padding-top: 30px;
  padding-bottom: 40px;
}
.comp-hide-inner{
  text-align: center;
}
.hide-logo {
  margin: 0 auto;
  background-image: url('../../../../assets/img/hideLogo.png');
  background-position: center center;
  background-repeat: no-repeat;
  width: 60px;
  height: 60px;
}
.comp-hide-text-blue {
  color: #48a3ff;
}
</style>
