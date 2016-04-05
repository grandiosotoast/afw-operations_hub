////////////////////////////////////////////////////////////////////////////////
//////////////       This file holds the functions that are          ///////////
//////////////       associated only with marketing forms            ///////////
////////////////////////////////////////////////////////////////////////////////
"use strict";
//
// vendor / broker setup form
var setup_vendor_broker = ''+
    '<form id="vendor-broker-setup-form">'+

    '<fieldset class="fieldset-default">'+
    '<legend>Basic Information</legend>'+
    '<label class="label">Broker:</label>'+
    '<input id="broker" name="broker" class="text-input" type="text" onkeyup="remove_class(\'invalid-field\',this.id);" onblur="validate_setup_vendor_broker(true);">'+
    '&nbsp;&nbsp;&nbsp;&nbsp;<label>Skip:</label>'+
    '<input id="skip-broker" type="checkbox" onclick="toggle_disabled(\'broker\')">'+
    '<br>'+
    '<label class="label">Vendor:</label>'+
    '<input id="vendor" name="vendor" class="text-input" type="text" onkeyup="remove_class(\'invalid-field\',this.id);" onblur="validate_setup_vendor_broker(true);">'+
    '&nbsp;&nbsp;&nbsp;&nbsp;<label>Skip:</label>'+
    '<input id="skip-vendor" type="checkbox" onclick="toggle_disabled(\'vendor\')">'+
    '<br>'+
    '<label class="label">Vendor Number:</label>'+
    '<input id="vendor-number" name="vendor_num" class="text-input" type="text" onkeyup="remove_class(\'invalid-field\',this.id);" onblur="validate_setup_vendor_broker(true);">'+
    '&nbsp;&nbsp;&nbsp;&nbsp;<label>Skip:</label>'+
    '<input id="skip-vendor-number" type="checkbox" onclick="toggle_disabled(\'vendor-number\')">'+
    '</fieldset>'+
    '<br>'+

    '<fieldset class="fieldset-default">'+
    '<legend>Marketing Information</legend>'+
    '<label class="label">Marketing Level</label>'+
    '<select id="marketing-level" name="marketing_level" class="dropbox-input" onchange="remove_class(\'invalid-field\',this.id); validate_setup_vendor_broker(true);"></select>'+
    '<br>'+
    '<label class="label">Volume %</label>'+
    '<input id="volume-percent" name="volume_percent" class="text-input" value="00.00" onkeyup="check_num_str(this.id,false,false);" onblur="validate_setup_vendor_broker(true);"> %'+
    '<br>'+
    '<label class="label">Purchases %</label>'+
    '<input id="purchase-percent" name="purchase_percent" class="text-input" value="00.00" onkeyup="check_num_str(this.id,false,false);" onblur="validate_setup_vendor_broker(true);"> %'+
    '<br>'+
    '<label class="label">Amount per Unit<span style="float: right; text-align: right;">$&nbsp;</span></label>'+
    '<input id="amount-per-unit" name="dollars_per_unit" class="text-input" value="  0.00" onkeyup="check_num_str(this.id,false,false);" onblur="validate_setup_vendor_broker(true);">'+
    '<br>'+
    '<br>'+
    '<label class="label">Notes</label>'+
    '<textarea id="growth-notes" name="growth_notes" rows=4 cols=60 value=""></textarea>'+
    '</fieldset>'+
    '<br>'+

    '<fieldset class="fieldset-default">'+
    '<legend>Food Show Information</legend>'+
    '<label class="label">Booth Size</label>'+
    '<select id="booth-size" name="booth_size" class="dropbox-input">'+
        '<option value="0">None</option>'+
        '<option value="1">Half</option>'+
        '<option value="2">Full</option>'+
    '</select>'+
    '<br>'+
    '<label class="label">Booth Price</label>'+
    '<input id="booth-price" name="booth_price" class="text-input" value="0.00" onkeyup="check_num_str(this.id,false,false);" onblur="validate_setup_vendor_broker(true);">'+
    '<br>'+
    '<label class="label">Electric Fee</label>'+
    '<input id="electric-fee" name="electric_fee" class="text-input" value="0.00" onkeyup="check_num_str(this.id,false,false);" onblur="validate_setup_vendor_broker(true);">'+
    '<br>'+
    '<label class="label">Total Price</label>'+
    '<input id="total-price" name="total_price" class="text-input" value="0.00" readonly>'+
    '<br>'+
    '<br>'+
    '<label class="label">Paid</label>'+
    '<input id="paid" name="paid" class="text-input" value="0.00" onkeyup="check_num_str(this.id,false,false);" onblur="validate_setup_vendor_broker(true);">'+
    '<br>'+
    '<label class="label">Remaining Due</label>'+
    '<input id="total-due" class="text-input" value="0.00" readonly>'+
    '<br>'+
    '<br>'+
    '<label class="label">Notes</label>'+
    '<textarea id="food-show-notes" name="food_show_notes" rows=4 cols=60 value=""></textarea>'+
    '</fieldset>'+

    '<input id="vendor-status" name="vendor_status" type="hidden" value="active">'+
    '<input id="vendor-internal-id" name="vendor_internal_id" type="hidden" value="">'+
    '<label id="form-errors" class="error-msg hidden-elm">Form errors are highlighted in red</label><br>'+
    '<button id="submit-vendor-broker-form" type="button" onclick="submit_vendor_broker_form(\'create\');">Add Vendor/ Broker</button>'+
    '</form>';
