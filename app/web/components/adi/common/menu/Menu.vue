<script>
import compBaseMixin from '../comp.base.mixin'
import _ from 'lodash'

const renderTemplate = (h, m, data, parentIndex) => {
  data = data || m.data

  let index = 0

  function getIndexString(link, index, isSubIndex) {
    if (parentIndex) {
      let key = parentIndex + '-' + index
      m.setIndexLinks(key, link, parentIndex)
      return String(key)
    } else {
      m.setIndexLinks(index, link)
      return String(index)
    }
  }

  function getClass() {
    if (parentIndex != 1) {
      return 'footer-subtitle'
    } else {
      return 'footer-title'
    }
  }

  function isLinkValid(link) {
    let linkValidReg = /^(http:\/\/|https:\/\/)/
    return linkValidReg.test(link)
  }

  function getMenuItemStyle(link) {
    let nowPageLink = window.location.href
    return encodeURI(link) == nowPageLink
      ? `color: ${m.options.activeFontColor};`
      : ''
  }

  return _.map(data, menuData => {
    index++
    if (!parentIndex) {
      parentIndex = index
    }
    let isItemHasChild = menuData.child && menuData.child.length > 0
    if (m.options.type === 'menu' && !isItemHasChild) {
      return (
        <el-menu-item
          index={getIndexString(menuData.link, index)}
          style={parentIndex == 1 && m.itemStyle}
          title={m.getNameMenu(menuData)}
          onClick={() => m.handleMenuItemClick(menuData.link)}
        >
          {m.getNameMenu(menuData)}
        </el-menu-item>
      )
    } else if (m.options.type === 'menu' && isItemHasChild) {
      if (isLinkValid(menuData.link)) {
        return (
          <el-submenu
            popper-class="comp-submenu"
            index={getIndexString(menuData.link, index)}
            style={parentIndex == 1 && m.itemStyle}
          >
            <template slot="title">
              <a
                style={getMenuItemStyle(menuData.link)}
                target={m.menuTarget}
                href={menuData.link}
                title={m.getNameMenu(menuData)}
              >
                <a
                  href="javascript:void(0)"
                  class="el-submenu__icon-arrow el-icon-arrow-down mook-icon-arrow"
                />
                {m.getNameMenu(menuData)}
              </a>
            </template>
            {renderTemplate(
              h,
              m,
              menuData.child,
              getIndexString(menuData.link, index)
            )}
          </el-submenu>
        )
      } else {
        return (
          <el-submenu
            popper-class="comp-submenu"
            index={getIndexString(menuData.link, index)}
            style={parentIndex == 1 && m.itemStyle}
          >
            <template slot="title">
              <span
                class="menu-text"
                style={getMenuItemStyle(menuData.link)}
                title={m.getNameMenu(menuData)}
              >
                <i class="el-submenu__icon-arrow el-icon-arrow-down mook-icon-arrow" />
                {m.getNameMenu(menuData)}
              </span>
            </template>
            {renderTemplate(
              h,
              m,
              menuData.child,
              getIndexString(menuData.link, index)
            )}
          </el-submenu>
        )
      }
    } else if (m.options.type !== 'menu' && isItemHasChild) {
      return (
        <div
          index={getIndexString(menuData.link, index)}
          style={m.options.itemStyle}
          class={getClass()}
        >
          <a
            target={m.menuTarget}
            style={m.getItemStyle(parentIndex)}
            href={menuData.link}
            title={m.getNameMenu(menuData)}
          >
            {m.getNameMenu(menuData)}
          </a>
          {renderTemplate(
            h,
            m,
            menuData.child,
            getIndexString(menuData.link, index)
          )}
        </div>
      )
    } else {
      return (
        <div
          index={getIndexString(menuData.link, index)}
          style={m.options.itemStyle}
          class={getClass()}
        >
          <a
            target={m.menuTarget}
            style={m.getItemStyle(parentIndex)}
            href={menuData.link}
            title={m.getNameMenu(menuData)}
          >
            {m.getNameMenu(menuData)}
          </a>
        </div>
      )
    }
  })
}

