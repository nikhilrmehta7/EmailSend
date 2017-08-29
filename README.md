# EmailProgram
#this program sends e-mails and uses two services, a main one and a fail safe if the first fails
#there is front-end validation to make sure the fields are appropriate to send an e-mail
#uses an express server, and axios to communicate from the front-end to back-end
#uses a react front-end, wepback to package the front-end
#the secrets are stored in a .env file
#I check if it is a 400 error, if so we know it is a client error and something needs to be changed on the front-end
#If it is a 500 error, there is a problem with the server, I will try a few more times, then switch to the other service


#OTHER CONSIDERATIONS
#There are other validations I could have added, however this is the most basic front-end validation
#you would need to register a domain for the sending e-mail, I could remove the sending e-mail if I want and make it only allow a specific domain
#I could download the response time npm package and make further decisions based on response time from the server
#with the 400 i could handle errors on the front end too, letting the client know there is something wrong with the input and to contact the developer
#i could also distinguish between 400 errors, if it is a matter of user input, or a matter of a missing secret, although hopefully front-end validations clear up user input
#i could do a set timeout on my tries after a 500 error so I retry the service after 15 ms or so
#i would like within 1 second to get a response to the user
