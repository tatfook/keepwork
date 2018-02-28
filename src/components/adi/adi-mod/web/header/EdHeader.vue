
<script>
import properties from './header.properties'
import RenderTemplate from './header.templates'

export default {
  name: 'AdiHeader',
  props: {
    modData: {
      type: Object,
      default: () => {
        return properties
      }
    }
  },
  components: {
    // Menu
  },
  data () {
    return {

    }
  },
  created () {
    console.log(this.modData)
  },
  render(h) {
    return RenderTemplate(h, this.modData)
  },
  methods: {
    RenderTemplate
  }
}
</script>
