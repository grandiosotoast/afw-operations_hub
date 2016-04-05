"use strict";
//
// database user creation and modifcation form
var add_dbuser = ""+
    "<form id=\"add-new-user\" method=\"POST\">"+
    "<fieldset class=\"fieldset-default\">"+
    "<legend>Basic Information</legend>"+
    "<br>"+
    "<label class=\"label\">First Name<span style=\"color: red;\"><sup>*</sup></span></label><input id=\"dbuser-first-name\" class=\"text-input\" type=\"text\" name=\"dbuser_first_name\" onkeyup=\"remove_class('invalid-field',this.id);\"><br>"+
    "<label class=\"label\">Last Name<span style=\"color: red;\"><sup>*</sup></span></label><input id=\"dbuser-last-name\" class=\"text-input\" type=\"text\" name=\"dbuser_last_name\" onkeyup=\"remove_class('invalid-field',this.id);\"><br>"+
    "<label class=\"label\">Email<span style=\"color: red;\"><sup>*</sup></span></label><input id=\"email\" class=\"text-input\"  type=\"text\" name=\"user_email\" onkeyup=\"remove_class('invalid-field',this.id); check_email_str(this.id,'email-err-str',false)\">"+
    "<label id=\"email-err-str\" class=\"error-msg hidden-elm\">&nbsp;&nbsp;&nbsp;Error - Invalid Email Format, Valid Format: example@foo.bar</label><br>"+
    "<br>"+
    "<label class=\"label\">Employee Department<span style=\"color: red;\"><sup>*</sup></span></label>"+
    "<select id=\"department-select\" class=\"dropbox-input\" name=\"department\" onchange=\"show_if_val('department-select','department-input','other'); set_default_perms('department-select','dbuser-permissons'); remove_class('invalid-field',this.id); remove_class('invalid-field','dbuser-permissons'); add_class('hidden-elm','dbuser-permissons-str-err')\">"+
    "</select>"+
    "<br>"+
    "<label class=\"label\" style=\"text-align: center;\"></label>" +
    "<input id=\"department-input\" type=\"text\" class=\"text-input hidden-elm\" name=\"department\" placeholder=\"Department\" onkeyup=\"remove_class('invalid-field','department-input');\" disabled></input>"+
    "<br>"+
    "<br>"+
    "<label class=\"label\">User Permissions:</label><input id=\"dbuser-permissons\" class=\"text-input-small\" type=\"text\" name=\"permissions\" value=\"0000\" maxlength=4 onkeyup=\"remove_class('invalid-field',this.id); check_int_str('dbuser-permissons','dbuser-permissons-str-err',false);\" readonly>"+
    "&nbsp;&nbsp;&nbsp;"+
    "<label class=\"label-7em\">Use Defaults:</label><input id=\"default-perms\" class=\"checkbox-input\" type=\"checkbox\" onclick=\"toggle_readonly('dbuser-permissons'); set_default_perms('department-select','dbuser-permissons'); remove_class('invalid-field','dbuser-permissons');\" checked>"+
    "<a style=\"color:blue; text-decoration:underline;\" onclick=\"alert('informative pop-up');\"><small>What is this?</small></a>"+
    "<label id=\"dbuser-permissons-str-err\" class=\"error-msg hidden-elm\"><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<sup>*</sup>Only Numbers Allowed in User Permissions</label>"+
    "</fieldset>"+
    "<br>"+
    "<fieldset class=\"fieldset-default\">"+
    "<legend>Login Information</legend>"+
    "<label class=\"label\">Username<span style=\"color: red;\"><sup>*</sup></span></label><input id=\"username\" class=\"text-input\" type=\"text\" name=\"username\" onkeyup=\"remove_class('invalid-field',this.id);\">"+
    "<label id=\"username-uni-err\" class=\"error-msg hidden-elm\">&nbsp;&nbsp;&nbsp;Username is taken</label><br>"+
    "<label class=\"label\">Password<span style=\"color: red;\"><sup>*</sup></span></label><input id=\"password\" class=\"text-input\" type=\"password\" name=\"password\" onkeyup=\"remove_class('invalid-field',this.id); check_equality('password','conf-password','pass-not-equal-err-str',false);\"><br>"+
    "<label class=\"label\">Confirm Password<span style=\"color: red;\"><sup>*</sup></span></label><input id=\"conf-password\" class=\"text-input\" type=\"password\" onkeyup=\"remove_class('invalid-field',this.id); check_equality('password','conf-password','pass-not-equal-err-str',false);\">"+
    "<label id=\"pass-not-equal-err-str\" class=\"error-msg hidden-elm\">&nbsp;&nbsp;&nbsp;Error - Password and Confirm Password Do Not Match</label><br>"+
    "</fieldset>"+
    "<input id=\"dbuser-status\" type=\"hidden\" name=\"dbuser_status\" value=\"active\"></input>"+
    "<input id=\"dbuser-internal-id\" type=\"hidden\" name=\"dbuser_internal_id\" value=\"\">"+
    // button and err msg
    "<label id=\"form-errors\" class=\"error-msg hidden-elm\">Form errors are highlighted in red</label><br>"+
    "<button id=\"create-new-user\" type=\"button\" onclick=\"init_dbuser_form_valiation(false);\">Add New User</button>"+
    "</form>";
//
//
// employee creation and modifcation form
var add_employee = ""+
    "<form id=\"add_employee\" name=\"add_employee\" method=\"POST\" OnSubmit=\" return validate_employee_form(this.form)\">" +
    "<fieldset class=\"fieldset-default\">" +
    "<legend>Basic Information</legend>" +
    "<label class=\"label\">Employee ID<span style=\"color: red;\"><sup>*</sup></span></label><input id=\"emp-id\" class=\"text-input\" type=\"text\" name=\"emp_id\" onkeyup=\"remove_class('invalid-field','emp-id'); check_int_str('emp-id','emp-id-str-err',false);\">"+
    "&nbsp;&nbsp;&nbsp;"+
    "<label id=\"emp-id-uni-err\" class=\"error-msg hidden-elm\"><sup>*</sup>Unique Employee ID Required</label>"+
    "<label id=\"emp-id-str-err\" class=\"error-msg hidden-elm\"><sup>*</sup>Only Numbers Allowed in Employee ID</label>"+
    "<br>" +
    "<br>" +
    "<label class=\"label\">First Name<span style=\"color: red;\"><sup>*</sup></span></label><input id=\"emp-first-name\" class=\"text-input\" type=\"text\" name=\"emp_first_name\" onkeyup=\"remove_class('invalid-field','emp-first-name');\"><br>" +
    "<label class=\"label\">Last Name<span style=\"color: red;\"><sup>*</sup></span></label><input id=\"emp-last-name\" class=\"text-input\" type=\"text\" name=\"emp_last_name\" onkeyup=\"remove_class('invalid-field','emp-last-name');\"><br>" +
    "<label class=\"label\">Middle Name<span style=\"color: red;\"><sup>*</sup></span></label><input id=\"emp-middle-name\" class=\"text-input\"  type=\"text\" name=\"emp_middle_name\" onkeyup=\"remove_class('invalid-field','emp-middle-name');\"><br>" +
    "<br>" +
    "<label class=\"label\">Employee Department<span style=\"color: red;\"><sup>*</sup></span></label>" +
    "<select id=\"department-select\"class=\"dropbox-input\" name=\"department\" onchange=\"show_if_val('department-select','department-input','other'); remove_class('invalid-field','department-select');\">" +
    "  <option value= \"\" disabled selected>Select Department</option>" +
    "  <option value=\"transportation\">Transportation</option>" +
    "  <option value=\"warehouse_receiving\">Warehouse Receiving</option>" +
    "  <option value=\"warehouse_shipping\">Warehouse Shipping</option>" +
    "  <option value=\"office\">Office</option>" +
    "  <option value=\"other\">Other</option>" +
    "</select>" +
    "<br>"+
    "<label class=\"label\" style=\"text-align: center;\"></label>" +
    "<input id=\"department-input\" type=\"text\" class=\"text-input hidden-elm\" name=\"department\" placeholder=\"Department\" onkeyup=\"remove_class('invalid-field','department-input');\" disabled></input>"+
    "</fieldset>" +
    "" +
    "<br>" +
    "" +
    "<fieldset class=\"fieldset-trans\">" +
    "<legend>Transporation Information (If Applicable) </legend>" +
    "<table>"+
    "<tr>"+
    "<td><label class=\"label\" style=\"text-align: center;\">Base Rate Level</label>" +
    "<select id=\"base-rate-select\" class=\"dropbox-input\" name=\"base_rate\" onchange=\"show_if_val('base-rate-select','base-rate-input','other'); get_option_text('base-rate-select','base-rate-level'); remove_class('invalid-field','base-rate-select');\">" + //need to make this stuff auto populated from database to allow for more levels
    "</select></td>" +
    "<td><label class=\"label\" style=\"text-align: center;\">Case Rate Level</label>" +
    "<select id=\"case-rate-select\" class=\"dropbox-input\" name=\"case_rate\" onchange=\"show_if_val('case-rate-select','case-rate-input','other'); get_option_text('case-rate-select','case-rate-level'); remove_class('invalid-field','case-rate-select');\">" +
    "</select></td>" +
    "<td><label class=\"label\" style=\"text-align: center;\">Stop Rate Level</label>" +
    "<select  id=\"stop-rate-select\" class=\"dropbox-input\" name=\"stop_rate\" onchange=\"show_if_val('stop-rate-select','stop-rate-input','other'); get_option_text('stop-rate-select','stop-rate-level'); remove_class('invalid-field','stop-rate-select');\">" +
    "</select></td>" +
    "</tr>"+
    //
    "<td><label class=\"label\" style=\"text-align: center;\"></label>" +
    "<input id=\"base-rate-input\" type=\"text\" class=\"text-input-small hidden-elm\" name=\"base_rate\" placeholder=\"$$$\" onkeyup=\"remove_class('invalid-field','base-rate-input');\" disabled></input></td>" +
    "<td><label class=\"label\" style=\"text-align: center;\"></label>" +
    "<input id=\"case-rate-input\" type=\"text\" class=\"text-input-small hidden-elm\" name=\"case_rate\" placeholder=\"$$$\" onkeyup=\"remove_class('invalid-field','case-rate-input');\" disabled></input></td>" +
    "<td><label class=\"label\" style=\"text-align: center;\"></label>" +
    "<input id=\"stop-rate-input\" type=\"text\" class=\"text-input-small hidden-elm\" name=\"stop_rate\" placeholder=\"$$$\" onkeyup=\"remove_class('invalid-field','stop-rate-input');\" disabled></input></td>" +
    "</tr>"+
    "</table>"+
    "</fieldset>" +
    "" +
    "<br>" +
    "" +
    "<fieldset class=\"fieldset-default\">" +
    "<legend>Ancilliary Information (If Applicable) </legend>" +
    "<label class=\"label\">Employee Pay Type</label>"+
    "<select id=\"pay-type\" name=\"pay_type\">"+
      "<option>Incentive</option>"+
      "<option>Hourly</option>"+
      "<option selected>Both</option>"+
    "</select>"+
    "<br>"+
    "<label class=\"label\">Hourly Pay Rate</label><input id=\"hourly-pay-rate\" class=\"text-input\"  type=\"text\" name=\"hourly_pay_rate\"><br>" +
    "<label class=\"label\">Per Diem:</label><input id=\"per-diem\" type=\"text\" name=\"per_diem\" value=\"0.0\" onkeyup=\"check_num_str('per-diem','',false);\" onblur=\"check_num_str('per-diem','',false);\">"+
    "<br>"+
    "<label class=\"label\">Comments:</lable><textarea id = \"comments\" name=\"emp_comments\" rows=\"4\" cols=\"60\"></textarea>" +
    "</fieldset>" +
    "<br>" +
    // hidden data fields
    "<input id=\"base-rate-level\" type=\"hidden\" name=\"base_rate_level\" value=\"N\\A\"></input>"+
    "<input id=\"case-rate-level\" type=\"hidden\" name=\"case_rate_level\" value=\"N\\A\"></input>"+
    "<input id=\"stop-rate-level\" type=\"hidden\" name=\"stop_rate_level\" value=\"N\\A\"></input>"+
    "<input id=\"emp-status\" type=\"hidden\" name=\"emp_status\" value=\"active\"></input>"+
    "<input id=\"emp-internal-id\" type=\"hidden\" name=\"emp_internal_id\" value=\"\"></input>"+
    // err msg and button
    "<label id=\"form-errors\" class=\"error-msg hidden-elm\">Form errors are highlighted in red</label>"+
    "<button id=\"add-emp\" type=\"button\" onclick = \"init_employee_form_valiation('create')\">Add Employee</button>" +
    "&nbsp;&nbsp;&nbsp;"+
    "</form>";
