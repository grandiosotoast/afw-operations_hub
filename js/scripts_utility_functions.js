////////////////////////////////////////////////////////////////////////////////
///////////   This file holds general purpose utility functons       ///////////
///////////   that perform basic operations on inputs or elements    ///////////
////////////////////////////////////////////////////////////////////////////////
"use strict";
//
// this creates a method to output a YYYY-MM-DD formatted date 
Date.prototype.yyyymmdd = function() {
   // getting components of date
   var YYYY =  this.getFullYear().toString();
   var   MM = (this.getMonth()+1).toString();
   var   DD =  this.getDate().toString();
   //
   // returning formatted string
  return YYYY + '-' + (MM[1]?MM:"0"+MM[0]) + '-' + (DD[1]?DD:"0"+DD[0])
};
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
function floor(number,numDigits) {
    //
    if (number === '') {console.log('Error: round requires number arg',console.log(number),console.log(numDigits));return 0.0;}
    if (numDigits === '') {console.log('Error: round requires numDigits arg',console.log(number),console.log(numDigits));return 0.0;}
    //
    var scale = Math.pow(10,numDigits);
    number = number*scale;
    number = Math.floor(number)/scale;
    return(number);   
}
//
// this function performs rouding by converting to integers
// doing this since .toFixed() doesn't seem to work right;
function ceiling(number,numDigits) {
    //
    if (number === '') {console.log('Error: round requires number arg',console.log(number),console.log(numDigits));return 0.0;}
    if (numDigits === '') {console.log('Error: round requires numDigits arg',console.log(number),console.log(numDigits));return 0.0;}
    //
    var scale = Math.pow(10,numDigits);
    number = number*scale;
    number = Math.ceil(number)/scale;
    return(number);   
}
//
// this function performs rouding by converting to integers
// doing this since .toFixed() doesn't seem to work right;
function round(number,numDigits) {
    //
    if (number === '') {console.log('Error: round requires number arg',console.log(number),console.log(numDigits));return 0.0;}
    if (numDigits === '') {console.log('Error: round requires numDigits arg',console.log(number),console.log(numDigits));return 0.0;}
    //
    var scale = Math.pow(10,numDigits);
    number = number*scale;
    number = Math.round(number)/scale;
    return(number);   
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
// this sets a checkboc value based on if it is checked or not
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
        document.getElementById(id).innerHTML = str_1;
    }
    else {
        document.getElementById(id).innerHTML = str_2;
    }
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
        document.getElementById(button_id).innerHTML = show_str; 
    }
    else {
        document.getElementById(button_id).innerHTML = hide_str; 
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
            document.getElementById(button_id).innerHTML = update_str;
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
// storing data in session variable to be used on different pages 
function store_session(key_val_str) {
    
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
// generates a sql command to be used in an ajax command
function gen_sql(arg_object) {
    // cmd values = INSERT, SELECT, UPDATE, DELETE
    // Syntax to gen INSERT command: cmd = "INSERT", table=table, cols=[c1,c2,..c#], vals=[v1,v2,...,v#]
    // Syntax to gen SELECT command: cmd = "SELECT", table=table, cols=[c1,c2,..c#], where[[c,(LIKE or REGEXP),v],[c,(LIKE or REGEXP),v],...]
    // Syntax to gen UPDATE command: cmd = "UPDATE", table=table, cols=[c1,c2,..c#], vals=[v1,v2,...,v#] where[[c,(LIKE or REGEXP),v],[c,(LIKE or REGEXP),v],...]
    // Syntax to gen DELETE command: cmd = "DELETE", table=table, where[[c,(LIKE or REGEXP),v],[c,(LIKE or REGEXP),v],...]
    var sql = "";
    var cmd,table,cols,vals,where;
    // Checking what values exist in arg_object
    if (!!(arg_object.cmd)) {cmd = arg_object.cmd;}
    else {console.log("Function gen_sql requires a command to be provided"); return;}
    if (!!(arg_object.table)) {table = arg_object.table;}
    else {console.log("Function gen sql requires a table to be provided"); return;}
    if (!!(arg_object.cols)) {cols = arg_object.cols;}
    else {cols = [''];}
    if (!!(arg_object.vals)) {vals = arg_object.vals;}
    else {vals=[''];}
    if (!!(arg_object.where)) {where = arg_object.where;}
    else {where=[''];}
    //
    if (cols.length  == 0) {cols  = [''];}
    if (vals.length  == 0) {vals  = [''];}
    if (where.length == 0) {where = [''];}
//
    if (cmd == "INSERT") {
        sql = "INSERT INTO `"+table+"`";
        if (cols[0] == '') {
            console.log("No columns provided for INSERT command.");
            return;
        }
        else {
            sql += "(";
            var n = cols.length-1;
            for (var i = 0; i < n; i++) {
                sql += "`"+cols[i]+"`, ";
            }
            sql += "`"+cols[n]+"`) ";
        }
        if (vals[0] == '') {
            console.log("No values provided for the INSERT command.");
            return;
        }
        else {
            sql += "VALUES (";
            var n = vals.length-1;
            for (var i = 0; i < n; i++) {
                vals[i] = vals[i]+''
                if (vals[i].match(/\(\)$/)) {
                    sql += vals[i]+", "; 
                }
                else if (typeof(vals[i]) == 'string') {
                    sql += "'"+vals[i]+"', ";
                }
                else {
                   sql += vals[i]+", "; 
                }
            }
            vals[i] = vals[i]+''
            if (vals[i].match(/\(\)$/)) {
                sql += vals[i]+") "; 
            }
            else if (typeof(vals[i]) == 'string') {
                sql += "'"+vals[i]+"') ";
            }
            else {
                sql += vals[i]+") "; 
            }
        }
    }
//
    else if (cmd == "SELECT") {
        if (cols[0] == '') {
            sql = "SELECT * FROM `"+table+"` ";
        }
        else {
            sql = "SELECT ";
            var n = cols.length-1;
            for (var i = 0; i < n; i++) {
                sql += "`"+cols[i]+"`, ";
            }
            sql += "`"+cols[n]+"` FROM `"+table+"` ";
        }
        if (where[0] != '') {
            sql += "WHERE `"+where[0][0]+"` "+where[0][1]+" '"+where[0][2]+"' ";
            var n = where.length;
            for (var i = 1; i < n; i++) {
                sql += "AND `"+where[i][0]+"` "+where[i][1]+" '"+where[i][2]+"' ";
            }
        }
    }
//
    else if (cmd == "UPDATE") {
        if ((cols[0] == '') || (vals[0] == '')) {
            console.log("No columns and/or values provided for UPDATE command")
            return;
        }
        else {
            sql = "UPDATE `"+table+"` SET ";
            var n = cols.length - 1;    
            for (var i = 0; i < n; i++) {
                vals[i] = vals[i]+''
                if (vals[i].match(/\(\)$/)) {sql += "`"+cols[i]+"` = "+vals[i]+", ";}
                else if (typeof(vals[i]) == 'string') {sql += "`"+cols[i]+"` = '"+vals[i]+"', ";}
                else {sql += "`"+cols[i]+"` = "+vals[i]+", ";}
            }
            vals[i] = vals[i]+''
            if (vals[i].match(/\(\)$/)) {sql += "`"+cols[i]+"` = "+vals[i]+" ";}
            else if (typeof(vals[i]) == 'string') {sql += "`"+cols[i]+"` = '"+vals[i]+"' ";}
            else {sql += "`"+cols[i]+"` = "+vals[i]+" ";}
        }
        if (where[0] == '') {
            console.log("No where array passed to gen_sql function for UPDATE command.")
            return;
        }
        else {
            sql += "WHERE `"+where[0][0]+"` "+where[0][1]+" '"+where[0][2]+"' ";
            var n = where.length;
            for (var i = 1; i < n; i++) {
                sql += "AND `"+where[i][0]+"` "+where[i][1]+" '"+where[i][2]+"' ";
            }
        }
    }
//
    else if (cmd == "DELETE") {
        sql = "DELETE FROM `"+table+"` ";
        if (where[0] == '') {
            console.log("No where array passed to the gen_sql function for the DELETE command");
            return;
        }
        else {
            sql += "WHERE `"+where[0][0]+"` "+where[0][1]+" '"+where[0][2]+"' ";
            var n = where.length;
            for (var i = 1; i < n; i++) {
                sql += "AND `"+where[i][0]+"` "+where[i][1]+" '"+where[i][2]+"' ";
            }
        }
    }
//
    else {
        console.log("Invalid command supplied: "+cmd);
        return;
    }
    //
    // adding in limit clause if it is available
    if (arg_object.limit) {sql += ' LIMIT '+arg_object.limit.splice(0,2).join();}
    //
    // handling order by clauses
    if (arg_object.orderBy) {
        sql += ' ORDER BY `'+arg_object.orderBy[0][0]+'` '+arg_object.orderBy[0][1]
        for (var i = 1; i < arg_object.orderBy.length; i++) {
            sql += ', `'+arg_object.orderBy[i][0]+'` '+arg_object.orderBy[i][1];
        }
    }
    //
    // checking if an additional string needs to be added
    if (arg_object.addLogic) {
        arg_object.addLogic = arg_object.addLogic.replace(';','');
        sql += ' ' + arg_object.addLogic;
    }
    return(sql);
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
            if (!!(xmlhttp.responseText)) {
                console.log(xmlhttp.responseText);
                alert(xmlhttp.responseText);
            }
            else {
                if (callback_fun != "") { callback_fun();}
            }
        }
    }
    xmlhttp.open("POST", "async_php_functions.php", true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send("async_exec_db=true&sql="+encodeURIComponent(sql));
}
//
// performs a sql command on the database with no data return 
function ajax_mulit_exec(sql_arr,callback_fun) {
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
            if (!!(xmlhttp.responseText)) {
                console.log(xmlhttp.responseText);
                alert(xmlhttp.responseText);
            }
            else {
                if (callback_fun != "") { callback_fun();}
            }
        }
    }
    xmlhttp.open("POST", "async_php_functions.php", true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send("async_exec_multiple=true&sql_statements="+encodeURIComponent(sql_arr.join(';')));
}
//
// performs a sql command on the database with a data return 
// also returns col meta data if a sql statment is provided
function ajax_fetch_db(sql,meta_sql,callback_fun) {
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
            }
            catch(err) {
                var error = err;
                console.log(error);
                console.log(xmlhttp.responseText);
                alert("Error parsing JSON data check console.");
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
    xmlhttp.open("POST", "async_php_functions.php", true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send("async_fetch_db=true&sql="+encodeURIComponent(sql)+"&meta_sql="+encodeURIComponent(meta_sql));
}
//
// this is going to replace the current ajax fetch
function ajax_multi_fetch(sql_arr,name_arr,callback_fun) {
    //
    // processing arguments
    var post_str = 'async_fetch_multiple=true';
    if (sql_arr.length > 0) { post_str += '&sql_statements='+sql_arr.join(';');}
    else { console.log('Error - No SQL statements provided.'); return;}
    if (name_arr.length > 0) { post_str += '&return_names='+encodeURIComponent(name_arr.join(';'));}
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
    xmlhttp.open("POST", "async_php_functions.php", true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send("async_fetch_multiple=true&sql_statements="+encodeURIComponent(sql_arr.join(';'))+"&return_names="+name_arr.join(';'));
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
//
// this executes a returning ajax call
function ajax_return_call(post_str,callback) {
    
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
            callback(xmlhttp.responseText);
        }
    }
    //
    // sending post str to async function to store the data
    xmlhttp.open("POST", "async_php_functions.php", true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send(post_str);
}