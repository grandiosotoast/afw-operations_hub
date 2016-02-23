<?php
// Start the session
session_start();
require 'operations_tracking.php';
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">

<title>Wendlings Operation Tracking - Hub Suggestions</title>

<?php
link_external_files();
?>
<script src="js/scripts_report.js"></script>
<script src="js/scripts_dynamic_report_columns.js"></script>
</head>
<body>
<div id="head" class="hidden-elm">
<?php 
page_head();
check_login('administration')
?>
</div>
<div id = "main-container" class = "main-container">
<form id="report_emp_data" name="report_emp_data" method="POST">
<label>Suggestion:</label>
<br>
<textarea id="description" name="description" rows="4" cols="60" value="" onkeyup="remove_class('invalid-field',this.id);"></textarea>
<br>
<button type="button" onclick="submit_suggestion();">Submit</button>
</form>
</div>
</body>
</html>