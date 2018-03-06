<template>
  <div v-if='editMode' @click.stop.prevent='onEditProperty' :class='classes'>
    <component v-if='isDisplay' :is='basicComp' :source='source' :editMode='true' />
  </div>
  <div v-else :class='classes'>
    <component v-if='isDisplay' :is='basicComp' :source='source' />
  </div>
</template>

<script>
import BasicComponents from '@/components/adi/common/'

export default {
  props: {
    mod: Object,
    property: String,
    classes: Array,
    editMode: Boolean
  },
  methods: {
    onEditProperty() {
      this.$store.dispatch('setActiveProperty', {
        mod: this.mod,
        property: this.property
      })
    }
  },
  computed: {
    basicComp() {
      return BasicComponents[this.mod.components[this.property].type]
    },
    isDisplay() {
      return !this.mod.components[this.property].hidden
    },
    source() {
      return this.mod.components[this.property].data
    }
  }
}
</script>

<style>

</style>
