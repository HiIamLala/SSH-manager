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
    socket = io.connect("127.0.0.1:12345");
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
