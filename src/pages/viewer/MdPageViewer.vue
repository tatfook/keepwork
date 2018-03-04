<template>
  <div>
    <template v-for='mod in source.modList'>
      <mod-loader :mod='mod' :key='mod.key'> </mod-loader>
    </template>
  </div>
</template>

<script>
import testData from './testData'
import ModLoader from './ModLoader'

export default {
  data () {
    return {
      source: testData
    }
  },
  components: {
    ModLoader
  }
}
</script>
