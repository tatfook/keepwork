export default {
  props: {
    editingKey: String,
    originValue: String,
    activePropertyOptions: Object
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