//
// this function will return one of the above forms to a page
function create_marketing_form(form_name,out_id) {
    var forms = {};
    forms.setup_vendor_broker = setup_vendor_broker;
    //
    if (!!(forms[form_name])) {
        document.getElementById(out_id).innerHTML = forms[form_name];
    }
    else {
       document.getElementById(out_id).innerHTML = "No form with that name found.";
    }
    return;
}
//
//
function validate_setup_vendor_broker(truncate) {
    //
    var form_id = 'vendor-broker-setup-form';
    var skip_ids = 'growth-notes,food-show-notes,vendor-status,vendor-internal-id';
    var basic_val_error = false;
    var value_error = false;
    var float_input_ids = ['volume-percent','purchase-percent','amount-per-unit',
                           'booth-price','electric-fee','total-price','paid','total-due'];
    var precision = 8;
    if (truncate) {
        precision = CONSTANTS.STD_PRECISION;
    }
    //
    basic_val_error = basic_validate(form_id,skip_ids);
    //
    var form_values = null;
    form_values = get_all_form_values(form_id,'');
    var booth_price = Number.parse(form_values['booth_price']);
    var electric_fee = Number.parse(form_values['electric_fee']);
    var amount_paid = Number.parse(form_values['paid']);
    var total_price = booth_price + electric_fee;
    var remaining = total_price - amount_paid;
    document.getElementById('total-price').value = total_price;
    document.getElementById('total-due').value = remaining;
    //
    var value = 0.0;
    var input = null;
    for (var i = 0; i < float_input_ids.length; i++) {
        input = document.getElementById(float_input_ids[i]);
        value_error = check_data_type(float_input_ids[i],'float',true);
        value = Number.parse(input.value);
        if (value === '') { continue;}
        input.value = round(value,precision).toFixed(precision);
    }
}
//
//
function submit_vendor_broker_form(action) {
    //
    var form_id = 'vendor-broker-setup-form';
    var errors = false;
    var form_values = null;
    var cont = false;
    var act = 'modification'
    var sql_args = null;
    var sql = '';
    var callback = null;
    //
    remove_class_all('invalid-field');
    validate_setup_vendor_broker(false);
    errors = check_for_invalid_fields(form_id);
    //
    // returning early if there are errors
    if (errors) { remove_class('hidden-elm','form-errors'); return;}
    else { add_class('hidden-elm','form-errors');}
    //
    form_values = get_all_form_values(form_id,'');
    //
    if (action == 'create') { act = 'creation'; form_values['vendor_status'] = 'active';}
    if (action == 'delete') { act = 'deletion'; form_values['vendor_status'] = 'inactive';}
    if (action == 'restore') { act = 'restoration'; form_values['vendor_status'] = 'active';}
    cont = confirm('Confirm '+act+' of Broker/ Vendor.');
    if (!(cont)) { validate_setup_vendor_broker(true); return;}
    //
    // using callback to assign tables to columns
    callback = function(response) {
        //
        var meta_data = {};
        for (var i = 0; i < response.meta_data.length; i++) {
            meta_data[response.meta_data[i]['column_name']] = response.meta_data[i];
        }
        //
        var args = {};
        var sql_arr = null;
        args.action = action;
        args.meta_data = meta_data;
        args.form_values = form_values;
        sql_arr = create_vendor_broker_form_sql(args);
        //
        exec_transaction(sql_arr,reset_vendor_broker_form.bind(null,act));
    }
    //
    sql_args = {
        'cmd' : 'SELECT',
        'table' : 'table_meta_data',
        'cols' : ['column_name','in_tables'],
    }
    //
    sql = gen_sql(sql_args);
    ajax_fetch([sql],['meta_data'],callback);
}
//
// creates the SQL statements to submit the vendor broker form
function create_vendor_broker_form_sql(args) {
    //
    var include_tables = ['marketing_vendor_broker_table','marketing_accounting',
                          'marketing_food_show','marketing_growth',
                          'marketing_services_performed','marketing_alacarte_commitment'];
    var sql_arr = [];
    var cmd = 'UPDATE';
    var where = null;
    var username = document.getElementById('user-username').value
    //
    if (args.action == 'create') {
        cmd = 'INSERT';
        args.form_values['vendor_internal_id'] = 'LAST_INSERT_ID()';
    }
    else {
        where = [['vendor_internal_id','LIKE',args.form_values['vendor_internal_id']]];
        delete args.form_values['vendor_internal_id'];
    }
    //
    // determining which table(s) each form value belongs to.
    var meta_data = args.meta_data
    var pat = new RegExp('(?:^|%)(marketing.*?)(?:%|$)','gi')
    var tables = null;
    var table_data = {};
    for (var col in meta_data) {
        col = meta_data[col];
        tables = col['in_tables'].match(/(?:^|%)(marketing.*?)(?=%|$)/g);
        for (var i in tables) {
            tables[i] = tables[i].replace(/%/g,'');
            if (!(table_data.hasOwnProperty(tables[i]))) {
                table_data[tables[i]] = {};
                table_data[tables[i]]['cols'] = {};
            }
            // adding the last modified by columns to table data
            if (col['column_name'].match(/last_modified_by/)) {
                table_data[tables[i]]['cols'][col['column_name']] = username;
            }
        }
        col['in_tables'] = tables
    }
    //
    // grouping form values by table
    var col = null;
    for (var name in args.form_values) {
        col = meta_data[name];
        for (var i in col['in_tables']) {
            table_data[col['in_tables'][i]]['cols'][name] = args.form_values[name];
        }
    }
    //
    // removing tables not in include list and enforcing order defined in include_tables
    var temp_arr = []
    for (var i in include_tables) {
        table_data[include_tables[i]]['table'] = include_tables[i];
        temp_arr.push(table_data[include_tables[i]]);
    }
    table_data = temp_arr;
    console.log(table_data)
    //
    // setting action specific params
    if (args.action == 'create') {
        delete table_data[0]['cols']['vendor_internal_id']
    }
    //
    // generating sql statements
    var sql_args = {};
    var table = null
    for (var i in table_data) {
        table = table_data[i];
        //
        sql_args = {};
        sql_args['cmd'] = cmd;
        sql_args['table'] = table['table'];
        if (where) { sql_args['where'] = where;}
        sql_args['cols'] = [];
        sql_args['vals'] = [];
        for (var col in table['cols']) {
            sql_args['cols'].push(col);
            sql_args['vals'].push(table['cols'][col]);
        }
        sql_arr.push(gen_sql(sql_args));
    }
    //
    return(sql_arr)
}
//
// resets the vendor broker from
function reset_vendor_broker_form(act) {
    //
    alert('Successful '+act+' of Vendor/ Broker.');
    //
    var curr_page = document.getElementById('vbt-table-page-nav').dataset.currPage;
    var sort_col = document.getElementById('vbt-table-page-nav').dataset.sortCol;
    var sort_dir = document.getElementById('vbt-table-page-nav').dataset.sortDir;
    create_vendor_broker_table(curr_page,sort_col,sort_dir);
    //
    // recreating form
    if (act == 'creation') {
        var args = {'sql_args' : {'order_by':[['marketing_level','ASC']]}};
        create_marketing_form('setup_vendor_broker','content-div');
        populate_dropbox_options('marketing-level','marketing_tiers','marketing_level','marketing_level','Select Level',args);
    }
    else {
        document.getElementById('content-div').removeAll();
    }
}