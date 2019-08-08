var express = require('express');
var mysql = require('mysql');
var app = express();
const cors = require('cors');
var port = 5000;
const query = require("./database-query");

try{
    var con = mysql.createConnection({
        host: "solo.ceysu41lzk39.ap-southeast-1.rds.amazonaws.com",
        user: "root",
        password: "osam.io2019",
        database: "SSHManager"
    });

    con.connect(function (err) {
        if (err) {
            con.end();
            callback(err, null);
            throw err;
        }
        else {
            app.use(cors({origin: '*'}));
            app.use(express.json());

            app.post('/signin', function (req, res) {
                query.login(con, req.body.username, req.body.password, (err,result)=>{
                    if (err) {
                        res.sendStatus(500);
                    }
                    else if(result==null){
                        res.sendStatus(404);
                    }
                    else {
                        res.json(result);
                    }
                });
            });

            app.get('/listalluser', function(req,res){
                var token = req.query.token;
                if(token.length){
                    if(token.split("@")[0]< new Date().getTime()){
                        res.sendStatus(456);
                    }
                    else{
                        query.getUserFromToken(con, token,(err,result)=>{
                            if(err){
                                res.sendStatus(500);
                            }
                            else if(result) {
                                query.listAllUser(con, result.UserID,(err,result)=>{
                                    if(err){
                                        res.sendStatus(500);
                                    }
                                    else{
                                        res.json(result);
                                    }
                                });
                            }
                            else{
                                res.sendStatus(401);
                            }
                        });
                    }
                }
                else{
                    res.sendStatus(456);
                }
            });

            app.get('/deleteinstance', function(req,res){
                var token = req.query.token;
                var instance_id = req.query.id;
                if(token.length){
                    if(token.split("@")[0]< new Date().getTime()){
                        res.sendStatus(456);
                    }
                    else{
                        query.getUserFromToken(con, token,(err,result)=>{
                            if(err){
                                res.sendStatus(500);
                            }
                            else if(result) {
                                if(result.IsAdmin){
                                    query.removeInstance(con, instance_id,(err,result2)=>{
                                        if(err){
                                            res.sendStatus(500);
                                        }
                                        else{
                                            res.sendStatus(204);
                                        }
                                    });
                                }
                                else{
                                    var user_id = result.UserID;
                                    query.isManagerInstance(con, user_id,instance_id, (err,result3)=>{
                                        if(err){
                                            res.sendStatus(500);
                                        }
                                        else if(result3){
                                            query.removeInstance(con, instance_id, (err,result4)=>{
                                                if(err){
                                                    res.sendStatus(500);
                                                }
                                                else{
                                                    res.sendStatus(204);
                                                }
                                            });
                                        }
                                        else{
                                            res.sendStatus(403);
                                        }
                                    });
                                }
                            }
                            else{
                                res.sendStatus(401);
                            }
                        });
                    }
                }
                else{
                    res.sendStatus(456);
                }
            });

            app.post('/createinstance', function (req, res){
                var token = req.query.token;
                var instance_prop = req.body;
                if(token.length){
                    if(token.split("@")[0]< new Date().getTime()){
                        res.sendStatus(456);
                    }
                    else{
                        query.getUserFromToken(con, token,(err,result)=>{
                            if(err){
                                res.sendStatus(500);
                            }
                            else if(result) {
                                if(result.IsAdmin){
                                    query.createInstance(con, instance_prop.InstanceName,instance_prop.ARN,instance_prop.IpAddress,instance_prop.SSHKey,instance_prop.ProjectID,instance_prop.InstanceUser,(err,result2)=>{
                                        if(err){
                                            res.sendStatus(500);
                                        }
                                        else{
                                            res.sendStatus(200);
                                        }
                                    });
                                }
                                else{
                                    res.sendStatus(403);
                                }
                            }
                            else{
                                res.sendStatus(401);
                            }
                        });
                    }
                }
                else{
                    res.sendStatus(456);
                }
            });

            app.post('/createproject', function (req,res){
                var token = req.query.token;
                if(token.length){
                    if(token.split("@")[0]< new Date().getTime()){
                        res.sendStatus(456);
                    }
                    else{
                        query.getUserFromToken(con, token,(err,result)=>{
                            if(err){
                                res.sendStatus(500);
                            }
                            else if(result==null){
                                res.sendStatus(401);
                            }
                            else if(result.IsAdmin){
                                var project_prop = req.body;
                                query.createProject(con, project_prop.ProjectName,project_prop.CompanyName,project_prop.ProjectManager,(err,result2)=>{
                                    if(err){
                                        res.sendStatus(500);
                                    }
                                    else if(result2){
                                        
                                    }
                                    else{
                                        res.sendStatus(500);
                                    }
                                });
                            }
                            else{
                                res.sendStatus(403);
                            }
                        });
                    }
                }
                else{
                    res.sendStatus(456);
                }
            });

            app.post('/updateinstance',function (req,res){
                var token = req.query.token;
                if(token.length){
                    if(token.split("@")[0]< new Date().getTime()){
                        res.sendStatus(456);
                    }
                    else{
                        query.getUserFromToken(con, token,(err,result)=>{
                            if(err){
                                res.sendStatus(500);
                            }
                            else if(result==null){
                                res.sendStatus(401);
                            }
                            else{
                                var user_id = result.UserID;
                                if(result.IsAdmin){
                                    query.updateInstance(con, req.body,(err,result2)=>{
                                        if(err){
                                            res.sendStatus(500);
                                        }
                                        else if(result2){
                                            res.sendStatus(200);
                                        }
                                        else{
                                            res.sendStatus(400);
                                        }
                                    });
                                }
                                else{
                                    if(query.isManagerInstance(con, user_id,req.body.InstanceID,(err,result3)=>{
                                        if(err){
                                            res.sendStatus(500)
                                        }
                                        else if(result3){
                                            query.updateInstance(con, req.body,(err,result2)=>{
                                                if(err){
                                                    res.sendStatus(500)
                                                }
                                                else{
                                                    res.sendStatus(200);
                                                }
                                            });
                                        }
                                        else{
                                            res.sendStatus(403);
                                        }
                                    }));
                                }
                            }
                        });
                    }
                }
                else{
                    res.sendStatus(456);
                }
            });

            app.get('/projectdetail',  function (req, res) {
                var token = req.query.token;
                var project_id = req.query.id;
                if(token.length){
                    if(token.split("@")[0]< new Date().getTime()){
                        res.sendStatus(456);
                    }
                    else{
                        query.getUserFromToken(con, token,(err,result)=>{
                            if(err){
                                res.sendStatus(500);
                            }
                            else if(result==null){
                                res.sendStatus(401);
                            }
                            else{
                                if(result.IsAdmin){
                                    query.getProjectDetail(con, project_id,(err,result3)=>{
                                        if (err) {
                                            res.sendStatus(500);
                                        }
                                        else {
                                            res.json(result3);
                                        }
                                    });
                                }
                                else{
                                    var user_id = result.UserID;
                                    query.isUserBelongProject(con, user_id,project_id,(err,result2)=>{
                                        if(err){
                                            res.sendStatus(500);
                                        }
                                        else if(result2){
                                            query.getProjectDetail(con, project_id,(err,result3)=>{
                                                if (err) {
                                                    res.sendStatus(500);
                                                }
                                                else {
                                                    res.json(result3);
                                                }
                                            });
                                        }
                                        else{
                                            res.sendStatus(403);
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
                else{
                    res.sendStatus(456);
                }
            });

            app.get('/listprojectinstances',function(req,res){
                var token = req.query.token;
                var project_id = req.query.id;
                if(token.length){
                    if(token.split("@")[0]< new Date().getTime()){
                        res.sendStatus(456);
                    }
                    else{
                        query.getUserFromToken(con, token,(err,result)=>{
                            if(err){
                                res.sendStatus(500);
                            }
                            else if(result==null){
                                res.sendStatus(401);
                            }
                            else{
                                if(result.IsAdmin){
                                    query.listProjectInstances(con, project_id,(err,result2)=>{
                                        if (err) {
                                            res.sendStatus(500).send(err);
                                        }
                                        else {
                                            if(!result2.length){
                                                res.sendStatus(204);
                                            }
                                            else{
                                                result2.forEach(element => {
                                                    delete element['SSHKey'];
                                                });
                                                res.json(result2);
                                            }
                                        }
                                    });
                                }
                                else{
                                    var user_id = result.UserID;
                                    query.listProjectInstancesAvail(con, user_id, project_id,(err,result3)=>{
                                        if (err) {
                                            res.sendStatus(500).send(err);
                                        }
                                        else {
                                            if(!result3.length){
                                                res.sendStatus(204);
                                            }
                                            else{
                                                result3.forEach(element => {
                                                    delete element['SSHKey'];
                                                    delete element['UserID'];
                                                });
                                                res.json(result3);
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
                else{
                    res.sendStatus(456);
                }
            });

            app.get('/listprojects', function (req, res) {
                var token = req.query.token;
                if(token.length){
                    if(token.split("@")[0] < new Date().getTime()){
                        res.sendStatus(456);
                    }
                    else{
                        query.getUserFromToken(con, token,(err, result) => {
                            if(err){
                                res.sendStatus(500);
                            }
                            else if(result==null){
                                res.sendStatus(401);
                            }
                            else if(result.IsAdmin){
                                query.listAllProjects(con, (err, result2) => {
                                    if (err) {
                                        res.sendStatus(500).send(err);
                                    }
                                    else {
                                        res.json(result2);
                                    }
                                });
                            }
                            else if(result.UserID){
                                query.listProjects(con, result.UserID,(err, result2) => {
                                    if (err) {
                                        res.sendStatus(500);
                                    }
                                    else {
                                        res.json(result2);
                                    }
                                });
                            }
                            else{
                                res.sendStatus(401);
                            }
                        });
                    }
                }
                else{
                    res.sendStatus(456);
                }
            });

            app.get('/user',function (req, res) {
                var user_id=req.param.id;
                query.getUserDetail(con, user_id,(err,result)=>{
                    if(err){
                        res.sendStatus(401).send(err);
                    }
                    else{
                        res.json(result);
                    }
                });
            });

            app.post('/createproject', function (req, res) {
                // console.log(req);
                // Authorize request
                var ProjectName = req.param("ProjectName");
                var CompanyName = req.param("CompanyName");
                query.createProject(con, ProjectName, CompanyName, (err, result) => {
                    if (err) {
                        res.sendStatus(500);
                    }
                    else {
                        res.json(result);
                    }
                });
            });

            app.get('/listinstances', function (req, res) {
                // console.log(req);
                //Authorize request
                query.listAllInstances(con, (err, result) => {
                    if (err) {
                        res.sendStatus(500).send(err);
                    }
                    else {
                        res.json(result);
                    }
                });
            });

            app.listen(port, () => console.log(`Example app listening on port ${port}!`));
        }
    });
}
catch (err){
    console.log(err);
}