import Vue from 'vue'
import App from './App.vue'
import MintUI from 'mint-ui'
import Vant from 'vant'
import router from './router'
import store from './store'
import 'mint-ui/lib/style.css'
import 'vant/lib/index.css'

Vue.use(MintUI)
Vue.use(Vant)
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
