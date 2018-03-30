<template>
  <div v-if='editMode' @click.stop.prevent='onEditProperty' :class='classes'>
    <component v-if='isDisplay' :is='basicComp' :source='source' :editMode='editMode' :options='options' />
  </div>
  <div v-else :class='classes'>
    <component v-if='isDisplay' :is='basicComp' :source='source' :options='options' />
  </div>
</template>

<script>
import BasicComponents from '@/components/adi/common/'

export default {
  props: {
    mod: Object,
    modData: Object,
    property: String,
    compType: String,
    classes: Array,
    editMode: Boolean,
    options: Object
  },
  methods: {
    onEditProperty() {
      this.$store.dispatch('setActiveProperty', {
        key: this.mod.key,
        property: this.property
      })
    }
  },
  computed: {
    basicComp() {
      return BasicComponents[this.compType]
    },
    isDisplay() {
      return !this.modData[this.property].hidden
    },
    source() {
      return this.modData[this.property]
    }
  }
}
</script>

<style>

</style>
