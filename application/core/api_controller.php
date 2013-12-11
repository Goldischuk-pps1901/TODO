<?php

class API_Controller {

    private $PARAMETERS = array('id', 'description', 'status');

    function start()
    {
        $uri = $_SERVER['REQUEST_URI'];
        $method = $_SERVER['REQUEST_METHOD'];

        $paths = explode('/', $this->get_paths($uri));

        // splitting of a request
        array_shift($paths); // the first string is always empty
        $resource = array_shift($paths);

        if(array_key_exists(0, $paths)){
            if($paths[0] =='' && !array_key_exists(1, $paths)){
                require_once 'application/views/template_view.php';
                die;
            }
        }

        $api_mark=array_shift($paths);
        $version=array_shift($paths);
        $subject=array_shift($paths);

        // validation of a request
        if ($resource == 'TODO' && $api_mark == 'api' && $version == 'v1.0'  && $subject == 'tasks') {
            if($this->validate_params($method))
                $this->handle_action($method);
            else{
                $result['success']=false;
                $result['error_message']='Description is too long (max 100 signs)';
                echo json_encode($result);
            }

        } else {
            $result['success']=false;
            $result['error_message']='Ajax url is incorrect';
            echo json_encode($result);
        }
    }

    private function get_paths($url) {
        $uri = parse_url($url);
        return $uri['path'];
    }

    private function get_param($url) {
        $uri = parse_url($url);
        if(isset($uri['query']))
            return $uri['query'];
        else
            return null;
    }

    private function validate_paramsN($param){
        $param=explode('&',$param);
        if(count($param)>1) // if quantity of parameters are more than 1, it fails
            return false;
        $param=explode('=',$param[0]);
        if($param[0]!='id') // if parameter's name is not 'id', it fails
            return false;
        if(!isset($param[1]) || !is_numeric($param[1])) // if parameter's value is null or not int, it fails
            return false;
        else
            return true;
    }

    private function validate_params($method){
        switch($method){
            case 'POST':
                if(isset($_POST['description']) && isset($_POST['status'])){
                    if(strlen($_POST['description']<=100))
                        return true;
                }
                else
                    return false;

            case 'PUT':
                if(isset($_GET['id']) && isset($_GET['description']) && isset($_GET['status']))
                    if(strlen($_GET['description'])<=100)
                        return true;
                else
                    return false;

            case 'DELETE':
                if(isset($_GET['id']))
                    return true;
                else
                    return false;

            case 'GET':
                return true;

            default:
                return false;
        }
    }

    private function handle_action($method) {
        $model_path = "application/models/model_todo.php";
        require_once $model_path; // including class 'Model_TODO'
        $db_object = new Model_TODO();

        switch($method) {
            case 'POST':
                $this->create_task($db_object);die;
                break;

            case 'PUT':
                $this->update_task($db_object);
                break;

            case 'DELETE':
                $this->delete_task($db_object);
                break;

            case 'GET':
                $this->get_tasks($db_object);
                break;

            default:
                header('HTTP/1.1 405 Method Not Allowed');
                header('Allow: GET, POST, PUT, DELETE');
                break;
        }
    }

    private function create_task(&$db_object) {
        $description = $_POST['description'];
        $status = $_POST['status'];
        $db_result = $db_object->create_task($description, $status);
        if($db_result===false){
            $result['success']=false;
            $result['error_message']='DB connection problems';
        }
        else{
            $result['success']=true;
            $result['data']=$db_result;
        }
        echo json_encode($result);
    }

    private function update_task(&$db_object) {
        $id = $_GET['id'];
        $description = $_GET['description'];
        $status = $_GET['status'];
        $version = $_GET['version'];
        $db_result = $db_object->update_task($id, $description, $status, $version);
        if($db_result===false){
            $result['success']=false;
            $result['error_message']='This task does not exist or was changed';
        }
        else{
            $result['success']=true;
            $result['data']=$db_result;
        }
        echo json_encode($result);
    }

    private function delete_task(&$db_object) {
        $id = $_GET['id'];
        $version = $_GET['version'];
        $db_result = $db_object->delete_task($id, $version);
        if($db_result===false){
            $result['success']=false;
            $result['error_message']='This task does not exist or was changed';
        }
        else{
            $result['success']=true;
            $result['data']=$db_result;
        }
        echo json_encode($result);
    }

    private function get_tasks(&$db_object) {
        $db_result=$db_object->get_tasks();
        if($db_result===false){
            $result['success']=false;
            $result['error_message']='DB connection problems';
        }
        else{
            $result['success']=true;
            $result['data']=$db_result;
        }
        echo json_encode($result);
    }

//    function ErrorPage404()
//    {
//        $host = 'http://'.$_SERVER['HTTP_HOST'].'/';
//        header('HTTP/1.1 404 Not Found');
//        header("Status: 404 Not Found");
//        header('Location:'.$host.'404');
//    }


}