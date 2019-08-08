document.addEventListener("DOMContentLoaded", function () {
    getlistuser();

    $("#project-create-confirm").click(function(){
        project_users = [];
        $('#list-user-data').find(':checked').forEach(element=>{
            project_users.push(element.attr('user-id'));
        });
        if(!project_users.includes($("#project-create-manager").val())){
            project_users.push($("#project-create-manager").val());
        }
        var xhttp = new XMLHttpRequest();
        xhttp.onloadend = function(){
            noti(new Date().getTime(),"Success","Create project success");
        };
        xhttp.open("POST",  `http://localhost:8080/createproject?token=`+JSON.parse(document.cookie).token, true);
        var data = JSON.stringify({
            "ProjectName":$("#project-create-name").val(),
            "CompanyName":$("#project-create-company").val(),
            "ProjectManager":$("#project-create-manager").val(),
            "UserList":project_users
        });
        xhttp.send(data);
    });
});

function getlistuser(){
    var xhttp = new XMLHttpRequest();
    xhttp.onloadend = function(){
        if(this.status==200 && this.responseText) {
            function createUser(user_id,user_name){
                $("#list-user-data").append(`
                <span class="list-wrap">
                    <input type="checkbox" id="user-${user_id}" user-id="${user_id}"/>
                    <label for="user-${user_id}" class="list">
                        <i class="fa fa-check"></i>
                    ${user_name}
                    </label>
                </span>`
                );
                $("#project-create-manager").append(`<option data-tokens="${user_name}" value="${user_id}">${user_name}</option>`);
            }
            data = JSON.parse(this.responseText);
            data.forEach(element => {
                createUser(element.UserID,element.UserName);
            });
            $('#project-create-manager').selectpicker('refresh');
        }
        else if(this.status==456){
            window.location.replace("/login");
        }
    };
    xhttp.open("GET",  `http://localhost:8080/listalluser?token=`+JSON.parse(document.cookie).token, true);
    xhttp.send();
}

function noti(id, header, content) {
    $("#noti-holder").append(`<div id="${id}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
            <strong class="mr-auto">${header}</strong>
            <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="toast-body">
            ${content}.
        </div>
    </div>`
    );
    $(`#${id}`).toast({delay:10000});
    $(`#${id}`).toast("show");
}