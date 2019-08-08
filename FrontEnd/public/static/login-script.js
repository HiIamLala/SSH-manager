$("#login-butt").on("click", function () {
    event.preventDefault();
    $("#notification").empty();
    var username = $("#username").val();
    var password = $("#password").val();

    if(username&&password){
        var xhttp = new XMLHttpRequest();
        var data = JSON.stringify({"username":username,"password":password});
        xhttp.onloadend = function () {
            if (this.status == 200) {
                document.cookie = this.responseText;
                window.location.replace("/");
            }
            else if(this.status == 404){
                $("#notification").html("Server drown... ax ax blob blob");
            }
            else{
                $("#notification").html("Wrong username or password");
            }
        }
        xhttp.open("POST", "http://localhost:8080/signin", true);
        xhttp.setRequestHeader("Content-Type","application/json");
        xhttp.send(data);
    }
})