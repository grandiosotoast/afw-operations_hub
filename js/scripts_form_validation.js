////////////////////////////////////////////////////////////////////////////////
////////////// This file holds the various javascript functions      ///////////
////////////// that are associated with validating entries on forms  ///////////
////////////////////////////////////////////////////////////////////////////////
"use strict";
//
// checks if two input fields have the same text
function check_equality(elm_id1,elm_id2,err_str_id,ret_val) {
    var v1 = trim(document.getElementById(elm_id1).value);
    var v2 = trim(document.getElementById(elm_id2).value);
    var error = false
	if (v1 != v2) {
        add_class('invalid-field',elm_id1)
        add_class('invalid-field',elm_id2)
        if (err_str_id != '') {remove_class('hidden-elm',err_str_id);}
        error = true
    }
    else {
        remove_class('invalid-field',elm_id1)
        remove_class('invalid-field',elm_id2)
        if (err_str_id != '') {add_class('hidden-elm',err_str_id)}
        error = false
	}
	//
    if (ret_val == true) {return error;}
}
//
// checks if a value is unquie in the tables column
// add in the fetch_db javacript to this eventually to handle the ajax request
function check_unique(form_id,uni_elm_id,cmpr_elm_id,table,validate_callback_fun) {
    //
    //
    var unique_err = false
    var cmpr_val = '';
    var cmpr_col = '';
    //
    // getting vals and col_names of HTML element
    var uni_val = document.getElementById(uni_elm_id).value
    var uni_col = document.getElementById(uni_elm_id).getAttribute("name");
    if (cmpr_elm_id != '') {
        var cmpr_val = document.getElementById(cmpr_elm_id).value
        var cmpr_col = document.getElementById(cmpr_elm_id).getAttribute("name");
    }
    //
    var sql_args = {};
    sql_args.cmd = "SELECT";
    sql_args.table = table;
    sql_args.where = [[uni_col,'LIKE',uni_val]];
    var sql = gen_sql(sql_args);
    //
    var callback = function(response) {
        var data_arr = response[0];
        //
        // checking values returned
        if ((cmpr_col == '') && !!(data_arr[0])) {unique_err = true;}
        else if (!!(data_arr[0])) {
            if (data_arr[0][cmpr_col] != cmpr_val) {
                unique_err = true;
                console.log("Error - "+uni_col+": "+uni_val+" is already in use.");
            }
        }
        //
        // performing additional form validation and submitting the
        validate_callback_fun(unique_err);
        return;
    }
    //
    ajax_fetch([sql],[0],callback);
}
//
// this function calls the respective validation function based on data type
function check_data_type(input_id,type,ret_val) {
    //
    var error = false;
    //
    if (type == 'date') {
        error = check_date_str(input_id,'',true);
    }
    else if (type == 'email') {
        error = check_email_str(input_id,'',true);
    }
    else if (type == 'float') {
        error = check_num_str(input_id,'',true);
    }
    else if (type == 'int') {
        error = check_int_str(input_id,'',true);
    }
    if (ret_val) { return error;}
}
//
// this fuction checks if a string is a valid number of any form
function check_num_str(input_id,unhide_id,ret_val) {
    //
    // getting the input string from the element
    var input_str = trim(document.getElementById(input_id).value);
    var error = false;
    //
    if (input_str.match(/^-?\d+$|^-?\d+\.\d+$/)) {
        remove_class('invalid-field',input_id)
        // if an unhide element was provided making it invisible
        if (!!(unhide_id)) {
            add_class('hidden-elm',unhide_id)
        }
    }
    else {
        error = true
        add_class('invalid-field',input_id)
        // if an unhide element was provided making it visible
        if (!!(unhide_id)) {
            remove_class('hidden-elm',unhide_id)
        }
    }
    // if ret_val is true returning the error
    if (ret_val == true) { return error;}
}
//
// this function checks if a text entry has only numbers in it
function check_int_str(input_id,unhide_id,ret_val) {
    //
    // getting the input string from the element
    var input_str = trim(document.getElementById(input_id).value);
    var error = false
    //
    if (input_str.match(/^-?\d+$/)) {
        error = false
        remove_class('invalid-field',input_id)
        // if an unhide element was provided making it invisible
        if (unhide_id) {
            add_class('hidden-elm',unhide_id)
        }
    }
    else {
        error = true
        add_class('invalid-field',input_id)
        // if an unhide element was provided making it visible
        if (unhide_id) {
            remove_class('hidden-elm',unhide_id)
        }
    }
    // if ret_val is true returning the error
    if (ret_val == true) { return error;}
}
//
// checks if a date string is in valid format
// also checks for roughly valid values no month > 12, day > 31 or either equal to 0
function check_date_str(input_id,err_str_id,ret_val) {
    //
    // getting the input string from the element
    var input_str = trim(document.getElementById(input_id).value);
    var error = false;
    //
    if (input_str.match(/^\d\d\d\d-\d\d-\d\d\s+\d\d\:\d\d\:\d\d$/)) {
        input_str = input_str.split(' ')[0];
    }
    //
    if (input_str.match(/^\d\d\d\d-\d\d-\d\d$/)) {
        var input_arr = input_str.split('-');
        var mon = parseInt(input_arr[1]);
        var day = parseInt(input_arr[2])
        if (mon == 0) {input_arr[1] = '01'}
        if (mon > 12) {input_arr[1] = '12'}
        if (day == 0) {input_arr[2] = '01'}
        if (day > 31) {input_arr[2] = '31'}
        //
        remove_class('invalid-field',input_id);
        document.getElementById(input_id).value = input_arr.join('-');
        // if an unhide element was provided making it invisible
        if (!!(err_str_id)) {
            add_class('hidden-elm',err_str_id)
        }
    }
    else {
        error = true
        add_class('invalid-field',input_id)
        // if an unhide element was provided making it visible
        if (!!(err_str_id)) {
            remove_class('hidden-elm',err_str_id)
        }
    }
    // if ret_val is true returning the error
    if (ret_val == true) { return error;}
}
//
// checks if an email appears to have valid formatting text@text.text
function check_email_str(input_id,err_str_id,ret_val) {
    //
    // getting the input string from the element
    var input_str = trim(document.getElementById(input_id).value);
    var error
    var email_pat = new RegExp(".*?@.*?\\..+$");
    var match = email_pat.test(input_str);
    //
    if (match) {
        remove_class('invalid-field',input_id)
        if (err_str_id != '') {add_class('hidden-elm',err_str_id);}
        error = false;
    }
    else {
        add_class('invalid-field',input_id)
        if (err_str_id != '') {remove_class('hidden-elm',err_str_id);}
        error = true;
    }
	//
    if (ret_val == true) {return error;}
}
//
// validates and formats a time entry to hh:mm
function format_time(elm_id,ret_val) {
    var error = false;
    var time_str = document.getElementById(elm_id).value;
    time_str = trim(time_str);
    if (time_str.match(/^\d\d\d\d$/)) {
        time_str = time_str.slice(0,2)+':'+time_str.slice(2,4);
        remove_class('invalid-field',elm_id);
    }
    else if (time_str.match(/^\d\d\:\d\d$/)) {
        remove_class('invalid-field',elm_id);
    }
    else if (time_str.match(/^\d\d\:\d\d\:\d\d$/)) {
        remove_class('invalid-field',elm_id);
    }
    else if (time_str.match(/^\d\:\d\d$/)) {
        time_str = '0'+time_str;
        remove_class('invalid-field',elm_id);
    }
    else {
        add_class('invalid-field',elm_id);
        error = true;
        if (ret_val) {return error;}
        return;
    }
    //
    // checking if hours are less than 23 and minutes less than 60
    var time_arr = time_str.split(':');
    var hh = parseInt(time_arr[0]);
    var mm = parseInt(time_arr[1]);
    if (hh > 23) {hh = 23;}
    if (mm > 59) {mm = 59;}
    if (hh < 10) {hh = '0'+hh;}
    if (mm < 10) {mm = '0'+mm;}
    time_str = hh+":"+mm;
    document.getElementById(elm_id).value = time_str;
}
//
//
function to_and_from_timestamps() {
    var from_ts = '';
    var to_ts = '';
    var today = new Date()
    var ret_obj = {}
    //
    // getting time range data
    if (document.getElementById('time-range').disabled == false) {
        from_ts = document.getElementById('time-range').value.split('|')[0]+' 00:00:00';
        to_ts   = document.getElementById('time-range').value.split('|')[1]+' 23:59:59';
    }
    // using calander inputs instead
    else {
        var st_year = document.getElementById('st-year').value;
        var st_mon = document.getElementById('st-month').value;
        var st_day = document.getElementById('st-day').value;
        var from_ts = st_year+'-'+st_mon+'-'+st_day+' 00:00:00';
        //
        var en_year = document.getElementById('en-year').value;
        var en_mon = document.getElementById('en-month').value;
        var en_day = document.getElementById('en-day').value;
        var to_ts = en_year+'-'+en_mon+'-'+en_day+' 23:59:59';
    }
    //
    ret_obj.from_ts = from_ts
    ret_obj.to_ts = to_ts
    return(ret_obj);
}
//
// this steps through non disabled form elements of each input type skipping buttons
// storing the value and name of element in an object
function get_all_form_values(parent_id,skip_elm_ids) {
    var all_children = document.getElementById(parent_id).getElementsByTagName("*");
    var skip_id_arr = skip_elm_ids.split(',');
    var name_val_obj = {};
    //
    // stepping through children
    for (var i = 0; i < all_children.length; i++) {
        // checking if child node is an element
        if (all_children[i].nodeType != 1) {continue;}
        if ((all_children[i].nodeName.toUpperCase() != 'INPUT') && (all_children[i].nodeName.toUpperCase() != 'SELECT') && (all_children[i].nodeName.toUpperCase() != 'TEXTAREA')) {continue;}
        if (skip_id_arr.indexOf(all_children[i].id) >= 0) {continue;}
        if (all_children[i].disabled == true) {continue;}
        if (all_children[i].name == '') {continue;}
        //
        if ((all_children[i].type.toUpperCase() == 'RADIO') && (!(all_children[i].checked))) {continue;}
        if ((all_children[i].type.toUpperCase() == 'CHECKBOX') && (!(all_children[i].checked))) {continue;}

        //
        name_val_obj[all_children[i].name] = trim(all_children[i].value);
        // removing line breaks because they can break things
        name_val_obj[all_children[i].name] = name_val_obj[all_children[i].name].replace(/\r?\n|\r/g,'; ');
    }
    return name_val_obj;
}
//
/// A more general validate that just checks for empty fields
/// supply the parent id of the form and iterate through children
/// also supply a comma seperated list of IDs that can have empty string values
/// excludes checkboxes and buttons
function basic_validate(parent_id,empty_elms_id) {
    var all_children = document.getElementById(parent_id).getElementsByTagName("*");
    var error = false;
    var empty_id_arr = empty_elms_id.split(',');
    //
    for (var i = 0; i < all_children.length; i++) {
        // checking if child node is an element
        if (all_children[i].nodeType != 1) {continue;}
        if ((all_children[i].nodeName.toUpperCase() != 'INPUT') && (all_children[i].nodeName.toUpperCase() != 'SELECT') && (all_children[i].nodeName.toUpperCase() != 'TEXTAREA')) {continue;}
        if (empty_id_arr.indexOf(all_children[i].id) >= 0) {continue;}
        if (all_children[i].disabled == true) {continue;}
        if (trim(all_children[i].value) == "") {
            add_class('invalid-field',all_children[i].id);
            console.log("Error on element: ",all_children[i].id);
            error = true;
        }
    }
    //
    return error;
}
//
// checks the parent element for any fields with an invalid-field class
function check_for_invalid_fields(form_id) {
    //
    var error = false;
    //
    // stepping through input tags to see if any fields have the invalid class
    var all_inputs = document.getElementById(form_id).getElementsByTagName("*");
    for (var i = 0; i < all_inputs.length; i++) {
        // checking if child node is an element
        if (all_inputs[i].disabled == true) {continue;}
        if (all_inputs[i].className.match('invalid-field')) {
            console.log("Invalid Error: ",all_inputs[i].id);
            error = true;
        }
    }
    //
    return(error);
}
//
//
function validate_login() {
   if (trim(document.login_form.username.value) == "") {
      alert("Username is required.");
      document.login_form.username.focus();
      return(false);
   }
   if (trim(document.login_form.password.value) == "") {
      alert("Password is required.");
      document.login_form.password.focus();
      return(false);
   }
   return(true);
}
//
// validating the add dbuser form
function init_dbuser_form_valiation(update) {
    var arg_object = {}
    arg_object.update = update
    // passing anonymous function to check_unique to finish validation  !!!!!
    var validate_fun = function(unique_id_error) {
        arg_object.unique_id_error = unique_id_error
        validate_dbuser_form(arg_object)
    }
    check_unique('add-new-user','username','dbuser-internal-id','dbUsers',validate_fun);
}
//
// validates the dbuser form
function validate_dbuser_form(arg_object) {
    var error = false;
    //
    // checking if username was unique
    if (arg_object.unique_id_error) {
        remove_class('hidden-elm','username-uni-err');
        error = true;
    }
    else {
        add_class('hidden-elm','username-uni-err')
    }
    //
    // performing basic field validation
    var skip_str = 'dbuser-internal-id'
    if (arg_object.update == true) {
        skip_str += ',password,conf-password'
    }
    var basic_val_error = basic_validate('add-new-user',skip_str)
    if (basic_val_error) {error = true;}
    //
    // checking if permissions string is only numbers
    if (document.getElementById('dbuser-permissons').value != "") {
        var int_str_error = check_int_str('dbuser-permissons','dbuser-permissons-str-err',true);
        if (int_str_error) {error = true;}
    }
    //
    // checking passwords match
    if (document.getElementById('password').value != "") {
        var pass_equal_error = check_equality('password','conf-password','pass-not-equal-err-str',true)
        if (pass_equal_error) {error = true;}
    }
    //
    // checking if email is valid
    if (document.getElementById('email').value != "") {
        var email_str_error = check_email_str('email','email-err-str',true)
        if (email_str_error) {error = true;}
    }
    //
    if (error) {
        remove_class('hidden-elm','form-errors');
    }
    else {
        add_class('hidden-elm','form-errors');
        submit_dbuser_form(arg_object)
    }
}
//
// submitting the dbuser form
function submit_dbuser_form(arg_object) {
    //
    var update = arg_object.update;
    //
    var name_val_obj = {};
    var sql_args = {};
    var sql = "";
    //
    // getting the value of all enabled inputs and applying and type corrections
    name_val_obj = get_all_form_values('add-new-user','');
    //
    //
    // creating sql statment
    if (update) {
        sql_args.cmd = "UPDATE";
        sql_args.where = [['dbuser_internal_id','LIKE',name_val_obj['dbuser_internal_id']]];
        //
        // update employee callback
        var callback = function() {
            var curr_page = document.getElementById('dbuser-table-page-nav').dataset.currPage;
            var sort_col = document.getElementById('dbuser-table-page-nav').dataset.sortCol;
            var sort_dir = document.getElementById('dbuser-table-page-nav').dataset.sortDir;
            mod_dbuser_table(curr_page,sort_col,sort_dir);
            alert('Sucessfully Modifed User: '+name_val_obj.dbuser_first_name+' '+name_val_obj.dbuser_last_name+'.');
            // clearing form off of page
            document.getElementById('mod-dbuser-form-div').removeAll();
            document.getElementById('modify-header').removeAll();
        }
    }
    else {
        sql_args.cmd = "INSERT";
        //
        // add employee callback
        var callback = function() {
            create_form('add_dbuser','add-new-dbuser-form');
            pop_add_dbuser_dropdowns(false);
            alert('Sucessfully Created User: '+name_val_obj.dbuser_first_name+' '+name_val_obj.dbuser_last_name+'.');
        }
    }
    sql_args.table = "dbUsers";
    sql_args.cols = [];
    sql_args.vals = [];
    for (var name in name_val_obj) {
        if (name == 'dbuser_internal_id') {continue;}
        if ((update) && (name == 'password') && (name_val_obj[name] == '')) {continue;}
        sql_args.cols.push(name);
        sql_args.vals.push(name_val_obj[name])
    }
    sql = gen_sql(sql_args);
    //
    // executing async code
    ajax_exec_db(sql,callback)
}
//
// validating the add employee form
function init_employee_form_valiation(action) {
    // checking if strig is only numbers
    if (document.getElementById('emp-id').value != '') {
        var int_str_err = check_int_str('emp-id','emp-id-str-err',true);
        if (int_str_err) {return;}
        // checking if ID is unique and then performing additional validation
        var arg_object = {}
        arg_object.action = action
        // passing anonymous function to check_unique to finish validation
        var validate_fun = function(unique_id_error) {
            arg_object.unique_id_error = unique_id_error
            validate_employee_form(arg_object)
        }
        check_unique('add_employee','emp-id','emp-internal-id','employee_info',validate_fun);
    }
    else {
        basic_validate('add_employee','pay_rate,comments,base-rate-select,case-rate-select,stop-rate-select,base-rate-input,case-rate-input,stop-rate-input,base-rate-level,case-rate-level,stop-rate-level,emp-internal-id');
    }
}
// callback function used in check unique to complete form validation
// and submit the form if valid
function validate_employee_form(arg_object) {
    //
    var error = false;
    var basic_val_error = false;
    var emp_id_str_err = false;
    var unique_id_error = arg_object.unique_id_error;
    //
    // performing basic empty value validation for all input and select elements
    if (document.getElementById('department-select').value == 'transportation') {
        basic_val_error = basic_validate('add_employee','pay_rate,comments,emp-internal-id,base-rate-level,case-rate-level,stop-rate-level');
    }
    else {
        basic_val_error = basic_validate('add_employee','pay_rate,comments,base-rate-select,case-rate-select,stop-rate-select,base-rate-input,case-rate-input,stop-rate-input,base-rate-level,case-rate-level,stop-rate-level,emp-internal-id');
    }
    //
    if (basic_val_error) {
        error = true;
    }
    if (unique_id_error) {
        alert("The supplied Employee ID: "+document.getElementById('emp-id').value+" is already in use.");
        add_class('invalid-field','emp-id')
        remove_class('hidden-elm','emp-id-uni-err')
        error = true;
    }
    else {
        remove_class('invalid-field','emp-id')
        add_class('hidden-elm','emp-id-uni-err')
    }
    //
    //
    if (error) {
        remove_class('hidden-elm','form-errors');
    }
    else {
        add_class('hidden-elm','form-errors');
        submit_employee_form(arg_object)
    }

}
//
// submit add_employee form
function submit_employee_form(arg_object) {
    //
    var action = arg_object.action;
    //
    var name_val_obj = {};
    var sql_args = {};
    var sql = "";
    //
    // disabling elements to simplfy retrival proper values from form
    if (document.getElementById('department-input').disabled == false) {
        document.getElementById('department-select').disabled = true;
    }
    if (document.getElementById('base-rate-input').disabled == false) {
        document.getElementById('base-rate-select').disabled = true;
    }
    if (document.getElementById('case-rate-input').disabled == false) {
        document.getElementById('case-rate-select').disabled = true;
    }
    if (document.getElementById('stop-rate-input').disabled == false) {
        document.getElementById('stop-rate-select').disabled = true;
    }
    //
    // getting the value of all enabled inputs and applying type corrections
    name_val_obj = get_all_form_values('add_employee','');
    if (name_val_obj.base_rate == "") {
        name_val_obj.base_rate = 0.0;
    }
    if (name_val_obj.case_rate == "") {
        name_val_obj.case_rate = 0.0
    }
    if (name_val_obj.stop_rate == "") {
        name_val_obj.stop_rate = 0.0
    }
    if (name_val_obj.pay_rate == "") {
        name_val_obj.pay_rate = 0.0
    }
    //
    // re-enabling elements after retrevial of form values
    document.getElementById('department-select').disabled = false;
    document.getElementById('base-rate-select').disabled = false;
    document.getElementById('case-rate-select').disabled = false;
    document.getElementById('stop-rate-select').disabled = false;
    //
    // defining messages based on action type
    var message = '';
    if (action == 'create') {
        var cont =  confirm('Confirm creation of Employee: '+name_val_obj.emp_first_name+' '+name_val_obj.emp_last_name);
        if (!(cont)) {return;}
        message = 'Sucessfully Created Employee: '+document.getElementById('emp-id').value+' - '+name_val_obj.emp_first_name+' '+name_val_obj.emp_last_name+'.';
    }
    else if (action == 'update') {
        message = 'Sucessfully Modifed Employee: '+document.getElementById('emp-id').value+' - '+name_val_obj.emp_first_name+' '+name_val_obj.emp_last_name+'.';
    }
    else if (action == 'delete') {
        message = 'Sucessfully Deleted Employee: '+document.getElementById('emp-id').value+' - '+name_val_obj.emp_first_name+' '+name_val_obj.emp_last_name+'.';
    }
    else if (action == 'reinstate') {
        message = 'Sucessfully Reinstated Employee: '+document.getElementById('emp-id').value+' - '+name_val_obj.emp_first_name+' '+name_val_obj.emp_last_name+'.';
    }
    //
    // creating sql statment
    if (action != 'create') {
        sql_args.cmd = "UPDATE";
        sql_args.where = [['emp_internal_id','LIKE',name_val_obj['emp_internal_id']]];
        //
        // update employee callback
        var callback = function() {
            var curr_page = document.getElementById('emp-table-page-nav').dataset.currPage;
            var sort_col = document.getElementById('emp-table-page-nav').dataset.sortCol;
            var sort_dir = document.getElementById('emp-table-page-nav').dataset.sortDir;
            alert(message);
            mod_emp_table(curr_page,sort_col,sort_dir);
            // clearing form off of page
            document.getElementById('mod-employee-form').removeAll();
            document.getElementById('modify-header').removeAll();
        }
    }
    else {
        sql_args.cmd = "INSERT";
        //
        // add employee callback
        var callback = function() {
            create_form('add_employee','add-new-employee-form');
            pop_add_emp_dropdowns(false);
            alert(message);
        }
    }
    sql_args.table = "employee_info";
    sql_args.cols = [];
    sql_args.vals = [];
    for (name in name_val_obj) {
        if (name == 'emp_internal_id') {continue;}
        sql_args.cols.push(name);
        sql_args.vals.push(name_val_obj[name])
    }
    sql = gen_sql(sql_args);
    //
    // executing async code
    ajax_exec_db(sql,callback)
}
//
// this recalculates all of the fields on the general form
function recalc_general_form(truncate) {
    //
    var sql_args = {};
    var data_sql = '';
    var precision = 9;
    if (truncate) { precision = CONSTANTS.STD_PRECISION;}
    //
    // performing validation steps
    remove_class_all('invalid-field');
    check_date_str('date','',false);
    //
    // getting form values to calculate pay and production rates
    var hours = +document.getElementById('hours').value;
    if (hours != hours) {hours = 0.0;}
    var pay_rate = +document.getElementById('hourly-pay-rate').value;
    if (pay_rate != pay_rate) {pay_rate = 0.0; add_class('invalid-field','hourly-pay-rate');}
    var add_pay = +document.getElementById('add-pay').value;
    if (add_pay != add_pay) {add_pay = 0.0; add_class('invalid-field','add-pay');}
    var deduc_pay = +document.getElementById('deduc-pay').value;
    if (deduc_pay != deduc_pay) {deduc_pay = 0.0; add_class('invalid-field','deduc-pay');}
    //
    var tot_pay = 0.0;
    deduc_pay = deduc_pay * -1;
    tot_pay = (add_pay + deduc_pay);
    //
    document.getElementById('hours').value = round(document.getElementById('hours').value,precision).toFixed(precision);
    document.getElementById('hourly-pay-rate').value = round(document.getElementById('hourly-pay-rate').value,precision).toFixed(precision);
    document.getElementById('add-pay').value = round(document.getElementById('add-pay').value,precision).toFixed(precision);
    document.getElementById('deduc-pay').value = round(document.getElementById('deduc-pay').value,precision).toFixed(precision);
    document.getElementById('total-pay').value = tot_pay;
    //
    var date_arr = document.getElementById('date').value.split('-');
    var curr_date = new Date(date_arr[0],date_arr[1]-1,date_arr[2]);
    var wk_start = new Date(curr_date.getFullYear(),curr_date.getMonth(),(curr_date.getDate()-curr_date.getDay()))
    var from_ts = wk_start.getFullYear()+'-'+(wk_start.getMonth()+1)+'-'+wk_start.getDate();
    var to_ts = curr_date.getFullYear()+'-'+(curr_date.getMonth()+1)+'-'+(curr_date.getDate()-1); // excluding the entry date
    //
    sql_args.cmd = 'SELECT';
    sql_args.table = 'employee_data';
    sql_args.cols = ['emp_id','date','hours'];
    sql_args.where = [['emp_id','LIKE',document.getElementById('emp-id').value],['date','BETWEEN',from_ts+"' AND '"+to_ts],['entry_status','LIKE','submitted']];
    data_sql = gen_sql(sql_args);
    //
    // defining the callback to calculate OT
    var callback = function(response) {
        response.wk_data.tot_pay = tot_pay;
        calc_overtime(hours,pay_rate,response.wk_data);
        document.getElementById('total-pay').value = round(response.wk_data.tot_pay,precision).toFixed(precision);
    }
    //
    ajax_fetch([data_sql],['wk_data'],callback);
}
//
// this recalculates all of the fields on the receving form
function recalc_receving_form(truncate) {
    //
    var sql_args = {};
    var data_sql = '';
    var precision = 9;
    if (truncate) {precision = CONSTANTS.STD_PRECISION}
    //
    // performing validation steps
    remove_class_all('invalid-field');
    check_date_str('date','',false);
    //
    // doing initial calculations
    total_fields('letdowns-moves,putaways-moves,restocks-moves,receiving-moves,counts-moves','total-moves');
    total_fields('letdowns-units,putaways-units,restocks-units,receiving-units,counts-units','total-units');
    //
    // getting form values to calculate pay and production rates
    var hours = +document.getElementById('hours').value;
    if (hours != hours) {hours = 0.0;}
    var indirect = +document.getElementById('indirect').value;
    if (indirect != indirect) {indirect = 0.0; add_class('invalid-field','indirect');}
    var total_moves = +document.getElementById('total-moves').value;
    if (total_moves != total_moves) {total_moves = 0.0;}
    var total_units = +document.getElementById('total-units').value;
    if (total_units != total_units) {total_units = 0.0;}
    var pay_rate = +document.getElementById('hourly-pay-rate').value;
    if (pay_rate != pay_rate) {pay_rate = 0.0; add_class('invalid-field','hourly-pay-rate');}
    var add_pay = +document.getElementById('add-pay').value;
    if (add_pay != add_pay) {add_pay = 0.0; add_class('invalid-field','add-pay');}
    var deduc_pay = +document.getElementById('deduc-pay').value;
    if (deduc_pay != deduc_pay) {deduc_pay = 0.0; add_class('invalid-field','deduc-pay');}
    //
    var tot_pay = 0.0;
    deduc_pay = deduc_pay * -1;
    //
    // doing production and pay
    var prod_time = hours - indirect/60;
    var moves_hr = total_moves/prod_time;
    if (moves_hr != moves_hr) {moves_hr = 0.0;}
    var units_hr = total_units/prod_time;
    if (units_hr != units_hr) {units_hr = 0.0;}
    var tot_pay = (add_pay + deduc_pay);
    //
    document.getElementById('indirect').value = round(document.getElementById('indirect').value,precision).toFixed(precision);
    document.getElementById('hours').value = round(document.getElementById('hours').value,precision).toFixed(precision);
    document.getElementById('hourly-pay-rate').value = round(document.getElementById('hourly-pay-rate').value,precision).toFixed(precision);
    document.getElementById('add-pay').value = round(document.getElementById('add-pay').value,precision).toFixed(precision);
    document.getElementById('deduc-pay').value = round(document.getElementById('deduc-pay').value,precision).toFixed(precision);
    document.getElementById('prod-time').value = round(prod_time,precision).toFixed(precision);
    document.getElementById('moves-hour').value = round(moves_hr,precision).toFixed(precision);
    document.getElementById('units-hour').value = round(units_hr,precision).toFixed(precision);
    document.getElementById('total-pay').value = tot_pay;
    //
    var date_arr = document.getElementById('date').value.split('-');
    var curr_date = new Date(date_arr[0],date_arr[1]-1,date_arr[2]);
    var wk_start = new Date(curr_date.getFullYear(),curr_date.getMonth(),(curr_date.getDate()-curr_date.getDay()))
    var from_ts = wk_start.getFullYear()+'-'+(wk_start.getMonth()+1)+'-'+wk_start.getDate();
    var to_ts = curr_date.getFullYear()+'-'+(curr_date.getMonth()+1)+'-'+(curr_date.getDate()-1); // excluding the entry date
    //
    sql_args.cmd = 'SELECT';
    sql_args.table = 'employee_data';
    sql_args.cols = ['emp_id','date','hours'];
    sql_args.where = [['emp_id','LIKE',document.getElementById('emp-id').value],['date','BETWEEN',from_ts+"' AND '"+to_ts],['entry_status','LIKE','submitted']];
    data_sql = gen_sql(sql_args);
    //
    // defining the callback to calculate OT
    var callback = function(response) {
        response.wk_data.tot_pay = tot_pay
        calc_overtime(hours,pay_rate,response.wk_data);
        document.getElementById('total-pay').value = round(response.wk_data.tot_pay,precision).toFixed(precision);
    }
    //
    ajax_fetch([data_sql],['wk_data'],callback)
}
//
// performs some validation and calculates the employee's pay
// calculates the transport employee's pay
function recalc_transportation_form(truncate) {
    //
    // setting inital values
    var error = false;
    var hourly_pay = 0.0;
    var incentive_pay = 0.0;
    var reimbursement = 0.0;
    var tot_pay = 0.0;
    var pre = 0.0;
    var post = 0.0;
    var precision = 9;
    if (truncate) {precision = CONSTANTS.STD_PRECISION}
    var inputs = {
        'base_rate' : {'id' : 'base-rate', 'value' : '', 'type' : 'float'},
        'case_rate' : {'id' : 'case-rate', 'value' : '', 'type' : 'float'},
        'stop_rate' : {'id' : 'stop-rate', 'value' : '', 'type' : 'float'},
        'date'  : {'id' : 'date', 'value' : '', 'type' : 'date'},
        'hours' : {'id' : 'hours', 'value' : '', 'type' : 'float'},
        'num_backhauls' : {'id' : 'num-backhauls', 'value' : '', 'type' : 'int'},
        'num_cases'   : {'id' : 'num-cases', 'value' : '', 'type' : 'int'},
        'num_miles'   : {'id' : 'num-miles', 'value' : '', 'type' : 'float'},
        'num_routes'  : {'id' : 'num-routes', 'value' : '', 'type' : 'int'},
        'num_stops'   : {'id' : 'num-stops', 'value' : '', 'type' : 'int'},
        'truck_fuel'  : {'id' : 'truck-fuel', 'value' : '', 'type' : 'float'},
        'reefer_fuel' : {'id' : 'reefer-fuel', 'value' : '', 'type' : 'float'},
        'cost_per_gallon' : {'id' : 'cost-per-gallon', 'value' : '', 'type' : 'float'},
        'fuel_def' : {'id' : 'fuel-def', 'value' : '', 'type' : 'float'},
        'def_cost_per_gallon' : {'id' : 'def-cost-per-gallon', 'value' : '', 'type' : 'float'},
        'over_night' : {'id' : 'over-night', 'value' : '', 'type' : 'int'},
        'per_diem'   : {'id' : 'per-diem', 'value' : '', 'type' : 'float'},
        'hotel_amount' : {'id' : 'hotel-amount', 'value' : '', 'type' : 'float'},
        'toll_amount'  : {'id' : 'toll-amount', 'value' : '', 'type' : 'float'},
        'hourly_pay_rate' : {'id' : 'hourly-pay-rate', 'value' : '', 'type' : 'float'},
        'add_pay'   : {'id' : 'add-pay', 'value' : '', 'type' : 'float'},
        'deduc_pay' : {'id' : 'deduc-pay', 'value' : '', 'type' : 'float'}
    }
    //
    // handling component pay checkboxes
    if (document.getElementById('rem-case-pay').checked) {document.getElementById('case-rate').value = '0.00';}
    if (document.getElementById('rem-route-pay').checked) {document.getElementById('base-rate').value = '0.00';}
    if (document.getElementById('rem-stop-pay').checked) {document.getElementById('stop-rate').value = '0.00';}
    if (document.getElementById('pre-inspection').checked) {pre = 3.50;}
    if (document.getElementById('post-inspection').checked) {post = 3.50;}
    //
    // performing form validation and getting values
    remove_class_all('invalid-field');
    for (var name in inputs) {
        error = check_data_type(inputs[name]['id'],inputs[name]['type'],true);
        if ((error) && (inputs[name]['type'].match(/float|int/))) {inputs[name]['value'] = 0; continue;}
        if (inputs[name]['type'].match(/float/)) {
            inputs[name]['value'] = Number(document.getElementById(inputs[name]['id']).value);
            if (inputs[name]['value'] === '') { continue;}
            document.getElementById(inputs[name]['id']).value = round(inputs[name]['value'],precision).toFixed(precision);
        }
        else if (inputs[name]['type'].match(/int/)) {
            inputs[name]['value'] = Number(document.getElementById(inputs[name]['id']).value);
            if (inputs[name]['value'] === '') { continue;}
            document.getElementById(inputs[name]['id']).value = round(inputs[name]['value'],0).toFixed(0);
        }
    }
    //
    if (inputs['over_night']['value'] == 1) { document.getElementById('per-diem').disabled = false;}
    else { document.getElementById('per-diem').disabled = true;}
    //
    // handling hourly pay only checkbox
    if (document.getElementById('hourly-pay-only').checked) {
        //
        inputs['num_cases']['value']  = 0.0;
        inputs['num_routes']['value'] = 0.0;
        inputs['num_stops']['value']  = 0.0;
        inputs['num_backhauls']['value'] = 0.0;
        pre  = 0.0;
        post = 0.0;
        document.getElementById('num-cases').disabled  = true;
        document.getElementById('num-routes').disabled = true;
        document.getElementById('num-stops').disabled  = true;
        remove_class('invalid-field','num-cases');
        remove_class('invalid-field','num-routes');
        remove_class('invalid-field','num-stops');
    }
    else {
        inputs['hourly_pay_rate']['value'] = 0.0;
        document.getElementById('num-cases').disabled  = false;
        document.getElementById('num-routes').disabled = false;
        document.getElementById('num-stops').disabled  = false;
        remove_class('invalid-field','hourly-pay-rate');
    }
    //
    // adjusting values if overnight
    if (inputs['over_night']['value'] == 1) {
        incentive_pay = inputs['per_diem']['value'];
        inputs['base_rate']['value'] = 2 * inputs['base_rate']['value'];
        pre = 2 * pre;
        post = 2 * post;
    }
    //
    // calculating pay values
    incentive_pay += (10.0 * inputs['num_backhauls']['value']);
    incentive_pay += (inputs['base_rate']['value'] * inputs['num_routes']['value']);
    incentive_pay += (inputs['case_rate']['value'] * inputs['num_cases']['value']);
    incentive_pay += (inputs['stop_rate']['value'] * inputs['num_stops']['value']) + pre + post;
    hourly_pay    +=  inputs['hourly_pay_rate']['value'] * inputs['hours']['value'];
    reimbursement +=  inputs['hotel_amount']['value'];
    reimbursement +=  inputs['toll_amount']['value'];
    reimbursement += (inputs['truck_fuel']['value'] * inputs['cost_per_gallon']['value']);
    reimbursement += (inputs['reefer_fuel']['value'] * inputs['cost_per_gallon']['value']);
    reimbursement += (inputs['fuel_def']['value'] * inputs['def_cost_per_gallon']['value']);
    inputs['deduc_pay']['value'] = inputs['deduc_pay']['value'] * -1;
    //
    // outputting values
    tot_pay += hourly_pay + incentive_pay + inputs['add_pay']['value'] + inputs['deduc_pay']['value'];
    document.getElementById('pre-inspection').value = pre;
    document.getElementById('post-inspection').value = post;
    document.getElementById('incentive-pay').value = round(incentive_pay,2).toFixed(2);
    document.getElementById('hourly-pay').value = round(hourly_pay,2).toFixed(2);
    document.getElementById('reimbursement').value = round(reimbursement,2).toFixed(2);
    document.getElementById('total-pay').value = round(tot_pay,precision).toFixed(precision);
}
//
// this handles all the the validation and calculations for the warehouse form
function recalc_warehouse_form(truncate) {
    //
    var sql_args = {};
    var data_sql = '';
    var sel_sql = '';
    var callback = false;
    var precision = 9;
    if (truncate) {precision = CONSTANTS.STD_PRECISION}
    //
    show_if_val('attendance-select','attendance-input','other');
    show_if_val('error-code','other-error-code-msg','99');
    remove_class_all('invalid-field');
    check_date_str('date','',false);
    check_num_str('num-cases','',false)
    //
    // getting form values to calculate production rates and pay
    var num_cases = +document.getElementById('num-cases').value;
    if (num_cases != num_cases) {num_cases = 0; add_class('invalid-field','num-cases');}
    var indirect = +document.getElementById('indirect').value;
    if (indirect != indirect) {indirect = 0.0; add_class('invalid-field','indirect');}
    var hours = +document.getElementById('hours').value;
    var pay_rate = +document.getElementById('hourly-pay-rate').value;
    if (pay_rate != pay_rate) {pay_rate = 0.0; add_class('invalid-field','hourly-pay-rate');}
    var add_pay = +document.getElementById('add-pay').value;
    if (add_pay != add_pay) {add_pay = 0.0; add_class('invalid-field','add-pay');}
    var deduc_pay = +document.getElementById('deduc-pay').value * -1;
    if (deduc_pay != deduc_pay) {deduc_pay = 0.0; add_class('invalid-field','deduc-pay');}
    //
    var tot_pay = 0.0;
    var prod_time = (hours - indirect/60);
    var cases_hr = num_cases/prod_time;
    //
    tot_pay = add_pay + deduc_pay
    //
    document.getElementById('indirect').value = round(document.getElementById('indirect').value,precision).toFixed(precision);
    document.getElementById('hours').value = round(document.getElementById('hours').value,2).toFixed(2);
    document.getElementById('hourly-pay-rate').value = round(document.getElementById('hourly-pay-rate').value,precision).toFixed(precision);
    document.getElementById('add-pay').value = round(document.getElementById('add-pay').value,precision).toFixed(precision);
    document.getElementById('deduc-pay').value = round(document.getElementById('deduc-pay').value,precision).toFixed(precision);
    document.getElementById('cases-hr').value = ceiling(cases_hr,0).toFixed(0);
    document.getElementById('prod-time').value = round(prod_time,precision).toFixed(precision);
    document.getElementById('total-pay').value = tot_pay; // not here to rounding to prevent loss of sig figs
    //
    // checking records for overtime and calculating selection rate
    var date_arr = document.getElementById('date').value.split('-');
    var curr_date = new Date(date_arr[0],date_arr[1]-1,date_arr[2]);
    var wk_start = new Date(curr_date.getFullYear(),curr_date.getMonth(),(curr_date.getDate()-curr_date.getDay()))
    var from_ts = wk_start.getFullYear()+'-'+(wk_start.getMonth()+1)+'-'+wk_start.getDate();
    var to_ts = curr_date.getFullYear()+'-'+(curr_date.getMonth()+1)+'-'+(curr_date.getDate()-1);
    //
    sql_args.cmd = 'SELECT';
    sql_args.table = 'employee_data';
    sql_args.cols = ['emp_id','date','hours'];
    sql_args.where = [['emp_id','LIKE',document.getElementById('emp-id').value],['date','BETWEEN',from_ts+"' AND '"+to_ts],['entry_status','LIKE','submitted']];
    data_sql = gen_sql(sql_args);
    //
    sql_args.cmd = 'SELECT';
    sql_args.cols = '';
    sql_args.table = 'selection_rates';
    sql_args.where = [['area','LIKE',document.getElementById('area').value]]
    sel_sql = gen_sql(sql_args);
    //
    // defining the callback to calculate OT and case pay
    callback = function(response) {
        response.wk_data.tot_pay = tot_pay
        response.sel_data.precision = precision;
        calc_overtime(hours,pay_rate,response.wk_data);
        response.sel_data.tot_pay = response.wk_data.tot_pay;
        calc_sel_rate(response.sel_data);
    }
    //
    ajax_fetch([data_sql,sel_sql],['wk_data','sel_data'],callback)
}
//
// calculates overtime pay
function calc_overtime(hours,pay_rate,wk_data) {
    var tot_hours = 0.0
    var paid_hours = round(hours,2);
    var hourly_amt = 0.0;
    var attendance = document.getElementById('attendance-select').value;
    //
    for (var i = 0; i < wk_data.length; i++) {
        console.log(wk_data[i].date,wk_data[i].hours)
        tot_hours += parseFloat(wk_data[i].hours);
    }
    //
    if (tot_hours >= 40) {
        hourly_amt =  1.5 * pay_rate * paid_hours
    }
    else if ((tot_hours + paid_hours) > 40) {
        hourly_amt = pay_rate * (40 - tot_hours);
        hourly_amt += 1.5 * pay_rate * (tot_hours + paid_hours - 40);
    }
    else {
        hourly_amt =  pay_rate * paid_hours
    }
    if (attendance == 'holiday') { hourly_amt =  pay_rate * paid_hours;}
    wk_data.tot_pay += hourly_amt
    document.getElementById('hourly-pay').value = round(hourly_amt,2).toFixed(2);
    document.getElementById('total-pay').value = wk_data.tot_pay + hourly_amt;
}
//
// validates and calculates a selection rate for warehouse data
function calc_sel_rate(sel_data) {
    var tot_pay = sel_data.tot_pay;
    var err = document.getElementById('error-code').value;
    var cases_hr = +document.getElementById('cases-hr').value;
    var precision = sel_data.precision;
    if (cases_hr != cases_hr) {add_class('invalid-field','cases-hr'); return;}
    //
    // calculating case pay
    if ((document.getElementById('rem-case-pay').checked) || (err != '0')) {
        document.getElementById('sel-rate').value = '0.00';
        document.getElementById('total-pay').value = round(tot_pay,precision).toFixed(precision);
    }
    else if (document.getElementById('edit-sel-rate').checked) {
        //
        var sel_rate = document.getElementById('sel-rate').value;
        var cases = parseFloat(document.getElementById('num-cases').value);
        var case_pay = cases*parseFloat(sel_rate);
        //
        if (isNaN(case_pay)) {case_pay = 0.00;}
        document.getElementById('total-pay').value = round((tot_pay+case_pay),precision).toFixed(precision);
    }
    else {
        var sel_rate = '0.00';
        // sorting array
        sel_data.sort(function(a, b) {return parseInt(b.min_cases_hr) - parseInt(a.min_cases_hr);});
        //
        // determining selection rate
        cases_hr = ceiling(cases_hr,0)//rounding cases_hr
        for (var i = 0; i < sel_data.length; i++) {
            var min_cases_hr = +sel_data[i].min_cases_hr
            min_cases_hr = floor(min_cases_hr,0) //rounding min_cases_hr
            if (cases_hr >= min_cases_hr) {sel_rate = sel_data[i].sel_rate; break;}
        }
        //
        document.getElementById('sel-rate').value = sel_rate;
        var cases = parseFloat(document.getElementById('num-cases').value);
        var case_pay = cases*parseFloat(sel_rate);
        //
        if (isNaN(case_pay)) {case_pay = 0.0;}
        document.getElementById('incentive-pay').value = round(case_pay,2).toFixed(2);
        document.getElementById('total-pay').value = round((tot_pay+case_pay),precision).toFixed(precision);
    }
}
//
// this function disables all but the few key elements on the form
function disable_all_data_entry(disable) {
    var skip_arr = ['emp-id','emp-first-name','emp-last-name','department','date','edit-date','attendance-select','comments','entering-user','entry-status'];
    var all_children = document.getElementById('input-emp-data').getElementsByTagName("*");
    //
    for (var i = 0; i < all_children.length; i++) {
        // checking if child node is an element
        if (all_children[i].nodeType != 1) {continue;}
        if ((all_children[i].nodeName.toUpperCase() != 'INPUT') && (all_children[i].nodeName.toUpperCase() != 'SELECT') && (all_children[i].nodeName.toUpperCase() != 'TEXTAREA')) {continue;}
        if (skip_arr.indexOf(all_children[i].id) >= 0) {continue;}
        all_children[i].disabled = disable;
    }
}
//
// this function will validate one of the data entry forms
function init_data_form_validation(department,action) {
    //
    var error = false;
    var time_error = false;
    var basic_val_error = false;
    var skip_str = 'entry-id,admin-fix,admin-fix-timestamp';
    var attendance = document.getElementById('attendance-select').value;
    //
    // calculating unrounded values for data entry forms
    if (department == 'general') {
        recalc_general_form(false);
        department = document.getElementById('department').value;
    }
    else if (department == 'transportation') {
        recalc_transportation_form(false);
    }
    else if (department == 'warehouse_receiving') {
        recalc_receving_form(false);
    }
    else if (department == 'warehouse_shipping') {
        recalc_warehouse_form(false);
    }
    //
    // checking if there is an error_code/ attendance_error and requring comments
    if ((document.getElementById('attendance-select').value == 'none') && (document.getElementById('error-code').value == '0')) {
        skip_str += ',comments'
        remove_class('invalid-field','comments');
    }
    //
    // handling special attendance values
    if ((attendance == 'absent') || (attendance == 'vacation') || (attendance == 'sick')) {
        remove_class_all('invalid-field');
        if (document.getElementById('comments').value == '') {
            add_class('invalid-field','comments');
            error = true;
        }
    }
    else {
        basic_val_error = basic_validate('input-emp-data',skip_str);
        if (basic_val_error) {error = true;}
        //
        // stepping through input tags to see if any fields have the invalid class
        var all_inputs = document.getElementById('input-emp-data').getElementsByTagName("*");
        for (var i = 0; i < all_inputs.length; i++) {
            // checking if child node is an element
            if (all_inputs[i].disabled == true) {continue;}
            if (all_inputs[i].className.match('invalid-field')) {
                console.log("Invalid Error: ",all_inputs[i].id);
                error = true;
            }
        }
    }
    //
    // determining department and creating meta_sql statment
    if (CONSTANTS.DEPT_TABLES.hasOwnProperty(department)) { var dept_table = CONSTANTS.DEPT_TABLES[department];}
    else { console.log(' Department has no set table: '+department); return;}
    if (CONSTANTS.DEPT_FORMS.hasOwnProperty(department)) { var data_form = CONSTANTS.DEPT_FORMS[department];}
    else { console.log(' Department has no set form: '+department); return;}
    //
    var sql_args = {};
    sql_args.cmd = 'SELECT';
    sql_args.table = 'table_meta_data';
    sql_args.where = [['in_tables','REGEXP','(^|%)employee_data(%|$)|(^|%)'+dept_table+'(%|$)']]
    var meta_sql = gen_sql(sql_args);
    //
    // creating submission callback
    var submit_args = {
        dept_table : dept_table,
        data_form : data_form,
        action : action
    };
    //
    var submit_callback = function(response) {
        add_class('hidden-elm','form-errors');
        submit_args.meta_data = response.meta_data;
        submit_data_entry_fom(submit_args);
    }
    //
    if (error) {
        remove_class('hidden-elm','form-errors');
    }
    else {
        var sql_arr = [meta_sql];
        var name_arr = ['meta_data'];
        ajax_fetch(sql_arr,name_arr,submit_callback)
    }
}
//
// this submits the data entry form
function submit_data_entry_fom(submit_args) {
    //
    var dept_table = submit_args.dept_table;
    var data_form = submit_args.data_form;
    var action = submit_args.action;
    var meta_data = submit_args.meta_data;
    var col_meta_data = {};
    var table = '';
    var data_form = '';
    var attendance = document.getElementById('attendance-select').value;
    var main_sql_args = {};
    var dept_sql_args = {};
    //
    // converting meta_data array to be an object indexed by column_name
    // and reducing in_tables to only be employee_data or the department specific table
    for (var i = 0; i < meta_data.length; i++) {
        if (meta_data[i].in_tables.match(/(^|%)employee_data(%|$)/)) {meta_data[i].in_tables = 'employee_data';}
        else if (meta_data[i].in_tables.match('(^|%)'+submit_args.dept_table+'(%|$)')) {meta_data[i].in_tables = submit_args.dept_table;}
        col_meta_data[meta_data[i].column_name] = meta_data[i];
    }
    //
    // preventing the submit box from firing twice on restoration of entry
    if (!!(action != 'create')) {
        var cont = true;
    }
    else {
        var cont = confirm('Are you sure you want to submit this form?');
    }
    if (!cont) {return;}
    //
    // making sure base_rate,case_rate and stop_rate are undisabled so they can update properly
    if (!!(document.getElementById('base-rate'))) { document.getElementById('base-rate').disabled = false;}
    if (!!(document.getElementById('case-rate'))) { document.getElementById('case-rate').disabled = false;}
    if (!!(document.getElementById('stop-rate'))) { document.getElementById('stop-rate').disabled = false;}
    //
    // handling attendance
    if ((attendance == 'absent') || (attendance == 'vacation')  || (attendance == 'sick')) {
        disable_all_data_entry(true)
    }
    //
    document.getElementById('entry-id').disabled = false;
    var name_val_obj = get_all_form_values('input-emp-data','');
    //
    // defining messages for specfic actions
    var message = '';
    if (action == 'create') {
        message = 'Sucessfully Created Record for: '+name_val_obj.emp_first_name+" "+name_val_obj.emp_last_name+'.';
    }
    else if (action == 'update') {
        message = 'Sucessfully Modifed Entry: '+document.getElementById('entry-id').value+', For Employee: '+name_val_obj.emp_first_name+' '+name_val_obj.emp_last_name+'.';
    }
    else if (action == 'restore') {
        message = 'Sucessfully Restored Entry: '+document.getElementById('entry-id').value+', For Employee: '+name_val_obj.emp_first_name+' '+name_val_obj.emp_last_name+'.';
    }
    else if (action == 'delete') {
        message = 'Sucessfully Deleted Entry: '+document.getElementById('entry-id').value+', For Employee: '+name_val_obj.emp_first_name+' '+name_val_obj.emp_last_name+'.';
    }
    //
    // update employee data callback
    var update_callback = function() {
        var curr_page = document.getElementById('employee-data-table-page-nav').dataset.currPage;
        var sort_col = document.getElementById('employee-data-table-page-nav').dataset.sortCol;
        var sort_dir = document.getElementById('employee-data-table-page-nav').dataset.sortDir;
        var emp_id = '.'
        if (!!document.getElementById('employee-data-table')) {
            if (!!(document.getElementById('employee-data-table').dataset.empId)) {
                emp_id = document.getElementById('employee-data-table').dataset.empId;
            }
        }
        if (!(document.getElementById('input-emp-data').dataset.restore)) {
            alert(message);
        }
        mod_emp_data_table(curr_page,sort_col,sort_dir,emp_id);
        // clearing form off of page
        document.getElementById('update-entry-form-div').removeAll();
        document.getElementById('modify-header').removeAll();
    }
    //
    // insert callback
    var insert_callback = function() {
        document.getElementById('data-entry-form-div').removeAll();
        alert(message);
    }
    //
    // defining sql command and where clause if needed
    var callback = '';
    if (action != 'create') {
        callback = update_callback
        name_val_obj.admin_fix += document.getElementById('user-username').value+';';
        name_val_obj.admin_fix_timestamp += get_current_timestamp()+';';
        delete name_val_obj.entering_user;
        main_sql_args.cmd = "UPDATE";
        main_sql_args.where = [['entry_id','LIKE',name_val_obj['entry_id']]];
        dept_sql_args.cmd = "UPDATE";
        dept_sql_args.where = [['entry_id','LIKE',name_val_obj['entry_id']]];
        delete name_val_obj.entry_id;
    }
    else {
        callback = insert_callback;
        main_sql_args.cmd = "INSERT";
        dept_sql_args.cmd = "INSERT";
        delete name_val_obj.entry_id;
    }
    //
    // constructing SQL statements
    main_sql_args.table = 'employee_data';
    main_sql_args.cols = [];
    main_sql_args.vals = [];
    dept_sql_args.table = dept_table;
    dept_sql_args.cols = [];
    dept_sql_args.vals = [];
    for (name in name_val_obj) {
        if (col_meta_data[name].in_tables.match(/(^|%)employee_data(%|$)/)) {
            main_sql_args.cols.push(name);
            main_sql_args.vals.push(name_val_obj[name]);
        }
        else {
            dept_sql_args.cols.push(name);
            dept_sql_args.vals.push(name_val_obj[name]);
        }
    }
    //
    // adding this if it is a new entry
    if (action == 'create') {
        dept_sql_args.cols.push('entry_id');
        dept_sql_args.vals.push('LAST_INSERT_ID()');
    }
    var main_sql = gen_sql(main_sql_args);
    var dept_sql = gen_sql(dept_sql_args);
    if (dept_table == 'none') { dept_sql = false;}
    var sql_arr = []
    if (!!(main_sql)) sql_arr.push(main_sql);
    if (!!(dept_sql)) sql_arr.push(dept_sql);
    //
    // executing async code
    exec_transaction(sql_arr,callback);
}
//
// this validates the backhaul form and calculates fields
function recalc_backhaul_form(truncate) {
    //
    // variable intitalization
    var maxNumFields  = parseInt(document.getElementById('number-of-fields').value) + 1;
    var freightCharge = parseFloat(document.getElementById('freight-charge').value);
    var totalPalletCharges = 0.0;
    var totalFreightAllowance = 0.0;
    var totalSavings = 0.0;
    var precision = 9;
    if (truncate) { precision = CONSTANTS.STD_PRECISION;}
    //
    // validating fields
    check_date_str('date');
    if (trim(document.getElementById('carrier').value) === '') { add_class('invalid-field','carrier');}
    if (isNaN(freightCharge)) {add_class('invalid-field','freight-charge'); freightCharge = 0.0;}
    //
    // checking all of the haul fields
    for (var i = 0; i < maxNumFields; i++) {
        if (!!(document.getElementById('haul-info-'+i))) {
            if (trim(document.getElementById('po-number-{'+i+'}').value) === '') { add_class('invalid-field','po-number-{'+i+'}');}
            if (trim(document.getElementById('pickup-point-{'+i+'}').value) === '') { add_class('invalid-field','pickup-point-{'+i+'}');}
            var freightAllowance = parseFloat(document.getElementById('freight-allowance-{'+i+'}').value);
            var palletCharges = parseFloat(document.getElementById('pallet-charges-{'+i+'}').value);
            // checking if the fields are disabled
            if (document.getElementById('entry-status-{'+i+'}').value != 'submitted') { freightAllowance = 0.0; palletCharges = 0.0;}
            //
            // checking if they are real numbers
            if (isNaN(freightAllowance)) {add_class('invalid-field','freight-allowance-{'+i+'}'); freightAllowance = 0.0;}
            if (isNaN(palletCharges)) {add_class('invalid-field','pallet-charges-{'+i+'}'); palletCharges = 0.0;}
            //
            totalFreightAllowance += freightAllowance;
            totalPalletCharges += palletCharges;
        }
        //
        // outputting data
        var totalSavings = totalFreightAllowance - freightCharge - totalPalletCharges;
        document.getElementById('total-savings').value = round(totalSavings,precision).toFixed(precision);
    }
}
//
// this function validates the freight_backhal form
function init_backhaul_form_validation(department,action) {
    //
    var error = false;
    var department = 'freight_backhaul';
    var nameValObj = {};
    var inputData = [];
    var submitArgs = {};
    var allInputs = document.getElementById('input-emp-data').getElementsByTagName("*");
    var maxNumFields  = parseInt(document.getElementById('number-of-fields').value) + 1;
    //
    // calculating unrounded values for data entry forms
    recalc_backhaul_form(false);
    //
    // getting static form values and initializing input data array
    nameValObj = get_all_form_values('input-emp-data','');
    for (var i = 0; i < maxNumFields; i++) {
        inputData[i] = {};
        for (var prop in nameValObj) { inputData[i][prop] = nameValObj[prop];}
        if (i > 0) { delete inputData[i]['freight_charge'];}
        if (i > 0) { delete inputData[i]['total_savings'];}
        inputData[i]['department'] = department;
        inputData[i]['exists'] = false;
    }
    //
    // checking form errors and populating inputData
    var index = 0;
    for (var i = 0; i < allInputs.length; i++) {
        //
        if (allInputs[i].disabled == true) {continue;}
        if (allInputs[i].className.match('invalid-field')) {
            console.log("Invalid Error: ",allInputs[i].id);
            error = true;
        }
        if (!(allInputs[i].id.match(/\{\d+\}/))) { continue;}
        index = parseInt(allInputs[i].id.match(/\{(\d+)\}/)[1]);
        inputData[index][allInputs[i]['name']] = allInputs[i].value;
        inputData[index]['exists'] = true;
    }
    //
    // determining department and creating meta_sql statment
    if (CONSTANTS.DEPT_TABLES.hasOwnProperty(department)) { var dept_table = CONSTANTS.DEPT_TABLES[department];}
    else { console.log(' Department has no set table: '+department); return;}
    //
    var sql_args = {};
    sql_args.cmd = 'SELECT';
    sql_args.table = 'table_meta_data';
    sql_args.where = [['in_tables','REGEXP','(^|%)employee_data(%|$)|(^|%)'+dept_table+'(%|$)']]
    var meta_sql = gen_sql(sql_args);
    //
    // creating submission callback
    var submit_callback = function(response) {
        add_class('hidden-elm','form-errors');
        submitArgs.action = action;
        submitArgs.dept_table = dept_table;
        submitArgs.inputData = inputData;
        submitArgs.metaData = response.meta_data;
        submit_backhaul_form(submitArgs);
    }
    //
    if (error) {
        remove_class('hidden-elm','form-errors');
    }
    else {
        var sql_arr = [meta_sql];
        var name_arr = ['meta_data'];
        ajax_fetch(sql_arr,name_arr,submit_callback)
    }
}
//
// this function creates the SQL statements and submits the backhaul data
function submit_backhaul_form(submitArgs) {
    //
    var action = submitArgs.action;
    var dept_table = submitArgs.dept_table
    var inputData = submitArgs.inputData;
    var metaData = submitArgs.metaData;
    var colMetaData = {};
    var groupID = round(Math.random()*Math.pow(10,9),0);
    //
    // defining messages for specfic actions
    var message = '';
    if (action == 'create') {
        message = 'Sucessfully Created Freight Record for: '+document.getElementById('emp-first-name').value+" "+document.getElementById('emp-last-name').value+'.';
    }
    else if (action == 'update') {
        message = 'Sucessfully Modifed Freight Record for Employee: '+document.getElementById('emp-first-name').value+' '+document.getElementById('emp-last-name').value+'.';
    }
    else if (action == 'restore') {
        message = 'Sucessfully Restored all POs for Employee: '+document.getElementById('emp-first-name').value+' '+document.getElementById('emp-last-name').value+'.';
    }
    else if (action == 'delete') {
        message = 'Sucessfully Deleted all POs for Employee: '+document.getElementById('emp-first-name').value+' '+document.getElementById('emp-last-name').value+'.';
    }
    //
    // creating the two callback functions
    var insert_callback = function() {
        get_backhaul_form('999999','data-entry-form-div',false);
        alert(message);
    }
    var update_callback = function() {
        var curr_page = document.getElementById('employee-data-table-page-nav').dataset.currPage;
        var sort_col = document.getElementById('employee-data-table-page-nav').dataset.sortCol;
        var sort_dir = document.getElementById('employee-data-table-page-nav').dataset.sortDir;
        var emp_id = '.'
        if (!!document.getElementById('employee-data-table')) {
            if (!!(document.getElementById('employee-data-table').dataset.empId)) {
                emp_id = document.getElementById('employee-data-table').dataset.empId;
            }
        }
        mod_emp_data_table(curr_page,sort_col,sort_dir,emp_id);
        // clearing form off of page
        document.getElementById('update-entry-form-div').removeAll();
        document.getElementById('modify-header').removeAll();
    }
    // defining the callback function based on action
    var callback = update_callback
    if (action == 'create') { callback = insert_callback;}
    //
    // converting meta_data array to be an object indexed by column_name
    // and reducing in_tables to only be employee_data or the department specific table
    for (var i = 0; i < metaData.length; i++) {
        if (metaData[i].in_tables.match(/(^|%)employee_data(%|$)/)) {metaData[i].in_tables = 'employee_data';}
        else if (metaData[i].in_tables.match('(^|%)'+dept_table+'(%|$)')) {metaData[i].in_tables = dept_table;}
        colMetaData[metaData[i].column_name] = metaData[i];
    }
    //
    var sql_arr = [];
    for (var i = 0; i < inputData.length; i++) {
        if (inputData[i]['exists'] != true) {continue;}
        delete inputData[i]['exists'];
        // variable initializations
        var data = inputData[i];
        var mainSqlArgs = {
            'table' : 'employee_data',
            'cols'  : [],
            'vals'  : []
        };
        var deptSqlArgs = {
            'table' : dept_table,
            'cols'  : [],
            'vals'  : []
        };
        //
        data['emp_first_name'] = 'Carrier: '+data['carrier'];
        data['emp_last_name'] = 'PO #: '+data['po_number'];
        //if (action != 'create') {
        if (data['entry_id'] != '') {
            data.admin_fix += document.getElementById('user-username').value+';';
            data.admin_fix_timestamp += get_current_timestamp()+';';
            mainSqlArgs.cmd = 'UPDATE';
            mainSqlArgs.where = [['entry_id','LIKE',data['entry_id']]]
            deptSqlArgs.cmd = 'UPDATE';
            deptSqlArgs.where = [['entry_id','LIKE',data['entry_id']]]
            delete data.entering_user;
        }
        else {
            mainSqlArgs.cmd = "INSERT";
            deptSqlArgs.cmd = "INSERT";
            deptSqlArgs.cols.push('entry_id');
            deptSqlArgs.vals.push('LAST_INSERT_ID()');
        }
        if (action == 'create') { data['group_id'] = groupID;}
        delete data.entry_id;
        // popoulating sql args cols and vals
        for (name in data) {
            if (colMetaData[name].in_tables.match(/(^|%)employee_data(%|$)/)) {
                mainSqlArgs.cols.push(name);
                mainSqlArgs.vals.push(data[name]);
            }
            else {
                deptSqlArgs.cols.push(name);
                deptSqlArgs.vals.push(data[name]);
            }
        }
        sql_arr.push(gen_sql(mainSqlArgs));
        sql_arr.push(gen_sql(deptSqlArgs));
    } //ends primary field loop
    //
    // executing async code
    exec_transaction(sql_arr,callback);
}
//
// this validates the meat_shop_item form
function init_item_form_validation(action) {
    //
    var arg_object = {};
    arg_object.action = action;
    // checking if string is only numbers
    if (action == "create") {
        //
        // checking if number is unique and then performing additional validation
        var validate_fun = function(unique_id_error) {
            arg_object.unique_id_error = unique_id_error
            validate_item_form(arg_object)
        }
        //
        check_unique('meat-shop-item','item-number','','meat_shop_stock',validate_fun);
    }
    else {
        arg_object.unique_id_error = false;
        validate_item_form(arg_object);
    }
}
//
// this completes the validation of the form
function validate_item_form(validate_args) {
    //
    var action = validate_args.action;
    var error = false;
    var basic_val_error = false;
    var name_val_obj = {};
    var sql_args = {};
    var sql = '';
    //
    if (validate_args.unique_id_error) {
        add_class('invalid-field','item-number')
        remove_class('hidden-elm','item-number-uni-err-msg')
        error = true;
    }
    basic_val_error = basic_validate('meat-shop-item','comments');
    if (basic_val_error) {error = true;}
    //
    if (error) { remove_class('hidden-elm','form-errors'); return;}
    else { add_class('hidden-elm','form-errors');}
    //
    // defining messages based on action type
    var confirm_message = '';
    var message = '';
    var cont = false;
    if (action == 'create') {
        confirm_message = 'Confirm creation of Item: '+document.getElementById('item-number').value+' - '+document.getElementById('item-name').value;
        message = 'Sucessfully Created Item: '+document.getElementById('item-number').value+' - '+document.getElementById('item-name').value+'.';
        //
        cont = confirm(confirm_message);
        if (!(cont)) {return;}
    }
    else if (action == 'update') {
        confirm_message = 'Confirm Modifcation of Item: '+document.getElementById('item-number').value+' - '+document.getElementById('item-name').value;
        message = 'Sucessfully Modifed Item: '+document.getElementById('item-number').value+' - '+document.getElementById('item-name').value+'.';
        //
        cont = confirm(confirm_message);
        if (!(cont)) {return;}
    }
    else if (action == 'delete') {
        confirm_message = 'Confirm Deletion of Item: '+document.getElementById('item-number').value+' - '+document.getElementById('item-name').value;
        message = 'Sucessfully Deleted Item: '+document.getElementById('item-number').value+' - '+document.getElementById('item-name').value+'.';
        //
        cont = confirm(confirm_message);
        if (!(cont)) {return;}
        //
        document.getElementById('item-status').value = 'inactive';
    }
    else if (action == 'restore') {
        confirm_message = 'Confirm Restoration of Item: '+document.getElementById('item-number').value+' - '+document.getElementById('item-name').value;
        message = 'Sucessfully Restored Item: '+document.getElementById('item-number').value+' - '+document.getElementById('item-name').value+'.';
        //
        cont = confirm(confirm_message);
        if (!(cont)) {return;}
        //
        document.getElementById('item-status').value = 'active'
    }
    if (!(cont)) {return;}
    //
    //
    // ensuring ID field is enabled temporarily to get its value
    document.getElementById('item-number').disabled = false;
    name_val_obj = get_all_form_values('meat-shop-item','');
    document.getElementById('item-number').disabled = true;
    //
    // update item callback
    var callback = function() {
        var curr_page = document.getElementById('item-table-page-nav').dataset.currPage;
        var sort_col = document.getElementById('item-table-page-nav').dataset.sortCol;
        var sort_dir = document.getElementById('item-table-page-nav').dataset.sortDir;
        alert(message);
        gen_item_table(curr_page,sort_col,sort_dir);
        // clearing form off of page
        document.getElementById('content-div').removeAll();
        document.getElementById('modify-header').removeAll();
    }
    //
    // creating sql statment
    if (action != 'create') {
        sql_args.cmd = "UPDATE";
        sql_args.where = [['item_number','LIKE',name_val_obj['item_number']]];
    }
    else {
        sql_args.cmd = "INSERT";
    }
    //
    sql_args.table = "meat_shop_stock";
    sql_args.cols = [];
    sql_args.vals = [];
    for (name in name_val_obj) {
        sql_args.cols.push(name);
        sql_args.vals.push(name_val_obj[name])
    }
    sql = gen_sql(sql_args);
    //
    // executing async code
    ajax_exec_db(sql,callback)
}
//
// this validates the stock change form
function validate_stock_form(action) {
    //
    var error = false;
    var basic_val_error = false;
    var numeric_val_error = false;
    var name_val_obj = {};
    var sql_args = {};
    var stock_sql = '';
    var item_sql = '';
    var sql = '';
    var callback = '';
    //
    // checking for errors
    document.getElementById('item-number').disabled = false;
    basic_val_error = basic_validate('update-item-stock','comments,entry-id');
    numeric_val_error = check_num_str('amount','',true);
    if (basic_val_error) {error = true;}
    if (numeric_val_error) {error = true;}
    //
    // defining action based parameters
    var confirm_message = '';
    var message = '';
    var nav_id = '';
    var table_fun = '';
    var cont = false;
    if (action == 'create') {
        confirm_message = 'Confirm stock change for Item: '+document.getElementById('item-number').value+' - '+document.getElementById('item-name').value;
        message = 'Succesfully Updated the Quantity of Item: '+document.getElementById('item-number').value;
        nav_id = 'item-table-page-nav';
        table_fun = gen_item_table;
        //
        var cont = confirm(confirm_message);
        if (!(cont)) {return;}
    }
    else if (action == 'update') {
        confirm_message = 'Confirm modification of Record: '+document.getElementById('entry-id').value;
        message = 'Succesfully Modified Record: '+document.getElementById('entry-id').value;
        nav_id = 'record-table-page-nav';
        table_fun = gen_stock_table;
        //
        var cont = confirm(confirm_message);
        if (!(cont)) {return;}
    }
    else if (action == 'delete') {
        confirm_message = 'Confirm deletion of Record: '+document.getElementById('entry-id').value;
        message = 'Succesfully Deleted Record: '+document.getElementById('entry-id').value;
        nav_id = 'record-table-page-nav';
        table_fun = gen_stock_table;
        //
        var cont = confirm(confirm_message);
        if (!(cont)) {return;}
        //
        // updating value of quantity but not changing amount
        elementArithmetic('new-quantity','orig-amount','new-quantity','-');
        document.getElementById('amount').value = document.getElementById('orig-amount').value
        //
        // changing value of entry status
        document.getElementById('entry-status').value = 'deleted';
    }
    else if (action == 'restore') {
        confirm_message = 'Confirm restoration of Record: '+document.getElementById('entry-id').value;
        message = 'Succesfully Restored Record: '+document.getElementById('entry-id').value;
        nav_id = 'records-table-page-nav';
        table_fun = gen_stock_table;
        //
        var cont = confirm(confirm_message);
        if (!(cont)) {return;}
        //
        // updating value of quantity but not changing amount
        elementArithmetic('new-quantity','orig-amount','new-quantity','+');
        document.getElementById('amount').value = document.getElementById('orig-amount').value
        //
        // changing value of entry status
        document.getElementById('entry-status').value = 'submitted'
    }
    if (!(cont)) {return;}
    //
    name_val_obj = get_all_form_values('update-item-stock','');
    document.getElementById('item-number').disabled = true;
    //
    // setting up callbacks
    var callback = function() {
        //
        var curr_page = document.getElementById(nav_id).dataset.currPage;
        var sort_col = document.getElementById(nav_id).dataset.sortCol;
        var sort_dir = document.getElementById(nav_id).dataset.sortDir;
        alert(message);
        table_fun(curr_page,sort_col,sort_dir)
        document.getElementById('content-div').removeAll();
    }
    //
    if (action == 'create') {
        //
        delete name_val_obj.entry_id;
        name_val_obj.entering_user = document.getElementById('user-username').value;
        //
        sql_args.cmd = 'INSERT';
        sql_args.table = 'meat_shop_stock_changes';
        sql_args.cols = [];
        sql_args.vals = [];
        for (var col in name_val_obj) {
            sql_args.cols.push(col);
            sql_args.vals.push(name_val_obj[col]);
        }
        stock_sql = gen_sql(sql_args);
        //
        sql_args = {};
        sql_args.cmd = 'UPDATE';
        sql_args.table = 'meat_shop_stock';
        sql_args.cols = ['quantity'];
        sql_args.vals = [document.getElementById('new-quantity').value];
        sql_args.where = [['item_number','LIKE',document.getElementById('item-number').value]]
        item_sql = gen_sql(sql_args);
    }
    else {
        //
        delete name_val_obj.entry_id;
        name_val_obj.admin_fix = document.getElementById('user-username').value;
        name_val_obj.admin_fix_timestamp = get_current_timestamp();
        //
        sql_args.cmd = 'UPDATE';
        sql_args.table = 'meat_shop_stock_changes';
        sql_args.cols = [];
        sql_args.vals = [];
        for (var col in name_val_obj) {
            sql_args.cols.push(col);
            sql_args.vals.push(name_val_obj[col]);
        }
        sql_args.where = [['entry_id','LIKE',document.getElementById('entry-id').value]]
        stock_sql = gen_sql(sql_args);
        //
        sql_args = {};
        sql_args.cmd = 'UPDATE';
        sql_args.table = 'meat_shop_stock';
        sql_args.cols = ['quantity'];
        sql_args.vals = [document.getElementById('new-quantity').value];
        sql_args.where = [['item_number','LIKE',document.getElementById('item-number').value]]
        item_sql = gen_sql(sql_args);
    }
    var sql_arr = [stock_sql,item_sql]
    //
    exec_transaction(sql_arr,callback);
}