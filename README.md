# User_eligibility_flow

Project runs on port 4000
Run 'npm install' and then run 'npm start' or 'npm run start:dev'

nodemon is used in this project with 'nodemon.json' as a development env file, if you encounter problems you can
copy the values from the 'nodemon.json' file to the appropriate locations in 'app.js' and 'util/mailhandler.js'

Using mongodb atlas as the database, the database is open to all IPs , the admin credentials are in the 'nodemon.json' file

I have created an example 'users.json' file to represent the list of eligible users.

For mailing, the tool https://www.wpoven.com/tools/free-smtp-server-for-testing is used. 
you can view the emails inboxes by visit the link, and under 'Outgoing or Incoming email address Inbox' put the user's email address (as shown in 'data/users.json' file) who you try to verify with 
and click 'Access Inbox', you will be able to view the email sent if you have completed the verification process and the user is eligible for a device, for example: for the user "Max" the email address 
is "max@email.com".

The logic implemented as for which user is eligible to use the devices - I had each device its own eligibility terms based on the user's health condition, which represented in
a few measurements I have added to each user.
