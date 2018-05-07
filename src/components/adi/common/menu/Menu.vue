<script>
import compBaseMixin from '../comp.base.mixin'
import _ from 'lodash'

const renderTemplate = (h, m, data, parentIndex) => {
  data = data || m.data

  let index = 0

  function getIndexString(index, isSubIndex) {
    if (parentIndex) {
      return String(parentIndex + '-' + index)
    } else {
      return String(index)
    }
  }

  return _.map(data, menuData => {
    index++

    if (!parentIndex) {
      parentIndex = index
    }

    if (!menuData.child) {
      return (
        <el-menu-item
          index={getIndexString(index)}
          style={parentIndex == 1 && m.itemStyle}
        >
          <a
            target={
              m.properties.target ? m.properties.target : m.options.emptyTarget
            }
            href={menuData.link}
          >
            {m.isEmptyData ? m.$t(menuData.name) : menuData.name}
          </a>
        </el-menu-item>
      )
    } else {
      return (
        <el-submenu
          index={getIndexString(index)}
          style={parentIndex == 1 && m.itemStyle}
        >
          <template slot="title">
            <a
              target={
                m.properties.target
                  ? m.properties.target
                  : m.options.emptyTarget
              }
              href={menuData.link}
            >
              {m.isEmptyData ? m.$t(menuData.name) : menuData.name}
            </a>
          </template>
          {renderTemplate(h, m, menuData.child, getIndexString(index))}
        </el-submenu>
      )
    }
  })
}

export default {
  name: 'AdiMenu',
  render(h) {
    return (
      <div class="comp-menu">
        <el-menu
          mode={this.mode}
          background-color={this.options.menuBackground}
          text-color={this.options.fontColor}
          active-text-color={this.options.fontColor}
          style={this.menuStyle}
        >
          {renderTemplate(h, this)}
        </el-menu>
      </div>
    )
  },
  mixins: [compBaseMixin],
  computed: {
    menuStyle() {
      return this.generateStyleString(this.options.menuStyle)
    },
    itemStyle() {
      return this.generateStyleString(this.options.itemStyle)
    },
    mode() {
      return this.options.mode
    },
    data() {
      return this.properties.data
    },
    isEmptyData() {
      return this.properties.data.length != 0 ? false : true
    }
  }
}
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
  color: unset;
}

.comp-menu {
  height: 100%;

  .el-menu {
    height: 100%;

    .el-menu-item {
      height: 100%;
      line-height: 50px;
      border: 0;
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
      height: 100%;
      line-height: 50px;
      border: 0;
    }
  }
}

.el-menu--horizontal {
  border: 0;
}
</style>