<?php
// Start the session
session_start();
require 'operations_tracking.php'; 
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">

<title>Wendlings Operation Tracking - Meat Shop, Got Beef?</title>

<?php
link_external_files();
?>
<script src="js/scripts_meat_shop.js"></script>
</head>

<body>
<div id="head" class="head">
<?php 
page_head();
check_login('meat_shop');
?>
</div>
<div id="nav-container" class="nav-container">
<h3>Select the desired action:</h3>
<button id="item-maintenance" type="button" class="big-button" onclick="item_maintenance();">Item Maintanence</button>
<button id="stock-changes" type="button" class="big-button" onclick="stock_changes();">Stock Changes</button>
<button id="stock-reports" type="button" class="big-button" onclick="stock_reports();">Stock Reports</button>
<input id="tab-clicked" type="hidden" value="">
</div>
<br>
<div id="additional-buttons" class="nav-container">
<button id="update-stock" type="button" class="big-button hidden-elm" onclick="update_stock();">Update Item Stock</button>
<button id="mod-record" type="button" class="big-button hidden-elm" onclick="mod_change_records();">Modify Stock Change Records</button>
<button id="inventory-report" type="button" class="big-button hidden-elm" onclick="meat_shop_inventory_report();">Inventory Report</button>
<button id="stock-change-report" type="button" class="big-button hidden-elm" onclick="stock_change_report();">Stock Change Report</button>
</div>
<div id="main-container" class="main-container">
<br>
<div id="input-div">
</div>
<div id="item-table-div">
</div>
<br>
<h3 id="modify-header" style="text-align: center;"></h3>
<div id="content-div">
</div>
</div> <!-- Ends main container -->
</body>
</html>