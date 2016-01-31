<?php
// Start the session
session_start();
require 'operations_tracking.php';
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">

<title>Wendlings Operation Tracking - Reporting Options</title>

<?php
link_external_files();
?>
<script src="js/scripts_report.js"></script>
<script src="js/scripts_dynamic_report_columns.js"></script>
</head>
<body>
<div id="head" class="head">
<?php 
page_head();
check_login('report');
?>
</div>
<div id = "main-container" class = "main-container">
<h2>Data Reporting </h2>

<form id="report_emp_data" name="report_emp_data" method="POST">
<fieldset class="fieldset-default">
<legend>Report Data Parameters</legend>
<label class="label">Employee Department</label>
<select id="department" class="dropbox-input" name="department" onchange="report_emp_table('1','emp_last_name','ASC',false); show_data_columns(document.getElementById('department').value,'data_sel_cols','show_data_cols',false,true); show_update_button('get_emp_data','report-table','Show Changes'); show_if_val('department','crew-size-input','warehouse_receiving');">
    <option value="freight_backhaul">Freight Savings</option>
    <option value="transportation">Transportation</option>
    <option value="warehouse_receiving">Warehouse Receiving</option>
    <option value="warehouse_shipping">Warehouse Shipping</option>
</select>
<br>
<span id="crew-size-input" class="hidden-elm"><label class="label">Crew Size:</label><input id="crew-size" value="5" onkeyup="remove_class('invalid-field','crew-size'); show_update_button('get_emp_data','report-table','Show Changes');"></span>
<div id="time-range-inputs">
</div>
</fieldset>
<br>
<fieldset class="fieldset-default">
<legend>Report Structure Parameters</legend>
<label class="label">Report Type:</label>
<br>
<label class="label-4em">Detailed:</label><input id="report-type-detailed" type="radio" name="report-type" value="detailed" onclick="show_update_button('get_emp_data','report-table','Show Changes');" checked>
&nbsp;&nbsp;&nbsp;
<label class="label-4em">Summary:</label>&nbsp;<input id="report-type-summary" type="radio" name="report-type" value="summary" onclick="show_update_button('get_emp_data','report-table','Show Changes');">
&nbsp;&nbsp;&nbsp;
<label class="label-5em">No Totals:</label>&nbsp;<input id="report-type-noTotals" type="radio" name="report-type" value="noTotals" onclick="show_update_button('get_emp_data','report-table','Show Changes');">
<br>
<br>
<label class="label">Preset Report Options:</label>
<select id="preset-report" class="dropbox-input" name="preset-report" onchange="show_data_columns(document.getElementById('department').value,'data_sel_cols','show_data_cols',false,true); remove_class('hidden-elm','data_sel_cols'); show_update_button('get_emp_data','report-table','Show Changes');">
</select>
<br>
<br>
<label class="label">Report Section Headers:</label>
<select id="prime-sort" class="dropbox-input" name="prime-sort" onchange="show_update_button('get_emp_data','report-table','Show Changes');">
    <option value="emp_id">Employee ID</option>
    <option value="date">Date</option>
    <option value="emp_last_name">Employee Name</option>
</select>
&nbsp;&nbsp;
<label class="label-large">Section Sorting Direction:</label>
<select id="prime-sort-dir" class="dropbox-input" name="prime-sort-dir" onchange="show_update_button('get_emp_data','report-table','Show Changes');">
    <option value="ASC">Ascending</option>
    <option value="DESC">Descending</option>
</select>
<br>
<label class="label">Internal Sorting:</label>
<select id="secd-sort" class="dropbox-input" name="secd-sort" onchange="update_sort_by_col('sort-by-col-tr','secd-sort'); show_update_button('get_emp_data','report-table','Show Changes');">
    <option value="date">Date</option>
    <option value="emp_id">Employee ID</option>
    <option value="emp_last_name">Employee Name</option>
</select>
&nbsp;&nbsp;
<label class="label-large">Internal Sorting Direction:</label>
<select id="secd-sort-dir" class="dropbox-input" name="secd-sort-dir" onchange="show_update_button('get_emp_data','report-table','Show Changes');">
    <option value="ASC">Ascending</option>
    <option value="DESC">Descending</option>
</select>
</fieldset>
<br>
<button id="show_data_cols" type="button" onclick="show_data_columns(document.getElementById('department').value,'data_sel_cols','show_data_cols',true,false);">Show Data Selection Columns</button> 
<button id="show_employee_table" type="button" onclick="report_emp_table('1','emp_last_name','ASC',true);">Show Employee Table</button>
<button id="get_emp_data" type="button" name="get_emp_data" onclick="create_report('report_emp_data','report_data_div','','')">Get All Employee Data</button>
<button id="get_emp_data_all" type="button" class="hidden-elm" name="get_emp_data_all" onclick="create_report('report_emp_data','report_data_div','',''); add_class('hidden-elm','get_emp_data_all');">Get All Employee Data</button>
<input type="button" onclick="printDiv('printableArea')" value="Print" />
<div id="data_sel_cols" class="hidden-elm"></div>
<br>
<h4 id="emp-table-header" class="hidden-elm">Click on an employee to generate a report for them.</h4>
<div id="employee-table-div" class="hidden-elm"></div>
<br>
</form>
<br>
<!--Printing Div-->
<div id="printableArea">
     <div id="report_data_div" class="report-data-div "></div>
</div>
</div> <!-- Closing main-container div -->
<!--Print JavaScript-->
<script language="javascript">
function printDiv(printableArea) {
     var printContents = document.getElementById(printableArea).innerHTML;
     var originalContents = document.body.innerHTML;

     document.body.innerHTML = printContents;
     // this is where CSV export logic can go as well I think
     window.print();

     document.body.innerHTML = originalContents;
}
//
var input_args = {
    output_id : 'time-range-inputs',
    time_range_onchange : "show_update_button('get_emp_data','report-table','Show Changes');",
    day_onkeyup : "show_update_button('get_emp_data','report-table','Show Changes');",
    month_onchange : "show_update_button('get_emp_data','report-table','Show Changes');",
    year_onchange  : "show_update_button('get_emp_data','report-table','Show Changes');"
};
create_time_range_inputs(input_args);
var dropbox_args = {
    sql_where : [['report_type','REGEXP','(^|%)production(%|$)']]
};
populate_dropbox_options('preset-report','report_presets','preset_index','preset_name','',dropbox_args);
</script>
</body>
</html>