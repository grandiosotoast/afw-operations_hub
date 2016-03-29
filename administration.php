<?php
// Start the session
session_start();
require 'operations_tracking.php'; 
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">

<title>Wendlings Operation Tracking - Administration</title>

<?php
link_external_files();
?>

</head>

<body>
<div id="head" class="head">
<?php 
page_head();
check_login('administration');
?>
</div>
<div id="main-container" class="main-container">
<div id="nav-container" class="nav-container">
<h3> Home Page</h3>
<?php
//
// parsing user perm array
preg_match('/(\d)(\d)(\d)/',$_SESSION["permissions"],$user_perm_arr);
//
// creating buttons based on user perms 
if (check_perms($_SESSION["permissions"],$page_perms["general_entry"])) {
    echo '<span class="nav-span"><button id="general_entry" type="button" class="big-button" onclick="goto_link(this.id);">Occupancy Data Entry</button></span>';
}
if (check_perms($_SESSION["permissions"],$page_perms["transportation"])) {
    echo '<span class="nav-span"><button id="transportation" type="button" class="big-button" onclick="goto_link(this.id);">Drivers Data Entry</button></span>';
}
if (check_perms($_SESSION["permissions"],$page_perms["freight_backhaul"])) {
    echo '<span class="nav-span"><button id="freight_backhaul" type="button" class="big-button" onclick="goto_link(this.id);">Freight Logistics</button></span>';
}
if (check_perms($_SESSION["permissions"],$page_perms["receiving"])) {
    echo '<span class="nav-span"><button id="receiving" type="button" class="big-button" onclick="goto_link(this.id);">Receiving Data Entry</button></span>';
}
if (check_perms($_SESSION["permissions"],$page_perms["warehouse"])) {
    echo '<span class="nav-span"><button id="warehouse" type="button" class="big-button"  onclick="goto_link(this.id);">Shipping Data Entry</button></span>';
}
    echo '<br>';
if (check_perms($_SESSION["permissions"],$page_perms["view_employee"])) {
    echo '<span class="nav-span"><button id="view_employee" type="button" class="big-button" onclick="goto_link(this.id);">View Employees</button></span>'; 
}
if (check_perms($_SESSION["permissions"],$page_perms["edit_emp_data"])) {
    echo '<span class="nav-span"><button id="edit_emp_data" type="button" class="big-button" onclick="goto_link(this.id);">Employee Data Maintenance</button></span>';
}
if (check_perms($_SESSION["permissions"],$page_perms["report"])) {
    echo '<span class="nav-span"><button id="report" type="button" class="big-button"  onclick="goto_link(this.id);">Reporting Options</button></span>'; 
}
    echo '<br>';
if (($_SESSION["department"] == 'marketing') or check_perms($_SESSION["permissions"],'0007')) {
    echo '<span class="nav-span"><button id="marketing" type="button" class="big-button" onclick="goto_link(this.id);">Marketing</button></span>';
}
if (check_perms($_SESSION["permissions"],$page_perms["meat_shop"])) {
    echo '<span class="nav-span"><button id="meat_shop" type="button" class="big-button" onclick="goto_link(this.id);">Meat Shop Inventory</button></span>';
}
if (check_perms($_SESSION["permissions"],$page_perms["sales_maintenance"])) {
    echo '<span class="nav-span"><button id="sales_maintenance" type="button" class="big-button" onclick="goto_link(this.id);">Sales Maintenance</button></span>';
}
if (check_perms($_SESSION["permissions"],$page_perms["sales_reporting"])) {
    echo '<span class="nav-span"><button id="sales_reporting" type="button" class="big-button" onclick="goto_link(this.id);">Sales Reporting</button></span>';
}
    echo '<br>';
if (check_perms($_SESSION["permissions"],$page_perms["add_employee"])) {
    echo "<span class=\"nav-span\"><button id=\"add_employee\" type=\"button\" class=\"big-button\"  onclick=\"goto_link(this.id);\">Add Employee</button></span>"; 
}
if (check_perms($_SESSION["permissions"],$page_perms["mod_employee"])) {
    echo "<span class=\"nav-span\"><button id=\"mod_employee\" type=\"button\" class=\"big-button\" onclick=\"goto_link(this.id);\">Modify/Delete Employee</button></span>";
}
    //echo "<br>";    
if (check_perms($_SESSION["permissions"],$page_perms["add_dbuser"])) {
    echo "<span class=\"nav-span\"><button id=\"add_dbuser\" type=\"button\" class=\"big-button\" onclick=\"goto_link(this.id);\">Create New Database User</button></span>";
}
if (check_perms($_SESSION["permissions"],$page_perms["mod_dbuser"])) {
    echo "<span class=\"nav-span\"><button id=\"mod_dbuser\" type=\"button\" class=\"big-button\" onclick=\"goto_link(this.id);\">Modify/Delete Database User</button></span>";
}
if (check_perms($_SESSION["permissions"],$page_perms["table_maintenance"])) {
    echo "<span class=\"nav-span\"><button id=\"table_maintenance\" type=\"button\" class=\"big-button\" onclick=\"goto_link(this.id);\">Table Maintenance</button></span>";
}
?>
</div>
</div>
</body>
</html>