//
//
var general_data_form = ''+
    '<form id="input-emp-data" method="POST">'+
    '<fieldset class="fieldset-default">'+
    '<legend>Employee Information</legend>'+
    '<label class="label">Employee ID:</label><input id="emp-id" type="text" name="emp_id" value="" readonly>'+
    '<br>'+
    '<label class="label">Employee First Name: </label><input id="emp-first-name" type="text" name="emp_first_name" value="" readonly>'+
    '<br>'+
    '<label class="label">Employee Last Name: </label><input id="emp-last-name" type="text" name="emp_last_name" value="" readonly>'+
    '</fieldset>'+
    '<br>'+
    '<fieldset class="fieldset-default">'+
    '<legend>Date &amp; Time Information</legend>'+
    '<label class="label">Date:</label><input id="date" type="text" name="date" value="" maxlength="10" onkeyup="check_date_str(this.id,false,false); onblur="check_date_str(this.id,false,false); recalc_general_form(true);" readonly>'+
    '&nbsp&nbsp&nbsp<label class="label-5em">Edit Date:</label><input id="edit-date" type="checkbox"onclick="toggle_readonly(\'date\')"></input>'+
    '<br>'+
    '<label class="label">Paid Hours:</label><input id="hours" type="text" name="hours" placeholder="00.00" value="" onkeyup="remove_class(\'invalid-field\',this.id); check_num_str(this.id,\'\',\'\');">'+
    '<br>'+
    '<label class="label">Attendance Error:</label>'+
    '<select id="attendance-select" name="attendance_error" onchange="show_if_val(\'attendance-select\',\'attendance-input\',\'other\');" onblur="">'+
    '</select>'+
    '<label class="label" style="text-align: center;"></label>'+
    '<input id="attendance-input" type="text" class="text-input hidden-elm" name="attendance_error" placeholder="Attendance Error" onkeyup="remove_class(\'invalid-field\',\'attendance-input\');" disabled></input>'+
    '</fieldset>'+
    '<br>'+
    '<fieldset class="fieldset-default">'+
    '<legend>Shift Information</legend>'+
    '<label class="label">Error Code:</label>'+
    '<select id="error-code" name="error_code" onchange="show_if_val(\'error-code\',\'other-error-code-msg\',\'99\')">'+
    '</select>'+
    '&nbsp&nbsp&nbsp<label id="other-error-code-msg" class="hidden-elm">Enter Error Description in Comments Section</label>'+
    '<br>'+
    '<br>'+
    '<label class="label">Hourly Pay Rate:</label><input id="hourly-pay-rate" type="text" name="hourly_pay_rate" value="0.0" onkeyup="check_num_str(this.id,false,false);" onblur="check_num_str(this.id,false,false); recalc_general_form(true)" readonly>'+
    '&nbsp&nbsp&nbsp<label class="label-7em">Edit Pay Rate:</label><input id="edit-hourly-pay" type="checkbox"onclick="toggle_readonly(\'hourly-pay-rate\'); recalc_general_form(true);"></input>'+
    '<br>'+
    '<br>'+
    '<label class="label">Additional Pay:</label><input id="add-pay" type="text" name="additional_pay" value="0.00" onkeyup="check_num_str(this.id,false,false);" onblur="check_num_str(this.id,false,false); recalc_general_form(true);">'+
    '&nbsp&nbsp&nbsp<label class="label">No Additonal Pay:</label><input id="no-add-pay" type="checkbox" onclick="toggle_readonly(\'add-pay\'); document.getElementById(\'add-pay\').value = \'0.00\'; recalc_general_form(true);">'+
    '<br>'+
    '<label class="label">Pay Deductions:</label><input id="deduc-pay" type="text" name="pay_deductions" value="0.00" style="color:red;" onkeyup="check_num_str(this.id,false,false);" onblur="check_num_str(this.id,false,false); recalc_general_form(true);">'+
    '&nbsp&nbsp&nbsp<label class="label">No Deductions:</label><input id="no-deduc-pay" type="checkbox" onclick="toggle_readonly(\'deduc-pay\'); document.getElementById(\'deduc-pay\').value = \'0.00\'; recalc_general_form(true);">'+
    '<br>'+
    '<br>'+
    '<label class="label">Hourly Pay:</label><input id="hourly-pay" type="text" value="0.0" readonly>'+
    '<br>'+
    '<label class="label">Total Pay:</label><input id="total-pay" type="text" name="total" value="0.00" onblur="recalc_general_form(true);" readonly><br>'+
    '<br>'+
    '<label class="label">Comments:</label><textarea id = "comments" name="comments" rows="4" cols="60" value="" onkeyup="remove_class(\'invalid-field\',this.id);"></textarea>'+
    '</fieldset>'+
    '<input id="department" type="hidden" name="department" value="general">'+
    '<input id="entering-user" type="hidden" name="entering_user" value="">'+
    '<input id="entry-status" type="hidden" name="entry_status" value="submitted">'+
    '<input id="entry-id" type="hidden" name="entry_id" value="">'+
    '<input id="admin-fix" type="hidden" name="admin_fix" value="">'+
    '<input id="admin-fix-timestamp" type="hidden" name="admin_fix_timestamp" value="">'+
    '<label id="form-errors" class="error-msg hidden-elm">Form errors are highlighted in red</label><br>'+
    '<button id="submit-data-button" type="button">Submit Shift Information</button>'+
    '</form>';
