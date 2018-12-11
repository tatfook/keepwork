import Vue from 'vue'
import vueAxios from 'vue-axios'
import VueAuthenticate from 'vue-authenticate'
import axios from 'axios'
import Cookies from 'js-cookie'
Vue.use(vueAxios, axios)
let popupOptions = {
  width: 900,
  height: 545
}

let baseUrl = process.env.KEEPWORK_API_PREFIX

Vue.use(VueAuthenticate, {
  bindRequestInterceptor() {
    this.$http.interceptors.request.use((config) => {
      config.headers.Authorization = [
        'Bearer', Cookies.get('token')
      ].join(' ')
      return config
    })
  },
  providers: {
    qq: {
      name: 'qq',
      oauthType: '2.0',
      authorizationEndpoint: 'https://graph.qq.com/oauth2.0/authorize',
      scope: ['get_user_info'],
      clientId: '101403344',
      url: baseUrl + 'oauth_users/qq',
      redirectUri: `${window.location.origin}/wiki/login`,
      // clientId: '101403344',
      // url: 'http://10.27.3.3:8081/api/v0/oauth_users/qq',
      // redirectUri: 'http://127.0.0.1:7001',
      popupOptions
    },
    weixin: {
      name: 'weixin',
      oauthType: '2.0',
      authorizationEndpoint: 'https://open.weixin.qq.com/connect/qrconnect',
      appid: 'wxc97e44ce7c18725e',
      clientId: 'wxc97e44ce7c18725e',
      url: baseUrl + 'oauth_users/weixin',
      redirectUri: `${window.location.origin}/wiki/login`,
      // clientId: 'wxc97e44ce7c18725e',
      // url: 'http://10.27.3.3:8081/api/v0/oauth_users/weixin',
      // redirectUri: 'http://127.0.0.1:7001',
      popupOptions,
      scope: 'snsapi_login',
      requiredUrlParams: ['scope', 'appid', 'state'],
      state: 'weixin'
    },
    xinlangweibo: {
      name: 'xinlangweibo',
      authorizationEndpoint: 'https://api.weibo.com/oauth2/authorize',
      clientId: '2411934420',
      url: baseUrl + 'oauth_users/xinlang',
      redirectUri: `${window.location.origin}/wiki/login`,
      // clientId: '2411934420',
      // url: 'http://10.27.3.3:8081/api/v0/oauth_users/xinlang',
      // redirectUri: 'http://127.0.0.1:7001',
      oauthType: '2.0',
      popupOptions
    },
    github: {
      name: 'github',
      scope: ['user:email'],
      clientId: '2219fe9cb6d105dd30fb',
      url: baseUrl + 'oauth_users/github',
      redirectUri: `${window.location.origin}/wiki/login`
      // clientId: '2219fe9cb6d105dd30fb',
      // url: 'http://10.27.3.3:8081/api/v0/oauth_users/github',
      // redirectUri: 'http://127.0.0.1:7001'
    }
  }
})
