'use strict';
require('dotenv').config()
const nodemailer = require('nodemailer');
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

let servicePort = process.env.SERVICE_PORT || 3001;
// parse application/json
app.use(bodyParser.json())

app.post('/', (req, res) => {
    let body = req.body;
    let subject = body.subject || "No subject";
    let text = body.text || "";
    let html = '<b>Dummy email</b>'; 

    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    nodemailer.createTestAccount((err, account) => {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.email || "oqjvh46u3uauklme@ethereal.email", // generated ethereal user
                pass: process.env.password || "JxuB4AfCuy4NsabDbz" // generated ethereal password
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: 'Docker Workshop', // sender address
            to: 'docker_workshop@email.com', // list of receivers
            subject: subject, // Subject line
            text: text, // plain text body
            html: html // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            return res.json({messageId: info.messageId, previewURL: nodemailer.getTestMessageUrl(info)});
        });
    });
});

app.listen(servicePort, () => console.log('Example app listening on port '+servicePort))