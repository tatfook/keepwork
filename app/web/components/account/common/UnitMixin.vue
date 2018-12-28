<script>
import { locale } from '@/lib/utils/i18n'
export default {
  computed: {
    isEn() {
      return locale === 'en-US'
    },
    unitTable() {
      return this.isEn
        ? {
            rmb: '￥',
            coin: 'coin',
            bean: 'bean'
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
