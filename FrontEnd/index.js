var express = require('express');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var app = express();
var port = 8080;

var backend_url = "localhost:5000";

app.use(express.static('public'));
app.use(express.json());


app.get('/', function (req, res) {
    res.sendFile(__dirname + './public/index.html');
});

app.get('/createproject', function(req,res){
    res.sendFile(__dirname + '/public/create-project.html');
})

app.get('/login', function (req, res) {
    res.sendFile(__dirname + '/public/login.html');
});

app.get('/listalluser', function (req, res) {
    var xhttp = new XMLHttpRequest();
    xhttp.onloadend = function () {
        if (this.status == 200) {
            res.send(this.responseText);
        }
        else if (this.status == 0){
            res.sendStatus(500);
        }
        else {
            res.sendStatus(this.status);
        }
    }
    xhttp.open("GET",  `http://${backend_url}${req.originalUrl}`, true);
    xhttp.send();
});

app.get('/listinstanceuser', function (req, res) {
    var xhttp = new XMLHttpRequest();
    xhttp.onloadend = function () {
        if (this.status == 200) {
            res.send(this.responseText);
        }
        else if (this.status == 0){
            res.sendStatus(500);
        }
        else {
            res.sendStatus(this.status);
        }
    }
    xhttp.open("GET",  `http://${backend_url}${req.originalUrl}`, true);
    xhttp.send();
});

app.get('/listprojectuser', function (req, res) {
    var xhttp = new XMLHttpRequest();
    xhttp.onloadend = function () {
        if (this.status == 200) {
            res.send(this.responseText);
        }
        else if (this.status == 0){
            res.sendStatus(500);
        }
        else {
            res.sendStatus(this.status);
        }
    }
    xhttp.open("GET",  `http://${backend_url}${req.originalUrl}`, true);
    xhttp.send();
});

app.get('/listprojects', function (req, res) {
    var xhttp = new XMLHttpRequest();
    xhttp.onloadend = function () {
        if (this.status == 200) {
            res.send(this.responseText);
        }
        else if (this.status == 0){
            res.sendStatus(500);
        }
        else {
            res.sendStatus(this.status);
        }
    }
    xhttp.open("GET",  `http://${backend_url}${req.originalUrl}`, true);
    xhttp.send();
});

app.get('/deleteinstance', function (req, res) {
    var xhttp = new XMLHttpRequest();
    xhttp.onloadend = function () {
        if (this.status == 200) {
            res.send(this.responseText);
        }
        else if (this.status == 0){
            res.sendStatus(500);
        }
        else {
            res.sendStatus(this.status);
        }
    }
    xhttp.open("GET",  `http://${backend_url}${req.originalUrl}`, true);
    xhttp.send();
});

app.get('/deleteproject', function (req, res) {
    var xhttp = new XMLHttpRequest();
    xhttp.onloadend = function () {
        if (this.status == 200) {
            res.send(this.responseText);
        }
        else if (this.status == 0){
            res.sendStatus(500);
        }
        else {
            res.sendStatus(this.status);
        }
    }
    xhttp.open("GET",  `http://${backend_url}${req.originalUrl}`, true);
    xhttp.send();
});

app.get('/getconnect', function (req, res) {
    var xhttp = new XMLHttpRequest();
    xhttp.onloadend = function () {
        if (this.status == 200) {
            res.send(this.responseText);
        }
        else if (this.status == 0){
            res.sendStatus(500);
        }
        else {
            res.sendStatus(this.status);
        }
    }
    xhttp.open("GET",  `http://${backend_url}${req.originalUrl}`, true);
    xhttp.send();
});

app.get('/listprojectinstances', function (req, res) {
    var xhttp = new XMLHttpRequest();
    xhttp.onloadend = function () {
        if (this.status == 200) {
            res.send(this.responseText);
        }
        else if (this.status == 0){
            res.sendStatus(500);
        }
        else {
            res.sendStatus(this.status);
        }
    }
    xhttp.open("GET",  `http://${backend_url}${req.originalUrl}`, true);
    xhttp.send();
});

app.post('/updateinstance',function (req, res) {
    var xhttp = new XMLHttpRequest();
    var formData = JSON.stringify(req.body);
    xhttp.onloadend = function () {
        if (this.status == 200) {
            res.send(this.responseText);
        }
        else if (this.status == 0){
            res.sendStatus(500);
        }
        else {
            res.sendStatus(this.status);
        }
    }
    xhttp.open("POST",  `http://${backend_url}${req.originalUrl}`, true);
    xhttp.setRequestHeader("Content-Type","application/json");
    xhttp.send(formData);
});

app.post('/createproject',function (req, res) {
    var xhttp = new XMLHttpRequest();
    var formData = JSON.stringify(req.body);
    xhttp.onloadend = function () {
        if (this.status == 200) {
            res.send(this.responseText);
        }
        else if (this.status == 0){
            res.sendStatus(500);
        }
        else {
            res.sendStatus(this.status);
        }
    }
    xhttp.open("POST",  `http://${backend_url}${req.originalUrl}`, true);
    xhttp.setRequestHeader("Content-Type","application/json");
    xhttp.send(formData);
});

app.post('/createinstance',function (req, res) {
    var xhttp = new XMLHttpRequest();
    var formData = JSON.stringify(req.body);
    xhttp.onloadend = function () {
        if (this.status == 200) {
            res.send(this.responseText);
        }
        else if (this.status == 0){
            res.sendStatus(500);
        }
        else {
            res.sendStatus(this.status);
        }
    }
    xhttp.open("POST",  `http://${backend_url}${req.originalUrl}`, true);
    xhttp.setRequestHeader("Content-Type","application/json");
    xhttp.send(formData);
});

app.get('/projectdetail', function (req, res) {
    var xhttp = new XMLHttpRequest();
    xhttp.onloadend = function () {
        if (this.status == 200) {
            res.send(this.responseText);
        }
        else if (this.status == 0){
            res.sendStatus(500);
        }
        else {
            res.sendStatus(this.status);
        }
    }
    xhttp.open("GET", `http://${backend_url}${req.originalUrl}`, true);
    xhttp.send();
})

app.post('/signin', function (req, res) {
    var xhttp = new XMLHttpRequest();
    var formData = JSON.stringify(req.body);
    xhttp.onloadend = function () {
        if (this.status == 200) {
            res.send(this.responseText);
        }
        else if (this.status == 0){
            res.sendStatus(500);
        }
        else {
            res.sendStatus(this.status);
        }
    }
    xhttp.open("POST", `http://${backend_url}/signin`, true);
    xhttp.setRequestHeader("Content-Type","application/json");
    xhttp.send(formData);
});

app.get('/project', function (req, res) {
    // req.query('token');
    // Authorize request;
    res.sendFile(__dirname + '/public/project.html');
});

app.get('/user', function (req, res) {
    // req.query('token');
    // Authorize request;
    res.sendFile(__dirname + '/public/user.html');
});

app.get('/ssh', function (req, res) {
    // req.query('token');
    // Authorize request;
    res.sendFile(__dirname + '/public/ssh.html');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));