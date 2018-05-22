import _ from 'lodash'
import jss from 'jss'
import preset from 'jss-preset-default'
import { mapGetters } from 'vuex'
import CompWrapper from './CompWrapper'
import { gThemeData } from '@/lib/global'

jss.setup(preset())

const buildCompWrapper = (h, m, property, compType) => {
  return (
    <CompWrapper
      mod={m.mod}
      modData={m.modData}
      property={property}
      compType={compType}
      classes={m.compWrapperClass(property)}
      editMode={m.editMode}
      options={m.compWrapperOptions(property)}
    />
  )
}

const renderTemplate = (h, m, template, root) => {
  template = template || m.template

  root = (root || 'root') + 'Row'
  return (
    <el-row {...m.getProps(root)} class={m.getClasses(root)}>
      {_.map(template, obj => {
        return _.map(obj, (element, key) => {
          if (Array.isArray(element)) {
            return (
              <el-col {...m.getProps(key)} class={m.getClasses(key)}>
                {renderTemplate(h, m, element, key)}
              </el-col>
            )
          } else if (typeof element === 'string') {
            return (
              <el-col {...m.getProps(key)} class={m.getClasses(key)}>
                {buildCompWrapper(h, m, element, m.compType(element))}
              </el-col>
            )
          } else {
            console.log('Invalid element with key: ' + key)
          }
        })
      })}
    </el-row>
  )
}

export default {
  props: {
    mod: Object,
    conf: Object,
    theme: Object,
    editMode: Boolean,
    active: Boolean
  },
  render(h) {
    if (this.sheet) this.sheet.detach()
    let styleID =
      Number(this.modData.styleID) >= this.conf.styles.length
        ? this.conf.styles.length - 1
        : Number(this.modData.styleID)
    this.style = this.conf.styles[styleID || 0]
    this.template = this.conf.templates[this.style.templateID || 0]
    this.sheet = jss.createStyleSheet(this.style.data)
    this.sheet.attach()

    _.merge(this.theme.data, gThemeData)

    return (
      <div data-mod={this.mod ? this.mod.modType : 'ModMarkdown'} class={this.getClasses('root')}>
        {renderTemplate(h, this)}
      </div>
    )
  },
  methods: {
    isChildActive(property) {
      return this.editMode && this.active && property === this.activeProperty
    },
    compType(property) {
      return this.conf.components[property]
    },
    jssClass(name) {
      return this.sheet.classes[name]
    },
    themeClass(name) {
      if (this.theme) return this.theme.sheet.classes[name]
    },
    themeData(name) {
      if (this.theme) return this.theme.data[name]
    },
    compWrapperClass(name) {
      let classes = []
      classes = this.getClasses(name)
      classes.push('comp')
      if (this.isChildActive(name)) classes.push('comp-active')
      return classes
    },
    getClasses(name) {
      name = name || 'root'
      let classes = []
      if (this.jssClass(name)) classes.push(this.jssClass(name))
      if (this.style.theme && this.style.theme[name]) {
        this.style.theme[name].forEach(el => classes.push(this.themeClass(el)))
      }
      return _.flatten(classes)
    },
    getProps(name) {
      let props = (this.style.props && this.style.props[name]) || {}
      return { props }
    },
    generateOptionsStyle(name) {
      let self = this
      let options = {}

      if (self.style.options) {
        if (self.style.options.config && self.style.options.config[name]) {
          options = _.cloneDeep(self.style.options.config[name])
        }

        if (self.style.options.theme && self.style.options.theme[name]) {
          let themeClassOptions = self.style.options.theme[name]

          let getClassStyle = (item, themeOptions) => {
            _.forEach(item, (op, key) => {
              // 如果定义了相同的theme key，则之前的配置会被覆盖

              if (typeof (op) === 'object') {
                getClassStyle(op)
              } else {
                themeOptions[key] = self.themeData(op)
              }
            })
          }

          _.forEach(themeClassOptions, (item, key) => {
            if (typeof (item) === 'object') {
              let themeOptions = {}
              getClassStyle(item, themeOptions)

              options[key] = themeOptions
            } else {
              options[key] = self.themeData(item)
            }
          })
        }
      }

      return options
    },
    compWrapperOptions(name) {
      let options = {}

      options = _.merge(options, this.generateOptionsStyle(name))

      return options
    }
  },
  computed: {
    ...mapGetters({
      activeProperty: 'activeProperty'
    }),
    modData() {
      // use basic data as default to make sure the mod data is correct
      return _.merge({}, this.conf.properties, this.mod ? this.mod.data : {})
    }
  }
}
