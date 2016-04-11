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
    '<legend>Marketing and Growth Information</legend>'+
    '<label class="label">Marketing Level</label>'+
    '<select id="marketing-level" name="marketing_level" class="dropbox-input" onchange="remove_class(\'invalid-field\',this.id); validate_setup_vendor_broker(true);"></select>'+
    '<br>'+
    '<label class="label">Volume %</label>'+
    '<input id="volume-percent" name="volume_percent" class="text-input" value="00.00" onkeyup="check_num_str(this.id,false,false);" onblur="validate_setup_vendor_broker(true);"> %'+
    '<br>'+
    '<label class="label">Purchases %</label>'+
    '<input id="purchase-percent" name="purchase_percent" class="text-input" value="00.00" onkeyup="check_num_str(this.id,false,false);" onblur="validate_setup_vendor_broker(true);"> %'+
    '<br>'+
    '<label class="label">Dollars per Unit<span style="float: right; text-align: right;">$&nbsp;</span></label>'+
    '<input id="dollars-per-unit" name="dollars_per_unit" class="text-input" value="  0.00" onkeyup="check_num_str(this.id,false,false);" onblur="validate_setup_vendor_broker(true);">'+
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
    '<input id="total-booth-price" class="text-input" value="0.00" readonly>'+
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
// vendor / broker contact form
var marketing_contact_info_form = ''+
    '<form id="marketing-contact-info-form">'+

    '<fieldset class="fieldset-default">'+
    '<legend>Vendor/Broker Information</legend>'+
    '<label class="label">Broker:</label>'+
    '<input id="broker" name="broker" class="text-input" type="text" disabled>'+
    '<br>'+
    '<label class="label">Vendor:</label>'+
    '<input id="vendor" name="vendor" class="text-input" type="text" disabled>'+
    '</fieldset>'+

    '<fieldset class="fieldset-default">'+
    '<legend>Personal Information</legend>'+
    '<label class="label">Name</label>'+
    '<input id="contact-name" name="contact_name" class="text-input" type="text" onblur="validate_marketing_contact_info_form();">'+
    '<br>'+
    '<label class="label">Phone Number</label>'+
    '<input id="contact-phone-number" name="contact_phone_number" class="text-input" type="text" onkeyup="remove_class(\'invalid-field\',this.id); check_phone_str(this.id,null,false);" onblur="validate_marketing_contact_info_form();">'+
    '&nbsp;&nbsp;&nbsp;&nbsp;<label>Skip:</label>'+
    '<input id="skip-contact-phone-number" type="checkbox" onclick="toggle_disabled(\'contact-phone-number\')">'+
    '&nbsp;&nbsp;&nbsp;&nbsp;<label>Force Value:</label>'+
    '<input id="force-contact-phone-number" type="checkbox" onclick="force_value(this);">'+
    '<br>'+
    '<label class="label">Email</label>'+
    '<input id="contact-email" name="contact_email" class="text-input" type="text" onkeyup="remove_class(\'invalid-field\',this.id);" onblur="validate_marketing_contact_info_form();">'+
    '&nbsp;&nbsp;&nbsp;&nbsp;<label>Skip:</label>'+
    '<input id="skip-contact-email" type="checkbox" onclick="toggle_disabled(\'contact-email\')">'+
    '&nbsp;&nbsp;&nbsp;&nbsp;<label>Force Value:</label>'+
    '<input id="force-contact-email" type="checkbox" onclick="force_value(this);">'+
    '<br>'+
    '</fieldset>'+

    '<fieldset class="fieldset-default">'+
    '<legend>Additional Information</legend>'+
    '<label class="label">On Mail CHIMP</label>'+
    '<input id="on-mail-chimp" name="on_mail_chimp" class="text-input" type="text" value="NO" onkeyup="remove_class(\'invalid-field\',this.id);" onblur="validate_marketing_contact_info_form();">'+
    '<br>'+
    '<label class="label">Communicated Food Show</label>'+
    '<input id="communicated-food-show" name="communicated_food_show" class="text-input" type="text" value="NO" onkeyup="remove_class(\'invalid-field\',this.id);" onblur="validate_marketing_contact_info_form();">'+
    '<br>'+
    '<label class="label">Received Show Forms</label>'+
    '<input id="received-show-forms" name="received_show_forms" class="text-input" type="text" value="NO" onkeyup="remove_class(\'invalid-field\',this.id);" onblur="validate_marketing_contact_info_form();">'+
    '<br>'+
    '<label class="label">Samples</label>'+
    '<input id="samples" name="samples" class="text-input" type="text" value="NO" onkeyup="remove_class(\'invalid-field\',this.id);" onblur="validate_marketing_contact_info_form();">'+
    '<br>'+
    '</fieldset>'+

    '<input id="contact-status" name="contact_status" type="hidden" value="active">'+
    '<input id="contact-internal-id" name="contact_internal_id" type="hidden" value="">'+
    '<input id="vendor-internal-id" name="vendor_internal_id" type="hidden" value="">'+
    '<label id="form-errors" class="error-msg hidden-elm">Form errors are highlighted in red</label><br>'+
    '<button id="submit-contact-info-form" type="button" onclick="submit_contact_info_form(\'create\');">Add New Contact</button>'+
    '</form>';
