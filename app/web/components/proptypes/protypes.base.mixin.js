export default {
  props: {
    cardValue: Object,
    cardKey: String,
    editingKey: String,
    optionsData: Object,
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
