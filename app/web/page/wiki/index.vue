<script>
import Vue from 'vue'
import Vuex from 'vuex'
import router from './wiki.router'

router.beforeEach(async (to, from, next) => {
  if (to.name === 'redirectToPay') {
    const { app_name, additional, app_goods_id, username, price } = to.query
    let userObject = JSON.parse(additional)
    window.location.href = `${
      window.location.origin
    }/a/orderConfirm?type=1&payment=rmb&id=${app_goods_id}&user_nid=${
      userObject.user_nid
    }&username=${username}&price=${price}&app_name=${app_name}&goodsId=${app_goods_id}`
  }
})

export default {
  router
}
</script>
