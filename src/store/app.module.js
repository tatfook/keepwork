const state = () => ({
  modList: [],
  // layout: {
  //   header: {},
  //   footer: {},
  //   siderbar: {}
  // },
  theme: {
    name: 'classic',
    colorID: 0,
    fontID: 0
  }
})

const getters = {
  themeConf: state => state.theme,
  modList: state => state.modList
}

const actions = {}

const mutations = {}

export default {
  state,
  getters,
  actions,
  mutations
}
