////////////////////////////////////////////////////////////////////////////////
//////////////       This file holds the functions that are          ///////////
//////////////       associated only with the marketing page         ///////////
////////////////////////////////////////////////////////////////////////////////
"use strict";
//
/////////////////////// Marketing Primary Functions ////////////////////////////
//
// sets the page for creation or modification of a vendor
function vendor_broker_setup() {
    //
    document.getElementById('tab-clicked').value = 'vendor_broker_setup';
    //
    // clearing elements inside main-container div
    var childNodes = document.getElementById('main-container').childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].nodeType == 1) {childNodes[i].removeAll();}
    }
    //
    create_vendor_broker_table_filter('input-div');
    //
    create_vendor_broker_table(1,'broker','ASC');
}
//
// sets the page for creation or modifcation of contact information
function vendor_broker_contact_info() {
    //
    document.getElementById('tab-clicked').value = 'vendor_broker_contact_info';
    //
    // clearing elements inside main-container div
    var childNodes = document.getElementById('main-container').childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].nodeType == 1) {childNodes[i].removeAll();}
    }
    //
    create_vendor_broker_table_filter('input-div');
    //
    create_vendor_broker_table(1,'broker','ASC');
}
//
// sets the page for the modification of a vendors food show info
function update_food_show_info() {
    //
    document.getElementById('tab-clicked').value = 'update_food_show_info';
    //
    // clearing elements inside main-container div
    var childNodes = document.getElementById('main-container').childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].nodeType == 1) {childNodes[i].removeAll();}
    }
    //
    create_food_show_table_filter('input-div');
    //
    create_food_show_table(1,'broker','ASC');
}
//
// sets the page for updatin marketing informat
function update_marketing_commitment() {
    //
    //
    document.getElementById('tab-clicked').value = 'update_food_show_info';
    //
    // clearing elements inside main-container div
    var childNodes = document.getElementById('main-container').childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].nodeType == 1) {childNodes[i].removeAll();}
    }
    //
    create_marketing_commitment_table_filter('input-div');
    //
    create_marketing_commitment_table(1,'broker','ASC');
}
//
// sets the page for updating services performed
function update_marketing_services_performed() {
    //
    document.getElementById('tab-clicked').value = 'update_marketing_services_performed';
    //
    // clearing elements inside main-container div
    var childNodes = document.getElementById('main-container').childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].nodeType == 1) {childNodes[i].removeAll();}
    }
    //
    alert('Not Implemented Yet');
}
//
// sets the page for updating a vendors payment info
function update_payments_and_growth() {
    //
    document.getElementById('tab-clicked').value = 'update_payments_and_growth';
    //
    // clearing elements inside main-container div
    var childNodes = document.getElementById('main-container').childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].nodeType == 1) {childNodes[i].removeAll();}
    }
    //
    create_payments_and_growth_table_filter('input-div');
    //
    create_payments_and_growth_table(1,'broker','ASC');
}
//
// sets the page for updatin marketing informat
function create_dashboard() {
    //
    //
    document.getElementById('tab-clicked').value = 'update_food_show_info';
    //
    // clearing elements inside main-container div
    var childNodes = document.getElementById('main-container').childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        if (childNodes[i].nodeType == 1) {childNodes[i].removeAll();}
    }
    //
    alert('Not Implemented');
}
//
////////////////////// Marketing Secondary Functions ///////////////////////////
//
// handles vendor broker setup form generation
function vendor_broker_setup_form(vendor_internal_id,row_id) {
    //
    // setting page if it is a modification
    var header = document.getElementById('header');
    var callback = null;
    if (vendor_internal_id && row_id) {
        var broker = document.getElementById(row_id+'-broker').innerHTML;
        if (broker == '') { broker = '(None)';}
        var vendor = document.getElementById(row_id+'-vendor').innerHTML;
        if (vendor == '') { vendor = '(None)';}
        header.textContent = 'Modifying  Broker: '+broker+' - Vendor: '+vendor;
        //
        var button_fun = function() {
            var status = document.getElementById('vendor-status').value;
            //
            if (status == 'active') {
                add_class('hidden-elm','res-button')
            }
            else {
                add_class('hidden-elm','del-button')
            }
        }
        //
        callback = function() {
            // creating inital buttons
            var parent_form = document.getElementById('submit-vendor-broker-form').parentNode;
            var mod_button = document.createElementWithAttr('BUTTON',
                                                           {'id':'submit-vendor-broker-form',
                                                            'type':'button'});
            mod_button.addTextNode('Modify Vendor/Broker');
            mod_button.addEventListener('click',submit_vendor_broker_form.bind(null,'update'));
            var del_button = document.createElementWithAttr('BUTTON',{'id':'del-button',
                                                                     'type':'button'});
            del_button.addTextNode('Delete Vendor/Broker');
            del_button.addEventListener('click',submit_vendor_broker_form.bind(null,'delete'));
            var res_button = document.createElementWithAttr('BUTTON',{'id':'res-button',
                                                                      'type':'button'});
            res_button.addTextNode('Restore Vendor/Broker');
            res_button.addEventListener('click',submit_vendor_broker_form.bind(null,'restore'));
            var spacer1 = document.createElementWithAttr('SPAN',{'id':'spacer1'});
            spacer1.addTextNode('\u00A0\u00A0');
            var spacer2 = document.createElementWithAttr('SPAN',{'id':'spacer2'});
            spacer2.addTextNode('\u00A0\u00A0');
            parent_form.addNodes([mod_button,spacer1,del_button,spacer2,res_button])
            //
            //
            var populate_form_args = {};
            populate_form_args.sql_args = {
                'cmd' : 'SELECT',
                'table' : 'marketing_vendor_broker_table',
                'inner_join' : [['marketing_food_show',
                             'marketing_vendor_broker_table.vendor_internal_id',
                             'marketing_food_show.vendor_internal_id'],
                            ['marketing_growth',
                             'marketing_vendor_broker_table.vendor_internal_id',
                             'marketing_growth.vendor_internal_id']],
                'where' : [['marketing_vendor_broker_table.vendor_internal_id',
                            'LIKE',vendor_internal_id]]
            }
            populate_form_args.form_id = 'vendor-broker-setup-form';
            populate_form_args.trigger_events = true;
            populate_form_args.add_callback = function() {
                button_fun();
                var broker_input = document.getElementById('broker');
                var vendor_input = document.getElementById('vendor');
                var vendor_num_input = document.getElementById('vendor-number');
                var event = document.createEvent("HTMLEvents");
                event.initEvent("click",true,false);
                if (broker_input.value === '') {
                    remove_class('invalid-field',broker_input.id);
                    document.getElementById('skip-'+broker_input.id).checked = true;
                    document.getElementById('skip-'+broker_input.id).dispatchEvent(event);
                }
                if (vendor_input.value === '') {
                    remove_class('invalid-field',vendor_input.id);
                    document.getElementById('skip-'+vendor_input.id).checked = true;
                    document.getElementById('skip-'+vendor_input.id).dispatchEvent(event);
                }
                if (vendor_num_input.value === '') {
                    remove_class('invalid-field',vendor_num_input.id);
                    document.getElementById('skip-'+vendor_num_input.id).checked = true;
                    document.getElementById('skip-'+vendor_num_input.id).dispatchEvent(event);
                }
            }
            populate_form(populate_form_args);
        }
    }
    else {
        header.textContent = 'Creating New Vendor/Broker';
    }
    //
    //
    var dropbox_args = {
        'dropbox_id' : 'marketing-level',
        'text_format' : '%marketing_level%',
        'value_format' : '%marketing_level%',
        'place_holder' : 'Select Level',
        'place_holder_status' : 'disabled',
        'sql_args' : {
            'table' : 'marketing_tiers',
            'cols' : ['marketing_level'],
            'order_by':[['marketing_level','ASC']]
        },
        'add_callback' : callback
    };
    create_marketing_form('setup_vendor_broker','content-div');
    populate_dropbox_options(dropbox_args);
}
//
// handles initial generation of the contact info form
function create_contact_info_form(contact_internal_id,vendor_internal_id,row_id) {
    //
    var header = document.getElementById('header');
    var callback = null;
    //
    create_marketing_form('marketing_contact_info_form','content-div');
    //
    // setting page if it is a modification
    if (contact_internal_id && row_id) {
        var name = document.getElementById(row_id+'-contact_name').innerHTML;
        if (name == '') { name = '(None)';}
        header.textContent = 'Updating '+trim(name)+'\'s Information';
        //
        var button_fun = function() {
            var status = document.getElementById('contact-status').value;
            //
            if (status == 'active') {
                add_class('hidden-elm','res-button')
            }
            else {
                add_class('hidden-elm','del-button')
            }
            //
            document.getElementById('broker').name = '';
            document.getElementById('vendor').name = '';
        }
        //
        var parent_form = document.getElementById('submit-contact-info-form').parentNode;
        var mod_button = document.createElementWithAttr('BUTTON',
                                                       {'id':'submit-contact-info-form',
                                                        'type':'button'});
        mod_button.addTextNode('Modify Contact');
        mod_button.addEventListener('click',submit_marketing_contact_info_form.bind(null,'update'));
        var del_button = document.createElementWithAttr('BUTTON',{'id':'del-button',
                                                                 'type':'button'});
        del_button.addTextNode('Delete Contact');
        del_button.addEventListener('click',submit_marketing_contact_info_form.bind(null,'delete'));
        var res_button = document.createElementWithAttr('BUTTON',{'id':'res-button',
                                                                  'type':'button'});
        res_button.addTextNode('Restore Contact');
        res_button.addEventListener('click',submit_marketing_contact_info_form.bind(null,'restore'));
        var spacer1 = document.createElementWithAttr('SPAN',{'id':'spacer1'});
        spacer1.addTextNode('\u00A0\u00A0');
        var spacer2 = document.createElementWithAttr('SPAN',{'id':'spacer2'});
        spacer2.addTextNode('\u00A0\u00A0');
        parent_form.addNodes([mod_button,spacer1,del_button,spacer2,res_button])
        //
        //
        var populate_form_args = {};
        populate_form_args.sql_args = {
            'cmd' : 'SELECT',
            'table' : 'marketing_vendor_broker_table',
            'inner_join' : [['marketing_contact_information',
                         'marketing_vendor_broker_table.vendor_internal_id',
                         'marketing_contact_information.vendor_internal_id'],
                        ['marketing_contact_aux_info',
                         'marketing_contact_information.contact_internal_id',
                         'marketing_contact_aux_info.contact_internal_id']],
            'where' : [['marketing_contact_information.contact_internal_id',
                        'LIKE',contact_internal_id]]
        }
        populate_form_args.form_id = 'marketing-contact-info-form';
        populate_form_args.trigger_events = true;
        populate_form_args.add_callback = button_fun;
        populate_form(populate_form_args);
    }
    else {
        header.textContent = 'Creating New Contact';
        var populate_form_args = {};
        populate_form_args.sql_args = {
            'cmd' : 'SELECT',
            'table' : 'marketing_vendor_broker_table',
            'where' : [['marketing_vendor_broker_table.vendor_internal_id',
                        'LIKE',vendor_internal_id]]
        }
        populate_form_args.form_id = 'marketing-contact-info-form';
        populate_form_args.trigger_events = true;
        populate_form_args.add_callback = function() {
            document.getElementById('broker').name = '';
            document.getElementById('vendor').name = '';
            validate_marketing_contact_info_form()
        }
        populate_form(populate_form_args);
    }
}
//
//
function create_food_show_form(vendor_internal_id,row_id) {
    //
    var header = document.getElementById('header');
    var callback = null;
    var form_id = 'marketing-food-show-form';
    //
    create_marketing_form('marketing_food_show_form','content-div');
    //
    if (!(vendor_internal_id && row_id)) {
        alert('There was an error, reselect the Vendor/Broker');
        return;
    }
    //
    // setting page if it is a modification
    var broker = document.getElementById(row_id+'-broker').innerHTML;
    if (broker == '') { broker = '(None)';}
    var vendor = document.getElementById(row_id+'-vendor').innerHTML;
    if (vendor == '') { vendor = '(None)';}
    header.textContent = 'Updating  Broker: '+broker+' - Vendor: '+vendor+' Food Show Information';
    //
    //
    var populate_form_args = {};
    populate_form_args.sql_args = {
        'cmd' : 'SELECT',
        'table' : 'marketing_vendor_broker_table',
        'inner_join' : [['marketing_food_show',
                     'marketing_vendor_broker_table.vendor_internal_id',
                     'marketing_food_show.vendor_internal_id'],
                    ['marketing_tiers',
                     'marketing_vendor_broker_table.marketing_level',
                     'marketing_tiers.marketing_level']],
        'where' : [['marketing_vendor_broker_table.vendor_internal_id',
                    'LIKE',vendor_internal_id]]
    }
    populate_form_args.form_id = form_id;
    populate_form_args.trigger_events = true;
    populate_form_args.add_callback = function() {
        var size = Number.parse(document.getElementById('booth-size').value);
        var price = Number.parse(document.getElementById('booth-price').value);
        var fee = Number.parse(document.getElementById('food-show-booth-fee').value);
        fee = (size*fee).toFixed(CONSTANTS.STD_PRECISION);
        if (price == 0.0) {
            document.getElementById('booth-price').value = fee;
        }
        document.getElementById('broker').name = '';
        document.getElementById('vendor').name = '';
        document.getElementById('marketing-level').name = '';
        validate_marketing_food_show_form(true);
    }
    populate_form(populate_form_args);
}
//
//
function create_payments_and_growth_form(vendor_internal_id,row_id) {
    //
    var header = document.getElementById('header');
    var callback = null;
    var form_id = 'marketing-payments-and-growth-form';
    //
    create_marketing_form('marketing_payments_and_growth_form','content-div');
    //
    if (!(vendor_internal_id && row_id)) {
        alert('There was an error, reselect the Vendor/Broker');
        return;
    }
    //
    // setting page if it is a modification
    var broker = document.getElementById(row_id+'-broker').innerHTML;
    if (broker == '') { broker = '(None)';}
    var vendor = document.getElementById(row_id+'-vendor').innerHTML;
    if (vendor == '') { vendor = '(None)';}
    header.textContent = 'Updating  Broker: '+broker+' - Vendor: '+vendor+', Payments and Growth Information';
    //
    var populate_form_args = {};
    populate_form_args.sql_args = {
        'cmd' : 'SELECT',
        'table' : 'marketing_vendor_broker_table',
        'inner_join' : [['marketing_accounting',
                                 'marketing_vendor_broker_table.vendor_internal_id',
                                 'marketing_accounting.vendor_internal_id'],
                                ['marketing_alacarte_commitment',
                                 'marketing_vendor_broker_table.vendor_internal_id',
                                 'marketing_alacarte_commitment.vendor_internal_id'],
                                ['marketing_growth',
                                 'marketing_vendor_broker_table.vendor_internal_id',
                                 'marketing_growth.vendor_internal_id'],
                                ['marketing_food_show',
                                 'marketing_vendor_broker_table.vendor_internal_id',
                                 'marketing_food_show.vendor_internal_id'],
                                ['marketing_tiers',
                                 'marketing_vendor_broker_table.marketing_level',
                                 'marketing_tiers.marketing_level']],
        'where' : [['marketing_vendor_broker_table.vendor_internal_id',
                    'LIKE',vendor_internal_id]]
    }
    populate_form_args.form_id = form_id;
    populate_form_args.trigger_events = true;
    populate_form_args.add_callback = function() {
        document.getElementById('broker').name = '';
        document.getElementById('vendor').name = '';
        document.getElementById('marketing-level').name = '';
        validate_payments_and_growth_form(true);
    }
    populate_form(populate_form_args);
}
//
//
function create_marketing_commitment_form(vendor_internal_id,row_id) {
    //
    var form_id = 'marketing-commitment-form';
    var header = document.getElementById('header');
    var callback = null;
    var sql_args = null;
    //
    if (!(vendor_internal_id && row_id)) {
        alert('There was an error, reselect the Vendor/Broker');
        return;
    }
    //
    var broker = document.getElementById(row_id+'-broker').innerHTML;
    if (broker == '') { broker = '(None)';}
    var vendor = document.getElementById(row_id+'-vendor').innerHTML;
    if (vendor == '') { vendor = '(None)';}
    header.textContent = 'Updating  Broker: '+broker+' - Vendor: '+vendor+', Marketing Commitment Information';
    //
    // creating sql statments
    var price_data_sql = '';
    var populate_form_sql = '';
    var populate_dropbox_sql = '';
    var meta_data_sql = '';
    sql_args = {
        'cmd' : 'SELECT',
        'table' : 'marketing_alacarte_prices',
        'cols' : ['service','cost']
    }
    price_data_sql = gen_sql(sql_args);
    //
    sql_args = {
        'cmd' : 'SELECT',
        'table' : 'marketing_vendor_broker_table',
        'inner_join' : [['marketing_accounting',
                         'marketing_vendor_broker_table.vendor_internal_id',
                         'marketing_accounting.vendor_internal_id'],
                        ['marketing_alacarte_commitment',
                         'marketing_vendor_broker_table.vendor_internal_id',
                         'marketing_alacarte_commitment.vendor_internal_id']],
        'where' : [['marketing_vendor_broker_table.vendor_internal_id',
                    'LIKE',vendor_internal_id]]
    }
    populate_form_sql = gen_sql(sql_args);
    //
    sql_args = {
        'cmd' : 'SELECT',
        'table' : 'marketing_tiers',
        'cols' : ['marketing_level'],
        'order_by':[['marketing_level','ASC']]
    }
    populate_dropbox_sql = gen_sql(sql_args);
    //
    sql_args = {
        'cmd' : 'SELECT',
        'table' : 'table_meta_data',
        'where' : [['in_tables','REGEXP','(^|%)marketing_alacarte_commitment(%|$)'],
                    ['data_type','NOT REGEXP','internal']],
        'order_by':[['order_index','ASC']]
    }
    meta_data_sql = gen_sql(sql_args);
    //
    // setting callback to emulate args passed to populate_dropbox_options and populate_form
    callback = function(response) {
        var args = {
            'meta_data_arr' : response.meta_data_arr,
            'populate_form_args' : {
                'form_id' : form_id,
                'trigger_events' : false,
                'skip_fields_str' : '',
                'data_arr' : response.form_data[0]
             },
            'dropbox_args' : {
                'dropbox_id' : 'marketing-level',
                'text_format' : '%marketing_level%',
                'value_format' : '%marketing_level%',
                'place_holder' : 'Select Level',
                'place_holder_status' : 'disabled',
                'add_opts_val' : [],
                'add_opts_text' : [],
                'add_callback' : function(args) {},
                'dropbox_data' : response.dropbox_data
             }
        }
        //
        args.meta_data_obj = {};
        for (var i = 0; i < args.meta_data_arr.length; i++) {
            args.meta_data_obj[args.meta_data_arr[i]['column_name']] = args.meta_data_arr[i];
        }
        for (var i = 0; i < response.price_data.length; i++) {
            args.meta_data_obj[response.price_data[i]['service']]['cost'] = response.price_data[i]['cost'];
        }
        //
        create_alacarte_fields(args)
    };
    //
    create_marketing_form('marketing_commitment_form','content-div');
    ajax_fetch([price_data_sql,populate_form_sql,populate_dropbox_sql,meta_data_sql],
               ['price_data','form_data','dropbox_data','meta_data_arr'],callback);
}
//
////////////////////////////////////////////////////////////////////////////////
//////////////////////// Marketing Table Generation ////////////////////////////
//
//
//////////////////////////////// Table Filters /////////////////////////////////
//
// container for common vendor/broker table filtering elements
function standard_vb_filter_elemets(update_function) {
    //
    var status_onlick = toggle_checkbox_value.bind(null,'filter-vendor-status','.','active');
    var form_elements = Array(
            {'elm' : 'legend','textNode' : 'Selection Parameters'},
            //
            {'elm' : 'label', 'className' : 'label-large',
             'textNode' : 'Show Deleted Brokers/Vendors:'},
            {'elm' : 'input', 'id' : 'filter-vendor-status', 'name':'vendor_status',
             'type' : 'checkbox', 'value' : 'active', 'events' : [
                 {'event' : 'click','function' : status_onlick},
                 {'event' : 'click','function' : update_function}]},
            {'elm' : 'br'},
            //
            {'elm' : 'label', 'className' : 'label-large',
             'textNode' : 'Filter by Broker:'},
            {'elm' : 'input', 'id' : 'filter-broker', 'name':'broker',
             'type' : 'text', 'value' : '', 'events' : [
                 {'event' : 'keyup','function' : update_function}]},
            {'elm' : 'br'},
            //
            {'elm' : 'label', 'className' : 'label-large',
             'textNode' : 'Filter by Vendor:'},
            {'elm' : 'input', 'id' : 'filter-vendor', 'name':'vendor',
             'type' : 'text', 'value' : '', 'events' : [
                 {'event' : 'keyup','function' : update_function}]},
            {'elm' : 'br'}
        );
    return(form_elements);
}
//
// creates filtering options for the vendor_broker tabke
function create_vendor_broker_table_filter(output_id) {
    //
    // adding a filter fieldset
    var fieldset = document.createElement('FIELDSET');
    var onclick = create_vendor_broker_table.bind(null,1,'broker','ASC');
    var form_elements = standard_vb_filter_elemets(onclick);
    //
    fieldset.id = 'selection-parameters';
    fieldset.className = 'fieldset-default';
    addChildren(fieldset,form_elements);
    document.getElementById(output_id).appendChild(fieldset);
    document.getElementById(output_id).appendChild(document.createElement('BR'));
}
//
//
function create_food_show_table_filter(output_id) {
    //
    // adding a filter fieldset
    var fieldset = document.createElement('FIELDSET');
    var update_function = create_food_show_table.bind(null,1,'broker','ASC');
    var form_elements = standard_vb_filter_elemets(update_function);
    //
    form_elements.push(
            //
            {'elm' : 'label', 'className' : 'label-large',
             'textNode' : 'Filter by Booth Size:'},
            {'elm' : 'select', 'id' : 'filter-booth-size', 'name':'booth_size',
              'events' : [{'event' : 'change','function' : update_function}]},
            {'elm' : 'br'}
        );
    var select_elements = Array(
        //
        {'elm':'option','value' : '.', 'textNode' : 'All'},
        {'elm':'option','value' : '0', 'textNode' : 'None'},
        {'elm':'option','value' : '0.5', 'textNode' : 'Half'},
        {'elm':'option','value' : '1.0', 'textNode' : 'Full'}
        );
    //
    fieldset.id = 'selection-parameters';
    fieldset.className = 'fieldset-default';
    addChildren(fieldset,form_elements);
    document.getElementById(output_id).appendChild(fieldset);
    addChildren(document.getElementById('filter-booth-size'),select_elements);
    document.getElementById(output_id).appendChild(document.createElement('BR'));
}
//
//
function create_payments_and_growth_table_filter(output_id) {
    //
    // adding a filter fieldset
    var fieldset = document.createElement('FIELDSET');
    var update_function = create_payments_and_growth_table.bind(null,1,'broker','ASC');
    var form_elements = standard_vb_filter_elemets(update_function);
    //
    form_elements.push(
            //
            {'elm' : 'label', 'className' : 'label-large',
             'textNode' : 'Filter by Marketing Level:'},
            {'elm' : 'select', 'id' : 'filter-marketing-level', 'name':'marketing_level',
              'className' : 'dropbox-input',
              'events' : [{'event' : 'change','function' : update_function}]},
            {'elm' : 'br'},
            //
            {'elm' : 'label', 'className' : 'label-large',
             'textNode' : 'Filter by Booth Size:'},
            {'elm' : 'select', 'id' : 'filter-booth-size', 'name':'booth_size',
              'className' : 'dropbox-input',
              'events' : [{'event' : 'change','function' : update_function}]},
            {'elm' : 'br'}
            //
        );
    var booth_elements = Array(
        //
        {'elm':'option','value' : '.', 'textNode' : 'All'},
        {'elm':'option','value' : '0', 'textNode' : 'None'},
        {'elm':'option','value' : '0.5', 'textNode' : 'Half'},
        {'elm':'option','value' : '1.0', 'textNode' : 'Full'}
        );
    var level_elements = Array(
        //
        {'elm':'option','value' : '.', 'textNode' : 'All'},
        {'elm':'option','value' : 'a la carte', 'textNode' : 'A La Carte'},
        {'elm':'option','value' : 'bronze', 'textNode' : 'Bronze'},
        {'elm':'option','value' : 'silver', 'textNode' : 'Silver'},
        {'elm':'option','value' : 'gold', 'textNode' : 'Gold'}
        );
    //
    fieldset.id = 'selection-parameters';
    fieldset.className = 'fieldset-default';
    addChildren(fieldset,form_elements);
    document.getElementById(output_id).appendChild(fieldset);
    addChildren(document.getElementById('filter-marketing-level'),level_elements);
    addChildren(document.getElementById('filter-booth-size'),booth_elements);
    document.getElementById(output_id).appendChild(document.createElement('BR'));
}
//
//
function create_marketing_commitment_table_filter(output_id) {
    //
    // adding a filter fieldset
    var fieldset = document.createElement('FIELDSET');
    var update_function = create_marketing_commitment_table.bind(null,1,'broker','ASC');
    var form_elements = standard_vb_filter_elemets(update_function);
    //
    //
    form_elements.push(
        //
        {'elm' : 'label', 'className' : 'label-large',
         'textNode' : 'Filter by Marketing Level:'},
        {'elm' : 'select', 'id' : 'filter-marketing-level', 'name':'marketing_level',
         'className' : 'dropbox-input','events' :
             [{'event' : 'change','function' : update_function}]},
        {'elm' : 'br'}
    );
    var level_elements = Array(
        //
        {'elm':'option','value' : '.', 'textNode' : 'All'},
        {'elm':'option','value' : 'a la carte', 'textNode' : 'A La Carte'},
        {'elm':'option','value' : 'bronze', 'textNode' : 'Bronze'},
        {'elm':'option','value' : 'silver', 'textNode' : 'Silver'},
        {'elm':'option','value' : 'gold', 'textNode' : 'Gold'}
    );
    //
    fieldset.id = 'selection-parameters';
    fieldset.className = 'fieldset-default';
    addChildren(fieldset,form_elements);
    document.getElementById(output_id).appendChild(fieldset);
    addChildren(document.getElementById('filter-marketing-level'),level_elements);
    document.getElementById(output_id).appendChild(document.createElement('BR'));
}
//
// creates the filtering fieldset for the contact_info table
function create_contact_info_table_filter(broker,vendor_internal_id,output_id) {
    //
    // adding a filter fieldset
    var fieldset = document.createElement('FIELDSET');
    var form_elements = Array(
            {'elm' : 'legend','textNode' : 'Contact Selection Parameters'},
            //
            {'elm' : 'label', 'className' : 'label-large',
             'textNode' : 'Show Deleted Contacts:'},
            {'elm' : 'input', 'id' : 'contact-show-deleted', 'type' : 'checkbox',
             'events' : [{'event' : 'click',
                          'function' : create_contact_info_table.bind(null,broker,vendor_internal_id,1,'broker','ASC')}]},
            {'elm' : 'br'}
            //
            // filtering stuff like in sales customer table
            //
        );
    fieldset.id = 'contact-selection-parameters';
    fieldset.className = 'fieldset-default';
    addChildren(fieldset,form_elements);
    document.getElementById(output_id).safeAppendChild(fieldset);
}
//
///////////////////// Table callback and event functions ///////////////////////
//
//
// defines tab specific vendor/ broker table callbacks
function vendor_broker_table_callbacks() {
    //
    var tab = document.getElementById('tab-clicked').value;
    //
    if (tab == 'vendor_broker_setup') {
        var br = document.createElementWithAttr('BR',{'id':'create-new-vendor-br'});
        var button = document.createElementWithAttr('BUTTON',{'id':'create-new-vendor'});
        button.addTextNode('Create New Vendor/Broker');
        button.style['margin'] = 'auto';
        button.style['display'] = 'block';
        button.addEventListener('click',vendor_broker_setup_form.bind(null,null,null));
        document.getElementById('table-div').safeAppendChild(br);
        document.getElementById('table-div').safeAppendChild(button);
    }
    else if (tab == 'vendor_broker_contact_info') {
        var br = document.createElementWithAttr('BR',{'id':'contact-table-spacer-br'});
        document.getElementById('table-div').safeAppendChild(br);
    }
    else if (tab == 'update_payments_and_growth') {
        console.log('pass update_payments_and_growth');
    }
}
//
// defines tab specific vendor/ broker row onclick functions
function vendor_broker_table_onclicks() {
    //
    var tab = document.getElementById('tab-clicked').value;
    var onclick = '';
    //
    if (tab == 'vendor_broker_setup') {
        onclick = "vendor_broker_setup_form('%vendor_internal_id%','%row_id%')";
    }
    else if (tab == 'vendor_broker_contact_info') {
        onclick = "create_contact_info_table_filter('%broker%',"+
                  "'%vendor_internal_id%','table-div');"+
                  "create_contact_info_table('%broker%','%vendor_internal_id%',1,"+
                  "'marketing_contact_information.contact_name','ASC'); ";
    }
    //
    return(onclick);
}
//
/////////////////////////// Table Creation Function ////////////////////////////
//
// creates broker vendor table
function create_vendor_broker_table(page,sort_col,sort_dir) {
    //
    // initializating argument objects
    var table_args = {};
    var data_sql_args = {};
    var meta_sql_args = {};
    //
    // creating sql statements
    get_table_inputs(data_sql_args,{'parent_id':'selection-parameters'});
    //
    data_sql_args.cmd = 'SELECT';
    data_sql_args.table = 'marketing_vendor_broker_table';
    data_sql_args.order_by = [[sort_col,sort_dir]];
    //
    meta_sql_args.cmd = 'SELECT';
    meta_sql_args.table = 'table_meta_data';
    meta_sql_args.where = [['in_tables','REGEXP','(^|%)marketing_vendor_broker_table(%|$)'],
                           ['use_on_pages','REGEXP','marketing'],
                           ['use_in_html_tables','REGEXP','vendor_broker_table']];
    meta_sql_args.order_by = [['order_index','ASC']]
    //
    table_args.data_sql = gen_sql(data_sql_args);
    table_args.meta_sql = gen_sql(meta_sql_args);
    //
    // creating table argument object
    table_args.table_output_id = 'table-div';
    table_args.table_id = 'vendor-broker-table';
    table_args.table_class = 'default-table';
    table_args.row_id_prefix = 'vbt-row-';
    table_args.table_data_cell_class = 'default-table-td';
    table_args.row_onclick = vendor_broker_table_onclicks();
    table_args.row_onmouseenter = "add_class('default-table-row-highlight','%row_id%')";
    table_args.row_onmouseleave = "remove_class('default-table-row-highlight','%row_id%')";
    table_args.head_row_args = {
        'sortable' : true,
        'column_tables' : ['marketing_vendor_broker_table'],
        'sort_col' : sort_col,
        'sort_dir' : sort_dir,
        'sort_onclick_str' : "create_vendor_broker_table(%%,'%column_name%','%sort_dir%')"
    };
    table_args.page_nav_args = {
        'curr_page' : page,
        'sort_col' : sort_col,
        'sort_dir' : sort_dir,
        'tot_pages_shown' : 9,
        'num_per_page' : 10,
        'page_nav_div_id' : 'vbt-table-page-nav',
        'id_prefix' : 'vbt',
        'page_nav_class' : 'page_nav',
        'class_str' : 'page-nav-link',
        'onclick_str' : "create_vendor_broker_table(%%,'"+sort_col+"','"+sort_dir+"');",
        'onmouse_str' : ''
    };
    table_args.add_callback = vendor_broker_table_callbacks;
    //
    create_standard_table(table_args);
}
//
// creates the vendor/ broker contact info table
// I want this to generate based on the broker first and if no broker then by ID #
function create_contact_info_table(broker,vendor_internal_id,page,sort_col,sort_dir) {
    //
    // initializating argument objects
    var table_args = {};
    var data_sql_args = {};
    var meta_sql_args = {};
    //
    // storing data in session
    var session_data = {
        'contact_table_broker' : broker,
        'contact_table_vendor_internal_id' : vendor_internal_id
    }
    store_session_data(session_data);
    //
    // creating sql statements
    table_args.show_deleted = document.getElementById('contact-show-deleted').checked;
    data_sql_args.where = [];
    if (!(table_args.show_deleted)) {
        data_sql_args.where.push(['contact_status','LIKE','active']);
    }
    if (broker != '') {
        data_sql_args.where.push(['marketing_vendor_broker_table.broker','LIKE',
                                   broker]);
    }
    else {
        data_sql_args.where.push(['marketing_vendor_broker_table.vendor_internal_id',
                                  'LIKE',vendor_internal_id]);
    }
    //
    data_sql_args.cmd = 'SELECT';
    data_sql_args.table = 'marketing_vendor_broker_table';
    data_sql_args.inner_join = [['marketing_contact_information',
                                 'marketing_vendor_broker_table.vendor_internal_id',
                                 'marketing_contact_information.vendor_internal_id'],
                                ['marketing_contact_aux_info',
                                 'marketing_contact_information.contact_internal_id',
                                 'marketing_contact_aux_info.contact_internal_id']];
    data_sql_args.order_by = [[sort_col,sort_dir]];
    //
    meta_sql_args.cmd = 'SELECT';
    meta_sql_args.table = 'table_meta_data';
    meta_sql_args.where = [['in_tables','REGEXP',
                            '(^|%)marketing_vendor_broker_table(%|$)|(^|%)marketing_contact_information(%|$)|(^|%)marketing_contact_aux_info(%|$)'],
                           ['use_on_pages','REGEXP','marketing'],
                           ['use_in_html_tables','REGEXP','vendor_broker_contact_info_table']];
    meta_sql_args.order_by = [['order_index','ASC']];
    //
    table_args.data_sql = gen_sql(data_sql_args);
    table_args.meta_sql = gen_sql(meta_sql_args);
    //
    // creating table argument object
    table_args.table_output_id = 'table-div';
    table_args.table_id = 'vendor-broker-contact-info-table';
    table_args.table_class = 'default-table';
    table_args.row_id_prefix = 'vbc-info-row-';
    table_args.table_data_cell_class = 'default-table-td';
    table_args.row_onclick = "create_contact_info_form('%contact_internal_id%','%vendor_internal_id%','%row_id%');";
    table_args.row_onmouseenter = "add_class('default-table-row-highlight','%row_id%');";
    table_args.row_onmouseleave = "remove_class('default-table-row-highlight','%row_id%');";
    table_args.head_row_args = {
        'sortable' : true,
        'column_tables' : ['marketing_vendor_broker_table',
                           'marketing_contact_information',
                           'marketing_contact_aux_info'],
        'sort_col' : sort_col,
        'sort_dir' : sort_dir,
        'sort_onclick_str' : "create_contact_info_table('%broker%',"+
                                                       "'%vendor_internal_id%',"+
                                                       "1,'%column_name%','%sort_dir%');"
    };
    table_args.page_nav_args = {
        'curr_page' : page,
        'sort_col' : sort_col,
        'sort_dir' : sort_dir,
        'tot_pages_shown' : 9,
        'num_per_page' : 10,
        'page_nav_div_id' : 'vbc-info-table-page-nav',
        'id_prefix' : 'vbt',
        'page_nav_class' : 'page_nav',
        'class_str' : 'page-nav-link',
        'onclick_str' : "create_contact_info_table('"+broker+
                                                  "','"+vendor_internal_id+
                                                  "',%%,'"+sort_col+"','"+sort_dir+"');",
        'onmouse_str' : ''
    };
    table_args.add_callback = function() {
        var br = document.createElementWithAttr('BR',{'id':'create-new-vendor-br'});
        var button = document.createElementWithAttr('BUTTON',{'id':'create-new-contact'});
        button.addTextNode('Create New Vendor/Broker Contact');
        button.style['margin'] = 'auto';
        button.style['display'] = 'block';
        button.addEventListener('click',create_contact_info_form.bind(null,null,vendor_internal_id,null));
        document.getElementById('table-div').safeAppendChild(br);
        document.getElementById('table-div').safeAppendChild(button);
    }
    //
    create_standard_table(table_args);
}
//
//
function create_food_show_table(page,sort_col,sort_dir) {
    //
    // initializating argument objects
    var table_args = {};
    var data_sql_args = {};
    var meta_sql_args = {};
    //
    // creating sql statements
    get_table_inputs(data_sql_args,{'parent_id':'selection-parameters'});
    //
    data_sql_args.cmd = 'SELECT';
    data_sql_args.table = 'marketing_vendor_broker_table';
    data_sql_args.inner_join = [['marketing_food_show',
                                 'marketing_vendor_broker_table.vendor_internal_id',
                                 'marketing_food_show.vendor_internal_id']];
    data_sql_args.order_by = [[sort_col,sort_dir]];
    //
    meta_sql_args.cmd = 'SELECT';
    meta_sql_args.table = 'table_meta_data';
    meta_sql_args.where = [['in_tables','REGEXP','(^|%)marketing_vendor_broker_table(%|$)|(^|%)marketing_food_show(%|$)'],
                           ['use_on_pages','REGEXP','marketing'],
                           ['use_in_html_tables','REGEXP','food_show_table']];
    meta_sql_args.order_by = [['order_index','ASC']]
    //
    table_args.data_sql = gen_sql(data_sql_args);
    table_args.meta_sql = gen_sql(meta_sql_args);
    //
    // creating table argument object
    table_args.table_output_id = 'table-div';
    table_args.table_id = 'food-show-table';
    table_args.table_class = 'default-table';
    table_args.row_id_prefix = 'food-show-row-';
    table_args.table_data_cell_class = 'default-table-td';
    table_args.row_onclick = "create_food_show_form('%vendor_internal_id%','%row_id%');";
    table_args.row_onmouseenter = "add_class('default-table-row-highlight','%row_id%')";
    table_args.row_onmouseleave = "remove_class('default-table-row-highlight','%row_id%')";
    table_args.head_row_args = {
        'sortable' : true,
        'column_tables' : ['marketing_vendor_broker_table','marketing_food_show'],
        'sort_col' : sort_col,
        'sort_dir' : sort_dir,
        'sort_onclick_str' : "create_food_show_table(%%,'%column_name%','%sort_dir%')"
    };
    table_args.page_nav_args = {
        'curr_page' : page,
        'sort_col' : sort_col,
        'sort_dir' : sort_dir,
        'tot_pages_shown' : 9,
        'num_per_page' : 10,
        'page_nav_div_id' : 'food-show-table-page-nav',
        'id_prefix' : 'fst',
        'page_nav_class' : 'page_nav',
        'class_str' : 'page-nav-link',
        'onclick_str' : "create_food_show_table(%%,'"+sort_col+"','"+sort_dir+"');",
        'onmouse_str' : ''
    };
    table_args.data_preprocessor = function(args) {
        var data_arr = args.data_arr;
        for (var i = 0; i < data_arr.length; i++) {
            var size = data_arr[i]['booth_size'];
            if (size == '1.0') { data_arr[i]['booth_size'] = 'Full';}
            else if (size == '0.5') { data_arr[i]['booth_size'] = 'Half';}
            else if (size == '0') { data_arr[i]['booth_size'] = 'None';}
        }
    }
    table_args.add_callback = vendor_broker_table_callbacks;
    //
    create_standard_table(table_args);
}
//
//
function create_payments_and_growth_table(page,sort_col,sort_dir) {
    //
    // initializating argument objects
    var table_args = {};
    var data_sql_args = {};
    var meta_sql_args = {};
    //
    // creating sql statements
    get_table_inputs(data_sql_args,{'parent_id':'selection-parameters'});
    //
    data_sql_args.cmd = 'SELECT';
    data_sql_args.table = 'marketing_vendor_broker_table';
    data_sql_args.inner_join = [['marketing_accounting',
                                 'marketing_vendor_broker_table.vendor_internal_id',
                                 'marketing_accounting.vendor_internal_id'],
                                ['marketing_alacarte_commitment',
                                 'marketing_vendor_broker_table.vendor_internal_id',
                                 'marketing_alacarte_commitment.vendor_internal_id'],
                                ['marketing_growth',
                                 'marketing_vendor_broker_table.vendor_internal_id',
                                 'marketing_growth.vendor_internal_id'],
                                ['marketing_food_show',
                                 'marketing_vendor_broker_table.vendor_internal_id',
                                 'marketing_food_show.vendor_internal_id']];
    data_sql_args.order_by = [[sort_col,sort_dir]];
    //
    meta_sql_args.cmd = 'SELECT';
    meta_sql_args.table = 'table_meta_data';
    var in_tables = '(^|%)marketing_vendor_broker_table(%|$)|(^|%)marketing_accounting(%|$)|'+
                    '(^|%)marketing_alacarte_commitment(%|$)|(^|%)marketing_growth(%|$)|'+
                    '(^|%)marketing_food_show(%|$)';
    meta_sql_args.where = [['in_tables','REGEXP',in_tables],
                           ['use_on_pages','REGEXP','marketing'],
                           ['use_in_html_tables','REGEXP','payments_and_growth_table']];
    meta_sql_args.order_by = [['order_index','ASC']]
    //
    table_args.data_sql = gen_sql(data_sql_args);
    table_args.meta_sql = gen_sql(meta_sql_args);
    //
    // creating table argument object
    table_args.table_output_id = 'table-div';
    table_args.table_id = 'payments-and-growth-table';
    table_args.table_class = 'default-table';
    table_args.row_id_prefix = 'pgt-row-';
    table_args.table_data_cell_class = 'default-table-td';
    table_args.row_onclick = "create_payments_and_growth_form('%vendor_internal_id%','%row_id%');";
    table_args.row_onmouseenter = "add_class('default-table-row-highlight','%row_id%')";
    table_args.row_onmouseleave = "remove_class('default-table-row-highlight','%row_id%')";
    table_args.head_row_args = {
        'sortable' : true,
        'column_tables' : ['marketing_vendor_broker_table','marketing_accounting',
                           'marketing_alacarte_commitment','marketing_growth',
                           'marketing_food_show'],
        'sort_col' : sort_col,
        'sort_dir' : sort_dir,
        'sort_onclick_str' : "create_payments_and_growth_table(%%,'%column_name%','%sort_dir%')"
    };
    table_args.page_nav_args = {
        'curr_page' : page,
        'sort_col' : sort_col,
        'sort_dir' : sort_dir,
        'tot_pages_shown' : 9,
        'num_per_page' : 10,
        'page_nav_div_id' : 'pag-table-page-nav',
        'id_prefix' : 'pgt',
        'page_nav_class' : 'page_nav',
        'class_str' : 'page-nav-link',
        'onclick_str' : "create_payments_and_growth_table(%%,'"+sort_col+"','"+sort_dir+"');",
        'onmouse_str' : ''
    };
    table_args.data_preprocessor = function(args) {
        var data_arr = args.data_arr;
        for (var i = 0; i < data_arr.length; i++) {
            var size = data_arr[i]['booth_size'];
            if (size == '1.0') { data_arr[i]['booth_size'] = 'Full';}
            else if (size == '0.5') { data_arr[i]['booth_size'] = 'Half';}
            else if (size == '0') { data_arr[i]['booth_size'] = 'None';}
        }
    }
    table_args.add_callback = vendor_broker_table_callbacks;
    //
    create_standard_table(table_args);
}
//
//
function create_marketing_commitment_table(page,sort_col,sort_dir) {
    //
    // initializating argument objects
    var table_args = {};
    var data_sql_args = {};
    var meta_sql_args = {};
    //
    // creating sql statements
    get_table_inputs(data_sql_args,{'parent_id':'selection-parameters'});
    //
    data_sql_args.cmd = 'SELECT';
    data_sql_args.table = 'marketing_vendor_broker_table';
    data_sql_args.inner_join = [['marketing_accounting',
                                 'marketing_vendor_broker_table.vendor_internal_id',
                                 'marketing_accounting.vendor_internal_id'],
                                ['marketing_alacarte_commitment',
                                 'marketing_vendor_broker_table.vendor_internal_id',
                                 'marketing_alacarte_commitment.vendor_internal_id']
        ];
    data_sql_args.order_by = [[sort_col,sort_dir]];
    //
    meta_sql_args.cmd = 'SELECT';
    meta_sql_args.table = 'table_meta_data';
    var in_tables = '(^|%)marketing_vendor_broker_table(%|$)|(^|%)marketing_accounting(%|$)|'+
                    '(^|%)marketing_alacarte_commitment(%|$)';
    meta_sql_args.where = [['in_tables','REGEXP',in_tables],
                           ['use_on_pages','REGEXP','marketing'],
                           ['use_in_html_tables','REGEXP','marketing_commitment_table']];
    meta_sql_args.order_by = [['order_index','ASC']]
    //
    table_args.data_sql = gen_sql(data_sql_args);
    table_args.meta_sql = gen_sql(meta_sql_args);
    //
    // creating table argument object
    table_args.table_output_id = 'table-div';
    table_args.table_id = 'marketing-commitment-table';
    table_args.table_class = 'default-table';
    table_args.row_id_prefix = 'mc-row-';
    table_args.table_data_cell_class = 'default-table-td';
    table_args.row_onclick = "create_marketing_commitment_form('%vendor_internal_id%','%row_id%');";
    table_args.row_onmouseenter = "add_class('default-table-row-highlight','%row_id%')";
    table_args.row_onmouseleave = "remove_class('default-table-row-highlight','%row_id%')";
    table_args.head_row_args = {
        'sortable' : true,
        'column_tables' : ['marketing_vendor_broker_table','marketing_accounting',
                           'marketing_alacarte_commitment'],
        'sort_col' : sort_col,
        'sort_dir' : sort_dir,
        'sort_onclick_str' : "create_marketing_commitment_table(%%,'%column_name%','%sort_dir%')"
    };
    table_args.page_nav_args = {
        'curr_page' : page,
        'sort_col' : sort_col,
        'sort_dir' : sort_dir,
        'tot_pages_shown' : 9,
        'num_per_page' : 10,
        'page_nav_div_id' : 'mc-table-page-nav',
        'id_prefix' : 'mc',
        'page_nav_class' : 'page_nav',
        'class_str' : 'page-nav-link',
        'onclick_str' : "create_marketing_commitment_table(%%,'"+sort_col+"','"+sort_dir+"');",
        'onmouse_str' : ''
    };
    //table_args.data_preprocessor = function(args) {}
    table_args.add_callback = vendor_broker_table_callbacks;
    //
    create_standard_table(table_args);
}