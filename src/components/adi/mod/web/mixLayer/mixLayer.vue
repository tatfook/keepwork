<script>
import _ from 'lodash'
import baseMixin from '../../base/base.mixin'

export default {
  mixins: [baseMixin],
  created() {
    this.conf.styles[0].data['@media only screen and (max-width: 768px)'].title = {
      color: this.themeData('color_4')
    }
  }
}
</script>