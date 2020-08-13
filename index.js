const express = require('express');
const bodyParser = require('body-parser');

const fs = require('fs');
var urlencodedParser = (bodyParser.urlencoded({ extended: false }))
const app = new express();
const user = require('./models/users');
var mongoose = require('mongoose');
mongoose.connect("mongodb+srv://test:test@cluster0.zgwho.mongodb.net/users?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });


app.use(express.static('assets'));
app.set('view engine', 'ejs');
const PORT = process.env.PORT || 5000
app.listen(PORT)



app.get('/', function(req, res) {
    var mem = [];
    var proj = [];
    var event = [];
    fs.readFile('assets/info/members.csv', (err, data) => {
        if (err) throw err;
        var lines = data.toString();
        listOfLines = lines.split('\n');

        for (var i = 0; i < listOfLines.length; i++) {
            membersList = listOfLines[i].split(',');
            mem.push(membersList);

        }
        fs.readFile('assets/info/projectList.csv', (err, data) => {
            if (err) throw err;
            var lines = data.toString();
            listOfLines = lines.split('\n');
            for (var i = 0; i < listOfLines.length; i++) {
                projectsList = listOfLines[i].split(',');
                proj.push(projectsList);

            }
            fs.readFile('assets/info/events.csv', (err, data) => {
                if (err) throw err;
                var lines = data.toString();
                listOfLines = lines.split('\n');

                for (var i = 0; i < listOfLines.length; i++) {
                    eventsList = listOfLines[i].split(';');
                    event.push(eventsList);
                    console.log(eventsList);
                }
                res.render('index', { member: mem, projects: proj, event: event });
            })
        })
    })

});

app.get('/projectList', function(req, res) {
    var mem = [];
    var proj = [];
    fs.readFile('assets/info/members.csv', (err, data) => {
        if (err) throw err;
        var lines = data.toString();
        listOfLines = lines.split('\n');

        for (var i = 0; i < listOfLines.length; i++) {
            membersList = listOfLines[i].split(',');
            mem.push(membersList);
            console.log(membersList);
        }
        fs.readFile('assets/info/projectList.csv', (err, data) => {
            if (err) throw err;
            var lines = data.toString();
            listOfLines = lines.split('\n');
            for (var i = 0; i < listOfLines.length; i++) {
                projectsList = listOfLines[i].split(',');
                proj.push(projectsList);
                console.log(projectsList);
            }
            res.render('projectList', { member: mem, projects: proj });
        })
    })

});




app.get('/autonomous_dustbin', function(req, res) {
    res.render('autonomous_dustbin')
})

app.get('/door-opener-fingerprint', function(req, res) {
    res.render('door-opener-fingerprint')
})

app.get('/door-opener-rfid', function(req, res) {
    res.render('door-opener-rfid')
})

app.get('/led-controller', function(req, res) {
    res.render('led-controller')
})

app.get('/Tic-Tac-Toe', function(req, res) {
    res.render('Tic-Tac-Toe')
})

app.get('/volt-polarity', function(req, res) {
    res.render('volt-polarity')
})

app.get('/water-level-indicator', function(req, res) {
    res.render('water-level-indicator')
})


app.get('/event/:id', function(req, res) {
    var event = [];
    var eventID = req.params.id;
    console.log(eventID)
    fs.readFile('assets/info/events.csv', (err, data) => {
        if (err) throw err;
        var lines = data.toString();
        listOfLines = lines.split('\n');

        for (var i = 0; i < listOfLines.length; i++) {
            eventsList = listOfLines[i].split(';');
            event.push(eventsList);
            console.log(eventsList);
        }
        var particularEvent = event[eventID];
        console.log(eventID)
        console.log(particularEvent)
        res.render('event', { event: particularEvent });
    })
})

app.post('/event/:id', urlencodedParser, function(req, res) {
    var event = [];
    var eventID = req.params.id;

    fs.readFile('assets/info/events.csv', (err, data) => {
        if (err) throw err;
        var lines = data.toString();
        listOfLines = lines.split('\n');

        for (var i = 0; i < listOfLines.length; i++) {
            eventsList = listOfLines[i].split(';');
            event.push(eventsList);
            console.log(eventsList);
        }
        var particularEvent = event[eventID];
        user.count({ name: req.body['name'], email: req.body['email'], college: req.body['college'], ticket: req.body['ticket'], eventID: req.params.id }, function(err, count) {
            if (count > 0) {
                res.render('confirmation', {
                    reply: 'Hey !! your seats are secured , no need to worry we won\'t give it to anyone else , you are already registered :) ',
                    event: particularEvent,
                    color: 2
                });
            } else {
                var u = user({ name: req.body['name'], email: req.body['email'], college: req.body['college'], ticket: req.body['ticket'], eventID: req.params.id, reason: req.body['reason'] }).save(function(err) {
                    if (err) {
                        res.render('confirmation', {
                            reply: 'Oops!!! there was an error while registering :(',
                            event: particularEvent,
                            color: 3
                        });
                        throw err;
                    } else {
                        console.log(1)
                        console.log('ticket registered');
                        var nodemailer = require('nodemailer');

                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'shettyyashdeep@gmail.com',
                                pass: 'Yash@12345678910'
                            }
                        });
                        var t = 'Thanks,' + req.body['name'] + ' you have been registered for the event of!!! ' + particularEvent[4] + " scheduled at " + particularEvent[1];
                        var mailOptions = {
                            from: 'shettyyashdeep@gmail.com',
                            to: req.body['email'],
                            subject: 'Event Confirmation',
                            text: t
                        };

                        transporter.sendMail(mailOptions, function(error, info) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                        });
                        res.render('confirmation', {
                            reply: 'Your booking has been confirmed. Check your email for detials.',
                            event: particularEvent,
                            color: 1
                        });
                    }

                });
            }
        });

    });

})