//
//
var receiving_data = ''+
    '<form id="input-emp-data" method="POST">'+
    '<fieldset class="fieldset-default">'+
    '<legend>Employee Information</legend>'+
    '<label class="label">Employee ID:</label><input id="emp-id" type="text" name="emp_id" value="" readonly>'+
    '<br>'+
    '<label class="label">Employee First Name: </label><input id="emp-first-name" type="text" name="emp_first_name" value="" readonly>'+
    '<br>'+
    '<label class="label">Employee Last Name: </label><input id="emp-last-name" type="text" name="emp_last_name" value="" readonly>'+
    '</fieldset>'+
    '<br>'+
    '<fieldset class="fieldset-default">'+
    '<legend>Date &amp; Time Information</legend>'+
    '<label class="label">Date:</label><input id="date" type="text" name="date" value="" maxlength="10" onkeyup="check_date_str(this.id,false,false); onblur="check_date_str(this.id,false,false); recalc_receving_form(true);" readonly>'+
    '&nbsp&nbsp&nbsp<label class="label-5em">Edit Date:</label><input id="edit-date" type="checkbox"onclick="toggle_readonly(\'date\')"></input>'+
    '<br>'+
    '<label class="label">Paid Hours:</label><input id="hours" type="text" name="hours" placeholder="00.00" value="" onkeyup="remove_class(\'invalid-field\',this.id); check_num_str(this.id,\'\',\'\');">'+
    '<br>'+
    '<label class="label">Indirect (minutes):</label><input id="indirect" type="text" name="indirect" placeholder ="00" value="" onkeyup="check_num_str(this.id,false,false);" onblur="check_num_str(this.id,false,false); recalc_receving_form(true);">'+
    '<br>'+
    '<label class="label">Production Time:</label><input id="prod-time" type="text" name="prod_time" value="00.00" readonly>'+
    '<br>'+
    '<label class="label">Attendance Error:</label>'+
    '<select id="attendance-select" name="attendance_error" onchange="show_if_val(\'attendance-select\',\'attendance-input\',\'other\');" onblur="">'+
    '</select>'+
    '<br>'+
    '<label class="label" style="text-align: center;"></label>'+
    '<input id="attendance-input" type="text" class="text-input hidden-elm" name="attendance_error" placeholder="Attendance Error" onkeyup="remove_class(\'invalid-field\',\'attendance-input\');" disabled></input>'+
    '</fieldset>'+
    '<br>'+
    '<fieldset class="fieldset-default">'+
    '<legend>Shift Information</legend>'+
    '<label class="label-bold">Letdowns</label><br>'+
    '<label class="label-4em">Moves:</label><input id="letdowns-moves" type="text" name="letdowns_moves" placeholder ="0" value="" onkeyup="check_int_str(this.id,false,false);" onblur="recalc_receving_form(true); check_int_str(this.id,false,false);">'+
    '&nbsp&nbsp'+
    '<label class="label-4em">Units:</label><input id="letdowns-units" type="text" name="letdowns_units" placeholder ="0" value="" onkeyup="check_int_str(this.id,false,false);" onblur="recalc_receving_form(true); check_int_str(this.id,false,false);">'+
    '<br>'+
    '<label class="label-bold">Putaways</label><br>'+
    '<label class="label-4em">Moves:</label><input id="putaways-moves" type="text" name="putaways_moves" placeholder ="0" value="" onkeyup="check_int_str(this.id,false,false);" onblur="recalc_receving_form(true); check_int_str(this.id,false,false);">'+
    '&nbsp&nbsp'+
    '<label class="label-4em">Units:</label><input id="putaways-units" type="text" name="putaways_units" placeholder ="0" value="" onkeyup="check_int_str(this.id,false,false);" onblur="recalc_receving_form(true); check_int_str(this.id,false,false);">'+
    '<br>'+
    '<label class="label-bold">Restocks</label><br>'+
    '<label class="label-4em">Moves:</label><input id="restocks-moves" type="text" name="restocks_moves" placeholder ="0" value="" onkeyup="check_int_str(this.id,false,false);" onblur="recalc_receving_form(true); check_int_str(this.id,false,false);">'+
    '&nbsp&nbsp'+
    '<label class="label-4em">Units:</label><input id="restocks-units" type="text" name="restocks_units" placeholder ="0" value="" onkeyup="check_int_str(this.id,false,false);" onblur="recalc_receving_form(true); check_int_str(this.id,false,false);">'+
    '<br>'+
    '<label class="label-bold">Receiving</label><br>'+
    '<label class="label-4em">Moves:</label><input id="receiving-moves" type="text" name="receiving_moves" placeholder ="0" value="" onkeyup="check_int_str(this.id,false,false);" onblur="recalc_receving_form(true); check_int_str(this.id,false,false);">'+
    '&nbsp&nbsp'+
    '<label class="label-4em">Units:</label><input id="receiving-units" type="text" name="receiving_units" placeholder ="0" value="" onkeyup="check_int_str(this.id,false,false);" onblur="recalc_receving_form(true); check_int_str(this.id,false,false);">'+
    '<br>'+
    '<label class="label-bold hidden-elm">Counts</label><br>'+
    '<label class="label-4em  hidden-elm">Moves:</label><input id="counts-moves" type="text" class=" hidden-elm" name="counts_moves" placeholder ="0" value="0" onkeyup="check_int_str(this.id,false,false);" onblur="recalc_receving_form(true); check_int_str(this.id,false,false);" disabled>'+
    '&nbsp&nbsp'+
    '<label class="label-4em  hidden-elm">Units:</label><input id="counts-units" type="text" class=" hidden-elm" name="counts_units" placeholder ="0" value="0" onkeyup="check_int_str(this.id,false,false);" onblur="recalc_receving_form(true); check_int_str(this.id,false,false);" disabled>'+
    '<br>'+
    '</fieldset>'+
    '<br>'+
    '<fieldset class="fieldset-default">'+
    '<legend>Shift Totals</legend>'+
    '<label class="label-bold">Total</label><br>'+
    '<label class="label-4em">Moves:</label><input id="total-moves" type="text" name="total_moves" value="0" readonly>'+
    '&nbsp&nbsp'+
    '<label class="label-4em">Units:</label><input id="total-units" type="text" name="total_units" value="0" readonly>'+
    '<br>'+
    '<br>'+
    '<label class="label">Moves per Hour:</label><input id="moves-hour" type="text" name="moves_hour" value="0" readonly>'+
    '<br>'+
    '<label class="label">Units per Hour:</label><input id="units-hour" type="text" name="units_hour" value="0" readonly>'+
    '<br>'+
    '<label class="label">Error Code:</label>'+
    '<select id="error-code" name="error_code" onchange="show_if_val(\'error-code\',\'other-error-code-msg\',\'99\')">'+
    '</select>'+
    '&nbsp&nbsp&nbsp<label id="other-error-code-msg" class="hidden-elm">Enter Error Description in Comments Section</label>'+
    '<br>'+
    '<br>'+
    '<label class="label">Hourly Pay Rate:</label><input id="hourly-pay-rate" type="text" name="hourly_pay_rate" value="0.0" onkeyup="check_num_str(this.id,false,false);" onblur="check_num_str(this.id,false,false); recalc_receving_form(true)" readonly>'+
    '&nbsp&nbsp&nbsp<label class="label-7em">Edit Pay Rate:</label><input id="edit-hourly-pay" type="checkbox"onclick="toggle_readonly(\'hourly-pay-rate\'); recalc_receving_form(true);"></input>'+
    '<br>'+
    '<br>'+
    '<label class="label">Additional Pay:</label><input id="add-pay" type="text" name="additional_pay" value="0.00" onkeyup="check_num_str(this.id,false,false);" onblur="check_num_str(this.id,false,false); recalc_receving_form(true);">'+
    '&nbsp&nbsp&nbsp<label class="label">No Additonal Pay:</label><input id="no-add-pay" type="checkbox" onclick="toggle_readonly(\'add-pay\'); document.getElementById(\'add-pay\').value = \'0.00\'; recalc_receving_form(true);">'+
    '<br>'+
    '<label class="label">Pay Deductions:</label><input id="deduc-pay" type="text" name="pay_deductions" value="0.00" style="color:red;" onkeyup="check_num_str(this.id,false,false);" onblur="check_num_str(this.id,false,false); recalc_receving_form(true);">'+
    '&nbsp&nbsp&nbsp<label class="label">No Deductions:</label><input id="no-deduc-pay" type="checkbox" onclick="toggle_readonly(\'deduc-pay\'); document.getElementById(\'deduc-pay\').value = \'0.00\'; recalc_receving_form(true);">'+
    '<br>'+
    '<br>'+
    '<label class="label">Incentive Pay:</label><input id="incentive-pay" type="text" value="0.0" readonly>'+
    '<br>'+
    '<label class="label">Hourly Pay:</label><input id="hourly-pay" type="text" value="0.0" readonly>'+
    '<br>'+
    '<label class="label">Total Pay:</label><input id="total-pay" type="text" name="total" value="0.00" onblur="recalc_receving_form(true);" readonly><br>'+
    '<br>'+
    '<label class="label">Comments:</label><textarea id = "comments" name="comments" rows="4" cols="60" value="" onkeyup="remove_class(\'invalid-field\',this.id);"></textarea>'+
    '</fieldset>'+
    '<input id="department" type="hidden" name="department" value="receiving">'+
    '<input id="entering-user" type="hidden" name="entering_user" value="">'+
    '<input id="entry-status" type="hidden" name="entry_status" value="submitted">'+
    '<input id="entry-id" type="hidden" name="entry_id" value="">'+
    '<input id="admin-fix" type="hidden" name="admin_fix" value="">'+
    '<input id="admin-fix-timestamp" type="hidden" name="admin_fix_timestamp" value="">'+
    '<label id="form-errors" class="error-msg hidden-elm">Form errors are highlighted in red</label><br>'+
    '<button id="submit-data-button" type="button">Submit Shift Information</button>'+
    '</form>';
