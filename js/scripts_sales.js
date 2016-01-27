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
    // clearing elements inside main-container div
    var childNodes = document.getElementById('main-container').childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].nodeType == 1) {childNodes[i].innerHTML = '';}
    }
    //
    document.getElementById('modify-header').innerHTML = 'Creating a New Sales Rep';
    create_form('sales_rep_form','content-div');
}
// 
// this sets up the page for rep modification
function mod_rep() {
    //
    // clearing elements inside main-container div
    var childNodes = document.getElementById('main-container').childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].nodeType == 1) {childNodes[i].innerHTML = '';}
    }
    //
    // adding a show inactive button
    var fieldset = document.createElement('FIELDSET');
    var formElements = Array(
            {'elm' : 'legend','textNode' : 'Rep Selection Parameters'},
            //
            {'elm' : 'label', 'className' : 'label','textNode' : 'Show Inactive Reps:'},
            {'elm' : 'input', 'id' : 'show-inactive', 'type' : 'checkbox', 'events' : [{'event' : 'click', 'function' : function() {create_rep_table(1,'rep_id','ASC');}}]},
            {'elm' : 'br'}
        );
    fieldset.id = 'rep-selection-parameters';
    fieldset.className = 'fieldset-default';
    addChildren(fieldset,formElements);
    document.getElementById('input-div').appendChild(fieldset);
    //
    create_rep_table(1,'rep_id','ASC');
}
//
// this sets up the page for manual customer creation
function new_customer() {
    //
    // clearing elements inside main-container div
    var childNodes = document.getElementById('main-container').childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].nodeType == 1) {childNodes[i].innerHTML = '';}
    }
    //
    document.getElementById('modify-header').innerHTML = 'Creating a New Customer';
    create_form('sales_customer_form','content-div');
    //
    // populating rep dropbox
    var add_args = {
        'format_str' : '%rep_id% - %rep_name%'
    };
    populate_dropbox_options('rep-id','sales_rep_table','rep_id','rep_name','Rep ID - Rep Name',add_args)
}
//
// this sets up the page to modify a customer
function mod_customer() {
    //
    // clearing elements inside main-container div
    var childNodes = document.getElementById('main-container').childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].nodeType == 1) {childNodes[i].innerHTML = '';}
    }
    //
    // adding refinement fields
    var fieldset = document.createElement('FIELDSET');
    var formElements = Array(
            {'elm' : 'legend','textNode' : 'Rep Selection Parameters'}, 
            //
            {'elm' : 'label', 'className' : 'label-12em','textNode' : 'Refine by Customer ID:'},
            {'elm' : 'input', 'id' : 'refine-by-cid', 'type' : 'text'},
            {'elm' : 'span','textNode' : '\u00A0\u00A0\u00A0\u00A0'},
            {'elm' : 'label', 'className' : 'label-medium','textNode' : 'Exact Match:'},
            {'elm' : 'input', 'id' : 'cid-match-type', 'type' : 'checkbox', 'value' : 'REGEXP', 'events' : [{'event' : 'click', 'function' : function(){ toggle_checkbox_value(this.id,'LIKE','REGEXP');} }]},
            {'elm' : 'br'},
            //
            {'elm' : 'label', 'className' : 'label-12em','textNode' : 'Refine by Rep ID:'},
            {'elm' : 'input', 'id' : 'refine-by-rid', 'type' : 'text'},
            {'elm' : 'span','textNode' : '\u00A0\u00A0\u00A0\u00A0'},
            {'elm' : 'label', 'className' : 'label-medium','textNode' : 'Exact Match:'},
            {'elm' : 'input', 'id' : 'rid-match-type', 'type' : 'checkbox', 'value' : 'REGEXP', 'events' : [{'event' : 'click', 'function' : function(){ toggle_checkbox_value(this.id,'LIKE','REGEXP');} }]},
            {'elm' : 'br'},
            //
            {'elm' : 'label', 'className' : 'label-12em','textNode' : 'Refine by Customer Name:'},
            {'elm' : 'input', 'id' : 'refine-by-name', 'type' : 'text'},
            {'elm' : 'span','textNode' : '\u00A0\u00A0\u00A0\u00A0'},
            {'elm' : 'label', 'className' : 'label-medium','textNode' : 'Exact Match:'},
            {'elm' : 'input', 'id' : 'name-match-type', 'type' : 'checkbox', 'value' : 'REGEXP', 'events' : [{'event' : 'click', 'function' : function(){ toggle_checkbox_value(this.id,'LIKE','REGEXP');} }]},
            {'elm' : 'br'},
            //
            {'elm' : 'label', 'className' : 'label-12em','textNode' : 'Refine by Customer Status:'},
            {'elm' : 'input', 'id' : 'refine-by-status', 'type' : 'text'},
            {'elm' : 'span','textNode' : '\u00A0\u00A0\u00A0\u00A0'},
            {'elm' : 'label', 'className' : 'label-medium','textNode' : 'Exact Match:'},
            {'elm' : 'input', 'id' : 'status-match-type', 'type' : 'checkbox', 'value' : 'REGEXP', 'events' : [{'event' : 'click', 'function' : function(){ toggle_checkbox_value(this.id,'LIKE','REGEXP');} }]},
            {'elm' : 'br'},
            //
            {'elm' : 'button', 'textNode' : 'Refine Customer Table', 'type' : 'button', 'events' : [{'event' : 'click', 'function' : function() {create_customer_table(1,'rep_id','ASC');}}]}
        );
    fieldset.id = 'customer-selection-parameters';
    fieldset.className = 'fieldset-default';
    addChildren(fieldset,formElements);
    document.getElementById('input-div').appendChild(fieldset);
    //
    create_customer_table(1,'rep_id','ASC')
}
//
// this function creates the sales rep table
function create_rep_table(page,sort_col,sort_dir) {   
    //
    // initializating argument objects
    var rep_table_args = {};
    var data_sql_args = {};
    var meta_sql_args = {};
    //
    // creating sql statements
    rep_table_args.show_inactive = document.getElementById('show-inactive').checked;
    var where = '';
    if (!(rep_table_args.show_inactive)) {
        data_sql_args.where = [['rep_status','LIKE','active']];
        var where = "WHERE dbUsers.dbuser_status LIKE 'active' " 
    }
    meta_sql_args.cmd = 'SELECT';
    meta_sql_args.table = 'table_meta_data';
    meta_sql_args.where = [['in_tables','REGEXP','(^|%)sales_rep_table(%|$)|(^|%)dbusers(%|$)'],['use_on_pages','REGEXP','sales_maintenance|sales_reporting'],['use_in_html_tables','REGEXP','sales_rep_table']];
    meta_sql_args.orderBy = [['order_index','ASC']]
    
    rep_table_args.data_sql = "SELECT * FROM sales_rep_table INNER JOIN dbUsers ON sales_rep_table.dbuser_internal_id=dbUsers.dbuser_internal_id "+where+" ORDER BY sales_rep_table."+sort_col+" "+sort_dir;
    rep_table_args.meta_sql = gen_sql(meta_sql_args);
    //
    // creating table argument object   
    rep_table_args.table_output_id = 'table-div';
    rep_table_args.table_id = 'sales_rep_table';
    rep_table_args.table_class = 'emp_data_table';
    rep_table_args.row_id_prefix = 'rep-row-';
    rep_table_args.table_data_cell_class = 'emp-data-td';  
    rep_table_args.page_nav_div_id = 'rep-table-page-nav';
    rep_table_args.page_nav_class = 'page_nav';
    rep_table_args.page_nav_id_prefix = 'rep';
    rep_table_args.page_class_str = 'page_nav_link';
    rep_table_args.page = page;
    rep_table_args.num_per_page = 15;
    rep_table_args.tot_pages_shown = 9;
    rep_table_args.page_onmouse_str = '';
    rep_table_args.page_onclick = 'create_rep_table(%%,%sort_col%,%sort_dir%)';
    rep_table_args.head_row_class_str = 'emp-data-header';
    rep_table_args.sort_col = sort_col;
    rep_table_args.sort_dir = sort_dir;
    rep_table_args.sort_onclick = 'create_rep_table(%%,%column_name%,%sort_dir%)';
    rep_table_args.row_onclick = "modify_rep_form('%dbuser_internal_id%','%row_id%')";
    rep_table_args.row_onmouseenter = "add_class('emp_data_tr-highlight','%row_id%')"; 
    rep_table_args.row_onmouseleave = "remove_class('emp_data_tr-highlight','%row_id%')";  
    //
    create_sortable_table(rep_table_args);
}
//
// this function creates the sales rep table
function create_customer_table(page,sort_col,sort_dir) {   
    //
    // initializating argument objects
    var customer_table_args = {};
    var data_sql_args = {};
    var meta_sql_args = {};
    var ref_customer_id = '.';
    var ref_rep_id = '.';
    var ref_customer_name = '.';
    var ref_customer_status = '.';
    //
    // creating sql statements
    meta_sql_args.cmd = 'SELECT';
    meta_sql_args.table = 'table_meta_data';
    meta_sql_args.where = [];
    meta_sql_args.where.push(['in_tables','REGEXP','(^|%)sales_customer_table(%|$)|(^|%)dbusers(%|$)']);
    meta_sql_args.where.push(['use_on_pages','REGEXP','sales_maintenance|sales_reporting']);
    meta_sql_args.where.push(['use_in_html_tables','REGEXP','sales_customer_table']);
    meta_sql_args.orderBy = [['order_index','ASC']]
    //
    data_sql_args.cmd = 'SELECT';
    data_sql_args.table = 'sales_customer_table';
    if (trim(document.getElementById('refine-by-cid').value) != '') { ref_customer_id = trim(document.getElementById('refine-by-cid').value);}
    if (trim(document.getElementById('refine-by-rid').value) != '') { ref_rep_id = trim(document.getElementById('refine-by-rid').value);}
    if (trim(document.getElementById('refine-by-name').value) != '') { ref_customer_name = trim(document.getElementById('refine-by-name').value);}
    if (trim(document.getElementById('refine-by-status').value) != '') { ref_customer_status = trim(document.getElementById('refine-by-status').value);}
    data_sql_args.where = [];
    data_sql_args.where.push(['customer_id',document.getElementById('cid-match-type').value,ref_customer_id]);
    data_sql_args.where.push(['rep_id',document.getElementById('rid-match-type').value,ref_rep_id]);
    data_sql_args.where.push(['customer_name',document.getElementById('name-match-type').value,ref_customer_name]);
    data_sql_args.where.push(['customer_status',document.getElementById('status-match-type').value,ref_customer_status]);
    data_sql_args.orderBy = [[sort_col,sort_dir]];
    //
    customer_table_args.data_sql = gen_sql(data_sql_args);
    customer_table_args.meta_sql = gen_sql(meta_sql_args);
    //
    // creating table argument object   
    customer_table_args.table_output_id = 'table-div';
    customer_table_args.table_id = 'sales_customer_table';
    customer_table_args.table_class = 'emp_data_table';
    customer_table_args.row_id_prefix = 'customer-row-';
    customer_table_args.table_data_cell_class = 'emp-data-td';  
    customer_table_args.page_nav_div_id = 'customer-table-page-nav';
    customer_table_args.page_nav_class = 'page_nav';
    customer_table_args.page_nav_id_prefix = 'customer';
    customer_table_args.page_class_str = 'page_nav_link';
    customer_table_args.page = page;
    customer_table_args.num_per_page = 15;
    customer_table_args.tot_pages_shown = 9;
    customer_table_args.page_onmouse_str = '';
    customer_table_args.page_onclick = 'create_customer_table(%%,%sort_col%,%sort_dir%)';
    customer_table_args.head_row_class_str = 'emp-data-header';
    customer_table_args.sort_col = sort_col;
    customer_table_args.sort_dir = sort_dir;
    customer_table_args.sort_onclick = 'create_customer_table(%%,%column_name%,%sort_dir%)';
    customer_table_args.row_onclick = "modify_customer_form('%customer_internal_id%','%row_id%')";
    customer_table_args.row_onmouseenter = "add_class('emp_data_tr-highlight','%row_id%')"; 
    customer_table_args.row_onmouseleave = "remove_class('emp_data_tr-highlight','%row_id%')";  
    //
    create_sortable_table(customer_table_args);
}
//
// sets the page to modify a rep's information
function modify_rep_form(dbuser_internal_id,row_id) {
    //
    // creating header 
    name = ''
    if (row_id != '') {
        var name = document.getElementById(row_id+'-rep_name').innerHTML;
        document.getElementById('modify-header').innerHTML = "Modfiying User: "+name;
    }
    else {
        document.getElementById('modify-header').innerHTML = "Modfiying User:";
    }
    //
    // creating form
    create_form('sales_rep_form','content-div');
    document.getElementById('rep-id').disabled = true;
    //
    // adding new buttons
    var form = document.getElementById('sales-rep-form');
    var form_elements = Array(
            //
            {'elm' : 'button', 'id' : 'mod-rep', 'type' : 'button', 'textNode' : 'Modify Rep', 'events' : [{'event' : 'click', 'function' : function() {init_rep_form_valiation('update');}}]},
            {'elm' : 'span','textNode' : '\u00A0\u00A0'},
            //
            {'elm' : 'button', 'id' : 'delete-rep', 'type' : 'button', 'textNode' : 'Delete Rep', 'events' : [{'event' : 'click', 'function' : function() {init_rep_form_valiation('delete');}}]},
            {'elm' : 'span','textNode' : '\u00A0\u00A0'},
            //
            {'elm' : 'button', 'id' : 'restore-rep', 'type' : 'button', 'textNode' : 'Restore Rep', 'events' : [{'event' : 'click', 'function' : function() {init_rep_form_valiation('restore');}}]}
        );
    addChildren(form,form_elements)
    form.removeChild(document.getElementById('submit-rep-form'));
    //
    // callback function to determine what buttons to show or hide based on dbuser status
    var button_fun = function() {
        // 
        if (document.getElementById('dbuser-status').value == 'active') { add_class('hidden-elm','restore-rep');}
        else { add_class('hidden-elm','delete-rep');}
        //
        document.getElementById('password').value = '';
    }
    // populating form from the dbuser table
    var populate_form_args = {};
    populate_form_args.table = 'dbUsers';
    populate_form_args.unique_col = 'dbuser_internal_id';
    populate_form_args.unique_data = dbuser_internal_id;
    populate_form_args.form_id = 'sales-rep-form';
    populate_form_args.trigger_events = false;
    populate_form_args.add_callback_funs = button_fun; 
    populate_form(populate_form_args);
    // populating form based on department specific table
    populate_form_args = {};
    populate_form_args.table = 'sales_rep_table';
    populate_form_args.unique_col = 'dbuser_internal_id';
    populate_form_args.unique_data = dbuser_internal_id;
    populate_form_args.form_id = 'sales-rep-form';
    populate_form_args.trigger_events = false; //this is set to false to prevent an obscene number of rapid AJAX calls
    populate_form(populate_form_args);
}
//
// sets the page to modify a rep's information
function modify_customer_form(customer_internal_id,row_id) {
    //
    // creating header 
    name = ''
    if (row_id != '') {
        var name = document.getElementById(row_id+'-customer_name').innerHTML;
        document.getElementById('modify-header').innerHTML = "Modfiying Customer: "+name;
    }
    else {
        document.getElementById('modify-header').innerHTML = "Modfiying Customer:";
    }
    //
    // creating form
    create_form('sales_customer_form','content-div');
    document.getElementById('customer-id').disabled = true;
    //
    // adding new buttons
    var form = document.getElementById('sales-customer-form');
    var form_elements = Array(
            //
            {'elm' : 'button', 'id' : 'mod-customer', 'type' : 'button', 'textNode' : 'Modify Customer', 'events' : [{'event' : 'click', 'function' : function() {init_customer_form_valiation('update');}}]},
            {'elm' : 'span','textNode' : '\u00A0\u00A0'},
            //
            {'elm' : 'button', 'id' : 'delete-customer', 'type' : 'button', 'textNode' : 'Delete Customer', 'events' : [{'event' : 'click', 'function' : function() {init_customer_form_valiation('delete');}}]},
            {'elm' : 'span','textNode' : '\u00A0\u00A0'},
            //
            {'elm' : 'button', 'id' : 'restore-customer', 'type' : 'button', 'textNode' : 'Restore Customer', 'events' : [{'event' : 'click', 'function' : function() {init_customer_form_valiation('restore');}}]}
        );
    addChildren(form,form_elements)
    form.removeChild(document.getElementById('submit-customer-form'));
    //
    // callback function to determine what buttons to show or hide based on dbuser status
    var button_fun = function() {
        // 
        if (document.getElementById('customer-status').value != 'inactive') { add_class('hidden-elm','restore-customer');}
        else if (document.getElementById('customer-status').value == 'inactive') { add_class('hidden-elm','delete-customer');}
    }
    //
    // nesting this in a callback so populate form can never execute before dropboxes are populated
    var callback = function() {
        // populating form from customer table
        var populate_form_args = {};
        populate_form_args.table = 'sales_customer_table';
        populate_form_args.unique_col = 'customer_internal_id';
        populate_form_args.unique_data = customer_internal_id;
        populate_form_args.form_id = 'sales-customer-form';
        populate_form_args.trigger_events = false;
        populate_form_args.add_callback_funs = button_fun; 
        populate_form(populate_form_args)
    }
    //
    // populating rep dropbox
    var add_args = {
        'format_str'   : '%rep_id% - %rep_name%',
        'add_callback' : callback

    };
    populate_dropbox_options('rep-id','sales_rep_table','rep_id','rep_name','Rep ID - Rep Name',add_args)
}
//
// this starts off the sales rep form validation
function init_rep_form_valiation(action) {
    var basic_val_error = false;
    var skip_str = 'dbuser-last-name,comments,dbuser-internal-id';
    //
    // checking form for empty fields
    if (action != 'create') { skip_str += ',password,conf-password'}
    basic_val_error = basic_validate('sales-rep-form',skip_str);
    //
    if (basic_val_error) { remove_class('hidden-elm','form-errors');}
    else { add_class('hidden-elm','form-errors');}
    //
    // getting all form values
    document.getElementById('rep-id').disabled = false;
    var name_val_obj = get_all_form_values('sales-rep-form','');
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
    var all_inputs = document.getElementById('sales-rep-form').getElementsByTagName("*");
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
    // testing uniqueness of id and username
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
    submit_sales_rep_form(args);
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
        //
        if (name_val_obj['password'] == '') { delete name_val_obj['password']}
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
//
// this function starts off the sales customer form validation
function init_customer_form_valiation(action) {
    var basic_val_error = false;
    var skip_str = 'comments,customer-status,customer-internal-id';
    //
    // checking form for empty fields
    basic_val_error = basic_validate('sales-customer-form',skip_str);
    if (basic_val_error) { remove_class('hidden-elm','form-errors');}
    else { add_class('hidden-elm','form-errors');}
    //
    // getting all form values
    document.getElementById('customer-id').disabled = false;
    var name_val_obj = get_all_form_values('sales-customer-form','');
    if (action != 'create') { document.getElementById('customer-id').disabled = true;}
    if (name_val_obj['customer_id']   == '') { return;}
    //
    // fetching stuff from DB
    var customer_id_sql   = "SELECT `customer_id`,`customer_internal_id` FROM `sales_customer_table` WHERE `customer_id` LIKE '"+name_val_obj['customer_id']+"'";
    var callback = function(response) {
        var args = {
            'action'          : action,
            'basic_val_error' : basic_val_error,
            'name_val_obj'    : name_val_obj,
            'response'        : response
        };
        customer_form_valiation(args);
    }
    //
    ajax_multi_fetch([customer_id_sql],['customer_id_test'],callback);
}
//
// this finishes form validation after the database query
function customer_form_valiation(args) {
    //
    var action = args.action;
    var customer_id_test = args.response['customer_id_test'];
    var name_val_obj = args.name_val_obj;
    var all_inputs = document.getElementById('sales-customer-form').getElementsByTagName("*");
    //
    var error = false;
    var basic_val_error = args.basic_val_error;
    var customer_id_uni_error = false;
    //
    // testing uniqueness of id and username
    if (customer_id_test.length > 0) {
        if (customer_id_test[0]['customer_internal_id'] != name_val_obj['customer_internal_id']) { customer_id_uni_error = true;}
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
    if (customer_id_uni_error) { error = true; add_class('invalid-field','customer-id'); remove_class('hidden-elm','customer-id-uni-err');}
    else { remove_class('invalid-field','customer-id'); add_class('hidden-elm','customer-id-uni-err');}
    //
    if (error) { remove_class('hidden-elm','form-errors'); return;}
    else { add_class('hidden-elm','form-errors');}
    //
    // defining action based values
    var confirm_message = '';
    var cont = false;
    if (action == 'create') {
        confirm_message = 'Confirm creation of Customer: '+name_val_obj['customer_id']+' '+name_val_obj['customer_name'];
        args.return_message  = 'Sucessfully created Customer: '+name_val_obj['customer_id']+' '+name_val_obj['customer_name'];
    }
    else if (action == 'update') {
        confirm_message = 'Confirm modifcation of Customer: '+name_val_obj['customer_id']+' '+name_val_obj['customer_name'];
        args.return_message  = 'Sucessfully modified Customer: '+name_val_obj['customer_id']+' '+name_val_obj['customer_name'];
    }
    else if (action == 'delete') {
        confirm_message = 'Confirm deletion of Customer: '+name_val_obj['customer_id']+' '+name_val_obj['customer_name'];
        args.return_message  = 'Sucessfully deleted Customer: '+name_val_obj['customer_id']+' '+name_val_obj['customer_name'];
        //
        name_val_obj['customer_status'] = 'inactive';
    }
    else if (action == 'restore') {
        confirm_message = 'Confirm restoration of Customer: '+name_val_obj['customer_id']+' '+name_val_obj['customer_name'];
        args.return_message  = 'Sucessfully restored Customer: '+name_val_obj['customer_id']+' '+name_val_obj['customer_name'];
        //
        name_val_obj['customer_status'] = 'active';
    }
    //
    cont = confirm(confirm_message);
    if (!(cont)) {return;}
    //
    submit_sales_customer_form(args);
}
//
// this submits the sales customer form
function submit_sales_customer_form(args) {
    //
    var name_val_obj = args.name_val_obj;
    var action = args.action;
    var callback = '';
    var sql_args  = {'table' : 'sales_customer_table'};
    //
    // creating the two callback functions  
    var insert_callback = function() {
        create_form('sales_customer_form','content-div');
        alert(args.return_message);
    }
    var update_callback = function() {
        var curr_page = document.getElementById('customer-table-page-nav').dataset.currPage;
        var sort_col  = document.getElementById('customer-table-page-nav').dataset.sortCol;
        var sort_dir  = document.getElementById('customer-table-page-nav').dataset.sortDir;
        create_customer_table(curr_page,sort_col,sort_dir);
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
        sql_args.cmd = "UPDATE";
        sql_args.where = [['customer_internal_id','LIKE',name_val_obj['customer_internal_id']]];
        //
        delete name_val_obj['customer_internal_id'];
    }
    else {
        callback = insert_callback;
        sql_args.cmd = "INSERT";
        //
        delete name_val_obj['customer_internal_id'];
    }
    //
    sql_args.cols = [];
    sql_args.vals = [];
    for (var name in name_val_obj) {
        sql_args.cols.push(name);
        sql_args.vals.push(name_val_obj[name]);
    }
    //
    var sql = gen_sql(sql_args);
    ajax_exec_db(sql,callback);
}