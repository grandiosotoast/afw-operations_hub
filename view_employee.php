<?php
// Start the session
session_start();
require 'operations_tracking.php'; 
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">

<title>Wendlings Operation Tracking - View Employee</title>

<?php
link_external_files();
?>

</head>
<body>
<div id="head" class="head">

<?php 
page_head();
check_login('view_employee');
?>
</div>
<div id = "main-container" class = "main-container">
<h2>View an Employee's Data </h2>
<form id="view-employee">
<fieldset class="fieldset-default">
<legend>Employee Selection Parameters</legend>
<label class="label">Employee Department</label>
<select id="department" class="dropbox-input" name="department" onchange="show_update_button('view_employee_button','employee_table','Show Employee Table Changes');">
    <option value="all" selected>All</option>
    <option value="freight_backhaul">Freight Savings</option>
    <option value="transportation">Transportation</option>
    <option value="warehouse_receiving">Warehouse Receiving</option>
    <option value="warehouse_shipping">Warehouse Shipping</option>
</select>
<br>
<label class="label">Employees per page:</label>
<select id="emp-per-page" class="dropbox-input" name="emp-per-page" onchange="show_update_button('view_employee_button','employee_table','Show Employee Table Changes');">
    <option id="10" value="10">10</option>
    <option id="20" value="20">20</option>
    <option id="30" value="30">30</option>
    <option id="50" value="50">50</option>
</select>
</fieldset>
<br>
<fieldset class="fieldset-default">
<legend>Viewable Data Parameters</legend>
<div id="time-range-inputs">
</div>
<label class="label">Data Entries per page:</label>
<select id="res-per-page" class="dropbox-input" onchange="show_update_button('adj_view_range','view-emp-data-div','Apply Changes');" name="res-per-page">
    <option id="10" value="10">10</option>
    <option id="20" value="20">20</option>
    <option id="30" value="30">30</option>
    <option id="50" value="50">50</option>
</select>
</fieldset>
<br>
<button id="view_employee_button" type="button" onclick="view_emp_table('1','emp_last_name','ASC'); toggle_view_element_button('view_employee_button','employee-table-div','Hide Employee Table','Show Employee Table');">Show Employee Table</button>
<button id="adj_view_range" type="button" class=" hidden-elm" onclick="add_class('hidden-elm','adj_view_range')">Adjust Viewable Data</button>
</form>
</div>
<h4>Click on an Employee to View their Data</h4>
<div id="employee-table-div" class="hidden-elm">
</div>
<br>
<div id="view-emp-data-div">
</div>
<h3 id="view-header"></h3>
<div id="view-emp-entry-div">
</div>
</body>
<script>
var input_args = {
    output_id : 'time-range-inputs',
    time_range_onchange : "show_update_button('adj_view_range','view-emp-data-div','Apply Changes');",
    day_onkeyup : "show_update_button('adj_view_range','view-emp-data-div','Apply Changes');",
    month_onchange : "show_update_button('adj_view_range','view-emp-data-div','Apply Changes');",
    year_onchange  : "show_update_button('adj_view_range','view-emp-data-div','Apply Changes');"
};
create_time_range_inputs(input_args);
</script>
</html>