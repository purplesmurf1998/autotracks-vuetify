import Vue from 'vue'
import VueRouter from 'vue-router'
import Store from '../store/index.js'

// import Container
import Container from '../views/containers/Container.vue';
// import Dashboard
import Dashboard from '../views/Dashboard.vue';
// import pages
import Dealership from '../views/pages/dealership/Dealership.vue';
import Accounts from '../views/pages/accounts/Accounts.vue';
import Properties from '../views/pages/properties/Properties';
import Zones from '../views/pages/zones/Zones';
import Roles from '../views/pages/roles/Roles';
import Inventory from '../views/pages/inventory/Inventory.vue';
import Subscriptions from '../views/pages/subscriptions/Subscriptions.vue';
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
        path: 'accounts',
        name: 'Accounts',
        component: Accounts,
        meta: {
          authRequired: true
        }
      },
      {
        path: 'subscriptions',
        name: 'Subscriptions',
        component: Subscriptions,
        meta: {
          authRequired: true
        }
      },
      {
        path: 'properties',
        name: 'Properties',
        component: Properties,
        meta: {
          authRequired: true
        }
      },
      {
        path: 'zones',
        name: 'Zones',
        component: Zones,
        meta: {
          authRequired: true
        }
      },
      {
        path: 'roles',
        name: 'Roles',
        component: Roles,
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
