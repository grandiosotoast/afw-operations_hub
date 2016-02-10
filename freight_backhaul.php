<?php
// Start the session
session_start();
require 'operations_tracking.php'; 
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">

<title>Wendlings Operation Tracking - Freight Logistics</title>

<?php
link_external_files();
?>

</head>
<body>
<div id="head" class="head">

<?php 
page_head();
check_login('freight_backhaul');
?>
</div>
<div id = "main-container" class = "main-container">
<h2>Freight Logistics</h2>
<br>
<div id='data-entry-form-div'>
</div>
<br>
<br>
</div>
</body>
<script>
get_backhaul_form('999999','data-entry-form-div',false)</script>
</html>