import { createStore } from 'vuex'
import createPersistedState from "vuex-persistedstate";

const store = createStore({
    state: {
        userAccess: null,
        userActivities: null
    },
    mutations: {
        setUserAccess(state, userAccess) {
            state.userAccess = userAccess;
        },
        setUserActivities(state, userActivities) {
            state.userActivities = userActivities;
        },
    },
    plugins: [createPersistedState()],
})

export default store;