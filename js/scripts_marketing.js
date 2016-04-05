////////////////////////////////////////////////////////////////////////////////
//////////////       This file holds the functions that are          ///////////
//////////////       associated only with the marketing page         ///////////
////////////////////////////////////////////////////////////////////////////////
"use strict";
//
// sets the page for creation or modification of a vendor
function vendor_broker_setup() {
    //
    // add some filtering stuff here
    //
    var args = {'sql_args' : {'order_by':[['marketing_level','ASC']]}};
    create_marketing_form('setup_vendor_broker','content-div');
    populate_dropbox_options('marketing-level','marketing_tiers','marketing_level','marketing_level','Select Level',args);
}