<?php
// Start the session
session_start();
require 'operations_tracking.php'; 
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">

<title>Wendlings Operation Tracking - Table Maintenance</title>

<?php
link_external_files();
?>

</head>

<body>
<div id="head" class="head">
<?php 
page_head();
check_login('table_maintenance');
?>
</div>
<div id = "main-container" class = "main-container">
<h2> Modify Table Entries</h2>
<form id="modify-table">
<fieldset class="fieldset-wide">
<legend>Select Table </legend>
<div id="table-select-div">
<h4>Loading . . .</h4>
</div>
</fieldset>
<input id="table-selected" type="hidden" value="">
<input id="table-unique-col" type="hidden" value="">
<input id="table-unique-val" type="hidden" value="">
</form>
<br>
<label id="sql-label" class="label-large hidden-elm">Add Additional SQL logic here:</label><br>
<textarea id ="add-sql-logic" class="hidden-elm" rows="4" cols="60" value=""></textarea><br>
<button id="update-table" class="hidden-elm" onclick="create_table(1,'','');">Update Table</button>
<div id="table-div">
</div>
<br>
<h3 id="modify-header"></h3>
<div id="modify-table-form">
</div>
</div>
</body>
<script>
//
// getting all tables in database
list_all_tables()
</script>
</html>



<!--
-->