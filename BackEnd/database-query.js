var mysql = require('mysql');
var error_log_stream = require('fs').createWriteStream("./log/error.txt", { flags: 'a' });

function newCon() {
    return mysql.createConnection({
        host: "solo.ceysu41lzk39.ap-southeast-1.rds.amazonaws.com",
        user: "root",
        password: "osam.io2019",
        database: "SSHManager"
    });
};

function updateInstance(con, instance_prop, callback) {
    var change = [];
    var time = getTime();
    if (instance_prop.InstanceID) {
        if (instance_prop.InstanceName) {
            change.push(`InstanceName="${instance_prop.InstanceName}"`);
        }
        if (instance_prop.ARN) {
            change.push(`ARN="${instance_prop.ARN}"`);
        }
        if (instance_prop.IpAddress) {
            change.push(`IpAddress="${instance_prop.IpAddress}"`);
        }
        if (instance_prop.InstanceUser) {
            change.push(`InstanceUser="${instance_prop.InstanceUser}"`);
        }
        // var con = await newCon();
        // con.connect(function (err) {
        //     if (err) {
        //         // con.end();
        //         callback(err, null);
        //         throw err;
        //     }
        //     else {
        if(change.length){
            con.query(`UPDATE Instances SET ${change.join(", ")} WHERE InstanceID=${instance_prop.InstanceID}`, function (err, result) {
                if (err) {
                    error_log_stream.write(time + "|Instance update fail.\n");
                    // con.end();
                    callback(err, null);
                    throw err;
                }
                else {
                    callback(null, "Instance change saved");
                }
            });
        }
        else{
            if (instance_prop.Users) {
                con.query(`DELETE FROM Instances_Users WHERE InstanceID=${instance_prop.InstanceID}`,(err,result)=>{
                    if(err){
                        callback(err,null);
                    }
                    else{
                        alert = null;
                        instance_prop.Users.forEach(element=>{
                            con.query(`INSERT INTO Instances_Users (InstanceID,UserID) VALUES (${instance_prop.InstanceID},${element})`,(err,result)=>{
                                if(err){
                                    alert = err;
                                }
                            });
                        });
                        if(alert){
                            callback(err,null);
                        }
                        else{
                            callback(null,"Instance change saved");
                        }
                    }
                });
            }
            else{
                callback(null,null);
            }
        }
        //     }
        // });
    }
    else {
        callback(401, null);
    }
}

function createInstance(con, InstanceName, ARN, IpAddress, SSHKey, ProjectID, InstanceUser, callback) {
    var time = getTime();
    // var con = await newCon();
    // con.connect(function (err) {
    //     if (err) {
    //         // con.end();
    //         callback(err, null);
    //         throw err;
    //     }
    //     else {
    con.query(`INSERT INTO Instances (InstanceName,ARN,ipAddress,SSHKey,ProjectID,InstanceUser) VALUES ("${InstanceName}","${ARN}","${IpAddress}","${SSHKey}","${ProjectID}","${InstanceUser}")`, function (err, result) {
        if (err) {
            error_log_stream.write(time + "|Instance insert fail.\n");
            // con.end();
            callback(err, null);
            throw err;
        }
        else {
            // con.end();
            callback(null, "Instance inserted.");
        }
    });
    //     }
    // });
}

function listAllInstances(con, callback) {
    var time = getTime();
    // var con = await newCon();
    // con.connect(function (err) {
    //     if (err) {
    //         // con.end();
    //         callback(err, null);
    //         throw err;
    //     }
    //     else {
    con.query("SELECT * FROM Instances", function (err, result, fields) {
        if (err) {
            error_log_stream.write(time + "|Get all instances fail.\n");
            // con.end();
            callback(err, null);
            throw err;
        }
        else {
            // console.log("List of Instances:\n------------------------------------------------------------------");
            // console.log("Instance ID \t ARN \t ipAddress \t SSHKey \t ProjectID");
            // result.forEach(element => {
            //     console.log(element.InstanceID + "\t" + element.ARN + "\t" + element.ipAddress + "\t" + element.SSHKey + "\t" + element.ProjectID);
            // });
            // con.end();
            callback(null, result);
        }
    });
    //     }
    // });
}

