import Store from './index.js'
import axios from 'axios'

export default {
  async login(context, payload) {
    // login user and set user in the store
    const response = await fetch(`${Store.state.baseApiUrl}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: payload.email,
        password: payload.password
      })
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.log(responseData);
      return {
        success: false,
        message: responseData.message || 'Failed to authenticate.'
      };
    }

    const data = {
      token: responseData.token,
      loggedInUser: responseData.payload
    }

    // set the token in the local storage
    localStorage.setItem('autotracksAuthToken', data.token);
    // set the data in the store's state
    context.commit('setUser', data);
    return { success: true };
  },
  logout(context) {
    // set the user data to null values and loggedIn to false
    const data = {
      token: null,
      loggedInUser: null
    };
    // clear the token from the local storage
    localStorage.clear('autotracksAuthToken');

    context.commit('setUser', data);
  },
  async verify(context) {
    const token = localStorage.getItem('autotracksAuthToken');

    // if there is a token
    if (token) {
      try {
        const response = await axios({
          url: `${Store.state.baseApiUrl}/auth/verify`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            token
          }
        })

        let dealership = response.data.payload.dealership;
        let loggedInUser = response.data.payload;
        loggedInUser.dealership = dealership ? dealership._id : null;
        const data = {
          token: response.data.token,
          loggedInUser,
          dealership
        }
        // set the token in the local storage
        localStorage.setItem('autotracksAuthToken', data.token);
        // set the data in the store's state
        context.commit('setUser', data);
      } catch (error) {
        localStorage.clear('autotracksAuthToken');
      }
    }
  }
}