<script>
import styles from './header.styles'
import templates from './header.templates'
import modBaseMixin from '@/components/adi/mod/mod.base.mixin'

export default {
  name: 'AdiHeader',
  mixins: [modBaseMixin],
  data() {
    return {
      styles,
      templates
    }
  }
}
</script>
