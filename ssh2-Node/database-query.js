var mysql = require('mysql');
var error_log_stream = require('fs').createWriteStream("./log/error.txt", { flags: 'a' });

async function newCon() {
    return mysql.createConnection({
        host: "solo.ceysu41lzk39.ap-southeast-1.rds.amazonaws.com",
        user: "root",
        password: "osam.io2019",
        database: "SSHManager"
    });
};

async function getUserDetail(user_id, callback) {
    var time = getTime();
    var con = await newCon();
    con.connect(function (err) {
        if (err) {
            con.end();
            callback(err, null);
            throw err;
        }
        else {
            con.query("SELECT * FROM Users WHERE UserID=" + user_id, function (err, result) {
                if (err) {
                    error_log_stream.write(time + "|Get user detail fail.\n");
                    con.end();
                    callback(err, null);
                    throw err;
                }
                else {
                    con.end();
                    callback(null, result);
                }
            });
        }
    });
}

async function getInstanceDetail(instance_id,callback){
    var time = getTime();
    var con = await newCon();
    con.connect(function (err) {
        if (err) {
            con.end();
            callback(err, null);
            throw err;
        }
        else {
            con.query("SELECT * FROM Instances WHERE InstanceID=" + instance_id, function (err, result) {
                if (err) {
                    error_log_stream.write(time + "|Get project detail fail.\n");
                    con.end();
                    callback(err, null);
                    throw err;
                }
                else {
                    con.end();
                    callback(null, result);
                }
            });
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
    getUserDetail,
    getInstanceDetail
};  