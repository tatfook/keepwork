export default {
  props: {
    mod: Object,
    source: {
      type: Object,
      required: true
    },
    options: Object,
    editorMode: {
      type: Boolean,
      default: false
    }
  }
}
