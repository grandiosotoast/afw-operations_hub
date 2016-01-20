<?php
// Start the session
session_start();
require 'operations_tracking.php';
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">

<title>Wendlings Operation Tracking - Warehouse Receiving Employee Data Entry</title>

<?php
link_external_files();
?>

</head>

<body>
<div id="head" class="head">
<?php 
page_head();
check_login('receiving');
?>
</div>
<div id="main-container" class="main-container">
<h2>Enter Shift Information for Employee</h2>
<form id="select_recv_emp">
<fieldset class="fieldset-default">
<legend>Select an Employee to Enter Data For</legend>
<div id="employee-table-div">
</div>
</fieldset>
</form>
<br>
<div id='data-entry-form-div'>
</div>
<br>
<br>
</div>
</body>
<script>
enter_data_emp_table('1','emp_last_name','ASC','warehouse_receiving')
</script>
</html>


