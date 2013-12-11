jQuery(function($){

    STATE_CHANGE=true;
    CONNECTION=true;
    METHOD=null;
    ID=null; // integer
    DESCRIPTION =""; // string(100)
    STATUS=true; // bool
    VERSION=null;
    TIME_DATE=null;
    TASKS=null;

    REQUEST_STORE=new Array();

    $("#logs").val("");
    ajax_getTasks();

    function number_task(){
        for(i=0; i<TASKS.length; i++){
            if(TASKS[i]['id']==ID)
                return i;
        }
    }

    function create_li_status(){
        if(STATUS==true){
            var status_text="Done";
            var background_color = "background-color: green;"
        }
        else{
            var status_text="In process";
            var background_color = "background-color: red;"
        }
        var li=$('<li class="status">');
        $('<span >',
            {"style":background_color, "text":status_text, "class":"drawStatus"}).appendTo(li);
        return li;
    }

     function create_li_description(){
        var li=$('<li>', {"class":"description", "text":DESCRIPTION});
        return li;
    }

    function create_li_time(){
        time=TIME_DATE.split(' ')[0]+' ('+TIME_DATE.split(' ')[1]+')';
        var li=$('<li>', {"class":"time", "text":time});
        return li;
    }

    function create_li_options(id){
        var id_Edit="edit_"+id.toString();
        var id_Delete="delete_"+id.toString();
        var li=$('<li>', {"class":"options"});
        var button_Edit = $('<button>',
            {"class":"btn_Edit", "style":"height: 27px; margin: 5px", "text":"Edit", "id":id_Edit});
        li.append(button_Edit);
        var button_Delete = $('<button>',
            {"class":"btn_Delete", "style":"height: 27px; margin: 5px", "text":"Delete", "id":id_Delete});
        li.append(button_Delete);
        return li;
    }

    function create_ul(){
        var ul=$('<ul>');
        ul.append(create_li_status());
        ul.append(create_li_description());
        ul.append(create_li_time());
        ul.append(create_li_options(ID));
        return ul;
    }

    function create_head_ul(){
        var ul=$('<ul id="headUL">');
        var status_li=$('<li class="status">');
        var description_li=$('<li>', {"class":"description", "text":"Task"});
        var options_li=$('<li>', {"class":"options", "text":"Options"});
        var time_li=$('<li>', {"class":"time", "text":"Time (Date)"});
        ul.append(status_li);
        ul.append(description_li);
        ul.append(time_li);
        ul.append(options_li);
        return ul;
    }

    function show_tasks(tasks){
        $('#container').empty();
        $('#container').append(create_head_ul);
        for(i=0; i<tasks.length; i++){
            ID=tasks[i]['id'];
            DESCRIPTION=tasks[i]['description'];
            STATUS=tasks[i]['status'];      //alert(STATUS);
            TIME_DATE=tasks[i]['time_date'];
            $('#container').append(create_ul);
        }
        $(".btn_Delete").bind("click", launch_delete);
        $(".btn_Edit").bind("click", edit_area);
    }


    function ajax_getTasks(){
        $.ajax({
            "type":"GET",
            "url":"/TODO/api/v1.0/tasks",
            "dataType":"json",
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                CONNECTION = false;
                STATE_CHANGE = false;
                $("#logs").val("Server connection problem");
            },
            "success":function(data){
                if(data['success'] == true){
                    TASKS=data['data'];
                }
                else{
                    $("#logs").val("Task list can not be taken ("+data['error_message']+")");
                }
                if(CONNECTION == false){
                    CONNECTION = true;
                    $("#logs").val("Server is acceptable");
                    process_requestList();
                    window.setTimeout(function(){STATE_CHANGE = true;}, 7000);
                }
                show_tasks(TASKS);
            }
        });
    }

    var ajax_createTask = function(){
        if(DESCRIPTION != null && STATUS != null){
            $.ajax({
                "type":"POST",
                "url":"/TODO/api/v1.0/tasks",
                "data":{"description" : DESCRIPTION, "status" : STATUS},
                "dataType":"json",
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    //alert('failed con: '+ textStatus.toString());
                    CONNECTION = false;
                    $("#create_frame").css("visibility", "hidden");
                    $("#logs").val("Task not created (ERROR)");
                    $("#action_type").text("");
                },
                "success":function(data){
                    if(CONNECTION == false){
                        CONNECTION = true;
                        $("#logs").val("Server is acceptable");
                    }
                    if(data['data']!=null){
                        TASKS=data['data'];
                        $("#logs").val("Task is created");
                        show_tasks(TASKS);
                    }
                    else{
                        $("#logs").val("Task is not created ("+data['error_message']+")");
                    }
                    $("#create_frame").css("visibility", "hidden");
                    $("#action_type").text("");
                }
            });
        }
    }

    var create_task=function(){
        $("#create_frame").css({"margin-top":200, "margin-left":850, "visibility":"visible"});
        $("#desc_newTask").css("border-color", "green");
        $("#desc_newTask").val('');
        $("#id_keeper").val(null);
        $("#action_type").text("Create task");
    }
    $("#add").bind("click", create_task);

    function ajax_updateTask(){
        if(get_task_index(ID) != false)
            var message = "You are no allowed to update  \""+TASKS[get_task_index(ID)]['description']+"\", it was updated while you was being offline";

        if(ID != null && DESCRIPTION != null && STATUS != null && VERSION != null){
            $.ajax({
                "type":"PUT",
                "url":"/TODO/api/v1.0/tasks?id="+ID+"&description="+DESCRIPTION+"&status="+STATUS+"&version="+VERSION,
                "dataType":"json",
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    //alert('failed con: '+ textStatus.toString());
                    CONNECTION = false;
                    $("#create_frame").css("visibility", "hidden");
                    $("#logs").val("Task is not updated (ERROR)");
                    $("#action_type").text("");
                },
                "success":function(data){
                    if(CONNECTION == false){
                        CONNECTION = true;
                        $("#logs").val($("#logs").val()+"\n\n Server is acceptable");
                    }
                    if(data['data']!=null){
                        TASKS=data['data'];
                        $("#logs").val("Task is updated");
                        show_tasks(TASKS);
                    }
                    else{
                        if(STATE_CHANGE == true)
                            $("#logs").val("Task is not updated ("+data['error_message']+")");
                        if(STATE_CHANGE == false && data['error_message'] == 'This task does not exist or was changed'){
                            $("#logs").val($("#logs").val()+"\n\n You are no allowed to update this task, it was deleted or updated while you was being offline. Try to do the same online");
                            if(message != null)
                                alert(message);
                        }
                    }
                    $("#create_frame").css("visibility", "hidden");
                    $("#action_type").text("");
                }
            });
        }

    }

    var confirm_task = function (){
        DESCRIPTION = $("#desc_newTask").val();
        STATUS = $("#status_newTask").val().toString();
        ID = $("#id_keeper").val();
        if($("#action_type").text().split(' ')[0]=="Edit"){
            METHOD = "PUT";
            VERSION = TASKS[get_task_index(ID)]['version'];
            if(CONNECTION == true){
                $("#logs").val("Updating in process...");
                ajax_updateTask();
            }
            else{
                add_request();
                $("#logs").val("Task is updated locally");
                show_tasks(TASKS);
                $("#create_frame").css("visibility", "hidden");
                $("#action_type").text("");
            }

        }
        else{
            METHOD = "POST";
            VERSION = null;
            if(CONNECTION == true){
                $("#logs").val("Creating in process...");
                ajax_createTask();
            }
            else{
                ID = set_local_id();
                add_request();
                $("#logs").val("Task is created locally");
                show_tasks(TASKS);
                $("#create_frame").css("visibility", "hidden");
                $("#action_type").text("");
            }

            $("#logs").val("Creating in process...");

        }
    }

    $("#confirm").bind('click', confirm_task);

    var edit_area = function (){
        ID=this.id.split('_')[1];
        num=number_task();
        pos=(34+num*80).toString()+'px';
        $("#create_frame").css({"margin-top": pos, "margin-left": 20});
        $("#desc_newTask").css("border", "solid slategrey 2px");
        var description = TASKS[num]['description'];
        $("#desc_newTask").val(description);
        $("#action_type").text("Edit task");
        $("#create_frame").css("visibility", "visible");
        var status = TASKS[num]['status'];
        if(status == 0){
            $("#status_newTask").empty();
            var option=$('<option selected="selected" value="false">In process</option>');
            $("#status_newTask").append(option);
            option=$('<option value="true">Done</option>');
            $("#status_newTask").append(option);
        }
        else{
            $("#status_newTask").empty();
            var option=$('<option selected="selected" value="true">Done</option>');
            $("#status_newTask").append(option);
            option=$('<option value="false">In process</option>');
            $("#status_newTask").append(option);
        }
        $("#id_keeper").val(ID);
    }
    $(".btn_Edit").bind("click", edit_area);

    var ajax_deleteTask = function(){
        var task = TASKS[get_task_index(ID)]['description'];
        $.ajax({
            "type":"DELETE",
            "url":"/TODO/api/v1.0/tasks?id="+ID+"&version="+VERSION,
            "dataType":"json",
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                //alert('failed con: '+ textStatus.toString());
                CONNECTION = false;
                $("#create_frame").css("visibility", "hidden");
                $("#logs").val("Task not updated (ERROR)");
            },
            "success":function(data){
                if(CONNECTION == false){
                    CONNECTION = true;
                    $("#logs").val("Server is acceptable");
                }
                if(data['data']!=null){
                    TASKS=data['data'];
                    $("#logs").val($("#logs").val().toString()+"\n\n Task is deleted");
                    show_tasks(TASKS);
                }
                else{
                    if(STATE_CHANGE == true)
                        $("#logs").val("Task is not updated ("+data['error_message']+")");
                    if(STATE_CHANGE == false && data['error_message'] == 'This task does not exist or was changed'){
                        $("#logs").val($("#logs").val().toString()+"\n\nYou are no allowed to delete this task, it was deleted or updated while you was being offline");
                        alert("You are no allowed to delete  \""+task+"\" . It was deleted or updated while you was being offline. Try to do the same online");
                    }
                }
                $("#create_frame").css("visibility", "hidden");
            }
        });

    }

    var launch_delete=function(){
        METHOD = "DELETE";
        ID=this.id.split('_')[1];
        DESCRIPTION = null;
        STATUS = null;
        VERSION = TASKS[get_task_index(ID)]['version'];
        if(CONNECTION == true){
            $("#logs").val("Deleting in process...");
            ajax_deleteTask();
        }
        else{
            add_request();
            $("#logs").val("Task is deleted locally");
            show_tasks(TASKS);
        }
    }

    // updating data after 5 seconds
    window.setInterval(ajax_getTasks,5000);

