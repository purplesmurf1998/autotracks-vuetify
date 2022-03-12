const Users = require('../tables/Users');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const jwt = require('jsonwebtoken');


// @desc    Sign in user and return a valid JWT
// @route   POST /api/v1/auth/signin
// @access  Public
exports.signIn = asyncHandler(async (req, res, next) => {
    // get email and password from the body
    const { email, password } = req.body;

    // validate that email and password exist
    if (!email || !password) {
        return next(
            new ErrorResponse('Please provide an email and password.', 400)
        );
    }

    // check for user
    // use select to return the password in the user object
    const user = await Users.findOne({ email }).select('+password');

    // validate that the user exists
    if (!user) {
        return next(
            new ErrorResponse('Invalid credentials.', 401)
        );
    }

    // validate the entered password to the user password
    const passwordMatch = await user.matchPassword(password);
    if (!passwordMatch) {
        return next(
            new ErrorResponse('Invalid credentials.', 401)
        );
    }

    // send response with token in cookies
    sendTokenResponse(user, 200, res);
});

// @desc    Logout user and clear JWT from browser/cookies
// @route   GET /api/v1/auth/logout
// @access  Authenticated
exports.logout = (req, res, next) => {
    // clear the token from the cookies
    res
        .status(200)
        .clearCookie('autotracksAuthToken')
        .json({
            success: true,
            message: 'User logged out'
        });
}

// @desc    Register a new owner and return a valid JWT
// @route   POST /api/v1/auth/register
// @route   Public
exports.register = asyncHandler(async (req, res, next) => {
    // validate that the user being registered is an owner
    if (!req.body.owner) {
        return next(
            new ErrorResponse('Can only register an owner from this route', 401)
        );
    }

    // create the new owner user
    const user = await Users.create(req.body);

    // send token response
    sendTokenResponse(user, 201, res);
});

// @desc    Verify if the user is logged in
// @route   POST /api/v1/auth/verify
// @access  Public
exports.verify = asyncHandler(async (req, res, next) => {
    // try to verify the token passed in the body
    try {
        // verify token
        const decoded = jwt.verify(req.body.token, process.env.JWT_SECRET);

        // invalid token
        if (!decoded) {
            return next(
                new ErrorResponse('Invalid token', 500)
            );
        }

        // valid token, find the user and return in the response
        const user = await Users.findById(decoded.userId).populate('dealership');

        // user not found
        if (!user) {
            return next(
                new ErrorResponse('User not found', 404)
            );
        }

        // user found
        sendTokenResponse(user, 200, res);
    } catch (err) {
        return next(
            new ErrorResponse(err)
        );
    }
});

// @desc    Change user password
// @route   PUT /api/v1/auth/changepassword/:userId
// @access  Private
exports.changePassword = asyncHandler(async (req, res, next) => {
    // protected route, therefore should get the user object from the req
    // match the current password with the one in the user
    // if match, set the new password in the user

    // make sure the user in the authorization token is the same user as in the route params
    if (req.user._id != req.params.userId) {
        return next(
            new ErrorResponse('Wrong user', 400)
        );
    }

    // get the user object
    const user = await Users.findById(req.params.userId).select('+password');

    if (!user) {
        return next(
            new ErrorResponse('User not found', 404)
        );
    }

    // validate the entered password to the user password
    const passwordMatch = await user.matchPassword(req.body.currentPassword);
    if (!passwordMatch) {
        return next(
            new ErrorResponse('Invalid credentials.', 401)
        );
    }

    user.password = req.body.newPassword;
    user.promptPasswordChange = false;
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Password changed successfully'
    })
})

// get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // create token for this user
    const token = user.getSignedJwtToken();

    // token expires in 30 days
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    // if server running in production, add secure flag to cookie
    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    // send response with cookie and token
    res
        .status(statusCode)
        .cookie('autotracksAuthToken', token, options)
        .json({
            success: true,
            payload: user,
            token
        });
}