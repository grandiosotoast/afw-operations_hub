<?php
// Start the session
session_start();
require 'operations_tracking.php';
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">


<title>Wendlings Operation Tracking - Edit Error Codes</title>

<?php
link_external_files();
?>

</head>

<body>
<div id="head" class="head">
<?php 
page_head();
check_login('error_codes');
$table = 'error_codes';

if (isset($_POST["action-new"])) {
    // initializing arg array
    $cols = array();
    $vals = array();
    //
    // Getting the variables from the form 
    foreach($_POST as $key=>$value) {
        if ($key != "action-new") {
            array_push($cols,$key);
            array_push($vals,$value);
        }
    }
    
    // add in a validation function either interactive javascript or on submit php
    
    // Executing functions 
    $arg_array = '';
    $arg_array['cmd'] = "INSERT";
    $arg_array['table'] = $table;
    $arg_array['cols'] = $cols;
    $arg_array['vals'] = $vals;
    $sql = gen_sql($arg_array);
    $message = "Created new Error code {$_POST["reason"]} - {$_POST["description"]}.";
    exec_db($server,$database,$username,$password,$sql,$message);
}
else if (isset($_POST["action-mod"])) {
    // initializing arg array
    $cols = array();
    $vals = array();
    //
    // Getting the variables from the form 
    foreach($_POST as $key=>$value) {
        if (($key != "action-mod") and ($key != "curr_reason")) {
            array_push($cols,$key);
            array_push($vals,$value);
        }
    }
    
    // add in a validation function either interactive javascript or on submit php
    
    // Executing functions 
    $arg_array = '';
    $arg_array['cmd'] = "UPDATE";
    $arg_array['table'] = $table;
    $arg_array['cols'] = $cols;
    $arg_array['vals'] = $vals;
    $arg_array['where'] = [['reason','LIKE',$_POST["curr_reason"]]];
    $sql = gen_sql($arg_array);
    $message = "Modified Error code {$_POST["reason"]} - {$_POST["description"]}.";
    exec_db($server,$database,$username,$password,$sql,$message);
}
if (isset($_POST["action-del"])) {
    $sql = "DELETE FROM `{$table}` WHERE `reason` LIKE {$_POST["error_code"]}";
    $message = "Deleted Error code: {$_POST["description"]}.";
    exec_db($server,$database,$username,$password,$sql,$message);
    }
?>
</div>
<div id = "main-container" class = "main-container">
</br>
</br>
<h2>Modify/Delete an Error Code </h2>
<form id="mod_error_code" name="mod_error_code" method="POST">
<fieldset class="fieldset-default">
<legend>Select an Error Code</legend>
<?php
//
// Defining arg array
$table = 'error_codes';
$arg_array = '';
$arg_array['table'] = $table;
$arg_array['cmd'] = "SELECT";
//
// Getting all employees to create drop down box to use in form
$sql = gen_sql($arg_array);
$results = fetch_db($server,$database,$username,$password,$sql);
$num_rows = count($results);
echo "<select class=\"multi-line-dropbox-input\" multiple=\"multiple\" size=\"1\">";
$str = sprintf("%'*3s***%'*13.13s***%'*14s",'Reason','Description','Group Name');
$str = preg_replace('/\*/',"&nbsp;",$str);
echo "<option class=\"dropbox-option-grey\" value=\"\" disabled>{$str}</option>";
echo "</select>";
echo "<select id=\"error_code\" class=\"multi-line-dropbox-input\" name=\"error_code\" multiple=\"multiple\">";
for ($i = 0; $i < $num_rows; $i++) {
    $row = $results[$i];
    $str = sprintf("%'*3s***%'*20.20s***%'*10.10s",trim($row["reason"]),trim($row["description"]),trim($row["group_name"]));
    $str = preg_replace('/\*/',"&nbsp;",$str);
    if ($i%2 == 0) {
        echo "<option class=\"dropbox-option-white\" value=\"{$row["reason"]}\">{$str}</option>";
    }
    else {
        echo "<option class=\"dropbox-option-grey\" value=\"{$row["reason"]}\">{$str}</option>";
    }
}
echo "</select>";
?>
</fieldset>
<input id="description" type="hidden" name="description" value="" >
<button id="new_error_button" type="submit" name="err_button" value="new">New Error Code</button>
<button id="mod_error_button" type="submit" name="err_button" value="mod">Modify Error Code</button>
<button id="del_error_button" type="submit" name="action-del" value="delete" onclick="get_option_text('error_code','description'); return confirm('Do you really want to delete this error code?');">Delete Error Code</button>
</form>
</br>
<div id="form-container">
<?php