//
//
var transportation_data = ''+
    '<form id="input-emp-data">'+
    '<fieldset class="fieldset-default">'+
    '<legend>Employee Information</legend>'+
    '<label class="label">Employee ID:</label><input id="emp-id" type="text" name="emp_id" value="" readonly>'+
    '<br>'+
    '<label class="label">Employee First Name: </label><input id="emp-first-name" type="text" name="emp_first_name" value="" readonly>'+
    '<br>'+
    '<label class="label">Employee Last Name: </label><input id="emp-last-name" type="text" name="emp_last_name" value="" readonly>'+
    '<br>'+
    '<label class="label">Base Rate Level</label><input id="base-rate" type="text" class="text-input-small" name="base_rate" onkeyup="document.getElementById(\'base-rate-orig\').value = document.getElementById(\'base-rate\').value;" onblur="recalc_transportation_form(true)" readonly>'+
    '&nbsp&nbsp'+
    '<label class="label">Case Rate Level</label><input id="case-rate" type="text" class="text-input-small" name="case_rate" onkeyup="document.getElementById(\'case-rate-orig\').value = document.getElementById(\'case-rate\').value;" onblur="recalc_transportation_form(true)" readonly>'+
    '&nbsp&nbsp'+
    '<label class="label">Stop Rate Level</label><input id="stop-rate" type="text" class="text-input-small" name="stop_rate" onkeyup="document.getElementById(\'stop-rate-orig\').value = document.getElementById(\'stop-rate\').value;" onblur="recalc_transportation_form(true)" readonly>'+
    '&nbsp&nbsp&nbsp<label class="label-5em">Edit Levels:</label><input id="edit-levels" type="checkbox" onclick="toggle_readonly(\'base-rate\'); toggle_readonly(\'case-rate\'); toggle_readonly(\'stop-rate\')">'+
    '</fieldset>'+
    '<br>'+
    '<fieldset class="fieldset-default">'+
    '<legend>Date &amp Time Information</legend>'+
    '<label class="label">Date:</label><input id="date" type="text" name="date" value="" maxlength="10" onblur="recalc_transportation_form(true);" readonly>'+
    '&nbsp&nbsp&nbsp<label class="label-5em">Edit Date:</label><input id="edit-date" type="checkbox"onclick="toggle_readonly(\'date\')">'+
    '<br>'+
    '<label class="label">Paid Hours:</label><input id="hours" type="text" placeholder="00.00" value="" name="hours" onkeyup="remove_class(\'invalid-field\',this.id); check_num_str(this.id,\'\',\'\');">'+
    '<br>'+
    '<label class="label">Over Night:</label>'+
    '<input id="over-night" type="checkbox" name="over_night" value="0" onclick="toggle_checkbox_value(this.id,1,0); recalc_transportation_form(true);">'+
    '<br>'+
    '<label class="label">Attendance Error:</label>'+
    '<select id="attendance-select" name="attendance_error" onchange="show_if_val(\'attendance-select\',\'attendance-input\',\'other\'); recalc_transportation_form(true);" onblur="recalc_transportation_form(true);">'+
    '</select>'+
    '<br>'+
    '<label class="label" style="text-align: center;"></label>'+
    '<input id="attendance-input" type="text" class="text-input hidden-elm" name="attendance_error" placeholder="Attendance Error" onkeyup="remove_class(\'invalid-field\',\'attendance-input\');" disabled></input>'+
    '</fieldset>'+
    '<br>'+
    '<fieldset class="fieldset-default">'+
    '<legend>Shift Information</legend>'+
    '<label class="label">Number of Cases:</label><input id="num-cases" type="text" name="num_cases" value="" placeholder="0" onblur="recalc_transportation_form(true);">'+
    '&nbsp&nbsp&nbsp<label class="label">Remove Case Pay:</label><input id="rem-case-pay" type="checkbox" value="0" onclick="document.getElementById(\'case-rate\').value = document.getElementById(\'case-rate-orig\').value; toggle_disabled(\'case-rate\'); recalc_transportation_form(true);">'+
    '<br>'+
    '<label class="label">Number of Routes:</label><input id="num-routes" type="text" name="num_routes" value="" placeholder="0" onblur="recalc_transportation_form(true);">'+
    '&nbsp&nbsp&nbsp<label class="label">Remove Route Pay:</label><input id="rem-route-pay" type="checkbox" value="0"onclick="document.getElementById(\'base-rate\').value = document.getElementById(\'base-rate-orig\').value; toggle_disabled(\'base-rate\'); recalc_transportation_form(true);">'+
    '<br>'+
    '<label class="label">Number of Stops:</label><input id="num-stops" type="text" name="num_stops" value="" placeholder="0" onblur="recalc_transportation_form(true);">'+
    '&nbsp&nbsp&nbsp<label class="label">Remove Stop Pay:</label><input id="rem-stop-pay" type="checkbox" value="0" onclick="document.getElementById(\'stop-rate\').value = document.getElementById(\'stop-rate-orig\').value; toggle_disabled(\'stop-rate\'); recalc_transportation_form(true);">'+
    '<br>'+
    '<label class="label">Number of Backhauls:</label><input id="num-backhauls" type="text" name="num_backhauls" value="" placeholder="0" onblur="recalc_transportation_form(true);">'+
    '<br>'+
    '<br>'+
    '<label class="label">Miles:</label><input id="num-miles" type="text" name="miles" value="" placeholder="0.0" onblur="recalc_transportation_form(true);" >'+
    '<br>'+
    '<label class="label">Gallons of Truck Fuel:</label><input id="truck-fuel" type="text" name="truck_fuel" value="" placeholder="0" onblur="recalc_transportation_form(true);" >'+
    '<br>'+
    '<label class="label">Gallons of Reefer Fuel:</label><input id="reefer-fuel" type="text" name="reefer_fuel" value="" placeholder="0" onblur="recalc_transportation_form(true);" >'+
    '<br>'+
    '<label class="label">Cost per Gallon:</label><input id="cost-per-gallon" type="text" name="cost_per_gallon" value="" placeholder="0.0" onblur="recalc_transportation_form(true);" >'+
    '<br>'+
    '<label class="label">Gallons of DEF:</label><input id="fuel-def" type="text" name="fuel_def" value="" placeholder="0" onblur="recalc_transportation_form(true);" >'+
    '<br>'+
    '<label class="label">DEF Cost per Gallon:</label><input id="def-cost-per-gallon" type="text" name="def_cost_per_gallon" value="" placeholder="0.0" onblur="recalc_transportation_form(true);" >'+
    '<br>'+
    '<br>'+
    '<label class="label">Pre Inspection:</label><input id="pre-inspection" type="checkbox" name="pre_inspection" onclick="toggle_checkbox_value(this.id,3.5,0); recalc_transportation_form(true);" value="0"></input>'+
    '<br>'+
    '<label class="label">Post Inspection:</label><input id="post-inspection" type="checkbox" name="post_inspection" onclick="toggle_checkbox_value(this.id,3.5,0); recalc_transportation_form(true);" value="0"></input>'+
    '<br>'+
    '<label class="label">Error Code:</label>'+
    '<select id="error-code" name="error_code" onchange="show_if_val(\'error-code\',\'other-error-code-msg\',\'99\');" >'+
    '</select>'+
    '&nbsp&nbsp&nbsp<label id="other-error-code-msg" class="hidden-elm">Enter Error Description in Comments Section</label>'+
    '<br>'+
    '<br>'+
    '<label class="label">Overnight Per Diem:</label><input id="per-diem" type="text" name="per_diem" value="0.0" onblur="recalc_transportation_form(true);" readonly disabled>'+
    '&nbsp&nbsp&nbsp<label class="label-7em">Edit Per Diem:</label><input id="edit-hourly-pay" type="checkbox" onclick="toggle_readonly(\'per-diem\'); recalc_transportation_form(true);"></input>'+
    '<br>'+
    '<label class="label">Hotel Amount:</label><input id="hotel-amount" type="text" name="hotel_amount" value="" placeholder="0.0" onblur="recalc_transportation_form(true);" >'+
    '<br>'+
    '<label class="label">Toll Amount:</label><input id="toll-amount" type="text" name="toll_amount" value="" placeholder="0.0" onblur="recalc_transportation_form(true);" >'+
    '<br>'+
    '<br>'+
    '<label class="label">Pay Employee Hourly:</label><input id="hourly-pay-only" type="checkbox" onclick="toggle_disabled(\'hourly-pay-rate\'); recalc_transportation_form(true);"></input>'+
    '<br>'+
    '<label class="label">Hourly Pay Rate:</label><input id="hourly-pay-rate" type="text" name="hourly_pay_rate" value="0.0" onblur="recalc_transportation_form(true);" readonly disabled>'+
    '&nbsp&nbsp&nbsp<label class="label-7em">Edit Pay Rate:</label><input id="edit-hourly-pay" type="checkbox"onclick="toggle_readonly(\'hourly-pay-rate\'); recalc_transportation_form(true);"></input>'+
    '<br>'+
    '<br>'+
    '<label class="label">Additional Pay:</label><input id="add-pay" type="text" name="additional_pay" value="0.00" onblur="recalc_transportation_form(true);">'+
    '&nbsp&nbsp&nbsp<label class="label">No Additonal Pay:</label><input id="no-add-pay" type="checkbox" onclick="toggle_readonly(\'add-pay\'); document.getElementById(\'add-pay\').value = \'0.00\'; recalc_transportation_form(true);">'+
    '<br>'+
    '<label class="label">Pay Deductions:</label><input id="deduc-pay" type="text" name="pay_deductions" value="0.00" style="color:red;" onblur="recalc_transportation_form(true);">'+
    '&nbsp&nbsp&nbsp<label class="label">No Deductions:</label><input id="no-deduc-pay" type="checkbox" onclick="toggle_readonly(\'deduc-pay\'); document.getElementById(\'deduc-pay\').value = \'0.00\'; recalc_transportation_form(true);">'+
    '<br>'+
    '<br>'+
    '<label class="label">Incentive Pay:</label><input id="incentive-pay" type="text" value="0.00" readonly>'+
    '<br>'+
    '<label class="label">Hourly Pay:</label><input id="hourly-pay" type="text" value="0.00" readonly>'+
    '<br>'+
    '<label class="label">Hotel/Fuel/Fees:</label><input id="reimbursement" type="text" value="0.0" readonly><br>'+
    '<br>'+
    '<label class="label">Total Pay:</label><input id="total-pay" type="text" name="total" value="0.0" onblur="recalc_transportation_form(true);" readonly><br>'+
    '<br>'+
    '<label class="label">Comments:</label><textarea id = "comments" name="comments" rows="4" cols="60" value="" onkeyup="remove_class(\'invalid-field\',this.id);"></textarea>'+
    '</fieldset>'+
    '<input id="base-rate-orig" type="hidden" name="base_rate" disabled>'+
    '<input id="case-rate-orig" type="hidden" name="case_rate" disabled>'+
    '<input id="stop-rate-orig" type="hidden" name="stop_rate" disabled>'+
    '<input id="department" type="hidden" name="department" value="transportation">'+
    '<input id="entering-user" type="hidden" name="entering_user" value="">'+
    '<input id="entry-status" type="hidden" name="entry_status" value="submitted">'+
    '<input id="entry-id" type="hidden" name="entry_id" value="">'+
    '<input id="admin-fix" type="hidden" name="admin_fix" value="">'+
    '<input id="admin-fix-timestamp" type="hidden" name="admin_fix_timestamp" value="">'+
    '<label id="form-errors" class="error-msg hidden-elm">Form errors are highlighted in red</label><br>'+
    '<button id="submit-data-button" type="button">Submit Shift Information</button>'+
    '</form>'
//
//
var warehouse_data = ''+
    '<form id="input-emp-data">'+
    '<fieldset class="fieldset-default">'+
    '<legend>Employee Information</legend>'+
    '<label class="label">Employee ID: </label><input id="emp-id" type="text" name="emp_id" value="" onblur="recalc_warehouse_form(true);" readonly>'+
    '<br>'+
    '<label class="label">Employee First Name: </label><input id="emp-first-name" type="text" name="emp_first_name" value="" onblur="recalc_warehouse_form(true);" readonly>'+
    '<br>'+
    '<label class="label">Employee Last Name: </label><input id="emp-last-name" type="text" name="emp_last_name" value="" onblur="recalc_warehouse_form(true);" readonly>'+
    '</fieldset>'+
    '<br>'+
    '<fieldset class="fieldset-default">'+
    '<legend>Date &amp+ Time Information</legend>'+
    '<label class="label">Date:</label><input id="date" type="text" name="date" value="" maxlength="10" onkeyup="check_date_str(\'date\',\'\',false);" onblur="check_date_str(\'date\',\'\',false); recalc_warehouse_form(true);" readonly>'+
    '&nbsp&nbsp&nbsp<label class="label-5em">Edit Date:</label><input id="edit-date" type="checkbox"onclick="toggle_readonly(\'date\');"></input>'+
    '<br>'+
    '<label class="label">Paid Hours:</label><input id="hours" type="text" placeholder="00.00" value="" name="hours" onkeyup="remove_class(\'invalid-field\',this.id); check_num_str(this.id,\'\',\'\');" onblur="recalc_warehouse_form(true);">'+
    '<br>'+
    '<label class="label">Indirect (minutes):</label><input id="indirect" type="text" name="indirect" placeholder ="00" value="" onkeyup="check_num_str(\'indirect\',\'indirect-str-err\',false);" onblur="check_num_str(\'indirect\',\'indirect-str-err\',false); recalc_warehouse_form(true);">'+
    '&nbsp&nbsp&nbsp&nbsp<label id="indirect-str-err" class="error-msg hidden-elm"><sup>*</sup>Only Numbers Allowed in Indirect Value</label>'+
    '<br>'+
    '<label class="label">Production Time:</label><input id="prod-time" type="text" name="prod_time" value="00.00" onblur="recalc_warehouse_form(true);" readonly>'+
    '<br>'+
    '<label class="label">Attendance Error:</label>'+
    '<select id="attendance-select" name="attendance_error" onchange="recalc_warehouse_form(true)" onblur="recalc_warehouse_form(true);">'+
    '</select>'+
    '<br>'+
    '<label class="label" style="text-align: center;"></label>'+
    '<input id="attendance-input" type="text" class="text-input hidden-elm" name="attendance_error" placeholder="Attendance Error" onkeyup="remove_class(\'invalid-field\',\'attendance-input\');" disabled></input>'+
    '</fieldset>'+
    '<br>'+
    '<fieldset class="fieldset-default">'+
    '<legend>Shift Information</legend>'+
    '<label class="label">Area:</label>'+
    '<select id="area" name="area" onchange="recalc_warehouse_form(true);" onblur="recalc_warehouse_form(true);">'+
        '<option value="dry">Dry</option>'+
        '<option value="cooler">Cooler</option>'+
        '<option value="freezer">Freezer</option>'+
    '</select>'+
    '<br>'+
    '<label class="label">Number of Cases:</label><input id="num-cases" type="text" name="num_cases" placeholder="0" onblur="recalc_warehouse_form(true);">'+
    '<br>'+
    '<label class="label">Error Code:</label>'+
    '<select id="error-code" name="error_code" onchange="recalc_warehouse_form(true);" onblur="recalc_warehouse_form(true);">'+
    '</select>'+
    '&nbsp&nbsp&nbsp<label id="other-error-code-msg" class="hidden-elm">Enter Error Description in Comments Section</label>'+
    '<br>'+
    '<label class="label">Cases/HR:</label><input id="cases-hr" type="text" name="cases_hr" value="00.00" readonly>'+
    '<br>'+
    '<label class="label">Selection Rate:</label><input id="sel-rate" type="text" name="sel_rate" value="0.00" onkeyup="check_num_str(\'sel-rate\',\'\',false);" onblurr="check_num_str(\'sel-rate\',\'\',false); recalc_warehouse_form(true);" readonly>'+
    '&nbsp&nbsp&nbsp<label class="label-5em">Edit Rate:</label><input id="edit-sel-rate" type="checkbox" onclick="toggle_readonly(\'sel-rate\'); recalc_warehouse_form(true);">'+
    '&nbsp&nbsp&nbsp<label class="label">Remove Case Bonus:</label><input id="rem-case-pay" type="checkbox" onclick="recalc_warehouse_form(true);">'+
    '<br>'+
    '<br>'+
    '<label class="label">Hourly Pay Rate:</label><input id="hourly-pay-rate" type="text" name="hourly_pay_rate" value="0.0" onkeyup="check_num_str(\'hourly-pay-rate\',\'\',false);" onblur="check_num_str(\'hourly-pay-rate\',\'\',false); recalc_warehouse_form(true);" readonly>'+
    '&nbsp&nbsp&nbsp<label class="label-7em">Edit Pay Rate:</label><input id="edit-hourly-pay" type="checkbox"onclick="toggle_readonly(\'hourly-pay-rate\');"></input>'+
    '<br>'+
    '<br>'+
    '<label class="label">Additional Pay:</label><input id="add-pay" type="text" name="additional_pay" value="0.00" onkeyup="check_num_str(\'add-pay\',\'\',false);" onblur="check_num_str(\'add-pay\',\'\',false); recalc_warehouse_form(true);">'+
    '&nbsp&nbsp&nbsp<label class="label">No Additonal Pay:</label><input id="no-add-pay" type="checkbox" onclick="toggle_readonly(\'add-pay\'); document.getElementById(\'add-pay\').value = \'0.00\'; recalc_warehouse_form(true);">'+
    '<br>'+
    '<label class="label">Pay Deductions:</label><input id="deduc-pay" type="text" name="pay_deductions" value="0.00" style="color:red;" onkeyup="check_num_str(\'deduc-pay\',\'\',false);" onblur="check_num_str(\'deduc-pay\',\'\',false); recalc_warehouse_form(true);">'+
    '&nbsp&nbsp&nbsp<label class="label">No Deductions:</label><input id="no-deduc-pay" type="checkbox" onclick="toggle_readonly(\'deduc-pay\'); document.getElementById(\'deduc-pay\').value = \'0.00\'; recalc_warehouse_form(true);">'+
    '<br>'+
    '<br>'+
    '<label class="label">Incentive Pay:</label><input id="incentive-pay" type="text" value="0.0" readonly>'+
    '<br>'+
    '<label class="label">Hourly Pay:</label><input id="hourly-pay" type="text" value="0.0" readonly>'+
    '<br>'+
    '<label class="label">Total Pay:</label><input id="total-pay" type="text" name="total" value="0.0" onblur="recalc_warehouse_form(true);" readonly>'+
    '<br>'+
    '<label class="label">Comments:</label><textarea id="comments" name="comments" rows="4" cols="60" value="" onkeyup="remove_class(\'invalid-field\',this.id); recalc_warehouse_form(true);"></textarea>'+
    '</fieldset>'+
    '<input id="department" type="hidden" name="department" value="warehouse">'+
    '<input id="entering-user" type="hidden" name="entering_user" value="">'+
    '<input id="entry-status" type="hidden" name="entry_status" value="submitted">'+
    '<input id="entry-id" type="hidden" name="entry_id" value="">'+
    '<input id="admin-fix" type="hidden" name="admin_fix" value="">'+
    '<input id="admin-fix-timestamp" type="hidden" name="admin_fix_timestamp" value="">'+
    '<label id="form-errors" class="error-msg hidden-elm">Form errors are highlighted in red</label><br>'+
    '<button id="submit-data-button" type="button">Submit Shift Information</button>'+
    '</form>';
