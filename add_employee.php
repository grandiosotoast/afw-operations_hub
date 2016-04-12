<?php
// Start the session
session_start();
require 'operations_tracking.php';
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">

<title>Wendlings Operation Tracking - Add Employee</title>

<?php
link_external_files();
?>

</head>

<body>
<div id="head" class="head">
<?php
page_head();
check_login('add_employee');
?>
</div>
<div id = "main-container" class = "main-container">
<h2> Add New Employee </h2>
<div id="add-new-employee-form">
</div>
</div>
</body>
<script>
// forces this to execute after page has loaded
create_form('add_employee','add-new-employee-form');
pop_add_emp_dropdowns(null);
</script>
</html>

