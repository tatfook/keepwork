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

  return _.map(data, footerData => {
    index++

    if (footerData.child) {
      return (
        <div
          index={getIndexString(index)}
          style={m.options.itemStyle}
          class="footer-title"
        >
          <a
            target={
              m.properties.target ? m.properties.target : m.options.emptyTarget
            }
            href={footerData.link}
          >
            {m.isEmptyData ? m.$t(footerData.name) : footerData.name}
          </a>
          {renderTemplate(h, m, footerData.child, getIndexString(index))}
        </div>
      )
    } else {
      return (
        <div
          index={getIndexString(index)}
          style={m.options.itemStyle}
          class="footer-subtitle"
        >
          <a
            target={
              m.properties.target ? m.properties.target : m.options.emptyTarget
            }
            href={footerData.link}
          >
            {m.isEmptyData ? m.$t(footerData.name) : footerData.name}
          </a>
        </div>
      )
    }
  })
}

export default {
  name: 'AdiFooter',

  render(h) {
    return (
      <div class="comp-footer">
        <div
          background-color={this.options.footerBackground}
          style={
            'display:' +
            this.options.display +
            ';' +
            'justify-content:' +
            this.options.justifyContent +
            ';'
          }
        >
          {renderTemplate(h, this)}
        </div>
      </div>
    )
  },

  mixins: [compBaseMixin],

  computed: {
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
  display: block;
  text-decoration: none;
  color: unset;
}

.comp-footer {
  height: 100%;
  padding: 40px 0;
  font-weight: bold;
  a:hover {
    color: #1780dc;
  }
  .footer-title {
    padding: 0 20px;
  }
  .footer-title > a {
    padding-bottom: 10px;
  }
  .footer-subtitle {
    font-weight: normal;
  }
  .footer-subtitle > a {
    padding-top: 15px;
  }
}
</style>