function createProject(con, ProjectName, CompanyName, ProjectManager, callback) {
    var time = getTime();
    // var con = await newCon();
    // con.connect(function (err) {
    //     if (err) {
    //         // con.end();
    //         callback(err, null);
    //         throw err;
    //     }
    //     else {
    var sql = `INSERT INTO Projects (ProjectName,CompanyName,ProjectManager) VALUES ("${ProjectName}","${CompanyName}","${ProjectManager}")`;
    con.query(sql, function (err, result) {
        if (err) {
            error_log_stream.write(time + "|Project " + ProjectName + " insert fail.\n");
            // con.end();
            callback(err, null);
            throw err;
        }
        else {
            // con.end();
            con.query('SELECT LAST_INSERT_ID() FROM Projects',(err,result2)=>{
                if (err) {
                    error_log_stream.write(time + "|Project " + ProjectName + " insert fail.\n");
                    // con.end();
                    callback(err, null);
                    throw err;
                }
                else if(!result){
                    callback(500, null);
                }
                else{
                    callback(err,result2);
                }
            });
           
        }
    });
    //     }
    // });
}

function listAllProjects(con, callback) {
    var time = getTime();
    // var con = await newCon();
    // con.connect(function (err) {
    //     if (err) {
    //         // con.end();
    //         callback(err, null);
    //         throw err;
    //     }
    //     else {
    con.query("SELECT * FROM Projects", function (err, result) {
        if (err) {
            error_log_stream.write(time + "|Get all instances fail.\n");
            // con.end();
            callback(err, null);
            throw err;
        }
        else {
            // console.log("List of Projects:\n---------------------------------------------");
            // console.log("Project ID \t Project Name \t Company Name");
            // result.forEach(element => {
            //     console.log(element.ProjectID + "\t" + element.ProjectName + "\t" + element.CompanyName);
            // });
            // con.end();
            callback(null, result);
        }
    });
    //     }
    // });
}

function listProjects(con, user_id, callback) {
    var time = getTime();
    // var con = await newCon();
    // con.connect(function (err) {
    //     if (err) {
    //         // con.end();
    //         callback(err, null);
    //         throw err;
    //     }
    //     else {
    con.query(`SELECT p.ProjectName, p.ProjectID FROM Projects_Users AS pu, Projects AS p WHERE (pu.UserID=${user_id} AND pu.ProjectID = p.ProjectID)`, function (err, result) {
        if (err) {
            error_log_stream.write(time + "|Get list project of user fail.\n");
            // con.end();
            callback(err, null);
            throw err;
        }
        else {
            // con.end();
            callback(null, result);
        }
    });
    //     }
    // });
}

function getProjectDetail(con, project_id, callback) {
    var time = getTime();
    // var con = await newCon();
    // con.connect(function (err) {
    //     if (err) {
    //         // con.end();
    //         callback(err, null);
    //         throw err;
    //     }
    //     else {
    if(Number.isInteger(Number(project_id))){
        con.query(`SELECT * FROM Projects WHERE ProjectID=${project_id}`, function (err, result) {
            if (err) {
                error_log_stream.write(time + "|Get project detail fail.\n");
                // con.end();
                callback(err, null);
                throw err;
            }
            else if (result) {
                if (result[0].ProjectManager == null) {
                    result[0].ProjectManagerName = "Not defined";
                    callback(null, result);
                }
                else {
                    con.query(`SELECT UserName FROM Users WHERE UserID=${result[0].ProjectManager}`, function (err, res) {
                        if (err) {
                            error_log_stream.write(time + "|Get user detail fail.\n");
                            // con.end();
                            callback(err, null);
                            throw err;
                        }
                        else {
                            // con.end();
                            result[0].ProjectManagerName = res[0].UserName;
                            callback(null, result);
                        }
                    });
                }
            }
            else {
                callback(null, result);
            }
        });
    }
    else{
        callback(401,null);
    }
    //     }
    // });
}

