<template>
  <div class='viewport-container'>
    <el-button @click='newMod'> + </el-button>
    <template v-for='mod in modList'>
      <editor-mod-selector :key='mod.key' :mod='mod'></editor-mod-selector>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import EditorModSelector from './EditorModSelector'

export default {
  name: 'EditorViewport',
  components: {
    EditorModSelector
  },
  computed: {
    ...mapGetters({
      modList: 'modList'
    })
  },
  methods: {
    newMod() {
      this.$store.dispatch('addMod', { modName: 'AdiHeader' })
    }
  }
}
</script>
