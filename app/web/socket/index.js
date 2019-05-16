import VueSocketIO from 'vue-socket.io'

export const socket = new VueSocketIO({
  debug: true,
  connection: 'https://socket.keepwork.com/',
  options: {
    query: {
    },
    transports: ['websocket']
  }
})

export const pageMixin = {
  sockets: {
    connect() {
      console.warn('sockets connect 💡')
    },
    broadcast(data) {
      console.warn(data)
    }
  }
}