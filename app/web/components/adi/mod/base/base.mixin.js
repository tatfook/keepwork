import _ from 'lodash'
import jss from 'jss'
import preset from 'jss-preset-default'
import { mapGetters } from 'vuex'
import CompWrapper from './CompWrapper'
import CompHide from './CompHide'
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
      theme={m.theme}
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
    active: Boolean,
    renderMode: Boolean
  },
  render(h) {
    const styleID = this.modData.styleID || 0
    const style = this.conf.styles[styleID]

    const templateID = (style && typeof style.templateID === 'number') && style.templateID || 0
    const template = this.conf.templates[templateID]

    let isShowMod = false

    if (this.mod.data && Object.keys(this.mod.data).length !== 0) {
      _.forEach(this.mod.data, (val, key) => {
        if (val && typeof val === 'object') {
          if (typeof val.hidden === 'undefined' || val.hidden === false) {
            isShowMod = true
          }
        }
      })
    } else {
      isShowMod = true
    }

    this.style = style
    this.template = template
    this.sheet = jss.createStyleSheet(this.style.data)
    if (this.sheet) {
      this.sheet.detach()
    }
    this.sheet.attach()

    _.merge(this.theme.data, gThemeData)

    if (isShowMod) {
      return (
        <div
          data-mod={this.mod ? this.mod.modType : 'ModMarkdown'}
          style={this.getFontFamily()}
          class={this.getClasses('root')}
        >
          {renderTemplate(h, this)}
        </div>
      )
    } else {
      if (!this.renderMode && this.editMode) {
        return (
          <CompHide
            compHideName={this.mod.modType}
            compHideData={this.mod.data}
          />
        )
      }
    }
  },
  methods: {
    isChildActive(property) {
      return this.editMode && this.active && property === this.activeProperty
    },
    compType(property) {
      if (!property) {
        return ''
      }

      if (
        !this.conf ||
        !this.conf.components ||
        !this.conf.components[property]
      ) {
        return ''
      }

      if (Array.isArray(this.conf.components[property])) {
        let componentID =
          (this.style && this.style.componentID && this.style.componentID) || 0

        return this.conf.components[property][componentID]
      } else {
        return this.conf.components[property]
      }
    },
    jssClass(name) {
      return this.sheet.classes[name]
    },
    getFontFamily() {
      if (this.themeConf && this.themeConf.fontFamily) {
        return 'font-family: ' + this.themeConf.fontFamily
      } else {
        return ''
      }
    },
    convertColorStyle(name) {
      let themeData = this.conf.themeData
      let gThemeName = this.themeConf.name
      let gThemeColorId = this.themeConf.colorID
      let cName = ''
      if (
        themeData &&
        gThemeName &&
        themeData[gThemeName] &&
        themeData[gThemeName].colors &&
        (gThemeColorId === 0 || gThemeColorId) &&
        name
      ) {
        cName = themeData[gThemeName].colors[gThemeColorId][name]
        return cName
      }
    },
    convertFontStyle(name) {
      let themeData = this.conf.themeData
      let gThemeName = this.themeConf.name
      let gThemeFontId = this.themeConf.fontID
      let fSize = ''
      if (
        themeData &&
        gThemeName &&
        themeData[gThemeName] &&
        themeData[gThemeName].colors &&
        (gThemeFontId === 0 || gThemeFontId) &&
        name
      ) {
        fSize = themeData[gThemeName].fontSize[gThemeFontId][name]
        return fSize
      }
    },
    themeClass(name) {
      if (this.convertColorStyle(name) || this.convertFontStyle(name)) {
        return this.theme.sheet.classes[
          this.convertColorStyle(name) || this.convertFontStyle(name)
        ]
      } else {
        return this.theme.sheet.classes[name]
      }
    },
    themeData(name) {
      if (this.convertColorStyle(name)) {
        return this.theme.data[
          this.convertColorStyle(name) || this.convertFontStyle(name)
        ]
      } else {
        return this.theme.data[name]
      }
    },
    compWrapperClass(name) {
      let classes = []
      classes = this.getClasses(name)
      classes.push('comp')

      if (this.activeMod) {
        if (
          this.mod.uuid === this.activeMod.uuid &&
          name === this.activeProperty
        ) {
          classes.push('comp-proptype-hover')
        }
      }

      if (this.isChildActive(name)) classes.push('comp-active')
      return classes
    },
    getClasses(name) {
      name = name || 'root'
      let classes = []
      if (this.jssClass(name)) classes.push(this.jssClass(name))
      if (this.style.theme && this.style.theme[name]) {
        this.style.theme[name].forEach(el => {
          classes.push(this.themeClass(el))
        })
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

              if (typeof op === 'object') {
                getClassStyle(op)
              } else {
                themeOptions[key] = self.themeData(op)
              }
            })
          }

          _.forEach(themeClassOptions, (item, key) => {
            if (typeof item === 'object') {
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

      options = _.merge(options, this.generateOptionsStyle(name), {
        enableScript: this.mod.enableScript
      })
      return options
    }
  },
  computed: {
    ...mapGetters({
      activeProperty: 'activeProperty',
      activeMod: 'activeMod',
      themeConf: 'themeConf',
      userSiteThemeConfigBySitePath: 'user/siteThemeConfigBySitePath'
    }),
    modData() {
      // use basic data as default to make sure the mod data is correct
      return _.merge({}, this.conf.properties, this.mod ? this.mod.data : {})
    }
  }
}
