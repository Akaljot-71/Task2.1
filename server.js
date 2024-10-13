//Server.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const formData = require('form-data');
const Mailgun = require('mailgun.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/signup', function(req, res) {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;

    sendWelcomeEmail(firstname, lastname, email, function(error, body) {
        if (error) {
            console.error("Error sending email:", error);
            res.send("There was an error signing up. Please try again.");
        } else {
            console.log("Email sent successfully:", body);
            res.send(`Welcome, ${firstname} ${lastname}! Your email is ${email}`);
        }
    });
});

function sendWelcomeEmail(firstname, lastname, email, callback) {
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({username: 'api', key: '9ccb038633f657318fce1915a48b6e25-5dcb5e36-535f6f97'});

    const data = {
        from: 'Your Name <your-email@your-domain.com>',
        to: email,
        subject: 'Welcome to Deakin Newsletter',
        text: `Hi ${firstname} ${lastname},\n\nThank you for signing up for the Deakin Newsletter! We're excited to have you with us.\n\nBest regards,\nDeakin Team`,
    };

    mg.messages.create('your-domain.com', data)
        .then(body => callback(null, body))
        .catch(error => callback(error, null));
}

app.listen(8080, function() {
    console.log("The server is listening on port 8080");
});
