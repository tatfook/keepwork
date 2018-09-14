<template>
  <div class='comp-sub-mod'>
    <mod-comp-loader :mod='modWithExtraConf(source)' :theme='theme' :modType='options.modType' :editMode='editMode'/>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'
import ModCompLoader from '@/components/adi/utils/ModCompLoader'

export default {
  name: 'AdiSubMod',
  mixins: [compBaseMixin],
  components: {
    ModCompLoader
  },
  methods: {
    modWithExtraConf(source) {
      return {
        data:  _.merge({}, source, this.options.modSettings)
      }
    }
  }
}
</script>

<style>

</style>
