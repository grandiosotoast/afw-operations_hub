<?php
// Start the session
session_start();
require 'operations_tracking.php';
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">

<title>Wendlings Operation Tracking - Marketing</title>

<?php
link_external_files();
?>
<script src="js/scripts_marketing_form_generation.js"></script>
<script src="js/scripts_marketing.js"></script>
</head>

<body>
<div id="head" class="head">
<?php
page_head();
check_login('marketing');
?>
</div>  <!-- End head div -->

<div id="nav-container" class="nav-container">
<h3>Select the desired action:</h3>
<span class="nav-span"><button id="vendor-broker-setup" type="button" class="big-button" onclick="vendor_broker_setup();">Vendor/ Broker Setup</button></span>
<span class="nav-span"><button id="vendor-broker-contact-info" type="button" class="big-button" onclick="vendor_broker_contact_info();">Contact Information</button></span>
<span class="nav-span"><button id="update-marketing-commitment" type="button" class="big-button" onclick="update_marketing_commitment();">Update Marketing Commitment</button></span>
<br>
<span class="nav-span"><button id="food-show-information" type="button" class="big-button" onclick="update_food_show_info();">Food Show Information</button></span>
<span class="nav-span"><button id="payments-and-growth" type="button" class="big-button" onclick="update_payments_and_growth();">Payments & Growth</button></span>
<span class="nav-span"><button id="marketing-dashboard" type="button" class="big-button" onclick="create_dashboard();">Overview</button></span>
<input id="tab-clicked" type="hidden" value="">

</div> <!-- End nav-container -->


<div id="main-container" class="main-container">

<div id="input-div"></div>

<div id="table-div" class=""></div>

<br>

<h3 id="header" style="text-align: center;"></h3>

<div id="content-div"></div>

</div> <!-- End main-container div -->
</body>
<script>update_payments_and_growth(); console.log('calling update payments line 56')</script>
</html>