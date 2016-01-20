<?php
session_start();
require 'operations_tracking.php'; 
//
// values in the session array that can not be over written
$protected_vars = ['username','password','permissions','email','department','dbuser_last_name','dbuser_first_name','dbuser_internal_id'];
//
// asnyc execution of exec_db
if (isset($_POST["async_exec_db"])) {
    $sql = $_POST["sql"];
    if (isset($_POST["message"])) {
        $message = $_POST["message"];
    }
    else {
        $message = "";
    }
    exec_db($server,$database,$username,$password,$sql,$message);
}

//
// async execution of fetch_db and encoding of the returned data into a JSON arrray
// this is being phased out in favor of multi-fetch
if (isset($_POST["async_fetch_db"])) {
    $sql = $_POST["sql"];
    if (isset($_POST["meta_sql"])) {
        $meta_sql = $_POST["meta_sql"];
    }
    else {
        $meta_sql = '';
    }
    $results = fetch_db($server,$database,$username,$password,$sql);
    if ($meta_sql != '') {
        $col_meta = fetch_db($server,$database,$username,$password,$meta_sql);
        $json = json_encode(array('data' => $results, 'meta_data' => $col_meta));
    }
    else {
        $json = json_encode($results);
    }
    //
    if ($json == '') { print_r('JSON Encoding Error: ',json_last_error(),' - ',json_last_error_msg());}
    else { print_r($json);}
}
//
//
if (isset($_POST["async_fetch_multiple"])) {
    $sql_arr = Array();
    $name_arr = Array();
    //
    if (isset($_POST['sql_statements'])) {$sql_arr = explode(';',$_POST['sql_statements']);}
    else {print_r('Error - no SQL statments provided');}
    //
    if (isset($_POST['return_names'])) {$name_arr = explode(';',$_POST['return_names']);}
    //
    $results = Array();
    //
    for ($i = 0; $i < count($sql_arr); $i++) {
        //
        $db_res = fetch_db($server,$database,$username,$password,$sql_arr[$i]);
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
if (isset($_POST["async_exec_multiple"])) {
    $sql_arr = Array();
    //
    if (isset($_POST['sql_statements'])) {$sql_arr = explode(';',$_POST['sql_statements']);}
    else {print_r('Error - no SQL statments provided');}
    //
    for ($i = 0; $i < count($sql_arr); $i++) {
        $sql = $sql_arr[$i];
        exec_db($server,$database,$username,$password,$sql,'');
    }
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