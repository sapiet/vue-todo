import Vue from 'vue'
import VueResource from 'vue-resource';
import Vuex from 'vuex';

Vue.config.productionTip = false;

Vue.use(VueResource);
Vue.use(Vuex);

new Vue({
  render: h => h(require('./App').default),
}).$mount('#app')
