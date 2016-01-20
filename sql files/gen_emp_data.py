# Python 3.3.2 (v3.3.2:d047928ae3f6, May 13 2013, 13:52:24) 
# [GCC 4.2.1 (Apple Inc. build 5666) (dot 3)] on darwin

import datetime
import re
from random import randint
from math import floor

#
# class to store attributes of an employee
class employee:
    def __init__(self,emp_id,first_name,middle_name,last_name,department):
        self.emp_id = emp_id
        self.first_name = first_name
        self.middle_name = middle_name
        self.last_name = last_name
        self.department = department
        self.base_rate_level = 0
        self.case_rate_level = 0
        self.stop_rate_level = 0
#
# opens the employee info file and adds them to the employee dictionary
def load_emp_info(file_name,emp_dict):
    file = open(file_name,'r')
    content = file.read()
    file.close()
    data_arr = content.split('\n')
    data_arr = list(filter(None,data_arr))
    for i in range(len(data_arr)):
        data_line = re.sub('"','',data_arr[i])
        data_line = data_line.split(',')
        emp_dict[data_line[0]] =  employee(data_line[0],data_line[1],data_line[2],data_line[3],data_line[4])
        emp_dict[data_line[0]].base_rate_level = float(int(data_line[6]))
        emp_dict[data_line[0]].case_rate_level = float(int(data_line[7]))
        emp_dict[data_line[0]].stop_rate_level = float(int(data_line[8]))

#
#
def calc_trans_pay(emp,routes,stops,cases,ovn,pre_post):
    #
    base_rate_arr = [192, 180, 160]
    #
    case_rate = 0.04 - 0.01*emp.case_rate_level
    stop_rate = 1.25 - 0.25*emp.stop_rate_level
    base_rate = base_rate_arr[int(emp.base_rate_level) - 1]
    tot_pay = 0
    #
    if (ovn == 'Y'):
        base_rate = base_rate*2
        tot_pay = 15 + 10*(4 - emp.base_rate_level)
    #
    if (pre_post == 'Y'):
        pre_post = 1
    else:
        pre_post = 0
    #
    tot_pay += (base_rate*routes) + (case_rate*cases) + (stop_rate*stops) + (7*pre_post);
    return(tot_pay)

#
#
def calc_sel_rate(area,cases_hr,err):
    #
    level = 0
    if (err != 'NULL'):
        sel_rate = 0.03
    else:
        if (area == 'dry'):
            level = floor((cases_hr-125)/20+1)
            if (cases_hr >= 180):
                level = 4.0
        elif (area == 'cooler'):
            level = floor((cases_hr-130)/20+1)
            if (cases_hr >= 185):
                level = 4.0
        elif (area == 'freezer'):
            level = floor((cases_hr-135)/20+1)
            if (cases_hr >= 190):
                level = 4.0
        #
        if (level < 1):
            level = 1.0
        #
        sel_rate = 0.02 + level/100
    #
    return(sel_rate)

