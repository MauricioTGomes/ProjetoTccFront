import storage from './services'

const state = {
    check: false,
    user: storage.getObject('user'),
    token: null
}

const mutations = {
    SET_USER_TOKEN(state, data) {
        state.user = data.user
        state.check = true
        state.token = data.access_token
    },
    SET_LOGOUT(state) {
        state.user = {}
        state.check = false
        state.token = null
    }
}

const actions = {
    setUserToken(context, data) {
        context.commit('SET_USER_TOKEN', data)  
    },
    logout(context) {
        context.commit('SET_LOGOUT')  
    }
};

export default {
    state,
    mutations,
    actions
}
