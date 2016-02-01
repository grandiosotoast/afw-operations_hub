////////////////////////////////////////////////////////////////////////////////
//////////  This file holds specific use functions                   ///////////
//////////  that feed variables to helper functions                  ///////////
////////////////////////////////////////////////////////////////////////////////
"use strict";
//
// this function creates the employee table for each of the data entry pages
function enter_data_emp_table(page,sort_col,sort_dir,department) {
    //
    // variable initializations
    var emp_table_args = {};
    var data_sql_args = {};
    var meta_sql_args = {};
    var row_onclick = "remove_class_all('selected-field'); add_class('selected-field','%row_id%'); get_data_entry_form('%emp_id%','"+department+"','data-entry-form-div',false)";
    //
    // sql argument objects
    data_sql_args.cmd = 'SELECT';
    data_sql_args.table = 'employee_info';
    data_sql_args.where = [['department','REGEXP',department]];
    data_sql_args.where.push(['emp_status','LIKE','active'])
    data_sql_args.orderBy = [[sort_col,sort_dir]];
    //
    meta_sql_args.cmd = 'SELECT';
    meta_sql_args.table = 'table_meta_data';
    meta_sql_args.where = [['in_tables','REGEXP','(^|%)employee_info(%|$)'],['use_on_pages','REGEXP','.'],['use_in_html_tables','REGEXP','employee_table']];
    meta_sql_args.orderBy = [['order_index','ASC']];
    emp_table_args.data_sql_args = data_sql_args;
    emp_table_args.meta_sql_args = meta_sql_args;
    //
    // creating table argument object   
    emp_table_args.table_output_id = 'employee-table-div';
    emp_table_args.table_id = 'employee_table';
    emp_table_args.table_class = 'default-table';
    emp_table_args.row_id_prefix = 'emp-row-';
    emp_table_args.table_data_cell_class = 'default-table-td';  
    emp_table_args.table_row_appended_cells = ''; //might make this into a checkbox that will be checked if data has been entered for that employee
    emp_table_args.page_nav_div_id = 'emp-table-page-nav';
    emp_table_args.page_nav_class = 'page_nav';
    emp_table_args.page_nav_id_prefix = 'emp';
    emp_table_args.page_class_str = 'page_nav_link';
    emp_table_args.page = page;
    emp_table_args.tot_pages_shown = 9;
    emp_table_args.page_onmouse_str = '';
    emp_table_args.page_onclick = "enter_data_emp_table(%%,%sort_col%,%sort_dir%,'"+department+"');";
    emp_table_args.head_row_class_str = 'default-table-header';
    emp_table_args.sort_col = sort_col;
    emp_table_args.sort_dir = sort_dir;
    emp_table_args.sort_onclick = "enter_data_emp_table(%%,%column_name%,%sort_dir%,'"+department+"');";
    emp_table_args.row_onclick = row_onclick;
    emp_table_args.row_onmouseenter = "add_class('default-table-row-highlight','%row_id%')"; 
    emp_table_args.row_onmouseleave = "remove_class('default-table-row-highlight','%row_id%')";
    //
    //
    create_standard_table(emp_table_args);
}
//
// this creates and populates the data form for the data entry pages 
function get_data_entry_form(emp_id,department,form_div_id,update) {  
    //
    // variable initializations
    var table = '';
    var data_form = '';
    var data_form_id = '';
    var pop_dropbox_fun = '';
    var populate_form_args = {};
    //
    // setting department dependent variables
    if (CONSTANTS.DEPT_TABLES.hasOwnProperty(department)) { table = CONSTANTS.DEPT_TABLES[department];}
    else { console.log(' Department has no set table: '+department); return;}
    if (CONSTANTS.DEPT_FORMS.hasOwnProperty(department)) { data_form = CONSTANTS.DEPT_FORMS[department];}
    else { console.log(' Department has no set form: '+department); return;}
    //
    create_form(data_form,form_div_id);
    var d = new Date();
    var day = d.getDate();
    var mon = d.getMonth()+1;
    if (day < 10) {day = '0'+day.toString();}
    if (mon < 10) {mon = '0'+mon.toString();}
    document.getElementById('date').value = d.getFullYear()+'-'+mon+'-'+day;
    document.getElementById('entering-user').value = document.getElementById('user-username').value
    document.getElementById('submit-data-button').addEventListener('click', function () {
        init_data_form_validation(department,'create');  
    });
    //
    // nesting this in a callback so populate form can never execute before dropboxes are populated
    var callback = function() {
        populate_form_args.table = 'employee_info';
        populate_form_args.unique_col = 'emp_id';
        populate_form_args.unique_data = emp_id;
        populate_form_args.skip_fields_str = 'comments';
        populate_form_args.form_id = 'input-emp-data';
        populate_form_args.add_callback_funs = '';
        populate_form(populate_form_args)
    }
    // defining add_args for error code dropbox
    var add_args = {
        place_holder_value : '0',
        place_holder_status : 'selected',
        add_opts_val : ['99'],
        add_opts_text : ['OTHER'],
        add_callback : callback
    };
    // populating dropboxes
    populate_dropbox_options('attendance-select','attendance','absence_value','absence_kind','','');
    populate_dropbox_options('error-code','error_codes','reason','description','NO ERRORS',add_args);
}
//
// this creates the driver frieght backhaul form
function get_backhaul_form(emp_id,form_div_id) {
    //
    // variable initializations
    var table = '';
    var data_form = '';
    var data_form_id = '';
    var pop_dropbox_fun = '';
    var populate_form_args = {};
    //
    create_form('backhaul_form',form_div_id);
    create_haul_fields('haul-info',0)
    var d = new Date();
    var day = d.getDate();
    var mon = d.getMonth()+1;
    if (day < 10) {day = '0'+day.toString();}
    if (mon < 10) {mon = '0'+mon.toString();}
    document.getElementById('date').value = d.getFullYear()+'-'+mon+'-'+day;
    document.getElementById('entering-user').value = document.getElementById('user-username').value
    //
    // handling buttons
    var sub_button = document.getElementById('submit-data-button')
    sub_button.addEventListener('click', function () {
        init_backhaul_form_validation('freight_backhaul','create');
    });
    var add_fieldset_button = document.createElement('BUTTON');
    add_fieldset_button.id = 'add-fieldset';
    add_fieldset_button.type = 'button';
    add_fieldset_button.innerHTML = 'Add another PO';
    add_fieldset_button.addEventListener('click', function () {
           var num = parseInt(document.getElementById('number-of-fields').value)+1;
           create_haul_fields('haul-info',num)
    });
    sub_button.parentNode.insertBefore(add_fieldset_button,sub_button);
    //
    // adding driver info
    populate_form_args.table = 'employee_info';
    populate_form_args.unique_col = 'emp_id';
    populate_form_args.unique_data = emp_id;
    populate_form_args.skip_fields_str = 'comments';
    populate_form_args.form_id = 'input-emp-data';
    populate_form_args.add_callback_funs = '';
    populate_form(populate_form_args)
}
//
// this creates the employee table for the view_employee page
function view_emp_table(page,sort_col,sort_dir) {
    //
    // creating argument objects
    var emp_table_args = {};
    var data_sql_args = {};
    var meta_sql_args = {};
    var department = '.'
    //
    // getting page elements
    emp_table_args.department = document.getElementById('department').value;
    emp_table_args.num_per_page = document.getElementById("emp-per-page").value;
    //
    if (!!(emp_table_args.department)) {
        department = emp_table_args.department;
        if (department == 'all') {department = '.';}
    }
    //
    data_sql_args.cmd = 'SELECT';
    data_sql_args.table = 'employee_info';
    data_sql_args.where = [['department','REGEXP',department]];
    data_sql_args.orderBy = [[sort_col,sort_dir]];
    if (!(emp_table_args.show_inactive)) {
        data_sql_args.where.push(['emp_status','LIKE','active'])
    }
    meta_sql_args.cmd = 'SELECT';
    meta_sql_args.table = 'table_meta_data';
    meta_sql_args.where = [['in_tables','REGEXP','(^|%)employee_info(%|$)'],['use_on_pages','REGEXP','.'],['use_in_html_tables','REGEXP','employee_table']];
    meta_sql_args.orderBy = [['order_index','ASC']]
    emp_table_args.data_sql_args = data_sql_args;
    emp_table_args.meta_sql_args = meta_sql_args;
    //
    // creating argument object   
    emp_table_args.table_output_id = 'employee-table-div';
    emp_table_args.table_id = 'employee_table';
    emp_table_args.table_class = 'default-table';
    emp_table_args.row_id_prefix = 'emp-row-';
    emp_table_args.table_data_cell_class = 'default-table-td';  
    emp_table_args.page_nav_div_id = 'emp-table-page-nav';
    emp_table_args.page_nav_class = 'page_nav';
    emp_table_args.page_nav_id_prefix = 'emp';
    emp_table_args.page_class_str = 'page_nav_link';
    emp_table_args.page = page;
    emp_table_args.tot_pages_shown = 9;
    emp_table_args.page_onmouse_str = '';
    emp_table_args.page_onclick = 'view_emp_table(%%,%sort_col%,%sort_dir%)';
    emp_table_args.head_row_class_str = 'default-table-header';
    emp_table_args.sort_col = sort_col;
    emp_table_args.sort_dir = sort_dir;
    emp_table_args.sort_onclick = 'view_emp_table(%%,%column_name%,%sort_dir%)';
    emp_table_args.row_onclick = "view_emp_data_table(1,'date','DESC','%emp_id%','%department%')";
    emp_table_args.row_onmouseenter = "add_class('default-table-row-highlight','%row_id%')"; 
    emp_table_args.row_onmouseleave = "remove_class('default-table-row-highlight','%row_id%')";  
    emp_table_args.add_callback = function(){store_session("emp_table_page,"+page+",emp_table_sort_col,"+sort_col+",emp_table_sort_dir,"+sort_dir);}
    //
    create_standard_table(emp_table_args);
}
//
// this function creates the data table for the view_employee page
function view_emp_data_table(page,sort_col,sort_dir,emp_id,department) {
    
    //
    // creating argument objects
    var data_table_args = {};
    var data_sql_args = {};
    var meta_sql_args = {};
    var ts_obj = {};
    //
    // getting page elements
    data_table_args.num_per_page = document.getElementById('res-per-page').value;
    // 
    // processing time range information
    ts_obj = to_and_from_timestamps();
    //
    // creating data and meta sql args
    data_sql_args.cmd = 'SELECT';
    data_sql_args.table = 'employee_data';
    data_sql_args.where = [['emp_id','REGEXP',emp_id],['date','BETWEEN',ts_obj.from_ts+"' AND '"+ts_obj.to_ts]];
    data_sql_args.orderBy = [[sort_col,sort_dir]];
    if (!(data_table_args.show_deleted)) {
        data_sql_args.where.push(['entry_status','LIKE','submitted'])
    }
    meta_sql_args.cmd = 'SELECT';
    meta_sql_args.table = 'table_meta_data';
    meta_sql_args.where = [['in_tables','REGEXP','(^|%)employee_data(%|$)']]; 
    meta_sql_args.orderBy = [['order_index','ASC']];    
    data_table_args.data_sql_args = data_sql_args;
    data_table_args.meta_sql_args = meta_sql_args;
    //
    // creating argument object
    data_table_args.table_output_id = 'view-emp-data-div';
    data_table_args.table_id = 'employee-data-table';
    data_table_args.table_class = 'default-table';
    data_table_args.row_id_prefix = 'emp-data-row-';
    data_table_args.table_data_cell_class = 'default-table-td'; 
    data_table_args.table_row_appended_cells = "<td style=\"background-color: rgb(255,255,255); box-shadow: 3px 3px 0px 3.25px rgb(255,255,255);\" onclick = \"view_to_edit_entry('%emp_id%','%department%','%entry_id%')\" ><a id = \"edit_link\" class =\"edit_link\">Edit </a></td>";
    data_table_args.page_nav_div_id = 'employee-data-table-page-nav';
    data_table_args.page_nav_class = 'page_nav';
    data_table_args.page_nav_id_prefix = 'emp-data';
    data_table_args.page_class_str = 'page_nav_link';
    data_table_args.page_onmouse_str = '';
    data_table_args.tot_pages_shown = 9;
    data_table_args.page = page;
    data_table_args.head_row_class_str = 'default-table-header';
    data_table_args.sort_col = sort_col;
    data_table_args.sort_dir = sort_dir;
    data_table_args.page_onclick = "view_emp_data_table(%%,%sort_col%,%sort_dir%,'"+emp_id+"','"+department+"')";
    data_table_args.sort_onclick = "view_emp_data_table(%%,%column_name%,%sort_dir%,'"+emp_id+"','"+department+"')";
    data_table_args.row_onclick = "view_employee_data_entry('%entry_id%','%department%','%row_id%')";
    data_table_args.row_onmouseenter = "add_class('default-table-row-highlight','%row_id%')"; 
    data_table_args.row_onmouseleave = "remove_class('default-table-row-highlight','%row_id%')";
    data_table_args.add_callback = function(){store_session("data_table_page,"+page+",data_table_sort_col,"+sort_col+",data_table_sort_dir,"+sort_dir);}

    //
    var callback = function(response) {
        // processing col_meta_data to get shared columns for sql request
        data_table_args.data_sql_args.cols = [];
        for (var i = 0; i < response.length; i++) {
            data_table_args.data_sql_args.cols.push(response[i].column_name);
        }
        // adding the make table event handler to the adjust view range button
        var curr_adj_button = document.getElementById('adj_view_range');
        var adj_button = document.createElement('BUTTON');
        adj_button.id = 'adj_view_range';
        adj_button.type = 'button';
        adj_button.class = 'hidden-elm'
        adj_button.appendChild(document.createTextNode('Adjust Viewable Range'));
        adj_button.addEventListener("click", function () {
            view_emp_data_table(page,sort_col,sort_dir,emp_id,department); 
            add_class('hidden-elm','adj_view_range');
        });
        curr_adj_button.parentNode.replaceChild(adj_button,curr_adj_button);
        // getting specific columns now for output
        data_table_args.meta_sql_args.where = [['in_tables','REGEXP','(^|%)employee_data(%|$)'],['use_on_pages','REGEXP','.'],['use_in_html_tables','REGEXP','employee_data_table']];
        create_standard_table(data_table_args);
    }
    var meta_sql = gen_sql(data_table_args.meta_sql_args);
    ajax_fetch_db(meta_sql,'',callback);
}
//
// defining the row onclick for the view data entries table
function view_employee_data_entry(entry_id,department,row_id) {  
    //
    // variable initializations
    var table = '';
    var data_form = '';
    var data_form_id = '';
    var pop_dropbox_fun = '';
    var curr_page = '1';
    var sort_col = 'emp_last_name';
    var sort_dir = 'ASC';
    var populate_form_args = {};
    //
    // setting department dependent variables
    if (CONSTANTS.DEPT_TABLES.hasOwnProperty(department)) { table = CONSTANTS.DEPT_TABLES[department];}
    else { console.log(' Department has no set table: '+department); return;}
    if (CONSTANTS.DEPT_FORMS.hasOwnProperty(department)) { data_form = CONSTANTS.DEPT_FORMS[department];}
    else { console.log(' Department has no set form: '+department); return;}
    //
    // creating form and setting all fields to readonly
    create_form(data_form,'view-emp-entry-div');
    var all_children = document.getElementById('input-emp-data').getElementsByTagName("*");
    for (var i = 0; i < all_children.length; i++) {
        if (all_children[i].nodeType != 1) {continue;}
        if ((all_children[i].nodeName.toUpperCase() != 'INPUT') && (all_children[i].nodeName.toUpperCase() != 'SELECT') && (all_children[i].nodeName.toUpperCase() != 'TEXTAREA')) {continue;}
        all_children[i].readOnly = true;
    }
    //
    var submit_button = document.getElementById('submit-data-button');
    var hide_button = document.createElement('BUTTON');
    //
    // creating header 
    name = ''
    if (row_id != '') {
        var name = document.getElementById(row_id+'-emp_first_name').innerHTML+" "+document.getElementById(row_id+'-emp_last_name').innerHTML;
        document.getElementById('view-header').innerHTML = "Viewing Record: "+entry_id+" of Employee "+name;
    }
    else {
        document.getElementById('view-header').innerHTML = "Viewing Record: "+entry_id;
    }
    //
    // creating hide button for deleted records
    hide_button.id = "hide-entry"
    hide_button.type = "button";
    hide_button.appendChild(document.createTextNode('Hide Entry'));
    hide_button.addEventListener("click", function () {
        document.getElementById('view-header').innerHTML = '';
        document.getElementById('view-emp-entry-div').innerHTML = '';
    });
    //
    submit_button.parentNode.replaceChild(hide_button,submit_button);
    if (department == 'freight_backhaul') {
        var date = document.getElementById(row_id+'-date').innerHTML;
        var data_sql = "SELECT *  FROM employee_data INNER JOIN "+table+" ON employee_data.entry_id = "+table+".entry_id WHERE employee_data.date LIKE '"+date+"'";
        //
        var callback = function(response) {
            var data = response.data;
            var groupID = '';
            // determining group ID and populating static fields
            for (var i = 0; i < data.length; i++) {
                if (data[i]['entry_id'] == entry_id) {
                    groupID = data[i]['group_id']; 
                    var args = {
                        'data_arr' : data[i],
                        'form_id' : 'input-emp-data',
                        'trigger_events' : false
                    };
                    process_form_data(args);
                    break;
                }
            }
            // outputting POs
            var count = 0;
            for (var i = 0; i < data.length; i++) {
                if (data[i]['group_id'] != groupID) { continue;}
                args.data_arr = data[i];
                args.form_id = 'haul-info-'+count;
                create_haul_fields('haul-info',count);
                process_form_data(args);
                //
                var remove_button = document.getElementById('remove-haul-info-'+count);
                remove_button.remove();
                count += 1;
            }
            // making fields readonly
            var all_children = document.getElementById('input-emp-data').getElementsByTagName("*");
            for (var i = 0; i < all_children.length; i++) {
                if (all_children[i].nodeType != 1) {continue;}
                if ((all_children[i].nodeName.toUpperCase() != 'INPUT') && (all_children[i].nodeName.toUpperCase() != 'SELECT') && (all_children[i].nodeName.toUpperCase() != 'TEXTAREA')) {continue;}
                all_children[i].readOnly = true;
            }
           
        }
        ajax_multi_fetch([data_sql],['data'],callback);
    }
    else {
        //
        // nesting this in a callback so populate form can never execute before dropboxes are populated
        var callback = function() {
            // populating form from main employee data table
            populate_form_args.table = 'employee_data';
            populate_form_args.unique_col = 'entry_id';
            populate_form_args.unique_data = entry_id;
            populate_form_args.form_id = 'input-emp-data';
            populate_form_args.trigger_events = false;
            populate_form(populate_form_args)
            // populating form based on department specific table
            populate_form_args.table = table;
            populate_form_args.unique_col = 'entry_id';
            populate_form_args.unique_data = entry_id;
            populate_form_args.form_id = 'input-emp-data';
            populate_form_args.trigger_events = false;
            populate_form(populate_form_args)
        }
        //
        // setting up add_args for error code dropbox
        var add_args = {
            place_holder_value : '0',
            place_holder_status : 'selected',
            add_opts_val : ['99'],
            add_opts_text : ['OTHER'],
            add_callback : callback
        };
        // populating dropbox
        populate_dropbox_options('attendance-select','attendance','absence_value','absence_kind','','');
        populate_dropbox_options('error-code','error_codes','reason','description','NO ERRORS',add_args)
    }
    //
    document.getElementById('emp-first-name').focus();
}
//
// allows user to edit a data entry directly from the view employee data page
function view_to_edit_entry(emp_id,department,entry_id) {
    
    var session_str = '';
    var curr_page = '1';
    var sort_col = 'emp_last_name';
    var sort_dir = 'ASC';
    var session_obj = {}
    //
    // storing data table generation parameters in the session array
    session_obj = get_all_form_values('view-employee','');
    session_obj.table_dept = session_obj.department; //department is protected
    delete session_obj.department;
    session_obj.show_date_range = (!!(document.getElementById('time-range').disabled))
    session_obj.edit_entry_emp_id = emp_id;
    session_obj.edit_entry_department = department;
    session_obj.edit_entry_id = entry_id;
    //
    for (var prop in session_obj) {
        session_str += prop+","+session_obj[prop]+",";
    }
    //
    // storing the values in the $_SESSION var
    store_session(session_str);
    //
    // going to the edit page
    goto_link('edit_emp_data');
}
//
// generating the proper edit data form when the "Edit" link was click on view_employee
function create_edit_page_from_view(session_arr) {
    //
    var error = false;
    //
    // getting needed vars from session array
    // emp table
    var emp_curr_page = session_arr.emp_table_page;
    if (!(emp_curr_page)) {emp_curr_page = '1'; error = true;}
    var emp_sort_col = session_arr.emp_table_sort_col
    if (!(emp_sort_col)) {emp_sort_col = 'emp_last_name'; error = true;}
    var emp_sort_dir = session_arr.emp_table_sort_dir;
    if (!(emp_sort_dir)) {emp_sort_dir = 'ASC'; error = true;}
    // data table
    var data_curr_page = session_arr.data_table_page;
    if (!(data_curr_page)) {data_curr_page = '1'; error = true;}
    var data_sort_col = session_arr.data_table_sort_col
    if (!(data_sort_col)) {data_sort_col = 'emp_last_name'; error = true;}
    var data_sort_dir = session_arr.data_table_sort_dir;
    if (!(data_sort_dir)) {data_sort_dir = 'ASC'; error = true;}
    // entry form
    var department = session_arr.edit_entry_department;
    if (!(department)) {department = 'all'; error = true;}
    var emp_id = session_arr.edit_entry_emp_id;
    if (!(emp_id)) {emp_id = '.'; error = true;}
    var entry_id = session_arr.edit_entry_id;
    if (!(entry_id)) {error = true;}
    //
    // filling form values
    if (session_arr.show_date_range == "true") {
        var event = document.createEvent("HTMLEvents");
        event.initEvent("click",true,false);
        document.getElementById('show-date-range').dispatchEvent(event);
    }
    //
    // creating tables
    edit_data_emp_table(emp_curr_page,emp_sort_col,emp_sort_dir);
    toggle_view_element_button('show-employee-table','employee-table-div','Hide Employee Table','Show Employee Table')
    mod_emp_data_table(data_curr_page,data_sort_col,data_sort_dir,emp_id);
    toggle_view_element_button('get-all-emp-data','edit-emp-data-div','Hide Employee Data Table','Show Employee Data Table');
    if (error) {
        console.log('Error - missing data, page was likely refreshed.')
    }
    else {
        mod_employee_data_entry(entry_id,department,'');
    }
    //
    // clearing the session array to be safe (this will prevent refreshes)
    ajax_call("clear_session=true");
}
//
// creates the employee table for the edit_emp_data page
function edit_data_emp_table(page,sort_col,sort_dir) { 
    //
    // creating argument objects
    var emp_table_args = {};
    var data_sql_args = {};
    var meta_sql_args = {};
    var department = '.';
    //
    // getting page elements
    emp_table_args.department = document.getElementById('department').value;
    //
    if (!!(emp_table_args.department)) {
        department = emp_table_args.department;
        if (department == 'all') {department = '.';}
    }
    // adding an event listener to the update-employee-table button
    var update_button = document.createElement('BUTTON');
    update_button.id = 'update-employee-table';
    update_button.type = 'button';
    update_button.className = 'hidden-elm';
    update_button.addEventListener("click", function() {
        edit_data_emp_table(page,sort_col,sort_dir);
    });
    document.getElementById('update-employee-table').parentNode.replaceChild(update_button,document.getElementById('update-employee-table'));
    //
    data_sql_args.cmd = 'SELECT';
    data_sql_args.table = 'employee_info';
    data_sql_args.where = [['department','REGEXP',department]];
    data_sql_args.orderBy = [[sort_col,sort_dir]];
    if (!(emp_table_args.show_inactive)) {
        data_sql_args.where.push(['emp_status','LIKE','active'])
    }
    meta_sql_args.cmd = 'SELECT';
    meta_sql_args.table = 'table_meta_data';
    meta_sql_args.where = [['in_tables','REGEXP','(^|%)employee_info(%|$)'],['use_on_pages','REGEXP','.'],['use_in_html_tables','REGEXP','employee_table']];
    meta_sql_args.orderBy = [['order_index','ASC']]
    emp_table_args.data_sql_args = data_sql_args;
    emp_table_args.meta_sql_args = meta_sql_args;
    //
    // creating argument object 
    emp_table_args.table_output_id = 'employee-table-div';
    emp_table_args.table_id = 'employee_table';
    emp_table_args.table_class = 'default-table';
    emp_table_args.row_id_prefix = 'emp-row-';
    emp_table_args.table_data_cell_class = 'default-table-td';  
    emp_table_args.page_nav_div_id = 'emp-table-page-nav';
    emp_table_args.page_nav_class = 'page_nav';
    emp_table_args.page_nav_id_prefix = 'emp';
    emp_table_args.page_class_str = 'page_nav_link';
    emp_table_args.page_onmouse_str = '';
    emp_table_args.num_per_page = document.getElementById("emp-per-page").value;
    emp_table_args.tot_pages_shown = 9;
    emp_table_args.page = page;
    emp_table_args.head_row_class_str = 'default-table-header';
    emp_table_args.sort_col = sort_col;
    emp_table_args.sort_dir = sort_dir;
    emp_table_args.page_onclick = 'edit_data_emp_table(%%,%sort_col%,%sort_dir%)';
    emp_table_args.sort_onclick = 'edit_data_emp_table(%%,%column_name%,%sort_dir%)';
    emp_table_args.row_onclick = "mod_emp_data_table(1,'date','DESC',%emp_id%); remove_class('hidden-elm','edit-emp-data-div'); add_emp_id('%emp_id%','employee_table');";
    emp_table_args.row_onmouseenter = "add_class('default-table-row-highlight','%row_id%')"; 
    emp_table_args.row_onmouseleave = "remove_class('default-table-row-highlight','%row_id%')";
    //
    create_standard_table(emp_table_args);
}
//
// adds emp_id to employee table dataset
// think this might be able to be removed
function add_emp_id(emp_id,table_id) {
    document.getElementById(table_id).dataset.empId = emp_id;   
}
//
// generates the data table for the edit_emp_data page
function mod_emp_data_table(page,sort_col,sort_dir,emp_id) {
    
    //
    // creating argument objects
    var data_table_args = {};
    var data_sql_args = {};
    var meta_sql_args = {};
    var department = 'all';
    //
    // getting page elements
    data_table_args.department = document.getElementById('department').value;
    data_table_args.num_per_page = document.getElementById('res-per-page').value;
    data_table_args.show_deleted = document.getElementById('show-deleted').checked;
    //
    department = data_table_args.department;
    if (data_table_args.department == 'all') {department = '.';}
    // 
    // processing time range information
    var ts_obj = to_and_from_timestamps();
    //
    // adding an event listener to the update-employee-data-table button
    var update_button = document.createElement('BUTTON');
    update_button.id = 'update-employee-data-table';
    update_button.type = 'button';
    update_button.className = 'hidden-elm';
    update_button.addEventListener("click", function() {
        mod_emp_data_table(page,sort_col,sort_dir,emp_id);
    });
    document.getElementById('update-employee-data-table').parentNode.replaceChild(update_button,document.getElementById('update-employee-data-table'));
    //
    // creating data sql
    data_sql_args.cmd = 'SELECT';
    data_sql_args.table = 'employee_data';
    data_sql_args.where = [['emp_id','REGEXP',emp_id],['date','BETWEEN',ts_obj.from_ts+"' AND '"+ts_obj.to_ts],['department','REGEXP',department]];
    if (!(data_table_args.show_deleted)) {
        data_sql_args.where.push(['entry_status','LIKE','submitted'])
    }
    data_sql_args.orderBy = [[sort_col,sort_dir]];
    meta_sql_args.cmd = 'SELECT';
    meta_sql_args.table = 'table_meta_data';
    meta_sql_args.where = [['in_tables','REGEXP','(^|%)employee_data(%|$)'],['use_on_pages','REGEXP','.'],['use_in_html_tables','REGEXP','employee_data_table']];
    meta_sql_args.orderBy = [['order_index','ASC']];
    data_table_args.data_sql_args = data_sql_args;
    data_table_args.meta_sql_args = meta_sql_args;
    //
    // creating argument object
    data_table_args.table_output_id = 'edit-emp-data-div';
    data_table_args.table_id = 'employee-data-table';
    data_table_args.table_class = 'default-table';
    data_table_args.row_id_prefix = 'emp-data-row-';
    data_table_args.table_data_cell_class = 'default-table-td';  
    data_table_args.page_nav_div_id = 'employee-data-table-page-nav';
    data_table_args.page_nav_class = 'page_nav';
    data_table_args.page_nav_id_prefix = 'emp-data';
    data_table_args.page_class_str = 'page_nav_link';
    data_table_args.page_onmouse_str = '';
    data_table_args.tot_pages_shown = 9;
    data_table_args.page = page;
    data_table_args.head_row_class_str = 'default-table-header';
    data_table_args.sort_col = sort_col;
    data_table_args.sort_dir = sort_dir;
    data_table_args.page_onclick = "mod_emp_data_table(%%,%sort_col%,%sort_dir%,'"+emp_id+"')";
    data_table_args.sort_onclick = "mod_emp_data_table(%%,%column_name%,%sort_dir%,'"+emp_id+"')";
    data_table_args.row_onclick = "mod_employee_data_entry('%entry_id%','%department%','%row_id%')";
    data_table_args.row_onmouseenter = "add_class('default-table-row-highlight','%row_id%')"; 
    data_table_args.row_onmouseleave = "remove_class('default-table-row-highlight','%row_id%')";
    data_table_args.add_callback = function() { document.getElementById(data_table_args.table_id).dataset.empId = emp_id; }
    //
    create_standard_table(data_table_args);
}
//
// defining the row onclick for the edit data entry table
function mod_employee_data_entry(entry_id,department,row_id) { 
    //
    // variable initializations
    var action = '';
    var data_form_id = '';
    var curr_page = '1';
    var sort_col = 'emp_last_name';
    var sort_dir = 'ASC';
    if (!!(document.getElementById('employee-data-table-page-nav'))) {
        curr_page = document.getElementById('employee-data-table-page-nav').dataset.currPage;
        sort_col  = document.getElementById('employee-data-table-page-nav').dataset.sortCol;
        sort_dir  = document.getElementById('employee-data-table-page-nav').dataset.sortDir;
    }
    //
    // setting department dependent variables
    if (CONSTANTS.DEPT_TABLES.hasOwnProperty(department)) { var table = CONSTANTS.DEPT_TABLES[department];}
    else { console.log(' Department has no set table: '+department); return;}
    if (CONSTANTS.DEPT_FORMS.hasOwnProperty(department)) { var data_form = CONSTANTS.DEPT_FORMS[department];}
    else { console.log(' Department has no set form: '+department); return;}
    if (CONSTANTS.DEPT_MOD_FUNS.hasOwnProperty(department)) { var mod_fun = CONSTANTS.DEPT_MOD_FUNS[department];}
    else {console.log('Error: this department: '+department+' has no set modifying function.'); return;}
    if (CONSTANTS.DEPT_FORMS.hasOwnProperty(department)) { var validation_function = CONSTANTS.DEPT_VAL_FUNS[department];}
    else { console.log(' Department has no set validation function: '+department); return;}
    //
    // creating header 
    name = ''
    if (row_id != '') {
        var name = document.getElementById(row_id+'-emp_first_name').innerHTML+" "+document.getElementById(row_id+'-emp_last_name').innerHTML;
        document.getElementById('modify-header').innerHTML = "Modfiying Record: "+entry_id+" of Employee "+name;
    }
    else {
        document.getElementById('modify-header').innerHTML = "Modfiying Record: "+entry_id;
    }
    //
    // creating form
    create_form(data_form,'update-entry-form-div');
    //
    // creating buttons
    var submit_button = document.getElementById('submit-data-button');
    var mod_button = document.createElement('BUTTON');
    var delete_button = document.createElement('BUTTON');
    var restore_button = document.createElement('BUTTON');
    //
    // creating delete button
    delete_button.id = "del-entry";
    delete_button.type = "button";
    delete_button.appendChild(document.createTextNode('Delete Entry'));
    delete_button.addEventListener("click", function () {
        var cont = confirm('Confirm Deletion of Entry: '+entry_id);
        if (!(cont)) {return;}
        // 
        // changing value of entry status
        document.getElementById('entry-status').value = 'deleted';
        validation_function(department,'delete');     
    });
    // creating modify button
    mod_button.id = "mod-entry";
    mod_button.type = "button";
    mod_button.appendChild(document.createTextNode("Submit Changes"));
    mod_button.addEventListener('click', function () {
        var cont = confirm("Confirm Modification of Entry: "+entry_id);
        if (!(cont)) {return;}
        // 
        // changing value of entry status
        validation_function(department,'update');  
    });
    // creating restore button for deleted records
    restore_button.id = "restore-entry"
    restore_button.type = "button";
    restore_button.appendChild(document.createTextNode('Restore Entry'));
    restore_button.addEventListener("click", function () {
        var cont = confirm("Confirm Restoration of Entry: "+entry_id);
        if (!(cont)) {return;}
        // 
        // changing value of entry status
        document.getElementById('entry-status').value = 'submitted'
        validation_function(department,'restore'); 
    });
    //
    // putting all three buttons onto the form
    submit_button.parentNode.insertBefore(delete_button, submit_button.nextSibling);
    submit_button.parentNode.insertBefore(document.createTextNode( '\u00A0\u00A0' ), submit_button.nextSibling);
    submit_button.parentNode.insertBefore(restore_button, delete_button.nextSibling);
    submit_button.parentNode.insertBefore(document.createTextNode( '\u00A0\u00A0' ), delete_button.nextSibling);
    submit_button.parentNode.replaceChild(mod_button,submit_button);
    //
    var args = {
        'entry_id' : entry_id,
        'department' : department,
        'table' : table
    };
    mod_fun(args);   
}
//
// 
function mod_backhaul_form(args) {
    //
    var table = args.table
    var entry_id = args.entry_id;
    var department = args.department;
    //
    // creating the add PO button
    var add_fieldset_button = document.createElement('BUTTON');
    add_fieldset_button.id = 'add-fieldset';
    add_fieldset_button.type = 'button';
    add_fieldset_button.innerHTML = 'Add another PO';
    add_fieldset_button.addEventListener('click', function () {
           var num = parseInt(document.getElementById('number-of-fields').value)+1;
           create_haul_fields('haul-info',num)
    });
    var br = document.createElement('BR');
    document.getElementById('mod-entry').parentNode.insertBefore(add_fieldset_button,document.getElementById('mod-entry'));
    document.getElementById('mod-entry').parentNode.insertBefore(br,document.getElementById('mod-entry'));
    //
    // temp function to update all of the entry statuses
    var update_statuses = function(status) {
        var maxNumFields  = parseInt(document.getElementById('number-of-fields').value) + 1;
        for (var i = 0; i < maxNumFields; i++) {
            if (!!(document.getElementById('entry-status-{'+i+'}'))) {
                document.getElementById('entry-status-{'+i+'}').value = status;
            }
        }
    }
    //
    // replacing delete and restore buttons
    var old_delete_button = document.getElementById('del-entry');
    var old_restore_button = document.getElementById('restore-entry');
    var delete_button = document.createElement('BUTTON');
    var restore_button = document.createElement('BUTTON');
    //
    // creating delete button
    delete_button.id = "del-entry";
    delete_button.type = "button";
    delete_button.appendChild(document.createTextNode('Delete Entire Record'));
    delete_button.addEventListener("click", function () {
        var cont = confirm('Confirm Deletion of Freight Record');
        if (!(cont)) {return;}
        // 
        update_statuses('deleted');
        init_backhaul_form_validation(department,'delete');     
    });
    // creating restore button for deleted records
    restore_button.id = "restore-entry"
    restore_button.type = "button";
    restore_button.appendChild(document.createTextNode('Restore Entire Record'));
    restore_button.addEventListener("click", function () {
        var cont = confirm("Confirm Restoration of Entry: "+entry_id);
        if (!(cont)) {return;}
        // 
        update_statuses('submitted');
        init_backhaul_form_validation(department,'restore'); 
    });
    old_delete_button.parentNode.replaceChild(delete_button,old_delete_button);
    old_restore_button.parentNode.replaceChild(restore_button,old_restore_button);
    //
    // getting data for the clicked on PO to determine group ID
    var sql = 'SELECT `group_id` FROM `'+table+'` WHERE `entry_id` LIKE '+entry_id;
    var get_data_callback = function(response) {
        var data = response.data;
        var data_sql = 'SELECT *  FROM employee_data INNER JOIN '+table+' ON employee_data.entry_id = '+table+'.entry_id WHERE '+table+'.group_id LIKE '+data[0].group_id;
        ajax_multi_fetch([data_sql],['data'],add_freight_pos);
    }
    ajax_multi_fetch([sql],['data'],get_data_callback);
}
//
// this adds the PO fields to the update form
function add_freight_pos(response) {
    var data = response.data;
    var maxNumFields  = parseInt(document.getElementById('number-of-fields').value) + 1;
    var nav_id = 'employee-data-table-page-nav';
    //
    // populating the whole form with entry[0] data because it holds everything
    var args = {
        'data_arr' : data[0],
        'form_id' : 'input-emp-data',
        'trigger_events' : false
    };
    process_form_data(args);
    //
    // setting up the callback for restoring or deleting POs
    var PO_callback = function() {
        var curr_page = document.getElementById(nav_id).dataset.currPage;
        var sort_col = document.getElementById(nav_id).dataset.sortCol;
        var sort_dir = document.getElementById(nav_id).dataset.sortDir;
        var emp_id = '.'
        if (!!(document.getElementById('employee-data-table').dataset.empId)) { emp_id = document.getElementById('employee-data-table').dataset.empId;}
        mod_emp_data_table(curr_page,sort_col,sort_dir,emp_id);
    }
    //
    for (var i = 0; i < data.length; i++) {
        //
        // creating and populating PO form
        args.data_arr = data[i];
        args.form_id = 'haul-info-'+i;
        create_haul_fields('haul-info',i);
        process_form_data(args);
        //
        // creating buttons
        var remove_button = document.getElementById('remove-haul-info-'+i);
        var delete_button = document.createElement('BUTTON')
        var restore_button = document.createElement('BUTTON');
        delete_button.id = 'delete-po-'+i;
        delete_button.type = 'button';
        delete_button.appendChild(document.createTextNode('Delete PO'));
        delete_button.addEventListener("click", function () {
              var num = this.parentElement.id.match(/(\d+)/)[1]
              var skip_str = 'delete-po-'+num+',restore-po-'+num+',comments-{'+num+'}';
              var entry_id = document.getElementById('entry-id-{'+num+'}').value
              var user = document.getElementById('entering-user').value;
              var ts = get_current_timestamp();
              document.getElementById('entry-status-{'+num+'}').value = 'deleted'; 
              add_class('hidden-elm','delete-po-'+num);
              remove_class('hidden-elm','restore-po-'+num);
              recalc_backhaul_form(true);
              // updating DB
              var sql = "UPDATE `employee_data` SET `entry_status`='deleted',`admin_fix`=CONCAT(`admin_fix`,'"+user+";'),`admin_fix_timestamp`=CONCAT(`admin_fix_timestamp`,'"+ts+";') WHERE `entry_id` LIKE "+entry_id;
              ajax_exec_db(sql,PO_callback);
        });
        restore_button.id= 'restore-po-'+i;
        restore_button.type = 'button';
        restore_button.appendChild(document.createTextNode('Restore PO'));
        restore_button.addEventListener("click", function () {
              var num = this.parentElement.id.match(/(\d+)/)[1]
              var entry_id = document.getElementById('entry-id-{'+num+'}').value
              var user = document.getElementById('entering-user').value;
              var ts = get_current_timestamp();
              document.getElementById('entry-status-{'+num+'}').value = 'submitted';  
              remove_class('hidden-elm','delete-po-'+num);
              add_class('hidden-elm','restore-po-'+num);
              recalc_backhaul_form(true);
              // updating DB
              var sql = "UPDATE `employee_data` SET `entry_status`='submitted',`admin_fix`=CONCAT(`admin_fix`,'"+user+";'),`admin_fix_timestamp`=CONCAT(`admin_fix_timestamp`,'"+ts+";') WHERE `entry_id` LIKE "+entry_id;
              ajax_exec_db(sql,PO_callback);
        });
        //
        if (data[i]['entry_status'] == 'deleted') {
            delete_button.className = 'hidden-elm';
        }
        else {
            restore_button.className = 'hidden-elm';
        }
        // adding buttons
        remove_button.parentNode.insertBefore(restore_button, remove_button.nextSibling);
        remove_button.parentNode.replaceChild(delete_button,remove_button);
    }
    //
    // passing final event to the total savings field
    var event = document.createEvent("HTMLEvents");
    event.initEvent("blur",true,false);
    document.getElementById('total-savings').dispatchEvent(event);
}
//
//
function mod_regular_data_form(args) {
    //
    var table = args.table
    var entry_id = args.entry_id;
    var department = args.department;
    //
    // temporary function to determine what buttons to show or hide based on emp status
    var button_fun = function() {
        //
        // passing a single event to the total element to recalculate everything
        var event = document.createEvent("HTMLEvents");
        event.initEvent("blur",true,false);
        document.getElementById('total-pay').dispatchEvent(event);
        // 
        if (document.getElementById('entry-status').value == 'submitted') {
            add_class('hidden-elm','restore-entry');
        }
        else {
            add_class('hidden-elm','del-entry');
        }
    }
    //
    // nesting this in a callback so populate form can never execute before dropboxes are populated
    var callback = function() {
        // populating form from main employee data table
        var populate_form_args = {};
        populate_form_args.table = 'employee_data';
        populate_form_args.unique_col = 'entry_id';
        populate_form_args.unique_data = entry_id;
        populate_form_args.form_id = 'input-emp-data';
        populate_form_args.trigger_events = false;
        populate_form(populate_form_args)
        // populating form based on department specific table
        populate_form_args = {};
        populate_form_args.table = table;
        populate_form_args.unique_col = 'entry_id';
        populate_form_args.unique_data = entry_id;
        populate_form_args.form_id = 'input-emp-data';
        populate_form_args.trigger_events = false; //this is set to false to prevent an obscene number of rapid AJAX calls
        populate_form_args.add_callback_funs = button_fun; 
        populate_form(populate_form_args)
    }
    //
    // setting up add_args for error code dropbox
    var add_args = {
        place_holder_value : '0',
        place_holder_status : 'selected',
        add_opts_val : ['99'],
        add_opts_text : ['OTHER'],
        add_callback : callback
    };
    // populating dropbox
    populate_dropbox_options('attendance-select','attendance','absence_value','absence_kind','','');
    populate_dropbox_options('error-code','error_codes','reason','description','NO ERRORS',add_args)
    //
    document.getElementById('emp-first-name').focus();
}
//
// creates the database user table for the mod_dbuser page
function mod_dbuser_table(page,sort_col,sort_dir) {
    
    //
    // creating argument objects
    var dbuser_table_args = {};
    var data_sql_args = {};
    var meta_sql_args = {};
    //
    // getting page elements
    dbuser_table_args.show_inactive = document.getElementById('mod-dbuser-show-inactive').checked;
    //
    data_sql_args.cmd = 'SELECT';
    data_sql_args.table = 'dbUsers';
    data_sql_args.where = [['department','REGEXP','.']];
    data_sql_args.orderBy = [[sort_col,sort_dir]];
    if (!(dbuser_table_args.show_inactive)) {
        data_sql_args.where.push(['dbuser_status','LIKE','active'])
    }
    meta_sql_args.cmd = 'SELECT';
    meta_sql_args.table = 'table_meta_data';
    meta_sql_args.where = [['in_tables','REGEXP','(^|%)dbUsers(%|$)'],['use_on_pages','REGEXP','.'],['use_in_html_tables','REGEXP','dbuser_table']];
    meta_sql_args.orderBy = [['order_index','ASC']];
    dbuser_table_args.data_sql_args = data_sql_args;
    dbuser_table_args.meta_sql_args = meta_sql_args;
    //
    // creating argument object
    dbuser_table_args.table_output_id = 'dbuser-table-div';    
    dbuser_table_args.table_id = 'dbuser-table';
    dbuser_table_args.table_class = 'default-table';
    dbuser_table_args.row_id_prefix = 'dbuser-row-';
    dbuser_table_args.table_data_cell_class = 'default-table-td'; 
    dbuser_table_args.page_nav_div_id = 'dbuser-table-page-nav';
    dbuser_table_args.page_nav_class = 'page_nav';     
    dbuser_table_args.page_nav_id_prefix = 'dbuser';
    dbuser_table_args.page_class_str = 'page_nav_link';
    dbuser_table_args.page = page;
    dbuser_table_args.tot_pages_shown = 9;
    dbuser_table_args.num_per_page = 10;
    dbuser_table_args.page_onclick = 'mod_dbuser_table(%%,%sort_col%,%sort_dir%,false)';
    dbuser_table_args.page_onmouse_str = '';
    dbuser_table_args.head_row_class_str = 'default-table-header';  
    dbuser_table_args.sort_col = sort_col;
    dbuser_table_args.sort_dir = sort_dir;
    dbuser_table_args.sort_onclick = 'mod_dbuser_table(%%,%column_name%,%sort_dir%,false)';                                                                                                                                                                                              
    dbuser_table_args.row_onclick = "remove_class_all('selected-field'); add_class('selected-field','%row_id%'); mod_dbuser_info('%dbuser_internal_id%','%row_id%');";
    dbuser_table_args.row_onmouseenter = "add_class('default-table-row-highlight','%row_id%')"; 
    dbuser_table_args.row_onmouseleave = "remove_class('default-table-row-highlight','%row_id%')";    
    //
    create_standard_table(dbuser_table_args)   
}
//
// defining the row onclick for the employee table
function mod_dbuser_info(user_id,row_id) {
    
    create_form('add_dbuser','mod-dbuser-form-div');
    //
    // creating header 
    var name = document.getElementById(row_id+'-dbuser_first_name').innerHTML+" "+document.getElementById(row_id+'-dbuser_last_name').innerHTML;
    document.getElementById('modify-header').innerHTML = "Modfiying User: "+name;
    //
    var curr_page = document.getElementById('dbuser-table-page-nav').dataset.currPage;
    var sort_col = document.getElementById('dbuser-table-page-nav').dataset.sortCol;
    var sort_dir = document.getElementById('dbuser-table-page-nav').dataset.sortDir;
    var submit_button = document.getElementById('create-new-user');
    var mod_button = document.createElement('BUTTON');
    var delete_button = document.createElement('BUTTON');
    var reinstate_button = document.createElement('BUTTON');
    //
    // creating delete button
    delete_button.id = "del-dbuser";
    delete_button.type = "button";
    delete_button.appendChild(document.createTextNode('Delete User'));
    delete_button.addEventListener("click", function () {
        var cont = confirm("Confirm Deletion of User: "+name);
        if (!(cont)) {return;}
        var sql_args = {}
        sql_args.cmd = "UPDATE";
        sql_args.table = "dbUsers";
        sql_args.cols = ['dbuser_status'];
        sql_args.vals = ['inactive'];
        sql_args.where = [['dbuser_internal_id','LIKE',user_id]];
        var sql = gen_sql(sql_args);
        var callback = function() {
            alert("Sucessfully Deleted User: "+name+".");
            document.getElementById('dbuser-status').value = 'inactive'
            mod_dbuser_table(curr_page,sort_col,sort_dir);
            init_dbuser_form_valiation(true)
        }
        ajax_exec_db(sql,callback);     
    });
    // creating modify button
    mod_button.id = "mod-dbuser";
    mod_button.type = "button";
    mod_button.appendChild(document.createTextNode("Submit Changes"))
    mod_button.addEventListener("click", function () {
        init_dbuser_form_valiation(true);
    });   
    // creating reinstate button for inactive employees
    reinstate_button.id = "reinstate-dbuser"
    reinstate_button.type = "button";
    reinstate_button.appendChild(document.createTextNode('Reinstate User'));
    reinstate_button.addEventListener("click", function () {
        var cont = confirm("Confirm Reinstation of User: "+name);
        if (!(cont)) {return;}
        var sql_args = {}
        sql_args.cmd = "UPDATE";
        sql_args.table = "dbUsers";
        sql_args.cols = ['dbuser_status'];
        sql_args.vals = ['active'];
        sql_args.where = [['dbuser_internal_id','LIKE',user_id]];
        var sql = gen_sql(sql_args);
        var callback = function() {
            alert("Sucessfully Reinstated User: "+name+".");
            document.getElementById('dbuser-status').value = 'active'
            mod_dbuser_table(curr_page,sort_col,sort_dir);
            init_dbuser_form_valiation(true)
        }
        ajax_exec_db(sql,callback);
    });
    //
    // putting all three buttons onto the form
    submit_button.parentNode.insertBefore(delete_button, submit_button.nextSibling);
    submit_button.parentNode.insertBefore(document.createTextNode( '\u00A0\u00A0' ), submit_button.nextSibling);
    submit_button.parentNode.insertBefore(reinstate_button, delete_button.nextSibling);
    submit_button.parentNode.insertBefore(document.createTextNode( '\u00A0\u00A0' ), delete_button.nextSibling);
    submit_button.parentNode.replaceChild(mod_button,submit_button);
    //
    // temporary function to determine what buttons to show or hide based on emp status
    var button_fun = function() {
        // 
        if (document.getElementById('dbuser-status').value != 'active') {
            add_class('hidden-elm',delete_button.id);
        }
        else {
            add_class('hidden-elm',reinstate_button.id);
        }
    }
    var callback = function() {
        //
        // populating form with employee's data
        var populate_form_args = {};
        populate_form_args.table = 'dbUsers';
        populate_form_args.unique_col = 'dbuser_internal_id';
        populate_form_args.unique_data = user_id;
        populate_form_args.form_id = 'add-new-user';
        populate_form_args.skip_fields_str = 'password'
        populate_form_args.trigger_events = true;
        populate_form_args.add_callback_funs = button_fun; 
        //
        populate_form(populate_form_args);
        document.getElementById('dbuser-first-name').focus();
    }
    //
    var args = {}
    args.callback_fun = callback;
    pop_add_dbuser_dropdowns(args);
}
//
// creates the employee table for the mod_employee page
function mod_emp_table(page,sort_col,sort_dir) {
    
    //
    // creating argument objects
    var emp_table_args = {};
    var data_sql_args = {};
    var meta_sql_args = {};
    var department = '.';
    //
    // getting page elements
    emp_table_args.show_inactive = document.getElementById('mod-emp-show-inactive').checked;
    //
    if (!!(emp_table_args.department)) {
        department = emp_table_args.department;
        if (department == 'all') {department = '.';}
    }
    //
    data_sql_args.cmd = 'SELECT';
    data_sql_args.table = 'employee_info';
    data_sql_args.where = [['department','REGEXP',department]];
    if (!(emp_table_args.show_inactive)) {
        data_sql_args.where.push(['emp_status','LIKE','active'])
    }
    data_sql_args.orderBy = [[sort_col,sort_dir]];
    meta_sql_args.cmd = 'SELECT';
    meta_sql_args.table = 'table_meta_data';
    meta_sql_args.where = [['in_tables','REGEXP','(^|%)employee_info(%|$)'],['use_on_pages','REGEXP','.'],['use_in_html_tables','REGEXP','employee_table']];
    meta_sql_args.orderBy = [['order_index','ASC']];
    emp_table_args.data_sql_args = data_sql_args;
    emp_table_args.meta_sql_args = meta_sql_args;
    //
    // creating argument object  
    emp_table_args.table_output_id = 'employee-table-div';
    emp_table_args.table_id = 'employee_table';
    emp_table_args.table_class = 'default-table';
    emp_table_args.row_id_prefix = 'emp-row-';
    emp_table_args.table_data_cell_class = 'default-table-td';  
    emp_table_args.page_nav_div_id = 'emp-table-page-nav';
    emp_table_args.page_nav_class = 'page_nav';
    emp_table_args.page_nav_id_prefix = 'emp';
    emp_table_args.page_class_str = 'page_nav_link';
    emp_table_args.page_onmouse_str = '';
    emp_table_args.tot_pages_shown = 9;
    emp_table_args.page = page;
    emp_table_args.head_row_class_str = 'default-table-header';
    emp_table_args.sort_col = sort_col;
    emp_table_args.sort_dir = sort_dir;
    emp_table_args.page_onclick = 'mod_emp_table(%%,%sort_col%,%sort_dir%,false)';
    emp_table_args.sort_onclick = 'mod_emp_table(%%,%column_name%,%sort_dir%,false)';                                                                                                                                                                                              
    emp_table_args.row_onclick = "remove_class_all('selected-field'); add_class('selected-field','%row_id%'); mod_employee_info('%emp_id%');";
    emp_table_args.row_onmouseenter = "add_class('default-table-row-highlight','%row_id%')"; 
    emp_table_args.row_onmouseleave = "remove_class('default-table-row-highlight','%row_id%')";
    //
    create_standard_table(emp_table_args);
}
//
// defining the row onclick for the employee table
function mod_employee_info(emp_id) {    
    //
    create_form('add_employee','mod-employee-form');
    //
    // creating header 
    document.getElementById('modify-header').innerHTML = "Modfiying Employee: "+emp_id;
    //
    var curr_page = document.getElementById('emp-table-page-nav').dataset.currPage;
    var sort_col = document.getElementById('emp-table-page-nav').dataset.sortCol;
    var sort_dir = document.getElementById('emp-table-page-nav').dataset.sortDir;
    var submit_button = document.getElementById('add-emp');
    var mod_button = document.createElement('BUTTON');
    var delete_button = document.createElement('BUTTON');
    var reinstate_button = document.createElement('BUTTON');
    //
    // creating delete button
    delete_button.id = "del-emp";
    delete_button.type = "button";
    delete_button.appendChild(document.createTextNode('Delete Employee'));
    delete_button.addEventListener("click", function () {
        var cont = confirm("Confirm Deletion of Employee: "+emp_id+" - "+document.getElementById('emp-first-name').value+" "+document.getElementById('emp-last-name').value);
        if (!(cont)) {return;}
        document.getElementById('emp-status').value = 'inactive';
        init_employee_form_valiation('delete');   
    });
    // creating modify button
    mod_button.id = "mod-emp";
    mod_button.type = "button";
    mod_button.appendChild(document.createTextNode("Submit Changes"))
    mod_button.addEventListener("click", function () {
        var cont = confirm("Confirm Modifcation of Employee: "+emp_id+" - "+document.getElementById('emp-first-name').value+" "+document.getElementById('emp-last-name').value);
        if (!(cont)) {return;}
        init_employee_form_valiation('update');
    });   
    // creating reinstate button for inactive employees
    reinstate_button.id = "reinstate-emp"
    reinstate_button.type = "button";
    reinstate_button.appendChild(document.createTextNode('Reinstate Employee'));
    reinstate_button.addEventListener("click", function () {
        var cont = confirm("Confirm Reinstation of Employee: "+emp_id+" - "+document.getElementById('emp-first-name').value+" "+document.getElementById('emp-last-name').value);
        if (!(cont)) {return;}
        document.getElementById('emp-status').value = 'active'
        init_employee_form_valiation('reinstate');
    });
    //
    // putting all three buttons onto the form
    submit_button.parentNode.insertBefore(delete_button, submit_button.nextSibling);
    submit_button.parentNode.insertBefore(document.createTextNode( '\u00A0\u00A0' ), submit_button.nextSibling);
    submit_button.parentNode.insertBefore(reinstate_button, delete_button.nextSibling);
    submit_button.parentNode.insertBefore(document.createTextNode( '\u00A0\u00A0' ), delete_button.nextSibling);
    submit_button.parentNode.replaceChild(mod_button,submit_button);
    //
    // temporary function to determine what buttons to show or hide based on emp status
    var button_fun = function() {
        // 
        if (document.getElementById('emp-status').value != 'active') {
            add_class('hidden-elm',delete_button.id);
        }
        else {
            add_class('hidden-elm',reinstate_button.id);
        }
    }
    //
    // callback fun to execute after last dropbox is populated
    var callback = function() {
        //
        // populating form with employee's data
        var populate_form_args = {};
        populate_form_args.table = 'employee_info';
        populate_form_args.unique_col = 'emp_id';
        populate_form_args.unique_data = emp_id;
        populate_form_args.form_id = 'add_employee';
        populate_form_args.trigger_events = true;
        populate_form_args.add_callback_funs = button_fun;
        //
        populate_form(populate_form_args);
        document.getElementById('emp-id').focus();
        document.getElementById('emp-id').disabled = true; //this should never be edited
    }
    var args = {};
    args.callback_fun = callback;
    pop_add_emp_dropdowns(args);
}
//
//
function pop_add_emp_dropdowns(args) {
    //
    var add_args = {
      sql_where : [['department_type','REGEXP','(^|%)employees(%|$)']],
    }
    populate_dropbox_options('department-select','departments','department','department_name','Select Department',add_args);
    //
    var add_args = {
      sql_where : [['level_name','LIKE','base_rate_level']],
      place_holder_value : '0',
      add_opts_val : ['other','0'],
      add_opts_text : ['Other','N/A']
    };
    //
    populate_dropbox_options('base-rate-select','driver_levels','value','level','Select Level',add_args);
    add_args.sql_where = [['level_name','LIKE','case_rate_level']];
    populate_dropbox_options('case-rate-select','driver_levels','value','level','Select Level',add_args);
    //
    if (args) {
         add_args.add_callback = args.callback_fun;
    }
    add_args.sql_where = [['level_name','LIKE','stop_rate_level']];
    populate_dropbox_options('stop-rate-select','driver_levels','value','level','Select Level',add_args);
}
//
//
function pop_add_dbuser_dropdowns(args) {
    
    var add_args = {
      add_opts_val : ['other'],
      add_opts_text : ['Other']
    };
    if (args) {
        add_args.add_callback = args.callback_fun;
    }
    populate_dropbox_options('department-select','departments','department','department_name','Select Department',add_args);
}
//
// this creates the table select box on te table_maintenance page 
function list_all_tables() {
    
    //
    var sql = "SELECT `TABLE_NAME` FROM `INFORMATION_SCHEMA`.`TABLES` WHERE `TABLE_SCHEMA` LIKE 'afwl3_operations' AND `TABLE_TYPE` LIKE 'BASE TABLE'";
    //
    var callback = function(response) {
        var tables = response.tables
        var select_element = '<select id="table-select" class="multi-line-dropbox-input" multiple="mulitple" style="height: 10em;" onchange="create_table(1,\'\',\'\');">';
        select_element += "<option value=\"\" disabled selected>Select a Table</option>"
        for (var i = 0; i < tables.length; i++) {
            var table = tables[i];
            select_element += "<option value=\""+table.TABLE_NAME+"\">"+table.TABLE_NAME+"</option>"
        }
        
        select_element += '</select>';
        document.getElementById('table-select-div').innerHTML = select_element;
    }
    //
    ajax_multi_fetch([sql],['tables'],callback)
}
//
// creates the selected table using the meta_data and its data
function create_table(page,sort_col,sort_dir) {    
    //
    // creating argument objects
    var table_args = {};
    var data_sql_args = {};
    var meta_sql_args = {};
    //
    // unhiding logic box
    remove_class('hidden-elm','table-refinement');
    remove_class('hidden-elm','update-table');
    //
    // getting page elements
    var table_name = document.getElementById('table-select').value;
    if (table_name == '') {alert('No Table Selected.'); return;}
    data_sql_args.where = [];
    if ((trim(document.getElementById('column-name-1').value) != '') && (trim(document.getElementById('column-value-1').value) != '')) {
        data_sql_args.where.push([trim(document.getElementById('column-name-1').value),trim(document.getElementById('match-type-1').value),trim(document.getElementById('column-value-1').value)]);
    }
    if ((trim(document.getElementById('column-name-2').value) != '') && (trim(document.getElementById('column-value-2').value) != '')) {
        data_sql_args.where.push([trim(document.getElementById('column-name-2').value),trim(document.getElementById('match-type-2').value),trim(document.getElementById('column-value-2').value)]);
    }
    //
    data_sql_args.cmd = 'SELECT';
    data_sql_args.table = table_name;
    if (sort_col != '') {data_sql_args.orderBy = [[sort_col,sort_dir]];}
    //
    meta_sql_args.cmd = 'SELECT';
    meta_sql_args.table = 'table_meta_data';
    meta_sql_args.where = [['in_tables','REGEXP','(^|%)'+table_name+'(%|$)'],['use_on_pages','REGEXP','table_maintenance'],['data_type','NOT REGEXP','hidden']];
    meta_sql_args.orderBy = [['order_index','ASC']];
    table_args.data_sql_args = data_sql_args;
    table_args.meta_sql_args = meta_sql_args;
    //
    // creating argument object  
    table_args.table_output_id = 'table-div';
    table_args.table_id = table_name;
    table_args.table_class = 'default-table';
    table_args.row_id_prefix = 'tm-row-';
    table_args.table_data_cell_class = 'default-table-td';  
    table_args.page_nav_div_id = 'table-page-nav';
    table_args.page_nav_class = 'page_nav';
    table_args.page_nav_id_prefix = 'tm';
    table_args.page_class_str = 'page_nav_link';
    table_args.page_onmouse_str = '';
    table_args.tot_pages_shown = 9;
    table_args.page = page;
    table_args.head_row_args = {
        head_row_class_str : 'default-table-header',
        header_tooltip : '%column_name%'
    };
    table_args.sort_col = sort_col;
    table_args.sort_dir = sort_dir;
    table_args.page_onclick = 'create_table(%%,%sort_col%,%sort_dir%,false)';
    table_args.sort_onclick = 'create_table(%%,%column_name%,%sort_dir%,false)';                                                                                                                                                                                              
    table_args.row_onclick = "mod_table_entry('"+table_name+"','%row_id%');";
    table_args.row_onmouseenter = "add_class('default-table-row-highlight','%row_id%')"; 
    table_args.row_onmouseleave = "remove_class('default-table-row-highlight','%row_id%')";
    table_args.add_callback = function(response) {
        document.getElementById('table-unique-col').value = '';
        for (var i = 0; i < response.meta_data.length; i++) {
            var data_type = response.meta_data[i].data_type
            if (data_type.match(/unique/)) {
                document.getElementById('table-unique-col').value = response.meta_data[i].column_name;
            }
        }
        //
        if (document.getElementById('table-unique-col').value == '') {
            alert("Error: No unique column found for table: "+table_name);
        }
        //
        var button = "<br><button id=\"create-new-entry\" type=\"button\" onclick=\"mod_table_entry('"+table_name+"','');\">Create a New Entry</button>";
        document.getElementById('table-div').innerHTML += button;
    }
    //
    create_standard_table(table_args);
}
//
// gets all of the entry data to generate the form with
function mod_table_entry(table_name,row_id) {    
    //
    var sql_args = {};
    var meta_args = {};
    var data_sql = '';
    var meta_sql = '';
    //
    meta_args.cmd = 'SELECT';
    meta_args.table = 'table_meta_data';
    meta_args.where = [['in_tables','REGEXP','(^|%)'+table_name+'(%|$)'],['use_on_pages','REGEXP','table_maintenance'],['data_type','NOT REGEXP','hidden']];
    meta_args.orderBy = [['order_index','ASC']]; 
    meta_sql = gen_sql(meta_args);
    //
    // setting table name in hidden field
    document.getElementById('table-selected').value = table_name;
    //
    if (row_id != '') {
        var unique_col = document.getElementById('table-unique-col').value;
        if (unique_col == '') {alert("Error: No unique column found for table: "+table_name); return;}
        var unique_val = document.getElementById(row_id+"-"+unique_col).innerHTML;
        //
        // setting unique val into hidden field
        document.getElementById('table-unique-val').value = unique_val;
        // 
        // creating data and meta sql statments 
        sql_args.cmd = 'SELECT';
        sql_args.table = table_name;
        sql_args.where = [[unique_col,'LIKE',unique_val]];
        data_sql = gen_sql(sql_args);
        //
        ajax_fetch_db(data_sql,meta_sql,create_table_edit_form);
    }
    else {
        //
        document.getElementById('table-unique-val').value = '';
        //
        ajax_fetch_db(meta_sql,'',create_table_edit_form);
    }
    
}
//
// creates the edit table row form
function create_table_edit_form(data_arr) {
    "use strict"
    //
    // if no meta data is returned then an array is output by the fetch_db function
    if (Array.isArray(data_arr)) {
        var row_data = {};
        var meta_data = data_arr;
        for (var i = 0; i < meta_data.length; i++){
            row_data[meta_data[i].column_name] = '';
        }
    }
    else {
        var row_data = data_arr.data[0];
        var meta_data = data_arr.meta_data;
    }
    //
    // setting modify header
    document.getElementById('modify-header').innerHTML = 'Modifying Table: '+document.getElementById('table-selected').value;
    //
    var form_out = '<form id="update-table-data">';
    form_out += '<fieldset class="fieldset-default">'
    form_out += '<legend>Entry Row Values</legend>'
    //
    var first_id = '';
    for (var i = 0; i < meta_data.length; i++) {
        var col = meta_data[i];
        var disabled = '';
        //
        if (col.data_type.match(/locked/)) {disabled = 'disabled';}
        if (!(first_id) && !(disabled)) {first_id = col.column_name+'-input';}
        form_out += '<label class="label-large">'+col.column_nickname+':</label>';
        if (meta_data[i].data_type.match(/text/)) {
            form_out += '<textarea id="'+col.column_name+'-input" name="'+col.column_name+'" rows="4" cols="60"></textarea>'
        }
        else {
          form_out += '<input id="'+col.column_name+'-input" type="text" name="'+col.column_name+'" class="input-long" value="" onkeyup="remove_class(\'invalid-field\',this.id)" onblur="remove_class(\'invalid-field\',this.id)" '+disabled+'></input>';
        }
        if (col.data_type.match(/skip/)) {form_out += '&nbsp;&nbsp;&nbsp;<label class="label-5em">Skip Field</label><input id="'+col.column_name+'-skip-checkbox" type="checkbox" onclick="toggle_disabled(\''+col.column_name+'-input\')">'}
        form_out += '<br>';
    }
    //
    form_out += '</fieldset>'
    form_out += '</form>';
    form_out += "<label id=\"form-errors\" class=\"error-msg hidden-elm\">Form errors are highlighted in red</label><br>";
    document.getElementById('modify-table-form').innerHTML = form_out;
    //
    // adding two buttons onto the page to modify or delete
    var buttons = '<br>';
    if (document.getElementById('table-unique-val').value == '') {
        buttons += "<button id=\"insert-row\" type=\"button\" onclick=\"submit_table_changes('INSERT','"+document.getElementById('table-selected').value+"')\">Insert Row</button>";
    }
    else {
        buttons += "<button id=\"update-row\" type=\"button\" onclick=\"submit_table_changes('UPDATE','"+document.getElementById('table-selected').value+"')\">Update Row</button>";
    }
    buttons += "&nbsp;&nbsp;&nbsp;";
    buttons += "<button id=\"delete-row\" type=\"button\" onclick=\"submit_table_changes('DELETE','"+document.getElementById('table-selected').value+"')\">Delete Row</button>";
    document.getElementById('modify-table-form').innerHTML += buttons;
    //
    // populating fields on the form
    var populate_form_args = {}
    populate_form_args.data_arr = row_data;
    populate_form_args.form_id = 'update-table-data';
    process_form_data(populate_form_args)
    //
    document.getElementById(first_id).focus();
}
//
// this fuction excecutes the desired command on the data table
function submit_table_changes(cmd,table_name) {
    
    //
    var name_val_obj = {};
    var sql_args = {};
    sql_args.cmd = cmd;
    sql_args.table = document.getElementById('table-selected').value;
    if (cmd != 'DELETE') {
        name_val_obj = get_all_form_values('update-table-data','');
        sql_args.cols = [];
        sql_args.vals = [];
        for (var prop in name_val_obj) {
            sql_args.cols.push(prop);
            sql_args.vals.push(name_val_obj[prop]);
        }
    }
    if (cmd != 'INSERT') {
        var unique_col = document.getElementById('table-unique-col').value;
        var unique_val = document.getElementById('table-unique-val').value;
        sql_args.where = [[unique_col,'LIKE',unique_val]]
    }
    //
    var sql = gen_sql(sql_args);
    var callback = function() {
        var curr_page = document.getElementById('table-page-nav').dataset.currPage;
        var sort_col = document.getElementById('table-page-nav').dataset.sortCol;
        var sort_dir = document.getElementById('table-page-nav').dataset.sortDir;
        create_table(curr_page,sort_col,sort_dir);
    }
    //
    if (cmd != 'DELETE') {
        var basic_val_error = basic_validate('modify-table-form','comments');
        if (basic_val_error) {remove_class('hidden-elm','form-errors'); return;}
        else {add_class('hidden-elm','form-errors');}
    }
    //
    var cont = false;
    if (cmd == 'INSERT') {
        cont = confirm("Are you sure you want to INSERT this data into table: "+table_name);
    }
    else if (cmd == 'UPDATE') {
        cont = confirm("Are you sure you want to UPDATE this data in table: "+table_name);
    }
    else if (cmd == 'DELETE') {
        cont = confirm("Are you sure you want to DELETE this data from table: "+table_name);
    }
    else {
        cont = confirm("Are you sure you want to execute the "+cmd+" command on table: "+table_name);        
    }
    if (!(cont)) {return;}
    //
    ajax_exec_db(sql,callback)
}