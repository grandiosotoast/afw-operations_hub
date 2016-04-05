<?php
// Start the session
session_start();
require 'operations_tracking.php';
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">

<title>Wendlings Operation Tracking - Login </title>

<?php
link_external_files();
?>

</head>
<body>
<div id="hidden forms" class="hidden-elm">
<form id="failed_login" name="failed-login" method="POST" action="login.php">
<input type="hidden" name="failed-login" value="TRY AGAIN!">
</form>
</div>
<div id = "main-container" class = "main-container">
<br>
<br>
<h2> Login </h2>
<?php
if (isset($_POST["invalid-login"])) {
    echo "<span id=\"invalid-login\" class=\"invalid-login\">You have been logged out, please re-enter your creditals.</span>";
    session_destroy();
}
if (isset($_POST["failed-login"])) {
    echo "<span id=\"failed-login\" class=\"failed-login\">Invalid username or password supplied.</span>";
    session_destroy();
}
if (isset($_POST["logout"])) {
    echo "<span id=\"logout\" class=\"logout\">You have logged out.</span>";
    session_destroy();
}
?>
<form id="login_form" name="login_form" method="POST" OnSubmit=" return validate_login(this.form)">
<fieldset class="fieldset-default">
<legend>Login Information</legend>
<label class="label">Username:</label><input id="username" class="text-input" type="text" name="username"><br>
<br>
<label class="label">Password:</label><input id="password" class="text-input" type="password" name="password"><br>
</fieldset>
<br>
<input id="login" type="submit" name="Login" value="Login">
</form>
<br>
<div id="hidden-div" class="hidden-elm">
<?php
// Getting the variables from the form 
if (isset($_POST["username"])) {
    $user = trim($_POST["username"]);
}
else {die();}
if (isset($_POST["password"])) {
    $pass = trim($_POST["password"]);
}
else {die();}

// Executing function and checking if username and password exist
$results = access_dbUsers($user,$pass,$username,$password);
//
// Validation of login creditials
if ($pass == $results[0]["password"]) {
    if ($results[0]["dbuser_status"] != 'active') {
        echo "<script> document.getElementById(\"failed_login\").submit();</script>";
        die(); //test this
    }
    $_SESSION["username"] = $user;
    $_SESSION["password"] = $pass;
    $_SESSION["dbuser_internal_id"] = $results[0]["dbuser_internal_id"];
    $_SESSION["department"] = $results[0]["department"];
    $_SESSION["dbuser_first_name"] = $results[0]["dbuser_first_name"];
    $_SESSION["dbuser_last_name"] = $results[0]["dbuser_last_name"];
    $_SESSION["user_email"] = $results[0]["user_email"];
    $_SESSION["permissions"] = $results[0]["permissions"];
    //
    echo "<script>goto_link('administration')</script>";
}
else {
    echo "<script> document.getElementById(\"failed_login\").submit();</script>";
}

?>
</div>
</div>
</body>
</html>