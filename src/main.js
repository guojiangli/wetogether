import Vue from 'vue'
import App from './App.vue'
import './assets/weui.min.css'
import service from '@/utils/service'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
