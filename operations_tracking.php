<?php
date_default_timezone_set ("America/New_York");
error_reporting(E_ALL);
ini_set("display_errors", 1);
//
$server = 'localhost';
$database = 'afwl3_operations';
$username = 'afwl3_operator';
$password = 'a1f9w13';
//
$forbidden_str = "<h1>403 - Forbidden Page</h1> <br> You do not have permission to access this page.<br><br> ";
$forbidden_str .= "If you believe this is in error contact your system administrator.";
//
// user perms follow the similar scheme to file perms
// $user_perm design:
//      data entry/employee perms: 1 - modify/delete entry, 2 - submit entry for employee, 4 - view employee entries 
//      meat shop perms: 1 - add/modify items, 2 - add/modify stock change, 4 - run stock reports, etc. 
//      sales perms:  1 - add/modify/view all sales reps, 2 - add/modify/sales data, returns, 4 - view rep specific reports
//      global perms: 1 - delete/modify user, 2 - create users, 4 - other high level tasks not related to users (i.e. table_maintenance)
//
// page perm array
$page_perms = array( 
    "add_dbuser" => '0002', 
    "add_employee" => '2000', 
    "administration" => '0000', 
    "edit_emp_data" => '1000', 
    "freight_backhaul" => '2000',
    "general_entry" => '2000',
    "marketing" => '0040',
    "meat_shop" => '0400',
    "mod_dbuser" => '0001', 
    "mod_employee" => '1000',
    "receiving" => '2000', 
    "report" => '4000', 
    "sales_maintenance" => '0070',
    "sales_reporting" => '0040',
    "transportation" => '2000',    
    "view_employee" => '4000',    
    "warehouse" => '2000',
    "operations" => '7000',
    "table_maintenance" => '0007'
    );
//
//
function link_external_files() {
    echo '<link rel="stylesheet" type="text/css" encoding="utf-8" href="operations_tracking.css">';
    //echo '<script src="js/jquery-2.1.3.js"></script>';
    echo '<script src="js/scripts_utility_functions.js"></script>';
    echo '<script src="js/scripts_driver_functions.js"></script>';
    echo '<script src="js/scripts_form_validation.js"></script>';
    echo '<script src="js/scripts_operations_tracking.js"></script>';
    echo '<script src="js/scripts_form_generation.js"></script>';
}
//
//
function page_head() {
    echo "<div id=\"hidden forms\" class=\"hidden-elm\">";
    echo "<form id=\"invalid_login\" name=\"invalid-login\" method=\"POST\" action=\"login.php\">";
    echo "<input type=\"hidden\" name=\"invalid-login\" value=\"GTFO-HERE\">";
    echo "</form>";
    echo "<form id=\"logout\" name=\"logout\" method=\"POST\" action=\"login.php\">";
    echo "<input type=\"hidden\" name=\"logout\" value=\"BBL\">";
    echo "</form>";
    //
    // non-sensitive user data 
    echo "<input id=\"user-username\" type=\"hidden\" value=\"{$_SESSION["username"]}\">";
    echo "<input id=\"user-department\" type=\"hidden\" value=\"{$_SESSION["department"]}\">";
    echo "<input id=\"user-perm\" type=\"hidden\" value=\"{$_SESSION["permissions"]}\">";
    echo "</div>";
}

function check_login($page_root) {
    global $page_perms, $forbidden_str;
    // Getting user and password variables
    if (isset($_SESSION["username"]) and isset($_SESSION["password"])) {
        echo "<span id=\"welcome-line\" class=\"welcome-line\">";
        echo "<button id=\"administration\" class=\"return-button\" type=\"button\" onclick=\"goto_link(this.id)\">Return to Home Page</button>";
        echo "Welcome {$_SESSION["dbuser_first_name"]} {$_SESSION["dbuser_last_name"]}!";
        echo "&nbsp;&nbsp;&nbsp;";
        echo "<input id=\"logout-button\" type=\"button\" value=\"Logout\" onclick=\"sub_form('logout')\"></span>";
    }
    else {
        echo "<script> document.getElementById(\"invalid_login\").submit();</script>";
        session_destroy(); 
    }
    // checking user perms for the page
    $access = check_perms($_SESSION["permissions"],$page_perms[$page_root]);
    if (!($access)) {
        echo "<span id = \"forbidden-page\" class = \"forbidden-page\">{$forbidden_str}</span>";
        die();
    }
}

