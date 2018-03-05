import _ from 'lodash'
import jss from 'jss'
import preset from 'jss-preset-default'
import mods from '../index'
import { mapGetters } from 'vuex'
import compFactory from '@/components/adi/common/comp.factory'

jss.setup(preset())

const compWrapper = (h, mod, comp, property) => {
  return (
    <div class={mod.compWrapperClass(property)}>
      {compFactory.create(h, mod, property)}
    </div>
  )
}

const renderTemplate = (h, conf, mod) => {
  let components = conf.properties.components
  return (
    <div class={conf.name}>
      {_.map(components, (el, key) => {
        return compWrapper(h, mod, el, key)
      })}
    </div>
  )
}

const modBaseMixin = {
  props: {
    mod: Object,
    theme: Object,
    editMode: Boolean
  },
  render(h) {
    if (this.sheet) this.sheet.detach()
    this.conf = mods[this.mod.type]
    this.style = this.conf.styles[this.mod.styleID]
    this.sheet = jss.createStyleSheet(this.style.data)
    this.sheet.attach()
    return renderTemplate(h, this.conf, this)
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
      return !!this.mod.components[property].hidden
    },
    childData(property) {
      return this.mod.components[property].data
    },
    childComponentType(property) {
      return this.mod.components[property].type
    },
    jssClass(name) {
      return this.sheet.classes[name]
    },
    themeClass(name) {
      if (this.theme) return this.theme.classes[name]
    },
    compWrapperClass(name) {
      let classes = []
      name = _.kebabCase(this.conf.name) + '-' + name
      classes.push(this.jssClass(name))
      if (this.style.theme && this.style.theme[name]) {
        this.style.theme[name].forEach(el => classes.push(this.themeClass(el)))
      }
      return classes
    }
  },
  computed: {
    ...mapGetters({
      activeProperty: 'activeProperty'
    })
  }
}

export default modBaseMixin
