import { mapGetters } from 'vuex'
import jss from 'jss'
import preset from 'jss-preset-default'

jss.setup(preset())

const modBaseMixin = {
  props: {
    mod: Object,
    editMode: Boolean,
    sheet: Object
  },
  render(h) {
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
    childData(property) {
      return this.mod.data[property].data
    },
    childComponentType(property) {
      return this.mod.data[property].componentType
    },
    jssClass(name) {
      return this.sheet.classes[name]
    }
  },
  computed: {
    ...mapGetters({
      activeProperty: 'activeProperty'
    })
  }
}

export default modBaseMixin
