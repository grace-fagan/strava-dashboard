import { createStore } from 'vuex'

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
    }
})

export default store;