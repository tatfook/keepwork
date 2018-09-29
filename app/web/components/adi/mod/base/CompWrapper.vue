<template>
  <div v-if='editMode' @click.stop.prevent='onEditProperty' @dblclick='onDblclickProperty' :class='classes'>
    <component v-if='isDisplay' :is='basicComp' :source='source' :theme='theme' :editMode='editMode' :options='compOptions' />
  </div>
  <div v-else :class='classes'>
    <component v-if='isDisplay' :is='basicComp' :source='source' :theme='theme' :options='options' />
  </div>
</template>

<script>
import BasicComponents from '@/components/adi/common/'
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    mod: Object,
    modData: Object,
    theme: Object,
    property: String,
    compType: String,
    classes: Array,
    editMode: Boolean,
    options: Object
  },
  data() {
    return {
    }
  },
  methods: {
    ...mapActions({
      setIsMultipleTextDialogShow: 'setIsMultipleTextDialogShow'
    }),
    onEditProperty() {
      this.$store.dispatch('setActiveProperty', {
        key: this.mod.key,
        property: this.property
      })
    },
    onDblclickProperty() {
      if (this.compType === 'AdiMarkdown') {
        this.setIsMultipleTextDialogShow({
          isShow: true
        })
      }
      let comp = BasicComponents[this.compType]

      if (comp.bedbclick) {
        comp.dblclick(this)
      }
    }
  },
  computed: {
    ...mapGetters({
      activePageUrl: 'activePageUrl'
    }),
    basicComp() {
      return BasicComponents[this.compType]
    },
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
    },
    compOptions() {
      let ops = _.cloneDeep(this.options)
      if (this.compType === 'AdiMarkdown') {
        // check whitelist
        const whitelist = process.env.MARKDOWN_SCRIPT_WHITELIST || []
        const siteAccount = this.activePageUrl.split('/')[1]
        if (whitelist.indexOf(siteAccount) > -1) ops.enableScript = true
      }
      return ops
    }
  }
}
</script>

<style>
</style>
