var term;
var socket;
document.addEventListener("DOMContentLoaded", function(){
    Terminal.applyAddon(fit);
    term = new Terminal();
    var terminalContainer = document.getElementById('terminal');
    term = new Terminal({ cursorBlink: true });
    term.open(terminalContainer);
    window.onresize = function(event) {
        term.fit();
        socket.emit('setsize',{rows:term.rows,cols:term.cols});
    };
    socket = io.connect("34.87.58.237:12345");
    socket.emit("setupconnection",JSON.stringify(parseURLParams(window.location.href)));
    socket.on('connect', function () {
        term.write('\r\n*** Connected to backend***\r\n');
        socket.emit('setsize',{rows:term.rows,cols:term.cols});
        
        // Browser -> Backend
        term.on('data', function (data) {
            socket.emit('data', data);
        });
    
        // Backend -> Browser
        socket.on('data', function (data) {
            term.write(data);
        });
    
        socket.on('disconnect', function () {
            term.write('\r\n*** Disconnected from backend***\r\n');
        });
    });
});

function parseURLParams(url) {
    var queryStart = url.indexOf("?") + 1,
        queryEnd = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, i, n, v, nv;

    if (query === url || query === "") return;

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=", 2);
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) parms[n] = [];
        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}