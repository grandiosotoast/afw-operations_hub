////////////////////////////////////////////////////////////////////////////////
////////////// This file holds all functions that create dynamic     ///////////
////////////// columns on the report page                            ///////////
////////////////////////////////////////////////////////////////////////////////
"use strict";
//
// this holds references to pre-made functions 
var REPORT_FUNCTIONS = {
    // general production functions
    'calc_hourly' : calc_hourly,
    'calc_avg_hourly_rate' : calc_avg_hourly_rate,
    'calc_true_hours' : calc_true_hours,
    'calc_overtime'   : calc_overtime,
    'calc_percent_ot' : calc_percent_ot,
    'calc_amount_to_pay'  : calc_amount_to_pay,
    // driver functions
    'calc_transportation_incentive' : calc_transportation_incentive,
    'calc_driver_reimbursement' : calc_driver_reimbursement,
    'calc_driver_amount_to_pay'  : calc_driver_amount_to_pay,
    'calc_driver_hourly' : calc_driver_hourly,
    'calc_cost_per_case'  : calc_cost_per_case,
    'calc_cost_per_mile'  : calc_cost_per_mile,
    'calc_cost_per_route' : calc_cost_per_route,
    'calc_cost_per_stop'  : calc_cost_per_stop,
    'calc_miles_per_gallon' : calc_miles_per_gallon,
    'recalc_transportation_totals' : recalc_transportation_totals,
    // logistics functions
    'calc_freight_backhaul_ytd_savings' : calc_freight_backhaul_ytd_savings,
    // general employee functions
    'recalc_general_totals' : recalc_general_totals,
    // receiving functions
    'calc_receiving_incentive' : calc_receiving_incentive,
    'calc_cost_per_move'  : calc_cost_per_move,
    'calc_cost_per_unit'  : calc_cost_per_unit,
    'recalc_receiving_totals' : recalc_receiving_totals,
    // shipping functions
    'calc_warehouse_incentive'   : calc_warehouse_incentive,
    'calc_shipping_supervisor_incentive' : calc_shipping_supervisor_incentive,
    'recalc_shipping_totals' : recalc_shipping_totals,
    // sales functions
    'calc_dso' : calc_dso,
    'calc_credit_percentage' : calc_credit_percentage,
    'calc_profit_margin'   : calc_profit_margin,
    'calc_base_commission' : calc_base_commission,
    'calc_growth' : calc_growth,
    'calc_total_commission' : calc_total_commission
}
//
// this function checks if a function has already been called on that row
// this isn't used now but could be in the future to prevent something from being added twice
function check_calls(fun_name,data_row) {
    //
    if (!(data_row.hasOwnProperty('called_functions'))) {
        data_row.called_functions = [];
    }
    // returning true if called and adding function name if not
    if (data_row.called_functions.indexOf(fun_name) < 0) {
        data_row.called_functions.push(fun_name);
        return false;
    }
    return true;
}
//
// this function will handle calculation of dependencies for columns 
// that require the entire data set
function check_dependency_bulk(col_name,report_args,dynamic_cols) {
    var dependents = dynamic_cols[col_name].dependencies.split(',');
    for (var i = 0; i < dependents.length; i++) {
        if (dynamic_cols.hasOwnProperty(dependents[i])) {
            var col_funct = REPORT_FUNCTIONS[dynamic_cols[dependents[i]].col_function];
            if (!(col_funct)) {console.log('Error: No function for column: '+dependents[i]); break;}
            if (dynamic_cols[dependents[i]]['column_type'].match(/async/)) { console.log('Warning column: '+col_name+' is dependent on asynchronous column: '+dependents[i]);}
            col_funct(dependents[i],report_args);
        }
    }
}
//
// this function will handle calculation of dependencies for regular columns
function check_dependency_regular(col_name,data_row,dynamic_cols) {
    var dependents = dynamic_cols[col_name].dependencies.split(',');
    for (var i = 0; i < dependents.length; i++) {
        if (dynamic_cols.hasOwnProperty(dependents[i]) && !(data_row.hasOwnProperty(dependents[i]))) {
            var col_funct = REPORT_FUNCTIONS[dynamic_cols[dependents[i]].col_function];
            if (!(col_funct)) {console.log('Error: No function for column: '+dependents[i]); break;}
            col_funct(dependents[i],data_row,dynamic_cols);
        }
    }
}
//
// this function performs simple recalculation of totals so they display properly
function recalc_totals(args) {
    //
    var meta_data = args.meta_data;
    var section_ids = args.section_ids;
    var numerator_col = args.numerator_col;
    var divisor_col = args.divisor_col;
    var output_col = args.output_col;
    var precision = CONSTANTS.STD_PRECISION
    //
    if (!(meta_data.hasOwnProperty(output_col))) { return;}
    if (meta_data[output_col]['data_type'].match(/int/)) { precision = 0;}
    //
    // updating the section totals
    for (var i = 0; i < section_ids.length; i++) {
        var prefix = section_ids[i];
        var numerator = Number.parse(document.getElementById(prefix+'-span-'+numerator_col).innerHTML);
        var divisor = Number.parse(document.getElementById(prefix+'-span-'+divisor_col).innerHTML);
        //
        var value = round((numerator/divisor),precision).toFixed(precision);
        if (!(isFinite(value))) { value = 0.0;}
        if (!(document.getElementById(prefix+'-span-'+output_col))) { continue;}
        document.getElementById(prefix+'-span-'+output_col).textContent = value;     
    }

}
//
// this function outputs a simple total eiter average or summing values
function output_simple_totals(total_args,report_args) {
    //
    var section_ids = report_args.section_ids;
    var sect_col = report_args.prime_sort;
    var data_arr = report_args.data;
    var emp_data = total_args.emp_data;
    var col = total_args.column;
    var avg = total_args.average;
    var value_obj = {};
    var count_obj = {};
    var overall_value = 0.0;
    var overall_counts = 0;  
    //
    // outputting value  
    if ((report_args.prime_sort == 'emp_id') || (report_args.prime_sort == 'emp_last_name')) {
        for (var id = 0; id < section_ids.length; id++) {
            if (section_ids[id] == 'overall') {continue;}
            //
            var data_arr = emp_data[section_ids[id]];
            var section_value = 0.0;
            var section_counts = 0;
            for (var i = 0; i < data_arr.length; i++) {
                section_value += Number.parse(data_arr[i][col]);
                overall_value += Number.parse(data_arr[i][col]);
                section_counts += 1; 
                overall_counts += 1;
            } //end data loop
            if (avg) { section_value = section_value/section_counts;}
            section_value = round(section_value,CONSTANTS.STD_PRECISION).toFixed(CONSTANTS.STD_PRECISION);
            document.getElementById('section-total-'+section_ids[id]+'-'+col).textContent = section_value;
        } //end emp loop
        if (avg) { overall_value = overall_value/overall_counts;}
        overall_value = round(overall_value,CONSTANTS.STD_PRECISION).toFixed(CONSTANTS.STD_PRECISION);
        document.getElementById('overall-'+col).textContent = overall_value;
    }
    else {
        //
        // getting all of the data into a section object
        for (var i = 0; i < data_arr.length; i++) {
            if (!(value_obj.hasOwnProperty(data_arr[i][sect_col]))) {
                value_obj[data_arr[i][sect_col]] = 0.0;
                count_obj[data_arr[i][sect_col]] = 0;
            }
            value_obj[data_arr[i][sect_col]] += Number.parse(data_arr[i][col]);
            count_obj[data_arr[i][sect_col]] += 1;   
            overall_value += Number.parse(data_arr[i][col]);
            overall_counts += 1;
            console.log(i,overall_value,Number.parse(data_arr[i][col]),data_arr[i]['entry_id']);
        }
        //
        // outputting data into table
        for (var section in value_obj) {
            if (section == 'overall') {continue;}
            //
            if (avg) { value_obj[section] = value_obj[section]/count_obj[section];}
            value_obj[section] = round(value_obj[section],CONSTANTS.STD_PRECISION).toFixed(CONSTANTS.STD_PRECISION);
            document.getElementById('section-total-'+section+'-'+col).textContent = value_obj[section];
        } //end section loop
        if (avg) { overall_value = overall_value/overall_counts;}
        overall_value = round(overall_value,CONSTANTS.STD_PRECISION).toFixed(CONSTANTS.STD_PRECISION);
        document.getElementById('overall-'+col).textContent = overall_value;
    }
}
//
// this calculates the hourly pay for all departments
function calc_hourly(col_name,data_row,dynamic_cols) {
    // 
    check_dependency_regular(col_name,data_row,dynamic_cols);
    //
    // calulating value
    data_row[col_name] = Number.parse(data_row['total'])
    data_row[col_name] = data_row[col_name] - Number.parse(data_row['incentive_pay'])
    data_row[col_name] = data_row[col_name] - Number.parse(data_row['additional_pay'])
    data_row[col_name] = data_row[col_name] + Number.parse(data_row['pay_deductions']);
    if (!(isFinite(data_row[col_name]))) {data_row[col_name] = 0.0;}
}
//
// this calculates the average hourly pay rate for all departments
function calc_avg_hourly_rate(col_name,data_row,dynamic_cols) {
    // 
    check_dependency_regular(col_name,data_row,dynamic_cols);
    //
    // calulating value
    data_row[col_name] = Number.parse(data_row['total']) / Number.parse(data_row['hours']);
    if (!(isFinite(data_row[col_name]))) {data_row[col_name] = 0.0;}
}
//
// this adds all of the pay fields except hourly pay into a single value
function calc_amount_to_pay(col_name,data_row,dynamic_cols) {
    // 
    check_dependency_regular(col_name,data_row,dynamic_cols);
    //
    // calulating value
    data_row[col_name] = Number.parse(data_row['additional_pay']) + Number.parse(data_row['incentive_pay']) - Number.parse(data_row['pay_deductions']);
    if (!(isFinite(data_row[col_name]))) {data_row[col_name] = 0.0;}
}
//
// this function verefies that the hours for an entry are true paid hours
// and not holiday or otherwise
function calc_true_hours(col_name,report_args) {
    if (report_args.called_funs.hasOwnProperty([report_args.dynamic_cols[col_name].col_function])) { return;}
    //
    check_dependency_bulk(col_name,report_args,report_args.dynamic_cols);
    //
    var data = report_args.data;
    //
    for (var i = 0; i < data.length; i++) {
        var true_hours = data[i]['hours'];
        //
        if (data[i]['attendance_error'] == 'holiday') { true_hours = 0.0;}
        data[i][col_name] = true_hours;
    }
    //
    //
    report_args.called_funs[report_args.dynamic_cols[col_name].col_function] = true;    
}
//
// this calculates the amount of overtime a person has
function calc_overtime(col_name,report_args) {
    if (report_args.called_funs.hasOwnProperty([report_args.dynamic_cols[col_name].col_function])) { return;}
    //
    check_dependency_bulk(col_name,report_args,report_args.dynamic_cols);
    //
    // creating a new data array to preserve order of original but still update objects
    var data_arr = [];
    for (var i = 0; i < report_args.data.length; i++) {
        data_arr[i] = report_args.data[i]
    }
    //
    // sorting report data by date
    data_arr.sort(function(a, b) {
            var d1 = new Date(a.date);
            var d2 = new Date(b.date);
            return (d1 - d2);
    });
    //
    // calculating overtime for each employee
    var entry_date = new Date(data_arr[0].date.split('-')[0],data_arr[0].date.split('-')[1]-1,data_arr[0].date.split('-')[2]);
    var exit_date = new Date(entry_date.getFullYear(),entry_date.getMonth(),(entry_date.getDate()+6-entry_date.getDay()));
    var wk_hours = {};
    //
    for (var i = 0; i < data_arr.length; i++) {
        var emp_id = data_arr[i].emp_id;
        var entry_date = new Date(data_arr[i].date.split('-')[0],data_arr[i].date.split('-')[1]-1,data_arr[i].date.split('-')[2]);
        var hours = Number.parse(data_arr[i]['true_hours']);
        var dailyOT = 0.0;
        //
        // resetting wk hours object if sunday is crossed
        if (entry_date > exit_date) {
            wk_hours = {};
            exit_date = new Date(entry_date.getFullYear(),entry_date.getMonth(),(entry_date.getDate()+6-entry_date.getDay()) );
        }
        if (!(wk_hours.hasOwnProperty(emp_id))) { wk_hours[emp_id] = 0.0;}
        //
        if (wk_hours[emp_id] > 40) {
            dailyOT = hours;
        }
        else if ((wk_hours[emp_id]+hours) > 40) {
            dailyOT = (wk_hours[emp_id]+hours) - 40;
        }
        wk_hours[emp_id] += hours;
        data_arr[i].dailyOT = dailyOT; 
    }
    //
    report_args.called_funs[report_args.dynamic_cols[col_name].col_function] = true;
}
//
// this calculates the %OT for a report
function calc_percent_ot(col_name,report_args) {
    if (report_args.called_funs.hasOwnProperty([report_args.dynamic_cols[col_name].col_function])) { return;}
    //
    check_dependency_bulk(col_name,report_args,report_args.dynamic_cols);
    //
    var dynamic_cols = report_args.dynamic_cols;
    var sect_col = report_args.prime_sort;
    var data_arr = report_args.data;
    var overtimeHours = {};
    var regularHours = {};
    var section_ids = {};
    var total_id_format_str = 'section-total';
    if (report_args.total_id_format_str) { total_id_format_str = report_args.total_id_format_str;}
    //
    // getting all of the data into a section object
    var overallHours = 0.0;
    var overallOT = 0.0;
    for (var i = 0; i < data_arr.length; i++) {
        if (!(overtimeHours.hasOwnProperty(data_arr[i][sect_col]))) {
            overtimeHours[data_arr[i][sect_col]] = 0.0;
            regularHours[data_arr[i][sect_col]] = 0.0;
            //
            var total_id = total_id_format_str
            for (var prop in data_arr[i]) { total_id = total_id.replace('%'+prop+'%',data_arr[i][prop]);}
            section_ids[data_arr[i][sect_col]] = total_id;
        }
        overtimeHours[data_arr[i][sect_col]] += Number.parse(data_arr[i]['dailyOT']);
        regularHours[data_arr[i][sect_col]] += Number.parse(data_arr[i]['true_hours']);
        overallOT += Number.parse(data_arr[i]['dailyOT']);
        overallHours += Number.parse(data_arr[i]['true_hours']);
    }
    //
    // outputting data into table
    var perc = 0.0;
    for (var section in overtimeHours) {
        //
        perc = overtimeHours[section]/regularHours[section] * 100.0;
        perc = round(perc,CONSTANTS.STD_PRECISION).toFixed(CONSTANTS.STD_PRECISION);
        total_id = section_ids[section];
        document.getElementById(total_id+'-'+col_name).textContent = report_args.col_name_meta[col_name].column_nickname+' '+perc+' %';
    } //end section loop
    perc = overallOT/overallHours * 100.0;
    perc = round(perc,CONSTANTS.STD_PRECISION).toFixed(CONSTANTS.STD_PRECISION);
    document.getElementById('overall-'+col_name).textContent = report_args.col_name_meta[col_name].column_nickname+' '+perc+' %';
    //
    report_args.called_funs[report_args.dynamic_cols[col_name].col_function] = true;
}
////////////////////////////////////////////////////////////////////////////////
//////////////                Transportation Functions               ///////////
////////////////////////////////////////////////////////////////////////////////
//
// this calculates the incentive pay for drivers
function calc_transportation_incentive(col_name,data_row,dynamic_cols) {
    //
    check_dependency_regular(col_name,data_row,dynamic_cols);
    //
    // calulating value
    var ovn = Number.parse(data_row['over_night']);
    var base_rate = Number.parse(data_row['base_rate']);
    if (ovn > 0) { base_rate = 2*data_row['base_rate'];}
    data_row[col_name]  = 0;
    data_row[col_name] += 10.0 * Number.parse(data_row['num_backhauls']);
    data_row[col_name] += base_rate * Number.parse(data_row['num_routes']);
    data_row[col_name] += Number.parse(data_row['case_rate']) * Number.parse(data_row['num_cases']);
    data_row[col_name] += Number.parse(data_row['stop_rate']) * Number.parse(data_row['num_stops']);
    data_row[col_name] += Number.parse(data_row['per_diem'])  + Number.parse(data_row['pre_inspection']) + Number.parse(data_row['post_inspection']);
    if (!(isFinite(data_row[col_name]))) {data_row[col_name] = 0.0;}
}
//
// this calculates the expense reimbursement for drivers
function calc_driver_reimbursement(col_name,data_row,dynamic_cols) {
    //
    check_dependency_regular(col_name,data_row,dynamic_cols);
    //
    // calulating value
    data_row[col_name]  = 0;
    data_row[col_name] += Number.parse(data_row['hotel_amount']);
    data_row[col_name] += Number.parse(data_row['toll_amount']);
    data_row[col_name] += Number.parse(data_row['truck_fuel']) * Number.parse(data_row['cost_per_gallon']);
    data_row[col_name] += Number.parse(data_row['reefer_fuel']) * Number.parse(data_row['cost_per_gallon']);
    data_row[col_name] += Number.parse(data_row['fuel_def']) * Number.parse(data_row['def_cost_per_gallon']);
    if (!(isFinite(data_row[col_name]))) {data_row[col_name] = 0.0;}
}
//
// this calculates the hourly pay for drivers
function calc_driver_hourly(col_name,data_row,dynamic_cols) {
    // 
    check_dependency_regular(col_name,data_row,dynamic_cols);
    //
    // calulating value
    data_row[col_name] = Number.parse(data_row['total'])
    data_row[col_name] = data_row[col_name] - Number.parse(data_row['incentive_pay']);
    data_row[col_name] = data_row[col_name] - Number.parse(data_row['additional_pay']);
    data_row[col_name] = data_row[col_name] + Number.parse(data_row['pay_deductions']);
    if (!(isFinite(data_row[col_name]))) {data_row[col_name] = 0.0;}
}
//
// this adds all of the pay fields except hourly pay into a single value
function calc_driver_amount_to_pay(col_name,data_row,dynamic_cols) {
    // 
    check_dependency_regular(col_name,data_row,dynamic_cols);
    //
    // calulating value
    data_row[col_name]  = 0;
    data_row[col_name] += Number.parse(data_row['additional_pay']) - Number.parse(data_row['pay_deductions']);
    data_row[col_name] += Number.parse(data_row['incentive_pay']);
    if (!(isFinite(data_row[col_name]))) {data_row[col_name] = 0.0;}
}
// 
// this calculates the cost per case for drivers and pickers
function calc_cost_per_case(col_name,data_row,dynamic_cols) {
    //
    check_dependency_regular(col_name,data_row,dynamic_cols);
    //
    data_row[col_name] = (+data_row['total'])/(+data_row['num_cases']);
    if (!(isFinite(data_row[col_name]))) {data_row[col_name] = 0.0;}
}
//
function calc_cost_per_mile(col_name,data_row,dynamic_cols) {
    //
    check_dependency_regular(col_name,data_row,dynamic_cols);
    //
    data_row[col_name] = (+data_row['total'])/(+data_row['miles']);
    if (!(isFinite(data_row[col_name]))) {data_row[col_name] = 0.0;}
}
//
function calc_cost_per_route(col_name,data_row,dynamic_cols) {
    //
    check_dependency_regular(col_name,data_row,dynamic_cols);
    //
    data_row[col_name] = (+data_row['total'])/(+data_row['num_routes']);
    if (!(isFinite(data_row[col_name]))) {data_row[col_name] = 0.0;}
}
//
function calc_cost_per_stop(col_name,data_row,dynamic_cols) {
    //
    check_dependency_regular(col_name,data_row,dynamic_cols);
    //
    data_row[col_name] = (+data_row['total'])/(+data_row['num_stops']);
    if (!(isFinite(data_row[col_name]))) {data_row[col_name] = 0.0;}
}
//
function calc_miles_per_gallon(col_name,data_row,dynamic_cols) {
    //
    check_dependency_regular(col_name,data_row,dynamic_cols);
    //
    data_row[col_name] = (+data_row['miles'])/(+data_row['truck_fuel']);
    if (!(isFinite(data_row[col_name]))) {data_row[col_name] = 0.0;}
}
//
// this function properly recalculates the required shipping totals
function recalc_transportation_totals(col_name,report_args) {
    //
    var args = {
        'meta_data' : report_args.col_name_meta,
        'data' : report_args.data,
        'section_ids' : report_args.section_ids
    }
    //
    // setting array of column args
    var cols = {
        'cost_per_mile' : {'numerator_col' : 'total', 'divisor_col' : 'miles'},
        'cost_per_route' : {'numerator_col' : 'total', 'divisor_col' : 'num_routes'},
        'cost_per_stop' : {'numerator_col' : 'total', 'divisor_col' : 'num_stops'},
        'cost_per_case' : {'numerator_col' : 'total', 'divisor_col' : 'num_cases'},
        'avg_hourly_rate' : {'numerator_col' : 'total', 'divisor_col' : 'hours'},
        'miles_per_gallon' : {'numerator_col' : 'miles', 'divisor_col' : 'truck_fuel'}
    };
    //
    // recalculating columns
    for (var output_col in cols) {
        args['output_col'] = output_col;
        args['numerator_col'] = cols[output_col]['numerator_col'];
        args['divisor_col'] = cols[output_col]['divisor_col'];
        recalc_totals(args)
    }
}
//
////////////////////////////////////////////////////////////////////////////////
//////////////             Freight Logistics Functions               ///////////
////////////////////////////////////////////////////////////////////////////////
//
//
// this function performs the asynchronous calculation for freight backhaul YTD savings
function calc_freight_backhaul_ytd_savings(col_name,report_args) {
    //
    if (report_args.called_funs.hasOwnProperty([report_args.dynamic_cols[col_name].col_function])) { return;}
    check_dependency_bulk(col_name,report_args,report_args.dynamic_cols);
    //
    //
    var report = document.getElementById(report_args.report_id)
    var start_date = CONSTANTS.FIRST_BUSINESS_DAY.join('-');
    var end_date = report_args['to_ts'].split(' ')[0];
    var colspan = report_args.meta_data.length - report_args.skip_cols.length;
    var sql_args = {
        'cmd' : 'SELECT',
        'table' : 'employee_data',
        'cols' : ['SUM(employee_data_freight_backhaul.total_savings) total_savings'],
        'inner_join' : [['employee_data_freight_backhaul','employee_data.entry_id','employee_data_freight_backhaul.entry_id']],
        'where' : [['employee_data.date','BETWEEN',start_date+"' AND '"+end_date],
                   ['entry_status','LIKE','submitted']
                  ]
    }
    var sql = gen_sql(sql_args);
    //
    var callback = function(response) {
        //
        // defining the savings cell inner html
        var value = response[0][0]['total_savings'];
        //
        // setting up child arrays
        var row = document.createElementWithAttr('TR',{'id' : 'freight-logistics-ytd-savings'});
        var space_td  = document.createElementWithAttr('TD',{'id':'report-spacer-td-ytds','class':'report-spacer-td'});
        var lbl_td = document.createElementWithAttr('TD',{'id':'savings-label-td','colSpan':report_args.skip_cols.length,'class':'report-data-td'}) 
        var num_td = document.createElementWithAttr('TD',{'id':'ytd-savings','class':'report-data-td','colSpan':colspan});
        var span = document.createElement('SPAN')
        //
        // creating child nodes
        lbl_td.style['font-weight'] = 'bold';
        lbl_td.addTextNode('Total Year to Date Savings:');
        //
        process_data_type(value,'float',span,{'format_str':'$\u00A0%value%'});
        span.style['display'] = 'inline-block';
        span.style['width'] = '100%';
        span.style['font-weight'] = 'bold';
        span.style['text-align'] = 'center';
        num_td.appendChild(span);
        //
        row.addNodes([space_td,lbl_td,num_td]);
        report.appendChild(row);
    }
    ajax_fetch([sql],[0],callback);
    //
    report_args.called_funs[report_args.dynamic_cols[col_name].col_function] = true;
}
//
////////////////////////////////////////////////////////////////////////////////
//////////////                General Employee Functions             ///////////
////////////////////////////////////////////////////////////////////////////////
//
//
// this function properly recalculates the required general totals
function recalc_general_totals(col_name,report_args) {
    //
    var args = {
        'meta_data' : report_args.col_name_meta,
        'data' : report_args.data,
        'section_ids' : report_args.section_ids
    }
    //
    // setting array of column args
    var cols = {
        'avg_hourly_rate' : {'numerator_col' : 'total', 'divisor_col' : 'hours'}
    };
    //
    // recalculating columns
    for (var output_col in cols) {
        args['output_col'] = output_col;
        args['numerator_col'] = cols[output_col]['numerator_col'];
        args['divisor_col'] = cols[output_col]['divisor_col'];
        recalc_totals(args)
    }
}
//
////////////////////////////////////////////////////////////////////////////////
//////////////              Warehouse Receiving Functions            ///////////
////////////////////////////////////////////////////////////////////////////////
//
// this calculates the incentive pay for warehouse receiving
// it assumes a valid pay period was the time range selected
function calc_receiving_incentive(col_name,report_args) {
    //
    if (report_args.called_funs.hasOwnProperty([report_args.dynamic_cols[col_name].col_function])) { return;}
    check_dependency_bulk(col_name,report_args,report_args.dynamic_cols);
    //
    // creating the incentive pay object
    var crewSize = parseInt(document.getElementById('crew-size').value);
    var incentive_pay = {
        'level_1' : {'maxOTP': 0.00, 'minMPH': 18.00, 'rec_perc': 0.75, 'move_rate': 0.25},
        'level_2' : {'maxOTP': 0.05, 'minMPH': 17.00, 'rec_perc': 0.55, 'move_rate': 0.25},
        'level_3' : {'maxOTP': 0.10, 'minMPH': 16.00, 'rec_perc': 0.35, 'move_rate': 0.25},
        'level_4' : {'maxOTP': 0.15, 'minMPH': 15.00, 'rec_perc': 0.15, 'move_rate': 0.25},
        'level_Z' : {'maxOTP': 1.00, 'minMPH':  0.00, 'rec_perc': 0.00, 'move_rate': 0.00}
    }
    //
    // creating a new data array to preserve order of original but still update objects
    var data_arr = [];
    for (var i = 0; i < report_args.data.length; i++) {
        data_arr[i] = report_args.data[i]
    }
    //
    // sorting report data by date
    data_arr.sort(function(a, b) {
            var d1 = new Date(a.date);
            var d2 = new Date(b.date);
            return (d1 - d2);
    });
    //
    // calculating weekly incentive for each employee
    var weekHours = 0.0;
    var weekProdTime = 0.0;
    var weekOvertime = 0.0;
    var weekMoves = 0;
    var startIndex = 0;
    var entry_date = new Date(data_arr[0].date.split('-')[0],data_arr[0].date.split('-')[1]-1,data_arr[0].date.split('-')[2]);
    var exit_date = new Date(entry_date.getFullYear(),entry_date.getMonth(),(entry_date.getDate()+6-entry_date.getDay()));
    for (var i = 0; i < data_arr.length; i++) {
        entry_date = new Date(data_arr[i].date.split('-')[0],(data_arr[i].date.split('-')[1]-1),data_arr[i].date.split('-')[2]);
        //
        // outputting incentive data if a sunday is crossed
        if (entry_date > exit_date) {
            outputIncentive()
            //
            // resetting weekly totals
            weekHours = 0.0;
            weekProdTime = 0.0;
            weekOvertime = 0.0;
            weekMoves = 0.0;
            startIndex = i;
            exit_date = new Date(entry_date.getFullYear(),entry_date.getMonth(),(entry_date.getDate()+6-entry_date.getDay()) );
        }
        weekHours += Number.parse(data_arr[i].true_hours);
        weekProdTime += Number.parse(data_arr[i].prod_time)
        weekOvertime += Number.parse(data_arr[i].dailyOT);
        weekMoves += Number.parse(data_arr[i].total_moves);
    }
    outputIncentive();
    //
    report_args.called_funs[report_args.dynamic_cols[col_name].col_function] = true;
    //
    // local function to ouput incentive pay for employees
    function outputIncentive() {
        //
        // determine incentive level
        var weekOTP = floor(weekOvertime/weekHours,2);
        var weekMph = ceiling(weekMoves/weekProdTime,2);
        for (var level in incentive_pay) {
            level = incentive_pay[level];
            if ((weekOTP <= level.maxOTP) && (weekMph >= level.minMPH)) {break;}
        }
        var weekIncentive = weekMoves * level.rec_perc * level.move_rate;
        var workerIncentive = ceiling(weekIncentive/crewSize,2);
        var dailyIncentive = workerIncentive/5.0;
        //
        // outputting stuff for current week
        for (var j = startIndex; j < i; j++) {
            var di = dailyIncentive
            var date = new Date(data_arr[j].date.split('-')[0],(data_arr[j].date.split('-')[1]-1),data_arr[j].date.split('-')[2]);
            if (date.getDay() > 5) { di = 0.0;}
            if (data_arr[j].error_code != '0') { di = 0.0;}
            if (data_arr[j].attendance_error != 'none') { di = 0.0}
            data_arr[j][col_name] = di;
            data_arr[j]['total'] = Number.parse(data_arr[j]['total']) + data_arr[j][col_name];
        }
    }
}
//
function calc_cost_per_move(col_name,data_row,dynamic_cols) {
    //
    check_dependency_regular(col_name,data_row,dynamic_cols);
    //
    data_row[col_name] = (+data_row['total'])/(+data_row['total_moves']);
    if (!(isFinite(data_row[col_name]))) {data_row[col_name] = 0.0;}
}
function calc_cost_per_unit(col_name,data_row,dynamic_cols) {
    //
    check_dependency_regular(col_name,data_row,dynamic_cols);
    //
    data_row[col_name] = (+data_row['total'])/(+data_row['total_units']);
    if (!(isFinite(data_row[col_name]))) {data_row[col_name] = 0.0;}
}
//
// this function properly recalculates the required receiving totals
function recalc_receiving_totals(col_name,report_args) {
    //
    var args = {
        'meta_data' : report_args.col_name_meta,
        'data' : report_args.data,
        'section_ids' : report_args.section_ids
    }
    //
    // setting array of column args
    var cols = {
        'moves_hour' : {'numerator_col' : 'total_moves', 'divisor_col' : 'prod_time'},
        'units_hour' : {'numerator_col' : 'total_units', 'divisor_col' : 'prod_time'},
        'cost_per_move' : {'numerator_col' : 'total', 'divisor_col' : 'total_moves'},
        'cost_per_case' : {'numerator_col' : 'total', 'divisor_col' : 'total_units'},
        'avg_hourly_rate' : {'numerator_col' : 'total', 'divisor_col' : 'hours'}
    };
    //
    // recalculating columns
    for (var output_col in cols) {
        args['output_col'] = output_col;
        args['numerator_col'] = cols[output_col]['numerator_col'];
        args['divisor_col'] = cols[output_col]['divisor_col'];
        recalc_totals(args)
    }
}
//
////////////////////////////////////////////////////////////////////////////////
//////////////               Warehouse Shipping Functions            ///////////
////////////////////////////////////////////////////////////////////////////////
//
// this calculates the incentive pay for warehouse shipping
function calc_warehouse_incentive(col_name,data_row,dynamic_cols) {
    //
    check_dependency_regular(col_name,data_row,dynamic_cols);
    //
    // calulating value
    var supervisor_id = CONSTANTS.SHIPPING_SUPERVISOR_ID;
    if (data_row['emp_id'] == supervisor_id) { return;}
    //
    data_row[col_name] = Number.parse(data_row['sel_rate'])*Number.parse(data_row['num_cases']);
    if (!(isFinite(data_row[col_name]))) {data_row[col_name] = 0.0;}
}
//
// this calculates the special icentive for james smith
function calc_shipping_supervisor_incentive(col_name,report_args) {
    if (report_args.called_funs.hasOwnProperty([report_args.dynamic_cols[col_name].col_function])) { return;}
    //
    check_dependency_bulk(col_name,report_args,report_args.dynamic_cols);
    //
    var data_arr = [];
    var supervisor_entries = [];
    var error_dates = [];
    var supervisor_id = CONSTANTS.SHIPPING_SUPERVISOR_ID;
    var total_cases = 0;
    var total_hours = 0;
    var case_bonus = 0.005;
    var total_bonus = 0.0;
    var bonus_per_entry = 0.0;
    //
    // creating a new data array to preserve order of original but still update objects
    for (var i = 0; i < report_args.data.length; i++) {
        data_arr[i] = report_args.data[i]
    }
    //
    // sorting report data by date
    data_arr.sort(function(a, b) {
            var d1 = new Date(a.date);
            var d2 = new Date(b.date);
            return (d1 - d2);
    });
    //
    // stepping over all of the entries to determine if the supervisor gets an incentive for a given week
    var exit_date = new Date(data_arr[0].date.split('-')[0],data_arr[0].date.split('-')[1]-1,data_arr[0].date.split('-')[2]);;
    //
    for (var i = 0; i < data_arr.length; i++) {
        var entry_date = new Date(data_arr[i].date.split('-')[0],data_arr[i].date.split('-')[1]-1,data_arr[i].date.split('-')[2]);
        data_arr[i]['incentive_pay'] = 0.0
        //
        //
        // outputting incentive if the day changes
        if (entry_date > exit_date) {
            outputIncentive()
            //
            // resetting weekly totals
            supervisor_entries = [];
            error_dates = [];
            total_hours = 0;
            total_cases = 0;
            total_bonus = 0.0;
            bonus_per_entry = 0.0;
            exit_date = entry_date;
        }
        //
        if (data_arr[i]['emp_id'] == supervisor_id) { 
            supervisor_entries.push(i);
            if (data_arr[i]['attendance_error'] != 'none') { error_dates.push(data_arr[i]['date']);}
        }
        total_cases += Number.parse(data_arr[i]['num_cases']);
        total_hours += Number.parse(data_arr[i]['prod_time']);
        if (data_arr[i]['error_code'] != '0') { error_dates.push(data_arr[i]['date']);}
    }
    outputIncentive()
    //
    // local function to output incentive pay for the supervisor
    function outputIncentive() {
        //
        total_bonus = ceiling(case_bonus * total_cases,2);
        if (total_cases/total_hours < 100) { total_bonus = 0.0;}
        if (!(isFinite(total_bonus))) { total_bonus = 0.0;}
        //
        // putting smiths bonus in the incentive field
        for (var i = 0; i < supervisor_entries.length; i++) {
            bonus_per_entry = total_bonus/supervisor_entries.length
            if (error_dates.indexOf(data_arr[supervisor_entries[i]]['date']) > -1) { bonus_per_entry = 0.0;}
            data_arr[supervisor_entries[i]]['sel_rate'] = 0.0;
            data_arr[supervisor_entries[i]]['incentive_pay'] = bonus_per_entry;
            data_arr[supervisor_entries[i]]['total'] = Number.parse(data_arr[supervisor_entries[i]]['total']) +  bonus_per_entry
        }
    }
    //
    report_args.called_funs[report_args.dynamic_cols[col_name].col_function] = true;  
}
//
// this function properly recalculates the required shipping totals
function recalc_shipping_totals(col_name,report_args) {
    //
    var args = {
        'meta_data' : report_args.col_name_meta,
        'data' : report_args.data,
        'section_ids' : report_args.section_ids
    }
    //
    // setting array of column args
    var cols = {
        'cases_hr' : {'numerator_col' : 'num_cases', 'divisor_col' : 'prod_time'},
        'cost_per_case' : {'numerator_col' : 'total', 'divisor_col' : 'num_cases'},
        'avg_hourly_rate' : {'numerator_col' : 'total', 'divisor_col' : 'hours'}
    };
    //
    // recalculating columns
    for (var output_col in cols) {
        args['output_col'] = output_col;
        args['numerator_col'] = cols[output_col]['numerator_col'];
        args['divisor_col'] = cols[output_col]['divisor_col'];
        recalc_totals(args)
    }
}
////////////////////////////////////////////////////////////////////////////////
//////////////              Sales Rep Report Functions               ///////////
////////////////////////////////////////////////////////////////////////////////
//
//
function calc_dso(col_name,report_args) {
    if (report_args.called_funs.hasOwnProperty([report_args.dynamic_cols[col_name].col_function])) { return;}
    //
    check_dependency_bulk(col_name,report_args,report_args.dynamic_cols);
    //
    var data = report_args.rep_data;
    for (var i = 0; i < data.length; i++) {
        var dso = 0.0
        dso = data[i]['total_ar']/data[i]['total_ar_sales'];
        if (!(isFinite(dso))) { dso = 0.0;}
        data[i]['dso'] = dso;
    }  
    //
    report_args.called_funs[report_args.dynamic_cols[col_name].col_function] = true; 
}
//
//
function calc_credit_percentage(col_name,report_args) {
    if (report_args.called_funs.hasOwnProperty([report_args.dynamic_cols[col_name].col_function])) { return;}
    //
    check_dependency_bulk(col_name,report_args,report_args.dynamic_cols);
    //
    var data = report_args.rep_data;
    for (var i = 0; i < data.length; i++) {
        var perc_credits = 0.0
        perc_credits = -data[i]['total_credits']/data[i]['total_sales'];
        perc_credits = floor(perc_credits,3)
        if (!(isFinite(perc_credits))) { perc_credits = 0.0;}
        data[i]['percent_credits'] = perc_credits;
    }
    //
    report_args.called_funs[report_args.dynamic_cols[col_name].col_function] = true; 
}
//
//
function calc_profit_margin(col_name,report_args) {
    if (report_args.called_funs.hasOwnProperty([report_args.dynamic_cols[col_name].col_function])) { return;}
    //
    check_dependency_bulk(col_name,report_args,report_args.dynamic_cols);
    //
    var data = report_args.rep_data;
    for (var i = 0; i < data.length; i++) {
        var profit_margin = 0.0
        profit_margin = data[i]['profit']/data[i]['total_sales'];
        if (!(isFinite(profit_margin))) { profit_margin = 0.0;}
        data[i]['profit_margin'] = profit_margin;
    }
    //
    report_args.called_funs[report_args.dynamic_cols[col_name].col_function] = true; 
}
//
//
function calc_base_commission(col_name,report_args) {
    if (report_args.called_funs.hasOwnProperty([report_args.dynamic_cols[col_name].col_function])) { return;}
    //
    check_dependency_bulk(col_name,report_args,report_args.dynamic_cols);
    //
    var data = report_args.rep_data;
    for (var i = 0; i < data.length; i++) {
        var base_comm = 0.0
        base_comm = data[i]['profit']*0.16;
        if (!(isFinite(base_comm))) { base_comm = 0.0;}
        data[i]['base_commission'] = base_comm;
    }
    //
    report_args.called_funs[report_args.dynamic_cols[col_name].col_function] = true; 
}
//
//
function calc_growth(col_name,report_args) {
    if (report_args.called_funs.hasOwnProperty([report_args.dynamic_cols[col_name].col_function])) { return;}
    //
    check_dependency_bulk(col_name,report_args,report_args.dynamic_cols);
    //
    var data = report_args.rep_data;
    for (var i = 0; i < data.length; i++) {
        var growth = 0.0
        growth = data[i]['ytd_total']/data[i]['lytd_total'] - 1.0; 
        if (!(isFinite(growth))) { growth = 0.0;}
        data[i]['growth'] = growth;
    }
    //
    report_args.called_funs[report_args.dynamic_cols[col_name].col_function] = true; 
}
//
//
function calc_total_commission(col_name,report_args) {
    if (report_args.called_funs.hasOwnProperty([report_args.dynamic_cols[col_name].col_function])) { return;}
    //
    check_dependency_bulk(col_name,report_args,report_args.dynamic_cols);
    //
    //
    var data = report_args.rep_data;
    for (var i = 0; i < data.length; i++) {
        var total_comm = data[i]['base_commission']; 
        var profit = Number.parse(data[i]['profit']);
        //
        // growth bonuses
        if (data[i]['growth'] >= 0.049) { total_comm += profit*0.01;}
        if (data[i]['growth'] >= 0.10) { total_comm += profit*0.01;}
        //
        // DSO bonus
        if (data[i]['dso'] <= 0.20) { total_comm += profit*0.0075;}
        //
        // credits bonus
        if (data[i]['percent_credits'] <= 0.01) { total_comm += profit*0.0075;}
        //
        if (!(isFinite(total_comm))) { total_comm = 0.0;}
        data[i]['total_commission'] = total_comm;
    }
    //
    report_args.called_funs[report_args.dynamic_cols[col_name].col_function] = true; 
}