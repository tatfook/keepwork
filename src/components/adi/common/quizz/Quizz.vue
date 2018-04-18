<script>
import compBaseMixin from '../comp.base.mixin'
import _ from 'lodash'

export default {
  name: 'AdiQizz',
  render(h) {
    let self = this

    return (
      <div class="comp-quizz">
        {(() => {
          if (self.properties.data) {

          } else {
            if(!self.properties.data && self.editMode) {
              return <div class="mx-client-start">Click Open Quizz Editor</div>
            } else {
              return <div></div>
            }
          }
        })()}
      </div>
    )
  },
  mixins: [compBaseMixin],
  computed: {
    mode() {
      return this.options.mode
    }
  }
}
</script>


