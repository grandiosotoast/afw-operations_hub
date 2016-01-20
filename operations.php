<?php
// Start the session
session_start();
require 'operations_tracking.php';
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">

<title>Wendlings Operation Tracking</title>

<?php
link_external_files();
?>

</head>

<body>
<div id="head" class="head">
<?php 
page_head();
check_login('operations');
?>
</div>
<div id="main-container" class="main-container">
<div class="nav-container">
<h3> Operations Tracking Data Entry Main Page</h3>
<?php
if (check_perms($_SESSION["permissions"],$page_perms["operations"]) or ($_SESSION["department"] == "receiving")) {
    echo '<span class="nav-span"><button id="receiving" type="button" class="big-button" onclick="goto_link(this.id);">Warehouse Receiving Data Entry</button></span>';
}
if (check_perms($_SESSION["permissions"],$page_perms["operations"]) or ($_SESSION["department"] == "transportation")) {
    echo '<span class="nav-span"><button id="transportation" type="button" class="big-button" onclick="goto_link(this.id);">Transportation Data Entry</button></span>';
}
if (check_perms($_SESSION["permissions"],$page_perms["operations"]) or ($_SESSION["department"] == "warehouse")) {
    echo '<span class="nav-span"><button id="warehouse" type="button" class="big-button"  onclick="goto_link(this.id);">Warehouse Shipping Data Entry</button></span>';
}
if (check_perms($_SESSION["permissions"],$page_perms["operations"])) {
    echo '<span class="nav-span"><button id="edit_emp_data" type="button" class="big-button" onclick="goto_link(this.id);">Employee Data Maintenance</button></span>';
}
?>
</div>
</div>
</body>


</html>






