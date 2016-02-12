////////////////////////////////////////////////////////////////////////////////
/////////// This file holds various javascript functions that are      /////////
/////////// that are semi-specfic in their use or perform more complex /////////
/////////// tasks such as table generation or data manipulations       /////////
////////////////////////////////////////////////////////////////////////////////
"use strict";
//
// this object stores various constants that are used
var CONSTANTS =  {
    LY_FIRST_BUSINESS_DAY : ['2014','12','28'],
    FIRST_BUSINESS_DAY : ['2015','12','27'],
    FIRST_YEAR_WITH_DATA : 2014,
    STD_PRECISION : 2,
    SALES_STD_PRECISION : 2,
    MAX_STR_LENGTH : 24,
    SHIPPING_SUPERVISOR_ID : '2001',
    DATA_EXPIRATION_DATES : {
        'FIRST_BUSINESS_DAY' : ['2017','01','01'],
        'LY_FIRST_BUSINESS_DAY' : ['2017','01','01']

    },
    DEPT_TABLES : {
        'general'          : 'none',
        'freight_backhaul' : 'employee_data_freight_backhaul',
        'transportation'   : 'employee_data_transportation',
        'warehouse_receiving' : 'employee_data_receiving',
        'warehouse_shipping' : 'employee_data_shipping'
    },
    DEPT_FORMS : {
        'general'          : 'general_data_form',
        'freight_backhaul' : 'backhaul_form',
        'transportation'  : 'transportation_data',
        'warehouse_receiving' : 'receiving_data',
        'warehouse_shipping' : 'warehouse_data'
    },
    DEPT_MOD_FUNS : { 
        'general'  : mod_regular_data_form,
        'freight_backhaul' : mod_backhaul_form,
        'transportation'  : mod_regular_data_form,
        'warehouse_receiving' : mod_regular_data_form,
        'warehouse_shipping' : mod_regular_data_form
    },
    DEPT_VAL_FUNS : {
        'general' : init_data_form_validation,
        'freight_backhaul' : init_backhaul_form_validation,
        'transportation'  : init_data_form_validation,
        'warehouse_receiving' : init_data_form_validation,
        'warehouse_shipping' : init_data_form_validation
    }
}
//
// setting default perms by department
function set_default_perms(dept_id,user_perm_id) {
    //
    var perms;
    var dept = document.getElementById(dept_id).value; 
    //
    if (dept == 'administration') {
        perms = '7777';
    }
    else if (dept == 'operations') { 
        perms = '7000';
    }
    else if (dept == 'sales_admin') {
        perms = '0070';
    }
    else if (dept == 'sales_rep') {
        perms = '0040';
    }
    else if (dept == 'meat_admin') {
        perms = '0700';
    }
    else {
        perms = '0000'
    }
    //
    document.getElementById(user_perm_id).value = perms;
}
//
// calculates the number of hours from a start and end time
function calc_hours(st_id,en_id,out_id) {
    //
    var st_time_str = document.getElementById(st_id).value;
    var en_time_str = document.getElementById(en_id).value;
    var st_hr,st_mm,en_hr,en_mm,time_diff;
    // parsing start time
    if (st_time_str.match(/^\d\d\:\d\d$/)) {
        st_hr = parseInt(st_time_str.match(/^\d\d/));
        st_mm = parseInt(st_time_str.match(/\d\d$/));
    }
    else {
        add_class('invalid-field',st_id)
        return;
    }
    // parsing end time
    if (en_time_str.match(/^\d\d\:\d\d$/)) {
        en_hr = parseInt(en_time_str.match(/^\d\d/));
        en_mm = parseInt(en_time_str.match(/\d\d$/));
    }
    else {
        add_class('invalid-field',en_id)
        return;
    }
    // calculating difference 
    if (st_hr > en_hr) {
        time_diff = (23 - st_hr) + (60 - st_mm)/60;
        time_diff += (en_hr - 0) + (en_mm - 0)/60;
    }
    else {
       time_diff = (en_hr - st_hr) + (en_mm - st_mm)/60;
    }
    document.getElementById(out_id).value = time_diff;
}

