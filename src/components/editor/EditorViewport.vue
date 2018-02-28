<template>
  <div class='viewport-container'>
    <template v-for='mod in source.modList'>
      <editor-mod-selector :key='mod.key' :mod='mod'></editor-mod-selector>
    </template>
  </div>
</template>

<script>
import testData from '../md-page/testData'
import EditorModSelector from './EditorModSelector'

export default {
  name: 'EditorViewport',
  props: {
    state: Object
  },
  data() {
    return {
      source: testData
    }
  },
  components: {
    EditorModSelector
  }
}
</script>