export default {
  name: 'AdiMenu',
  render(h) {
    if (this.options.type === 'menu') {
      return (
        <div
          class={{
            'comp-menu-vertical': this.mode === 'vertical',
            'comp-menu-default-opened': this.isDefaultOpenAll === true,
            'comp-menu': true
          }}
        >
          <el-menu
            mode={this.mode}
            background-color={this.options.menuBackground}
            text-color={this.options.fontColor}
            active-text-color={this.options.activeFontColor}
            style={this.menuStyle}
            default-active={this.defaultActiveIndex}
            ref={this.menuRef}
          >
            {renderTemplate(h, this)}
          </el-menu>
        </div>
      )
    } else if (this.options.type === 'footer') {
      return (
        <div class="comp-footer">
          <div
            background-color={this.options.footerBackground}
            style={this.optionsStyle}
          >
            {renderTemplate(h, this)}
          </div>
        </div>
      )
    }
  },
  mixins: [compBaseMixin],
  data() {
    return {
      indexLinks: {},
      menuRef: 'memu' + Date.now(),
      defaultActiveIndex: undefined
    }
  },
  mounted() {
    this.setMenuOpend()
  },
  computed: {
    menuStyle() {
      return this.generateStyleString(this.options.menuStyle)
    },
    itemStyle() {
      return this.generateStyleString(this.options.itemStyle)
    },
    getItemTopStyle() {
      return this.generateStyleString({
        'font-size': this.options.itemTop
      })
    },
    getItemOtherStyle() {
      return this.generateStyleString({
        'font-size': this.options.itemOther
      })
    },
    mode() {
      return this.options.mode
    },
    isDefaultOpenAll() {
      return this.options.isDefaultOpenAll
    },
    data() {
      return this.properties.data
    },
    isEmptyData() {
      return this.properties.data.length != 0 ? false : true
    },
    menuTarget() {
      return this.properties.target
        ? this.properties.target
        : this.options.emptyLinkTarget
    },
    optionsStyle() {
      return (
        'display:' +
        this.options.display +
        ';' +
        'justify-content:' +
        this.options.justifyContent +
        ';'
      )
    }
  },
  methods: {
    getNameMenu(menuData) {
      return this.isEmptyData ? this.$t(menuData.name) : menuData.name
    },
    getItemStyle(parentIndex) {
      return parentIndex == 1 ? this.getItemTopStyle : this.getItemOtherStyle
    },
    openAll() {
      _.forEach(this.indexLinks, (indexLinkVal, key) => {
        let parentKey = indexLinkVal && indexLinkVal.parentIndex
        parentKey &&
          _.split(parentKey, '-').length > 1 &&
          this.$refs[this.menuRef].open(parentKey)
      })
    },
    setMenuOpend() {
      if (this.mode !== 'vertical') {
        return
      }
      if (this.isDefaultOpenAll) {
        this.openAll()
      }
      let nowPageLink = window.location.href
      let findedIndexLink = _.find(this.indexLinks, indexLinkObj => {
        return encodeURI(indexLinkObj.link) == nowPageLink
      })
      let parentKey = findedIndexLink && findedIndexLink.parentIndex
      parentKey &&
        _.split(parentKey, '-').length > 1 &&
        this.$refs[this.menuRef].open(parentKey)
      this.defaultActiveIndex = findedIndexLink && findedIndexLink.index
    },
    handleMenuItemClick(link) {
      !this.editMode && link && window.open(link, this.menuTarget)
    },
    setIndexLinks(key, link, parentIndex) {
      this.indexLinks[key] = {
        index: key,
        parentIndex,
        link
      }
    }
  }
}
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
  color: unset;
}
.el-menu--horizontal {
  .el-menu {
    .el-submenu {
      .el-submenu__title {
        //子菜单
        padding: 0;
        a {
          //子菜单文字与超链接
          display: inline-block;
          height: 100%;
          width: 100%;
          margin-left: -10px;
          padding-left: 10px;
          padding-right: 10px;
          margin-right: -10px;
          position: relative;
          z-index: 999;
        }
      }
    }
    .el-menu-item {
      padding: 0;
      a {
        display: inline-block;
        width: 100%;
        height: 100%;
        padding: 0 10px;
        position: relative;
        z-index: 999;
      }
    }
  }
}
.comp-menu {
  a {
    display: inline-block;
    height: 100%;
    position: relative;
    z-index: 999;
  }
  .menu-text {
    display: inline-block;
    height: 100%;
    position: relative;
    z-index: 999;
  }
  height: 100%;
  .el-menu {
    height: 100%;
    .el-menu-item {
      height: 100%;
      line-height: 50px;
      border: 0;
    }
  }
  .mook-icon-arrow {
    display: none;
  }
}
.comp-menu-vertical {
  a {
    display: block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .el-submenu__title {
    a {
      max-width: calc(100% - 14px);
    }
  }
  .menu-text {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 10px;
    box-sizing: border-box;
  }
}
.comp-menu-default-opened {
  a {
    overflow: unset;
    text-overflow: unset;
    word-break: break-word;
    display: inline-block;
    height: auto;
    white-space: normal;
    height: auto;
  }
  .menu-text {
    overflow: visible;
  }
  .el-menu {
    .el-menu-item {
      line-height: 1.2;
      padding-top: 4px;
      padding-bottom: 4px;
      min-width: unset;
    }
    .mook-icon-arrow {
      position: absolute;
      display: inline-block;
      right: auto;
      margin-left: 0;
      left: -16px;
      top: 2px;
      margin-top: 0;
    }
  }
  /deep/.el-submenu__title {
    height: auto;
    line-height: 1.1;
    padding-bottom: 2px;
    line-height: 1.2;
    padding-top: 4px;
    padding-bottom: 4px;
  }
  /deep/.el-submenu__icon-arrow {
    top: 0;
    margin-top: 7px;
    display: none;
  }
}
.el-menu--horizontal {
  border: none;
}
</style>

<style lang="scss">
.comp-menu {
  a {
    text-decoration: none;
    color: unset;
  }
  .el-menu {
    .el-submenu {
      height: 100%;
    }
    .el-submenu__title {
      i {
        margin-left: -20px;
        color: #909399;
      }
    }
  }
}
.comp-submenu .el-submenu .el-submenu__title .el-icon-arrow-right {
  color: #fff;
}
.comp-menu .el-menu--horizontal > .el-submenu .el-submenu__title {
  width: auto;
  line-height: 50px;
  border: 0;
  padding: 0;
  height: 50px;
}
.comp-menu .el-menu.el-menu--horizontal {
  border-bottom: none;
}
.comp-footer {
  height: 100%;
  padding: 40px 0;
  font-weight: bold;
  a {
    display: block;
    text-decoration: none;
    color: unset;
  }
  .footer-title {
    padding: 0 20px;
  }
  .footer-title > a {
    padding-bottom: 10px;
    line-height: 22px;
  }
  .footer-subtitle {
    font-weight: normal;
  }
  .footer-subtitle > a {
    padding-top: 15px;
    line-height: 22px;
  }
}

.el-menu--horizontal {
  border: 0;
}
</style>
