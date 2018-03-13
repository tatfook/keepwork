<template>
  <div v-if='editMode' @click.stop.prevent='onEditProperty' :class='classes'>
    <component v-if='isDisplay' :is='basicComp' :mod='mod' :source='source' :editMode='editMode' :options='options' />
  </div>
  <div v-else :class='classes'>
    <component v-if='isDisplay' :is='basicComp' :mod='mod' :source='source' :options='options' />
  </div>
</template>

<script>
import BasicComponents from '@/components/adi/common/'

export default {
  props: {
    mod: Object,
    property: String,
    classes: Array,
    editMode: Boolean,
    options: Object
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
  },
  created() {
    console.log(this)
  }
}
</script>

<style>

</style>
