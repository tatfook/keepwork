<script>
import compBaseMixin from '../comp.base.mixin'
import _ from 'lodash'

const renderTemplate = (h, m, data) => {
  data = data || m.data

  return _.map(data, menuData => {
    return (
      <el-breadcrumb-item>
        <a
          target={m.getTarget}
          href={menuData.link}
          onmouseover={m.onmouseover}
          onmouseout={m.onmouseout}
        >
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
    },
    onmouseover() {
      return (
        'this.style.color=' +
        "'" +
        this.options.color +
        "';" +
        'this.style.backgroundColor=' +
        "'" +
        this.options.backgroundColor +
        "';" +
        'this.style.borderBottomColor=' +
        "'" +
        this.options.borderBottomColor +
        "'"
      )
    },
    onmouseout() {
      return "this.style.color='unset';this.style.backgroundColor='unset';this.style.borderBottomColor='unset'"
    }
  }
}
</script>

<style lang="scss" scoped>
.comp-breadCrumb {
  .el-breadcrumb {
    .el-breadcrumb__item {
      height: 64px;
      display: flex;
      align-items: center;
    }
  }
  a {
    height: 60px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    color: unset;
    text-decoration: none;
    text-align: center;
    font-weight: normal;
  }
  a:hover {
    border-bottom-width: 4px;
    border-bottom-style: solid;
  }
}
</style>

<style lang="scss">
.comp-breadCrumb {
  .el-breadcrumb__inner,
  .el-breadcrumb__separator {
    height: 100%;
    display: flex;
    align-items: center;
    color: unset;
  }
}
</style>
