import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBIxuwl_UvG82QNQo3vBKcV3ivXIrL3tJU",
//   authDomain: "autotracks-949d5.firebaseapp.com",
//   projectId: "autotracks-949d5",
//   storageBucket: "autotracks-949d5.appspot.com",
//   messagingSenderId: "343270840082",
//   appId: "1:343270840082:web:177524de03c88c11e445cb"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