//
//
var backhaul_form = ''+
    '<form id="input-emp-data">'+
    '<fieldset class="fieldset-default">'+
    '<legend>Driver Information</legend>'+
    '<label class="label">Employee ID: </label><input id="emp-id" type="text" name="emp_id" value="" onblur="recalc_backhaul_form(true);" readonly>'+
    '<br>'+
    '<label class="label">Employee First Name: </label><input id="emp-first-name" type="text" name="emp_first_name" value="" onblur="recalc_backhaul_form(true);" readonly>'+
    '<br>'+
    '<label class="label">Employee Last Name: </label><input id="emp-last-name" type="text" name="emp_last_name" value="" onblur="recalc_backhaul_form(true);" readonly>'+
    '</fieldset>'+
    '<br>'+
    '<div id="haul-info">'+
    '</div>'+
    '<br>'+
    '<fieldset class="fieldset-default">'+
    '<legend>Freight Information</legend>'+
    '<label class="label">Delivery Date:</label><input id="date" type="text" name="date" value="" maxlength="10" onkeyup="check_date_str(this.id);" onblur="check_date_str(this.id); recalc_backhaul_form(true);" readonly>'+
    '&nbsp&nbsp&nbsp<label class="label-5em">Edit Date:</label><input id="edit-date" type="checkbox" onclick="toggle_readonly(\'date\');">'+
    '<br>'+
    '<label class="label">Carrier</label><input id="carrier" type="text" name="carrier" onkeyup="remove_class(\'invalid-field\',this.id);"  onblur="remove_class(\'invalid-field\',this.id); recalc_backhaul_form(true);">'+
    '<br>'+
    '<label class="label">Freight Charge</label><input id="freight-charge" type="text" name="freight_charge" onkeyup="remove_class(\'invalid-field\',this.id); check_num_str(this.id);" onblur="remove_class(\'invalid-field\',this.id); check_num_str(this.id); recalc_backhaul_form(true);">'+
    '<br>'+
    '<label class="label">Total Savings</label><input id="total-savings" type="text" name="total_savings" value="0.00" onblur="recalc_backhaul_form(true);" readonly>'+
    '<br>'+
    '</fieldset>'+
    '<input id="number-of-fields" type="hidden" value="0">'+
    '<input id="entering-user" type="hidden" name="entering_user" value="">'+
    '<input id="group-id" type="hidden" name="group_id" value="">'+
    '<input id="admin-fix" type="hidden" name="admin_fix" value="">'+
    '<input id="admin-fix-timestamp" type="hidden" name="admin_fix_timestamp" value="">'+
    '<label id="form-errors" class="error-msg hidden-elm">Form errors are highlighted in red</label><br>'+
    '<button id="submit-data-button" type="button">Submit Backhaul Information</button>'+
    '</form>';
//
//
var meat_shop_item = ''+
    '<form id="meat-shop-item">'+
    '<fieldset class="fieldset-default">'+
    '<legend>Item Information</legend>'+
    '<label class="label">Item Number:</label><input id="item-number" type="text" name="item_number" value="">'+
    "&nbsp;&nbsp;&nbsp;"+
    "<label id=\"item-number-uni-err-msg\" class=\"error-msg hidden-elm\"><sup>*</sup>Item Number is already in use</label>"+
    '<br>'+
    '<label class="label">Item Name:</label><input id="item-name" type="text" name="item_name" value="">'+
    '<br>'+
    '<label class="label">Cost per #</label><input id="cost-per-lb" type="text" name="cost_per_lb" value="" onkeyup="check_num_str(\'cost-per-lb\',\'\',\'\');" onblur="check_num_str(\'cost-per-lb\',\'\',\'\');">'+
    '<br>'+
    '<br>'+
    '<label class="label">Comments:</lable><textarea id = "comments" name="comments" rows="4" cols="60" value=""></textarea>'+
    '</fieldset>'+
    '<br>'+
    '<input id="item-status" type="hidden" name="item_status" value="active">'+
    '<label id="form-errors" class="error-msg hidden-elm">Form errors are highlighted in red</label><br>'+
    '<button id="create-item" type="button" onclick="init_item_form_validation(\'create\');">Create Item</button>'+
    '</form>';
//
//
var stock_change_form = ''+
    '<form id="update-item-stock">'+
    '<fieldset class="fieldset-default">'+
    '<legend>Item Information</legend>'+
    '<label class="label-12em">Item Number:</label><input id="item-number" type="text" name="item_number" value="" disabled>'+
    '<br>'+
    '<label class="label-12em">Item Name:</label><input id="item-name" type="text" name="item_name" value="" disabled>'+
    '<br>'+
    '<label class="label-12em">Current Quantity:</label><input id="curr-quantity" type="text" value="" name="quantity" disabled>'+
    '</fieldset>'+
    '<fieldset class="fieldset-default">'+
    '<legend>Stock Changes</legend>'+
    '<label class="label-12em">Date:</label><input id="date" type="text" name="date" value="" maxlength="10" onkeyup="check_date_str(\'date\',\'\',false);" onblur="check_date_str(\'date\',\'\',false);" readonly>'+
    '&nbsp&nbsp&nbsp<label class="label-5em">Edit Date:</label><input id="edit-date" type="checkbox" onclick="toggle_readonly(\'date\');">'+
    '<br>'+
    '<label id="orig-amount-label" class="label-12em hidden-elm">Original Amount:</label><input id="orig-amount" type="text" class="hidden-elm" value="0.00" name="amount" disabled><br>'+
    '<label id="amount-label" class="label-12em">Add/Remove Pounds:</label><input id="amount" type="text" name="amount" value="0.00" onkeyup="check_num_str(\'amount\',\'\',false);" onblur="check_num_str(\'amount\',\'\',false);">'+
    '<br>'+
    '<label class="label-12em">Updated Quantity:</label><input id="new-quantity" type="text" value="" readonly>'+
    '<br>'+
    '<br>'+
    '<label class="label-12em">Comments:</lable><textarea id = "comments" name="comments" rows="4" cols="60" value=""></textarea>'+
    '</fieldset>'+
    '<input id="entry-status" type="hidden" name="entry_status" value="submitted">'+
    '<input id="entry-id" type="hidden" name="entry_id" value="">'+
    '<button id="create-record" type="button" onclick="validate_stock_form(\'create\');">Update Item</button>'+
    '</form>';