//
// subtracts the indirect time from total hours for receiving data
function calc_prod_time(hours_id,indir_id,out_id) {
    //
    var hours = parseFloat(document.getElementById(hours_id).value);
    var indir = parseFloat(document.getElementById(indir_id).value);
    var diff = (hours - indir/60)
    if (isNaN(diff)) {diff = 0;}
    document.getElementById(out_id).value = diff;
}

// calculates value per hour
function calc_per_hr(num_id,time_id,out_id) {
    //
    var num = document.getElementById(num_id).value;
    var time = document.getElementById(time_id).value;
    var num_hr = 0.0;
    if (time != 0) { num_hr = num/time;}
    //
    document.getElementById(out_id).value = num_hr;
}
//
// sums all of the values in the provided ID string
function total_fields(id_arr_str,out_id) {  
    //
    var id_arr = id_arr_str.split(',')
    var total;
    total = 0;
    //
    for (var i = 0; i < id_arr.length; i++) {
        total += parseInt(document.getElementById(id_arr[i]).value);
    }
    if (isNaN(total)) {total = 0;}
    document.getElementById(out_id).value = total
}
//
// function to generate a standard table 
function create_standard_table(table_args) {
    //
    var sql_args = {};
    var data_sql = '';
    var meta_sql = '';
    var department = '.'
    var add_callback = false;
    var sortable = true;
    //
    // getting callback if it exists
    if (!!(table_args.add_callback)) {add_callback = table_args.add_callback;}
    //
    // results per page
    if (!(table_args.num_per_page)) { table_args.num_per_page = 10;}
    //
    // determing if its sortable or not
    if (table_args.hasOwnProperty('sortable')) { sortable = table_args.sortable;}
    //
    if (table_args.data_sql) { data_sql = table_args.data_sql;}
    else { data_sql = gen_sql(table_args.data_sql_args);}
    //
    if (table_args.meta_sql) { meta_sql = table_args.meta_sql;}
    else { meta_sql = gen_sql(table_args.meta_sql_args);}
    //
    // rearranging table args to proper form
    var page_nav_args = {};
    page_nav_args.curr_page = table_args.page;
    page_nav_args.num_per_page = table_args.num_per_page;
    page_nav_args.page_nav_div_id = table_args.page_nav_div_id
    page_nav_args.page_nav_class = table_args.page_nav_class
    page_nav_args.sort_col = table_args.sort_col;
    page_nav_args.sort_dir = table_args.sort_dir;
    page_nav_args.tot_pages_shown = table_args.tot_pages_shown;
    page_nav_args.id_prefix = table_args.page_nav_id_prefix;
    page_nav_args.class_str = table_args.page_class_str;
    page_nav_args.onclick_str = table_args.page_onclick.replace('%sort_dir%',table_args.sort_dir);
    page_nav_args.onclick_str = page_nav_args.onclick_str.replace('%sort_col%',table_args.sort_col); 
    page_nav_args.onmouse_str = table_args.page_onmouse_str; 
    if (!!(table_args.page_nav_args)) { 
        for (var arg in table_args.page_nav_args) { page_nav_args[arg] = table_args.page_nav_args[arg];}
    } 
    //
    var head_row_args = {};
    head_row_args.class_str = "default-table-header";
    head_row_args.sort_onclick_str = table_args.sort_onclick;
    head_row_args.sortable = sortable;
    head_row_args.sort_col = table_args.sort_col;
    head_row_args.sort_dir = table_args.sort_dir;
    if (!!(table_args.head_row_args)) { 
        for (var arg in table_args.head_row_args) { head_row_args[arg] = table_args.head_row_args[arg];}
    }
    //
    table_args.page_nav_args = page_nav_args;
    table_args.head_row_args = head_row_args;
    //
    var callback = function(response) {
        table_args.data_arr = response.data;
        table_args.col_meta_data = response.meta_data;
        //
        var output_table = make_standard_table(table_args);
        document.getElementById(table_args.table_output_id).innerHTML = output_table;
        //
        if (add_callback) {add_callback(response);}
    }
    ajax_multi_fetch([data_sql,meta_sql],['data','meta_data'],callback) 
}
//
// makes the employee table itself
function make_standard_table(table_args) {   
    //
    // initializations
    var output = '';
    var table_row_appended_cells = '';
    var row_onclick = '';
    var row_onmouseenter = '';
    var row_onmouseleave = '';
    var page_nav_args = {};
    var head_row_args = {};
    //
    // putting arguments into variables 
    var data_arr = table_args.data_arr;
    var col_meta_data = table_args.col_meta_data;
    var head_row_args = table_args.head_row_args;
    var page_nav_args = table_args.page_nav_args;
    page_nav_args.data_length = data_arr.length
    //
    // putting standard argument properities into variables 
    if (table_args.hasOwnProperty('table_row_appended_cells')) { table_row_appended_cells = table_args.table_row_appended_cells;}
    if (table_args.hasOwnProperty('row_onclick')) { row_onclick = table_args.row_onclick;}
    if (table_args.hasOwnProperty('row_onmouseenter')) { row_onmouseenter = table_args.row_onmouseenter;}
    if (table_args.hasOwnProperty('row_onmouseleave')) { row_onmouseleave = table_args.row_onmouseleave;}
    //
    // calculating number of pages and what to display
    var page = table_args.page;
    var start_index = 0;
    var end_index = data_arr.length; 
    if (!(table_args.no_page_nav)) {
        start_index = (page - 1)*page_nav_args.num_per_page;
        end_index = page * page_nav_args.num_per_page; 
        if (end_index > data_arr.length) {end_index = data_arr.length;};
        //
        var page_nav = create_page_links(page_nav_args);
        output += page_nav;
    }
    //
    output += '<table id="'+table_args.table_id+'" class="'+table_args.table_class+'">';
    //
    // creating column head rows 
    var head = make_head_rows(col_meta_data,head_row_args)    
    output += head;
    //
    // populating row data  
    for (var i = start_index; i < end_index; i++) {
        var row_id = table_args.row_id_prefix+i;
        var td_str = '';
        var this_table_row_appended_cells = table_row_appended_cells.replace(/%row_id%/g,row_id); 
        var this_row_onclick = row_onclick.replace(/%row_id%/g,row_id);
        var this_row_onmouseenter = row_onmouseenter.replace(/%row_id%/g,row_id);
        var this_row_onmouseleave = row_onmouseleave.replace(/%row_id%/g,row_id);
        for (var prop in data_arr[i]) {
            var pat = new RegExp('%'+prop+'%','g');
            this_row_onclick = this_row_onclick.replace(pat,data_arr[i][prop]);
            this_table_row_appended_cells = this_table_row_appended_cells.replace(pat,data_arr[i][prop]);
        }
        var table_row = '<tr id="'+row_id+'" onmouseenter="'+this_row_onmouseenter+'" onmouseleave="'+this_row_onmouseleave+'" onclick="'+this_row_onclick+'">';
        // creating table data cells
        for (var c = 0; c < col_meta_data.length; c++) {
            var innerHTML = data_arr[i][col_meta_data[c].column_name];
            if ((col_meta_data[c].data_type.match(/text/)) && (innerHTML.length > CONSTANTS.MAX_STR_LENGTH)) {
                var td_onlick = "toggle_innerHTML(this.id,'"+innerHTML.slice(0,CONSTANTS.MAX_STR_LENGTH)+"'...','"+innerHTML+"');"
                innerHTML = '<span id="'+col_meta_data[c].column_name+'-'+i+'" class="edit_link" onclick="'+td_onlick+'">'+innerHTML.slice(0,CONSTANTS.MAX_STR_LENGTH)+'...</span>'
            }
            td_str += '<td id = "'+row_id+'-'+col_meta_data[c].column_name+'" class="'+table_args.table_data_cell_class+'">'+innerHTML+'</td>';
        }
        table_row += td_str+this_table_row_appended_cells;
        table_row += '</tr>';
        output += table_row;
    }
    output += '</table>';
    //
    return output;
}
//
// creates page link line
function create_page_links(page_nav_args) {
    //
    // defining presets
    var curr_page = 1;
    var num_per_page = 10;
    var data_length = 10;
    var num_pages = 1;
    var tot_pages_shown = 1;
    var page_nav_div_id = 'table-page-nav';
    var page_nav_class = 'page_nav';
    var id_prefix = '';
    var class_str = '';
    var onclick_str = '';
    var onmouse_str = '';
    //
    // processing the argument object
    if (!!(page_nav_args.page_nav_div_id)) { page_nav_div_id = page_nav_args.page_nav_div_id;}
    if (!!(page_nav_args.page_nav_class)) { page_nav_class = page_nav_args.page_nav_class;}
    if (!!(page_nav_args.curr_page)) {curr_page = page_nav_args.curr_page;}
    if (!!(page_nav_args.data_length)) {data_length = page_nav_args.data_length;}
    if (!!(page_nav_args.num_per_page)) {num_per_page = Number(page_nav_args.num_per_page);}
    if (!!(page_nav_args.tot_pages_shown)) {tot_pages_shown = page_nav_args.tot_pages_shown;}
    if (!!(page_nav_args.id_prefix)) {id_prefix = page_nav_args.id_prefix;}
    if (!!(page_nav_args.class_str)) {class_str = page_nav_args.class_str;}
    if (!!(page_nav_args.onclick_str)) {onclick_str = page_nav_args.onclick_str;}
    if (!!(page_nav_args.onmouse_str)) {onmouse_str = page_nav_args.onmouse_str;}
    //
    var num_pages = Math.ceil(data_length/num_per_page);
    var num_left  = Math.floor((tot_pages_shown - 1)/2);
    var curr_page = parseInt(curr_page);
    var page_arr = new Array();
    var page_str = '';
    var p_class_str,p_onclick_str,p_onmouse_str
    var p = curr_page - num_left;
    if ((num_pages - p) <= tot_pages_shown) {p = num_pages - tot_pages_shown + 1;}
    if (num_pages <= tot_pages_shown) {p = 1;}
    if (p <= 0) {p = 1;}

    //
    for (var i = 0; i < tot_pages_shown; i++) {
        page_arr[i] = p;
        p += 1;
        if (p > num_pages) {break;}
    }
    //
    if (curr_page != 1) {
        p_class_str = class_str.replace('%%',curr_page-1)
        p_onclick_str = onclick_str.replace('%%',curr_page-1)
        p_onmouse_str = onmouse_str.replace('%%',curr_page-1)
        page_str += '<a id="'+id_prefix+'-page-nav-pre" class="'+p_class_str+'" onclick="'+p_onclick_str+'" onmouseover="'+p_onmouse_str+'">&#10094;</a>';
    }
    for (var i = 0; i < page_arr.length; i++) {
        p_class_str = class_str.replace('%%',page_arr[i])
        if (page_arr[i] == curr_page) { p_class_str += ' page_nav_link_curr';}
        p_onclick_str = onclick_str.replace('%%',page_arr[i])
        p_onmouse_str = onmouse_str.replace('%%',page_arr[i])
        page_str += '<a id="'+id_prefix+'-page-nav-'+page_arr[i]+'" class="'+p_class_str+'" onclick="'+p_onclick_str+'" onmouseover="'+p_onmouse_str+'">['+page_arr[i]+']</a>';
    }
    if (curr_page < num_pages) {
        p_class_str = class_str.replace('%%',curr_page+1)
        p_onclick_str = onclick_str.replace('%%',curr_page+1)
        p_onmouse_str = onmouse_str.replace('%%',curr_page+1)
        page_str += '<a id="'+id_prefix+'-page-nav-next" class="'+p_class_str+'" onclick="'+p_onclick_str+'" onmouseover="'+p_onmouse_str+'">&#10095;</a>';
    }
    //
   page_str = '<div id="'+page_nav_div_id+'" class="'+page_nav_class+'" data-curr-page="'+curr_page+'" data-sort-col="'+page_nav_args.sort_col+'" data-sort-dir="'+page_nav_args.sort_dir+'">Pages: '+page_str+'</div>';
   return page_str;
}
//
// creates the header rows for a table
function make_head_rows(col_data,head_rows_props) { 
    //
    // variable initializations
    var col_meta_data = JSON.parse(JSON.stringify(col_data));
    var row_id = 'table-header';
    var id_prefix = '';
    var class_str = '';
    var leading_cells = '';
    var sortable = true;
    var sort_col = '';
    var sort_dir = '';
    var sort_onclick_str = '';
    var header_tooltip = false;
    var skip_cols = [];
    //
    // checking head row args for additional generation parameters
    if (head_rows_props.hasOwnProperty('id_prefix')) { id_prefix = head_rows_props.id_prefix;}
    if (head_rows_props.hasOwnProperty('class_str')) { class_str = head_rows_props.class_str;}
    if (head_rows_props.hasOwnProperty('leading_cells'))    { leading_cells = head_rows_props.leading_cells;}
    if (head_rows_props.hasOwnProperty('header_tooltip'))   {header_tooltip = head_rows_props.header_tooltip;}
    if (head_rows_props.hasOwnProperty('sort_onclick_str')) { sort_onclick_str = head_rows_props.sort_onclick_str;}
    if (head_rows_props.hasOwnProperty('skip_cols')) {skip_cols = head_rows_props.skip_cols;}
    if (head_rows_props.hasOwnProperty('sortable'))  {sortable = head_rows_props.sortable;}    
    if (head_rows_props.hasOwnProperty('sort_col'))  {sort_col = head_rows_props.sort_col;}
    if (head_rows_props.hasOwnProperty('sort_dir'))  {sort_dir = head_rows_props.sort_dir;}
    //
    // parsing array for dynamic totals and skip cols
    for (var i = 0; i < col_meta_data.length; i++) {
        if (skip_cols.indexOf(col_meta_data[i].column_name) >=0) {col_meta_data.splice(i,1); continue;}
    }
    //
    // setting sorting properties for each column
    if (sortable) {
        // replacing page field
        sort_onclick_str = sort_onclick_str.replace(/%%/g,'1');
        //
        // initalizing the sort direction, sort_onlick and arrow for columns 
        for (var i = 0; i < col_meta_data.length; i++) {
            col_meta_data[i].arrow = "&#x25BC;";
            col_meta_data[i].sort_dir = "ASC";
            col_meta_data[i].sort_onclick = sort_onclick_str;
            if ((sort_col == col_meta_data[i].column_name) && (sort_dir == 'ASC')) {
                col_meta_data[i].arrow = "&#x25B2;";
                col_meta_data[i].sort_dir = "DESC";
            }
            // stepping through properties of object to sub into the sort_onclick_str
            for (var prop in col_meta_data[i]) {
                col_meta_data[i].sort_onclick = col_meta_data[i].sort_onclick.replace("%"+prop+"%",col_meta_data[i][prop]);
            }
        }
    }
    else {
        //
        // setting sorting values to an empty string
        for (var i = 0; i < col_meta_data.length; i++) {
            col_meta_data[i].arrow = '';
            col_meta_data[i].sort_dir = '';
            col_meta_data[i].sort_onclick = '';
        }
    }
    //
    // processing data array to check for shared columns 
    var num_rows = 1;
    for (var i = 0; i < col_meta_data.length; i++) {
        var n = 0;
        if (!!(col_meta_data[i].column_nickname.match(/-/g))) {
            var col_nick = col_meta_data[i].column_nickname;  
            n = 1 + col_nick.match(/-/g).length
        }
        if (n > num_rows) {num_rows = n}
    }
    // initializing header rows and adding spacing cell
    var head_tr = [];
    for (var i = 0; i < num_rows; i++) {
        head_tr[i] = '<tr id="'+row_id+'">'+leading_cells;
    }
    //
    // creating the output cells array
    var output_cells = [];
    var lvl = 0;
    while (lvl < num_rows) {
        var row_cells = [];
        var cell = 0;
        for (var i = 0; i < col_meta_data.length; i++) {
            if (skip_cols.indexOf(col_meta_data[i].column_name) >=0) {continue;}
            var col_obj = JSON.parse(JSON.stringify(col_meta_data[i])); //prevents mutation of object in future loops
            var col_name_arr = col_obj.column_nickname.split(/-/g);
            if (lvl >= col_name_arr.length) {continue;} //skips cells that don't have this low of a teir
            // setting rowspan and sort parameters
            if (lvl == col_name_arr.length - 1) {
                col_obj.rowspan = num_rows - col_name_arr.length + 1;
            }
            else {
                col_obj.rowspan = 1;
                col_obj.sort_onclick = '';
                col_obj.arrow = '';
            }
            // initializing colspan
            col_obj.colspan = 1;
            col_obj.innerHTML = col_name_arr[lvl];
            col_obj.id = col_name_arr.slice(0,lvl+1).join('-');
            col_obj.id = col_obj.id.replace(/\s+/g,'_');
            //
            // adding object to row for current teir
            row_cells[cell] = col_obj;
            cell += 1;
        }
        output_cells[lvl] = row_cells;
        lvl += 1;
    }
    //
    // incrementing colspan and removing duplicates
    for (var lvl = 0; lvl < num_rows; lvl++) {
        var col = 0;
        var cmpr = 1;
        while (cmpr < output_cells[lvl].length) {
            if (output_cells[lvl][col].innerHTML == output_cells[lvl][cmpr].innerHTML) {
                //
                // this prevents columns from different trees being spanned in the middle
                var in_tree = true;
                var col_arr = output_cells[lvl][col].column_nickname.split('-');
                var cmpr_arr = output_cells[lvl][cmpr].column_nickname.split('-');
                for (var l = 0; l <= lvl; l++) {
                    if (col_arr[l] != cmpr_arr[l]) {in_tree = false;}
                }
                //
                if (in_tree) {
                    output_cells[lvl][col].colspan += 1;
                    output_cells[lvl][cmpr] = ""; // "deleting spanned columns"
                    cmpr += 1;
                }
                else {
                    col = cmpr;
                    cmpr += 1;
                }
            }
            else {
                col = cmpr;
                cmpr += 1;
            }
        }
    }
    //
    // creating table rows
    for (var lvl = 0; lvl < num_rows; lvl++) {
        for (var col = 0; col < output_cells[lvl].length; col++) {
            if (output_cells[lvl][col] == '') {continue;}
            var col_obj = output_cells[lvl][col];
            var cell_tooltip = ''
            if (header_tooltip) {
                cell_tooltip = header_tooltip;
                for (var prop in col_obj) { cell_tooltip = cell_tooltip.replace('%'+prop+'%',col_obj[prop])}
                cell_tooltip = '<span class="default-table-tooltip">'+cell_tooltip+'</span>';
            }
            head_tr[lvl] += '<td id="'+id_prefix+col_obj.id+'" class="'+class_str+'" colspan="'+col_obj.colspan+'" rowspan="'+col_obj.rowspan+'" onclick="'+col_obj.sort_onclick+'">'+col_obj.innerHTML+'&nbsp;'+col_obj.arrow+cell_tooltip+'</td>';
        }
    }
    //
    // closing tags for header table rows
    var head = '';
    for (var i = 0; i < num_rows; i++) {
        head_tr[i] += '</tr>';
        head += head_tr[i];
    }
    //
    return head;
}
//
// this function handles the data types of various cells in the database for reports
function process_data_type(value,data_type) {
    //
    var right_align = '<span style="display: inline-block; width: 100%; text-align: right">%value%</span>';
    //
    if (trim(data_type).match(/(^|%)float(%|$)/)) {
        value = round(Number(value),CONSTANTS.STD_PRECISION).toFixed(CONSTANTS.STD_PRECISION);
        value = right_align.replace(/%value%/,value)
    }
    else if (trim(data_type).match(/(^|%)int(%|$)/)) {
        value = round(Number(value),0).toFixed(0);
        value = right_align.replace(/%value%/,value)
    }
    else if (trim(data_type).match(/(^|%)percent(%|$)/)) {
        value = 100 * Number(value);
        value = round(value,CONSTANTS.STD_PRECISION).toFixed(CONSTANTS.STD_PRECISION);
        value += '%';
        value = right_align.replace(/%value%/,value)
    }
    //
    return value;
}
//
// creates the table that allows the user to select viewable columns and totalling type
function make_data_columns_table(args) {   
    //
    // variable definitions 
    var col_meta_data = args.data;  
    var preset_data = args.preset_data;
    var checked_cols = [];
    var all_onclick_fun = '';
    //
    // additional argument parameters
    if (args.hasOwnProperty('all_onclick_fun')) { all_onclick_fun = args.all_onclick_fun;}
    //
    // making an array to track columns that should be checked
    if (preset_data.data_columns.match(/\*/)) {
        for (var i = 0; i < col_meta_data.length; i++) {
            checked_cols.push(col_meta_data[i].column_name);
        }        
    }
    else {
        checked_cols = preset_data.data_columns.split(',');
    }
    //
    // table construction initializations 
    var table = '<br><table id="data_sel_cols_table" class="report-table">';
    var view_col_tr = "<tr id=\"data_sel_cols_checkbox_tr\"><td class=\"report-data-td\">Show Column:</td>";
    var total_type_tr = "<tr id=\"data_sel_cols_radio_tr\"><td class=\"report-data-td\">Sum:<br>or<br>Average:</td>";
    var sort_by_tr = "<tr id=\"sort-by-col-tr\" ><td class=\"report-data-td\">Sort by Column:</td>";
    //
    // making header rows
    var head_rows_props = {};
    head_rows_props.sortable = false;
    head_rows_props.id_prefix = "sel-cols-";
    head_rows_props.class_str = "report-column-header";
    head_rows_props.leading_cells = "<td class=\"report-spacer-td\"></td>";
    var head = make_head_rows(col_meta_data,head_rows_props);
    table += head;
    //
    // constructing additional table rows
    for (var i = 0; i < col_meta_data.length; i++) {
        var col_obj = col_meta_data[i];
        var checked = '';
        if (checked_cols.indexOf(col_obj.column_name) >= 0) {checked = 'checked';}
        view_col_tr += '<td id="'+col_obj.column_name+'-viewcol-td" class="report-data-td"><input id="'+col_obj.column_name+'-viewcol-checkbox" name="sel_cols" type="checkbox" value="'+col_obj.column_name+'" onclick="'+all_onclick_fun+'" '+checked+'></td>';
        if (col_obj.column_type != 'static') {
            sort_by_tr += '<td id="'+col_obj.column_name+'-sortby-td" class="report-data-td"></td>'; 
        }
        else {
            sort_by_tr += '<td id="'+col_obj.column_name+'-sortby-td" class="report-data-td"><input id="'+col_obj.column_name+'-sortby-radio" name="secd-sort" type="radio" value="'+col_obj.column_name+'" onclick="'+all_onclick_fun+'"></td>'; 
        }
        //
        if (!!(col_obj.total_type.match(/sum|avg/))) {
            var sum_check = "";
            var avg_check = "";
            if (col_obj.total_type.match(/avg/)) {avg_check = "checked";}
            else {sum_check = "checked";}
            total_type_tr += "<td class=\"report-data-td\"><input id=\""+col_obj.column_name+"-totaltype-sum\" type=\"radio\" name=\""+col_obj.column_name+"\" value=\""+col_obj.column_name+":sum\" onclick=\""+all_onclick_fun+"\" "+sum_check+"><br>";
            total_type_tr += "<input id=\""+col_obj.column_name+"-totaltype-avg\" type=\"radio\" name=\""+col_obj.column_name+"\" value=\""+col_obj.column_name+":avg\" onclick=\""+all_onclick_fun+"\" "+avg_check+"></td>"
        }
        else {
            total_type_tr += "<td id=\""+col_obj.column_name+"-total-td\" class=\"report-data-td\">&nbsp;</td>";
        }
    }
    //
    // adding closing tags and appending to table
    view_col_tr += "</tr>";
    sort_by_tr += "</tr>";
    total_type_tr += "</tr>";
    table += view_col_tr;
    if (!(args.hide_sort_row)) { table += sort_by_tr;}
    if (!(args.hide_totals_row)) { table += total_type_tr;}
    table += "</table>";
    //
    return table;
}
//
// updates the sort_by_col radio button to match drop down list if table exists
function update_sort_by_col(table_row_id,drop_down_id) {
    
    if (!!(document.getElementById(table_row_id))) {
        var secd_sort = document.getElementById(drop_down_id).value;  
        if (!!(document.getElementById(secd_sort+'-sortby-radio'))) {
            document.getElementById(secd_sort+'-sortby-radio').checked = true;       
        }
    }
}