<script>
import compBaseMixin from '../comp.base.mixin'
import _ from 'lodash'

const renderTemplate = (h, m, data) => {
  data = data || m.data

  return _.map(data, menuData => {
    return (
      <el-breadcrumb-item>
        <a target={m.getTarget} href={menuData.link}>
          {m.isEmptyData ? m.$t(menuData.name) : menuData.name}
        </a>
      </el-breadcrumb-item>
    )
  })
}

export default {
  name: 'AdiBreadCrumb',
  render(h) {
    return (
      <div class="comp-breadCrumb">
        <el-breadcrumb style={this.getStyle} separator="/">
          {renderTemplate(h, this)}
        </el-breadcrumb>
      </div>
    )
  },
  mixins: [compBaseMixin],
  methods: {},
  computed: {
    data() {
      return this.properties.data
    },
    isEmptyData() {
      return this.properties.data.length != 0 ? false : true
    },
    getTarget() {
      return this.properties.target
        ? this.properties.target
        : this.options.emptyTarget
    },
    getStyle() {
      return this.generateStyleString({
        'font-size': this.options.fontSize,
        color: this.options.fontColor
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.comp-breadCrumb {
  a {
    padding: 6px;
    color: unset;
    text-decoration: none;
    font-weight: normal;
  }
}
</style>

<style lang="scss">
.comp-breadCrumb {
  .el-breadcrumb__inner {
    color: unset;
  }
  .el-breadcrumb__separator {
    color: unset;
  }
}
</style>
