import _ from 'lodash'

export default {
  props: {
    source: Object,
    options: Object,
    editorMode: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    properties() {
      return this.source
    }
  },
  methods: {
    generateStyleString(style) {
      let string = ''

      _.forEach(style, (value, key) => {
        string = string + key + ':' + value + ';'
      })

      return string
    },
    px2rem(px) {
      let rem = 100

      return parseInt(px) / rem + 'rem'
    }
  }
}
