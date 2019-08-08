var term;
var rec;
var speed = 1;
var play;
var playbar;
var current = 0;

window.onkeypress = (event) => {
    event.preventDefault();
}

document.addEventListener("DOMContentLoaded", function () {
    playbar = document.getElementById('play');
    document.getElementById("speed").oninput = function(){
        clearTimeout(play);
        speed = this.value/10;
        render(rec,current);
    };
    playbar.oninput = function(){
        clearTimeout(play);
        term.clear();
        term.write(rec[Math.floor(playbar.value*(rec.length-1)/100)].value);
    }
    playbar.onmouseup = function(){
        clearTimeout(play);
        term.clear();
        render(rec,playbar.value*rec.length/100);
    }
    Terminal.applyAddon(fit);
    var terminalContainer = document.getElementById('terminal');
    term = new Terminal({ cursorBlink: true });
    term.open(terminalContainer);
    window.onresize = function (event) {
        term.fit();
    };
    var fileInput = document.getElementById('file');
    fileInput.addEventListener('change', function (e) {
        var file = fileInput.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            rec = JSON.parse(reader.result);
            render(rec,current);
        }
        reader.readAsText(file);
    });
});

function render(rec,i) {
    i = Math.floor(i);
    if(i==0){
        term.write(rec[i].value);
        i++;
        playbar.value = i*100/rec.length;
        render(rec,i);
    }
    else if(i<rec.length){
        play = setTimeout(function(){
            term.write(rec[i].value);
            i++;
            current = i;
            playbar.value = i*100/rec.length;
            render(rec,i);
        },(rec[i].time-rec[i-1].time)/speed);
    }
};