//
// foodshow form
var marketing_food_show_form = ''+
    '<form id="marketing-food-show-form">'+

    '<fieldset class="fieldset-default">'+
    '<legend>Vendor/Broker Information</legend>'+
    '<label class="label">Broker:</label>'+
    '<input id="broker" name="broker" class="text-input" type="text" disabled>'+
    '<br>'+
    '<label class="label">Vendor:</label>'+
    '<input id="vendor" name="vendor" class="text-input" type="text" disabled>'+
    '<br>'+
    '<label class="label">Marketing Level:</label>'+
    '<input id="marketing-level" name="marketing_level" class="text-input" type="text" disabled>'+
    '</fieldset>'+

    '<fieldset class="fieldset-default">'+
    '<legend>Food Show Information</legend>'+
    '<label class="label">Booth Size</label>'+
    '<select id="booth-size" name="booth_size" class="dropbox-input">'+
        '<option value="" selected disabled>Select Size</option>'+
        '<option value="0">None</option>'+
        '<option value="0.5">Half</option>'+
        '<option value="1.0">Full</option>'+
    '</select>'+
    '<br>'+
    '<label class="label">Booth Price</label>'+
    '<input id="booth-price" name="booth_price" class="text-input" value="0.00" onkeyup="remove_class(\'invalid-field\',this.id); check_num_str(this.id,false,false);" onblur="validate_marketing_food_show_form(true);">'+
    '<br>'+
    '<label class="label">Electric Fee</label>'+
    '<input id="electric-fee" name="electric_fee" class="text-input" value="0.00" onkeyup="remove_class(\'invalid-field\',this.id); check_num_str(this.id,false,false);" onblur="validate_marketing_food_show_form(true);">'+
    '<br>'+
    '<label class="label">Total Price</label>'+
    '<input id="total-booth-price" class="text-input" value="0.00" readonly>'+
    '<br>'+
    '<br>'+
    '<label class="label">Food Show Payments</label>'+
    '<input id="paid" name="paid" class="text-input" value="0.00" onkeyup="remove_class(\'invalid-field\',this.id); check_num_str(this.id,false,false);" onblur="validate_marketing_food_show_form(true);">'+
    '<br>'+
    '<label class="label">Remaining Due</label>'+
    '<input id="total-due" class="text-input" value="0.00" readonly>'+
    '<br>'+
    '<br>'+
    '<label class="label">Notes</label>'+
    '<textarea id="food-show-notes" name="food_show_notes" rows=4 cols=60 value=""></textarea>'+
    '</fieldset>'+

    '<input id="food-show-booth-fee" name="food_show_booth_fee" type="hidden" disabled>'+
    '<input id="vendor-internal-id" name="vendor_internal_id" type="hidden" value="">'+
    '<label id="form-errors" class="error-msg hidden-elm">Form errors are highlighted in red</label><br>'+
    '<button id="submit-food-show-form" type="button" onclick="submit_marketing_food_show_form();">Submit Changes</button>'+
    '</form>';
