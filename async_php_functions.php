<?php
session_start();
require 'operations_tracking.php'; 
//
// values in the session array that can not be over written
$protected_vars = ['username','password','permissions','email','department','dbuser_last_name','dbuser_first_name','dbuser_internal_id'];
//
// asnyc execution of exec_db
if (isset($_POST["exec_db"])) {
    $sql = $_POST["sql"];
    //
    list($msg,$err) = exec_db($server,$database,$username,$password,$sql);
    $json = json_encode(Array('msg' => $msg, 'error' => $err));
    if ($json == '') { print_r('JSON Encoding Error: ',json_last_error(),' - ',json_last_error_msg());}
    else { print_r($json);}
}
//
// fetches data from one or more sql statements and returned in a JSON encoded object
if (isset($_POST["fetch_db"])) {
    $sql_arr = Array();
    $name_arr = Array();
    //
    if (isset($_POST['sql_statements'])) {$sql_arr = json_decode($_POST['sql_statements']);}
    else {print_r('Error - no SQL statments provided');}
    //
    if (isset($_POST['return_names'])) {$name_arr = explode(';',$_POST['return_names']);}
    //
    // cleaning any empty elements from sql_arr
    $sql_arr = array_filter($sql_arr);
    $sql_arr = array_values($sql_arr);
    //
    $results = Array();
    //
    for ($i = 0; $i < count($sql_arr); $i++) {
        //
        $db_res = fetch_db($server,$database,$username,$password,$sql_arr[$i]);
        $error = $db_res[1];
        $db_res = $db_res[0];
        if ($error) {$name_arr[$i] = "SQL_REQ_ERROR_MSG-{$i}";}
        if ($i < count($name_arr)) {
            $results[$name_arr[$i]] = $db_res;
        }
        else {
            array_push($results,$db_res);
        }
    }
    //
    $json = json_encode($results);
    if ($json == '') { print_r('JSON Encoding Error: ',json_last_error(),' - ',json_last_error_msg());}
    else { print_r($json);}
}
//
//
if (isset($_POST["exec_transaction"])) {
    $sql_arr = Array();
    //
    if (isset($_POST['sql_statements'])) {$sql_arr = json_decode($_POST['sql_statements']);}
    else {print_r('Error - no SQL statments provided');}
    //
    // cleaning any empty elements from sql_arr
    $sql_arr = array_filter($sql_arr);
    $sql_arr = array_values($sql_arr);
    //
    list($msg,$err) = exec_transaction($server,$database,$username,$password,$sql_arr);
    $json = json_encode(Array('msg' => $msg, 'error' => $err));
    if ($json == '') { print_r('JSON Encoding Error: ',json_last_error(),' - ',json_last_error_msg());}
    else { print_r($json);}
    
}
// storing data in session variable
if (isset($_POST["store_session"])) {
    //
    GLOBAL $protected_vars;
    $key_val_str = $_POST["key_val_str"];
    $key_val_arr = explode(",",$key_val_str); // might clean this up with better pairing method
    //
    for ($i = 0; $i < count($key_val_arr); $i += 2) {
        $key = $key_val_arr[$i];
        if (in_array($key,$protected_vars)) {
            print_r("<script>console.log('Error - Cannot store {$key} in session array it is a protected name.')</script>");
            continue;
        }
        $val = $key_val_arr[$i+1];
        $_SESSION[$key] = $val;
    }
}
// getting session variable, JSON encoded
if (isset($_POST["get_session"])) {
    //
    //
    print_r(json_encode($_SESSION));
    //
    // clearing the session if clear_session = true
    if (isset($_SESSION["clear_session"])) {
        foreach($_SESSION as $key => $value) {
            if (in_array($key,$protected_vars)) {continue;}
            unset($_SESSION[$key]);
        }  
    }
}
//
// clearing all additional session variables set by javascript
if (isset($_POST["clear_session"])) {
    //
    GLOBAL $protected_vars;
    //
    foreach($_SESSION as $key => $value) {
        if (in_array($key,$protected_vars)) {continue;}
        unset($_SESSION[$key]);
    }
}
?>