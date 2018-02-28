<script>
import properties from './header.properties'
import styles from './header.styles'
import RenderTemplate from './header.templates'

export default {
  name: 'AdiHeader',
  props: {
    mod: {
      type: Object,
      default: () => {
        return properties
      }
    }
  },
  data() {
    return {
      styles
    }
  },
  render(h) {
    return RenderTemplate(h, this.styles[this.mod.styleID - 1], this.mod.data)
  },
  methods: {
    RenderTemplate
  }
}
</script>
