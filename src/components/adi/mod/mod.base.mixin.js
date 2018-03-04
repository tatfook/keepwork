import { mapGetters } from 'vuex'
import jss from 'jss'
import preset from 'jss-preset-default'

jss.setup(preset())

const modBaseMixin = {
  props: {
    mod: Object,
    theme: Object,
    editMode: Boolean
  },
  render(h) {
    if (this.sheet) this.sheet.detach()
    let style = this.styles[this.mod.styleID]
    let template = this.templates[style.template]
    this.sheet = jss.createStyleSheet(style.data)
    this.sheet.attach()
    return template.render(h, this)
  },
  methods: {
    onEditProperty(property) {
      this.$store.dispatch('setActiveProperty', {
        mod: this.mod,
        property: property
      })
    },
    isChildActive(property) {
      return this.mod.isActive && property === this.activeProperty
    },
    isChildHidden(property) {
      return !!this.mod.data[property].hidden
    },
    childData(property) {
      return this.mod.data[property].data
    },
    childComponentType(property) {
      return this.mod.data[property].componentType
    },
    jssClass(name) {
      return this.sheet.classes[name]
    },
    themeClass(name) {
      if (this.theme) return this.theme.classes[name]
    }
  },
  computed: {
    ...mapGetters({
      activeProperty: 'activeProperty'
    })
  }
}

export default modBaseMixin