#
#
def create_recv_data(emp_dict,start_date,end_date):
    #
    # generation ranges 
    st_time = "6:00"
    en_time = "14:30"
    hours = 8.5
    entry_time = " 00:00:00"
    entering_user = "python"
    comments = "auto-gen-round2"
    do = True
    #
    #col names and order
    # emp_i,emp_first_name,emp_last_name,date,st_time,en_time,hours,indirect,prod_time,letdowns,putaways,restocks,receiving,counts,total,move_hour,units_hour,comments,entering_user,department
    sql = "INSERT INTO `recv_employee_data`(`emp_id`, `emp_first_name`, `emp_last_name`, `date`, `start_time`, `end_time`, `hours`, `indirect`, `prod_time`, `letdowns_moves`, `letdowns_units`, `putaways_moves`, `putaways_units`, `restocks_moves`, `restocks_units`, `receiving_moves`, `receiving_units`, `counts_moves`, `counts_units`, `total_moves`, `total_units`, `moves_hour`, `units_hour`, `comments`, `entering_user`, `department`) VALUES "
    year = start_date[0]
    mon = start_date[1]
    day = start_date[2]
    curr_date = datetime.datetime(year,mon,day)
    while (do == True): 
        #
        print(curr_date)
        if ((datetime.datetime(last_date[0],last_date[1],last_date[2]) - curr_date).total_seconds() <= 0):
            do = False
            break
        elif (curr_date.weekday() > 4):
            curr_date += datetime.timedelta(days=1)
            continue
        #
        year = curr_date.year
        mon = curr_date.month
        day = curr_date.day
        #
        for key in emp_dict:
            emp = emp_dict[key]
            if (emp.department != 'receiving'):
                continue
            indirect = randint(30,180)
            prod_time = hours - float(indirect)/60.0
            prod_time = "{:.3f}".format(prod_time) 
            sql += "("+str(emp.emp_id)+",'"+emp.first_name+"','"+emp.last_name+"','"+str(year)+"-"+str(mon)+"-"+str(day)+entry_time+"','"+st_time+"','"+en_time+"','"+str(hours)+"','"+str(indirect)+"','"+prod_time+"',"
            total_moves = 0
            total_units = 0
            for act in ['letdowns','putaways','restocks','receiving','counts']:
                moves = randint(0,15)
                units = randint(50,225)*moves
                total_moves += moves
                total_units += units
                sql += str(moves)+","+str(units)+","
            moves_hour = "{:.3f}".format(total_moves/float(prod_time))
            units_hour = "{:.3f}".format(total_units/float(prod_time))
            sql += str(total_moves)+","+str(total_units)+","+moves_hour+","+units_hour+",'"+comments+"','"+entering_user+"','"+emp.department+"'),"+'\n'        
        #
        # incrementing curr_date
        curr_date += datetime.timedelta(days=1)
    # End while loop
    #
    sql = re.sub(',\n$',';',sql)
    return(sql)
    
#
# 
def create_tran_data(emp_dict,start_date,last_date):
    #
    # generation ranges 
    st_time = "2:00"
    en_time = "12:30"
    hours = 8.5
    entry_time = " 00:00:00"
    entering_user = "python"
    comments = "auto-gen-round2"
    do = True
    #
    #col names and order
    sql = "INSERT INTO `tran_employee_data`(`emp_id`, `emp_first_name`, `emp_last_name`, `date`, `base_rate_level`, `case_rate_level`, `stop_rate_level`, `over_night`, `start_time`, `end_time`, `hours`, `miles`, `num_routes`, `num_stops`, `num_cases`, `pre_post_inspection`, `error_code`, `total`, `comments`, `entering_user`, `department`) VALUES "
    year = start_date[0]
    mon = start_date[1]
    day = start_date[2]
    curr_date = datetime.datetime(year,mon,day)
    while (do == True): 
        #
        print(curr_date)
        if ((datetime.datetime(last_date[0],last_date[1],last_date[2]) - curr_date).total_seconds() <= 0):
            do = False
            break
        elif (curr_date.weekday() > 4):
            curr_date += datetime.timedelta(days=1)
            continue
        #
        year = curr_date.year
        mon = curr_date.month
        day = curr_date.day
        #
        for key in emp_dict:
            emp = emp_dict[key]
            if (emp.department != 'transportation'):
                continue     
            sql += "("+str(emp.emp_id)+",'"+emp.first_name+"','"+emp.last_name+"','"+str(year)+"-"+str(mon)+"-"+str(day)+entry_time+"',"+str(emp.base_rate_level)+","+str(emp.case_rate_level)+","+str(emp.stop_rate_level)+",'N','"+st_time+"','"+en_time+"',"+str(hours)+","
            miles = randint(750,1500)
            routes = randint(2,9)
            stops = randint(7,15)
            cases = randint(1000,2500)
            pre_post = 'Y'
            err = [5,9,17]
            err_code = "NULL"
            e = randint(1,40)
            if (e in err):
                err_code = e
            total = calc_trans_pay(emp,routes,stops,cases,'N',pre_post)
            #
            sql += str(miles)+","+str(routes)+","+str(stops)+","+str(cases)+",'"+pre_post+"',"+str(err_code)+","+str(total)+",'"+comments+"','"+entering_user+"','"+emp.department+"'),\n"
        #
        # incrementing curr_date
        curr_date += datetime.timedelta(days=1)
    # End while loop
    #
    sql = re.sub(',\n$',';',sql)
    return(sql)

