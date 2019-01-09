<script>
import { locale } from '@/lib/utils/i18n'
import { upperFirst } from 'lodash'
export default {
  computed: {
    isEn() {
      return locale === 'en-US'
    },
    unitTable() {
      return this.isEn
        ? {
            rmb: '￥',
            coin: ' coins',
            bean: ' beans'
          }
        : {
            rmb: '￥',
            coin: '知识币',
            bean: '知识豆'
          }
    },
    costUnit() {
      return this.unitTable[this.payment]
    }
  }
}
</script>
