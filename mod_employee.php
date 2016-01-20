<?php
// Start the session
session_start();
require 'operations_tracking.php';
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">

<title>Wendlings Operation Tracking - Modify/Delete Employee</title>

<?php
link_external_files();
?>
</head>

<body>
<div id="head" class="head">
<?php 
page_head();
check_login('mod_employee');
?>

</div>
<div id = "main-container" class = "main-container">
<h2>Modify/Delete an Employee </h2>
<form id="mod_employee" name="mod_employee" method="POST" action="mod_employee.php">
<fieldset class="fieldset-default">
<legend>Select an Employee</legend>
<br>
<label>Show Inactive Employees:</label><input id="mod-emp-show-inactive" type="checkbox" name="show-inactive" onclick="mod_emp_table('1','emp_last_name','ASC');">
<div id="employee-table-div">
</div>
<br>
</fieldset>
</form>
<br>
<h3 id="modify-header"></h3>
<div id="mod-employee-form">
</div>
</div>
<br>
<br>
</body>
<script>
// forces this to execute after page has loaded
mod_emp_table('1','emp_last_name','ASC'); 
</script>
</html>
