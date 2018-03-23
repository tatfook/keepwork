export default {
  props: {
    editingKey: String
  },
  data() {
    return {
      inputTypeValue: ''
    }
  },
  computed: {
    placeholder() {
      return this.editingKey ? this.editingKey : ''
    }
  }
}
