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
<script src="js/scripts_dynamic_report_columns.js"></script>
</head>

<body>
<div id="head" class="head">
<?php 
page_head();
check_login('sales_reporting');
?>
</div> <!-- End head div -->

<div id="nav-container" class="nav-container">

<h3>Select the desired report:</h3>
<button id="rep-report" type="button" class="big-button" onclick="rep_report();">Sales Rep Report</button>
<button id="customer-report" type="button" class="big-button" onclick="customer_report();">Customer Report</button>
<input id="tab-clicked" type="hidden" value="">

</div> <!-- End nav-container -->

<br>

<div id="main-container" class="main-container">


<br>

<div id="input-div"></div>

<div id="table-div" class="hidden-elm"></div>

<br>

<h3 id="header" style="text-align: center;"></h3>

<div id="content-div"></div>

</div> <!-- End main-container div -->

</body>
</html>