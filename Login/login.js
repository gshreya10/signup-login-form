var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const bcrypt=require('bcryptjs');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'sg10',
	database : 'signupform'
});

var app = express();
app.use(express.json());
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM users WHERE ( username = ? OR email = ? )', [username, username], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				if( bcrypt.compareSync(password, results[0].password) ){
					response.write('LOGGED IN\n');
    	            response.write('\nUsername = '+ results[0].username);
        	        response.write('\nName = '+ results[0].name);
            	    response.write('\nEmail = ' + results[0].email);
                	response.write('\nAddress = '+ results[0].address);
                	response.write('\nMobile = '+ results[0].mobile);
				}
				else{
					response.send('Incorrect Password');;
				} 
			} 
            else {
				response.send('Incorrect Username/Email');
			}			
			response.end();
		});
	} 
    else {
		response.send('Please enter Username/Email and Password!');
		response.end();
	}
});

app.listen(5001);
console.log("Running at Port 5001");