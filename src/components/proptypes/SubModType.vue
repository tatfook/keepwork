<template>
  <div class="sub-mod-type">
    <el-button plain type='primary' size='mini' @click='editSubMod'>{{$t('editor.edit')}}</el-button>
  </div>

</template>
<script>
import protypesBaseMixin from './protypes.base.mixin'
import modLoader from '@/components/adi/mod'
import { mapGetters } from 'vuex'

export default {
  name: 'SubModType',
  mixins: [protypesBaseMixin],
  methods: {
    async editSubMod() {
      let activeModConf = modLoader.load(this.activeMod.modType)
      let subModType = activeModConf.modSettings[this.cardKey].modType
      this.$store.dispatch('setActiveSubMod', {
        modType: subModType,
        parentProperty: this.cardKey,
        data: this.activeMod.data[this.cardKey]
      })
    }
  },
  computed: {
    ...mapGetters({
      activeMod: 'activeMod'
    })
  }
}
</script>
<style scoped>
.el-button {
  font-size: 16px;
}
</style>
