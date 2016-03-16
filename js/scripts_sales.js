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
        if (childNodes[i].nodeType == 1) {childNodes[i].removeAll();}
    }
}
//
// this sets up the page for rep creation
function new_rep() {
    //
    // clearing elements inside main-container div
    var childNodes = document.getElementById('main-container').childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].nodeType == 1) {childNodes[i].removeAll();}
    }
    //
    document.getElementById('modify-header').textContent = 'Creating a New Sales Rep';
    create_form('sales_rep_form','content-div');
}
// 
// this sets up the page for rep modification
function mod_rep() {
    //
    // clearing elements inside main-container div
    var childNodes = document.getElementById('main-container').childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].nodeType == 1) {childNodes[i].removeAll();}
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
        if (childNodes[i].nodeType == 1) {childNodes[i].removeAll();}
    }
    //
    document.getElementById('modify-header').textContent = 'Creating a New Customer';
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
        if (childNodes[i].nodeType == 1) {childNodes[i].removeAll();}
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
// this function sets up the page for a sales rep report
function rep_report() {
    //
    // clearing elements inside main-container div
    var childNodes = document.getElementById('main-container').childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].nodeType == 1) {childNodes[i].removeAll();}
    }
    //
    // setting up report inputs
    var update_fun = function(){ show_update_button('create-rep-report','sales-rep-report','Show Changes');};
    var update_fun_str = "show_update_button('create-rep-report','sales-rep-report','Show Changes');"
    var fieldset = document.createElement('FIELDSET');
    var legend = document.createElement('LEGEND');
    fieldset.id = 'report-inputs';
    fieldset.className = 'fieldset-default';
    legend.appendChild(document.createTextNode('Report Parameters'));
    document.getElementById('input-div').appendChild(fieldset);
    //
    var input_args = {
        output_id : 'report-inputs',
        time_range_onchange : update_fun_str,
        day_onkeyup : update_fun_str,
        month_onchange : update_fun_str,
        year_onchange  : update_fun_str
    };
    create_time_range_inputs(input_args);
    fieldset.insertBefore(legend,fieldset.childNodes[0]);
    //
    var elements = Array(
        {'elm' : 'br'},
        {'elm' : 'br'},
        //
        {'elm' : 'label', 'className' : 'label', 'textNode' : 'Report Type:'},
        //
        {'elm' : 'br'},
        {'elm' : 'label', 'className' : 'label-4em', 'textNode' : 'Detailed:'},
        {'elm' : 'input', 'id' : 'report-type-detailed', 'type' : 'radio', 'name' : 'report-type', 'value' : 'detailed', 'checked' : true, 'events' : [{'event' : 'change', 'function' : update_fun}]},
        //
        {'elm' : 'span','textNode' : '\u00A0\u00A0\u00A0\u00A0'},
        {'elm' : 'label', 'className' : 'label-4em', 'textNode' : 'Summary:'},
        {'elm' : 'input', 'id' : 'report-type-summary', 'type' : 'radio', 'name' : 'report-type', 'value' : 'summary', 'events' : [{'event' : 'change', 'function' : update_fun}]},
        //
        {'elm' : 'span','textNode' : '\u00A0\u00A0\u00A0\u00A0'},
        {'elm' : 'label', 'className' : 'label-5em', 'textNode' : 'No Totals:'},
        {'elm' : 'input', 'id' : 'report-type-noTotals', 'type' : 'radio', 'name' : 'report-type', 'value' : 'nototals', 'events' : [{'event' : 'change', 'function' : update_fun}]},
        //
        {'elm' : 'br'},
        {'elm' : 'br'},
        //
        {'elm' : 'label', 'className' : 'label', 'textNode' : 'Sales Reps to Show:'},
        {'elm' : 'select', 'id' : 'rep-status', 'className' : 'dropbox-input', 'name' : 'rep-status' , 'events' : [{'event' : 'change', 'function' : function(){ show_update_button('create-rep-report','sales-rep-report','Show Changes');}}]},        
        //
        {'elm' : 'br'},
        //
        {'elm' : 'label', 'className' : 'label', 'textNode' : 'Preset Report Options:'},
        {'elm' : 'select', 'id' : 'preset-report', 'className' : 'dropbox-input', 'name' : 'preset-report' , 'events' : [{'event' : 'change', 'function' : function(){ show_update_button('create-rep-report','sales-rep-report','Show Changes'); remove_class('hidden-elm','sel-cols-div'); rep_report_data_columns('sel-cols-div','show-data-sel-cols',false,true);}}]},
        //
        {'elm' : 'br'},
        {'elm' : 'br'},
        //
        {'elm' : 'label', 'className' : 'label', 'textNode' : 'Sorting Column:'},
        {'elm' : 'select', 'id' : 'sort-column', 'className' : 'dropbox-input', 'name' : 'sort-column', 'events' : [{'event' : 'change', 'function' : update_fun}]},
        {'elm' : 'span','textNode' : '\u00A0\u00A0\u00A0\u00A0'},
        {'elm' : 'label', 'className' : 'label', 'textNode' : 'Sorting Direction:'},
        {'elm' : 'select', 'id' : 'sort-direction', 'className' : 'dropbox-input', 'name' : 'sort-direction', 'events' : [{'event' : 'change', 'function' : update_fun}]}
        );
    addChildren(fieldset,elements);
    //
    elements = Array(
        {'elm' : 'option', 'textNode' : 'Active', 'value' : 'active'},
        {'elm' : 'option', 'textNode' : 'All', 'value' : '.+'},
        {'elm' : 'option', 'textNode' : 'Inactive', 'value' : 'inactive'}
        );
    addChildren(document.getElementById('rep-status'),elements);
    //
    elements = Array(
        {'elm' : 'option', 'textNode' : 'Ascending', 'value' : 'ASC'},
        {'elm' : 'option', 'textNode' : 'Descending', 'value' : 'DESC'}
        );
    addChildren(document.getElementById('sort-direction'),elements);
    //
    // creating the required buttons and selection cols div
    elements = Array(
        {'elm' : 'br'},
        //
        {'elm' : 'button', 'id' : 'show-data-sel-cols', 'textNode' : 'Show Data Selection Columns', 'events' : [{'event' : 'click', 'function' : function(){ rep_report_data_columns('sel-cols-div','show-data-sel-cols',true,true);}}]},
        //
        {'elm' : 'button', 'id' : 'create-rep-table', 'textNode' : 'Show Sales Rep Table', 'events' : [{'event' : 'click', 'function' : function(){ report_rep_table(1,'rep_id','ASC',true);}}]},
        //
        {'elm' : 'button', 'id' : 'create-rep-report', 'textNode' : 'Create Report', 'events' : [{'event' : 'click', 'function' : function(){ create_rep_report('.+');}}]},
        //
        {'elm' : 'button', 'id' : 'create-all-rep-report', 'textNode' : 'Create All Rep Report', 'className' : 'hidden-elm', 'events' : [{'event' : 'click', 'function' : function(){ create_rep_report('.+'); add_class('hidden-elm',this.id);}}]},
        //
        {'elm' : 'button', 'id' : 'print-rep-report', 'textNode' : 'Print', 'events' : [{'event' : 'click', 'function' : function(){ print_page('content-div');}}]},
        //
        {'elm' : 'div', 'id' : 'sel-cols-div', 'className' : 'hidden-elm'}
        );
    addChildren(document.getElementById('input-div'),elements);
    //
    // adding temporary hidden table
    var table = document.createElementWithAttr('TABLE',{'id':'sales-rep-report','class':'hidden-elm'});
    document.getElementById('content-div').appendChild(table);
    //
    // populating dropboxes
    var dropbox_args = {
        sql_where : [['report_type','REGEXP','(^|%)sales(%|$)']]
    };
    populate_dropbox_options('preset-report','report_presets','preset_index','preset_name','',dropbox_args);
    dropbox_args = {
        sql_args : {
            where : [['column_type','REGEXP','(^|%)static(%|$)'],['in_tables','REGEXP','(^|%)sales_rep_data(%|$)'],['use_on_pages','REGEXP','(^|%)sales_reporting(%|$)'],['use_in_html_tables','REGEXP','(^|%)sales_rep_report(%|$)']],
            order_by : [['order_index','ASC']]
        },
        value_format : 'sales_rep_data.%column_name%'
    };
    populate_dropbox_options('sort-column','table_meta_data','column_name','column_nickname','',dropbox_args);
}
//
// this function sets up the page for a customer report
function customer_report() {
    //
    // clearing elements inside main-container div
    var childNodes = document.getElementById('main-container').childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].nodeType == 1) {childNodes[i].removeAll();}
    }
    alert('WIP')
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
    meta_sql_args.order_by = [['order_index','ASC']]
    
    rep_table_args.data_sql = "SELECT * FROM sales_rep_table INNER JOIN dbUsers ON sales_rep_table.dbuser_internal_id=dbUsers.dbuser_internal_id "+where+" ORDER BY sales_rep_table."+sort_col+" "+sort_dir;
    rep_table_args.meta_sql = gen_sql(meta_sql_args);
    //
    // creating table argument object   
    rep_table_args.table_output_id = 'table-div';
    rep_table_args.table_id = 'sales_rep_table';
    rep_table_args.table_class = 'default-table';
    rep_table_args.row_id_prefix = 'rep-row-';
    rep_table_args.table_data_cell_class = 'default-table-td';  
    rep_table_args.row_onclick = "modify_rep_form('%dbuser_internal_id%','%row_id%')";
    rep_table_args.row_onmouseenter = "add_class('default-table-row-highlight','%row_id%')"; 
    rep_table_args.row_onmouseleave = "remove_class('default-table-row-highlight','%row_id%')"; 
    rep_table_args.head_row_args = {
        'sortable' : true,
        'sort_col' : sort_col,
        'sort_dir' : sort_dir,
        'sort_onclick_str' : "create_rep_table(%%,'%column_name%','%sort_dir%')"
    }; 
    rep_table_args.page_nav_args = {
        'curr_page' : page,
        'sort_col' : sort_col,
        'sort_dir' : sort_dir,
        'tot_pages_shown' : 9,
        'num_per_page' : 15,
        'page_nav_div_id' : 'rep-table-page-nav',
        'id_prefix' : 'rep',
        'page_nav_class' : 'page_nav',
        'class_str' : 'page_nav_link',
        'onclick_str' : "create_rep_table(%%,'"+sort_col+"','"+sort_dir+"');",
        'onmouse_str' : ''
    };
    //
    create_standard_table(rep_table_args);
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
    meta_sql_args.order_by = [['order_index','ASC']]
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
    data_sql_args.order_by = [[sort_col,sort_dir]];
    //
    customer_table_args.data_sql = gen_sql(data_sql_args);
    customer_table_args.meta_sql = gen_sql(meta_sql_args);
    //
    // creating table argument object   
    customer_table_args.table_output_id = 'table-div';
    customer_table_args.table_id = 'sales_customer_table';
    customer_table_args.table_class = 'default-table';
    customer_table_args.row_id_prefix = 'customer-row-';
    customer_table_args.table_data_cell_class = 'default-table-td';  
    customer_table_args.row_onclick = "modify_customer_form('%customer_internal_id%','%row_id%')";
    customer_table_args.row_onmouseenter = "add_class('default-table-row-highlight','%row_id%')"; 
    customer_table_args.row_onmouseleave = "remove_class('default-table-row-highlight','%row_id%')";
    customer_table_args.head_row_args = {
        'sortable' : true,
        'sort_col' : sort_col,
        'sort_dir' : sort_dir,
        'sort_onclick_str' : "create_customer_table(%%,'%column_name%','%sort_dir%')"
    }; 
    customer_table_args.page_nav_args = {
        'curr_page' : page,
        'sort_col' : sort_col,
        'sort_dir' : sort_dir,
        'tot_pages_shown' : 9,
        'num_per_page' : 15,
        'page_nav_div_id' : 'customer-table-page-nav',
        'id_prefix' : 'customer',
        'page_nav_class' : 'page_nav',
        'class_str' : 'page_nav_link',
        'onclick_str' : "create_customer_table(%%,'"+sort_col+"','"+sort_dir+"');",
        'onmouse_str' : ''
    };  
    //
    create_standard_table(customer_table_args);
}
//
// sets the page to modify a rep's information
function modify_rep_form(dbuser_internal_id,row_id) {
    //
    // creating header 
    name = ''
    if (row_id != '') {
        var name = document.getElementById(row_id+'-rep_name').innerHTML;
        document.getElementById('modify-header').textContent = 'Modfiying User: '+name;
    }
    else {
        document.getElementById('modify-header').textContent = 'Modfiying User:';
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
        document.getElementById('modify-header').textContent = 'Modfiying Customer: '+name;
    }
    else {
        document.getElementById('modify-header').textContent = 'Modfiying Customer:';
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
    ajax_fetch([meta_sql,rep_id_sql,username_sql],['meta_data','rep_id_test','username_test'],callback);
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
        document.getElementById('modify-header').removeAll();
        document.getElementById('content-div').removeAll();
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
    var sql_arr = [];
    if (!!(user_sql)) sql_arr.push(user_sql);
    if (!!(rep_sql))  sql_arr.push(rep_sql);
    //
    exec_transaction(sql_arr,callback);
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
    ajax_fetch([customer_id_sql],['customer_id_test'],callback);
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
        document.getElementById('modify-header').removeAll();
        document.getElementById('content-div').removeAll();
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
//
//
function report_rep_table(page,sort_col,sort_dir,toggle) {   
    //
    // initializating argument objects
    var rep_table_args = {};
    var data_sql_args = {};
    var meta_sql_args = {};
    //
    var status = document.getElementById('rep-status').value;
    //
    // creating sql statements
    meta_sql_args.cmd = 'SELECT';
    meta_sql_args.table = 'table_meta_data';
    meta_sql_args.where = [['in_tables','REGEXP','(^|%)sales_rep_table(%|$)|(^|%)dbusers(%|$)'],['use_on_pages','REGEXP','sales_maintenance|sales_reporting'],['use_in_html_tables','REGEXP','sales_rep_table']];
    meta_sql_args.order_by = [['order_index','ASC']]
    
    rep_table_args.data_sql = "SELECT * FROM sales_rep_table INNER JOIN dbUsers ON sales_rep_table.dbuser_internal_id=dbUsers.dbuser_internal_id WHERE dbUsers.dbuser_status REGEXP '^"+status+"$' ORDER BY sales_rep_table."+sort_col+" "+sort_dir;
    rep_table_args.meta_sql = gen_sql(meta_sql_args);
    //
    // creating table argument object   
    rep_table_args.table_output_id = 'table-div';
    rep_table_args.table_id = 'sales-rep-table';
    rep_table_args.table_class = 'default-table';
    rep_table_args.row_id_prefix = 'rep-row-';
    rep_table_args.table_data_cell_class = 'default-table-td';  
    rep_table_args.row_onclick = "create_rep_report('%rep_id%')";
    rep_table_args.row_onmouseenter = "add_class('default-table-row-highlight','%row_id%')"; 
    rep_table_args.row_onmouseleave = "remove_class('default-table-row-highlight','%row_id%')"; 
    rep_table_args.head_row_args = {
        'sortable' : true,
        'sort_col' : sort_col,
        'sort_dir' : sort_dir,
        'sort_onclick_str' : "report_rep_table(%%,'%column_name%','%sort_dir%')"
    }; 
    rep_table_args.page_nav_args = {
        'curr_page' : page,
        'sort_col' : sort_col,
        'sort_dir' : sort_dir,
        'tot_pages_shown' : 9,
        'num_per_page' : 15,
        'page_nav_div_id' : 'rep-table-page-nav',
        'id_prefix' : 'rep',
        'page_nav_class' : 'page_nav',
        'class_str' : 'page_nav_link',
        'onclick_str' : "report_rep_table(%%,'"+sort_col+"','"+sort_dir+"',false);",
        'onmouse_str' : ''
    };
    //
    if (!(document.getElementById('rep-table-header'))) {
        var header = document.createElementWithAttr('H4',{'id':'rep-table-header'});
        header.appendChild(document.createTextNode('Click on a sales rep to generate a report for them.'));
        document.getElementById('table-div').appendChild(header);
        //
        create_standard_table(rep_table_args);
    }
    //
    if (toggle == true) {
        toggle_view_element_button('create-rep-table','table-div','Hide Sales Rep Table','Show Sales Rep Table');
        //
        if (document.getElementById('table-div').className.match('hidden-elm')) {
            remove_class('hidden-elm','create-all-rep-report');
        }
        else {
            add_class('hidden-elm','create-rep-report');
        }
    }
    else {
        //
        create_standard_table(rep_table_args);
    }
}
//
// creates the data columns table for the report page
function rep_report_data_columns(out_id,button_id,toggle,reset) { 
    var meta_sql = '';
    var preset_sql = '';
    var preset = document.getElementById('preset-report').value;
    //
    var sql_args = {};
    sql_args.cmd = 'SELECT';
    sql_args.table = 'report_presets';
    sql_args.where = [['preset_index','LIKE',preset]]
    preset_sql = gen_sql(sql_args);
    //
    meta_sql = "SELECT * FROM `table_meta_data` WHERE `in_tables` REGEXP '(^|%)sales_rep_data(%|$)|(^|%)sales_rep_table(%|$)' ";
    meta_sql += "AND `use_on_pages` REGEXP 'sales_reporting' AND `use_in_html_tables` REGEXP 'sales_rep_report' ORDER BY `order_index` ASC"
    //
    // creating reset button and modifying show button
    if (!(document.getElementById('restore-data-col-defaults'))) {
        var reset_onclick = function() {
            rep_report_data_columns(out_id,button_id,false,true);
            show_update_button('create-rep-report','sales-rep-report','Show Changes');
            add_class('hidden-elm','restore-data-col-defaults');
        }
        var br = document.createElement('BR');
        var button = document.createElementWithAttr('button',{'id':'restore-data-col-defaults','type':'button','class':'hidden-elm'});
        var table = document.createElementWithAttr('TABLE',{'id':'data_sel_cols_table','class':'hidden-elm'});
        button.addTextNode('Restore Defaults');
        button.addEventListener('click',reset_onclick);
        document.getElementById(out_id).appendChild(br);
        document.getElementById(out_id).appendChild(button);
        document.getElementById(out_id).appendChild(br.cloneNode());
        document.getElementById(out_id).appendChild(table);
        //
        button = document.createElementWithAttr('button',{'id':button_id,'type':'button'});
        button.addEventListener('click',rep_report_data_columns.bind(null,'sel-cols-div', 'show-data-sel-cols', true, false));
        document.getElementById(button_id).parentNode.replaceChild(button,document.getElementById(button_id));
    }
    //
    // shows or hides the data column div
    if (toggle) { show_hide(out_id);}
    //
    if (document.getElementById(out_id).className.match(/hidden/i)) {
        document.getElementById(button_id).textContent = 'Show Data Selection Columns';
    }
    else {
        document.getElementById(button_id).textContent = 'Hide Data Selection Columns';
    }
    //
    var callback = function(response) {
        var args = {};
        args.data = response.meta_data;
        args.preset_data = response.preset_data[0];
        args.hide_sort_row = true;
        args.hide_totals_row = true;
        args.all_onclick_fun = "show_update_button('create-rep-report','sales-rep-report','Show Changes'); remove_class('hidden-elm','restore-data-col-defaults');";
        document.getElementById(out_id).removeChild(document.getElementById('data_sel_cols_table'));
        make_data_columns_table(document.getElementById(out_id),args);
    }
    //
    if (reset) {
        ajax_fetch([meta_sql,preset_sql],['meta_data','preset_data'],callback);
    }
}
//
// this creates the rep report 
function create_rep_report(rep_id) {
    //
    var name_val_obj = get_all_form_values('report-inputs','');
    var ts_obj = to_and_from_timestamps();
    //
    // making new create report button to allow button to properly update the report
    var new_btn = document.createElement('BUTTON');
    new_btn.appendChild(document.createTextNode('Create All Rep Report'));
    new_btn.id = 'create-rep-report';
    new_btn.className = 'hidden-elm';
    new_btn.addEventListener("click",function(){ 
        create_rep_report(rep_id);
    });
    document.getElementById('create-rep-report').parentNode.replaceChild(new_btn,document.getElementById('create-rep-report'));
    //
    // getting report args from form
    var report_args = {};
    report_args.name_val_obj = name_val_obj;
    report_args.rep_id = rep_id;
    report_args.preset = name_val_obj['preset-report'];
    report_args.sort_col = name_val_obj['sort-column'];
    report_args.sort_dir = name_val_obj['sort-direction'];
    report_args.report_type = name_val_obj['report-type'];
    //
    var sel_cols = false;
    if (!!(document.getElementById('data_sel_cols_table'))) {
        sel_cols = [];
        var all_children = document.getElementById('data_sel_cols_table').getElementsByTagName("*");
        for (var i = 0; i < all_children.length; i++) {
            if (all_children[i].nodeType != 1) {continue;}
            if (all_children[i].nodeName.toUpperCase() != 'INPUT') {continue;}
            if (all_children[i].disabled == true) {continue;}
            if (all_children[i].checked == false) {continue;}
            //
            if (all_children[i].id.match('-viewcol-')) { sel_cols.push(all_children[i].value);}
        }
    }
    report_args.sel_cols = sel_cols;
    //
    // setting up SQL statement to query REP table to determine the most recent AR date
    var sql_args = {
        'cmd' : 'SELECT',
        'table' : 'sales_rep_data',
        'cols' : ['date'],
        'where' : [['date', '<=',ts_obj.to_ts]],
        'order_by' : [['date','DESC']],
        'limit' : [0,1]
    };
    var sql = gen_sql(sql_args);
    //
    var callback = function(response) {
        if (!(response[0][0])) {
            table = document.createElementWithAttr('TABLE',{'id' : 'sales-rep-report'});
            h3 = document.createElement('H3');
            h3.addTextNode('No available data')
            table.appendChild(h3);
            document.getElementById('content-div').removeAll();
            document.getElementById('content-div').appendChild(table); 
            return;
        }
        report_args.end_date = response[0][0]['date'];
        rep_report_get_data(report_args);
    }
    //
    ajax_fetch([sql],[0],callback);
}
//
// this function uses the inputs from the previous function to fetch the required data 
function rep_report_get_data(args) {
    //
    // determining start and end dates for YTD and LYTD totals
    var date_arr = args.end_date.split('-');
    for (var i = 0; i < date_arr.length; i++) {date_arr[i] = Number(date_arr[i]);}
    var curr_date = args.end_date;
    var date = new Date(date_arr[0],date_arr[1]-1,date_arr[2]);
    var lyd = new Date(date.getFullYear(),date.getMonth(),date.getDate()-7*52);
    var last_year_date = lyd.yyyymmdd();
    //
    // setting up sql statements 
    var LYTD_sql = '';
    var YTD_sql  = '';
    var rep_data_sql = '';
    var sql_args = {};
    sql_args.cmd = 'SELECT';
    sql_args.table = 'sales_data';
    sql_args.cols = ['sales_rep_table.rep_id', 'SUM(sales_data.amount) lytd_total'];
    sql_args.inner_join = [['sales_customer_table','sales_data.customer_id','sales_customer_table.customer_id']];
    sql_args.inner_join.push(['sales_rep_table','sales_customer_table.rep_id','sales_rep_table.rep_id']);
    sql_args.where = [['sales_data.date','BETWEEN',CONSTANTS.LY_FIRST_BUSINESS_DAY.join('-')+"' AND '"+last_year_date]];
    sql_args.group_by = 'sales_rep_table.rep_id';
    LYTD_sql = gen_sql(sql_args);
    //
    sql_args.cols = ['sales_rep_table.rep_id', 'SUM(sales_data.amount) ytd_total'];
    sql_args.where = [['sales_data.date','BETWEEN',CONSTANTS.FIRST_BUSINESS_DAY.join('-')+"' AND '"+curr_date]];
    YTD_sql = gen_sql(sql_args);
    //
    sql_args = {
        'cmd' : 'SELECT',
        'table' : 'sales_rep_data',
        'inner_join' : [['sales_rep_table','sales_rep_data.rep_id','sales_rep_table.rep_id'],
                        ['dbUsers','sales_rep_table.dbuser_internal_id','dbUsers.dbuser_internal_id']]
    };
    var rep_data_sql = 'SELECT * FROM sales_rep_data INNER JOIN sales_rep_table ON sales_rep_data.rep_id = sales_rep_table.rep_id ';
    rep_data_sql += 'INNER JOIN dbUsers ON sales_rep_table.dbuser_internal_id = dbUsers.dbuser_internal_id ';
    rep_data_sql += "WHERE sales_rep_data.date LIKE '"+curr_date+"' AND sales_rep_data.rep_id REGEXP '^\s*"+args.rep_id+"\s*$' AND dbUsers.dbuser_status REGEXP '^"+args.name_val_obj['rep-status']+"$' "
    rep_data_sql += 'ORDER BY '+args.sort_col+' '+args.sort_dir;
    //
    var dyn_cols_sql = "SELECT * FROM `report_dynamic_columns` WHERE `department` REGEXP '(^|%)sales_rep(%|$)'";
    //
    var meta_args = {
        'cmd'   : 'SELECT',
        'table' : 'table_meta_data',
        'where' : [['in_tables','REGEXP','(^|%)sales_rep_data(%|$)|(^|%)sales_rep_table(%|$)'],
                   ['use_on_pages','REGEXP','(^|%)sales_reporting(%|$)'],
                   ['use_in_html_tables','REGEXP','(^|%)sales_rep_report(%|$)']],
        'order_by' : [['order_index','ASC']]
    };
    if (args.sel_cols) { meta_args.where.push(['column_name','REGEXP',args.sel_cols.join('$|')+'$']);}
    var meta_sql = gen_sql(meta_args);
    //
    // defining callback function
    var callback = function(response) {
        args.lytd_data = response['LYTD_data'];
        args.ytd_data  = response['YTD_data'];
        args.rep_data  = response['rep_data'];
        args.meta_data = response['meta_data'];
        args.dynamic_cols  = response['dynamic_cols'];
        //
        rep_report_process_data(args);
    }
    //
    var sql_arr =  [LYTD_sql,YTD_sql,rep_data_sql,meta_sql,dyn_cols_sql];
    var name_arr = ['LYTD_data','YTD_data','rep_data','meta_data','dynamic_cols'];
    ajax_fetch(sql_arr,name_arr,callback);
}
//
// this function pre-processes the data for the table
// and then passes the data array off to create_table function
function rep_report_process_data(args) {
    var meta_data = args.meta_data;
    var rep_data = args.rep_data;
    var lytd_data = args.lytd_data;
    var ytd_data = args.ytd_data;
    var dyn_col_arr = args.dynamic_cols;
    //
    // making lytd and ytd data an object keyd by rep id
    var lytd_obj = {};
    for (var i = 0; i < lytd_data.length; i++) {
        lytd_obj[lytd_data[i]['rep_id']] = lytd_data[i];
    }
    var ytd_obj = {};
    for (var i = 0; i < ytd_data.length; i++) {
        ytd_obj[ytd_data[i]['rep_id']] = ytd_data[i];
    }
    //
    // making dynamic cols an object keyed by column_name
    var dynamic_cols = {};
    for (var i = 0; i < dyn_col_arr.length; i++) {
        dynamic_cols[dyn_col_arr[i]['column_name']] = dyn_col_arr[i];
    }
    args.dynamic_cols = dynamic_cols;
    //
    // initializing rep data ytd and lytd totals
    for (var i = 0; i < rep_data.length; i++) {
        rep_data[i].lytd_total = 0.0;
        rep_data[i].ytd_total  = 0.0;
        //
        if (!!(lytd_obj[rep_data[i]['rep_id']])) { rep_data[i].lytd_total = lytd_obj[rep_data[i]['rep_id']]['lytd_total'];}
        if (!!(ytd_obj[rep_data[i]['rep_id']]))  { rep_data[i].ytd_total  = ytd_obj[rep_data[i]['rep_id']]['ytd_total'];}
    }
    //
    // handling report data precalculations
    args.called_funs = {};
    for (var col in dynamic_cols) {
        col = args.dynamic_cols[col];
        if (col.column_type != 'precalculate') { continue;}
        var col_funct = REPORT_FUNCTIONS[col.col_function]
        if (!(col_funct)) {console.log('Error: No function for column: '+col.column_name); continue;}
        col_funct(col.column_name,args);
    }
    //
    // calling final creation function
    build_rep_report(args);
}
//
// uses the data arrays to build the report itself
function build_rep_report(args) {
    //
    var table_args = {};
    //
    // creating table argument object   
    table_args.table_output_id = 'content-div';
    table_args.table_id = 'sales-rep-report';
    table_args.table_class = 'default-table';
    table_args.row_id_prefix = 'reports-row-';
    table_args.table_data_cell_class = 'default-table-td';  
    table_args.data_arr = args.rep_data;
    table_args.col_meta_data = args.meta_data;
    table_args.no_page_nav = true;
    table_args.page_nav_args = {};
    table_args.head_row_args = {
        head_row_class_str : 'default-table-header',
        class_str : 'default-table-header',
        sortable  : false
    };
    //
    var output_table = make_standard_table(table_args)
    document.getElementById(table_args.table_output_id).replaceChild(output_table,document.getElementById(output_table.id));
}