import Store from './index.js'

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
      // verify the token is valid
      const response = await fetch(`${Store.state.baseApiUrl}/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });

      const responseData = await response.json();
      // token not valid or user not found
      if (!response.ok) {
        localStorage.clear('autotracksAuthToken');
      } else {
        const data = {
          token: responseData.token,
          loggedInUser: responseData.payload
        }

        // set the token in the local storage
        localStorage.setItem('autotracksAuthToken', data.token);
        // set the data in the store's state
        context.commit('setUser', data);
      }
    }
  }
}