//
// foodshow form
var marketing_payments_and_growth_form = ''+
    '<form id="marketing-payments-and-growth-form">'+

    '<fieldset class="fieldset-default">'+
    '<legend>Vendor/Broker Information</legend>'+
    '<label class="label">Broker:</label>'+
    '<input id="broker" name="broker" class="text-input" type="text" disabled>'+
    '<br>'+
    '<label class="label">Vendor:</label>'+
    '<input id="vendor" name="vendor" class="text-input" type="text" disabled>'+
    '<br>'+
    '<label class="label">Marketing Level:</label>'+
    '<input id="marketing-level" name="marketing_level" class="text-input" type="text" disabled>'+
    '</fieldset>'+

    '<fieldset class="fieldset-default">'+
    '<legend>Food Show Information</legend>'+
    '<span style="float: right;">'+
    '<label style="color:rgb(127,127,127); font-size:14px;">Last Updated:&nbsp;&nbsp;</label>'+
    '<input name="food_show_last_modified" class="input-borderless"  disabled>'+
    '</span>'+
    '<label class="label">Update Information:</label>'+
    '<input id="update-food-show-info" type="checkbox" onclick="toggle_food_show_fields();">'+
    '<br>'+
    '<label class="label">Booth Size</label>'+
    '<select id="booth-size" name="booth_size" class="dropbox-input" disabled>'+
        '<option value="" selected disabled>Select Size</option>'+
        '<option value="0">None</option>'+
        '<option value="0.5">Half</option>'+
        '<option value="1.0">Full</option>'+
    '</select>'+
    '<br>'+
    '<label class="label">Booth Price</label>'+
    '<input id="booth-price" name="booth_price" class="text-input" value="0.00" onkeyup="remove_class(\'invalid-field\',this.id); check_num_str(this.id,false,false);" onblur="validate_payments_and_growth_form(true);" disabled>'+
    '<br>'+
    '<label class="label">Electric Fee</label>'+
    '<input id="electric-fee" name="electric_fee" class="text-input" value="0.00" onkeyup="remove_class(\'invalid-field\',this.id); check_num_str(this.id,false,false);" onblur="validate_payments_and_growth_form(true);" disabled>'+
    '<br>'+
    '<br>'+
    '<label class="label">Food Show Payments</label>'+
    '<input id="paid" name="paid" class="text-input" value="0.00" onkeyup="remove_class(\'invalid-field\',this.id); check_num_str(this.id,false,false);" onblur="validate_payments_and_growth_form(true);" disabled>'+
    '<br>'+
    '<br>'+
    '<label class="label">Food Show Notes</label>'+
    '<textarea id="food-show-notes" name="food_show_notes" rows=2 cols=60 value="" onkeyup="remove_class(\'invalid-field\',this.id);" onblur="validate_payments_and_growth_form(true);" disabled></textarea>'+
    '</fieldset>'+

    '<fieldset class="fieldset-default">'+
    '<legend>Marketing and Growth Information</legend>'+
    '<span style="float: right;">'+
    '<label style="color:rgb(127,127,127); font-size:14px;">Last Updated:&nbsp;&nbsp;</label>'+
    '<input name="growth_last_modified" class="input-borderless"  disabled>'+
    '</span>'+
    '<label class="label">Volume %</label>'+
    '<input id="volume-percent" name="volume_percent" class="text-input" value="00.00" onkeyup="remove_class(\'invalid-field\',this.id); check_num_str(this.id,false,false);" onblur="validate_payments_and_growth_form(true);"> %'+
    '<br>'+
    '<label class="label">Purchases %</label>'+
    '<input id="purchase-percent" name="purchase_percent" class="text-input" value="00.00" onkeyup="remove_class(\'invalid-field\',this.id); check_num_str(this.id,false,false);" onblur="validate_payments_and_growth_form(true);"> %'+
    '<br>'+
    '<label class="label">Dollars per Unit<span style="float: right; text-align: right;">$&nbsp;</span></label>'+
    '<input id="dollars-per-unit" name="dollars_per_unit" class="text-input" value="  0.00" onkeyup="remove_class(\'invalid-field\',this.id); check_num_str(this.id,false,false);" onblur="validate_payments_and_growth_form(true);">'+
    '<br>'+
    '<br>'+
    '<label class="label">YTD Volume</label>'+
    '<input id="ytd-volume" name ="ytd_volume" class="text-input" onkeyup="remove_class(\'invalid-field\',this.id); check_num_str(this.id,false,false);" onblur="validate_payments_and_growth_form(true);">'+
    '<br>'+
    '<label class="label">YTD Purchases</label>'+
    '<input id="ytd-purchases" name ="ytd_purchases" class="text-input" onkeyup="remove_class(\'invalid-field\',this.id); check_num_str(this.id,false,false);" onblur="validate_payments_and_growth_form(true);">'+
    '<br>'+
    '<label class="label">YTD Units</label>'+
    '<input id="ytd-units" name ="ytd_units" class="text-input" onkeyup="remove_class(\'invalid-field\',this.id); check_int_str(this.id,false,false);" onblur="validate_payments_and_growth_form(true);">'+
    '<br>'+
    '<br>'+
    '<label class="label">Growth Notes</label>'+
    '<textarea id="growth-notes" name="growth_notes" rows=2 cols=60 value="" onkeyup="remove_class(\'invalid-field\',this.id);" onblur="validate_payments_and_growth_form(true);"></textarea>'+
    '</fieldset>'+

    '<fieldset class="fieldset-default">'+
    '<legend>Accounting Information</legend>'+
    '<span style="float: right;">'+
    '<label style="color:rgb(127,127,127); font-size:14px;">Last Updated:&nbsp;&nbsp;</label>'+
    '<input name="accounting_last_modified" class="input-borderless"  disabled>'+
    '</span>'+
    '<label class="label-12em">Marketing Commitment</label>'+
    '<input id="commitment" name="commitment" class="text-input" disabled>'+
    '<br>'+
    '<label class="label-12em">A La Carte Commitment</label>'+
    '<input id="amount-committed" name="amount_committed" class="text-input" disabled>'+
    '<br>'+
    '<label class="label-12em">Food Show Booth Price</label>'+
    '<input id="total-booth-price" class="text-input" value="0.00" readonly>'+
    '<br>'+
    '<label class="label-12em">Additional Fees</label>'+
    '<input id="additional-fees" name="additional_fees" class="text-input" onkeyup="remove_class(\'invalid-field\',this.id); check_num_str(this.id,false,false);" onblur="validate_payments_and_growth_form(true);">'+
    '<br>'+
    '<label class="label-12em">Misc. Charges</label>'+
    '<input id="misc-charges" name="misc_charges" class="text-input" onkeyup="remove_class(\'invalid-field\',this.id); check_num_str(this.id,false,false);" onblur="validate_payments_and_growth_form(true);">'+
    '<br>'+
    '<label class="label-12em">Credits</label>'+
    '<input id="credits" name="credits" class="text-input" onkeyup="remove_class(\'invalid-field\',this.id); check_num_str(this.id,false,false);" onblur="validate_payments_and_growth_form(true);">'+
    '<br>'+
    '<label class="label-12em">Accounting Notes</label>'+
    '<textarea id="misc-description" name="misc_description" rows=2 cols=60 value="" onkeyup="remove_class(\'invalid-field\',this.id);"></textarea>'+
    '<br>'+
    '<br>'+
    '<label class="label-12em">1<sup>st</sup> Quarter Payments</label>'+
    '<input id="Q1-payments" name="Q1_payments" class="text-input" onkeyup="remove_class(\'invalid-field\',this.id); check_num_str(this.id,false,false);" onblur="validate_payments_and_growth_form(true);">'+
    '<br>'+
    '<label class="label-12em">2<sup>nd</sup> Quarter Payments</label>'+
    '<input id="Q2-payments" name="Q2_payments" class="text-input" onkeyup="remove_class(\'invalid-field\',this.id); check_num_str(this.id,false,false);" onblur="validate_payments_and_growth_form(true);">'+
    '<br>'+
    '<label class="label-12em">3<sup>rd</sup> Quarter Payments</label>'+
    '<input id="Q3-payments" name="Q3_payments" class="text-input" onkeyup="remove_class(\'invalid-field\',this.id); check_num_str(this.id,false,false);" onblur="validate_payments_and_growth_form(true);">'+
    '<br>'+
    '<label class="label-12em">4<sup>th</sup> Quarter Payments</label>'+
    '<input id="Q4-payments" name="Q4_payments" class="text-input" onkeyup="remove_class(\'invalid-field\',this.id); check_num_str(this.id,false,false);" onblur="validate_payments_and_growth_form(true);">'+
    '<br>'+
    '<br>'+
    '<label class="label-12em">Food Show Amount Due</label>'+
    '<input id="food-show-due" class="text-input" value="0.00" onblur="validate_payments_and_growth_form(true);" readonly>'+
    '<br>'+
    '<label class="label-12em">Marketing Amount Due</label>'+
    '<input id="marketing-due" class="text-input" value="0.00" onblur="validate_payments_and_growth_form(true);" readonly>'+
    '<br>'+
    '<label class="label-12em">Growth Amount Due</label>'+
    '<input id="growth-due" class="text-input" value="0.00" onblur="validate_payments_and_growth_form(true);" readonly>'+
    '<br>'+
    '<br>'+
    '<label class="label-12em">Total Amount Due</label>'+
    '<input id="total-due" class="text-input" value="0.00" onblur="validate_payments_and_growth_form(true);" readonly>'+
    '</fieldset>'+

    '<input id="vendor-internal-id" name="vendor_internal_id" type="hidden" value="">'+
    '<label id="form-errors" class="error-msg hidden-elm">Form errors are highlighted in red</label><br>'+
    '<button id="submit-payments-and-growth-form" type="button" onclick="submit_payments_and_growth_form();">Submit Changes</button>'+
    '</form>';
