import VueSocketIO from 'vue-socket.io'
import Cookies from 'js-cookie'
import jsrsasign from 'jsrsasign'

const token = Cookies.get('token') || ''
let userId = ''
try {
  if (token) {
    const jwtInfo = jsrsasign.KJUR.jws.JWS.readSafeJSONString(
      jsrsasign.b64utoutf8(token.split('.')[1])
    )
    userId = jwtInfo.userId
  }
} catch (error) {
  console.error(error)
}
const debugMode = ['release', 'stage'].some(env => process.env.SOCKET_API_PREFIX.includes(env))

export const socket = new VueSocketIO({
  debug: debugMode,
  connection: process.env.SOCKET_API_PREFIX,
  options: {
    query: {
      token,
      userId
    },
    transports: ['websocket']
  }
})

export const socketMixin = {
  data() {
    return {
      socketMessage: ''
    }
  },
  sockets: {
    connect() {
      console.warn('socket connect 💡')
    },
    async broadcast(data) {
      this.socketMessage = data
    },
    async msg(data) {
      this.socketMessage = data
    }
  }
}
