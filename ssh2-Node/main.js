var Client = require('ssh2').Client;
const query = require("./database-query");
var io = require('socket.io')(12345);
var instance_id;
if (!require('fs').existsSync("./log/")) {
    require('fs').mkdirSync("./log/");
}

io.on('connection', function (client) {
    var dateTime = getTime();
    var address = client.request.connection.remoteAddress;
    console.log('Client (' + address + ')connected...');
    var userlog = [];
    var res = [];
    var conn = new Client();
    client.on('setupconnection', function (data) {
        try {
            conn_prop = JSON.parse(data);
            instance_id = conn_prop['instance-id'];
            if (!require('fs').existsSync("./log/" + instance_id)) {
                require('fs').mkdirSync("./log/" + instance_id);
            }
            query.getInstanceDetail(conn_prop['instance-id'], (err, result) => {
                if (err) {
                    client.emit('data', "Something was wrong. Please try again later.");
                }
                else {
                    conn.on('ready', function () {
                        var result_log_stream = require('fs').createWriteStream("./log/" + instance_id + "/" + dateTime + "-result.rec", { flags: 'a' });
                        var usercmd_log_stream = require('fs').createWriteStream("./log/" + instance_id + "/" + dateTime + "-usercmd.txt", { flags: 'a' });
                        console.log('Client :: ready');
                        conn.shell(function (err, stream) {
                            if (err)
                                return client.emit('data', '\r\n*** SSH SHELL ERROR: ' + err.message + ' ***\r\n');
                            result_log_stream.write('[{"time":' + new Date().getTime() + ', "value": "User connect established"}');
                            client.on('data', function (data) {
                                usercmd_log_stream.write(data);
                                stream.write(data);
                            });
                            client.on('setsize', function (data) {
                                console.log("Client request change size to " + data.rows + " rows " + data.cols + " cols");
                                stream.setWindow(data.rows, data.cols);
                            });
                            client.on('disconnect', function () {
                                console.log("Client " + address + " disconnected");
                                stream.close();
                                conn.end();
                            });
                            client.on('error', function () {
                                console.log("Client " + address + " error. Disconnected");
                                client.disconnect();
                                stream.close();
                                conn.end();
                            });
                            stream.on('close', function (instance_id) {
                                console.log('Stream :: close');
                                conn.end();
                                result_log_stream.write("]");
                                result_log_stream.close();
                                usercmd_log_stream.close();
                            }).on('data', function (data) {
                                result_log_stream.write("," + JSON.stringify({ time: new Date().getTime(), value: data.toString('binary') }));
                                client.emit('data', data.toString('binary'));
                            });
                        });
                        client.on("new_message", function (data) {
                        });
                    }).on('close', function () {
                        client.emit('data', '\r\n*** SSH CONNECTION CLOSED ***\r\n');
                        client.disconnect();
                    }).on('error', function (err) {
                        client.emit('data', '\r\n*** SSH CONNECTION ERROR: ' + err.message + ' ***\r\n');
                        client.disconnect();
                    }).connect({
                        host: result[0].ipAddress || "0.0.0.0",
                        port: 22,
                        username: result[0].username || 'ubuntu',
                        privateKey: result[0].SSHKey || null
                    });
                }
            });
        }catch(err){
            console.log(err);
            require('fs').appendFile("/log/error.log", getTime() + "|" + err);
        }
    });
});

function getTime(){
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
    return date + '-' + time;
}