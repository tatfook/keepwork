<script>
import compBaseMixin from '../comp.base.mixin'
import _ from 'lodash'

const renderTemplate = (h, m, data, parentIndex) => {
  data = data || m.properties.data
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

    if (!menuData.child) {
      return (
        <el-menu-item index={getIndexString(index)} style={m.options.itemStyle}>
          {menuData.name}
        </el-menu-item>
      )
    } else {
      return (
        <el-submenu index={getIndexString(index)} style={m.options.itemStyle}>
          <template slot="title">{menuData.name}</template>
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
        >
          {renderTemplate(h, this)}
        </el-menu>
      </div>
    )
  },
  mixins: [compBaseMixin],
  computed: {
    mode() {
      return this.options.mode
    }
  }
}
</script>

<style lang="scss" scoped>
.comp-menu {
  height: 100%;

  .el-menu {
    height: 100%;

    .el-menu-item {
      height: 100%;
      line-height: 50px;
    }
  }
}
.el-menu--horizontal {
  border: none;
}
</style>
<style>
.comp-menu .el-menu .el-submenu {
  height: 100%;
}

.comp-menu .el-menu .el-submenu .el-submenu__title {
  height: 100%;
  line-height: 50px;
}
</style>
