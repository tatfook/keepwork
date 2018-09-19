export default {
  props: {
    cardValue: Object,
    editingKey: String,
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
