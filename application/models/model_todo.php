<?php

require_once 'connect.php';

class Model_TODO extends Connect{

    function __construct(){
        parent::__construct();
    }

    function create_task($description, $status) {
        $status = ($status == 'true') ? 1 : 0;
        $time_date = date("H:i j.n.Y");
        $sql="INSERT INTO tasks
                (description, time_date, status, version)
              VALUES
                    (:description, :time_date, :status, 1)";
        $stmt=$this->db->prepare($sql);
        $stmt->bindParam(":description", $description);
        $stmt->bindParam(":time_date", $time_date);
        $stmt->bindParam(":status", $status);
        try{
            $success=$stmt->execute();
        }
        catch(Exception $e){
            //echo $e->getMessage();
            return false;
        }
        if($success == true)
            $result = $this->get_tasks();
        else
            $result=false;
        $stmt->closeCursor();
        return $result;
    }

    function update_task($id, $description, $status, $version) {
        if($this->get_task($id) === false)
            return false;
        $version_last = $this->get_version($id);
        if($version_last === false || $version_last!=$version)
            return false;

        $status = ($status == 'true') ? 1 : 0;
        $version++;
        $sql="UPDATE tasks
              SET description=:description, status=:status, version=:version
              WHERE id=:id";
        $stmt=$this->db->prepare($sql);
        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":description", $description);
        $stmt->bindParam(":status", $status);
        $stmt->bindParam(":version", $version);
        try{
            $success=$stmt->execute();
        }
        catch(Exception $e){
            //echo $e->getMessage();
            return false;
        }
        if($success == true)
            $result = $this->get_tasks();
        else
            $result=false;
        $stmt->closeCursor();
        return $result;
    }

    function delete_task($id, $version) {
        if($this->get_task($id) === false)
            return false;
        $version_last = $this->get_version($id);
        if($version_last === false || $version_last!=$version)
            return false;

        $sql="DELETE FROM tasks
              WHERE id=:id";
        $stmt=$this->db->prepare($sql);
        $stmt->bindParam(":id", $id);
        try{
            $success=$stmt->execute();
        }
        catch(Exception $e){
            //echo $e->getMessage();
            return false;
        }
        if($success == true)
            $result = $this->get_tasks();
        else
            $result=false;
        $stmt->closeCursor();
        return $result;
    }

    function get_tasks() {
        $sql="SELECT
                id, description, time_date, status, version
              FROM tasks";
        $stmt=$this->db->prepare($sql);
        try{
            $success=$stmt->execute();
        }
        catch(Exception $e){
            //echo $e->getMessage();
            return false;
        }
        if($success == true)
            $result=$stmt->fetchAll(PDO::FETCH_ASSOC);
        else
            $result=false;
        $stmt->closeCursor();
        return $result;
    }

    function get_task($id) {
        $sql="SELECT
                id, description, time_date, status, version
              FROM tasks
              WHERE id=:id";
        $stmt=$this->db->prepare($sql);
        $stmt->bindParam(':id', $id);
        try{
            $success=$stmt->execute();
        }
        catch(Exception $e){
            //echo $e->getMessage();
            return false;
        }
        if($success == true){
            $result=$stmt->fetchAll(PDO::FETCH_ASSOC);
            if(count($result) == 0)
                $result = false;
        }
        else
            $result=false;
        $stmt->closeCursor();
        return $result;
    }

    private function get_version($id){
        $sql="SELECT
                version
              FROM tasks
              WHERE id=:id";
        $stmt=$this->db->prepare($sql);
        $stmt->bindParam(':id', $id);
        try{
            $success=$stmt->execute();
        }
        catch(Exception $e){
            return false;
        }
        if($success == true){
            $result=$stmt->fetchAll(PDO::FETCH_ASSOC);
            if(count($result) == 0)
                $result = false;
            $result = $result[0]['version'];
        }
        else
            $result=false;
        $stmt->closeCursor();
        return $result;
    }
}