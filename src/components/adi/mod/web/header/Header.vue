<script>
import renderStyle from './header.styles'
import modBaseMixin from '@/components/adi/mod/base.mixin'

export default {
  name: 'AdiHeader',
  mixins: [modBaseMixin],
  methods: {
    renderStyle
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