//
//
var sales_rep_form = ''+
    "<form id=\"sales-rep-form\" method=\"POST\">"+
    "<fieldset class=\"fieldset-default\">"+
    "<legend>Basic Information</legend>"+
    "<br>"+
    "<label class=\"label\">Sales Rep ID<span style=\"color: red;\"><sup>*</sup></span></label><input id=\"rep-id\" class=\"text-input\" type=\"text\" name=\"rep_id\" onkeyup=\"remove_class('invalid-field',this.id);\">"+
    "&nbsp;&nbsp;&nbsp;"+
    "<label id=\"rep-id-uni-err\" class=\"error-msg hidden-elm\"><sup>*</sup>Unique Rep ID Required</label>"+
    "<br>"+
    "<label class=\"label\">First Name<span style=\"color: red;\"><sup>*</sup></span></label><input id=\"dbuser-first-name\" class=\"text-input\" type=\"text\" name=\"dbuser_first_name\" onkeyup=\"remove_class('invalid-field',this.id);\">"+
    "<br>"+
    "<label class=\"label\">Last Name<span style=\"color: red;\"><sup>*</sup></span></label><input id=\"dbuser-last-name\" class=\"text-input\" type=\"text\" name=\"dbuser_last_name\" onkeyup=\"remove_class('invalid-field',this.id);\">"+
    "<br>"+
    "<label class=\"label\">Email</label><input id=\"email\" class=\"text-input\"  type=\"text\" name=\"user_email\" onkeyup=\"remove_class('invalid-field',this.id); check_email_str(this.id,'email-err-str',false)\">"+
    "<label id=\"email-err-str\" class=\"error-msg hidden-elm\">&nbsp;&nbsp;&nbsp;Error - Invalid Email Format, Valid Format: example@foo.bar</label><br>"+
    "<br>"+
    "</fieldset>"+
    "<br>"+
    "<fieldset class=\"fieldset-default\">"+
    "<legend>Login Information</legend>"+
    "<label class=\"label\">Username<span style=\"color: red;\"><sup>*</sup></span></label>"+"<input id=\"username\" class=\"text-input\" type=\"text\" name=\"username\" onkeyup=\"remove_class('invalid-field',this.id);\">"+
    "<label id=\"username-uni-err\" class=\"error-msg hidden-elm\">&nbsp;&nbsp;&nbsp;Username is taken</label><br>"+
    "<label class=\"label\">Password<span style=\"color: red;\"><sup>*</sup></span></label><input id=\"password\" class=\"text-input\" type=\"password\" name=\"password\" onkeyup=\"remove_class('invalid-field',this.id); check_equality('password','conf-password','pass-not-equal-err-str',false);\"><br>"+
    "<label class=\"label\">Confirm Password<span style=\"color: red;\"><sup>*</sup></span></label><input id=\"conf-password\" class=\"text-input\" type=\"password\" onkeyup=\"remove_class('invalid-field',this.id); check_equality('password','conf-password','pass-not-equal-err-str',false);\">"+
    "<label id=\"pass-not-equal-err-str\" class=\"error-msg hidden-elm\">&nbsp;&nbsp;&nbsp;Error - Password and Confirm Password Do Not Match</label><br>"+
    "</fieldset>"+
    "<br>"+
    "<fieldset class=\"fieldset-default\">"+
    "<legend>Other Information</legend>"+
    '<label class="label">Comments:</label><textarea id="comments" name="comments" rows="4" cols="60" value="" onkeyup="remove_class(\'invalid-field\',this.id);"></textarea>'+
    "</fieldset>"+
    "<input id=\"department\" type=\"hidden\" name=\"department\" value=\"sales_rep\"></input>"+
    "<input id=\"permissions\" type=\"hidden\" name=\"permissions\" value=\"0040\"></input>"+
    "<input id=\"dbuser-status\" type=\"hidden\" name=\"dbuser_status\" value=\"active\"></input>"+
    "<input id=\"dbuser-internal-id\" type=\"hidden\" name=\"dbuser_internal_id\" value=\"\">"+
    // button and err msg
    "<label id=\"form-errors\" class=\"error-msg hidden-elm\">Form errors are highlighted in red</label><br>"+
    "<button id=\"submit-rep-form\" type=\"button\" onclick=\"init_rep_form_valiation('create');\">Add New Rep</button>"+
    "</form>";
//
//
var sales_customer_form = ''+
    '<form id="sales-customer-form" method="POST">'+
    '<fieldset class="fieldset-default">'+
    '<legend>Customer Information</legend>'+
    '<br>'+
    '<label class="label">Customer ID<span style="color: red;"><sup>*</sup></span></label><input id="customer-id" class="text-input" type="text" name="customer_id" onkeyup="remove_class(\'invalid-field\',this.id);">'+
    '&nbsp;&nbsp;&nbsp;'+
    '<label id="customer-id-uni-err" class="error-msg hidden-elm"><sup>*</sup>Unique Customer ID Required</label>'+
    '<br>'+
    '<label class="label">Customer Name<span style="color: red;"><sup>*</sup></span></label><input id="customer-name" class="text-input" type="text" name="customer_name" onkeyup="remove_class(\'invalid-field\',this.id);">'+
    '<br>'+
    '<label class="label">Customer Status</label><input id="customer-status" class="text-input" type="text" name="customer_status" value="active" onkeyup="remove_class(\'invalid-field\',this.id);">'+
    '<br>'+
    '<label class="label">Associated Sales Rep<span style="color: red;"><sup>*</sup></span></label>'+
    '<select id="rep-id" name="rep_id" onchange="remove_class(\'invalid-field\',this.id);"></select>'+
    '<br>'+
    '</fieldset>'+
    '<br>'+
    '<fieldset class="fieldset-default">'+
    '<legend>Other Information</legend>'+
    '<label class="label">Comments:</label><textarea id="comments" name="comments" rows="4" cols="60" value="" onkeyup="remove_class(\'invalid-field\',this.id);"></textarea>'+
    '</fieldset>'+
    '<input id="customer-internal-id" type="hidden" name="customer_internal_id" value="">'+
    '<label id="form-errors" class="error-msg hidden-elm">Form errors are highlighted in red</label><br>'+
    '<button id="submit-customer-form" type="button" onclick="init_customer_form_valiation(\'create\');">Add New Customer</button>'+
    '</form>';
