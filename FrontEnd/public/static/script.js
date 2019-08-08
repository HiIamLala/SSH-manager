var main_container;

document.addEventListener("DOMContentLoaded", function () {
    main_container = document.getElementById("main-container");
    initUser((err,result)=>{
        initProjectList();
    });
});


function initProjectList(){
    var project_list = document.getElementById("Projects_list");
    var xhttp = new XMLHttpRequest();
    xhttp.onloadend = function () {
        if (this.status == 200) {
            var result = JSON.parse(this.responseText);
            if(!result.length){
                var temp = document.createElement('a');
                temp.classList.add("dropdown-item");
                temp.innerHTML = "Sorry. You're not belong to any project";
                project_list.appendChild(temp);
            }
            else{
                result.forEach(element => {
                    var temp = document.createElement('a');
                    temp.classList.add("dropdown-item");
                    temp.innerHTML = element.ProjectName;
                    temp.href = "project?id=" + element.ProjectID;
                    project_list.appendChild(temp);
                });
            }
        }
        else if(this.status == 456) {
            window.location.replace("/login");
        }
    };
    xhttp.open("GET", "http://localhost:8080/listprojects?token="+JSON.parse(document.cookie).token, true);
    xhttp.send();
}

function initUser(callback){
    if(document.cookie!=null){
        try{
            var session_data = JSON.parse(document.cookie);
            document.getElementById("username").innerHTML = "Hi " + session_data.UserName;
            if(session_data.IsAdmin){
                var create_project = document.createElement("a");
                create_project.classList.add("dropdown-item");
                create_project.innerHTML = "Create new project";
                create_project.href = "createproject";
                document.getElementById("Projects_list").appendChild(create_project);
                var devider_bar = document.createElement("div");
                devider_bar.classList.add("dropdown-divider");
                document.getElementById("Projects_list").appendChild(devider_bar);
            }
            callback();
        }
        catch (err){
            window.location.replace("/login");
        }
    }
    else{
        window.location.replace("/login");
    }
}