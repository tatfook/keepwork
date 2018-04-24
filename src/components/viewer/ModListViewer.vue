<template>
  <div mod-container>
    <template v-for='mod in modList'>
      <mod-loader :mod='mod' :theme='theme' :key='mod.key'> </mod-loader>
    </template>
  </div>
</template>

<script>
import ModLoader from './ModLoader'

export default {
  props: {
    modList: Array,
    theme: Object
  },
  components: {
    ModLoader
  }
}
</script>
