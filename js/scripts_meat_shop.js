////////////////////////////////////////////////////////////////////////////////
//////////////       This file holds the driver functions that are   ///////////
//////////////       associated with only the meat shop              ///////////
////////////////////////////////////////////////////////////////////////////////
"use strict";
//
// this sets up the page if the item maintence button is clicked
function item_maintenance() {
    //
    reset_page();
    //
    document.getElementById('tab-clicked').value = 'item-maintenance';
    // 
    var head ='<h4>Click on an item in the table to modfy it or click the button below the table to create a new item.</h4>';
    head += '<label class="label">Show Inactive Items</label><input id="show-inactive" type="checkbox" onclick="gen_item_table(1,\'item_number\',\'ASC\');">';
    head += '<br>';
    head += '<label class="label-12em">Narrow by Item Number: </label><input id="search-item-number" type="text" onkeyup="gen_item_table(1,\'item_number\',\'ASC\');">';
    //
    document.getElementById('input-div').innerHTML = head;
    //
    gen_item_table(1,'item_number','ASC');
}
//
//
function stock_changes() {
    //
    reset_page();
    //
    remove_class('hidden-elm','update-stock'); 
    remove_class('hidden-elm','mod-record');
}
//
// this sets up the page if stock reports is clicked
function stock_reports() {
    //
    reset_page();
    //
    document.getElementById('tab-clicked').value = 'stock-reports';
    //
    remove_class('hidden-elm','inventory-report'); 
    remove_class('hidden-elm','stock-change-report');    
}
//
// this resets the page after main buttons are pressed
function reset_page() {
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
// this sets up the page if the create new item button is clicked
function create_item() {
    document.getElementById('modify-header').innerHTML = 'Creating new Item';
    create_form('meat_shop_item','content-div');
}
//
// this sets up the page if stock changes is clicked
function update_stock() {
    //
    // clearing elements inside main-container div
    var childNodes = document.getElementById('main-container').childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].nodeType == 1) {childNodes[i].innerHTML = '';}
    }
    //
    document.getElementById('tab-clicked').value = 'stock-changes';
    // 
    var head ='<h4>Click on an item in the table to update it\'s quantity.</h4>';
    head += '<label class="label-12em">Narrow by Item Number: </label><input id="search-item-number" type="text" onkeyup="gen_item_table(1,\'item_number\',\'ASC\');">';
    //
    document.getElementById('input-div').innerHTML = head;
    //
    gen_item_table(1,'item_number','ASC');
}
//
// this sets up the page for modifying a stock change record
function mod_change_records() {
    //
    document.getElementById('content-div').innerHTML = '';
    document.getElementById('modify-header').innerHTML = '';    
    //
    var head ='<h4>Click on a record in the table to modify it.</h4>';
    head += '<label class="label">Show Deleted Records</label><input id="show-deleted" type="checkbox" onclick="gen_stock_table(1,\'creation_timestamp\',\'DESC\');">';
    head += '<br>';
    head += '<label class="label-12em">Narrow by Item Number: </label><input id="search-item-number" type="text" onkeyup="gen_stock_table(1,\'creation_timestamp\',\'DESC\');">';
    //
    document.getElementById('input-div').innerHTML = head;
    //
    gen_stock_table(1,'creation_timestamp','DESC');
}
//
// generates the table for the item maintanence tab 
function gen_item_table(page,sort_col,sort_dir) {
    //
    var item_table_args = {};
    var data_sql_args = {};
    var meta_sql_args = {};
    //
    // setting up the data and meta SQL args
    meta_sql_args.cmd = 'SELECT';
    meta_sql_args.table = 'table_meta_data';
    meta_sql_args.where = [['in_tables','REGEXP','(^|%)meat_shop_stock(%|$)'],['use_on_pages','REGEXP','(^|%)meat_shop(%|$)']];
    meta_sql_args.orderBy = [['order_index','ASC']];
    data_sql_args.cmd = 'SELECT';
    data_sql_args.table = 'meat_shop_stock';
    data_sql_args.where = [['item_status','LIKE','active']]
    data_sql_args.orderBy = [[sort_col,sort_dir]];
    if (!!(document.getElementById('show-inactive'))) {
        if (document.getElementById('show-inactive').checked) {data_sql_args.where = [];}
    }
    if (!!(document.getElementById('search-item-number'))) {
        if (trim(document.getElementById('search-item-number').value) != '') {data_sql_args.where.push(['item_number','REGEXP',trim(document.getElementById('search-item-number').value)]);}
    }
    //
    // setting tab specifc values
    var table_callback = '';
    if (document.getElementById('tab-clicked').value == 'item-maintenance') {
        table_callback = function() {
                var create_button = "<br><button id=\"create-new-item\" type=\"button\" style=\"display:block; margin:auto;\"onclick=\"create_item();\">Create New Item</button>";
                document.getElementById('item-table-div').innerHTML = document.getElementById('item-table-div').innerHTML + create_button;
            };
        item_table_args.row_onclick = 'mod_item(\'%item_number%\')';
    }
    else if (document.getElementById('tab-clicked').value == 'stock-changes') {
        item_table_args.row_onclick = 'update_item_stock(\'%row_id%\');'; // this will be a gen stock report onclick
    }
    //
    console.log(data_sql_args);
    item_table_args.meta_sql_args = meta_sql_args;
    item_table_args.data_sql_args = data_sql_args;
    //
    // setting up the item table arguments
    item_table_args.table_output_id = 'item-table-div';
    item_table_args.table_id = 'meat-shop-items';
    item_table_args.table_class = 'emp_data_table';
    item_table_args.row_id_prefix = 'item-row';
    item_table_args.table_data_cell_class = 'emp-data-td';
    item_table_args.page_nav_div_id = 'item-table-page-nav';
    item_table_args.page_nav_class = 'page_nav';
    item_table_args.page_nav_id_prefix = 'item';
    item_table_args.page_class_str = 'page_nav_link';
    item_table_args.page_onmouse_str = '';
    item_table_args.page_onclick = 'gen_item_table(%%,%sort_col%,%sort_dir%);';
    item_table_args.tot_pages_shown = 9;
    item_table_args.page = page;
    item_table_args.head_row_class_str = 'emp-data-header';
    item_table_args.sort_col = sort_col;
    item_table_args.sort_dir = sort_dir;
    item_table_args.sort_onclick = 'gen_item_table(%%,%column_name%,%sort_dir%);';
    item_table_args.row_onmouseenter = "add_class('emp_data_tr-highlight','%row_id%')"; 
    item_table_args.row_onmouseleave = "remove_class('emp_data_tr-highlight','%row_id%')";
    item_table_args.add_callback = table_callback;
    //
    create_sortable_table(item_table_args);
}
//
// This function handles the modifcation of an item
function mod_item(item_number) {
    //
    create_form('meat_shop_item','content-div');
    //
    // creating header 
    document.getElementById('modify-header').innerHTML = "Modfiying Item: "+item_number;
    //
    var curr_page = document.getElementById('item-table-page-nav').dataset.currPage;
    var sort_col = document.getElementById('item-table-page-nav').dataset.sortCol;
    var sort_dir = document.getElementById('item-table-page-nav').dataset.sortDir;
    var submit_button = document.getElementById('create-item');
    var mod_button = document.createElement('BUTTON');
    var delete_button = document.createElement('BUTTON');
    var restore_button = document.createElement('BUTTON');
    //
    // creating delete button
    delete_button.id = "delete-item";
    delete_button.type = "button";
    delete_button.appendChild(document.createTextNode('Delete Item'));
    delete_button.addEventListener("click", function () {
        init_item_form_validation('delete');   
    });
    // creating modify button
    mod_button.id = "modify-item";
    mod_button.type = "button";
    mod_button.appendChild(document.createTextNode("Submit Changes"))
    mod_button.addEventListener("click", function () {
        init_item_form_validation('update');
    });   
    // creating reinstate button for inactive employees
    restore_button.id = "restore-item"
    restore_button.type = "button";
    restore_button.appendChild(document.createTextNode('Restore Item'));
    restore_button.addEventListener("click", function () {
        init_item_form_validation('restore');
    });
    //
    // putting all three buttons onto the form
    submit_button.parentNode.insertBefore(delete_button, submit_button.nextSibling);
    submit_button.parentNode.insertBefore(document.createTextNode( '\u00A0\u00A0' ), submit_button.nextSibling);
    submit_button.parentNode.insertBefore(restore_button, delete_button.nextSibling);
    submit_button.parentNode.insertBefore(document.createTextNode( '\u00A0\u00A0' ), delete_button.nextSibling);
    submit_button.parentNode.replaceChild(mod_button,submit_button);
    //
    // temporary function to determine what buttons to show or hide based on emp status
    var button_fun = function() {
        // 
        if (document.getElementById('item-status').value != 'active') {
            add_class('hidden-elm',delete_button.id);
        }
        else {
            add_class('hidden-elm',restore_button.id);
        }
    }
    //
    // populating form with item's data
    var populate_form_args = {};
    populate_form_args.table = 'meat_shop_stock';
    populate_form_args.unique_col = 'item_number';
    populate_form_args.unique_data = item_number;
    populate_form_args.form_id = 'meat-shop-item';
    populate_form_args.trigger_events = true;
    populate_form_args.add_callback_funs = button_fun;
    //
    populate_form(populate_form_args);
    document.getElementById('item-name').focus();
    document.getElementById('item-number').disabled = true; //this should never be edited
}
//
// generates the table for modifying a stock change record 
function gen_stock_table(page,sort_col,sort_dir) {
    //
    var item_table_args = {};
    var data_sql_args = {};
    var meta_sql_args = {};
    //
    // setting up the data and meta SQL args
    meta_sql_args.cmd = 'SELECT';
    meta_sql_args.table = 'table_meta_data';
    meta_sql_args.where = [['in_tables','REGEXP','(^|%)meat_shop_stock_changes(%|$)'],['use_on_pages','REGEXP','(^|%)meat_shop(%|$)']];
    meta_sql_args.orderBy = [['order_index','ASC']];
    data_sql_args.cmd = 'SELECT';
    data_sql_args.table = 'meat_shop_stock_changes';
    data_sql_args.orderBy = [[sort_col,sort_dir]];
    if (!(document.getElementById('show-deleted').checked)) {data_sql_args.where = [['entry_status','LIKE','submitted']];}
    if (trim(document.getElementById('search-item-number').value) != '') {data_sql_args.where = [['item_number','REGEXP',trim(document.getElementById('search-item-number').value)]];}
    //
    item_table_args.meta_sql_args = meta_sql_args;
    item_table_args.data_sql_args = data_sql_args;
    //
    // setting up the item table arguments
    item_table_args.table_output_id = 'item-table-div';
    item_table_args.table_id = 'meat-shop-records';
    item_table_args.table_class = 'emp_data_table';
    item_table_args.row_id_prefix = 'record-row';
    item_table_args.table_data_cell_class = 'emp-data-td';
    item_table_args.page_nav_div_id = 'records-table-page-nav';
    item_table_args.page_nav_class = 'page_nav';
    item_table_args.page_nav_id_prefix = 'item';
    item_table_args.page_class_str = 'page_nav_link';
    item_table_args.page_onmouse_str = '';
    item_table_args.page_onclick = 'gen_stock_table(%%,%sort_col%,%sort_dir%);';
    item_table_args.tot_pages_shown = 9;
    item_table_args.page = page;
    item_table_args.head_row_class_str = 'emp-data-header';
    item_table_args.sort_col = sort_col;
    item_table_args.sort_dir = sort_dir;
    item_table_args.sort_onclick = 'gen_stock_table(%%,%column_name%,%sort_dir%);';
    item_table_args.row_onclick = 'mod_stock_change_record(\'%entry_id%\')'; 
    item_table_args.row_onmouseenter = "add_class('emp_data_tr-highlight','%row_id%')"; 
    item_table_args.row_onmouseleave = "remove_class('emp_data_tr-highlight','%row_id%')";
    item_table_args.add_callback = ''; 
    //
    create_sortable_table(item_table_args);
}
//
// this creates an entry to update the stock in the items table
function update_item_stock(row_id) {
    //
    create_form('stock_change_form','content-div');
    //
    // manually populating form from item table
    document.getElementById('item-number').value = document.getElementById(row_id+'-item_number').innerHTML;
    document.getElementById('item-name').value = document.getElementById(row_id+'-item_name').innerHTML;
    document.getElementById('curr-quantity').value = document.getElementById(row_id+'-quantity').innerHTML;
    document.getElementById('new-quantity').value = document.getElementById(row_id+'-quantity').innerHTML;
    var d = new Date();
    var day = d.getDate();
    var mon = d.getMonth()+1;
    if (day < 10) {day = '0'+day.toString();}
    if (mon < 10) {mon = '0'+mon.toString();}
    document.getElementById('date').value = d.getFullYear()+'-'+mon+'-'+day;
    //
    // adding event handlers 
    document.getElementById('amount').addEventListener('keyup',function() {elementArithmetic('amount','curr-quantity','new-quantity','+');})
    document.getElementById('amount').addEventListener('blur',elementArithmetic('amount','curr-quantity','new-quantity','+'));

}
//
// this updates a stock change record and reflects the change in the items table
function mod_stock_change_record(entry_id) {
    //
    var data_sql = '';
    var callback = '';
    //
    create_form('stock_change_form','content-div');
    //
    // unhiding form elements 
    remove_class('hidden-elm','orig-amount-label');
    remove_class('hidden-elm','orig-amount');
    document.getElementById('amount-label').innerHTML = 'New Add/Remove Pounds:';
    //
    // creating the meta_data sql statement
    data_sql =  'SELECT * FROM meat_shop_stock '
    data_sql += 'INNER JOIN meat_shop_stock_changes ON meat_shop_stock.item_number = meat_shop_stock_changes.item_number ';
    data_sql += 'WHERE meat_shop_stock_changes.entry_id LIKE '+entry_id;
    //
    var submit_button = document.getElementById('create-record');
    var mod_button = document.createElement('BUTTON');
    var delete_button = document.createElement('BUTTON');
    var restore_button = document.createElement('BUTTON');
    //
    // creating delete button
    delete_button.id = "del-entry";
    delete_button.type = "button";
    delete_button.appendChild(document.createTextNode('Delete Entry'));
    delete_button.addEventListener("click", function () {
        validate_stock_form('delete');     
    });
    // creating modify button
    mod_button.id = "mod-entry";
    mod_button.type = "button";
    mod_button.appendChild(document.createTextNode("Submit Changes"));
    mod_button.addEventListener('click', function () {
        validate_stock_form('update');  
    });
    // creating restore button for deleted records
    restore_button.id = "restore-entry"
    restore_button.type = "button";
    restore_button.appendChild(document.createTextNode('Restore Entry'));
    restore_button.addEventListener("click", function () {
        validate_stock_form('restore'); 
    });
    //
    // putting all three buttons onto the form
    submit_button.parentNode.insertBefore(delete_button, submit_button.nextSibling);
    submit_button.parentNode.insertBefore(document.createTextNode( '\u00A0\u00A0' ), submit_button.nextSibling);
    submit_button.parentNode.insertBefore(restore_button, delete_button.nextSibling);
    submit_button.parentNode.insertBefore(document.createTextNode( '\u00A0\u00A0' ), delete_button.nextSibling);
    submit_button.parentNode.replaceChild(mod_button,submit_button);
    //
    // temporary function to determine what buttons to show or hide based on emp status
    var button_fun = function() {
        // 
        if (document.getElementById('entry-status').value != 'submitted') {
            add_class('hidden-elm',delete_button.id);
        }
        else {
            add_class('hidden-elm',restore_button.id);
        }
    }
    //
    // setting up calback function
    var callback = function(response) {
        var data = response.data[0];
        var populate_form_args = {
            data_arr : data,
            form_id : 'update-item-stock',
            trigger_events : true,
        }
        process_form_data(populate_form_args);
        button_fun();
        document.getElementById('modify-header').innerHTML = "Modfiying Record: "+entry_id+' for Item: '+data.item_number+' - '+data.item_name;
        document.getElementById('new-quantity').value = data.quantity;
    }
    //
    // fetching data
    var sql_arr = [data_sql];
    var name_arr = ['data'];
    ajax_multi_fetch(sql_arr,name_arr,callback)
    //
    // adding event handlers
    var quantity_change = function() {
        var org_qty = +document.getElementById('curr-quantity').value;
        var org_amt = +document.getElementById('orig-amount').value;
        var new_amt = +document.getElementById('amount').value;
        var new_qty = document.getElementById('new-quantity');
        //
        new_qty.value = (org_qty - org_amt) + new_amt;
    }
    document.getElementById('amount').addEventListener('keyup',quantity_change)
    document.getElementById('amount').addEventListener('blur',quantity_change);
}
//
// this handles inputs for the meat shop reports
function meat_shop_inventory_report() {
    //
    // clearing elements inside main-container div
    var childNodes = document.getElementById('main-container').childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].nodeType == 1) {childNodes[i].innerHTML = '';}
    }
    //
    var report_type = 'stock_report'; //this can be a variable later
    var table = 'meat_shop_stock'; //this can be a variable later
    var sort_col = 'item_number'; //variable later on
    var sort_dir = 'ASC'; //varible later on
    var meta_sql_args = {};
    var data_sql_args = {};
    var item_table_args = {};
    //
    // setting header
    document.getElementById('modify-header').innerHTML = 'Meat Shop Inventory Report'
    //
    // populating meta and data sql args
    meta_sql_args.cmd = 'SELECT';
    meta_sql_args.table = 'table_meta_data';
    meta_sql_args.where = [['in_tables','REGEXP','(^|%)'+table+'(%|$)'],['use_on_pages','REGEXP','(^|%)meat_shop(%|$)']];
    meta_sql_args.where.push(['use_in_html_tables','REGEXP','(^|%)'+report_type+'(%|$)']);
    meta_sql_args.orderBy = [['order_index','ASC']];
    //
    data_sql_args.cmd = 'SELECT';
    data_sql_args.table = table;
    data_sql_args.orderBy = [[sort_col,sort_dir]];
    if (table == 'meat_shop_stock') { data_sql_args.where = [['item_status','LIKE','active']];}
    //
    item_table_args.meta_sql_args = meta_sql_args;
    item_table_args.data_sql_args = data_sql_args;
    //
    // setting up the item table arguments
    item_table_args.table_output_id = 'content-div';
    item_table_args.table_id = 'meat-shop-report';
    item_table_args.table_class = 'emp_data_table';
    item_table_args.row_id_prefix = 'report-row';
    item_table_args.table_data_cell_class = 'emp-data-td';
    item_table_args.page_nav_div_id = 'report-page-nav';
    item_table_args.page_nav_class = 'page_nav';
    item_table_args.page_nav_id_prefix = report_type;
    item_table_args.page_class_str = 'page_nav_link';
    item_table_args.page_onmouse_str = '';
    item_table_args.page_onclick = '';
    item_table_args.tot_pages_shown = 1;
    item_table_args.page = 1;
    item_table_args.num_per_page = 1000000; //preventing mulitple pags
    item_table_args.head_row_class_str = 'emp-data-header';
    item_table_args.sort_col = sort_col;
    item_table_args.sort_dir = sort_dir;
    item_table_args.sortable = false;
    item_table_args.sort_onclick = '';
    item_table_args.row_onclick = ''; 
    item_table_args.row_onmouseenter = "add_class('emp_data_tr-highlight','%row_id%')"; 
    item_table_args.row_onmouseleave = "remove_class('emp_data_tr-highlight','%row_id%')";
    item_table_args.add_callback = mod_inventory_report_table;
    //
    create_sortable_table(item_table_args);
    
}
//
// this function modifies the non sortable table output by create_meat_shop_report
function mod_inventory_report_table() {
    //
    var report_rows = document.getElementById('meat-shop-report').getElementsByTagName("TR");;
    //
    // hiding the page nav bar
    add_class('hidden-elm','report-page-nav')
    //
    // modifying head row to add in total value column
    var head_row = report_rows[0];
    var value_td = '<td id="Total Value" class="emp-data-header">Total Value</td>';
    head_row.innerHTML += value_td;
    //
    // processing rows
    var total_weight = 0.0;
    var total_value = 0.0;
    var row = '';
    var price_td = '';
    var qty_td = '';
    var price = 0.0;
    var qty = 0.0;
    var value = 0.0;
    for (var i = 1; i < report_rows.length; i++) {
        row = report_rows[i];
        price_td = document.getElementById(row.id+'-cost_per_lb');
        qty_td = document.getElementById(row.id+'-quantity');
        price = +price_td.innerHTML;
        qty = +qty_td.innerHTML;
        //
        // calculating value of stock
        value = qty*price;
        total_weight += qty;
        total_value += value;
        //
        // outputting tds
        price_td.innerHTML = '<span style="float:left;">$&nbsp;</span><span style="float:right;">'+round(price,2).toFixed(2)+'<span>';
        //qty_td.style = 'text-align: right';
        qty_td.innerHTML = round(qty,CONSTANTS.STD_PRECISION).toFixed(CONSTANTS.STD_PRECISION).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") //this regex adds commas
        value = round(value,CONSTANTS.STD_PRECISION).toFixed(CONSTANTS.STD_PRECISION).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        value_td = '<td id="'+row.id+'-total_value" class="emp-data-td"><span style="float:left;">$&nbsp;</span><span style="float:right;">'+value+'<span></td>';
        row.innerHTML += value_td;
        
    }
    //
    // outputting a total row at the bottom of the table
    total_weight = round(total_weight,CONSTANTS.STD_PRECISION).toFixed(CONSTANTS.STD_PRECISION).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    total_value = round(total_value,CONSTANTS.STD_PRECISION).toFixed(CONSTANTS.STD_PRECISION).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    var total_row = '<tr>';
    total_row += '<td colspan=2 class="emp-data-header" style="font-size:16px;">Total:</td>';
    total_row += '<td class="emp-data-header" style="text-align: right; font-size:16px;">'+total_weight+'</td>';
    total_row += '<td class="emp-data-header">&nbsp</td>';
    total_row += '<td class="emp-data-header"><span style="float:left; font-size:16px;">$&nbsp;</span><span style="float:right; font-size:16px;">'+total_value+'<span></td>';
    document.getElementById('meat-shop-report').innerHTML += total_row;
}
//
// this handles page creation and generation of a stock change report
function stock_change_report() {
    //
    // clearing elements inside main-container div
    var childNodes = document.getElementById('main-container').childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].nodeType == 1) {childNodes[i].innerHTML = '';}
    }
    //
    var head ='<fieldset class="fieldset-default">';
    head += '<legend>Stock Report Parameters</legend>';
    head += '<label class="label-12em">Show Deleted Records</label><input id="show-deleted" type="checkbox" onclick="show_update_button(\'create-report\',\'stock-change-report-table\',\'Show Changes\');">';
    head += '<br>';
    head += '<label class="label-12em">Narrow by Item Number: </label><input id="search-item-number" type="text" onkeyup="show_update_button(\'create-report\',\'stock-change-report-table\',\'Show Changes\');">';
    head += '<br>';
    head += '<br>';
    head += '<div id="time-range-inputs"></div>';
    head += '</fieldset>';
    head += '<button id="create-report" type="button" onclick="create_change_report();">Create Report</button>';
    head += '<br>';
    // outputting head
    document.getElementById('input-div').innerHTML = head;
    //
    // creating time range inputs
    var input_args = {
        output_id : 'time-range-inputs',
        time_range_onchange : "show_update_button('create-report','stock-change-report-table','Show Changes');",
        day_onkeyup : "show_update_button('create-report','stock-change-report-table','Show Changes');",
        month_onchange : "show_update_button('create-report','stock-change-report-table','Show Changes');",
        year_onchange  : "show_update_button('create-report','stock-change-report-table','Show Changes');",
        add_date_range_onclick : "show_update_button('create-report','stock-change-report-table','Show Changes');"
    };
    create_time_range_inputs(input_args);
}
//
// generates the table for modifying a stock change record 
function create_change_report() {
    //
    var item_table_args = {};
    var data_sql_args = {};
    var meta_sql_args = {};
    var ts_obj = to_and_from_timestamps();
    //
    // creating new get data button to prevent stacking of event handlers
    var old_btn = document.getElementById('create-report');
    var new_btn = document.createElement("BUTTON");
    new_btn.appendChild(document.createTextNode("Create Report"));
    new_btn.id = "create-report"
    new_btn.className = "hidden-elm"
    new_btn.addEventListener("click",function(){ 
            create_change_report();
    });
    old_btn.parentNode.replaceChild(new_btn,old_btn);
    //
    // setting up the data and meta SQL args
    meta_sql_args.cmd = 'SELECT';
    meta_sql_args.table = 'table_meta_data';
    meta_sql_args.where = [['in_tables','REGEXP','(^|%)meat_shop_stock_changes(%|$)'],['use_on_pages','REGEXP','(^|%)meat_shop(%|$)']];
    meta_sql_args.orderBy = [['order_index','ASC']];
    data_sql_args.cmd = 'SELECT';
    data_sql_args.table = 'meat_shop_stock_changes';
    data_sql_args.where = [['date','BETWEEN',ts_obj.from_ts+' 00:00:00\' AND \''+ts_obj.to_ts+' 23:59:59']];
    data_sql_args.orderBy = [['date','DESC'],['item_number','ASC']];
    if (!(document.getElementById('show-deleted').checked)) {data_sql_args.where.push(['entry_status','LIKE','submitted']);}
    if (trim(document.getElementById('search-item-number').value) != '') {data_sql_args.where.push(['item_number','REGEXP',trim(document.getElementById('search-item-number').value)]);}    //
    item_table_args.meta_sql_args = meta_sql_args;
    item_table_args.data_sql_args = data_sql_args;
    //
    // setting up the item table arguments
    item_table_args.table_output_id = 'content-div';
    item_table_args.table_id = 'stock-change-report-table';
    item_table_args.table_class = 'emp_data_table';
    item_table_args.row_id_prefix = 'record-row';
    item_table_args.table_data_cell_class = 'emp-data-td';
    item_table_args.page_nav_div_id = 'report-page-nav';
    item_table_args.page_nav_class = 'page_nav';
    item_table_args.page_nav_id_prefix = 'item';
    item_table_args.page_class_str = 'page_nav_link';
    item_table_args.page_onmouse_str = '';
    item_table_args.page_onclick = '';
    item_table_args.tot_pages_shown = 1;
    item_table_args.page = 1;
    item_table_args.num_per_page = 1000000;
    item_table_args.head_row_class_str = 'emp-data-header';
    item_table_args.sort_col = 'creation_timestamp';
    item_table_args.sort_dir = 'DESC';
    item_table_args.sort_onclick = '';
    item_table_args.sortable = false;
    item_table_args.row_onclick = ''; 
    item_table_args.row_onmouseenter = "add_class('emp_data_tr-highlight','%row_id%')"; 
    item_table_args.row_onmouseleave = "remove_class('emp_data_tr-highlight','%row_id%')";
    item_table_args.add_callback = function() {
            add_class('hidden-elm','report-page-nav');
    }; 
    //
    create_sortable_table(item_table_args);
}