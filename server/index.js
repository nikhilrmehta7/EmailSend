var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

require('dotenv').config()

var sg = require('sendgrid')(process.env.sendgrid);
var SparkPost = require('sparkpost');
var client = new SparkPost(process.env.sparkpost);

var app = express();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/../react-client/dist')));


//you would need to register a domain for the sending e-mail, I could remove the sending e-mail if I want and make it only allow a specific domain
app.post('/send', (req,res) => {
  console.log('hit send');
  var toEmail = req.body.toEmail;
  var fromEmail = req.body.fromEmail;
  var subject = req.body.subject;
  var content = req.body.content;
  var sparkpostObject = {
    options: {
      sandbox: true
    },
    content: {
      from: fromEmail,
      subject: subject,
      html:'<html><body><p>' + content + '</p></body></html>'
    },
    recipients: [
      {address: toEmail}
    ]
  };
  var sendgridRequest = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: {
      personalizations: [
        {
          to: [
            {
              email: toEmail
            }
          ],
          subject: subject
        }
      ],
      from: {
        email: fromEmail
      },
      content: [
        {
          type: 'text/plain',
          value: content
        }
      ]
    }
  });


  //I check if it is a 400 error, if so we know it is a client error and something needs to be changed on the front-end
  //If it is a 500 error, there is a problem with the server, I will try a few more times, then switch to the other service
  //I could download the response time npm package and make further decisions based on response time from the server
  //with the 400 i could handle errors on the front end too, letting the client know there is something wrong with the input and to contact the developer
  //i could also distinguish between 400 errors, if it is a matter of user input, or a matter of a missing secret, although hopefully front-end validations clear up user input
  //i could do a set timeout on my tries after a 500 error so I retry the server after 15 ms or so
  //i would like within 1 second to get a response to the user
  client.transmissions.send(sparkpostObject)
  .then(data => {console.log('Success', data);})
  .catch(err => {
    if(err.statusCode < 500) {
      console.log('There is an error on the client side', err)
    } else {
      client.transmissions.send(sparkpostObject)
      .then(data => {console.log('Success', data);})
      .catch(err => {
        if(err.statusCode < 500) {
          console.log('There is an error on the client side', err)
        } else {
          client.transmissions.send(sparkpostObject)
          .then(data => {console.log('Success', data);})
          .catch(err => {
            if(err.statusCode < 500) {
              console.log('There is an error on the client side', err)
            } else {
              sg.API(sendgridRequest)
              .then(function (response) {
                console.log('Success', response.body);
              })
              .catch(function (error) {
                if(error.response.statusCode < 500) {
                  console.log('There is an error on the client side', error.response)
                } else {
                  sg.API(sendgridRequest)
                  .then(function (response) {
                    console.log('Success', response.body);
                  })
                  .catch(function (error) {
                    if(error.response.statusCode < 500) {
                      console.log('There is an error on the client side', error.response)
                    } else {
                      sg.API(sendgridRequest)
                      .then(function (response) {
                        console.log('Success', response.body);
                      })
                      .catch(function (error) {
                        if(error.response.statusCode < 500) {
                          console.log('There is an error on the client side', error.response)
                        } else {
                          console.log('Both services are down, contact administrator')
                        }
                      })
                    }
                  })
                }
              });
            }
          })
        }
      })
    }
  });
});

app.listen(3000, function () {
  console.log('listening on port 3000!');
});