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
        >
          <a target={m.menuTarget} href={menuData.link}>
            {m.getNameMenu(menuData)}
          </a>
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
              >
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
              <span class="menu-text" style={getMenuItemStyle(menuData.link)}>
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
        <div class="comp-menu">
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
    setMenuOpend() {
      if (this.mode !== 'vertical') {
        return
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
    padding-left: 40px;
    padding-right: 40px;
    position: relative;
    z-index: 999;
  }
  .menu-text {
    display: inline-block;
    height: 100%;
    padding-left: 40px;
    padding-right: 40px;
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
      padding: 0;
    }
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
        color: #ccc;
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
