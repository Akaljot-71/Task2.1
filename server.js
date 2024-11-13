//Server.js
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const Mailgun = require('mailgun.js');
const formData = require('form-data');

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
    const mg = mailgun.client({username: 'api', key: '3a9abdfb38b2a8466e55a3596be4cc3a'});

    const data = {
        from: 'Akaljot4756.be23@chitkara.edu.in',
        to: email,
        subject: 'Welcome to Deakin Newsletter',
        text: `Hi ${firstname} ${lastname},\n\nThank you for signing up for the Deakin Newsletter! We're excited to have you with us.\n\nBest regards,\nDeakin Team`,
    };

    mg.messages.create('sandbox7474172587b743a3a718d827af45baf6.mailgun.org', data)
        .then(body => callback(null, body))
        .catch(error => callback(error, null));
}

app.listen(8080, function() {
    console.log("The server is listening on port 8080");
});
