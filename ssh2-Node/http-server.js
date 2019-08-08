var http = require('http');
var fs = require('fs');
var path = require('path');


var port = 8080;

console.log("Server is listening on port " + port + " (localhost:"+port+")");
http.createServer(function(req, res){
    if(req.url === "/"){
        fs.readFile("./index.html", "UTF-8", function(err, html){
            res.writeHead(200, {"Content-Type": "text/html"});
            return res.end(html);
        });
    }else if(req.url.match("\.css$")){
        var cssPath = path.join(__dirname, req.url);
        var fileStream = fs.createReadStream(cssPath, "UTF-8");
        res.writeHead(200, {"Content-Type": "text/css"});
        fileStream.pipe(res);
    }else if(req.url.match("\.js$")){
        var jsPath = path.join(__dirname, req.url);
        var fileStream = fs.createReadStream(jsPath);
        res.writeHead(200, {"Content-Type": "text/javascript"});
        fileStream.pipe(res);
    }else if(req.url.match("\.png$")){
        var imagePath = path.join(__dirname, req.url);
        var fileStream = fs.createReadStream(imagePath);
        res.writeHead(200, {"Content-Type": "image/png"});
        fileStream.pipe(res);
    }else{
        res.writeHead(404, {"Content-Type": "text/html"});
        return res.end("No Page Found");
    }
}).listen(8080);