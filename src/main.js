
window.$ = window.jQuery = require('jquery')

import 'core-js/stable'
import Vue from 'vue'
import App from './App'
import router from './router'
import CoreuiVue from '@coreui/vue'
import { iconsSet as icons } from './assets/icons/icons.js'
import store from './store/index'
import axios from 'axios'
import VueTheMask from 'vue-the-mask'
import VueMoney from 'v-money';
import vSelect from 'vue-select';
import {formatForCalc, formatMoney} from './components/auxiliar';

const http = axios.create({
    baseURL: 'http://localhost:8000/'
})

Vue.http = Vue.prototype.$http = http
Vue.formatForCalc = Vue.prototype.$formatForCalc = formatForCalc
Vue.formatMoney = Vue.prototype.$formatMoney = formatMoney

Vue.config.performance = true
Vue.component("v-select", vSelect);
Vue.use(VueMoney, {decimal: ',', thousands: '.', prefix: '', suffix: '', precision: 2});
Vue.use(VueTheMask)
Vue.use(CoreuiVue)
Vue.prototype.$log = console.log.bind(console)

new Vue({
    el: '#app',
    router,
    store,
    icons,
    template: '<App/>',
    components: {
        App
    }
})
