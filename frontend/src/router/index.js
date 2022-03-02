import Vue from 'vue'
import VueRouter from 'vue-router'
import Store from '../store/index.js'

// import Container
import Container from '../views/containers/Container.vue';
// import Dashboard
import Dashboard from '../views/Dashboard.vue';
// import pages
import Dealership from '../views/pages/dealership/Dealership.vue';
import Clients from '../views/pages/clients/Clients.vue';
import Inventory from '../views/pages/inventory/Inventory.vue';
import Lists from '../views/pages/lists/Lists.vue';
import Transactions from '../views/pages/transactions/Transactions.vue';
import ConfirmVehicleLocation from '../views/pages/location/ConfirmVehicleLocation.vue';
// import auth pages
import Login from '../views/pages/authentication/Login.vue';
import Register from '../views/pages/authentication/Register.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
    name: 'Home',
    component: Container,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
          authRequired: true
        }
      },
      {
        path: 'dealership',
        name: 'Dealership',
        component: Dealership,
        meta: {
          authRequired: true
        }
      },
      {
        path: 'clients',
        name: 'Clients',
        component: Clients,
        meta: {
          authRequired: true
        }
      },
      {
        path: 'inventory',
        name: 'Inventory',
        component: Inventory,
        meta: {
          authRequired: true
        }
      },
      {
        path: 'lists',
        name: 'Lists',
        component: Lists,
        meta: {
          authRequired: true
        }
      },
      {
        path: 'transactions',
        name: 'Transactions',
        component: Transactions,
        meta: {
          authRequired: true
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      unAuthRequired: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      unAuthRequired: true
    }
  },
  {
    path: '/confirm-vehicle-location/vehicle/:vehicleId',
    name: 'ConfirmVehicleLocation',
    component: ConfirmVehicleLocation,
    meta: {
      authRequired: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  // verify the state of the logged in user
  await Store.dispatch('verify');

  // add the meta tag "authRequired: true" to any routes you want protected
  if (to.meta.authRequired && !Store.state.token) {
    next('/login');
  }

  // add the meta tag "unAuthRequired: true" to any routes which requires the user
  // to be logged out to access
  else if (to.meta.unAuthRequired && Store.state.token) {
    next('/dashboard');
  }

  else {
    next();
  }
})

export default router
