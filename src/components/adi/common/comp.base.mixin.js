const compBaseMixin = {
  props: {
    source: {
      type: Object,
      required: true
    },
    editorMode: {
      type: Boolean,
      default: false
    },
    property: String,
    isActive: Boolean,
    isHidden: Boolean
  },
  methods: {
    editProperty() {
      this.$emit('editProperty', this.property)
    }
  }
}

export default compBaseMixin
