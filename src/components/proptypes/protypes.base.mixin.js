export default {
  props: {
    editingKey: String,
    originValue: String
  },
  data() {
    return {}
  },
  computed: {
    placeholder() {
      return this.editingKey ? this.editingKey : ''
    },
    inputTypeValue: {
      get() {
        return this.originValue
      },
      set() {}
    }
  }
}