function listProjectInstances(con, project_id, callback) {
    var time = getTime();
    // var con = await newCon();
    // con.connect(function (err) {
    //     if (err) {
    //         // con.end();
    //         callback(err, null);
    //         throw err;
    //     }
    //     else {
    con.query(`SELECT * FROM Instances WHERE ProjectID=${project_id}`, function (err, result) {
        if (err) {
            error_log_stream.write(time + "|Get project instances fail.\n");
            // con.end();
            callback(err, null);
            throw err;
        }
        else {
            // con.end();
            callback(null, result);
        }
    });
    //     }
    // });
}

function listProjectInstancesAvail(con, user_id, project_id, callback) {
    var time = getTime();
    // var con = await newCon();
    // con.connect(function (err) {
    //     if (err) {
    //         // con.end();
    //         callback(err, null);
    //         throw err;
    //     }
    //     else {
    con.query(`SELECT * FROM Instances AS i, Instances_Users as iu WHERE i.ProjectID=${project_id} AND i.InstanceID=iu.InstanceID AND iu.UserID=${user_id}`, function (err, result) {
        if (err) {
            error_log_stream.write(time + "|Get project instances fail.\n");
            // con.end();
            callback(err, null);
            throw err;
        }
        else {
            // con.end();
            callback(null, result);
        }
    });
    //     }
    // });
}

function getUserDetail(con, user_id, callback) {
    var time = getTime();
    // var con = await newCon();
    // con.connect(function (err) {
    //     if (err) {
    //         // con.end();
    //         callback(err, null);
    //         throw err;
    //     }
    //     else {
    con.query(`SELECT * FROM Users WHERE UserID=${user_id}`, function (err, result) {
        if (err) {
            error_log_stream.write(time + "|Get user detail fail.\n");
            // con.end();
            callback(err, null);
            throw err;
        }
        else {
            // con.end();
            callback(null, result);
        }
    });
    //     }
    // });
}

function getInstanceDetail(con, instance_id, callback) {
    var time = getTime();
    // var con = await newCon();
    // con.connect(function (err) {
    //     if (err) {
    //         // con.end();
    //         callback(err, null);
    //         throw err;
    //     }
    //     else {
    con.query(`SELECT * FROM Instances WHERE InstanceID=${instance_id}`, function (err, result) {
        if (err) {
            error_log_stream.write(time + "|Get instance detail fail.\n");
            // con.end();
            callback(err, null);
            throw err;
        }
        else {
            // con.end();
            callback(null, result);
        }
    });
    //     }
    // });
}

function login(con, username, password, callback) {
    var time = getTime();
    // var con = await newCon();
    // con.connect(function (err) {
    //     if (err) {
    //         // con.end();
    //         callback(err, null);
    //         throw err;
    //     }
    //     else {
    con.query(`SELECT * FROM Users WHERE UserName="${username}" AND UserPass="${password}"`, function (err, result) {
        if (err) {
            error_log_stream.write(time + "|Wrong user identify\n");
            // con.end();
            callback(err, null);
            throw err;
        }
        else {
            if (result.length) {
                var valid = new Date().getTime() + 3600000;
                var token = String(valid + "@" + result[0].UserID + "@" + Math.random().toString(36).substring(2, 15));
                con.query(`UPDATE Users SET Token="${token}" WHERE UserID=${result[0].UserID}`, function (err, res) {
                    if (err) {
                        error_log_stream.write(time + "|Get user detail fail.\n");
                        // con.end();
                        callback(err, null);
                        throw err;
                    }
                    else {
                        // con.end();
                        callback(null, { "token": token, "UserID": result[0].UserID, "IsAdmin": result[0].IsAdmin, "UserName": result[0].UserName });
                    }
                });
            }
            else {
                callback(null, null);
            }
        }
    });
    //     }
    // });
}

