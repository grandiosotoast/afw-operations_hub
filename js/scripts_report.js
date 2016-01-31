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
    data_sql_args.orderBy = [[sort_col,sort_dir]];
    if (!(emp_table_args.show_inactive)) {
        data_sql_args.where.push(['emp_status','LIKE','active'])
    }
    meta_sql_args.cmd = 'SELECT';
    meta_sql_args.table = 'table_meta_data';
    meta_sql_args.where = [['in_tables','REGEXP','(^|%)employee_info(%|$)'],['use_on_pages','REGEXP','.'],['use_in_html_tables','REGEXP','employee_table']];
    meta_sql_args.orderBy = [['order_index','ASC']];
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
    emp_table_args.page_onclick = 'report_emp_table(%%,%sort_col%,%sort_dir%,false)';
    emp_table_args.sort_onclick = 'report_emp_table(%%,%column_name%,%sort_dir%,false)';
    emp_table_args.row_onclick = "create_report('report_emp_data','report_data_div','%department%','%emp_id%'); ";
    emp_table_args.row_onmouseenter = "add_class('default-table-row-highlight','%row_id%')"; 
    emp_table_args.row_onmouseleave = "remove_class('default-table-row-highlight','%row_id%')";
    //
    // creating employee table
    create_sortable_table(emp_table_args);
    if (toggle == true) {
        toggle_view_element_button('show_employee_table','employee-table-div','Hide Employee Table','Show Employee Table');
        show_hide("emp-table-header");
        if (!!(document.getElementById("employee-table-div").className.match("hidden-elm"))) {
            remove_class("hidden-elm","get_emp_data_all")
        }
        else {
            add_class("hidden-elm","get_emp_data")
        }
    }
}
//
// creates the data columns table for the report page
function show_data_columns(department,out_id,button_id,toggle,reset) { 
    var arg_object = {};
    var sql = "";
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
        sql = "SELECT * FROM `table_meta_data` WHERE `in_tables` REGEXP '(^|%)employee_data(%|$)|(^|%)"+CONSTANTS.DEPT_TABLES[department]+"(%|$)' ";
    }
    else {
        console.log('invalid department: '+department);
        return;
    }
    sql += "AND `use_on_pages` REGEXP 'report' AND `use_in_html_tables` REGEXP 'report' ORDER BY `order_index` ASC"
    //
    // creating reset button
    var reset_onclick = "show_data_columns(document.getElementById('department').value,'data_sel_cols','show_data_cols',false,true); show_update_button('get_emp_data','report-table','Show Changes'); add_class('hidden-elm','restore-data-col-defaults');";
    var button = "<br><button id=\"restore-data-col-defaults\" type=\"button\" class=\"hidden-elm\" onclick=\""+reset_onclick+"\">Restore Defaults</button><br>";
    //
    var callback = function(response) {
        arg_object.department = department;
        arg_object.data = response.data;
        arg_object.preset_data = response.meta_data[0];
        var table = make_data_columns_table(arg_object)
        //
        // shows or hides the data column div
        if (toggle) {
            show_hide(out_id);
        }
        //
        if (document.getElementById(out_id).className.match(/hidden/i)) {
            document.getElementById(button_id).innerHTML = "Show Data Selection Columns";
        }
        else {
            document.getElementById(button_id).innerHTML = "Hide Data Selection Columns";
        }
        //
        // checking if the checkbox array needs reset or not
        if (!(reset)) {
            if (document.getElementById(out_id).innerHTML.match(/table/)) {return; }
        }
        //
        document.getElementById(out_id).innerHTML = button+table;
        var int_secd_sort = document.getElementById('secd-sort').value
        document.getElementById(int_secd_sort+'-sortby-radio').checked = true;
    }
    //
    ajax_fetch_db(sql,preset_sql,callback)
}
//
// function to get data and create a data report
function create_report(parent_form_id,report_div_id,department,emp_id) {
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
        create_report('report_emp_data','report_data_div',department,emp_id);
    });
    get_data_button.parentNode.replaceChild(new_btn,get_data_button);
    //
    // getting all form information
    var name_val_obj = get_all_form_values(parent_form_id,'');
    var ts_obj = to_and_from_timestamps();
    var from_ts = ts_obj.from_ts;
    var to_ts = ts_obj.to_ts;
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
            if (all_children[i].id.match('-viewcol-')) {var obj = {}; obj.column_name = id_arr[0]; obj.total_type = 'none'; col_objs[id_arr[0]] = obj; sel_cols.push(id_arr[0]);}
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
    report_args.report_type = name_val_obj['report-type'];
    report_args.department = name_val_obj['department'];
    report_args.sel_cols = sel_cols;
    report_args.col_objs = col_objs;
    report_args.prime_sort = name_val_obj['prime-sort'];
    report_args.prime_sort_dir = name_val_obj['prime-sort-dir'];
    report_args.secd_sort = name_val_obj['secd-sort'];// ill update name_val_obj if the data_columns exist
    report_args.secd_sort_dir = name_val_obj['secd-sort-dir'];
    report_args.emp_id = emp_id;
    report_args.from_ts = ts_obj.from_ts;
    report_args.to_ts = ts_obj.to_ts;
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
    report_args.preset_sql = preset_sql; //this is just for multi-fetch testing purposes 
    //
    // creating meta sql statement
    var sql_args = {};
    sql_args.cmd = 'SELECT';
    sql_args.table = 'table_meta_data';
    sql_args.where = [['in_tables','REGEXP','(^|%)employee_data(%|$)|(^|%)'+report_args.dept_table+'(%|$)'],['use_on_pages','REGEXP','(^|%)report(%|$)'],['use_in_html_tables','REGEXP','(^|%)report_'+report_args.department+'(%|$)']];
    sql_args.orderBy = [['order_index','ASC']];    
    if (!!(report_args.sel_cols)) {
        sql_args.where.push(['column_name','REGEXP',report_args.sel_cols.join('$|')]); sql_args.where[sql_args.where.length-1][2] += '$';
    }
    //
    meta_sql = gen_sql(sql_args);
    //
    var callback = function(response) {
        report_args.data = response;
        make_data_sql(report_args);
    }
    var calc_cols_sql = 'SELECT * FROM `report_dynamic_columns` WHERE `department` REGEXP \'(^|%)'+report_args.department+'(%|$)\'';
    var sql_arr = [report_args.preset_sql,meta_sql,calc_cols_sql];
    var name_arr = ['preset_data','meta_data','dynamic_array'];
    ajax_multi_fetch(sql_arr,name_arr,callback)
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
    // indexing dynamic cols by name 
    for (var i = 0; i < dynamic_array.length; i++) {
        dynamic_cols[dynamic_array[i].column_name] = dynamic_array[i];
    }
    delete report_args.data.dynamic_array;
    report_args.dynamic_cols = dynamic_cols;
    //
    // setting data sql properties 
    var sql_args = {};
    sql_args.cmd = 'SELECT';
    sql_args.table = 'employee_data';
    sql_args.where = [['date','BETWEEN',report_args.from_ts+"' AND '"+report_args.to_ts],['entry_status','LIKE','submitted']];
    if (report_args.emp_id != '') {sql_args.where.push(['emp_id','LIKE',report_args.emp_id]);}
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
    //
    //manually creating multi-table select statement
    data_sql = 'SELECT * ';
    data_sql += 'FROM employee_data INNER JOIN '+report_args.dept_table+' ON employee_data.entry_id='+report_args.dept_table+'.entry_id ';
    //
    //adding in the WHERE clause
    if (sql_args.where.length > 0) {
        data_sql += "WHERE `"+sql_args.where[0][0]+"` "+sql_args.where[0][1]+" '"+sql_args.where[0][2]+"' ";
        for (var i = 1; i < sql_args.where.length; i++) {
            data_sql += "AND `"+sql_args.where[i][0]+"` "+sql_args.where[i][1]+" '"+sql_args.where[i][2]+"' ";
        }
    }
    //
    data_sql += 'ORDER BY `'+report_args.prime_sort+'` '+report_args.prime_sort_dir+', `'+report_args.secd_sort+'` '+report_args.secd_sort_dir;
    //
    // getting data and making report
    var callback = function(response) {
        report_args.meta_data = meta_data;
        report_args.data = response.data;
        make_report(report_args);
    }
    var sql_arr = [data_sql];
    var name_arr = ['data'];
    ajax_multi_fetch(sql_arr,name_arr,callback)
}
//
//
function make_report(report_args) {
    //
    var head = '<div id="report-header" style="padding: 5px; border-top: solid 1px rgb(0,0,0);">';
    var table = '<table id="report-table" class="report-table">';
    var head_rows_props= {};
    var col_meta_data = report_args.meta_data;
    var col_objs = report_args.col_objs;
    var data_arr = report_args.data;
    var prime_sort = report_args.prime_sort;
    //
    var sect_cols = [prime_sort];
    if (prime_sort == 'emp_last_name') {sect_cols.push('emp_first_name');}
    //
    // updating col_meta_data with col_objs data
    // converting meta_data array to be an object indexed by column_name
    report_args.col_name_meta = {};
    for (var i = 0; i < col_meta_data.length; i++) {
        if (col_objs) { col_meta_data[i].total_type = col_objs[col_meta_data[i].column_name].total_type; }
        report_args.col_name_meta[col_meta_data[i].column_name] = col_meta_data[i];
    }
    //
    // creating report info head
    if (report_args.emp_id) {
        head+= '<span style="text-align: center; display: block; width: 100%;"> Report for Employee: '+report_args.emp_id+'</span>';
    }
    else {
        head+= '<span style="text-align: center; display: block; width: 100%;"> Report for Department: '+toTitleCase(report_args.department.replace('_',' '))+'</span>';
    }
    head += '&nbsp;&nbsp;&nbsp;&nbsp;Date Range: '+report_args.from_ts+' : '+report_args.to_ts;
    if (report_args.department == 'warehouse_receiving') {
        var crew_size = parseInt(document.getElementById('crew-size').value);
        if (!(isFinite(crew_size))) {
            add_class('invalid-field','crew-size'); 
            crew_size = '*** ERROR: NONE PROVIDED ***';
        }
        head += '<span id="crew-size-line" ><br>&nbsp;&nbsp;&nbsp;&nbsp;Crew Size: '+crew_size+'</span>'
    }
    head += '<br><br>';
    head += '</div>';
    //
    // making table header rows
    head_rows_props.id_prefix = "sel-cols-";
    head_rows_props.class_str = "report-column-header";
    head_rows_props.leading_cells = "<td class=\"report-spacer-td\"></td>";
    head_rows_props.skip_cols = sect_cols.slice(0);
    for (var i = 0; i < col_meta_data.length; i++) {
        if (col_meta_data[i].column_type.match(/total/)) {head_rows_props.skip_cols.push(col_meta_data[i].column_name)}
    }
    var table_head = make_head_rows(col_meta_data,head_rows_props)
    table += table_head;
    //
    // checking length of data array
    if (data_arr.length == 0) {
        head += '***** No Data for Selected Report Parameters *****';
        document.getElementById('report_data_div').innerHTML = head+table+'</table></div>';
        return;
    }
    //
    // initializing the totals object
    var total_args = {}
    total_args.sect_cols = sect_cols;
    total_args.skip_cols = [];
    total_args.dynamic_cols = report_args.dynamic_cols;
    var totals_obj = {};
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
            if (sect_cols.indexOf(col.column_name) >= 0) {totals_obj[total][col.column_name] = '&nbsp;'; continue;}
            if (col.total_type.match(/avg|sum/)) { totals_obj[total][col.column_name] = 0; skip = false;}
            else { 
                totals_obj[total][col.column_name] = '&nbsp;';
                if (skip) {total_args.skip_cols.push(col.column_name);}
            }
        }
    }
    //
    // initializing report body arguments  
    var head_args = {}
    head_args.prev_id  = data_arr[0].emp_id;
    head_args.prev_sect= '';
    head_args.td_inner = '';
    head_args.td_class = 'report-table-section-head';
    head_args.colspan = col_meta_data.length - 1;
    //
    // handle report data precalculations
    report_args.called_funs = {};
    for (var col in report_args.dynamic_cols) {
        col = report_args.dynamic_cols[col];
        if (col.column_type != 'precalculate') { continue;}
        var col_funct = REPORT_FUNCTIONS[col.col_function]
        if (!(col_funct)) {console.log('Error: No function for column: '+col.column_name); continue;}
        col_funct(col.column_name,report_args);
    }
    //
    var row = '';
    var row_args = {};
    row_args.col_meta_data = col_meta_data;
    row_args.dynamic_cols = report_args.dynamic_cols;
    row_args.sect_cols = sect_cols;
    //
    // creating the report body
    var id_prefix = '';
    for (var i = 0; i < data_arr.length; i++) {
        //
        // testing for new section
        if (data_arr[i][prime_sort].toLowerCase() != head_args.prev_sect) {
            //
            // outputting a section total
            id_prefix = head_args.prev_sect;
            if ((report_args.prime_sort == 'emp_id') || (report_args.prime_sort == 'emp_last_name')) {
                id_prefix = head_args.prev_id;
            }
            else if (report_args.prime_sort == 'date') {
                id_prefix = id_prefix.split(' ')[0];
            }
            total_args.total_name = 'section';
            total_args.total_id = 'section-'+id_prefix;
            row = make_report_total_tr(total_args,totals_obj,col_meta_data)
            //
            if (i == 0) {row = '';}
            if (report_args.report_type == 'noTotals') {row = '';}
            if (row != '') {report_args.section_ids.push(id_prefix);}
            table += row;
            head_args.prev_sect = data_arr[i][prime_sort].toLowerCase();
            head_args.prev_id = data_arr[i].emp_id;
            head_args.td_inner = data_arr[i][prime_sort];
            if (prime_sort == 'date') {head_args.td_inner = 'Date: '+data_arr[i][prime_sort].split(' ')[0];}
            else if (prime_sort == 'emp_id') {head_args.td_inner = 'Employee ID: '+data_arr[i][prime_sort];}
            else if (prime_sort == 'emp_last_name') {head_args.td_inner = 'Name: '+data_arr[i]['emp_last_name']+', '+data_arr[i]['emp_first_name'];}
            head_args.sect = data_arr[i][prime_sort]
            row = make_report_sect_row(head_args)
            table += row;
        }
        //
        row_args.data_entry = data_arr[i];
        row = make_report_data_tr(row_args,totals_obj);
        if (report_args.report_type == 'summary') {row = '';}
        table += row;
    }
    if (data_arr.length > 0) {
        if (report_args.report_type != 'noTotals') {
            //
            // outputting the final section and overall totals
            id_prefix = data_arr[i-1][prime_sort].toLowerCase()
            if ((report_args.prime_sort == 'emp_id') || (report_args.prime_sort == 'emp_last_name')) {
                id_prefix = data_arr[i-1].emp_id;
            }
            total_args.total_name = 'section';
            total_args.total_id = 'section-'+id_prefix
            report_args.section_ids.push(id_prefix);
            row = make_report_total_tr(total_args,totals_obj,col_meta_data)
            table += row;
            total_args.total_name = 'overall';
            total_args.total_id = 'overall';
            report_args.section_ids.push('overall');
            row = make_report_total_tr(total_args,totals_obj,col_meta_data)  
            table += row;
        }
    }
    //
    table += '</table>';
    document.getElementById('report_data_div').innerHTML = head+table+'</div>';
    //
    // handling post calculations that require the table to exist
    for (var col in report_args.dynamic_cols) {
        col = report_args.dynamic_cols[col];
        if ((col.column_type != 'total') && (col.column_type != 'special')){ continue;}
        if ((report_args.report_type == 'noTotals') && (col.column_type == 'total')) { continue;}
        //
        var col_funct = REPORT_FUNCTIONS[col.col_function]
        if (!(col_funct)) {console.log('Error: No function for column: '+col.column_name); continue;}
        col_funct(col.column_name,report_args);
    }    
}
//
// this creates the section header for the report
function make_report_sect_row(head_args) {
    var row = '<tr>';
    //
    row += '<td class="report-table-section-head" colspan="'+head_args.colspan+'">'+head_args.td_inner+'</td>'
    //
    row += '</tr>'
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
    var row = '<tr id="data-entry-'+data_entry.entry_id+'">';
    row += '<td class="report-spacer-td"></td>';
    //
    for (var i = 0; i < col_meta_data.length; i++) {
        var col = col_meta_data[i].column_name
        if (sect_cols.indexOf(col) >= 0) {continue;}
        if (col_meta_data[i].column_type.match(/total/)) {continue;}
        //
        if (col_meta_data[i].total_type.match(/avg|sum/)) {
            for (var total in totals_obj) {
                if (total.match(/count$/)) {totals_obj[total][col] += 1;}
                else { totals_obj[total][col] += parseFloat(data_entry[col]);}
            }
        }
        var td = '';
        if ((col == 'comments') && (data_entry[col] != '')) {data_entry[col] = '<span id="comments-'+data_entry.entry_id+'" class="edit_link" onclick="toggle_innerHTML(this.id,\'C\',\''+data_entry[col]+'\');">C</span>'} 
        if (col_meta_data[i].data_type.match(/float/)) { data_entry[col] = round(data_entry[col],CONSTANTS.STD_PRECISION).toFixed(CONSTANTS.STD_PRECISION);}
        td = '<td id="data-entry-'+data_entry.entry_id+'-'+col+'" class="report-data-td">'+data_entry[col]+'</td>';
        row += td;
    }
    //
    row += '</tr>'
    return row;
}
//
// this outputs a total row for the report
function make_report_total_tr(total_args,totals_obj,col_meta_data) {
    //
    var sect_cols = total_args.sect_cols;
    var total_name = total_args.total_name;
    var disp_name = total_args.total_name.replace('_',' ');
    var dynamic = 0;
    var regular = 0;
    disp_name = toTitleCase(disp_name);
    //
    var row = '<tr id="'+total_args.total_id+'">';
    row += '<td id="report-spacer-td" class="report-spacer-td">&nbsp;</td>';
    row += '<td id="report-data-td" class="report-data-td" colspan="'+total_args.skip_cols.length+'">'+disp_name+' Total:</td>';
    //
    // outputting totals and resetting their values
    for (var i = 0; i < col_meta_data.length; i++) {
        if (total_args.skip_cols.indexOf(col_meta_data[i].column_name) >= 0) {continue;}
        if (sect_cols.indexOf(col_meta_data[i].column_name) >= 0) {continue;}
        if (col_meta_data[i].column_type.match(/total/)) { dynamic += 1; continue;}
        else { regular += 1;}
        var col = col_meta_data[i];
        var td = '';
        var value = '&nbsp;'
        var reset = '&nbsp;'
        if (col.total_type == 'avg') {
            value = totals_obj[total_name+'_total'][col.column_name]/totals_obj[total_name+'_count'][col.column_name];
            value = round(value,CONSTANTS.STD_PRECISION).toFixed(CONSTANTS.STD_PRECISION);
            reset = 0;
        }
        else if (col.total_type == 'sum'){
            value = totals_obj[total_name+'_total'][col.column_name];
            value = round(value,CONSTANTS.STD_PRECISION).toFixed(CONSTANTS.STD_PRECISION);
            reset = 0;
        }
        //
        totals_obj[total_name+'_total'][col.column_name] = reset;
        totals_obj[total_name+'_count'][col.column_name] = reset;
        td = '<td id="'+total_args.total_id+'-'+col.column_name+'" class="report-data-td"><span id="'+total_args.total_id+'-span-'+col.column_name+'" class="report-data-span-'+col.total_type+'">'+value+'</span></td>';
        row += td;
    }
    //
    row += '</tr>';
    //
    // checking if any dynamic totals exist getting thier counts to estimate col spans
    if (dynamic > 0) {
        var dynamic_row = '<tr id="special-'+total_args.total_id+'">';
        dynamic_row += '<td id="report-spacer-td" class="report-spacer-td">&nbsp;</td>';
        dynamic_row += '<td id="report-data-td" class="report-data-td" colspan="'+total_args.skip_cols.length+'">'+disp_name+' Special Total:</td>';
        dynamic_row += '<td class="report-data-td" colspan="'+regular+'">'
        for (var i = 0; i < col_meta_data.length; i++) {
            if (col_meta_data[i].column_type.match(/^dynamic-total$/)) {
                dynamic_row += '<span id="'+total_args.total_id+'-'+col_meta_data[i].column_name+'" style="display: inline-block; width: '+(100/dynamic)+'%">TEST</span>';
            }
        }
        dynamic_row += '</tr>';
        row += dynamic_row;
    }
    return row;
}