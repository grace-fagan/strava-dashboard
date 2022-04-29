import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

const store = createStore({
  state: {
    userAccess: null,
    userActivities: null,
    selectedRun: null
  },
  mutations: {
    setUserAccess (state, userAccess) {
      state.userAccess = userAccess
    },
    setUserActivities (state, userActivities) {
      state.userActivities = userActivities
    },
    selectRun (state, selectedRun) {
      state.selectedRun = selectedRun
    },
    deselectRun (state) {
      state.selectedRun = null
    }
  },
  plugins: [createPersistedState()]
})

export default store
