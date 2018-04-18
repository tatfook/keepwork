<script>
import _ from 'lodash'
import baseMixin from '../../base/base.mixin'

export default {
  mixins: [baseMixin],
  methods: {
    compWrapperOptions(name) {
      let options = {}

      options = _.merge(options, this.generateOptionsStyle(name))

      if (this.modData.styleID == '3' || this.modData.styleID == '4') {
        return _.merge(
          {},
          options,
          (this.modData.media.src = './static/adi/mixPosition/stitching.png')
        )
      } else {
        return options
      }
    }
  }
}
</script>

<style>
  video {
    height: 200px;
  }
</style>
