import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
let state = {
    login_flag: false,
    uid: '',
    url: 'http://120.77.147.48:3000/api'
}
let mutations = {
    setUID(state, uid) {
        state.uid = uid
    },
    setLogin_flag(state, login_flag) {
        state.login_flag = login_flag
    }
}
const store = new Vuex.Store({
    state,
    mutations
})

export default store