//
// this function will return one of the above forms to a page
function create_form(form_name,out_id) {
    var forms = {}
    forms.add_employee = add_employee;
    forms.add_dbuser = add_dbuser;
    forms.receiving_data = receiving_data;
    forms.transportation_data = transportation_data;
    forms.backhaul_form = backhaul_form;
    forms.general_data_form = general_data_form;
    forms.warehouse_data = warehouse_data;
    forms.meat_shop_item = meat_shop_item;
    forms.stock_change_form = stock_change_form;
    forms.sales_rep_form = sales_rep_form;
    forms.sales_customer_form = sales_customer_form;
    //
    if (!!(forms[form_name])) {
        document.getElementById(out_id).innerHTML = forms[form_name];
    }
    else {
       document.getElementById(out_id).innerHTML = "No form with that name found.";
    }
    return;
}
//
// this iterates over a provided list of objects to append child nodes to a parent element
function addChildren(parentNode,elementsArray) {
    for (var i = 0; i < elementsArray.length; i++) {
        var elm_obj = elementsArray[i];
        // creating element
        var element = document.createElement(elm_obj['elm'].toUpperCase());
        delete elm_obj['elm'];
        // handling text nodes
        if (elm_obj.hasOwnProperty('textNode')) { element.appendChild(document.createTextNode(elm_obj['textNode'])); delete elm_obj['textNode'];}
        // adding events to element
        if (elm_obj.hasOwnProperty('events')) {
            for (var e = 0; e < elm_obj['events'].length; e++) {
                element.addEventListener(elm_obj['events'][e]['event'] , elm_obj['events'][e]['function']);
            }
            delete elm_obj['events'];
        }
        // adding properties to element
        for(var prop in elm_obj) {
            element[prop] = elm_obj[prop];
        }
        //
        if (element.id == '') {
            parentNode.appendChild(element);
        }
        else if (document.getElementById(element.id)) {
            parentNode.replaceChild(element,document.getElementById(element.id));
        }
        else {
            parentNode.appendChild(element);
        }
    }
}
//
// this removes all children from an element
function remove_all_children(element,args) {
    //
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}
//
// this creates the time range inputs for a page
function create_time_range_inputs(input_args) {
    //
    // defining static inputs
    var date_range_onclick  = "toggle_view_element_button('show_date_range','date_range','Hide Date Range','Show Date Ranage'); toggle_disabled('time-range,st-day,st-month,st-year,en-day,en-month,en-year');";
    var st_img_onclick  = "create_calander('calander','0','st-day','st-month','st-year'); show_hide('calander');";
    var end_img_onclick = "create_calander('calander','0','en-day','en-month','en-year'); show_hide('calander');";
    //
    // initializing variable inputs
    var time_range_onchange = '';
    var day_onkeyup = '';
    var month_onchange = '';
    var year_onchange  = '';
    //
    // creating date objects for time range inputs
    var today = new Date();
    var first = new Date(today.getFullYear(),today.getMonth(),1);
    var curr_wk  = [new Date(today.getFullYear(),today.getMonth(),(today.getDate()-today.getDay()))];
    curr_wk[1]   = new Date(curr_wk[0].getFullYear(),curr_wk[0].getMonth(),(curr_wk[0].getDate()+6))
    var last_2wk = [new Date(today.getFullYear(),today.getMonth(),(today.getDate()-today.getDay()-7)),curr_wk[1]];
    var last_4wk = [new Date(today.getFullYear(),today.getMonth(),(today.getDate()-today.getDay()-21)),curr_wk[1]];
    var curr_mth = [new Date(first.getFullYear(),first.getMonth(),(first.getDate()-first.getDay()))];
    curr_mth[1]  = new Date(first.getFullYear(),first.getMonth()+1,1);
    curr_mth[1]  = new Date(curr_mth[1].getFullYear(),curr_mth[1].getMonth(),(curr_mth[1].getDate()+(6-curr_mth[1].getDay())));
    var curr_pp = new Date(CONSTANTS.FIRST_BUSINESS_DAY[0],+CONSTANTS.FIRST_BUSINESS_DAY[1]-1,CONSTANTS.FIRST_BUSINESS_DAY[2]);
    var test_date = curr_pp;
    curr_pp = [curr_pp]
    for (var w = 0; w < 60; w+=2) {
        test_date = new Date(test_date.getFullYear(),test_date.getMonth(),(test_date.getDate()+14));
        curr_pp[1] = new Date(test_date.getFullYear(),test_date.getMonth(),(test_date.getDate()-1));
        if (test_date > today) {break;}
        curr_pp = [test_date];
    }
    var prev_pp = [new Date(curr_pp[0].getFullYear(),curr_pp[0].getMonth(),(curr_pp[0].getDate()-14))];
    prev_pp[1]  = new Date(curr_pp[0].getFullYear(),curr_pp[0].getMonth(),(curr_pp[0].getDate()-1));
    curr_wk  = curr_wk[0].yyyymmdd()+ '|' +curr_wk[1].yyyymmdd();
    last_2wk = last_2wk[0].yyyymmdd()+'|' +last_2wk[1].yyyymmdd();
    last_4wk = last_4wk[0].yyyymmdd()+'|' +last_4wk[1].yyyymmdd();
    curr_mth = curr_mth[0].yyyymmdd()+'|' +curr_mth[1].yyyymmdd();
    curr_pp  = curr_pp[0].yyyymmdd()+ '|' +curr_pp[1].yyyymmdd();
    prev_pp  = prev_pp[0].yyyymmdd()+ '|' +prev_pp[1].yyyymmdd();
    //
    // processing input args
    if (!!(input_args.time_range_onchange)) {time_range_onchange = input_args.time_range_onchange;}
    if (!!(input_args.day_onkeyup)) {day_onkeyup = input_args.day_onkeyup;}
    if (!!(input_args.month_onchange)) {month_onchange = input_args.month_onchange;}
    if (!!(input_args.year_onchange)) {year_onchange = input_args.year_onchange;}
    if (!!(input_args.add_date_range_onclick)) {date_range_onclick += input_args.add_date_range_onclick;}
    if (!!(input_args.add_st_img_onclick)) {st_img_onclick += input_args.st_img_onclick;}
    if (!!(input_args.add_end_img_onclick)) {end_img_onclick += input_args.add_end_img_onclick;}
    //
    // creating output fields
    var output = ''+
      '<label class="label">Time Range:</label>'+
      '<select id="time-range" class="dropbox-input" name="time-range" onchange="'+time_range_onchange+'">'+
        '<option value="'+curr_wk+'">Current Week</option>'+
        '<option value="'+curr_pp+'">Current Pay Period</option>'+
        '<option value="'+prev_pp+'">Previous Pay Period</option>'+
        '<option value="'+last_2wk+'">Last 2 Weeks</option>'+
        '<option value="'+last_4wk+'">Last 4 Weeks</option>'+
        '<option value="'+curr_mth+'">Current Month</option>'+
      '</select>'+
      '&nbsp;&nbsp;'+
      '<button id="show_date_range" type="button" name="show_date_range" onclick="'+date_range_onclick+'">Show Date Range</button>'+
      '<div id="date_range" class="hidden-elm" name="date_range">'+
      '<span id="calander" class="cal-span hidden-elm"></span>'+
      '<label class="label-4em">From:</label>'+
      '<input id="st-day" class="text-input-xsmall" type="text" name="st-day" maxlength=2 value="01" onkeyup="'+day_onkeyup+'" disabled>'+
      '&nbsp;'+
      '<select id="st-month" class="dropbox-input" name="st-month" onchange="'+month_onchange+'" disabled>'+
        '<option id="1" value="01">January</option>'+
        '<option id="2" value="02">February</option>'+
        '<option id="3" value="03">March</option>'+
        '<option id="4" value="04">April</option>'+
        '<option id="5" value="05">May</option>'+
        '<option id="6" value="06">June</option>'+
        '<option id="7" value="07">July</option>'+
        '<option id="8" value="08">August</option>'+
        '<option id="9" value="09">September</option>'+
        '<option id="10" value="10">October</option>'+
        '<option id="11" value="11">November</option>'+
        '<option id="12" value="12">December</option>'+
      '</select>'+
      '&nbsp;'+
      '<select id="st-year" class="dropbox-input" name="st-year" onchange="'+year_onchange+'" disabled>'+
      '</select>'+
      '&nbsp;&nbsp;&nbsp;&nbsp;'+
      '<a onclick="'+st_img_onclick+'"><image id="cal_st_image" class="cal-image"  src="http://www.afwendling.com/operations/images/calander.png"></a>'+
      '<br>'+
      '<label class="label-4em">To:</label>'+
      '<input id="en-day" class="text-input-xsmall" type="text" name="en-day" maxlength=2 value="01" onkeyup="'+day_onkeyup+'" disabled>'+
      '&nbsp;'+
      '<select id="en-month" class="dropbox-input" name="en-month" onchange="'+month_onchange+'" disabled>'+
        '<option id ="1" value="01">January</option>'+
        '<option id ="2" value="02">February</option>'+
        '<option id ="3" value="03">March</option>'+
        '<option id ="4" value="04">April</option>'+
        '<option id ="5" value="05">May</option>'+
        '<option id ="6" value="06">June</option>'+
        '<option id ="7" value="07">July</option>'+
        '<option id ="8" value="08">August</option>'+
        '<option id ="9" value="09">September</option>'+
        '<option id ="10" value="10">October</option>'+
        '<option id ="11" value="11">November</option>'+
        '<option id ="12" value="12">December</option>'+
      '</select>'+
      '&nbsp;'+
      '<select id="en-year" class="dropbox-input" name="en-year" onchange="'+year_onchange+'" disabled>'+
      '</select>'+
      '&nbsp;&nbsp;&nbsp;&nbsp;'+
      '<a onclick="'+end_img_onclick+'"><image id="cal_en_image" class="cal-image" src="http://www.afwendling.com/operations/images/calander.png"></a>'+
      '';
    //
    document.getElementById(input_args.output_id).innerHTML = output;
    //
    populate_year_dropboxes('st-year');
    populate_year_dropboxes('en-year');
}
//
// this determines the time beginning and end of a pay period for a given date
function find_pay_period(date) {
    var start_ts,end_ts
    var ts_arr = [false,false]
    //
    if (date instanceof Array) {
        if (date.length < 3) { console.log('Error in date array: ',date); return ts_arr;}
        date = new Date(Number(date[0]),Number(date[1])-1,Number(date[2]));
    }
    else if ((typeof date == 'string') || (date instanceof String)) {
        var date_arr = date.match(/(\d+).(\d+).(\d+)/)
        if (date_arr.length < 4) { console.log('Error in date string: ',date); return ts_arr;}
        date = new Date(Number(date_arr[1]),Number(date_arr[2])-1,Number(date_arr[3]));
    }
    //
    var st_pp = new Date(CONSTANTS.FIRST_BUSINESS_DAY[0],+CONSTANTS.FIRST_BUSINESS_DAY[1]-1,CONSTANTS.FIRST_BUSINESS_DAY[2]);
    var test_date = st_pp;
    ts_arr = [st_pp]
    if (date < st_pp) {
        while (true) {
            ts_arr[1] = new Date(test_date.getFullYear(),test_date.getMonth(),(test_date.getDate()));
            test_date = new Date(test_date.getFullYear(),test_date.getMonth(),(test_date.getDate()-14));
            ts_arr[0] = test_date;
            if ((date >= ts_arr[0]) && (date <= ts_arr[1])) {break;}
            if (date >= ts_arr[0]) { break;}
        }
    }
    else {
        while (true) {
            test_date = new Date(test_date.getFullYear(),test_date.getMonth(),(test_date.getDate()+14));
            ts_arr[1] = new Date(test_date.getFullYear(),test_date.getMonth(),(test_date.getDate()-1));
            if (test_date >= date) { break;}
            ts_arr = [test_date];
        }
    }
    //
    ts_arr[0] = ts_arr[0].yyyymmdd();
    ts_arr[1] = ts_arr[1].yyyymmdd();
    //
    return ts_arr;
}
//
// this creates the haul information area on the backhaul form
function create_haul_fields(out_id,entry_num) {
    //
    // building the form by element so it doesn't reset the exiting entries
    // creating elements
    var fieldset = document.createElement('FIELDSET');
    var formElements = Array(
            {'elm' : 'legend','textNode' : 'Haul '+(entry_num+1)},
            //
            {'elm' : 'label', 'className' : 'label','textNode' : 'PO Number'},
            {'elm' : 'input', 'id' : 'po-number-{'+entry_num+'}', 'type' : 'text', 'name' : 'po_number', 'events' : [{'event' : 'keyup', 'function' : function() {remove_class('invalid-field',this.id);}}, {'event' : 'blur', 'function' : function() {recalc_backhaul_form(true);}}]},
            {'elm' : 'br'},
            //
            {'elm' : 'label', 'className' : 'label','textNode' : 'Pick Up Point'},
            {'elm' : 'input', 'id' : 'pickup-point-{'+entry_num+'}', 'type' : 'text', 'name' : 'pickup_point', 'events' : [{'event' : 'keyup', 'function' : function() {remove_class('invalid-field',this.id);}}, {'event' : 'blur', 'function' : function() {recalc_backhaul_form(true);}}]},
            {'elm' : 'br'},
            //
            {'elm' : 'label', 'className' : 'label','textNode' : 'Freight Allowance'},
            {'elm' : 'input', 'id' : 'freight-allowance-{'+entry_num+'}', 'type' : 'text', 'name' : 'freight_allowance', 'placeholder' : '0.00', 'events' : [{'event' : 'keyup', 'function' : function() {remove_class('invalid-field',this.id); check_num_str(this.id);}}, {'event' : 'blur', 'function' : function() {recalc_backhaul_form(true);}}]},
            {'elm' : 'br'},
            //
            {'elm' : 'label', 'className' : 'label','textNode' : 'Pallet Charges'},
            {'elm' : 'input', 'id' : 'pallet-charges-{'+entry_num+'}', 'type' : 'text', 'name' : 'pallet_charge', 'placeholder' : '0.00', 'events' : [{'event' : 'keyup', 'function' : function() {remove_class('invalid-field',this.id); check_num_str(this.id);}}, {'event' : 'blur', 'function' : function() {recalc_backhaul_form(true);}}]},
            {'elm' : 'br'},
            //
            {'elm' : 'label', 'className' : 'label','textNode' : 'Comments:'},
            {'elm' : 'textarea', 'id' : 'comments-{'+entry_num+'}', 'name' : 'comments', 'rows' : '2', 'cols' : '60', 'events' : [{'event' : 'keyup', 'function' : function() {remove_class('invalid-field',this.id);}}, {'event' : 'blur', 'function' : function() {recalc_backhaul_form(true);}}] },
            {'elm' : 'br'},
            //
            {'elm' : 'input', 'id' : 'entry-id-{'+entry_num+'}', 'name' : 'entry_id', 'type' : 'hidden'},
            {'elm' : 'input', 'id' : 'entry-status-{'+entry_num+'}', 'name' : 'entry_status', 'type' : 'hidden', 'value' : 'submitted'},
            //
            {'elm' : 'button', 'id' : 'remove-haul-info-'+entry_num, 'type' : 'button', 'textNode' : 'Remove Haul '+(entry_num+1), 'events' : [{'event' : 'click', 'function' : function() {document.getElementById('haul-info-'+entry_num).remove();}}]}
        );
    //
    // stepping through form_elements array to construct fieldset element
    fieldset.id = 'haul-info-'+entry_num;
    fieldset.className = 'fieldset-default';
    addChildren(fieldset,formElements);
    //
    document.getElementById(out_id).appendChild(fieldset);
    document.getElementById('number-of-fields').value = entry_num;
}
//
// handles the calander inputs
function create_calander(out_id,mon_shift,day_id,mon_id,year_id) {
    //
    // defining initial static variables
    var cal_table = '';
    var mon_shift = parseInt(mon_shift);
    var mon_arr = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var dow_arr = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
    var todays_date = new Date();
    todays_date = new Date(todays_date.getFullYear(),todays_date.getMonth(),todays_date.getDate());
    var adj_date = new Date(todays_date.getFullYear(),todays_date.getMonth()+mon_shift,1);
    //
    // putting selected class on date entries
    remove_class_all('selected-field');
    add_class('selected-field',day_id);
    add_class('selected-field',mon_id);
    add_class('selected-field',year_id);
    //
    // defining the onclick functions
    var head_onclick = "create_calander('"+out_id+"','%mon_shift%','"+day_id+"','"+mon_id+"','"+year_id+"');";
    var day_onclick = "set_date('%day%','%month%','%year%','"+day_id+"','"+mon_id+"','"+year_id+"','"+out_id+"');";
    var day_onmouseenter = "add_class('cal-day-highlight','year-%year%-mon-%month%-day-%day%');";
    var day_onmouseleave = "remove_class('cal-day-highlight','year-%year%-mon-%month%-day-%day%');";
    //
    // creating calander header
    cal_table =  '<table id="calander" class="cal-table" cellpadding="0">';
    cal_table += '<tr>'
    cal_table += '<td id="cal-month" class="cal-table-month" colspan="7">';
    cal_table += '<span style="float: left;" onclick="'+head_onclick.replace(/%mon_shift%/,mon_shift-1)+'">&nbsp;&lt;&lt;</span>';
    cal_table += '&nbsp;&nbsp;<span class="">'+mon_arr[adj_date.getMonth()]+'&nbsp;&nbsp;'+adj_date.getFullYear()+'</span>&nbsp;&nbsp;';
    cal_table += '<span style="float: right;" onclick="'+head_onclick.replace(/%mon_shift%/,mon_shift+1)+'">&gt;&gt;&nbsp;</span>';
    cal_table += '</td>';
    cal_table += '</tr>';
    //
    cal_table += '<tr>'
    for (var i = 0; i < dow_arr.length; i++) {
        cal_table += '<td class="cal-table-wkhead">'+dow_arr[i]+'</td>';
    }
    //
    // outputting the rows of days
    adj_date = new Date(adj_date.getFullYear(),adj_date.getMonth(),1-adj_date.getDay());
    cal_table += '<tr>';
    for (var d = 0; d < 42; d++) {
        //console.log(d,adj_date);
        if (d%7 == 0) {cal_table += '</tr><tr>';}
        //
        // updating date specific functions
        var onclick_str = day_onclick;
        var onmouseenter_str = day_onmouseenter;
        var onmouseleave_str = day_onmouseleave;
        onclick_str = onclick_str.replace(/%day%/,adj_date.getDate());
        onclick_str = onclick_str.replace(/%month%/,adj_date.getMonth());
        onclick_str = onclick_str.replace(/%year%/,adj_date.getFullYear());
        onmouseenter_str = onmouseenter_str.replace(/%day%/,adj_date.getDate());
        onmouseenter_str = onmouseenter_str.replace(/%month%/,adj_date.getMonth());
        onmouseenter_str = onmouseenter_str.replace(/%year%/,adj_date.getFullYear());
        onmouseleave_str = onmouseleave_str.replace(/%day%/,adj_date.getDate());
        onmouseleave_str = onmouseleave_str.replace(/%month%/,adj_date.getMonth());
        onmouseleave_str = onmouseleave_str.replace(/%year%/,adj_date.getFullYear());
        //
        var class_str = 'cal-table-day';
        if (adj_date == todays_date) {class_str += ' cal-table-today'}
        cal_table += '<td id="year-'+adj_date.getFullYear()+'-mon-'+adj_date.getMonth()+'-day-'+adj_date.getDate()+'" class="cal-table-day" onmouseenter="'+onmouseenter_str+'" onmouseleave="'+onmouseleave_str+'" onclick="'+onclick_str+'">'+adj_date.getDate()+'</td>';
        //
        adj_date = new Date(adj_date.getFullYear(),adj_date.getMonth(),adj_date.getDate()+1);
    }
    //
    cal_table += '</table>';
    document.getElementById(out_id).innerHTML = cal_table;
    //
    if (document.getElementById('year-'+todays_date.getFullYear()+'-mon-'+todays_date.getMonth()+'-day-'+todays_date.getDate())) {add_class('cal-table-today','year-'+todays_date.getFullYear()+'-mon-'+todays_date.getMonth()+'-day-'+todays_date.getDate())}
}
//
// upates the actual input fields with the date selection from the calander
function set_date(day,mon,year,day_id,mon_id,year_id,cal_id) {
    var mon_arr = ['December','January','February','March','April','May','June','July','August','September','October','November','December']
    var year_ind = (new Date().getFullYear() - parseInt(year));
    document.getElementById(day_id).value = day
    document.getElementById(mon_id).selectedIndex = mon;
    document.getElementById(year_id).selectedIndex = year_ind
    //
    // dispatching events to each element
    var event = document.createEvent("HTMLEvents");
    event.initEvent("keyup",true,false);
    document.getElementById(day_id).dispatchEvent(event);
    var event = document.createEvent("HTMLEvents");
    event.initEvent("change",true,false);
    document.getElementById(mon_id).dispatchEvent(event);
    document.getElementById(year_id).dispatchEvent(event);
    //
    show_hide(cal_id)
    remove_class_all('selected-field');
}
//
// this function gets a row from a table using the unique col and data entry
function populate_form(populate_form_args) {
    //
    // processing arg object
    var table = populate_form_args.table
    var unique_col = populate_form_args.unique_col
    var unique_data = populate_form_args.unique_data
    var form_id = populate_form_args.form_id
    //
    // creating sql statment
    var sql = ""
    var sql_args = {};
    sql_args.cmd = "SELECT";
    sql_args.table = table;
    sql_args.where = [[unique_col,'LIKE',unique_data]];
    sql = gen_sql(sql_args);
    //
    var callback_fun = function(response) {
        populate_form_args.data_arr = response.data[0];
        process_form_data(populate_form_args)
        if (!!(populate_form_args.add_callback_funs)) {
        populate_form_args.add_callback_funs();
        }
    }
    ajax_fetch([sql],['data'],callback_fun);
}
//
// this function processes the response from populate form
// it is assumed that the fields name matches the respoective column name
function process_form_data(populate_form_args) {
    //
    var data_arr = populate_form_args.data_arr;
    var form_id = populate_form_args.form_id;
    var skip_arr = [];
    if (populate_form_args.skip_fields_str) {
        skip_arr = populate_form_args.skip_fields_str.split(',');
    }
    //
    // getting all elements of the form
    var all_children = document.getElementById(form_id).getElementsByTagName("*");
    //
    // stepping through children
    for (var i = 0; i < all_children.length; i++) {
        // checking if child node is an element
        if (all_children[i].nodeType != 1) {continue;}
        // checking if element has a name assigned
        if (!(all_children[i].name)) {continue;}
        if (skip_arr.indexOf(trim(all_children[i].name)) > -1) {continue;}
        if (!(data_arr.hasOwnProperty(all_children[i].name))) {continue;}
        // if the object has the elements name then it sets it to that value
        if (all_children[i].nodeName.toUpperCase() == 'SELECT') {
            all_children[i].value = "other";
            for (var opt = 0; opt < all_children[i].length; opt++){
                if (all_children[i].options[opt].value == data_arr[all_children[i].name]){
                  all_children[i].value = data_arr[all_children[i].name];
                  break;
                }
            }
            if (populate_form_args.trigger_events == true) {
                var event = document.createEvent("HTMLEvents");
                event.initEvent("change",true,false);
                all_children[i].dispatchEvent(event);
            }
        }
        // checkbox logic
        else if ((all_children[i].type.toUpperCase() == 'CHECKBOX')) {
            //
            if ((parseFloat(data_arr[all_children[i].name]) != 0) && (data_arr[all_children[i].name] != '')) {
                //
                all_children[i].checked = true;
                all_children[i].value = data_arr[all_children[i].name]
                //
                if (populate_form_args.trigger_events == true) {
                    var event = document.createEvent("HTMLEvents");
                    event.initEvent("click",true,false);
                    all_children[i].dispatchEvent(event);
                }
            }
        }
        else {
            all_children[i].value = data_arr[all_children[i].name];
            //
            if (populate_form_args.trigger_events == true) {
                var event = document.createEvent("HTMLEvents");
                event.initEvent("keyup",true,false);
                all_children[i].dispatchEvent(event);
            }
        }
    }
}
//
// this function disables child inputs of a parent element
function toggle_children(parent_id,skip_ids,disable) {
    var skip_arr = skip_ids.split(',');
    var all_children = document.getElementById(parent_id).getElementsByTagName("*");
    //
    for (var i = 0; i < all_children.length; i++) {
        // checking if child node is an element
        if (all_children[i].nodeType != 1) {continue;}
        if (skip_arr.indexOf(all_children[i].id) >= 0) {continue;}
        all_children[i].disabled = disable;
    }
}
//
// this function will get database data and fill the dropbox with it
function populate_dropbox_options(dropbox_id,table,value_col,text_col,place_holder,add_args) {
    //
    // creating SQL statment
    var sql = '';
    var sql_args = {};
    var place_holder_value = '';
    var place_holder_status = 'disabled selected';
    var text_format = '%'+text_col+'%';
    var value_format = '%'+value_col+'%';
    var callback = false;
    sql_args.cmd = "SELECT";
    sql_args.table = table;
    sql_args.cols = [value_col,text_col];
    // processing additional arguments
    if (!(add_args)) { add_args = {};}
    if (!!(add_args.value_format)) { value_format = add_args.value_format;}
    if (!!(add_args.format_str)) { text_format = add_args.format_str;}
    if (!!(add_args.add_cols)) { sql_args.cols = sql_args.cols.concat(add_args.add_cols);}
    if (!!(add_args.sql_where)) { sql_args.where = add_args.sql_where;}
    if (!!(add_args.place_holder_value)) {place_holder_value = add_args.place_holder_value;}
    if (!!(add_args.place_holder_status)) {place_holder_status = add_args.place_holder_status;}
    if (!!(add_args.add_callback)) {callback = add_args.add_callback;}
    if (!!(add_args.sql_args)) {
        for (var arg in add_args.sql_args) { sql_args[arg] = add_args.sql_args[arg];}
    }
    sql = gen_sql(sql_args);
    //
    // temporary function to populate a drop box
    var pop_dropbox = function(response) {
        var dropbox = document.getElementById(dropbox_id)
        var data_arr = response.data;
        var opt = null;
        var opt_attr = {};
        //
        // creating options for dropbox
        dropbox.removeAll();
        if (place_holder != ''){
            opt_attr = {'value' : place_holder_value}
            opt = document.createElementWithAttr('OPTION',opt_attr);
            if (place_holder_status) { opt[place_holder_status] = true;}
            opt.addTextNode(place_holder);
            dropbox.appendChild(opt);
        }
        //
        for (var i = 0; i < data_arr.length; i++) {
            var text = text_format;
            var value = value_format;
            for (var prop in data_arr[i]) { text = text.replace('%'+prop+'%',data_arr[i][prop]); value = value.replace('%'+prop+'%',data_arr[i][prop]);}
            opt_attr = {'value' : value}
            opt = document.createElementWithAttr('OPTION',opt_attr);
            opt.addTextNode(text);
            dropbox.appendChild(opt);
        }
        //
        // placing additional options in list
        if (!!(add_args.add_opts_val)) {
            for (var i = 0;  i < add_args.add_opts_val.length; i++) {
                opt_attr = {'value' : add_args.add_opts_val[i]}
                opt = document.createElementWithAttr('OPTION',opt_attr);
                opt.addTextNode(add_args.add_opts_text[i]);
                dropbox.appendChild(opt);
            }
        }
        //
        if (callback) {callback();}
    }
    //
    // fetching data and populating the dropbox
    ajax_fetch([sql],['data'],pop_dropbox)
}
//
// this function specifically populates the year dropboxes
// based on the first_year_with_data value in operations_constants table
function populate_year_dropboxes(dropbox_id) {
    //
    var options_str = '';
    var date = new Date();
    var curr_year = date.getFullYear();
    var first_year = CONSTANTS.FIRST_YEAR_WITH_DATA;
    var dropbox = document.getElementById(dropbox_id);
    var opt = null;
    var opt_attr = {};
    for (var y = curr_year; y >= first_year; y--) {
        opt_attr = {'id' : dropbox_id+'-'+y, 'value' : y}
        opt = document.createElementWithAttr('OPTION',opt_attr);
        opt.appendChild(document.createTextNode(y));
        dropbox.appendChild(opt);
    }
}