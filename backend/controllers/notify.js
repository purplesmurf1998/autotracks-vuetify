const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Subscriptions = require('../tables/Subscriptions');
const Users = require('../tables/Users');
const nodemailer = require('nodemailer');

//Email Params
const transporter = nodemailer.createTransport({ //Need a valid email and password to send emails from
    service: 'Hotmail',
    auth: {
      user: '',
      pass: '!'
    }
});

exports.notifySubscribers = asyncHandler(async (req, res, next) => {
    console.log("Notifying subscribers");
    if (req.body.status === 'SOLD')
        await handleVehicleSoldEvent(req.body);
    else if (req.body.status === 'DELIVERED')
        await handleVehicleDeliveredEvent(req.body);
    else if (req.body.status === 'IN_STOCK')
        await handleVehicleAvailableEvent(req.body);
    console.log("Calling next to update the vehicle");
    next();
});

async function handleVehicleSoldEvent(vehicle) {
    console.log('Handling Vehicle Sold Event');
    const subscriptions = await Subscriptions.find({ event_type: 'Vehicle Sold'})
    const subscribers = findSubscribers(subscriptions, vehicle);
    await sendEmails(subscribers);
}

async function handleVehicleDeliveredEvent(vehicle) {
    console.log('Handling Vehicle Delivered Event');
    const subscriptions = await Subscriptions.find({ event_type: 'Vehicle Delivered'})
    const subscribers = findSubscribers(subscriptions, vehicle);
    sendEmails(subscribers);
}

async function handleVehicleAvailableEvent(vehicle) {
    console.log('Handling Vehicle Available Event');
    const subscriptions = await Subscriptions.find({ event_type: 'Vehicle Available'})
    const subscribers = findSubscribers(subscriptions, vehicle);
    sendEmails(subscribers);
}

function findSubscribers(subscriptions, vehicle) {
    console.log('Finding Subscribers');
    /*
    1. Fetch all subscriptions
    2. if property is undefined, that means we do not have to check for values or select_all. Add those people to the subscribers array
    3. if property is defined, and select_all is true, then add those people to the subscribers array
    4. if property is defined, and select_all is false, take the vehicle property and check if it exists in subscriptions.values array, if yes, add those people to the subscribers array
    */
    let subscribers = []
    subscriptions.forEach(sub => {
        if (!subscribers.includes(sub.user)){
            if (!sub.property || sub.select_all)
                subscribers.push(sub.user)
            else { //sub.property is defined & select_all is false, then iterate thru the sub.values
                sub.values.forEach(value => {
                    if (vehicle.properties[sub.property] && vehicle.properties[sub.property].value === value)
                        subscribers.push(sub.user);
                })
            }
        }
    })
    console.log(subscribers);
    return subscribers;
}

async function sendEmails(subscribers) {
    console.log('Fetching users emails');
    subscribers_emails = []
    for (var i=0; i<subscribers.length; i++) {
        const user = await Users.findById(subscribers[i])
        subscribers_emails.push(user.email);
    }
    console.log(subscribers_emails);

    //The email could be a text or in HTML format
    var mailOptions = {
        from: 'abd.sirawan@hotmail.com', //Here should go the email that was logged in with the transporter object
        to: subscribers_emails,
        subject: 'Autotrack Notifications',
        text: `Hello [name], \n\nThis is an automatic email regarding your subscription`
    };

    console.log('Sending Email..');
    await transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(`Email Error: ${error}`);
            if (error.code)
                console.log(`Response Error Code: ${error.code}`);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}