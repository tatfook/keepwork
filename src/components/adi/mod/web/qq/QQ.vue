<script>
import _ from 'lodash'
import baseMixin from '../../base/base.mixin'

export default {
  mixins: [baseMixin],
  methods: {
    compWrapperOptions(name) {
      let options = {}

      options = _.merge(options, this.generateOptionsStyle(name))

      let qqUrl =
        'http://wpa.qq.com/msgrd?v=3&uin=' +
        this.modData.qq.number +
        '&site=qq&menu=yes'

      if (this.modData.qq.number == null) {
        this.modData.pic.link = ''
      } else {
        this.modData.pic.link = qqUrl
      }

      if (this.modData.styleID == '1') {
        return _.merge(
          {},
          options,
          (this.modData.pic.src = './static/adi/qq/qqModSecond.png')
        )
      } else {
        return options
      }
    }
  }
}
</script>