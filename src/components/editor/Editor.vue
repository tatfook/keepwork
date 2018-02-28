<template>
  <div class='viewport-container'>
    <editor-viewport :state='store.state'> </editor-viewport>
  </div>
</template>

<script>
import store from '@/vuex/editor/editor.store'
import EditorViewport from './EditorViewport'

export default {
  name: 'Editor',
  data () {
    return {
      store: store
    }
  },
  components: {
    EditorViewport
  }
}
</script>
