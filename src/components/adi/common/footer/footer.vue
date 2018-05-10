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

  function getClass() {
    if (parentIndex != 1) {
      return 'footer-subtitle'
    } else {
      return 'footer-title'
    }
  }

  return _.map(data, footerData => {
    index++

    if (!parentIndex) {
      parentIndex = index
    }

    if (footerData.child) {
      return (
        <div
          index={getIndexString(index)}
          style={m.options.itemStyle}
          class={getClass()}
        >
          <a
            target={
              m.properties.target ? m.properties.target : m.options.emptyTarget
            }
            style={parentIndex == 1 ? m.getItemTopStyle : m.getItemOtherStyle}
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
          class={getClass()}
        >
          <a
            target={
              m.properties.target ? m.properties.target : m.options.emptyTarget
            }
            style={parentIndex == 1 ? m.getItemTopStyle : m.getItemOtherStyle}
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
    }
  }
}
</script>

<style lang="scss">
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
</style>