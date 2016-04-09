////////////////////////////////////////////////////////////////////////////////
///////////   This file holds general purpose utility functons       ///////////
///////////   that perform basic operations on inputs or elements    ///////////
////////////////////////////////////////////////////////////////////////////////
"use strict";
//
// creates and element with the supplied attributes
document.createElementWithAttr = function(nodeName,attributes) {
    var element = document.createElement(nodeName);
    //
    for (var attr in attributes) {
        element.setAttribute(attr,attributes[attr]);
    }
    return element;
}
//
// this adds a node if the ID doesn't exist on the parent node and replaces it if it does
Node.prototype.safeAppendChild = function(element) {
    //
    if (!(element.id)) { this.appendChild(element); return;}
    //
    var old_element = document.getElementById(element.id);
    var parent = null;
    if (old_element) { parent = old_element.parentNode;}
    if (parent == this) {
        this.replaceChild(element,old_element);
    }
    else {
        this.appendChild(element);
    }
}
//
// Adds multiple nodes to an element
Node.prototype.addNodes = function(node_array) {
    //
    for (var i = 0; i < node_array.length; i++) {
        this.safeAppendChild(node_array[i]);
    }
}
//
// this is just a short hand to add a text node to an element
Node.prototype.addTextNode = function(text) {
    //
    this.appendChild(document.createTextNode(text));
}
//
// removes all children from an element
Node.prototype.removeAll = function() {
    //
    while (this.firstChild) {
        this.removeChild(this.firstChild);
    }
}
//
// this creates a method to output a YYYY-MM-DD formatted date
Date.prototype.yyyymmdd = function() {
    // getting components of date
    var YYYY =  this.getFullYear().toString();
    var   MM = (this.getMonth()+1).toString();
    var   DD =  this.getDate().toString();
    //
    // returning formatted string
    return YYYY + '-' + (MM[1]?MM:'0'+MM[0]) + '-' + (DD[1]?DD:'0'+DD[0])
};
//
// this parses a number, removing commas, dollar and percent signs
Number.parse = function(num_str) {
    //
    num_str = num_str+'';//ensures value is a string
    num_str = num_str.replace(/[%$,]/g,'');
    //
    return(Number(num_str));
}
//
// stores data on the window session object
function store_session_data(key_value_dict) {
    //
    for (var key in key_value_dict) {
        var value = key_value_dict[key]
        window.sessionStorage.setItem(key,value);
    }
}
//
// this takes a function string and executes it
function exec_fun_str(func_str) {
    //
    var funs = func_str.split(';');
    for (var i = 0; i < funs.length; i++) {
        if (trim(funs[i]) === '') { continue;}
        //
        var m = funs[i].match(/([A-Z_]+)[(](.*?)[)]/i);
        var name = m[1];
        var args = m[2].split(',');
        //
        for (var j = 0; j < args.length; j++) {
            args[j] = args[j].replace(/^'/,'"');
            args[j] = args[j].replace(/'$/,'"');
            args[j] = JSON.parse(args[j]);
        }
        //
        var func = window[name];
        func.apply(null,args);
    }
}
//
// this performs and outputs the desired math on 2 values
function elementArithmetic(id1,id2,out_id,operator) {
    var value1 = +document.getElementById(id1).value;
    if (value1 != value1) {add_class('invalid-field',id1)}
    var value2 = +document.getElementById(id2).value;
    if (value2 != value2) {add_class('invalid-field',id2)}
    var out_elm = document.getElementById(out_id);
    //
    if (operator == '+') {
        out_elm.value = value1 + value2
    }
    else if (operator == '-') {
        out_elm.value = value1 - value2
    }
    else if (operator == '*') {
        out_elm.value = value1 * value2
    }
    else if (operator == '/') {
        out_elm.value = value1 / value2
    }
    else {
        console.log('Unknown operator: '+operator);
    }
}
//
// removes whitespace from string
function trim(value) {

   var startposn = 0;
   //
   while((value.charAt(startposn) == " ") && (startposn < value.length)){
      startposn++;
   }
   //
   if(startposn == value.length) {
       value = "";
   }
   //
   else {
       value = value.substring(startposn,value.length);
       var endposn = (value.length) - 1;
       while(value.charAt(endposn) == " ") {
               endposn--;
       }
       value = value.substring(0,endposn+1);
  }
  return(value);
}
//
// changes a string to title case i.e. 'column name' -> 'Column Name'
function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
//
// this function performs rouding by converting to integers
// doing this since .toFixed() doesn't seem to work right;
function floor(number_in,numDigits) {
    //
    if (number_in === '') {console.log('Error: round requires number arg',console.log(number_in),console.log(numDigits));return 0.0;}
    if (numDigits === '') {console.log('Error: round requires numDigits arg',console.log(number_in),console.log(numDigits));return 0.0;}
    //
    var number = Number(number_in);
    numDigits = Number(numDigits);
    //
    var scale = Math.pow(10,numDigits);
    number = number*scale;
    number = Math.floor(number)/scale;
    //
    if (isFinite(number)) {
        return(number);
    }
    else {
        console.log('Warning: Non-Finite number: '+number_in);
        return 0;
    }
}
//
// this function performs rouding by converting to integers
// doing this since .toFixed() doesn't seem to work right;
function ceiling(number_in,numDigits) {
    //
    if (number_in === '') {console.log('Error: round requires number arg',console.log(number_in),console.log(numDigits));return 0.0;}
    if (numDigits === '') {console.log('Error: round requires numDigits arg',console.log(number_in),console.log(numDigits));return 0.0;}
    //
    var number = Number(number_in);
    numDigits = Number(numDigits);
    //
    var scale = Math.pow(10,numDigits);
    number = number*scale;
    number = Math.ceil(number)/scale;
    //
    if (isFinite(number)) {
        return(number);
    }
    else {
        console.log('Warning: Non-Finite number: '+number_in);
        return 0;
    }
}
//
// this function performs rouding by converting to integers
// doing this since .toFixed() doesn't seem to work right;
function round(number_in,numDigits) {
    //
    if (number_in === '') {console.log('Error: round requires number arg',console.log(number_in),console.log(numDigits));return 0.0;}
    if (numDigits === '') {console.log('Error: round requires numDigits arg',console.log(number_in),console.log(numDigits));return 0.0;}
    //
    var number = Number(number_in);
    numDigits = Number(numDigits);
    //
    var scale = Math.pow(10,numDigits);
    number = number * scale;
    number = Math.round(number)/scale;
    //
    if (isFinite(number)) {
        return(number);
    }
    else {
        console.log('Warning: Non-Finite number: '+number_in);
        return 0;
    }
}
//
// returns the current timestamp in MYSQL format
function get_current_timestamp() {

    var ts = new Date();
    var ts_arr=[];
    ts_arr[0] = ts.getFullYear();
    ts_arr[1] = ts.getMonth()+1;
    ts_arr[2] = ts.getDate();
    ts_arr[3] = ts.getHours();
    ts_arr[4] = ts.getMinutes();
    ts_arr[5] = ts.getSeconds();
    //
    for (var i = 0; i < ts_arr.length; i++) {
        if (ts_arr[i] < 10) {ts_arr[i] = '0'+ts_arr[i]}
    }
    //
    ts = ts_arr[0]+"-"+ts_arr[1]+"-"+ts_arr[2]+" "+ts_arr[3]+":"+ts_arr[4]+":"+ts_arr[5];
    return(ts);
}
//
// gets the test of a select element's option and outputs to another element
function get_option_text(select_id,out_id) {

    var i = document.getElementById(select_id).selectedIndex;
    var opt = document.getElementById(select_id).options;
    var str = opt[i].text;
    document.getElementById(out_id).value = str;
}
//
// goes to a php page provided the root name of the page
function goto_link(id) {
    if (id == 'super admin') {id = 'administration'}
    var url = id+'.php';
    location.href = url;
}
//
// submits a form
function sub_form(id) {
    document.getElementById(id).submit();
}
//
// toggles the disabled status on an HTML element
function toggle_disabled(elm_id_str) {

    var id_arr = elm_id_str.split(',');
    for (var i = 0; i < id_arr.length; i++) {
        if (document.getElementById(id_arr[i]).disabled == true) {
            document.getElementById(id_arr[i]).disabled = false
        }
        else {
            document.getElementById(id_arr[i]).disabled = true
        }
    }
}
//
// toggles the readonly attrbute of an HTML element
function toggle_readonly(elm_id_str) {

    var id_arr = elm_id_str.split(',');
    for (var i = 0; i < id_arr.length; i++) {
        if (document.getElementById(id_arr[i]).readOnly == true) {
            document.getElementById(id_arr[i]).readOnly = false
        }
        else {
            document.getElementById(id_arr[i]).readOnly = true
        }
    }
}
//
// this sets a checkbox value based on if it is checked or not
function toggle_checkbox_value(checkbox_id,checked_value,unchecked_value) {
    var checkbox = document.getElementById(checkbox_id);
    //
    if (checkbox.checked) {
        checkbox.value = checked_value;
    }
    else {
        checkbox.value = unchecked_value;
    }
}
//
// this toggles the innerHTML of an element
function toggle_innerHTML(id,str_1,str_2) {
    //
    var content = document.getElementById(id).innerHTML;
    //
    if (content != str_1) {
        document.getElementById(id).textContent = str_1;
    }
    else {
        document.getElementById(id).textContent = str_2;
    }
}
//
//
function disable_if_checked(checkbox,id) {
    //
    var elm = document.getElementById(id);
    //
    if (checkbox.checked) { elm.disabled = true;}
    else { elm.disabled = false;}
}
//
// shows or hides an element by applying a CSS class
function show_hide(elm_id) {

    var element = document.getElementById(elm_id);
    var hid_pat = new RegExp('(?:^|\\s)hidden-elm(?!\\S)',"gi");
    if ( ! (element.className.match(hid_pat))) {
        add_class('hidden-elm',elm_id);
        return;
    }
    else {
        remove_class('hidden-elm',elm_id);
        return;
    }
}
//
// shows or hides an element by applying a CSS class
function show_if_val(check_elm_id,show_elm_id,show_val) {

    if (document.getElementById(check_elm_id).value == show_val) {
        document.getElementById(show_elm_id).disabled = false;
        remove_class('hidden-elm',show_elm_id);
        return;
    }
    else {
        document.getElementById(show_elm_id).disabled = true;
        add_class('hidden-elm',show_elm_id);
        return;
    }
}
//
// toggles an element created by a button, updating the button's string
// to reflect visibilty change if the button's value is update
// then the changes are applied instead of toggling visibility
function toggle_view_element_button(button_id,element_id,hide_str,show_str) {

    //
    // checking value of button, if update returning with no changes
    if (document.getElementById(button_id).value == 'update') {
        document.getElementById(button_id).value = 'view';
        if (!!(document.getElementById(element_id).className.match(/hidden-elm/))) {remove_class('hidden-elm',element_id);}
        remove_class('submit-changes-button',button_id);
    }
    else {
        show_hide(element_id);
    }
    //
    // updating button string
    if (document.getElementById(element_id).className.match('hidden-elm')) {
        document.getElementById(button_id).textContent = show_str;
    }
    else {
        document.getElementById(button_id).textContent = hide_str;
    }

}
//
// shows an update viewable data button or updates an existing button
// with a class and string
function show_update_button(button_id,data_table_id,update_str) {

    //
    // making button visible if data table has already been generated
    if (!!(document.getElementById(data_table_id))) {
        remove_class('hidden-elm',button_id);
        add_class('submit-changes-button',button_id);
        if (update_str != '') {
            document.getElementById(button_id).textContent = update_str;
            document.getElementById(button_id).value = 'update';
        }
    }
}
//
// adds a class to an element if it does not already have it
function add_class(class_name,elm_id) {

    var element = document.getElementById(elm_id);
    if (!(element)) {console.log('No element found with id: '+elm_id); return;}
    var class_pat = new RegExp('(?:^|\\s)'+class_name+'(?!\\S)',"gi");
    if ( ! (element.className.match(class_pat))) {
        element.className += " " + class_name;
    }
}
//
// removes a class from an elemet if it has it
// no error returned if the class does not exist
function remove_class(class_name,elm_id) {

    var element,css;
    var class_pat = new RegExp('(?:^|\\s)'+class_name+'(?!\\S)',"gi");
    element = document.getElementById(elm_id);
    if (!(element)) {console.log('No element found with id: '+elm_id); return;}
    css = document.getElementById(elm_id).className;
    element.className = css.replace(class_pat,'');
}
//
// removes a class from all elements on the page
function remove_class_all(class_name) {

    var elm_arr = document.getElementsByClassName(class_name);
    var i;
    elm_arr = [].slice.call(elm_arr);
    for (i = 0; i < elm_arr.length; i++) {
        remove_class(class_name,elm_arr[i].id)
    }
}
//
// this prints a given page element
function print_page(printableArea) {
     var printContents = document.getElementById(printableArea).innerHTML;
     var originalContents = document.body.innerHTML;
     //
     document.body.innerHTML = printContents;
     // this is where CSV export logic can go as well I think
     window.print();
     //
     document.body.innerHTML = originalContents;
}
//
// storing data in session variable to be used on different pages
function store_session(key_val_obj) {
    //
    var key_val_array = [];
    for (var key in key_val_obj) {
        key_val_array.push(key,key_val_obj[key]);
    }
    var key_val_str = key_val_array.join(',');
    //
    var post_str = "store_session=true&key_val_str="+key_val_str;
    if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
        var xmlhttp = new XMLHttpRequest();
    }
    else {
    // code for IE6, IE5
        var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    //
    // sending post str to async function to store the data
    xmlhttp.open("POST", "async_php_functions.php", true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send(post_str);
}
//
// gets the session array and processes it
function get_session(process_fun) {

    var post_str = "get_session=true"
    if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
        var xmlhttp = new XMLHttpRequest();
    }
    else {
    // code for IE6, IE5
        var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    //
    // executing async function
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            //
            // parsing JSON with error handling
            try {
                var session_arr = JSON.parse(xmlhttp.responseText);
            }
            catch(err) {
                var error = err;
                console.log(error);
                console.log(xmlhttp.responseText);
                alert("Error parsing JSON data check console.");
            }
            process_fun(session_arr)
        }
    }
    xmlhttp.open("POST", "async_php_functions.php", true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded","dataType: json","Accept");
    xmlhttp.send("get_session=true");
}
//
// generates a sql command to be used in an ajax request
function gen_sql(input_args) {
    //
    var sql = '';
    var valid = false;
    var args = {
        'cmd'   : false,
        'table' : false,
        'cols'  : false,
        'vals'  : false,
        'where' : false
    }
    //
    // updating default args with input args
    input_args = JSON.parse(JSON.stringify(input_args));
    for (var prop in input_args) {
        args[prop] = input_args[prop]
        if (Array.isArray(args[prop])) { if (args[prop].length == 0) { args[prop] = false;}}
    }
    //
    // checking for primary required arguments
    if (!(args.cmd)) { console.log("Function gen_sql requires a command to be provided"); return;}
    if (!(args.table)) { console.log("Function gen_sql requires a table to be provided"); return;}
    //
    // checking command specific arguments
    if (args.cmd == 'SELECT') {
        valid = true;
        if (!(args.cols))  {args.cols = ['*'];}
        sql = 'SELECT ';
    }
    else if (args.cmd == 'INSERT') {
        valid = true;
        if (!(args.cols))  { console.log("No columns provided for INSERT command."); valid = false;}
        if (!(args.vals))  { console.log("No values provided for the INSERT command."); valid = false;}
        sql = 'INSERT INTO `'+args.table+'`';
    }
    else if (args.cmd == 'UPDATE') {
        valid = true;
        if (!(args.cols))  { console.log("No columns provided for UPDATE command."); valid = false;}
        if (!(args.vals))  { console.log("No values provided for the UPDATE command."); valid = false;}
        if (!(args.where)) { console.log("No where array provided for the UPDATE command."); valid = false;}
        sql = 'UPDATE `'+args.table+'` SET ';
    }
    else if (args.cmd == 'DELETE') {
        valid = true;
        if (!(args.where)) { console.log("No where array provided for the DELETE command."); valid = false;}
        sql = 'DELETE FROM `'+args.table+'` '
    }
    else {
        console.log('Invalid command provided for gen SQL function: '+args.cmd);
    }
    if (valid == false) { return;}
    //
    // modifying values to fit commands
    for (var i = 0; i < args.cols.length; i++) {
        if (args.cols[i] == '*') { continue;}
        if (args.cols[i].match(/\./)) { continue;}
        if (args.cols[i].match(/\(.*\)/)) { continue;}
        args.cols[i] = '`'+args.cols[i]+'`';
    }
    for (var i = 0; i < args.vals.length; i++) {
        if ((args.vals[i]+'').match(/\(.*?\)/)) { continue;}
        else if (typeof(args.vals[i]) == 'string') {args.vals[i] = "'"+args.vals[i]+"'";}
    }
    if (args.where) {
        for (var i = 0; i < args.where.length; i++) {
          if (!(args.where[i][0].match(/\./))) {
              args.where[i][0] = '`'+args.where[i][0]+'`';
          }
          args.where[i][2] = "'"+args.where[i][2]+"'";
        }
    }
    if (args.cmd == 'UPDATE') {
        for (var i = 0; i < args.cols.length; i++) {
            args.cols[i] = args.cols[i]+'='+args.vals[i];
        }
        args.vals = false;
    }
    //
    // adding cols and vals to sql statements
    if (args.cmd == 'INSERT') {sql += '(';}
    if (args.cols) { sql += args.cols.join(',');}
    if (args.cmd == 'INSERT') {
        sql += ') VALUES('+args.vals.join(',')+')';
    }
    if (args.cmd == 'SELECT') { sql += ' FROM `'+args.table+'` '}
    //
    // adding inner join logic
    if (args.inner_join) {
        for (var i = 0; i < args.inner_join.length; i++) {
            sql += 'INNER JOIN '+args.inner_join[i][0]+' ON '+args.inner_join[i][1]+'='+args.inner_join[i][2]+' ';
        }
    }
    //
    // adding where clause
    if (args.where) {
        sql += ' WHERE '+args.where[0].join(' ');
        for (var i = 1; i < args.where.length; i++) {
            sql += ' AND '+args.where[i].join(' ');
        }
    }
    //
    // adding order by clauses
    if (args.order_by) {
        var col = args.order_by[0][0];
        if (!(col.match(/\./))) { col = '`'+col+'`';}
        sql += ' ORDER BY '+col+' '+args.order_by[0][1];
        for (var i = 1; i < args.order_by.length; i++) {
            col = args.order_by[i][0];
            if (!(col.match(/\./))) {col = '`'+col+'`';}
            sql += ', '+col+' '+args.order_by[i][1];
        }
    }
    //
    // adding in group by clause
    if (args.group_by) { sql += ' GROUP BY '+args.group_by;}
    //
    // adding in limit clause
    if (args.limit) { sql += ' LIMIT '+args.limit.splice(0,2).join();}
    //
    return(sql)
}
//
// performs a sql command on the database with no data return
function ajax_exec_db(sql,callback_fun) {
    console.log(sql);
    //
    if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
        var xmlhttp = new XMLHttpRequest();
    }
    else {
    // code for IE6, IE5
        var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    //
    // executing async function
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            //
            // parsing JSON with error handling
            try {
                var response = JSON.parse(xmlhttp.responseText);
                if (response.error) { alert(response.msg); return;}
            }
            catch(err) {
                console.log(err);
                console.log(sql_arr);
                console.log(xmlhttp);
                console.log(xmlhttp.responseText);
                alert("Error parsing JSON data check console.");
                return;
            }
            //
            if (callback_fun != "") { callback_fun();}
            else {console.log('Warning no callback function provided')}
        }
    }
    xmlhttp.open("POST", "async_php_functions.php", true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send("exec_db=true&sql="+encodeURIComponent(sql));
}
//
// performs a sql transaction on the database with no data return
function exec_transaction(sql_arr,callback_fun) {
    console.log(sql_arr);
    //
    if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
        var xmlhttp = new XMLHttpRequest();
    }
    else {
    // code for IE6, IE5
        var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    //
    // executing async function
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            //
            // parsing JSON with error handling
            try {
                var response = JSON.parse(xmlhttp.responseText);
                if (response.error) {
                    alert(response.msg);
                    return;
                }
            }
            catch(err) {
                console.log(err);
                console.log(sql_arr);
                console.log(xmlhttp);
                console.log(xmlhttp.responseText);
                alert("Error parsing JSON data check console.");
                return;
            }
            //
            if (callback_fun != "") { callback_fun();}
            else {console.log('Warning no callback function provided')}
        }
    }
    sql_arr = JSON.stringify(sql_arr);
    xmlhttp.open("POST", "async_php_functions.php", true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send("exec_transaction=true&sql_statements="+encodeURIComponent(sql_arr));
}
//
// function allowing for the return of multiple sql requests
function ajax_fetch(sql_arr,name_arr,callback_fun) {
    //
    // processing arguments
    var error = false;
    if (typeof callback_fun != 'function') {
        console.log("Error - No callback function provided.");
        return;
    }
    //
    for (var i = 0; i < sql_arr.length; i++) {
        console.log(sql_arr[i]);
    }
    //
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        var xmlhttp = new XMLHttpRequest();
    }
    else {
        // code for IE6, IE5
        var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    //
    // executing async function
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            //
            // parsing JSON with error handling
            try {
                var response = JSON.parse(xmlhttp.responseText);
                for (var prop in response) {
                    if (prop.match(/SQL_REQ_ERROR_MSG/i)) {
                        error = true;
                        alert(response[prop]);
                    }
                }
                if (error) {console.log(response); return false;}
            }
            catch(err) {
                console.log(err);
                console.log(sql_arr);
                console.log(xmlhttp);
                console.log(xmlhttp.responseText);
                alert("Error parsing JSON data check console.");
                return;
            }
            //
            // executing callback function
            if (callback_fun == "") {
                console.log("Error - No callback function provided.");
            }
            else {
                callback_fun(response);
            }
        }
    }
    sql_arr = JSON.stringify(sql_arr);
    xmlhttp.open("POST", "async_php_functions.php", true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send("fetch_db=true&sql_statements="+encodeURIComponent(sql_arr)+"&return_names="+name_arr.join(';'));
}
//
// this executes a non-returning ajax call
function ajax_call(post_str) {

    if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
        var xmlhttp = new XMLHttpRequest();
    }
    else {
    // code for IE6, IE5
        var xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    //
    // sending post str to async function to store the data
    xmlhttp.open("POST", "async_php_functions.php", true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send(post_str);
}