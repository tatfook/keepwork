import _ from 'lodash'
import jss from 'jss'
import preset from 'jss-preset-default'
import { mapGetters } from 'vuex'
import CompWrapper from './CompWrapper'

jss.setup(preset())

const renderTemplate = (h, m) => {
  let components = m.conf.properties.components
  return (
    <div class={_.kebabCase(m.conf.name)}>
      {_.map(components, (_, key) => {
        return (
          <CompWrapper
            mod={m.mod}
            property={key}
            classes={m.compWrapperClass(key)}
            editMode={m.editMode}
          />
        )
      })}
    </div>
  )
}

export default {
  props: {
    mod: Object,
    conf: Object,
    theme: Object,
    editMode: Boolean
  },
  render(h) {
    if (this.sheet) this.sheet.detach()
    this.style = this.conf.styles[this.mod.styleID]
    this.sheet = jss.createStyleSheet(this.style.data)
    this.sheet.attach()
    return renderTemplate(h, this)
  },
  methods: {
    isChildActive(property) {
      return this.mod.isActive && property === this.activeProperty
    },
    jssClass(name) {
      return this.sheet.classes[name]
    },
    themeClass(name) {
      if (this.theme) return this.theme.classes[name]
    },
    compWrapperClass(property) {
      let classes = []
      let name = _.kebabCase(this.conf.name) + '-' + property
      if (this.isChildActive(property)) classes.push('comp-active')
      if (this.jssClass(name)) classes.push(this.jssClass(name))
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
