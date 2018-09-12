<template>
  <div mod-container>
    <template v-for='mod in modList'>
      <mod-comp-loader :mod='mod' :theme='theme' :key='mod.key'> </mod-comp-loader>
    </template>
  </div>
</template>

<script>
import ModCompLoader from '@/components/adi/utils/ModCompLoader'

export default {
  props: {
    modList: Array,
    theme: Object
  },
  components: {
    ModCompLoader
  }
}
</script>