function getUserFromToken(con, token, callback) {
    var time = getTime();
    // var con = await newCon();
    // con.connect(function (err) {
    //     if (err) {
    //         // con.end();
    //         callback(err, null);
    //         throw err;
    //     }
    //     else {
    con.query(`SELECT * FROM Users WHERE Token="${token}"`, function (err, result) {
        if (err) {
            error_log_stream.write(time + "|Get user from token fail.\n");
            // con.end();
            callback(err, null);
            throw err;
        }
        else {
            if (result.length) {
                // con.end();
                callback(null, result[0]);
            }
            else {
                // con.end();
                callback(null, null);
            }
        }
    });
    //     }
    // });
}

function isUserBelongProject(con, user_id, project_id, callback) {
    var time = getTime();
    // var con = await newCon();
    // con.connect(function (err) {
    //     if (err) {
    //         // con.end();
    //         callback(err, null);
    //         throw err;
    //     }
    //     else {
    con.query(`SELECT * FROM Projects_Users AS pu, Projects AS p WHERE (pu.UserID=${user_id} AND pu.ProjectID=${project_id}) OR (p.ProjectManager=${user_id} AND p.ProjectID=${project_id})`, function (err, result) {
        if (err) {
            error_log_stream.write(time + "|Check user belong to project fail.\n");
            // con.end();
            callback(err, null);
            throw err;
        }
        else {
            if (result.length) {
                // con.end();
                callback(null, true);
            }
            else {
                // con.end();
                callback(null, false);
            }
        }
    });
    //     }
    // });
}

function getSSHtoken(con, user_id, instance_id, callback){
    var time = getTime();
    if (!user_id || !instance_id) callback(401, null);
    else {
        var valid = new Date().getTime() + 300000;
        var token = String(user_id + "@" + Math.random().toString(36).substring(2, 15) + "-" + valid);
        con.query(`UPDATE Instances_Users SET SessionToken="${token}" WHERE InstanceID=${instance_id} AND UserID=${user_id}`, function(err,result){
            if(err){
                error_log_stream.write(time + "|Get ssh token fail.\n");
                // con.end();
                callback(err, null);
                throw err;
            }
            else {
                callback(null,token);
            }
        });
    }
}

function isManagerInstance(con, user_id, instance_id, callback) {
    var time = getTime();
    // var con = await newCon();
    if (!user_id || !instance_id) callback(401, null);
    else {
        // con.connect(function (err) {
        //     if (err) {
        //         // con.end();
        //         callback(err, null);
        //         throw err;
        //     }
        //     else {
        con.query(`SELECT * FROM Instances AS i, Projects AS p WHERE i.ProjectID=p.ProjectID AND p.ProjectManager=${user_id} AND i.InstanceID=${instance_id}`, function (err, result) {
            if (err) {
                error_log_stream.write(time + "|Check instance manager fail.\n");
                // con.end();
                callback(err, null);
                throw err;
            }
            else {
                if (result.length) {
                    // con.end();
                    callback(null, true);
                }
                else {
                    // con.end();
                    callback(null, false);
                }
            }
        });
        //     }
        // });
    }
}

function removeInstance(con, instance_id, callback) {
    var time = getTime();
    // var con = await newCon();
    // con.connect(function (err) {
    //     if (err) {
    //         // con.end();
    //         callback(err, null);
    //         throw err;
    //     }
    //     else {
    con.query(`DELETE FROM Instances_Users WHERE InstanceID=${instance_id}`,(err,result)=>{
        if(err){
            error_log_stream.write(time + "|Delete instance relation user fail.\n");
            // con.end();
            callback(err, null);
            throw err;
        }
        else{
            con.query(`DELETE FROM Instances WHERE InstanceID=${instance_id}`, function (err, result2) {
                if (err) {
                    error_log_stream.write(time + "|Delete instance fail.\n");
                    // con.end();
                    callback(err, null);
                    throw err;
                }
                else {
                    callback(null, true);
                }
            });
        }
    });
    
    //     }
    // });
}

