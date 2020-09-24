import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import Alert from "@/components/common/Alert.vue";
import Button from "@/components/common/Button.vue";

Vue.config.productionTip = false
Vue.component('Alert', Alert);
Vue.component('Button', Button);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
