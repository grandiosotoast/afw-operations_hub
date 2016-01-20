<?php
// Start the session
session_start();
require 'operations_tracking.php';
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">

<title>Wendlings Operation Tracking - Modify/ Delete Existing User</title>

<?php
link_external_files();
?>

</head>

<body>
<div id="head" class="head">
<?php 
page_head();
check_login('mod_dbuser');
?>
</div>
<div id="main-container" class="main-container">
<h2> Modify/ Delete Database User </h2>
<form id="mod-dbuser-form">
<fieldset class="fieldset-wide">
<legend>Select User </legend>
<br>
<label>Show Inactive Users:</label><input id="mod-dbuser-show-inactive" type="checkbox" name="show-inactive" onclick="mod_dbuser_table('1','dbuser_last_name','ASC');">
<div id="dbuser-table-div">
</div>
</fieldset>
</form>
<br>
<h3 id="modify-header"></h3>
<div id="mod-dbuser-form-div">
</div>
</div>
</body>
<script>
mod_dbuser_table('1','dbuser_last_name','ASC')
</script>
</html>