function removeProject(con, project_id, callback) {
    var time = getTime();
    // var con = await newCon();
    // con.connect(function (err) {
    //     if (err) {
    //         // con.end();
    //         callback(err, null);
    //         throw err;
    //     }
    //     else {
    con.query(`DELETE FROM Instances WHERE ProjectID=${project_id}`, function (err, result){
        if(err){
            error_log_stream.write(time + "|Clear project instance assigned.\n");
            // con.end();
            callback(err, null);
            throw err;
        }
        else{
            con.query(`DELETE FROM Projects_Users WHERE ProjectID=${project_id}`, function (err, result2) {
                if(err){
                    error_log_stream.write(time + "|Clear project user assigned.\n");
                    // con.end();
                    callback(err, null);
                    throw err;
                }
                else{
                    con.query(`DELETE FROM Projects WHERE ProjectID=${project_id}`, function (err, result3) {
                        if (err) {
                            error_log_stream.write(time + "|Delete project fail.\n");
                            // con.end();
                            callback(err, null);
                            throw err;
                        }
                        else {
                            callback(null, true);
                        }
                    });
                }
            });
        }
    });
    
    //     }
    // });
}

function listAllUser(con, user_id, callback) {
    var time = getTime();
    // var con = await newCon();
    // con.connect(function (err) {
    //     if (err) {
    //         // con.end();
    //         callback(err, null);
    //         throw err;
    //     }
    //     else {
    con.query(`SELECT UserID, UserName FROM Users WHERE UserID!=${user_id}`, function (err, result) {
        if (err) {
            error_log_stream.write(time + "|List all user fail.\n");
            // con.end();
            callback(err, null);
            throw err;
        }
        else {
            callback(null, result);
        }
    });
    //     }
    // });
}

function updateUserOfProject(con, projec_id, users, callback){
    var time = getTime();
    getProjectDetail(con, projec_id, (err,result)=>{
        if(err){
            callback(err,null);
        }
        else if(result){
            con.query(`DELETE FROM Projects_Users WHERE ProjectID=${projec_id}`,(err,result2)=>{
                if(err){
                    error_log_stream.write(time + `|Clear all user of project ${project_id} fail.\n`);
                    // con.end();
                    callback(err, null);
                    throw err;
                }
                else{
                    users.forEach(element => {
                        getUserDetail(con, element, (err,result3)=>{
                            if(err){
                                error_log_stream.write(time + `|Assign user for project ${project_id} fail.\n`);
                                // con.end();
                                callback(err, null);
                                throw err;
                            }
                            else if(result3){
                                con.query(`INSERT INTO Projects_Users (ProjectID, UserID) VALUES (${projec_id},${element})`);
                            }
                            else{
                                callback(500,null);
                            }
                        });
                    });
                    callback(null,projec_id);
                }
            });
        }
        else{
            callback(500,null);
        }
    });
}

function getUserofInstance(con, instance_id, callback){
    var time = getTime();
    con.query(`SELECT u.UserID, u.UserName FROM Users AS u, Instances_Users AS iu WHERE u.UserID=iu.UserID AND iu.InstanceID=${instance_id}`, function (err, result) {
        if (err) {
            error_log_stream.write(time + "|List all user fail.\n");
            callback(err, null);
            throw err;
        }
        else {
            callback(null, result);
        }
    });
}

function getUserofProject(con, project_id, callback){
    var time = getTime();
    con.query(`SELECT u.UserID, u.UserName FROM Users AS u, Projects_Users AS pu WHERE u.UserID=pu.UserID AND pu.ProjectID=${project_id}`, function (err, result) {
        if (err) {
            error_log_stream.write(time + "|List all user fail.\n");
            callback(err, null);
            throw err;
        }
        else {
            callback(null, result);
        }
    });
}

function getTime() {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return date + ' ' + time;
}

module.exports = {
    newCon,
    createInstance,
    listAllInstances,
    createProject,
    listAllProjects,
    getProjectDetail,
    listProjectInstances,
    listProjects,
    getUserDetail,
    getInstanceDetail,
    login,
    getUserFromToken,
    isUserBelongProject,
    listProjectInstancesAvail,
    updateInstance,
    isManagerInstance,
    removeInstance,
    removeProject,
    listAllUser,
    updateUserOfProject,
    getSSHtoken,
    getUserofInstance,
    getUserofProject
};  