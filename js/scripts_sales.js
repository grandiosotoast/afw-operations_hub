////////////////////////////////////////////////////////////////////////////////
//////////////       This file holds the functions that are          ///////////
//////////////       associated with only the sales                  ///////////
////////////////////////////////////////////////////////////////////////////////
"use strict";
//
// this unhides the rep creation/maintenance buttons and resets the page
function rep_maintenance() {
    //
    reset_sales_page();
    //
    remove_class('hidden-elm','create-new-rep');
    remove_class('hidden-elm','modify-rep');
}
//
// this unhides the customer creation/maintenance buttons and resets the page
function customer_maintenance() {
    //
    reset_sales_page();
    //
    document.getElementById('tab-clicked').value = 'customer-maintenance';
    //
    remove_class('hidden-elm','create-new-customer');
    remove_class('hidden-elm','modify-customer');
}
//
// this resets the page after main buttons are pressed
function reset_sales_page() {
    //
    // re-hiding everything in the additional-buttons div
    var childNodes = document.getElementById('additional-buttons').childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].nodeType == 1) {add_class('hidden-elm',childNodes[i].id)}
    }
    //
    // clearing elements inside main-container div
    var childNodes = document.getElementById('main-container').childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].nodeType == 1) {childNodes[i].innerHTML = '';}
    }
}
//
// this sets up the page for rep creation
function new_rep() {
    //
    // this and the mod rep functions will work joinly with dbUser table
    // only sales admins will be set up using dbUsers
    // reps will be set up here
    //
    document.getElementById('modify-header').innerHTML = 'Creating a New Sales Rep';
    create_form('sales_rep_form','content-div');
}
// 
// this sets up the page for rep modification
function mod_rep() {
    //
    // 
    alert('Mod Rep Button')
}
//
// this function creates the sales rep table
function create_rep_table(page,sort_col,sort_dir) {
}
//
// this starts off the form validation
function init_rep_form_valiation(action) {
    var basic_val_error = false;
    var skip_str = 'dbuser-last-name,comments,dbuser-internal-id';
    //
    // checking form for empty fields
    if (action != 'create') { skip_str += ',password,conf-password'}
    basic_val_error = basic_validate('add-new-rep',skip_str);
    //
    // getting all form values
    document.getElementById('rep-id').disabled = false;
    var name_val_obj = get_all_form_values('add-new-rep','');
    if (action != 'create') { document.getElementById('rep-id').disabled = true;}
    if (name_val_obj['rep_id']   == '') { return;}
    if (name_val_obj['username'] == '') { return;}
    //
    // fetching stuff from DB
    var username_sql = "SELECT `username`,`dbuser_internal_id` FROM `dbUsers` WHERE `username` LIKE '"+name_val_obj['username']+"'";
    var rep_id_sql   = "SELECT `rep_id`,`dbuser_internal_id` FROM `sales_rep_table` WHERE `rep_id` LIKE '"+name_val_obj['rep_id']+"'";
    var meta_sql = "SELECT * FROM `table_meta_data` WHERE `in_tables` REGEXP 'dbusers|sales_rep_table'";
    var callback = function(response) {
        var args = {
            'action'          : action,
            'basic_val_error' : basic_val_error,
            'name_val_obj'    : name_val_obj,
            'response'        : response
        };
        rep_form_valiation(args);
    }
    //
    ajax_multi_fetch([meta_sql,rep_id_sql,username_sql],['meta_data','rep_id_test','username_test'],callback);
}
//
// finishes form valiation after database query
function rep_form_valiation(args) {
    //
    var action = args.action;
    var meta_data = args.response['meta_data'];
    var rep_id_test = args.response['rep_id_test'];
    var username_test = args.response['username_test'];
    var name_val_obj = args.name_val_obj;
    var all_inputs = document.getElementById('add-new-rep').getElementsByTagName("*");
    //
    // converting meta_data from an array to an object
    var col_meta_data = {};
    for (var i = 0; i < meta_data.length; i++) {
        if (meta_data[i].in_tables.match(/(^|%)dbusers(%|$)/i)) { meta_data[i].in_tables = 'dbusers';}
        else if (meta_data[i].in_tables.match(/(^|%)sales_rep_table(%|$)/i)) { meta_data[i].in_tables = 'sales_rep_table';}
        col_meta_data[meta_data[i].column_name] = meta_data[i];
    }
    args.col_meta_data = col_meta_data;
    //
    var error = false;
    var basic_val_error = args.basic_val_error;
    var rep_id_uni_error = false;
    var username_uni_error = false;
    //
    // testing uniqueness
    console.log(rep_id_test,name_val_obj['dbuser_internal_id']);
    console.log(username_test,name_val_obj['dbuser_internal_id'])

    if (rep_id_test.length > 0) {
        if (rep_id_test[0]['dbuser_internal_id'] != name_val_obj['dbuser_internal_id']) { rep_id_uni_error = true;}
    }
    if (username_test.length > 0) {
        if (username_test[0]['dbuser_internal_id'] != name_val_obj['dbuser_internal_id']) { username_uni_error = true;}
    }
    //
    // additional error checking
    for (var i = 0; i < all_inputs.length; i++) {
        // checking if child node is an element
        if (all_inputs[i].disabled == true) {continue;}
        if (all_inputs[i].className.match('invalid-field')) {
            console.log("Invalid Error: ",all_inputs[i].id);
            error = true;
        }
    }
    //
    // final error checks
    if (basic_val_error) { error = true;}
    //
    if (rep_id_uni_error) { error = true; add_class('invalid-field','rep-id'); remove_class('hidden-elm','rep-id-uni-err');}
    else { remove_class('invalid-field','rep-id'); add_class('hidden-elm','rep-id-uni-err');}
    //
    if (username_uni_error) { error = true; add_class('invalid-field','username'); remove_class('hidden-elm','username-uni-err');}
    else { remove_class('invalid-field','username'); add_class('hidden-elm','username-uni-err');}
    //
    if (error) { remove_class('hidden-elm','form-errors'); return;}
    else { add_class('hidden-elm','form-errors');}
    //
    // defining action based values
    var confirm_message = '';
    var cont = false;
    if (action == 'create') {
        confirm_message = 'Confirm creation of Sales Rep: '+name_val_obj['dbuser_first_name']+' '+name_val_obj['dbuser_last_name'];
        args.return_message  = 'Sucessfully created Sales Rep: '+name_val_obj['dbuser_first_name']+' '+name_val_obj['dbuser_last_name'];
    }
    else if (action == 'update') {
        confirm_message = 'Confirm modifcation of Sales Rep: '+name_val_obj['dbuser_first_name']+' '+name_val_obj['dbuser_last_name'];
        args.return_message  = 'Sucessfully modified Sales Rep: '+name_val_obj['dbuser_first_name']+' '+name_val_obj['dbuser_last_name'];
    }
    else if (action == 'delete') {
        confirm_message = 'Confirm deletion of Sales Rep: '+name_val_obj['dbuser_first_name']+' '+name_val_obj['dbuser_last_name'];
        args.return_message  = 'Sucessfully deleted Sales Rep: '+name_val_obj['dbuser_first_name']+' '+name_val_obj['dbuser_last_name'];
        //
        name_val_obj['dbuser_status'] = 'inactive';
    }
    else if (action == 'restore') {
        confirm_message = 'Confirm restoration of Sales Rep: '+name_val_obj['dbuser_first_name']+' '+name_val_obj['dbuser_last_name'];
        args.return_message  = 'Sucessfully restored Sales Rep: '+name_val_obj['dbuser_first_name']+' '+name_val_obj['dbuser_last_name'];
        //
        name_val_obj['dbuser_status'] = 'active';
    }
    //
    cont = confirm(confirm_message);
    if (!(cont)) {return;}
    //
    submit_sales_rep_form(args)
}
//
// this submits the rep form
function submit_sales_rep_form(args) {
    //
    var name_val_obj = args.name_val_obj;
    var action = args.action;
    var col_meta_data = args.col_meta_data;
    var callback = '';
    var user_sql_args = {};
    var rep_sql_args  = {};
    //
    // creating the two callback functions  
    var insert_callback = function() {
        create_form('sales_rep_form','content-div');
        alert(args.return_message);
    }
    var update_callback = function() {
        var curr_page = document.getElementById('rep-table-page-nav').dataset.currPage;
        var sort_col  = document.getElementById('rep-table-page-nav').dataset.sortCol;
        var sort_dir  = document.getElementById('rep-table-page-nav').dataset.sortDir;
        create_rep_table(curr_page,sort_col,sort_dir);
        // clearing form off of page
        document.getElementById('modify-header').innerHTML = "";
        document.getElementById('content-div').innerHTML = "";
        //
        alert(args.return_message);
    }
    //
    // defining sql command and where clause if needed
    if (action != 'create') {
        callback = update_callback
        user_sql_args.cmd = "UPDATE";
        user_sql_args.where = [['dbuser_internal_id','LIKE',name_val_obj['dbuser_internal_id']]];
        rep_sql_args.cmd  = "UPDATE";
        rep_sql_args.where  = [['dbuser_internal_id','LIKE',name_val_obj['dbuser_internal_id']]];
    }
    else {
        callback = insert_callback;
        user_sql_args.cmd = "INSERT";
        rep_sql_args.cmd  = "INSERT";
        delete name_val_obj.dbuser_internal_id;
    }
    //
    // constructing SQL statements
    user_sql_args.table = 'dbUsers';
    user_sql_args.cols  = [];
    user_sql_args.vals  = [];
    rep_sql_args.table  = 'sales_rep_table';
    rep_sql_args.cols   = [];
    rep_sql_args.vals   = [];
    for (name in name_val_obj) {
        if (col_meta_data[name].in_tables.match(/(^|%)dbusers(%|$)/i)) {
            user_sql_args.cols.push(name);
            user_sql_args.vals.push(name_val_obj[name]);
        }
        else {
            rep_sql_args.cols.push(name);
            rep_sql_args.vals.push(name_val_obj[name]);
        }
    }
    rep_sql_args.cols.push('rep_name');
    rep_sql_args.vals.push(name_val_obj['dbuser_first_name']+' '+name_val_obj['dbuser_last_name']);    
    //
    // adding this if it is a new entry
    if (action == 'create') {
        rep_sql_args.cols.push('dbuser_internal_id');
        rep_sql_args.vals.push('LAST_INSERT_ID()'); 
    }
    var user_sql = gen_sql(user_sql_args);
    var rep_sql = gen_sql(rep_sql_args);
    var sql = 'BEGIN;'
    if (!!(user_sql)) sql += user_sql+'; ';
    if (!!(rep_sql))  sql +=  rep_sql+'; ';
    sql += 'COMMIT;';
    //
    console.log(sql);
    ajax_exec_db(sql,callback);
}