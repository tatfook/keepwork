<template>
  <div v-if='editMode' @click.stop.prevent='onEditProperty' :class='classes'>
    <component v-if='isDisplay' :is='modComponent' :mod='source' :conf='modConf' :theme='theme' :editMode='editMode' :options='options' />
  </div>
  <div v-else :class='classes'>
    <component v-if='isDisplay' :is='modComponent' :mod='source' :conf='modConf' :theme='theme' :options='options' />
  </div>
</template>

<script>
import AsyncModLoader from '@/components/adi/mod/index.async'

export default {
  name: 'ChildModWrapper',
  props: {
    mod: Object,
    modData: Object,
    theme: Object,
    property: String,
    modType: String,
    classes: Array,
    editMode: Boolean,
    options: Object
  },
  data() {
    return {
      modComponent: undefined,
      modConf: undefined
    }
  },
  created() {
    this.loadComponent()
  },
  methods: {
    async loadComponent() {
      const data = await AsyncModLoader.load(this.modType)
      this.modConf = data.default
      this.modComponent = this.modConf.mod
      // if (mod.parent) throw new Error('A parent mod cannot be composed by other mod! Mod name: ' + this.modType)
    },
    onEditProperty() {
      this.$store.dispatch('setActiveProperty', {
        key: this.mod.key,
        property: this.property
      })
    }
  },
  computed: {
    isDisplay() {
      return this.modData[this.property] && !this.modData[this.property].hidden
    },
    source() {
      if (
        this.modData[this.property] &&
        typeof this.modData[this.property] == 'object'
      ) {
        return this.modData[this.property]
      } else {
        return {}
      }
    }
  }
}
</script>
