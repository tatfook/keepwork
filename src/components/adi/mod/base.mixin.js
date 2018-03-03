import { mapGetters } from 'vuex'

const modBaseMixin = {
  props: {
    mod: Object,
    editMode: Boolean
  },
  render(h) {
    return this.renderStyle(h, this, this.mod.styleID - 1)
  },
  methods: {
    onEditProperty(property) {
      this.$store.dispatch('setActiveProperty', {
        mod: this.mod,
        property: property
      })
    },
    isChildActive(property) {
      return this.mod.isActive && property === this.activeProperty
    },
    childData(property) {
      return this.mod.data[property].data
    },
    childComponentType(property) {
      return this.mod.data[property].componentType
    }
  },
  computed: {
    ...mapGetters({
      activeProperty: 'activeProperty'
    })
  }
}

export default modBaseMixin
