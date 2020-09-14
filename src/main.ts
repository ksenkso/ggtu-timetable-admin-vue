import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import Alert from "@/components/common/Alert.vue";

Vue.config.productionTip = false
Vue.component('Alert', Alert);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
