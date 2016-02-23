<?php
// Start the session
session_start();
require 'operations_tracking.php'; 
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">

<title>Wendlings Operation Tracking - Table Maintenance</title>

<?php
link_external_files();
?>

</head>

<body>
<div id="head" class="head">
<?php 
page_head();
check_login('table_maintenance');
?>
<script>
var old_url = document.referrer;
//
if (!!(old_url.match(/administration.php/))) {
    get_session(gen_suggestions_table)
}
//
</script>
</div>
<div id = "main-container" class = "main-container">
<h2> Modify Table Entries</h2>
<form id="modify-table">
<fieldset class="fieldset-wide">
<legend>Select Table </legend>
<div id="table-select-div">
<h4 id="place-holder">Loading . . .</h4>
</div>
</fieldset>
<input id="table-selected" type="hidden" value="">
<input id="table-unique-col" type="hidden" value="">
<input id="table-unique-val" type="hidden" value="">
</form>
<br>
<fieldset id="table-refinement" class="fieldset-default hidden-elm">
<legend id="sql-label">Table Refinement</legend>

<table class="default-table" style="margin: 0px">
<tr>
<td class="default-table-header">Column Name</td>
<td class="default-table-header">Match Type</td>
<td class="default-table-header">Value</td>
</tr>
<tr>
<td class="default-table-td"><input id="column-name-1" type="text"></td>
<td class="default-table-td"><select id="match-type-1"><option value="REGEXP">REGEXP</option><option value="LIKE">LIKE</option></select></td>
<td class="default-table-td"><input id="column-value-1" type="text"></td>
</tr>
<tr>
<td class="default-table-td"><input id="column-name-2" type="text"></td>
<td class="default-table-td"><select id="match-type-2"><option value="REGEXP">REGEXP</option><option value="LIKE">LIKE</option></select></td>
<td class="default-table-td"><input id="column-value-2" type="text"></td>
</tr>
</table>
<label>** Mouse over table header cell to view actual column name</label>
</fieldset>
<button id="update-table" class="hidden-elm" onclick="create_table(1,'','');">Update Table</button>
&nbsp;&nbsp;&nbsp;&nbsp;
<button id="clear-inputs" class="hidden-elm" onclick="reset_table_maintence_inputs();">Clear Inputs</button>
<div id="table-div">
</div>
<br>
<h3 id="modify-header"></h3>
<div id="modify-table-form">
</div>
</div>
</body>
<script>
//
// getting all tables in database
list_all_tables()
</script>
</html>



<!--
-->