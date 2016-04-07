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
    var add_callback = false;
    //
    // getting callback if it exists
    if (table_args.hasOwnProperty('add_callback')) {add_callback = table_args.add_callback;}
    //
    if (table_args.data_sql) { data_sql = table_args.data_sql;}
    else { data_sql = gen_sql(table_args.data_sql_args);}
    //
    if (table_args.meta_sql) { meta_sql = table_args.meta_sql;}
    else { meta_sql = gen_sql(table_args.meta_sql_args);}
    //
    var callback = function(response) {
        table_args.data_arr = response.data;
        table_args.col_meta_data = response.meta_data;
        //
        var output_table = make_standard_table(table_args);
        if (document.getElementById(output_table.id)) {
            document.getElementById(table_args.table_output_id).replaceChild(output_table,document.getElementById(output_table.id));
        }
        else {
            document.getElementById(table_args.table_output_id).appendChild(output_table);
        }
        //
        if (add_callback) {add_callback(response);}
    }
    ajax_fetch([data_sql,meta_sql],['data','meta_data'],callback)
}
//
// makes the employee table itself
function make_standard_table(input_args) {
    //
    // initializations
    var args = {
        no_page_nav : false,
        table_id : 'standard-data-table',
        table_class : 'default-table',
        table_data_cell_class : 'default-table-td',
        table_row_appended_cells : '',
        row_id_prefix : '',
        row_onclick : '',
        row_onmouseenter : '',
        row_onmouseleave : '',
    }
    var head_row_args = {};
    var page_nav_args = {};
    var data_arr = [];
    var col_meta_data = [];
    //
    // putting arguments into variables
    data_arr = input_args.data_arr;
    col_meta_data = input_args.col_meta_data;
    head_row_args = input_args.head_row_args;
    page_nav_args = input_args.page_nav_args;
    page_nav_args.data_length = data_arr.length;
    page_nav_args.meta_data = col_meta_data;
    //
    // putting table arguments properities into defaults variable
    for (var arg in input_args) {
        args[arg] = input_args[arg];
    }
    //
    // calculating number of pages and what to display
    var page = page_nav_args.curr_page;
    var start_index = 0;
    var end_index = data_arr.length;
    if (!(args.no_page_nav)) {
        start_index = (page - 1)*page_nav_args.num_per_page;
        end_index = page * page_nav_args.num_per_page;
        if (end_index > data_arr.length) {end_index = data_arr.length;};
        //
        var page_nav = create_page_links(page_nav_args);
        if (document.getElementById(page_nav.id)) {
            document.getElementById(args.table_output_id).replaceChild(page_nav,document.getElementById(page_nav.id));
        }
        else {
            document.getElementById(args.table_output_id).appendChild(page_nav);
        }
    }
    //
    // creating column head rows
    var table_attr = {'id' : args.table_id, 'class' : args.table_class}
    var table = document.createElementWithAttr('TABLE',table_attr);
    make_head_rows(table,col_meta_data,head_row_args)
    //
    // populating row data
    for (var i = start_index; i < end_index; i++) {
        data_arr[i]['row_id'] =  args.row_id_prefix+i;
        var td_str = '';
        var this_table_row_appended_cells = args.table_row_appended_cells;
        var this_row_onclick = args.row_onclick;
        var this_row_onmouseenter = args.row_onmouseenter;
        var this_row_onmouseleave = args.row_onmouseleave;
        for (var prop in data_arr[i]) {
            var pat = new RegExp('%'+prop+'%','g');
            this_row_onclick = this_row_onclick.replace(pat,data_arr[i][prop]);
            this_row_onmouseenter = this_row_onmouseenter.replace(pat,data_arr[i][prop]);
            this_row_onmouseleave = this_row_onmouseleave.replace(pat,data_arr[i][prop]);
            this_table_row_appended_cells = this_table_row_appended_cells.replace(pat,data_arr[i][prop]);
        }
        var table_row = document.createElementWithAttr('TR',{'id' : data_arr[i]['row_id']});
        table_row.addEventListener('mouseenter',exec_fun_str.bind(null,this_row_onmouseenter));
        table_row.addEventListener('mouseleave',exec_fun_str.bind(null,this_row_onmouseleave));
        table_row.addEventListener('click',exec_fun_str.bind(null,this_row_onclick));
        //
        // creating table data cells
        for (var c = 0; c < col_meta_data.length; c++) {
            //
            var td_attr = {
                'id' : data_arr[i]['row_id']+'-'+col_meta_data[c].column_name,
                'class' : args.table_data_cell_class,
            }
            var td = document.createElementWithAttr('TD',td_attr);
            if (!(col_meta_data[c].data_type.match(/text|info/))) { td.style['text-align'] = 'right';}
            process_data_type(data_arr[i][col_meta_data[c].column_name],col_meta_data[c].data_type,td,false);
            table_row.appendChild(td);
        }
        if (this_table_row_appended_cells) {
            table_row.innerHTML += this_table_row_appended_cells;
        }
        table.appendChild(table_row);
    }
    //
    return table;
}
//
// creates page link line
function create_page_links(input_args) {
    //
    // defining presets
    var args = {
        curr_page : 1,
        num_per_page : 10,
        data_length : 10,
        tot_pages_shown : 1,
        data_length : 0,
        tables_referenced : [],
        meta_data : {},
        sort_col : '',
        sort_dir : '',
        page_nav_div_id : 'table-page-nav',
        page_nav_class : 'page_nav',
        id_prefix : '',
        class_str : '',
        onclick_str : '',
        onmouse_str : ''
    }
    //
    // processing the argument object
    var arg = null;
    for (var prop in input_args) {
        arg = input_args[prop];
        if (typeof arg == 'string') {
            if (arg.match(/^-?\d+$/)) {arg = Number(arg);}
        }
        args[prop] = arg
    }
    //
    // making independent copy of meta_data and then indexing by name
    var meta_data = {};
    var col_name = '';
    for (var i in args.meta_data) {
        col_name = args.meta_data[i]['column_name'];
        meta_data[col_name] = JSON.parse(JSON.stringify(args.meta_data[i]));
        //
        for (var j in args.tables_referenced) {
            var pat = '(^|%)'+args.tables_referenced[j]+'(%|$)';
            if (meta_data[col_name]['in_tables'].match(pat)) {
                meta_data[col_name]['table'] = args.tables_referenced[j];
                break;
            }
        }
        if (meta_data[col_name]['table']) {
            meta_data[col_name]['column_name'] = meta_data[col_name]['table']+'.'+col_name;
        }
        if (col_name == args.sort_col) {
            args.sort_col = meta_data[col_name]['column_name'];
        }
    }
    //
    var num_pages = Math.ceil(args.data_length/args.num_per_page);
    var num_left  = Math.floor((args.tot_pages_shown - 1)/2);
    var page_arr = new Array();
    var page_str = '';
    var p_class_str,p_onclick_str,p_onmouse_str
    var p = args.curr_page - num_left;
    if ((num_pages - p) <= args.tot_pages_shown) {p = num_pages - args.tot_pages_shown + 1;}
    if (num_pages <= args.tot_pages_shown) {p = 1;}
    if (p <= 0) {p = 1;}

    //
    for (var i = 0; i < args.tot_pages_shown; i++) {
        page_arr[i] = p;
        p += 1;
        if (p > num_pages) {break;}
    }
    //
    var div_attr = {
        'id' : args.page_nav_div_id,
        'class' : args.page_nav_class,
        'data-curr-page' : args.curr_page,
        'data-sort-col' : args.sort_col,
        'data-sort-dir' : args.sort_dir,
    }
    //
    var page_div = document.createElementWithAttr('DIV',div_attr);
    var page_link = null
    var link_attr = {};
    page_div.appendChild(document.createTextNode('Pages: '));
    if (args.curr_page != 1) {
        p_class_str = args.class_str.replace('%%',args.curr_page-1);
        p_onclick_str = args.onclick_str.replace('%%',args.curr_page-1);
        p_onmouse_str = args.onmouse_str.replace('%%',args.curr_page-1);
        //
        link_attr.id = args.id_prefix+'-page-nav-pre';
        link_attr.class = p_class_str;
        page_link = document.createElementWithAttr('A',link_attr);
        page_link.addEventListener('click',exec_fun_str.bind(null,p_onclick_str));
        page_link.addEventListener('mouseover',exec_fun_str.bind(null,p_onmouse_str));
        page_link.appendChild(document.createTextNode('\u276E'));
        page_div.appendChild(page_link);
    }
    for (var i = 0; i < page_arr.length; i++) {
        p_class_str = args.class_str.replace('%%',page_arr[i])
        p_onclick_str = args.onclick_str.replace('%%',page_arr[i])
        p_onmouse_str = args.onmouse_str.replace('%%',page_arr[i])
        if (page_arr[i] == args.curr_page) { p_class_str += ' page_nav_link_curr';}
        //
        link_attr.id = args.id_prefix+'-page-nav-'+page_arr[i];
        link_attr.class = p_class_str;
        page_link = document.createElementWithAttr('A',link_attr);
        page_link.addEventListener('click',exec_fun_str.bind(null,p_onclick_str));
        page_link.addEventListener('mouseover',exec_fun_str.bind(null,p_onmouse_str));
        page_link.appendChild(document.createTextNode('['+page_arr[i]+']'));
        page_div.appendChild(page_link);
    }
    if (args.curr_page < num_pages) {
        p_class_str = args.class_str.replace('%%',args.curr_page+1)
        p_onclick_str = args.onclick_str.replace('%%',args.curr_page+1)
        p_onmouse_str = args.onmouse_str.replace('%%',args.curr_page+1)
        //
        link_attr.id = args.id_prefix+'-page-nav-next';
        link_attr.class = p_class_str;
        page_link = document.createElementWithAttr('A',link_attr);
        page_link.addEventListener('click',exec_fun_str.bind(null,p_onclick_str));
        page_link.addEventListener('mouseover',exec_fun_str.bind(null,p_onmouse_str));
        page_link.appendChild(document.createTextNode('\u276F'));
        page_div.appendChild(page_link);
    }
    //
   return(page_div);
}
//
// creates the header rows for a table
function make_head_rows(output_element,col_data,input_args) {
    //
    // variable initializations
    var col_meta_data = JSON.parse(JSON.stringify(col_data));
    var args = {
        row_id : 'table-header',
        id_prefix : '',
        class_str : 'default-table-header',
        leading_cells : [],
        tooltip : {'elm':'SPAN','className':'hidden-elm','textNode':''},
        skip_cols : [],
        tables_referenced : [],
        sortable : true,
        sort_col : '',
        sort_dir : '',
        asc_arrow  : '\u25BC',
        desc_arrow : '\u25B2',
        cell_onclick_str : '',
        sort_onclick_str : ''
    };
    //
    // checking input args for generation parameters
    for (var arg in input_args) {
        args[arg] = input_args[arg];
        if (typeof args[arg] == 'string') { args[arg] = args[arg].replace(/%%/g,'1');}
    }
    //
    // linking a table to the cols in meta data
    for (var i in col_meta_data) {
        col_meta_data[i]['table'] = '';
        for (var j in args.tables_referenced) {
            var pat = '(^|%)'+args.tables_referenced[j]+'(%|$)';
            if (col_meta_data[i]['in_tables'].match(pat)) {
                col_meta_data[i]['table'] = args.tables_referenced[j];
                break;
            }
        }
        if (col_meta_data[i]['table']) {
            col_meta_data[i]['column_name'] = col_meta_data[i]['table']+'.'+col_meta_data[i]['column_name'];
        }
        else {
            console.log('Warning: could not find a maching table for column - '+col_meta_data[i]['column_name']);
        }
        if (col_meta_data[i]['column_name'].match('(?:[.])'+args.sort_col+'$')) {
            args.sort_col = col_meta_data[i]['column_name'];
        }
    }
    //
    // modifying args if table is not sortable
    if (!(args.sortable)) {
        args.sort_onclick_str = '';
        args.asc_arrow  = '';
        args.desc_arrow = '';
    }
    //
    // parsing array for dynamic totals and skip cols
    for (var i = 0; i < col_meta_data.length; i++) {
        if (args.skip_cols.indexOf(col_meta_data[i].column_name) >=0) {col_meta_data.splice(i,1); continue;}
    }
    //
    // adding data to column objects
    for (var i = 0; i < col_meta_data.length; i++) {
        col_meta_data[i].arrow = args.asc_arrow;
        col_meta_data[i].sort_dir = 'ASC';
        col_meta_data[i].sort_onclick = args.sort_onclick_str;
        col_meta_data[i].cell_onclick = args.cell_onclick_str;
        col_meta_data[i].tooltip = JSON.parse(JSON.stringify(args.tooltip));
        if ((args.sort_col == col_meta_data[i].column_name) && (args.sort_dir == 'ASC')) {
            col_meta_data[i].arrow = args.desc_arrow;
            col_meta_data[i].sort_dir = 'DESC';
        }
        col_meta_data[i].arrow = {'textContent' : col_meta_data[i].arrow}
        //
        // stepping through properties of object to sub into values
        var tooltip_text = col_meta_data[i].tooltip.textNode;
        for (var prop in col_meta_data[i]) {
            col_meta_data[i].cell_onclick = col_meta_data[i].cell_onclick.replace("%"+prop+"%",col_meta_data[i][prop]);
            col_meta_data[i].sort_onclick = col_meta_data[i].sort_onclick.replace("%"+prop+"%",col_meta_data[i][prop]);
            tooltip_text = tooltip_text.replace("%"+prop+"%",col_meta_data[i][prop]);
        }
        col_meta_data[i].tooltip.textNode = tooltip_text;
        col_meta_data[i].arrow.onclick = col_meta_data[i].sort_onclick;
    }
    //
    // processing data array to check for shared columns
    var num_rows = 1;
    for (var i = 0; i < col_meta_data.length; i++) {
        var n = 0;
        if (col_meta_data[i].column_nickname.match(/-/g)) {
            var col_nick = col_meta_data[i].column_nickname;
            n = 1 + col_nick.match(/-/g).length
        }
        if (n > num_rows) {num_rows = n}
    }
    //
    // creating the output cells array
    var output_cells = [];
    var lvl = 0;
    while (lvl < num_rows) {
        var row_cells = [];
        var cell = 0;
        for (var i = 0; i < col_meta_data.length; i++) {
            if (args.skip_cols.indexOf(col_meta_data[i].column_name) >=0) {continue;}
            var col_obj = JSON.parse(JSON.stringify(col_meta_data[i])); //prevents mutation of object in future loops
            var col_name_arr = col_obj.column_nickname.split(/-/g);
            if (lvl >= col_name_arr.length) {continue;} //skips cells that don't have this low of a teir
            // setting rowspan and sort parameters
            if (lvl == col_name_arr.length - 1) {
                col_obj.rowspan = num_rows - col_name_arr.length + 1;
            }
            else {
                col_obj.rowspan = 1;
                col_obj.cell_onclick = '';
                col_obj.sort_onclick = '';
                col_obj.tooltip = '';
                col_obj.arrow = '';
            }
            // initializing colspan
            col_obj.colspan = 1;
            col_obj.innerHTML = col_name_arr[lvl];
            col_obj.id = col_name_arr.slice(0,lvl+1).join('-');
            col_obj.id = col_obj.id.replace(/\s+/g,'_');
            //
            // adding object to row for current tier
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
                    if (col_arr[l] != cmpr_arr[l]) { in_tree = false;}
                }
                //
                if (in_tree) {
                    output_cells[lvl][col].colspan += 1;
                    output_cells[lvl][cmpr] = ''; // deleting "spanned columns"
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
    // initializing header rows and adding spacing cell
    var head_tr = [];
    for (var i = 0; i < num_rows; i++) {
        var clones = [];
        for (var j = 0; j < args.leading_cells.length; j++) { clones.push(args.leading_cells[j].cloneNode(true));}
        head_tr[i] = document.createElementWithAttr('TR',{'id' : args.row_id});
        head_tr[i].addNodes(clones);
    }
    //
    // creating table cells
    for (var lvl = 0; lvl < num_rows; lvl++) {
        for (var col = 0; col < output_cells[lvl].length; col++) {
            if (output_cells[lvl][col] == '') { continue;}
            var col_obj = output_cells[lvl][col];
            var td = document.createElementWithAttr('TD',{
                    'id' : args.id_prefix+col_obj.id,
                    'class' : args.class_str,
                    'colspan' : col_obj.colspan,
                    'rowspan' : col_obj.rowspan,
            });
            td.addEventListener('click',exec_fun_str.bind(null,col_obj.cell_onclick));
            td.addTextNode(col_obj.innerHTML+'\u00A0');
            if (col_obj.arrow) {
                var span = document.createElement('SPAN');
                span.addEventListener('click',exec_fun_str.bind(null,col_obj.arrow.onclick));
                span.addTextNode(col_obj.arrow.textContent);
                td.appendChild(span);
            }
            if (col_obj.tooltip) { addChildren(td,[col_obj.tooltip])}
            head_tr[lvl].appendChild(td);
        }
    }
    //
    output_element.addNodes(head_tr);
}
//
// this function handles the data types of various cells in the database for reports
function process_data_type(value,data_type,element,args) {
    //
    var node = false;
    var add_commas = true;
    var format_str = '%value%';
    if (!(args)) { args = {};}
    if (args.hasOwnProperty('add_commas')) { add_commas = args.add_commas;}
    if (args.hasOwnProperty('format_str')) { format_str = args.format_str;}

    //
    // handling input pre-processing
    else if (data_type.match(/(^|%)percent(%|$)/)) {
        value = 100 * Number(value);
    }
    //
    // handling required rounding
    var m = data_type.match(/(?:^|%)round\([crf],[0-9]+\)(?:%|$)/)
    if (data_type.match(/(?:^|%)round\(.+?\)(?:%|$)/)) {
        value = round_data_type(value,data_type);
        element.style['text-align'] = 'right';
    }
    else if (data_type.match(/(^|%)float|percent(%|$)/)) {
        value = round(Number(value),CONSTANTS.STD_PRECISION).toFixed(CONSTANTS.STD_PRECISION);
        element.style['text-align'] = 'right';
    }
    else if (data_type.match(/(^|%)int(%|$)/)) {
        value = round(Number(value),0).toFixed(0);
        element.style['text-align'] = 'right';
    }
    //
    // defining final output format
    if (data_type.match(/(^|%)percent(%|$)/)) {
        value += ' %';
    }
    else if ((data_type.match(/(?:^|%)text(?:%|$)/)) && (value.length > CONSTANTS.MAX_STR_LENGTH)) {
        var id = floor(Math.random()*10000,0);
        node = document.createElementWithAttr('SPAN',{'id' : id, 'class' : 'link-blue'});
        node.addEventListener('click',toggle_innerHTML.bind(null,id,value.slice(0,CONSTANTS.MAX_STR_LENGTH)+'...',value));
        node.appendChild(document.createTextNode(value.slice(0,CONSTANTS.MAX_STR_LENGTH)+'...'));
        add_commas = false;
        element.style['text-align'] = 'left';
    }
    //
    if (!(data_type.match(/(^|%)float|percent|int(%|$)/))) {
        add_commas = false;
    }
    //
    if (add_commas) { value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");}
    //
    value = format_str.replace(/%value%/,value);
    //
    if (node) {
        element.appendChild(node);
    }
    else {
        element.appendChild(document.createTextNode(value));
    }
}
//
// this function handles the rounding logic in table meta data
function round_data_type(value,data_type) {
    //
    value = Number(value);
    var m = data_type.match(/(?:^|%)round\(([crf]),([0-9]+)\)(?:%|$)/i)
    var std_perc = CONSTANTS.STD_PRECISION;
    if (data_type.match(/(?:^|%)int(?:%|$)/i)) {
        std_perc = 0;
    }
    //
    if (!(m)) { m = ['','r','-1'];}
    if (m[2] == '-1') { m[2] = std_perc;}
    //
    if (m[1].toLowerCase() == 'f') {
        value = floor(value,m[2])
    }
    else if (m[1].toLowerCase() == 'c') {
        value = ceiling(value,m[2])
    }
    else {
        value = round(value,m[2])
    }
    //
    return(value.toFixed(m[2]));
}
//
// creates the table that allows the user to select viewable columns and totalling type
function make_data_columns_table(output_element,args) {
    //
    // variable definitions
    var col_meta_data = args.data;
    var tables_referenced = args.tables_referenced;
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
    var br = document.createElement('BR');
    var table = document.createElementWithAttr('TABLE',{'id':'data_sel_cols_table', 'class':'report-table'});
    var view_col_tr = document.createElementWithAttr('TR',{'id':'data_sel_cols_checkbox_tr'});
    var total_type_tr = document.createElementWithAttr('TR',{'id':'data_sel_cols_radio_tr'});
    var sort_by_tr = document.createElementWithAttr('TR',{'id':'sort-by-col-tr'});
    var td = document.createElementWithAttr('TD',{'class':'report-data-td'});
    td.textContent = 'Show Column:'
    view_col_tr.appendChild(td);
    td = document.createElementWithAttr('TD',{'class':'report-data-td'});
    td.textContent = 'Sort by Column:';
    sort_by_tr.appendChild(td);
    td = document.createElementWithAttr('TD',{'class':'report-data-td'});
    td.addTextNode('Sum:');
    td.appendChild(document.createElement('BR'));
    td.addTextNode('or');
    td.appendChild(document.createElement('BR'));
    td.addTextNode('Average:');
    total_type_tr.appendChild(td);
    //
    // making header rows
    var lead_td = document.createElementWithAttr('TD',{'class':'report-spacer-td'});
    lead_td.addTextNode('\u00A0');
    var head_rows_props = {};
    head_rows_props.sortable = false;
    head_rows_props.tables_referenced = tables_referenced;
    head_rows_props.id_prefix = "sel-cols-";
    head_rows_props.class_str = "report-column-header";
    head_rows_props.leading_cells =  [lead_td];
    make_head_rows(table,col_meta_data,head_rows_props);
    //
    // constructing additional table rows
    var input = null;
    for (var i = 0; i < col_meta_data.length; i++) {
        var table_name = '';
        for (var j in tables_referenced) {
            var pat = '(^|%)'+args.tables_referenced[j]+'(%|$)';
            if (col_meta_data[i]['in_tables'].match(pat)) {
                table_name = args.tables_referenced[j]+'.';
                break;
            }
        }
        if (!(table_name)) {
            console.log('Warning: could not find a maching table for column - '+col_meta_data[i]['column_name']);
        }
        //
        var col_obj = col_meta_data[i];
        var checked = false;
        //
        // creating view-col table cell
        if (checked_cols.indexOf(col_obj.column_name) >= 0) {checked = true;}
        td = document.createElementWithAttr('TD',{'id':col_obj.column_name+'-viewcol-td', 'class':'report-data-td'});
        input = document.createElementWithAttr('INPUT',{
                'id' : col_obj.column_name+'-viewcol-checkbox',
                'name' : 'sel_cols',
                'type' : 'checkbox',
                'value' : col_obj.column_name
        });
        if (checked) { input.checked = true;}
        input.addEventListener('click',exec_fun_str.bind(null,all_onclick_fun));
        td.appendChild(input);
        view_col_tr.appendChild(td);
        //
        // creating sort col table cell
        td = document.createElementWithAttr('TD',{'id':col_obj.column_name+'-sortby-td', 'class':'report-data-td'});
        if (col_obj.column_type.match('static')) {
            input = document.createElementWithAttr('INPUT',{
                    'id' : col_obj.column_name+'-sortby-radio',
                    'name' : 'secd-sort',
                    'type' : 'radio',
                    'value' : table_name+col_obj.column_name,
            });
            input.addEventListener('click',exec_fun_str.bind(null,all_onclick_fun));
            td.appendChild(input);
        }
        sort_by_tr.appendChild(td);
        //
        // creating total type cell
        td = document.createElementWithAttr('TD',{'class':'report-data-td'});
        if (col_obj.total_type.match(/sum|avg/)) {
            var sum_input = null;
            var avg_input = null;
            var sum_check = false;
            var avg_check = false;
            if (col_obj.total_type.match(/avg/)) {avg_check = true;}
            else {sum_check = true;}
            //
            sum_input = document.createElementWithAttr('INPUT',{
                    'id' : col_obj.column_name+'-totaltype-sum',
                    'name' : col_obj.column_name,
                    'type' : 'radio',
                    'value' :'sum'
            });
            avg_input = document.createElementWithAttr('INPUT',{
                    'id' : col_obj.column_name+'-totaltype-avg',
                    'name' : col_obj.column_name,
                    'type' : 'radio',
                    'value' :'avg'
            });
            if (sum_check) { sum_input.checked = true;}
            if (avg_check) { avg_input.checked = true;}
            sum_input.addEventListener('click',exec_fun_str.bind(null,all_onclick_fun));
            avg_input.addEventListener('click',exec_fun_str.bind(null,all_onclick_fun));
            td.appendChild(sum_input);
            td.appendChild(br.cloneNode());
            td.appendChild(avg_input);
        }
        total_type_tr.appendChild(td)
    }
    //
    // appending elements to table
    table.appendChild(view_col_tr);
    if (!(args.hide_sort_row)) { table.appendChild(sort_by_tr);}
    if (!(args.hide_totals_row)) { table.appendChild(total_type_tr);}
    //
    output_element.appendChild(table);
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