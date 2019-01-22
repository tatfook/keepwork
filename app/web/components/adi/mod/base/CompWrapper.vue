<template>
  <div v-if='editMode' @click.stop.prevent='onEditProperty' @dblclick='onDblclickProperty' :class='classes'>
    <component v-if='isDisplay' :is='basicComp' :rootMod='rootMod' :property='property' :source='source' :theme='theme' :editMode='editMode' :options='compOptions'/>
  </div>
  <div v-else :class='classes'>
    <component v-if='isDisplay' :is='basicComp' :rootMod='rootMod' :property='property' :source='source' :theme='theme' :options='compOptions' />
  </div>
</template>

<script>
import BasicComponents from '@/components/adi/common/'
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    rootMod: Object,
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
    async onEditProperty() {
      if (this.mod.isSub) {
        await this.$store.dispatch('setActiveMod', this.rootMod.key)
        if(this.mod.index !== undefined) { // list mod
          await this.$store.dispatch('updateActiveModAttributeList', {
            key: this.mod.property,
            action: 'EDIT',
            index: this.mod.index
          })
        } else {
          await this.$store.dispatch('setActiveSubMod', {
            modType: this.mod.modType,
            parentProperty: this.mod.property,
            data: this.activeMod.data[this.mod.property]
          })
        }
        this.$store.dispatch('setActiveProperty', {
          property: this.property
        })
      } else {
        this.$store.dispatch('setActiveProperty', {
          key: this.rootMod.key,
          property: this.property
        })
      }
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
      activePageUrl: 'activePageUrl',
      activeMod: 'activeMod'
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
        let whitelist = []
        if (process.env.MARKDOWN_SCRIPT_WHITELIST) {
          whitelist = process.env.MARKDOWN_SCRIPT_WHITELIST.split(',')
        }
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