//____________________________________________________________________

    function set_local_id(){
        id_max = 0;
        for(i=0 ; i < TASKS.length-1 ; i++){
            if(TASKS[i+1]['id'] > TASKS[i]['id'])
                id_max = TASKS[i+1]['id'];
        }
        id_local = id_max*1 + 1;
        return id_local;
    }

    function get_task_index(id){
        for(i=0; i<TASKS.length; i++){
            if(TASKS[i]['id'] == id)
                return i;
        }
        return false;
    }

    function update_local(id){
        var task_index = get_task_index(id);
        if(TASKS[task_index] != null){
            TASKS[task_index]['description'] = DESCRIPTION;     //alert(STATUS);
            TASKS[task_index]['status'] = (STATUS == 'true') ? 1 : 0;
        }
    }

    function delete_local(id){
        var task_index = get_task_index(id);
        if(TASKS[task_index] != null){
            TASKS[task_index]['description'] = null;
            TASKS[task_index]['status'] = null;
            TASKS[task_index]['time_date'] = null;
            TASKS[task_index]['version'] = null;
            TASKS[task_index]['id'] = null;
            TASKS.splice(task_index, 1);
        }
    }

    function find_request_index(id){
        for(i=0; i<REQUEST_STORE.length; i++){
            if(REQUEST_STORE[i].id == id)
                return i;
        }
        return false;
    }

    function add_request(){
        switch (METHOD){
            case 'POST':
                var task = new Array();
                task['id'] = ID;
                task['description'] = DESCRIPTION;
                task['status'] = (STATUS == 'true') ? 1 : 0;
                task['time_date'] = 'not_set_yet not_set_yet ';
                task['version'] = 0;    // for tasks created locally
                task['local'] = true;
                TASKS.push(task);
                request = {"method" : METHOD, "id" : ID, "description" : DESCRIPTION, "status" : STATUS, "version" : VERSION};
                REQUEST_STORE.push(request);
                break;
            case 'PUT':
                update_local(ID);
                if(TASKS[get_task_index(ID)]['local'] == null){
                    request = {"method" : METHOD, "id" : ID, "description" : DESCRIPTION, "status" : STATUS, "version" : VERSION};
                    REQUEST_STORE.push(request);
                }
                else{
                    var request_index = find_request_index(ID);
                    if(REQUEST_STORE[request_index] != null){
                        REQUEST_STORE[request_index].description = DESCRIPTION;
                        REQUEST_STORE[request_index].status = STATUS;
                    }
                }
                break;
            case 'DELETE':
                if(TASKS[get_task_index(ID)]['local'] == null){
                    request = {"method" : METHOD, "id" : ID, "description" : DESCRIPTION, "status" : STATUS, "version" : VERSION};
                    REQUEST_STORE.push(request);
                }
                else{
                    var request_index = find_request_index(ID);
                    if(REQUEST_STORE[request_index] != null){
                        REQUEST_STORE[request_index].description = null;
                        REQUEST_STORE[request_index].status = null;
                        REQUEST_STORE.splice(request_index, 1);
                    }
                }
                delete_local(ID);
                break;
            default :
                break;
        }
        //REQUEST_STORE.push(request);
        $("#logs").val("Request is stored");
    }
    //add_request();

    function process_request(request){
        METHOD = request.method;
        ID = request.id;
        DESCRIPTION = request.description;
        STATUS = request.status;
        VERSION = request.version;
        switch(METHOD){
            case "POST":
                ajax_createTask();
                break;
            case "PUT":
                if(get_task_index(ID) == false){
                    $("#logs").val($("#logs").val().toString()+"\n\n You are no allowed to update this task, it was deleted while you was being offline");
                    alert("You are no allowed to update  \""+DESCRIPTION+"\" .It was deleted while you was being offline");
                }
                else
                    ajax_updateTask();
                break;
            case "DELETE":
                ajax_deleteTask();
                break;
            default :
                break;
        }
    }

    function process_requestList(){
        var i=0;
        for(i=0; i<REQUEST_STORE.length;){
            process_request(REQUEST_STORE[i]);
            REQUEST_STORE[i] = null;
            i=i+1;
        }
        REQUEST_STORE = new Array();
        //$("#logs").val("Requests are implemented");
    }
})