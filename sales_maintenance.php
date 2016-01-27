<?php
// Start the session
session_start();
require 'operations_tracking.php';
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">

<title>Wendlings Operation Tracking - Sales Maintenance</title>

<?php
link_external_files();
?>
<script src="js/scripts_sales.js"></script>
</head>

<body>
<div id="head" class="head">
<?php 
page_head();
check_login('sales_maintenance');
?>
</div>

<div id="nav-container" class="nav-container">
<h3>Select the desired action:</h3>
<button id="rep-maintenance" type="button" class="big-button" onclick="rep_maintenance();">Sales Rep Maintanence</button>
<button id="customer-maintenance" type="button" class="big-button" onclick="customer_maintenance();">Customer Maintenance</button>
<input id="tab-clicked" type="hidden" value="">
</div>

<br>

<div id="additional-buttons" class="nav-container">
<button id="create-new-rep" type="button" class="big-button hidden-elm" onclick="new_rep();">New Sales Rep</button>
<button id="modify-rep" type="button" class="big-button hidden-elm" onclick="mod_rep();">Modify Sales Rep</button>
<button id="create-new-customer" type="button" class="big-button hidden-elm" onclick="new_customer();">New Customer</button>
<button id="modify-customer" type="button" class="big-button hidden-elm" onclick="mod_customer();">Modify Customer</button>
</div>

<div id="main-container" class="main-container">

<br>

<div id="input-div"></div>

<div id="table-div"></div>

<br>

<h3 id="modify-header" style="text-align: center;"></h3>
<div id="content-div"></div>

</div> <!-- Ends main container -->

</body>
</html>