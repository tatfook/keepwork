<script>
import _ from 'lodash'
import baseMixin from '../../base/base.mixin'

export default {
  mixins: [baseMixin],
  created() {
    let mixLayerArrColor = { color: this.themeData('color_4') }
    let self = this
    function responsiveMode(index) {
      return self.conf.styles[index].data[
        '@media only screen and (max-width: 768px)'
      ]
    }
    for (let i = 0; i < 9; i++) {
      responsiveMode(i).title = mixLayerArrColor
      responsiveMode(i).subtitle = mixLayerArrColor
      responsiveMode(i).paragraph = mixLayerArrColor
    }
  }
}
</script>