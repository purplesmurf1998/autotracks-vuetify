import Vue from 'vue'
import VueRouter from 'vue-router'

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
        component: Dashboard
      },
      {
        path: 'dealership',
        name: 'Dealership',
        component: Dealership
      },
      {
        path: 'clients',
        name: 'Clients',
        component: Clients
      },
      {
        path: 'inventory',
        name: 'Inventory',
        component: Inventory
      },
      {
        path: 'lists',
        name: 'Lists',
        component: Lists
      },
      {
        path: 'transactions',
        name: 'Transactions',
        component: Transactions
      }
    ]
  },
  {
    path: '/confirm-vehicle-location/vehicle/:vehicleId',
    name: 'ConfirmVehicleLocation',
    component: ConfirmVehicleLocation
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
