<template>
  <component :is='a'>
    <div v-if='hasHeader' slot='header'> </div>
    <div v-if='hasFooter' slot='footer'> </div>
    <div v-if='hasSidebar' slot='sidebar'> </div>
  </component>
</template>

<script>
import layoutTemplates from './templates'

export default {
  props: {
    layout: Object
  },
  computed: {
    layoutTemplate() {
      return layoutTemplates[this.layout.styleID]
    }
  }
}
</script>
