<template>
  <div class="comp-hide-abroad"  @dblclick="compHideShow()">
    <div class="comp-hide-inner">
      <div class="comp-hide-title">{{ $t(compTitle()) }}</div>
      <div class="comp-hide-text">{{ $t('compHideText.anteriorSegmentText') }}<span class="comp-hide-text-blue">{{ $t('compHideText.blueCompHideText') }}</span>{{ $t('compHideText.posteriorSegmentText') }}</div>
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
  height: 120px;
  width: 100%;
  background-color: #ececec;
  opacity: 0.8;
}
.comp-hide-inner{
  text-align: center;
}
.comp-hide-title {
  font-weight: 600;
  font-size: 24px;
  height: 60px;
  line-height: 75px;
}
.comp-hide-text {
  height: 60px;
  line-height: 30px;
}
.comp-hide-text-blue {
  color: #48a3ff;
}
</style>
