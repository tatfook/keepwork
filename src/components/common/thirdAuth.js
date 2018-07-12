import Vue from 'vue'
import vueAxios from 'vue-axios'
import VueAuthenticate from 'vue-authenticate'
import axios from 'axios'
Vue.use(vueAxios, axios)
let popupOptions = {
  width: 900,
  height: 545
}
Vue.use(VueAuthenticate, {
  providers: {
    qq: {
      name: 'qq',
      oauthType: '2.0',
      authorizationEndpoint: 'https://graph.qq.com/oauth2.0/authorize',
      scope: ['get_user_info'],
      clientId: '101403344',
      url: `${window.location.origin}/api/wiki/auth/qq`,
      redirectUri: `${window.location.origin}/api/wiki/auth/qq`,
      popupOptions: popupOptions
    },
    weixin: {
      name: 'weixin',
      oauthType: '2.0',
      authorizationEndpoint: 'https://open.weixin.qq.com/connect/qrconnect',
      clientId: 'wxc97e44ce7c18725e',
      appid: 'wxc97e44ce7c18725e',
      redirectUri: `${window.location.origin}/api/wiki/auth/weixin`,
      url: `${window.location.origin}/api/wiki/auth/weixin`,
      popupOptions: popupOptions,
      scope: 'snsapi_login',
      requiredUrlParams: ['scope', 'appid', 'state'],
      state: 'weixin'
    },
    xinlangweibo: {
      name: 'xinlangweibo',
      authorizationEndpoint: 'https://api.weibo.com/oauth2/authorize',
      clientId: '2411934420',
      redirectUri: `${window.location.origin}/api/wiki/auth/xinlangweibo`,
      url: `${window.location.origin}/api/wiki/auth/xinlangweibo`,
      oauthType: '2.0',
      popupOptions: popupOptions
    },
    github: {
      name: 'github',
      clientId: '2219fe9cb6d105dd30fb',
      scope: ['user:email'],
      url: `${window.location.origin}/api/wiki/auth/github`,
      redirectUri: `${window.location.origin}/api/wiki/auth/github`
    }
  }
})
