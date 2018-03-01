<script>
import properties from './header.properties'
import styles from './header.styles'
import RenderTemplate from './header.templates'
import { mapGetters } from 'vuex'

export default {
  name: 'AdiHeader',
  props: {
    mod: {
      type: Object,
      default: properties
    },
    editMode: Boolean
  },
  data() {
    return {
      styles
    }
  },
  render(h) {
    return RenderTemplate(h, this.styles[this.mod.styleID - 1], this)
  },
  methods: {
    RenderTemplate,
    onEditProperty(property) {
      this.$store.dispatch('setActiveProperty', {
        mod: this.mod,
        property: property
      })
    },
    isChildActive(property) {
      return this.mod.isActive && property === this.activeProperty
    }
  },
  computed: {
    ...mapGetters({
      activeProperty: 'activeProperty'
    }),
    menuData() {
      return this.mod.data.menu
    },
    mediaData() {
      return this.mod.data.media
    }
  }
}
</script>
<style lang="scss" scoped>
.kp-header-media {
  width: 20%;
  min-width: 30px;
  margin: auto;
}
</style>

