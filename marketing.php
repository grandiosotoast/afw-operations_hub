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

<input id="tab-clicked" type="hidden" value="">

</div> <!-- End nav-container -->


<div id="main-container" class="main-container">

<h1>Under Construction J$</h1>

<div id="input-div"></div>

<div id="table-div" class="hidden-elm"></div>

<br>

<h3 id="header" style="text-align: center;"></h3>

<div id="content-div"></div>

</div> <!-- End main-container div -->
</body>
</html>