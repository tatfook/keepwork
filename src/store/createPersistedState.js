import vuexCreatePersistedState from 'vuex-persistedstate'

const createPersistedState = config => {
  let vuexPersistedStateKey = `vuex@${process.env.BUILD_VERSION}`

  // clean localStorage outdated cache
  for (let key in localStorage) {
    /^vuex/.test(key) && key !== vuexPersistedStateKey && localStorage.removeItem(key)
  }

  return vuexCreatePersistedState({
    key: vuexPersistedStateKey,
    ...config
  })
}

export default createPersistedState
