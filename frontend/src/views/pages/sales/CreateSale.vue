<template>
  <div style="height: 100%">
    <v-card flat style="height: 100%">
      <v-toolbar
        color="grey lighten-4"
        extension-height="50"
        extended
        flat
        class="top-toolbar"
      >
        <v-toolbar-title>Creating a sale transaction</v-toolbar-title>
      </v-toolbar>
      <v-card width="90%" class="mx-auto" style="margin-top: -53px">
        <v-btn text class="my-2 ml-2" @click="goBack">
          <v-icon class="mr-2">mdi-arrow-left-top</v-icon>
          Go Back
        </v-btn>
        <v-divider />
        <v-card-text v-if="!loading">
          <!-- <p class="mb-0 black--text">Creating a sale transaction for the following vehicle</p>
          <p class="mb-0">VIN: {{ vehicle.vin }}</p>
          <p class="mb-0">DATE ADDED: {{ vehicle.date_added.substring(0, 10) }}</p> -->
          <v-responsive max-width="500" class="mx-auto">
            <v-form class="mt-2">
              <v-text-field
                v-model="vehicle.vin" 
                label="Vehicle VIN"
                dense
                outlined
                append-icon="mdi-shield-lock"
                disabled
              />
              <v-select 
                label="Sales Representative"
                :items="staff"
                v-model="salesRep"
                dense
                outlined
                append-icon="mdi-account"
              />
              <v-text-field 
                label="Deposit Amount"
                v-model="depositAmount"
                dense
                outlined
                type="number"
                append-icon="mdi-currency-usd"
              />
              <v-select 
                v-if="!isAuthorized('approve_vehicle_sale')"
                label="Approval Request"
                v-model="requested_approval"
                :items="requestees"
                dense
                outlined
                append-icon="mdi-account-check"
              />
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                :return-value.sync="date"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="date"
                    :label="isAuthorized('approve_vehicle_sale') ? 'Date Sold' : 'Request Date'"
                    append-icon="mdi-calendar"
                    readonly
                    dense
                    outlined
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="date"
                  no-title
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="primary"
                    @click="menu = false"
                  >
                    Cancel
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.menu.save(date)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
              <v-row class="ma-0">
                <v-btn color="primary" v-if="isAuthorized('approve_vehicle_sale')">Create Sale Transaction</v-btn>
                <v-btn color="primary" v-if="!isAuthorized('approve_vehicle_sale')">Request Sale Approval</v-btn>
              </v-row>
            </v-form>
          </v-responsive>
        </v-card-text>
      </v-card>
    </v-card>
  </div>
</template>

<script>
import axios from "axios"
const { hasPermissions } = require("@/utils/index");

export default {
  name: 'CreateSale',

  data: () => ({
    vehicle: null,
    staff: null,
    requestees: null,
    loading: true,
    menu: false,
    date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
    salesRep: null,
    depositAmount: null,
    requested_approval: null, 
  }),
  computed: {
    vehicleId() {
      return this.$route.params.vehicleId
    }
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    isAuthorized(...permissions) {
      return hasPermissions(this.$store.state.loggedInUser, ...permissions);
    },
    fetchVehicle() {
      axios
        .get(`${this.$store.state.baseApiUrl}/vehicles/${this.vehicleId}`, {
          headers: {
            'Authorization': `Bearer ${this.$store.state.token}`
          }
        })
        .then(response => {
          this.vehicle = response.data.payload;
          this.fetchDealershipStaff();
        })
        .catch(error => {
          console.log(error);
        })
    },
    fetchDealershipStaff() {
      axios
        .get(`${this.$store.state.baseApiUrl}/users/?populate=role`,{
          params: {
            dealership: this.$store.state.dealership._id
          },
          headers: {
            'Authorization': `Bearer ${this.$store.state.token}`
          }
        })
        .then(response => {
          let tempDealershipUsers = [];
          let tempRequestees = [];
          response.data.payload.forEach(user => {
            if (!user.owner) {
              let staff = {
                text: `${user.first_name} ${user.last_name}`,
                value: user._id
              }
              tempDealershipUsers.push(staff)
              if (hasPermissions(user, 'approve_vehicle_sale')) tempRequestees.push(staff);
              if (staff.value === this.$store.state.loggedInUser._id) this.salesRep = staff;
            } else {
              tempRequestees.push({
                text: `${user.first_name} ${user.last_name}`,
                value: user._id
              })
            }
          });
          this.staff = tempDealershipUsers;
          this.requestees = tempRequestees;
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
        })
    }
  },
  mounted() {
    this.fetchVehicle();
  }
}
</script>

<style scoped>
.top-toolbar {
  padding-left: 5%;
  padding-right: 5%;
}
</style>