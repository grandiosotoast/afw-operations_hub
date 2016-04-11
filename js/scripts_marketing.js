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
                             'marketing_growth.vendor_internal_id',
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
    var args = {
        'place_holder_status' : 'disabled',
        'sql_args' : {'order_by':[['marketing_level','ASC']]},
        'add_callback' : callback
    };
    create_marketing_form('setup_vendor_broker','content-div');
    populate_dropbox_options('marketing-level','marketing_tiers',
                             'marketing_level','marketing_level','Select Level',
                              args);
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
////////////////////////////////////////////////////////////////////////////////
//////////////////////// Marketing Table Generation ////////////////////////////
//
// creates filtering options for the vendor_broker tabke
function create_vendor_broker_table_filter(output_id) {
    //
    // adding a filter fieldset
    var fieldset = document.createElement('FIELDSET');
    var formElements = Array(
            {'elm' : 'legend','textNode' : 'Selection Parameters'},
            //
            {'elm' : 'label', 'className' : 'label-large',
             'textNode' : 'Show Inactive Brokers/Vendors:'},
            {'elm' : 'input', 'id' : 'show-inactive', 'type' : 'checkbox',
             'events' : [{'event' : 'click',
                          'function' : create_vendor_broker_table.bind(null,1,'broker','ASC')}]},
            {'elm' : 'br'}
            //
            // filtering stuff like in sales customer table
            //
        );
    fieldset.id = 'selection-parameters';
    fieldset.className = 'fieldset-default';
    addChildren(fieldset,formElements);
    document.getElementById(output_id).appendChild(fieldset);
    document.getElementById(output_id).appendChild(document.createElement('BR'));
}
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
    table_args.show_inactive = document.getElementById('show-inactive').checked;
    data_sql_args.where = [];
    if (!(table_args.show_inactive)) {
        data_sql_args.where.push(['vendor_status','LIKE','active']);
    }
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
}
//
// creates the filtering fieldset for the contact_info table
function create_contact_info_table_filter(broker,vendor_internal_id,output_id) {
    //
    // adding a filter fieldset
    var fieldset = document.createElement('FIELDSET');
    var formElements = Array(
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
    addChildren(fieldset,formElements);
    document.getElementById(output_id).safeAppendChild(fieldset);
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
function create_food_show_table_filter(output_id) {
    //
    // adding a filter fieldset
    var fieldset = document.createElement('FIELDSET');
    var formElements = Array(
            {'elm' : 'legend','textNode' : 'Selection Parameters'},
            //
            {'elm' : 'label', 'className' : 'label-large',
             'textNode' : 'Show Inactive Brokers/Vendors:'},
            {'elm' : 'input', 'id' : 'show-inactive', 'type' : 'checkbox',
             'events' : [{'event' : 'click',
                          'function' : create_vendor_broker_table.bind(null,1,'broker','ASC')}]},
            {'elm' : 'br'}
            //
            // filtering stuff like in sales customer table
            //
        );
    fieldset.id = 'selection-parameters';
    fieldset.className = 'fieldset-default';
    addChildren(fieldset,formElements);
    document.getElementById(output_id).appendChild(fieldset);
    document.getElementById(output_id).appendChild(document.createElement('BR'));
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
    table_args.show_inactive = document.getElementById('show-inactive').checked;
    data_sql_args.where = [];
    if (!(table_args.show_inactive)) {
        data_sql_args.where.push(['vendor_status','LIKE','active']);
    }
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
function create_payments_and_growth_table_filter(output_id) {
    //
    // adding a filter fieldset
    var fieldset = document.createElement('FIELDSET');
    var formElements = Array(
            {'elm' : 'legend','textNode' : 'Selection Parameters'},
            //
            {'elm' : 'label', 'className' : 'label-large',
             'textNode' : 'Show Inactive Brokers/Vendors:'},
            {'elm' : 'input', 'id' : 'show-inactive', 'type' : 'checkbox',
             'events' : [{'event' : 'click',
                          'function' : create_vendor_broker_table.bind(null,1,'broker','ASC')}]},
            {'elm' : 'br'}
            //
            // filtering stuff like in sales customer table
            //
        );
    fieldset.id = 'selection-parameters';
    fieldset.className = 'fieldset-default';
    addChildren(fieldset,formElements);
    document.getElementById(output_id).appendChild(fieldset);
    document.getElementById(output_id).appendChild(document.createElement('BR'));
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
    table_args.show_inactive = document.getElementById('show-inactive').checked;
    data_sql_args.where = [];
    if (!(table_args.show_inactive)) {
        data_sql_args.where.push(['vendor_status','LIKE','active']);
    }
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