// Allow user to create new ones here too
if (isset($_POST["err_button"])) {
    $action = trim($_POST["err_button"]);
}
else {die();}
//
// getting groups
$table = 'error_codes';
$sql = "SELECT `group_num`,`group_name` FROM `{$table}`";
$codes = fetch_db($server,$database,$username,$password,$sql);
$used_nums = array();
//
if ($action == "new") {
    //
    // Creating the modify error code page
    echo "</br>";
    echo "<form id=\"new_error_code\" name=\"new_error_code\" method=\"POST\">";
    echo "<fieldset class=\"fieldset-default\">";
    echo "<legend>Error Code Definition</legend>";
    // add check unique here
    echo "<label class=\"label\">Reason</label><input id=\"reason\" class=\"text-input\" type=\"text\" name=\"reason\" value=\"{$results["reason"]}\"></br>";
    echo "</br>";
    echo "<label class=\"label\">Description</label><input id=\"description\" class=\"text-input\" type=\"text\" name=\"description\" value=\"{$results["description"]}\"></br>";
    echo "</br>";
    echo "<label class=\"label\">Group</label>";
    echo "<select id=\"group_num\" class=\"dropbox-input\" name=\"group_num\">";
    for ($i = 0; $i < count($codes); $i++) {
        if ( !(in_array($codes[$i]["group_num"],$used_nums))) {
            array_push($used_nums,$codes[$i]["group_num"]);
            echo "  <option value= \"{$codes[$i]["group_num"]}\">{$codes[$i]["group_name"]}</option>";
        }
    }
    echo "</select>";
    echo "</fieldset>"; 
    echo "<input id=\"group_name\" type=\"hidden\" name=\"group_name\" value=\"\" >";
    echo "<input id=\"action-new\" type=\"hidden\" name=\"action-new\" value=\"new\">";
    $fail_message = "Entered error code number is currently in use, please enter another value.";
    echo "</form>";
    echo "<button id=\"new_err_button\"  name=\"action-new\" value=\"new\" onclick = \"get_option_text('group_num','group_name'); check_unique('new_error_code','reason','description','reason','description','{$table}','{$fail_message}');\">Create New Error Code</button>";
}
else if ($action == "mod") {   
    if (isset($_POST["error_code"])) {
        $curr_reason = $_POST["error_code"];
    }
    else {die();}
    //
    // Getting error info
    $sql = "SELECT * FROM `{$table}` WHERE `reason` LIKE {$curr_reason}";
    $results = fetch_db($server,$database,$username,$password,$sql);
    $results = $results[0]; 
    //
    // Creating the modify error code page
    echo "<script>document.getElementById(\"mod_error_button\").innerHTML = \"Change Error Code\";</script>";
    echo "</br>";
    echo "<form id=\"update_error_code\" name=\"update_error_code\" method=\"POST\">";
    echo "<fieldset class=\"fieldset-default\">";
    echo "<legend>Error Code Definition</legend>";
    // add check unique here
    echo "<label class=\"label\">Reason</label><input id=\"reason\" class=\"text-input\" type=\"text\" name=\"reason\" value=\"{$results["reason"]}\"></br>";
    echo "</br>";
    echo "<label class=\"label\">Description</label><input id=\"description\" class=\"text-input\" type=\"text\" name=\"description\" value=\"{$results["description"]}\"></br>";
    echo "</br>";
    echo "<label class=\"label\">Group</label>";
    echo "<select id=\"group_num\" class=\"dropbox-input\" name=\"group_num\">";
    echo "  <option value= \"{$results["group_num"]}\" selected>{$results["group_name"]}</option>";
    for ($i = 0; $i < count($codes); $i++) {
        if (($codes[$i]["group_num"] != $results["group_num"]) and !(in_array($codes[$i]["group_num"],$used_nums))) {
            array_push($used_nums,$codes[$i]["group_num"]);
            echo "  <option value= \"{$codes[$i]["group_num"]}\">{$codes[$i]["group_name"]}</option>";
        }
    }
    echo "</select>";
    echo "</fieldset>"; 
    echo "<input id=\"group_name\" type=\"hidden\" name=\"group_name\" value=\"{$results["group_name"]}\" >";
    echo "<input id=\"curr_reason\" type=\"hidden\" name=\"curr_reason\" value=\"{$results["reason"]}\" >";
    echo "<input id=\"action-mod\" type=\"hidden\" name=\"action-mod\" value=\"modify\">";
    $fail_message = "Entered error code number is currently in use, please choose enter value.";
    echo "</form>";
    echo "<button id=\"mod_err_button\" name=\"action-mod\" value=\"modify\" onclick =\"get_option_text('group_num','group_name'); check_unique('update_error_code','reason','description','reason','description','{$table}','{$fail_message}');\">Modify Error Code</button>";
}  
?>
</div>
</div>
</body>
</html>