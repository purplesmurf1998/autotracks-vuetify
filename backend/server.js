/*===============================================================

MAIN ENTRY POINT TO EXPRESS SERVER

This file is where we create the server, set up the routes,
set up the middleware and all other configs our server will
have. The file should finish by running the server and listening
on a certain PORT number.

=================================================================*/

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const errorHandler = require('./middleware/error');

const authRoutes = require('./routes/authentication');
const utilsRoutes = require('./routes/utilities');
const userRoutes = require('./routes/users');
const dealershipRoutes = require('./routes/dealerships');
const roleRoutes = require('./routes/roles');
const propertyRoutes = require('./routes/properties');
const vehicleRoutes = require('./routes/vehicles');

// load in environment variables from config.env
// this lets us access env. variables by using proccess.env.[VARIABLE_NAME]
if (process.env.NODE_ENV != 'production') {
  dotenv.config({ path: './config/config.env' });
}

// set up PORT number from env. variables, 5000 by default
const PORT = process.env.PORT || 5000;

// create the server app
const app = express();

// disable x-powered-by header
app.disable('x-powered-by');

// connect to mongoose
mongoose.connect(process.env.NODE_ENV == 'development' ? process.env.MONGODB_URL_DEV : process.env.MONGODB_URL_PROD,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// apply CORS to routes
app.use(cors({
  origin: '*'
}));

// needed to be able to parse request body
app.use(express.json());

// mount controller routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/utilities', utilsRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/dealerships', dealershipRoutes);
app.use('/api/v1/roles', roleRoutes);
app.use('/api/v1/properties', propertyRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);

// mount error handler middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Autotracks API listening on port ${PORT}`);
  mongoose.connection.once("open", function () {
    console.log("Connected successfully to MongoDB");
  });
})

mongoose.connection.on("error", console.error.bind(console, "connection error: "));