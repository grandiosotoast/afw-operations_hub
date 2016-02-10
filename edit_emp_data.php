<?php
// Start the session
session_start();
require 'operations_tracking.php'; 
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">

<title>Wendlings Operation Tracking - Employee Data Maintenance</title>

<?php
link_external_files();
?>

</head>
<body>
<div id="head" class="head">
<script>
var old_url = document.referrer;
//
if (!!(old_url.match(/view_employee.php/))) {
    get_session(create_edit_page_from_view)
}
//
</script>
<?php 
page_head();
check_login('edit_emp_data');
?>
</div>
<div id="main-container" class="main-container">
<h2>Modify/Delete an Employee Data Record</h2>
<form id="mod-emp-data">
<fieldset class="fieldset-default">
<legend>Selection Parameters</legend>
<label class="label">Employee Department</label>
<select id="department" class="dropbox-input" name="department" onchange="show_update_button('update-employee-table','employee_table','Update Employee Table'); show_update_button('update-employee-data-table','employee-data-table','Update Employee Data Table');">
    <option value="all" selected>All</option>
    <option value="freight_backhaul">Freight Logistics</option>
    <option value="general">Occupancy</option>
    <option value="transportation">Transportation</option>
    <option value="warehouse_receiving">Warehouse Receiving</option>
    <option value="warehouse_shipping">Warehouse Shipping</option>
</select>
<br>
<label class="label">Employees per page:</label>
<select id="emp-per-page" class="dropbox-input" name="emp-per-page" onchange="show_update_button('update-employee-table','employee_table','Update Employee Table');">
    <option id="10" value="10">10</option>
    <option id="20" value="20">20</option>
    <option id="30" value="30">30</option>
    <option id="50" value="50">50</option>
</select>
<br>
<div id="time-range-inputs">
</div>
<label class="label">Results per page:</label>
<select id="res-per-page" class="dropbox-input" name="res-per-page" onchange="show_update_button('update-employee-data-table','employee-data-table','Update Employee Data Table');">
    <option id="10" value="10">10</option>
    <option id="20" value="20">20</option>
    <option id="30" value="30">30</option>
    <option id="50" value="50">50</option>
</select>
<br>
<br>
&nbsp;&nbsp;<input id="show-deleted" type="checkbox" onclick="show_update_button('update-employee-data-table','employee-data-table','Update Employee Data Table');">&nbsp;&nbsp;<label class="label">Show Deleted Records</label>
</fieldset>
<br>
<button id="show-employee-table" type="button" onclick="edit_data_emp_table('1','emp_last_name','ASC'); toggle_view_element_button('show-employee-table','employee-table-div','Hide Employee Table','Show Employee Table');">Show Employee Table</button>
<button id="get-all-emp-data" type="button" onclick="mod_emp_data_table('1','date','DESC','.'); toggle_view_element_button('get-all-emp-data','edit-emp-data-div','Hide Employee Data Table','Show Employee Data Table');">Get All Employee Data</button>
<button id="update-employee-table" type="button" class="hidden-elm" ></button>
<button id="update-employee-data-table" type="button" class="hidden-elm" ></button>
<br>
<div id="employee-table-div" class="hidden-elm">
</div>
<br>
</form>
<br>
<h4>Click on an entry to bring up its edit form.</h4>
<div id="edit-emp-data-div" class="edit_emp_data_div hidden-elm"></div>
<br>
<h3 id="modify-header"></h3>
<div id="update-entry-form-div" ></div>
</div>
</body>
<script>
var input_args = {
    output_id : 'time-range-inputs',
    time_range_onchange : "show_update_button('update-employee-data-table','employee-data-table','Update Employee Data Table');",
    day_onkeyup : "show_update_button('update-employee-data-table','employee-data-table','Update Employee Data Table');",
    month_onchange : "show_update_button('update-employee-data-table','employee-data-table','Update Employee Data Table');",
    year_onchange  : "show_update_button('update-employee-data-table','employee-data-table','Update Employee Data Table');"
};
create_time_range_inputs(input_args);
</script>
</html>