<script>
import Vue from 'vue'
import Vuex from 'vuex'
import router from './wiki.router'

router.beforeEach(async (to, from, next) => {
  if (to.name === 'redirectToPay') {
    const { additional, app_goods_id, username } = to.query
    let userObject = JSON.parse(additional)
    window.location.href = `${window.location.origin}/a/orderConfirm?type=1&payment=rmb&id=${app_goods_id}&user_nid=${userObject.user_nid}&username=${username}`
  }
})

export default {
  router
}
</script>