//
// this function will return one of the above forms to a page
function create_marketing_form(form_name,out_id) {
    var forms = {};
    forms.setup_vendor_broker = setup_vendor_broker;
    forms.marketing_contact_info_form = marketing_contact_info_form;
    forms.marketing_food_show_form = marketing_food_show_form;
    forms.marketing_payments_and_growth_form = marketing_payments_and_growth_form;
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
///////////////////////////// Vendor Broker Setup Form /////////////////////////
//
//
function validate_setup_vendor_broker(truncate) {
    //
    var form_id = 'vendor-broker-setup-form';
    var skip_ids = 'growth-notes,food-show-notes,vendor-status,vendor-internal-id';
    var basic_val_error = false;
    var value_error = false;
    var float_input_ids = ['volume-percent','purchase-percent','dollars-per-unit',
                           'booth-price','electric-fee','total-booth-price','paid','total-due'];
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
    document.getElementById('total-booth-price').value = total_price;
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
        var args = {};
        var sql_arr = null;
        args.action = action;
        args.meta_array = response.meta_data;
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
    // action specific values
    args.init_sql_args = {};
    if (args.action == 'create') {
        args.init_sql_args.cmd = 'INSERT';
        args.form_values['vendor_internal_id'] = 'LAST_INSERT_ID()';
        args.include_tables = ['marketing_vendor_broker_table','marketing_accounting',
                          'marketing_food_show','marketing_growth',
                          'marketing_services_performed','marketing_alacarte_commitment'];
    }
    else {
        args.init_sql_args.cmd = 'UPDATE';
        args.init_sql_args.where = [['vendor_internal_id','LIKE',
                                      args.form_values['vendor_internal_id']]];
        delete args.form_values['vendor_internal_id'];
        args.include_tables = ['marketing_vendor_broker_table',
                          'marketing_food_show','marketing_growth'];
    }
    args.modified_by_value = document.getElementById('user-username').value;
    args.table_pattern = new RegExp(/(?:^|%)(marketing.+?)(?=%|$)/,'gi')
    //
    args.action_specific_changes = function(args,table_data) {
        if (args.action == 'create') {
            delete table_data[0]['cols']['vendor_internal_id']
        }
        return table_data;
    }
    var sql_arr = build_form_sql(args);
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
        document.getElementById('header').textContent = '';
    }
}
//
/////////////////////////// Vendor Broker Contact Form /////////////////////////
//
//
function validate_marketing_contact_info_form() {
    //
    var basic_val_error = false;
    var form_id = 'marketing-contact-info-form';
    var skip_ids = 'broker,vendor,contact-status,contact-internal-id';
    //
    basic_val_error = basic_validate(form_id,skip_ids);
    //
    if (document.getElementById('vendor-internal-id').value == '') {
        alert('Error - No Vendor/Broker linked to contact form reselect Vendor/Broker from table');
    }
}
//
//
function submit_marketing_contact_info_form(action) {
    //
    var form_id = 'marketing-contact-info-form';
    var errors = false;
    var form_values = null;
    var cont = false;
    var act = 'modification'
    var sql_args = null;
    var sql = '';
    var callback = null;
    //
    remove_class_all('invalid-field');
    validate_marketing_contact_info_form();
    errors = check_for_invalid_fields(form_id);
    //
    // returning early if there are errors
    if (errors) { remove_class('hidden-elm','form-errors'); return;}
    else { add_class('hidden-elm','form-errors');}
    //
    form_values = get_all_form_values(form_id,'');
    //
    if (action == 'create') { act = 'creation'; form_values['contact_status'] = 'active';}
    if (action == 'delete') { act = 'deletion'; form_values['contact_status'] = 'deleted';}
    if (action == 'restore') { act = 'restoration'; form_values['contact_status'] = 'active';}
    cont = confirm('Confirm '+act+' of '+form_values['contact_name']);
    if (!(cont)) { return;}
    //
    // using callback to assign tables to columns
    callback = function(response) {
        //
        var args = {};
        var sql_arr = null;
        args.action = action;
        args.meta_array = response.meta_data;
        args.form_values = form_values;
        sql_arr = create_marketing_contact_info_form_sql(args);
        //
        exec_transaction(sql_arr,reset_marketing_contact_info_form.bind(null,act));
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
// creates the SQL statements to submit the contact info form
function create_marketing_contact_info_form_sql(args) {
    //
    // action specific values
    args.init_sql_args = {};
    if (args.action == 'create') {
        args.init_sql_args.cmd = 'INSERT';
        args.form_values['contact_internal_id'] = 'LAST_INSERT_ID()';
    }
    else {
        args.init_sql_args.cmd = 'UPDATE';
        args.init_sql_args.where = [['contact_internal_id','LIKE',
                                      args.form_values['contact_internal_id']]];
        delete args.form_values['contact_internal_id'];
    }
    args.include_tables = ['marketing_contact_information','marketing_contact_aux_info'];
    args.modified_by_value = document.getElementById('user-username').value;
    args.table_pattern = new RegExp(/(?:^|%)(marketing_contact.+?)(?=%|$)/,'gi')
    //
    args.action_specific_changes = function(args,table_data) {
        if (args.action == 'create') {
            delete table_data[0]['cols']['contact_internal_id']
        }
        return table_data;
    }
    var sql_arr = build_form_sql(args);
    //
    return(sql_arr);
}
//
// resets the contact info from
function reset_marketing_contact_info_form(act) {
    //
    alert('Successful '+act+' of contact.');
    //
    var curr_page = document.getElementById('vbc-info-table-page-nav').dataset.currPage;
    var sort_col = document.getElementById('vbc-info-table-page-nav').dataset.sortCol;
    var sort_dir = document.getElementById('vbc-info-table-page-nav').dataset.sortDir;
    var broker = window.sessionStorage.getItem('contact_table_broker');
    var vendor_id = window.sessionStorage.getItem('contact_table_vendor_internal_id');
    create_contact_info_table(broker,vendor_id,curr_page,sort_col,sort_dir);
    //
    // recreating form
    if (act == 'creation') {
        create_contact_info_table('marketing_contact_info_form','content-div');
    }
    else {
        document.getElementById('content-div').removeAll();
        document.getElementById('header').textContent = '';
    }
}
//
//////////////////////// Marketing Food Show Validation ////////////////////////
//
//
function validate_marketing_food_show_form(truncate) {
    //
    var form_id = 'marketing-food-show-form';
    var form_values = null;
    var skip_ids = 'food-show-notes';
    var basic_val_error = false;
    var value_error = false;
    var float_input_ids = ['booth-price','electric-fee','total-booth-price','paid','total-due'];
    var precision = 8;
    if (truncate) {
        precision = CONSTANTS.STD_PRECISION;
    }
    //
    basic_val_error = basic_validate(form_id,skip_ids);
    //
    form_values = get_all_form_values(form_id,'');
    var booth_price = Number.parse(form_values['booth_price']);
    var electric_fee = Number.parse(form_values['electric_fee']);
    var amount_paid = Number.parse(form_values['paid']);
    var total_price = booth_price + electric_fee;
    var remaining = total_price - amount_paid;
    document.getElementById('total-booth-price').value = total_price;
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
function submit_marketing_food_show_form() {
    //
    var form_id = 'marketing-food-show-form';
    var errors = false;
    var form_values = null;
    var cont = false;
    var sql_args = null;
    var sql = '';
    var callback = null;
    //
    remove_class_all('invalid-field');
    validate_marketing_food_show_form(false);
    errors = check_for_invalid_fields(form_id);
    //
    // returning early if there are errors
    if (errors) { remove_class('hidden-elm','form-errors'); return;}
    else { add_class('hidden-elm','form-errors');}
    //
    form_values = get_all_form_values(form_id,'');
    //
    cont = confirm('Confirm update of food show information.');
    if (!(cont)) { validate_marketing_food_show_form(true); return;}
    //
    // using callback to assign tables to columns
    callback = function(response) {
        //
        var args = {};
        var sql_arr = null;
        args.action = 'modify';
        args.meta_array = response.meta_data;
        args.form_values = form_values;
        sql_arr = create_food_show_form_sql(args);
        //
        exec_transaction(sql_arr,reset_food_show_form);
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
//
function create_food_show_form_sql(args) {
    //
    // action specific values
    args.init_sql_args = {};
    args.init_sql_args.cmd = 'UPDATE';
    args.init_sql_args.where = [['vendor_internal_id','LIKE',
                                  args.form_values['vendor_internal_id']]];
    delete args.form_values['vendor_internal_id'];
    //
    args.include_tables = ['marketing_food_show'];
    args.modified_by_value = document.getElementById('user-username').value;
    args.table_pattern = new RegExp(/(?:^|%)(marketing_food_show)(?=%|$)/,'gi')
    //
    var sql_arr = build_form_sql(args);
    //
    return(sql_arr);
}
//
//
function reset_food_show_form() {
    //
    alert('Successful update of food show information.');
    //
    var curr_page = document.getElementById('food-show-table-page-nav').dataset.currPage;
    var sort_col = document.getElementById('food-show-table-page-nav').dataset.sortCol;
    var sort_dir = document.getElementById('food-show-table-page-nav').dataset.sortDir;
    create_food_show_table(curr_page,sort_col,sort_dir);
    //
    // recreating form
    document.getElementById('content-div').removeAll();
    document.getElementById('header').textContent = '';
}
//
////////////////////// Payments and Growth Validation //////////////////////////
function toggle_food_show_fields() {
    var ids=['booth-size','booth-price','electric-fee','paid','food-show-notes'];
    for (var i=0; i < ids.length; i++) {
        toggle_disabled(ids[i]);
    }
}
//
//
function validate_payments_and_growth_form(truncate) {
    //
    var form_id = 'marketing-payments-and-growth-form';
    var skip_ids = 'growth-notes,food-show-notes,misc-description';
    var basic_val_error = false;
    var value_error = false;
    var float_input_ids = ['volume-percent','purchase-percent','dollars-per-unit',
                           'ytd-volume','ytd-purchases','booth-price',
                           'electric-fee','paid','total-booth-price','commitment',
                           'amount-committed','additional-fees','misc-charges',
                           'credits','Q1-payments','Q2-payments','Q3-payments',
                           'Q4-payments','food-show-due','marketing-due','growth-due',
                           'total-due'];
    var precision = 8;
    if (truncate) {
        precision = CONSTANTS.STD_PRECISION;
    }
    //
    basic_val_error = basic_validate(form_id,skip_ids);
    //
    // getting form values and converting numbers
    var form_values = get_all_form_values(form_id,'',true);
    for (var name in form_values) {
        if (form_values[name].match(/^-?\d+$|^-?\d+\.\d+$/)) {
            form_values[name] = Number.parse(form_values[name]);
        }
    }
    form_values['volume_percent'] = form_values['volume_percent']/100.0;
    form_values['purchase_percent'] = form_values['purchase_percent']/100.0;
    //
    // calculating values
    var total_booth_price = form_values['booth_price'] + form_values['electric_fee'];
    var food_show_due = total_booth_price - form_values['paid'];
    var marketing_due = form_values['commitment'] + form_values['amount_committed'];
    marketing_due += form_values['additional_fees'] + form_values['misc_charges'] - form_values['credits'];
    var growth_due = form_values['volume_percent']*form_values['ytd_volume'];
    growth_due += form_values['purchase_percent']*form_values['ytd_purchases'];
    growth_due += form_values['dollars_per_unit']*form_values['ytd_units'];
    var total_due = food_show_due + marketing_due + growth_due;
    total_due += -form_values['Q1_payments'] - form_values['Q2_payments'];
    total_due += -form_values['Q3_payments'] - form_values['Q4_payments'];
    //
    document.getElementById('total-booth-price').value = total_booth_price;
    document.getElementById('food-show-due').value = food_show_due;
    document.getElementById('marketing-due').value = marketing_due;
    document.getElementById('growth-due').value = growth_due;
    document.getElementById('total-due').value = total_due;
    //
    // rounding values to precision
    var value = 0.0;
    var input = null;
    for (var i = 0; i < float_input_ids.length; i++) {
        input = document.getElementById(float_input_ids[i]);
        value_error = check_data_type(float_input_ids[i],'float',true);
        if (input.value === '') { continue;}
        value = Number.parse(input.value);
        input.value = round(value,precision).toFixed(precision);
    }
}
//
//
function submit_payments_and_growth_form() {
    //
    var form_id = 'marketing-payments-and-growth-form';
    var errors = false;
    var form_values = null;
    var cont = false;
    var sql_args = null;
    var sql = '';
    var callback = null;
    //
    remove_class_all('invalid-field');
    validate_payments_and_growth_form(false);
    errors = check_for_invalid_fields(form_id);
    //
    // returning early if there are errors
    if (errors) { remove_class('hidden-elm','form-errors'); return;}
    else { add_class('hidden-elm','form-errors');}
    //
    form_values = get_all_form_values(form_id,'');
    //
    cont = confirm('Confirm update of payments and growth information.');
    if (!(cont)) { validate_payments_and_growth_form(true); return;}
    //
    // using callback to assign tables to columns
    callback = function(response) {
        //
        var args = {};
        var sql_arr = null;
        args.action = 'modify';
        args.meta_array = response.meta_data;
        args.form_values = form_values;
        sql_arr = create_payments_and_growth_form_sql(args);
        //
        exec_transaction(sql_arr,reset_payments_and_growth_form);
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
//
function create_payments_and_growth_form_sql(args) {
    //
    // action specific values
    args.init_sql_args = {};
    args.init_sql_args.cmd = 'UPDATE';
    args.init_sql_args.where = [['vendor_internal_id','LIKE',
                                  args.form_values['vendor_internal_id']]];
    delete args.form_values['vendor_internal_id'];
    //
    if (document.getElementById('update-food-show-info').checked) {
        args.include_tables = ['marketing_accounting','marketing_food_show','marketing_growth'];
    }
    else {
        args.include_tables = ['marketing_accounting','marketing_growth'];
    }
    args.modified_by_value = document.getElementById('user-username').value;
    args.table_pattern = new RegExp(/(?:^|%)(marketing.+?)(?=%|$)/,'gi')
    //
    var sql_arr = build_form_sql(args);
    //
    return(sql_arr);
}
//
//
function reset_payments_and_growth_form() {
    //
    alert('Successful update of Vendor/ Broker payment and growth information.');
    //
    var curr_page = document.getElementById('pag-table-page-nav').dataset.currPage;
    var sort_col = document.getElementById('pag-table-page-nav').dataset.sortCol;
    var sort_dir = document.getElementById('pag-table-page-nav').dataset.sortDir;
    create_payments_and_growth_table(curr_page,sort_col,sort_dir);
    //
    document.getElementById('content-div').removeAll();
    document.getElementById('header').textContent = '';
}