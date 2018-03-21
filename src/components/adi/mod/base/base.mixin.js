import Vue from 'vue'
import _ from 'lodash'
import jss from 'jss'
import preset from 'jss-preset-default'
import { mapGetters } from 'vuex'
import CompWrapper from './CompWrapper'

Vue.component('CompWrapper', CompWrapper)
jss.setup(preset())

const buildCompWrapper = (h, m, property, compType) => {
  return (
    <compWrapper
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
  created() {},
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

    return <div class={this.getClasses('root')}>{renderTemplate(h, this)}</div>
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
      let classes = this.getClasses(name)
      if (this.isChildActive(name)) classes['comp-active'] = true
      return classes
    },
    getClasses(name) {
      name = name || 'root'
      let classes = []
      let classArr = []
      let classMap = {}
      if (this.jssClass(name)) classes.push(this.jssClass(name))
      if (this.style.theme && this.style.theme[name]) {
        this.style.theme[name].forEach(el => classes.push(this.themeClass(el)))
      }
      classArr = _.flattenDeep(classes)
      for (var i = 0; i < classArr.length; i++) {
        classMap[classArr[i]] = true
      }
      return classMap
    },
    getProps(name) {
      let props = (this.style.props && this.style.props[name]) || {}
      return { props }
    },
    compWrapperOptions(name) {
      let options = {}

      if (this.style.options) {
        if (this.style.options.config[name]) {
          options = _.cloneDeep(this.style.options.config[name])
        }
        if (this.style.options.theme[name]) {
          _.forEach(this.style.options.theme[name], (op, key) => {
            // 如果定义了相同的theme key，则之前的配置会被覆盖
            options[key] = this.themeData(op)
          })
        }
      }
      return options
    }
  },
  computed: {
    ...mapGetters({
      activeProperty: 'activeProperty'
    }),
    modData() {
      // use basic data as default to make sure the mod data is correct
      return _.merge(_.cloneDeep(this.conf.properties), this.mod.data)
    }
  }
}