#
#
def create_ware_data(emp_dict,start_date,last_date):
    #
    # generation ranges 
    st_time = "5:30"
    en_time = "14:00"
    hours = 8.5
    entry_time = " 00:00:00"
    entering_user = "python"
    comments = "auto-gen-round2"
    area_list = ['dry','cooler','freezer']
    err = [10,16,30,35]
    do = True
    #
    #col names and order
    sql = "INSERT INTO `ware_employee_data`(`emp_id`, `emp_first_name`, `emp_last_name`, `date`, `start_time`, `end_time`, `hours`, `area`, `num_cases`, `error_code`, `cases_hr`, `sel_rate`, `comments`, `entering_user`, `department`) VALUES "
    year = start_date[0]
    mon = start_date[1]
    day = start_date[2]
    curr_date = datetime.datetime(year,mon,day)
    while (do == True): 
        #
        print(curr_date)
        if ((datetime.datetime(last_date[0],last_date[1],last_date[2]) - curr_date).total_seconds() <= 0):
            do = False
            break
        elif (curr_date.weekday() > 4):
            curr_date += datetime.timedelta(days=1)
            continue
        #
        year = curr_date.year
        mon = curr_date.month
        day = curr_date.day
        #
        for key in emp_dict:
            emp = emp_dict[key]
            if (emp.department != 'warehouse'):
                continue     
            sql += "("+str(emp.emp_id)+",'"+emp.first_name+"','"+emp.last_name+"','"+str(year)+"-"+str(mon)+"-"+str(day)+entry_time+"','"+st_time+"','"+en_time+"',"+str(hours)+","
            area = area_list[randint(0,2)] 
            num_cases = randint(1250,1900)
            cases_hour = (num_cases/hours) 
            err_code = "NULL"
            e = randint(1,40)
            if (e in err):
                err_code = e
            sel_rate = calc_sel_rate(area,cases_hour,err_code)
            cases_hour = "{:.3f}".format(cases_hour)
            sel_rate = "{:.3f}".format(sel_rate)
            sql += "'"+area+"',"+str(num_cases)+","+str(err_code)+","+cases_hour+","+sel_rate+",'"+comments+"','"+entering_user+"','"+emp.department+"'),\n"
        #
        # incrementing curr_date
        curr_date += datetime.timedelta(days=1)
    # End while loop
    #
    sql = re.sub(',\n$',';',sql)
    return(sql)

#
# execution of functions
file_name = 'employee_info.csv'
emp_dict = {}
load_emp_info(file_name,emp_dict)
#
start_date = [2014,11,2] # [yyyy,mm,dd]
last_date  = [2014,12,31]
start_str  = '2014-11-02'
last_str   = '2014-12-31'
#
# creating recving data
print('')
sql = create_recv_data(emp_dict,start_date,last_date)
filename = 'afwl_imports/afwl-auto-gen-recv_'+start_str+'_'+last_str+'.sql'
outfile = open(filename,'w')
outfile.write(sql)
outfile.close()
print('Receving done')
print('')
#
# creating transportation data
sql = create_tran_data(emp_dict,start_date,last_date)
filename = 'afwl_imports/afwl-auto-gen-tran_'+start_str+'_'+last_str+'.sql'
outfile = open(filename,'w')
outfile.write(sql)
outfile.close()
print('Transportation done')
print('')
#
# creating warehouse data
sql = create_ware_data(emp_dict,start_date,last_date)
filename = 'afwl_imports/afwl-auto-gen-ware_'+start_str+'_'+last_str+'.sql'
outfile = open(filename,'w')
outfile.write(sql)
outfile.close()
print('Warehouse done')
print('')
