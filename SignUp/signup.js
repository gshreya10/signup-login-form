var express = require("express");
var app = express();
var path    = require("path");
var mysql = require('mysql');
var bodyParser = require('body-parser');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var bcrypt = require('bcryptjs');

var connection = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "sg10",
    database : "signupform"
});

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/signup.html'));
});


app.post('/',function(request,response){
    var username = request.body.username;
    var name = request.body.name;
    var email = request.body.email;
    var password = request.body.password;
    var address = request.body.address;
    var mobile = request.body.mobile;
    const hash = bcrypt.hashSync(request.body.password, 10);

    connection.connect(function(error) {
        if (error) throw error;
        var sql = "INSERT INTO users VALUES ('"+username+"', '"+name+"','"+email+"', '"+hash+"','"+address+"','"+mobile+"')";
        connection.query(sql, function (err, result) {
            if(err){
                if(err.errno==1062){
                    response.write("Email exixts");
                response.end();
                }
                else{
                    throw err;
                    response.end();
                }
            }
           response.write("User Recorded");
           response.end();
        });
    });
});

app.listen(5002);
console.log("Running at Port 5002");