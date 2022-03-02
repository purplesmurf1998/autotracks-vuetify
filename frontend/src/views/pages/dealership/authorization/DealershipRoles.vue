<template>
  <div>
    <v-row class="mx-auto" style="width: 90%">
      <v-col class="pl-0 mt-5">
        <p class="text-h5 font-weight-light">Account Roles</p>
        <v-card>
          <v-list class="pa-0">
            <v-list-item-group v-model="selectedRole" color="primary">
              <v-list-item v-for="(role, i) in roles" :key="i">
                <v-list-item-content>
                  <v-list-item-title v-text="role.title"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
      <v-col class="pr-0 mt-5">
        <p class="text-h5 font-weight-light">Permissions</p>
        <v-row class="ma-0">
          <v-col>
            <v-switch
              :value="true"
              inset
              color="primary"
              class="ma-0 pa-0"
              label="Create Account"
            />
            <v-switch
              :value="true"
              inset
              color="primary"
              class="ma-0 pa-0"
              label="Edit Account"
            />
            <v-switch
              :value="true"
              inset
              color="primary"
              class="ma-0 pa-0"
              label="View Account"
            />
            <v-switch
              :value="true"
              inset
              color="primary"
              class="ma-0 pa-0"
              label="Delete Account"
            />
          </v-col>
          <v-col>
            <v-switch
              :value="true"
              inset
              color="primary"
              class="ma-0 pa-0"
              label="Create Vehicle"
            />
            <v-switch
              :value="true"
              inset
              color="primary"
              class="ma-0 pa-0"
              label="Edit Vehicle"
            />
            <v-switch
              :value="true"
              inset
              color="primary"
              class="ma-0 pa-0"
              label="View Vehicle"
            />
            <v-switch
              :value="true"
              inset
              color="primary"
              class="ma-0 pa-0"
              label="Delete Vehicle"
            />
          </v-col>
        </v-row>
        <!-- <v-row class="ma-0" align="center">
          <p class="text-h5 mr-2 font-weight-light mb-0">Vehicles</p>
          <v-btn x-small fab color="primary"><v-icon> mdi-plus </v-icon></v-btn>
          <v-spacer></v-spacer>
          <v-chip small color="secondary" class="mr-1" close>create</v-chip>
          <v-chip small color="secondary" class="mr-1" close>update</v-chip>
          <v-chip small color="secondary" class="mr-1" close>read</v-chip>
          <v-chip small color="secondary" close>delete</v-chip>
        </v-row>
        <v-divider class="my-4" />
        <v-row class="ma-0" align="center">
          <p class="text-h5 mr-2 font-weight-light mb-0">Accounts</p>
          <v-btn x-small fab color="primary"><v-icon> mdi-plus </v-icon></v-btn>
          <v-spacer></v-spacer>
          <v-chip small color="secondary" close>read</v-chip>
        </v-row>
        <v-divider class="my-4" />
        <v-row class="ma-0" align="center">
          <p class="text-h5 mr-2 font-weight-light mb-0">Locations</p>
          <v-btn x-small fab color="primary"><v-icon> mdi-plus </v-icon></v-btn>
          <v-spacer></v-spacer>
          <v-chip small color="secondary" close>read</v-chip>
        </v-row>
        <v-divider class="my-4" />
        <v-row class="ma-0" align="center">
          <p class="text-h5 mr-2 font-weight-light mb-0">Dealerships</p>
          <v-btn x-small fab color="primary"><v-icon> mdi-plus </v-icon></v-btn>
          <v-spacer></v-spacer>
          <v-chip small color="secondary" close>read</v-chip>
        </v-row>
        <v-divider class="my-4" />
        <v-row class="ma-0" align="center">
          <p class="text-h5 mr-2 font-weight-light mb-0">Vehicle Lists</p>
          <v-btn x-small fab color="primary"><v-icon> mdi-plus </v-icon></v-btn>
          <v-spacer></v-spacer>
          <v-chip small color="secondary" close>read</v-chip>
        </v-row>
        <v-divider class="my-4" />
        <v-row class="ma-0" align="center">
          <p class="text-h5 mr-2 font-weight-light mb-0">Vehicle Sale</p>
          <v-btn x-small fab color="primary"><v-icon> mdi-plus </v-icon></v-btn>
          <v-spacer></v-spacer>
          <v-chip small color="secondary" close>read</v-chip>
        </v-row> -->
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "DealershipRoles",

  data: () => ({
    selectedRole: null,
    roles: [
      {
        _id: "1",
        title: "Administration",
      },
      {
        _id: "2",
        title: "Management",
      },
      {
        _id: "3",
        title: "Sales Rep",
      },
      {
        _id: "4",
        title: "Sales Rep +",
      },
      {
        _id: "5",
        title: "Reception",
      },
    ],
  }),
};
</script>

<style>
</style>