function check_perms($user_perm_str,$page_perm_str) {
    //
    // spliting perm strings into digits
    preg_match('/(\d)(\d)(\d)(\d)/',$user_perm_str,$user_perm_arr);
    preg_match('/(\d)(\d)(\d)(\d)/',$page_perm_str,$page_perm_arr); 
    for ($i = 1; $i < count($page_perm_arr); $i++) {
        $user_perm = intval($user_perm_arr[$i]);
        $page_perm = intval($page_perm_arr[$i]);
        if ($user_perm < $page_perm) {
            return(false);
        }
        else if ($page_perm == 1) {
            if (in_array($user_perm,array(2,4,6))) {
                return(false);
            }
        }
        else if ($page_perm == 2) {
            if (in_array($user_perm,array(1,4,5))) {
                return(false);
            }   
        }
    }
    return(true);
}

function access_dbUsers($user,$pass,$username,$password) {
    //
    // Setting server variables
    $server = 'localhost';
    $database = 'afwl3_operations';
    $auth_table = 'dbUsers';
    $user = trim($user);
    $pass = trim($pass);
    //
    // Creating sql statment
    $sql = "SELECT * FROM `{$auth_table}` WHERE `Username` LIKE '{$user}'";
    //
    // Attempting to conect to the database
    try {
        // Connects to the database using the credentials stored in the variables
        $conn = new PDO("mysql:host=$server;dbname=$database", $username, $password);
        
        // set the PDO error mode to exception to display and handle any errors 
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
        // executes a sql SELECT statment.  
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $results = $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $results =  $stmt->fetchAll();
        
        // Terminates connection to database 
        $conn = null;
        
        return($results);
        }
    catch(PDOException $e) { 
        // Returns the PDO error encountered and displays it
        echo "<script>alert(\"{$e->getMessage()}\");</script>";
        }
}
//
// Connects to the database and fetches data using column name indexing
function fetch_db($server,$database,$username,$password,$sql) {
    try {
        // Connects to the database using the credentials stored in the variables
        $conn = new PDO("mysql:host=$server;dbname=$database", $username, $password);        
        // set the PDO error mode to exception to display and handle any errors 
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        // executes a sql SELECT statment.  
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $results = $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $results =  $stmt->fetchAll();
        // Terminates connection to database 
        $conn = null;
        return($results);
        }
    catch(PDOException $e) { 
        // Returns the PDO error encountered and displays it
        echo "<script>alert(\"{$e->getMessage()}\");</script>";
        }
    }  
 // Connects to the database and executes sql statment  
function exec_db($server,$database,$username,$password,$sql,$message) {
    try {
        // Connects to the database using the credentials stored in the variables
        $conn = new PDO("mysql:host=$server;dbname=$database", $username, $password);
        
        // set the PDO error mode to exception to display and handle any errors 
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
        // executes a sql statment that isn't returning results.  
        $conn->exec($sql);

        // Terminates connection to database 
        $conn = null;
        if ($message != '') {echo "<script>alert(\"{$message}\");</script>";}
        }
    catch(PDOException $e) { 
        // Returns the PDO error encountered and displays it
        echo $e->getMessage();
        }
    }
//
// function to mimic array_column in PHP5
function array_column_port($array,$key) {
    $col = [];
    for ($i = 0; $i < count($array); $i++) {
        array_push($col,$array[$i][$key]);
    }
    return($col);
}

?>