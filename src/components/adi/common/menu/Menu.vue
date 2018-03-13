<script>
import compBaseMixin from '../comp.base.mixin'
import _ from 'lodash'

const renderTemplate = (h, m) => {
  return (
    <div class="comp-menu">
      <el-menu
        mode={m.mode}
        background-color={m.options.menuBackground}
        text-color={m.options.fontColor}
        active-text-color={m.options.fontColor}
      >
        {_.map(m.data, menuData => {
          if (!menuData.child) {
            return (
              <el-menu-item style={m.options.itemStyle} index="1">
                {menuData.name}
              </el-menu-item>
            )
          } else {
            return (
              <el-submenu style={m.options.itemStyle} index="2">
                <template slot="title">{menuData.name}</template>
                {_.map(menuData.child, sMenuData => {
                  return <el-menu-item index="2">{sMenuData.name}</el-menu-item>
                })}
              </el-submenu>
            )
          }
        })}
      </el-menu>
    </div>
  )
}

export default {
  name: 'AdiMenu',
  render(h) {
    return renderTemplate(h, this)
  },
  mixins: [compBaseMixin],
  methods: {
    hasSubmenu(params) {
      return true
    }
  },
  computed: {
    mode() {
      return this.options.mode
    }
  },
  created() {
    console.log(this)
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
