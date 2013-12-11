<?php

include_once 'application/config/db_cred.inc.php';

class Connect {

    protected $db;
    protected    function __construct(){
        $dsn="mysql:host=" . DB_HOST . ";dbname=" . DB_NAME;
        try{
            $this->db=new PDO($dsn,DB_USER,DB_PASS);
        }
        catch(Exception $e){
            die("Connection failed: ".$e->getMessage());
        }
    }

}