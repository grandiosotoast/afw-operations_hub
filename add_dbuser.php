<?php
// Start the session
session_start();
require 'operations_tracking.php'; 
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Wendlings Operation Tracking - Create New User</title>

<?php
link_external_files();
?>

</head>

<body>
<div id="head" class="head">
<?php 
page_head();
check_login("add_dbuser");
?>
</div>
<div id="main-container" class="main-container">
<h2> Add New Database User </h2>
<div id="add-new-dbuser-form">
</div>
</div>
</body>
<script>
// forces this to execute after page has loaded
create_form('add_dbuser','add-new-dbuser-form');
pop_add_dbuser_dropdowns(false);
</script>
</html>
