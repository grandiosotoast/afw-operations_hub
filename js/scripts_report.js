////////////////////////////////////////////////////////////////////////////////
//////////////       This file holds the functions that are only     ///////////
//////////////       associated with employee data reporting         ///////////
////////////////////////////////////////////////////////////////////////////////
"use strict";
//
// generates the employe table on the report page
function report_emp_table(page,sort_col,sort_dir,toggle) {   
    //
    // creating argument objects
    var emp_table_args = {};
    var data_sql_args = {}
    var meta_sql_args = {}
    var department = '.'
    //
    // getting page elements
    emp_table_args.department = document.getElementById('department').value;
    //
    if (!!(emp_table_args.department)) {
        department = emp_table_args.department;
        if (department == 'all') {department = '.';}
    }
    //
    data_sql_args.cmd = 'SELECT';
    data_sql_args.table = 'employee_info';
    data_sql_args.where = [['department','REGEXP',department]];
    data_sql_args.order_by = [[sort_col,sort_dir]];
    if (!(emp_table_args.show_inactive)) {
        data_sql_args.where.push(['emp_status','LIKE','active'])
    }
    meta_sql_args.cmd = 'SELECT';
    meta_sql_args.table = 'table_meta_data';
    meta_sql_args.where = [['in_tables','REGEXP','(^|%)employee_info(%|$)'],['use_on_pages','REGEXP','.'],['use_in_html_tables','REGEXP','employee_table']];
    meta_sql_args.order_by = [['order_index','ASC']];
    emp_table_args.data_sql_args = data_sql_args;
    emp_table_args.meta_sql_args = meta_sql_args;
    //
    // creating argument object 
    emp_table_args.department = document.getElementById('department').value;
    emp_table_args.table_output_id = 'employee-table-div';
    emp_table_args.table_id = 'employee_table';
    emp_table_args.table_class = 'default-table';
    emp_table_args.row_id_prefix = 'emp-row-';
    emp_table_args.table_data_cell_class = 'default-table-td'; 
    emp_table_args.row_onclick = "create_production_report('report_emp_data','report_data_div','%department%','%emp_id%'); ";
    emp_table_args.row_onmouseenter = "add_class('default-table-row-highlight','%row_id%')"; 
    emp_table_args.row_onmouseleave = "remove_class('default-table-row-highlight','%row_id%')";
    emp_table_args.head_row_args = {
        'sortable' : true,
        'sort_col' : sort_col,
        'sort_dir' : sort_dir,
        'sort_onclick_str' : "report_emp_table(%%,'%column_name%','%sort_dir%',false)"
    };
    emp_table_args.page_nav_args = {
        'curr_page' : page,
        'sort_col' : sort_col,
        'sort_dir' : sort_dir,
        'tot_pages_shown' : 9,
        'num_per_page' : 10,
        'page_nav_div_id' : 'emp-table-page-nav',
        'id_prefix' : 'emp',
        'page_nav_class' : 'page_nav',
        'class_str' : 'page_nav_link',
        'onclick_str' : "report_emp_table(%%,'"+sort_col+"','"+sort_dir+"',false);",
        'onmouse_str' : ''
    };
    //
    // creating inital employee table
    if (!(document.getElementById(emp_table_args.table_id))) {
        create_standard_table(emp_table_args);
    }
    //
    if (toggle == true) {
        toggle_view_element_button('show_employee_table','employee-table-div','Hide Employee Table','Show Employee Table');
        if (document.getElementById('employee-table-div').className.match('hidden-elm')) {
            remove_class('hidden-elm','get_emp_data_all');
        }
        else {
            add_class('hidden-elm','get_emp_data');
        }
    }
    else {
        create_standard_table(emp_table_args);
    }
}
//
// creates the data columns table for the report page
function show_data_columns(department,out_id,button_id,toggle,reset) { 
    var sql_args = {};
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
    if (CONSTANTS.DEPT_TABLES.hasOwnProperty(department)) {
        sql_args = {};
        sql_args.cmd = 'SELECT';
        sql_args.table = 'table_meta_data';
        sql_args.where = [['in_tables','REGEXP','(^|%)employee_data(%|$)|(^|%)'+CONSTANTS.DEPT_TABLES[department]+'(%|$)']];
        sql_args.where.push(['use_on_pages','REGEXP','(^|%)report(%|$)']);
        sql_args.where.push(['use_in_html_tables','REGEXP','(^|%)report_'+department+'(%|$)']);
        sql_args.where.push(['use_in_html_tables','REGEXP','(^|%)column_selection_table(%|$)']);
        sql_args.order_by = [['order_index','ASC']];  
        meta_sql = gen_sql(sql_args);
    }
    else {
        console.log('invalid department: '+department);
        return;
    }
    //
    // creating reset button and modifying show button
    if (!(document.getElementById('restore-data-col-defaults'))) {
        var reset_onclick = function() {
            show_data_columns(document.getElementById('department').value,out_id,button_id,false,true);
            show_update_button('get_emp_data','report-table','Show Changes');
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
        button.addEventListener('click',show_data_columns.bind(null,document.getElementById('department').value,out_id,button_id,true, false));
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
    //
    var callback = function(response) {
        var args = {};
        args.data = response.meta_data;
        args.preset_data = response.preset_data[0];
        args.all_onclick_fun = "show_update_button('get_emp_data','report-table','Show Changes'); remove_class('hidden-elm','restore-data-col-defaults');";
        document.getElementById(out_id).removeChild(document.getElementById('data_sel_cols_table'));
        make_data_columns_table(document.getElementById(out_id),args);
        update_sort_by_col('sort-by-col-tr', 'secd-sort');
    }
    //
    if (reset) {
        ajax_fetch([meta_sql,preset_sql],['meta_data','preset_data'],callback);
    }
}
//
// function to get data and create a data report
function create_production_report(parent_form_id,report_div_id,department,emp_id) {
    //
    var report_args = {};
    var sql_args = {};
    var preset_sql = '';
    var meta_sql = '';
    var data_sql = '';
    //
    // creating new get data button to prevent stacking of event handlers
    var get_data_button = document.getElementById('get_emp_data');
    var new_btn = document.createElement("BUTTON");
    new_btn.appendChild(document.createTextNode("Get All Employee Data"));
    new_btn.id = "get_emp_data"
    new_btn.className = "hidden-elm"
    new_btn.addEventListener("click",function(){ 
        department = document.getElementById(parent_form_id).elements.namedItem("department").value
        create_production_report('report_emp_data','report_data_div',department,emp_id);
    });
    get_data_button.parentNode.replaceChild(new_btn,get_data_button);
    //
    // getting all form information
    var name_val_obj = get_all_form_values(parent_form_id,'');
    var ts_obj = to_and_from_timestamps();
    var data_range = [
        find_pay_period(ts_obj.from_ts)[0],
        find_pay_period(ts_obj.to_ts)[1]
    ]
    //
    // processing data selection table
    var sel_cols = false;
    var col_objs = false;
    if (!!(document.getElementById('data_sel_cols_table'))) {
        var all_children = document.getElementById('data_sel_cols_table').getElementsByTagName("*");
        col_objs = {};
        sel_cols = [];
        // stepping through children
        for (var i = 0; i < all_children.length; i++) {
            if (all_children[i].nodeType != 1) {continue;}
            if (all_children[i].nodeName.toUpperCase() != 'INPUT') {continue;}
            if (all_children[i].disabled == true) {continue;}
            if (all_children[i].checked == false) {continue;}
            //
            var id_arr = all_children[i].id.split('-');
            if (all_children[i].id.match('-viewcol-')) {var obj = {}; obj.column_name = id_arr[0]; col_objs[id_arr[0]] = obj; sel_cols.push(id_arr[0]);}
            if (all_children[i].id.match('-sortby-')) {name_val_obj['secd-sort'] = id_arr[0];}
            if (all_children[i].id.match('-totaltype-')) {
                if (!!(col_objs[id_arr[0]])) {col_objs[id_arr[0]].total_type = id_arr[2];}
            }
        }
        //
        // ensuring sorting columns are included in selection 
        if (sel_cols.indexOf(name_val_obj['prime-sort']) < 0) {var obj = {}; obj.column_name = name_val_obj['prime-sort']; obj.total_type = 'none'; col_objs[name_val_obj['prime-sort']] = obj; sel_cols.push(name_val_obj['prime-sort']);}
        if (sel_cols.indexOf(name_val_obj['secd-sort'])  < 0) {var obj = {}; obj.column_name = name_val_obj['secd-sort'];  obj.total_type = 'none'; col_objs[name_val_obj['secd-sort']] = obj;  sel_cols.push(name_val_obj['secd-sort']);}
    }
    //
    // setting report args
    report_args.output_id = 'report_data_div';
    report_args.report_type = '';
    if (name_val_obj['report-type-detailed'])  { report_args.report_type += name_val_obj['report-type-detailed']+'%';}
    if (name_val_obj['report-type-summary'])   { report_args.report_type += name_val_obj['report-type-summary']+'%';}
    if (name_val_obj['report-type-no_totals']) { report_args.report_type += name_val_obj['report-type-no_totals']+'%';}
    if (name_val_obj['report-type-no_sect_heads']) { report_args.report_type += name_val_obj['report-type-no_sect_heads']+'%';}
    report_args.department = name_val_obj['department'];
    report_args.sel_cols = sel_cols;
    report_args.col_objs = col_objs;
    report_args.report_head_function = make_production_report_header;
    report_args.report_section_head_function = make_production_report_sect_header;
    report_args.prime_sort = name_val_obj['prime-sort'];
    report_args.prime_sort_dir = name_val_obj['prime-sort-dir'];
    report_args.secd_sort = name_val_obj['secd-sort'];
    report_args.secd_sort_dir = name_val_obj['secd-sort-dir'];
    report_args.sect_cols = [name_val_obj['prime-sort']];
    if (name_val_obj['prime-sort'] == 'emp_last_name') {report_args.sect_cols.push('emp_first_name');}
    report_args.emp_id = emp_id;
    report_args.from_ts = ts_obj.from_ts;
    report_args.to_ts = ts_obj.to_ts;
    report_args.data_sql_args = {
        'where' : [['date','BETWEEN',data_range[0]+"' AND '"+data_range[1]],['entry_status','LIKE','submitted']]
    }    
    var id_mtype = 'contains';
    if (emp_id) { id_mtype = 'exact';}
    report_args.display_params = {
        'emp_id' : {'value' : emp_id, 'data_type' : 'string', 'match_type' : id_mtype},
        'date' : {'value' : [ts_obj.from_ts.split(' ')[0],ts_obj.to_ts.split(' ')[0]], 'data_type' : 'date', 'match_type' : 'between'}
    }
    // setting section total id formats
    if ((report_args.prime_sort == 'emp_id') || (report_args.prime_sort == 'emp_last_name')) {
        report_args.total_id_format_str = 'section-total-%emp_id%';
    }
    else if (report_args.prime_sort == 'date') {
        report_args.total_id_format_str = 'section-total-%date%';
    }
    //
    // setting data_table to search
    var dept_table = '';
    if (CONSTANTS.DEPT_TABLES.hasOwnProperty(report_args.department)) { dept_table = CONSTANTS.DEPT_TABLES[report_args.department];}
    else { console.log(' Department has no set table: '+report_args.department); return;}
    report_args.dept_table = dept_table;
    //
    // handling report preset data
    sql_args = {};
    sql_args.cmd = 'SELECT';
    sql_args.table = 'report_presets';
    sql_args.where = [['preset_index','LIKE',name_val_obj['preset-report']]]
    preset_sql = gen_sql(sql_args);
    //
    // creating meta sql statement
    var sql_args = {};
    sql_args.cmd = 'SELECT';
    sql_args.table = 'table_meta_data';
    sql_args.where = [['in_tables','REGEXP','(^|%)employee_data(%|$)|(^|%)'+report_args.dept_table+'(%|$)']];
    meta_sql = gen_sql(sql_args);
    //
    var callback = function(response) {
        report_args.data = response;
        make_data_sql(report_args);
    }
    var dyn_cols_sql = 'SELECT * FROM `report_dynamic_columns` WHERE `department` REGEXP \'(^|%)'+report_args.department+'(%|$)\'';
    var sql_arr = [preset_sql,meta_sql,dyn_cols_sql];
    var name_arr = ['preset_data','meta_data','dynamic_array'];
    ajax_fetch(sql_arr,name_arr,callback)
}
//
// handles the report preset information and inputs
function make_data_sql(report_args) {
    //
    var meta_data = report_args.data.meta_data;
    var preset_data = report_args.data.preset_data[0];
    var dynamic_array = report_args.data.dynamic_array;
    var data_sql = '';
    var col_meta_data = {};
    var dynamic_cols = {};
    //
    // indexing col_meta_data by name
    for (var i = 0; i < meta_data.length; i++) {
        col_meta_data[meta_data[i].column_name] = meta_data[i]
    }
    //
    // indexing dynamic cols by name 
    for (var i = 0; i < dynamic_array.length; i++) {
        dynamic_cols[dynamic_array[i].column_name] = dynamic_array[i];
    }
    delete report_args.data.dynamic_array;
    report_args.dynamic_cols = dynamic_cols;
    //
    // setting data sql arguments 
    var sql_args = {};
    for (var arg in report_args.data_sql_args) { sql_args[arg] = report_args.data_sql_args[arg];}
    if (!(sql_args.where instanceof Array)) { sql_args.where = [];}
    sql_args.cmd = 'SELECT';
    sql_args.table = 'employee_data';
    sql_args.inner_join = Array(['employee_info','employee_data.emp_id','employee_info.emp_id']);
    if (report_args.dept_table != 'none') { 
        sql_args.inner_join.push([report_args.dept_table,'employee_data.entry_id',report_args.dept_table+'.entry_id']);
    }
    sql_args.where.push(['department','LIKE',report_args.department]);
    if (preset_data.preset_where != 'null') {
        //
        // parsing where JSON with error handling
        try {
            var where_arr = JSON.parse(preset_data.preset_where);
            for (var w = 0; w < where_arr.length; w++) {
                sql_args.where.push(where_arr[w])
            }
        }
        catch(err) {
            var error = err;
            console.log(error);
            console.log(preset_data.preset_where);
            alert('Error parsing report preset "where" information, check console.');
        }            
    }
    sql_args.order_by = Array([report_args.prime_sort,report_args.prime_sort_dir],
                              [report_args.secd_sort,report_args.secd_sort_dir]);
    //
    // modifying data sql args to make columns table specific
    for (var i = 0; i < sql_args.where.length; i++) {
        var name = sql_args.where[i][0]
        var col = col_meta_data[name]
        if (col.in_tables.match('(^|%)employee_data(%|$)')) {
            name = 'employee_data.'+name
        }
        else if (col.in_tables.match('(^|%)'+report_args.dept_table+'(%|$)')) {
            name = report_args.dept_table+'.'+name
        }
        sql_args.where[i][0] = name
    }
    for (var i = 0; i < sql_args.order_by.length; i++) {
        var name = sql_args.order_by[i][0]
        var col = col_meta_data[name]
        if (col.in_tables.match('(^|%)employee_data(%|$)')) {
            name = 'employee_data.'+name
        }
        else if (col.in_tables.match('(^|%)'+report_args.dept_table+'(%|$)')) {
            name = report_args.dept_table+'.'+name
        }
        sql_args.order_by[i][0] = name
    }
    
    data_sql = gen_sql(sql_args);
    //
    // fetching table specific meta_data
    var sql_args = {};
    sql_args.cmd = 'SELECT';
    sql_args.table = 'table_meta_data';
    sql_args.where = [['in_tables','REGEXP','(^|%)employee_data(%|$)|(^|%)'+report_args.dept_table+'(%|$)'],['use_on_pages','REGEXP','(^|%)report(%|$)'],['use_in_html_tables','REGEXP','(^|%)report_'+report_args.department+'(%|$)']];
    sql_args.order_by = [['order_index','ASC']];    
    if (!!(report_args.sel_cols)) {
        sql_args.where.push(['column_name','REGEXP',report_args.sel_cols.join('$|')]); sql_args.where[sql_args.where.length-1][2] += '$';
    }
    var meta_sql = gen_sql(sql_args);
    //
    // getting data and making report
    var callback = function(response) {
        report_args.meta_data = response.meta_data;
        report_args.data = response.data;
        make_report(report_args);
    }
    var sql_arr = [data_sql,meta_sql];
    var name_arr = ['data','meta_data'];
    ajax_fetch(sql_arr,name_arr,callback)
}
//
// this function handles creation of the report header for production reports 
function make_production_report_header(args) {
    //
    var br = document.createElement('BR');
    var head = document.createElementWithAttr('DIV',{'id':'report-header'});
    head.style['padding'] = '5px';
    head.style['border-top'] = 'solid 1px rgb(0,0,0)';
    //
    // creating report info head
    var span = document.createElement('SPAN');
    span.style['text-align'] = 'center';
    span.style['display'] = 'block';
    span.style['width'] = '100%';
    if (args.emp_id) {
        span.textContent = 'Report for Employee: '+args.emp_id;
    }
    else {
        span.textContent = 'Report for Department: '+toTitleCase(args.department.replace('_',' '));
    }
    head.appendChild(span);
    head.addTextNode('\u00A0\u00A0\u00A0\u00A0Date Range: '+args.from_ts+' : '+args.to_ts);
    head.appendChild(br.cloneNode('true'));
    head.appendChild(br.cloneNode('true'));
    //
    return head;
}
//
// this function makes the section heads for the production report
function make_production_report_sect_header(data_row,args) {
    var prime_sort = args.prime_sort;
    //
    var sect_head = data_row[prime_sort];
    if (prime_sort == 'date') {sect_head = 'Date: '+data_row[prime_sort];}
    else if (prime_sort == 'emp_id') {sect_head = 'Employee ID: '+data_row[prime_sort];}
    else if (prime_sort == 'emp_last_name') {sect_head = 'Name: '+data_row['emp_last_name']+', '+data_row['emp_first_name'];}
    //
    return sect_head;
}
//
//
function make_report(report_args) {
    //
    // getting required arguments 
    var output_id = report_args.output_id;
    var col_meta_data = report_args.meta_data;
    var col_objs = report_args.col_objs;
    var data_arr = report_args.data;
    var prime_sort = report_args.prime_sort;
    //
    // setting defaults for additional arguments 
    var no_totals = false;
    var summary = false;
    var no_sect_headers = false;
    var head_row_args = {};
    var sect_cols = [];
    var report_id = 'report-table'
    var total_id_format_str = 'section-total';
    var report_head_function = false;
    var report_section_head_function = false;
    //
    //// processing additional report arguments
    if (report_args.sect_cols) { sect_cols = report_args.sect_cols;}
    else { report_args.sect_cols = sect_cols;}
    //
    if (report_args.report_id) { report_id = report_args.report_id;}
    else { report_args.report_id = report_id;}
    //
    if (report_args.total_id_format_str) { total_id_format_str = report_args.total_id_format_str;}
    else { report_args.total_id_format_str = total_id_format_str;}
    //
    if (report_args.report_head_function) { report_head_function = report_args.report_head_function;}
    else { report_args.report_head_function = report_head_function;}
    //
    if (report_args.report_section_head_function) { report_section_head_function = report_args.report_section_head_function;}
    else { report_args.report_section_head_function = report_section_head_function;}  
    //
    if (report_args.report_type.match(/(^|%)no_totals(%|$)/)) { no_totals = true;}
    else { report_args.no_totals = no_totals;}    
    //
    if (report_args.report_type.match(/(^|%)summary(%|$)/)) { summary = true;}
    else { report_args.summary = summary;}   
    //
    if (report_args.report_type.match(/(^|%)no_sect_heads(%|$)/)) { no_sect_headers = true;}
    else { report_args.no_sect_headers = no_sect_headers;}
    ////
    //
    if (no_sect_headers) { sect_cols = [];}
    //
    // updating col_meta_data with col_objs data
    // converting meta_data array to be an object indexed by column_name
    report_args.col_name_meta = {};
    for (var i = 0; i < col_meta_data.length; i++) {
        if (col_objs.hasOwnProperty(col_meta_data[i].column_name)) { 
            for (var prop in col_objs[col_meta_data[i].column_name]) { col_meta_data[i][prop] = col_objs[col_meta_data[i].column_name][prop];}
        }
        report_args.col_name_meta[col_meta_data[i].column_name] = col_meta_data[i];
    }
    //
    // setting table head arguments
    head_row_args.sortable = false;
    head_row_args.id_prefix = "report-";
    head_row_args.class_str = "report-column-header";
    head_row_args.leading_cells =  [document.createElementWithAttr('TD',{'class':'report-spacer-td'})];
    head_row_args.skip_cols = sect_cols.slice(0);
    for (var prop in report_args.head_row_args) { head_row_args[prop] = report_args.head_row_args[prop];}
    //
    for (var i = 0; i < col_meta_data.length; i++) {
        if (col_meta_data[i].column_type.match(/total/)) {head_row_args.skip_cols.push(col_meta_data[i].column_name)}
    }
    //
    // setting report body arguments  
    var sect_head_args = {}
    var row_args = {};
    sect_head_args.prev_id   = '';
    sect_head_args.prev_sect = '';
    sect_head_args.td_inner  = '';
    sect_head_args.td_class  = 'report-table-section-head';
    sect_head_args.colspan   = col_meta_data.length - 1;
    row_args.col_meta_data = col_meta_data;
    row_args.dynamic_cols = report_args.dynamic_cols;
    row_args.sect_cols = sect_cols;
    //
    // setting totals args and initializing the totals objects
    var total_args = {}
    var totals_obj = {};
    total_args.sect_cols = sect_cols;
    total_args.skip_cols = [];
    total_args.dynamic_cols = report_args.dynamic_cols;
    totals_obj['section_count'] = {};
    totals_obj['section_total'] = {};
    totals_obj['overall_count'] = {};
    totals_obj['overall_total'] = {};
    report_args.section_ids = [];
    //
    var skip = true;
    for (var total in totals_obj) {
        for (var i = 0; i < col_meta_data.length; i++) {
            var col = col_meta_data[i];
            if (sect_cols.indexOf(col.column_name) >= 0) {totals_obj[total][col.column_name] = ''; continue;}
            if (col.total_type.match(/avg|sum/)) { totals_obj[total][col.column_name] = 0; skip = false;}
            else { 
                totals_obj[total][col.column_name] = '';
                if (skip) {total_args.skip_cols.push(col.column_name);}
            }
        }
    }
    report_args.skip_cols = total_args.skip_cols.slice(0);
    //
    // performing report data precalculations
    if (data_arr.length > 0) {
        report_args.called_funs = {};
        for (var col in report_args.dynamic_cols) {
            col = report_args.dynamic_cols[col];
            if (col.column_type != 'precalculate') { continue;}
            var col_funct = REPORT_FUNCTIONS[col.col_function]
            if (!(col_funct)) {console.log('Error: No function for column: '+col.column_name); continue;}
            col_funct(col.column_name,report_args);
        }
    }
    //
    // creating report head
    if (report_head_function) {
        var head = report_args.report_head_function(report_args);
        document.getElementById(output_id).replaceChild(head,document.getElementById(head.id))
    }
    //
    // creating report table and checking length of data array
    var table = document.createElementWithAttr('TABLE',{'id':report_id,'class':'report-table'});
    make_head_rows(table,col_meta_data,head_row_args)
    document.getElementById(output_id).replaceChild(table,document.getElementById(table.id));
    if (data_arr.length == 0) {
        var tr = document.createElement('TR');
        var td = document.createElementWithAttr('TD',{'colSpan':(col_meta_data.length - 1)});
        td.addTextNode('***** No Data for Selected Report Parameters *****');
        tr.appendChild(td);
        table.appendChild(tr);
        return;
    }
    //
    // creating the report body
    var row = null;
    var rows = null;
    var i = 0;
    while (i < data_arr.length) {
        //
        // testing is data row should be displayed
        var display = check_display(data_arr[i],report_args['display_params']);
        if (!(display)) {
            data_arr.splice(i,1);
            continue;
        }
        
        //
        // testing for new section
        if (data_arr[i][prime_sort].toLowerCase() != sect_head_args.prev_sect) {
            //
            if ((i != 0) && (!(no_totals))) {
                //
                // outputting a section total
                total_args.total_name = 'section';
                total_args.total_id = total_id;
                report_args.section_ids.push(total_id);
                rows = make_report_total_tr(total_args,totals_obj,col_meta_data)
                //
                if (rows[0]) { table.appendChild(rows[0]);}
                if (rows[1]) { table.appendChild(rows[1]);}
            }
            //
            sect_head_args.prev_sect = data_arr[i][prime_sort].toLowerCase();
            if (!(no_sect_headers)) {
                //
                // outputting a section header
                sect_head_args.prev_id = data_arr[i].emp_id;
                sect_head_args.td_inner = data_arr[i][prime_sort];
                if (report_section_head_function) { sect_head_args.td_inner = report_section_head_function(data_arr[i],report_args);}
                sect_head_args.sect = data_arr[i][prime_sort]
                row = make_report_sect_row(sect_head_args)
                //
                table.appendChild(row);
            }
        }
        //
        // setting next total id
        var total_id = total_id_format_str
        for (var prop in data_arr[i]) { total_id = total_id.replace('%'+prop+'%',data_arr[i][prop]);}
        //
        row_args.data_entry = data_arr[i];
        row = make_report_data_tr(row_args,totals_obj);
        if (!(summary)) { table.appendChild(row);}
        //
        i++
    }
    if (!(no_totals)) {
        //
        // outputting the final section and overall totals
        total_args.total_name = 'section';
        total_args.total_id = total_id;
        report_args.section_ids.push(total_id);
        rows = make_report_total_tr(total_args,totals_obj,col_meta_data)
        //
        if (rows[0]) { table.appendChild(rows[0]);}
        if (rows[1]) { table.appendChild(rows[1]);}
        //
        total_args.total_name = 'overall';
        total_args.total_id = 'overall';
        report_args.section_ids.push('overall');
        rows = make_report_total_tr(total_args,totals_obj,col_meta_data)  
        //
        if (rows[0]) { table.appendChild(rows[0]);}
        if (rows[1]) { table.appendChild(rows[1]);}
    }
    //
    // handling total and special cols
    for (var col in report_args.dynamic_cols) {
        //
        col = report_args.dynamic_cols[col];
        // handling cases when totals need to be skipped
        if (col.column_type == 'total') {
            if (!(report_args.col_name_meta[col.column_name])) { continue;}
            if (no_totals) { continue;}
        }
        // skipping everything that isn't a total or a special
        else if (col.column_type != 'special') {
            continue;
        }
        //
        var col_funct = REPORT_FUNCTIONS[col.col_function]
        if (!(col_funct)) {console.log('Error: No function for column: '+col.column_name); continue;}
        col_funct(col.column_name,report_args);
    }  
    //
    // handling async columns
    for (var col in report_args.dynamic_cols) {
        //
        col = report_args.dynamic_cols[col];
        // handling cases when totals need to be skipped
        if (col.column_type != 'async') { continue;}
        //
        var col_funct = REPORT_FUNCTIONS[col.col_function]
        if (!(col_funct)) {console.log('Error: No function for column: '+col.column_name); continue;}
        col_funct(col.column_name,report_args);
    } 
    console.log(report_args);
}
//
// this checks if a row should be displayed based on the reports display params
function check_display(data_row,display_params) { 
    var display = true;
    if (!(display_params)) { return display;}
    //
    for (var col in display_params) {
        var value = display_params[col]['value'];
        var dtype = display_params[col]['data_type'];
        var mtype = display_params[col]['match_type'];
        //
        if (dtype == 'string') {
            if (mtype == 'contains') {
                if (!(data_row[col].match(value))) { display = false;}    
            }
            else if (mtype == 'exact') {
                if (!(data_row[col].match('^'+value+'$'))) { display = false;}    
            }
            else {
                console.log('Unknown match type: '+mtype);
            }
        }
        else if (dtype == 'date') {
            if (mtype == 'between') {
                var st_date = new Date(value[0].split('-')[0],Number(value[0].split('-')[1])-1,value[0].split('-')[2]);
                var en_date = new Date(value[1].split('-')[0],Number(value[1].split('-')[1])-1,value[1].split('-')[2]);
                var date = new Date(data_row[col].split('-')[0],Number(data_row[col].split('-')[1])-1,data_row[col].split('-')[2]);
                if (!((date >= st_date) && (date <= en_date))) { display = false;}    
            }
            else {
                console.log('Unknown match type: '+mtype);
            }
        }
        else {
            console.log('Unknown data type: '+dtype);
        }
    }
    //
    return display;
}
//
// this creates the section header for the report
function make_report_sect_row(args) {
    var row = document.createElementWithAttr('TR',{});
    var td = document.createElementWithAttr('TD',{'class':'report-table-section-head','colSpan':args.colspan});
    //
    td.textContent = args.td_inner;
    row.appendChild(td);
    //
    return row;
}
//
// this creates a row of the report and increments the totals object
function make_report_data_tr(row_args,totals_obj) {
    //
    //
    var data_entry = row_args.data_entry;
    var dynamic_cols = row_args.dynamic_cols;
    var col_meta_data = row_args.col_meta_data;
    var sect_cols = row_args.sect_cols;
    //
    // calculating regular dynamic cols
    for (var i = 0; i < col_meta_data.length; i++) {
        if (dynamic_cols.hasOwnProperty(col_meta_data[i].column_name)){
            var col = dynamic_cols[col_meta_data[i].column_name];
            if (col.column_type == 'regular') {
                var col_funct = REPORT_FUNCTIONS[col.col_function]
                if (!(col_funct)) {console.log('Error: No function for column: '+col.column_name); continue;}
                col_funct(col.column_name,data_entry,dynamic_cols);
            }
            else if (col.column_type == 'special') {
                data_entry[col.column_name] = NaN;
            }
        }
    }
    //
    // creating data line
    var row = document.createElementWithAttr('TR',{'id':'data-entry-'+data_entry.entry_id});
    var td = document.createElementWithAttr('TD',{'class':'report-spacer-td'});
    row.appendChild(td);
    //
    var td_attr = {};
    var span = null;
    var text = '';
    for (var i = 0; i < col_meta_data.length; i++) {
        var col = col_meta_data[i].column_name
        if (sect_cols.indexOf(col) >= 0) {continue;}
        if (col_meta_data[i].column_type.match(/total/)) {continue;}
        //
        if (col_meta_data[i].total_type.match(/avg|sum/)) {
            for (var total in totals_obj) {
                if (total.match(/count$/)) {totals_obj[total][col] += 1;}
                else { totals_obj[total][col] += Number(data_entry[col]);}
            }
        }
        else if (col_meta_data[i].total_type.match(/flag/)) {
            var flag = true
            if (data_entry[col] == '') { flag = false;}
            if (data_entry[col] == '0') { flag = false;}
            if (data_entry[col] == 'none') { flag = false;}
            for (var total in totals_obj) {
                if (flag) { totals_obj[total][col] = 'X';}
            }
        }
        //
        td_attr = {'id':'data-entry-'+data_entry.entry_id+'-'+col,'class':'report-data-td'};
        td = document.createElementWithAttr('TD',td_attr);
        text = data_entry[col];
        if ((col == 'comments') && (data_entry[col] != '')) { 
            span = document.createElementWithAttr('SPAN',{'class':'link-blue'});
            span.id = 'comments-'+data_entry.entry_id;
            span.addEventListener('click',toggle_innerHTML.bind(null,span.id,'C',data_entry[col]));
            span.textContent = 'C'
            td.appendChild(span);
        } 
        else {
            process_data_type(data_entry[col],col_meta_data[i].data_type,td,null)
        }
        row.appendChild(td);
    }
    //
    return row;
}
//
// this outputs a total row for the report
function make_report_total_tr(total_args,totals_obj,col_meta_data) {
    //
    var dynamic_cols = total_args.dynamic_cols;
    var sect_cols = total_args.sect_cols;
    var total_name = total_args.total_name;
    var disp_name = total_args.total_name.replace('_',' ');
    var dynamic = 0;
    var regular = 0;
    disp_name = toTitleCase(disp_name);
    //
    var row = document.createElementWithAttr('TR',{'id':total_args.total_id});
    var td  = document.createElementWithAttr('TD',{'id':'report-spacer-td','class':'report-spacer-td'});
    row.appendChild(td);
    td = document.createElementWithAttr('TD',{'id':'report-data-td','class':'report-data-td'});
    td.colSpan = total_args.skip_cols.length;
    td.textContent = disp_name+' Total:';
    row.appendChild(td);
    //
    // outputting totals and resetting their values
    for (var i = 0; i < col_meta_data.length; i++) {
        if (total_args.skip_cols.indexOf(col_meta_data[i].column_name) >= 0) {continue;}
        if (sect_cols.indexOf(col_meta_data[i].column_name) >= 0) {continue;}
        //if (col_meta_data[i]['column_type'].match(/dynamic/)) { 
        //    if (dynamic_cols[col_meta_data[i]['column_name']]['column_type'].match(/special/)) { continue;}
        //    else if (dynamic_cols[col_meta_data[i]['column_name']]['column_type'].match(/total/)) { dynamic += 1; continue;}
        //} dynamic-total
        if (col_meta_data[i]['column_type'].match(/^dynamic-total$/)) { dynamic += 1; continue;}
        if (col_meta_data[i]['column_type'].match(/^dynamic-special$/)) { continue;}
        regular += 1;
        //
        var col = col_meta_data[i];
        var span = document.createElementWithAttr('SPAN',{'class':'report-data-span-'+col.total_type});
        var td = document.createElementWithAttr('TD',{'id':total_args.total_id+'-'+col.column_name,'class':'report-data-td'});
        var value = totals_obj[total_name+'_total'][col.column_name];
        var reset = '';
        //
        if (col.total_type == 'avg') {
            value = value/totals_obj[total_name+'_count'][col.column_name];
            reset = 0;
            td.style['text-align'] = 'right';
        }
        else if (col.total_type == 'sum') {
            reset = 0;
            td.style['text-align'] = 'right';
        }
        //
        totals_obj[total_name+'_total'][col.column_name] = reset;
        totals_obj[total_name+'_count'][col.column_name] = reset;
        //
        if (value !== '') { 
            span.id = total_args.total_id+'-span-'+col.column_name;
            process_data_type(value,col.data_type,span,null)
            td.appendChild(span);
        }
        row.appendChild(td);
    }
    //
    // checking if any dynamic totals exist getting thier counts to estimate col spans
    var dynamic_row = null;
    if (dynamic > 0) {
        dynamic_row = document.createElementWithAttr('TR',{'id':'special-'+total_args.total_id});
        td = document.createElementWithAttr('TD',{'id':'report-spacer-td','class':'report-spacer-td'});
        dynamic_row.appendChild(td);
        //
        td = document.createElementWithAttr('TD',{'id':'report-data-td','class':'report-data-td'});
        td.colSpan = total_args.skip_cols.length;
        td.textContent = disp_name+' Special Total:';
        dynamic_row.appendChild(td);
        //
        td = document.createElementWithAttr('TD',{'class':'report-data-td','colSpan':regular});
        for (var i = 0; i < col_meta_data.length; i++) {
            if (col_meta_data[i].column_type.match(/^dynamic-total$/)) {
                span = document.createElementWithAttr('SPAN',{'id':total_args.total_id+'-'+col_meta_data[i].column_name});
                span.style['display'] = 'inline-block';
                span.style['width'] = (100/dynamic)+'%';
                span.textContent = 'X';
                td.appendChild(span);
            }
        }
        dynamic_row.appendChild(td);
    }
    return([row,dynamic_row]);
}