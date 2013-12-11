jQuery(function($){

    //window.addEventListener("checkCon", function(e) {alert("offline");});
    //window.setInterval(ajax_getTasks,1000);


    CONNECTION=true;
    METHOD=null;
    ID=null; // integer
    DESCRIPTION =""; // string(100)
    STATUS=true; // bool

    REQUEST_STORE=new Array();

    function add_request(){
        var request = {"method" : METHOD, "id" : ID, "description" : DESCRIPTION, "status" : STATUS};
        REQUEST_STORE.push(request);
        //alert(REQUEST_STORE[0].method);
    }
    add_request();

    function process_request(request){
        METHOD = request.method;
        ID = request.id;
        DESCRIPTION = request.description;
        STATUS = request.status;
        switch(METHOD){
            case "GET":
                break;
            case "POST":
                break;
            case "PUT":
                break;
            case "DELETE":
                break;
        }
    }

    function process_requestList(){
        for(i=0; i<REQUEST_STORE.length; i++){
            process_request(REQUEST_STORE[i]);
        }
    }

//       var ajax_list=function (){
//        DESCRIPTION="D1";STATUS=0;
//        ajax_createTmp();
//        DESCRIPTION="D2";STATUS=1;
//        ajax_createTmp();
//        DESCRIPTION="D3";STATUS=0;
//        ajax_createTmp();
//        DESCRIPTION="D4";STATUS=0;
//        ajax_createTmp();
//        DESCRIPTION="D5";STATUS=1;
//        ajax_createTmp();
//        DESCRIPTION="D6";STATUS=0;
//        ajax_createTmp();
//        DESCRIPTION="D7";STATUS=0;
//        ajax_createTmp();
//        DESCRIPTION="D8";STATUS=1;
//        ajax_createTmp();
//        DESCRIPTION="D9";STATUS=0;
//        ajax_createTmp();
    //show_tasks(TASKS);
    //ajax_getTasks();

//ajax_list();
//$("#tmp").bind('click', ajax_list);





//    function add_request(){
//        var request = {"method":"", "id":1, "description":"", "status":""};
//        REQUEST_STORE.push(request);
//        //alert(REQUEST_STORE[0].method);
//    }add_request();
//alert(obj.method+" "+obj.a+" "+obj.b);

})