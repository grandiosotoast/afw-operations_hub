<?php
// Start the session
session_start();
require 'operations_tracking.php';
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">

<title>Wendlings Operation Tracking - Sales Reporting</title>

<?php
link_external_files();
?>
<script src="js/scripts_sales.js"></script>
</head>

<body>
<div id="head" class="head">
<?php 
page_head();
check_login('sales_reporting');
?>
</div>
<div id="main-container" class="main-container">
<h1>Under Construction J$</h1>
</div>
</body>
</html>