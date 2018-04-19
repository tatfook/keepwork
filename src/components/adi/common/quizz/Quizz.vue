<template>

</template>

<script>
import compBaseMixin from '../comp.base.mixin'

export default {
  name: 'AdiQuizz',
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


