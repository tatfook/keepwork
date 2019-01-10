<script>
export default {
  methods: {
    getDiscountMessage(discount) {
      let payment = ''
      if (discount.rmb) {
        payment = 'rmb'
      }
      if (discount.coin) {
        payment = 'coin'
      }
      if (discount.bean) {
        payment = 'bean'
      }
      let count = discount.rewardRmb || discount.rewardCoin || this.rewardBean
      return `${this.$t('account.returnOneCoupon')}${this.$t(`account.${payment}Unit`, {
        money: count
      })}`
    }
  }
}
</script>
