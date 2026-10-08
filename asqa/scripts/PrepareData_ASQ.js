var time_of_day_origin_quota_asq;
var airline_quota_asq;
var dest_quota_asq;

var interview_data_asq;
var today_flight_list_asq;
var this_month_flight_list_asq;
var daily_plan_data_asq;

var currentDate; //dd-mm-yyyy
var currentMonth; //mm
var currentYear;
var currentQuarter; //2023-Q1, 2023-Q2
var nextDate; //dd-mm-yyyy

var currentDateID; //yyyy-mm-dd 
var download_time_asq;

var total_quota_asq = 17000;
var total_completed_asq;
var total_completed_percent_asq;

var total_quota_completed_asq;
var total_hard_quota_asq;

/************************************/
function initCurrentTimeVars_asq() {
  var today = new Date();

  var day = '' + today.getDate();
  var month = '' + (today.getMonth() + 1); //month start from 0;
  var year = today.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  currentDate = [day, month, year].join('-');
  currentDateID = [year, month, day].join('-');

  currentYear = year;
  currentMonth = month; //[month, year].join('-');;
  currentQuarter = getQuarterFromMonth_asq(currentMonth, currentYear);

  //////////
  var tomorrow = new Date();
  tomorrow.setDate(today.getDate()+1);
  var tomorrowMonth = '' + (tomorrow.getMonth() + 1); //month start from 0;
  var tomorrowDay = '' + tomorrow.getDate();
  var tomorrowYear = tomorrow.getFullYear();

  if (tomorrowMonth.length < 2) tomorrowMonth = '0' + tomorrowMonth;
  if (tomorrowDay.length < 2) tomorrowDay = '0' + tomorrowDay;

  nextDate  = [tomorrowDay, tomorrowMonth, tomorrowYear].join('-');
  //////////
  if (document.getElementById('year_month') && document.getElementById('year_month').value.length > 0)
  {
    if (document.getElementById('year_month').value != "current-quarter")
    {
      currentQuarter = document.getElementById('year_month').value;
    }
  }
 
  switch(currentQuarter) {
    case "2026-Q3":       
    case "2026-Q4":           
      total_quota_asq = 600;
      break;   

      
    default:
      total_quota_asq = 600;
      break;
  }
}

function getQuarterFromMonth_asq(month, year)
{
  //Input: mm, yyyy
  var quarter = 0;
  
  if ((month == '01') || (month == '02') || (month == '03')) {
    quarter = "Q1";  
  }
  else if ((month == '04') || (month == '05') || (month == '06')) {
    quarter = "Q2";  
  }
  else if ((month == '07') || (month == '08') || (month == '09')) {
    quarter = "Q3";  
  }
  else if ((month == '10') || (month == '11') || (month == '12')) {
    quarter = "Q4";  
  }
  return (year + "-" + quarter);
}

function notDeparted_asq(flight_time) {
  var current_time = new Date().toLocaleString('en-US', { timeZone: 'Europe/Berlin', hour12: false});
  //15:13:27
  var current_time_value  = current_time.substring(current_time.length-8,current_time.length-6) * 60;
  current_time_value += current_time.substring(current_time.length-5,current_time.length-3)*1;

  //Time: 0805    
  var flight_time_value = flight_time.substring(0,2) * 60 + flight_time.substring(2,4)*1;

  var result = (flight_time_value > current_time_value);
  return (result);
}

function prepareInterviewData_asq() {
  var time_of_day_origin_quota_asq_temp = JSON.parse(Time_of_Day_Origin_quota_ASQ);
  // var airline_quota_asq_temp = JSON.parse(Airline_quota_ASQ);
  // var dest_quota_asq_temp = JSON.parse(Dest_quota_ASQ);
  var airline_quota_asq_temp = [];
  var dest_quota_asq_temp = [];
  
  var interview_data_asq_temp  = JSON.parse(interview_statistics_asq);
  var flight_list_temp  = JSON.parse(Arrivals_Flight_List_Raw);
    
  initCurrentTimeVars_asq();	
  
  //get quota data
  time_of_day_origin_quota_asq = [];
  time_of_day_origin_quota_asq.length = 0;
  for (i = 0; i < time_of_day_origin_quota_asq_temp.length; i++) {
    if (time_of_day_origin_quota_asq_temp[i].Quarter == currentQuarter)
    {
      if (time_of_day_origin_quota_asq_temp[i].Quota >=1) //BSL: >=2, not >=4 
      {
        time_of_day_origin_quota_asq.push(time_of_day_origin_quota_asq_temp[i]);
      }
    }
  }
  
  airline_quota_asq = [];
  airline_quota_asq.length = 0;
  for (i = 0; i < airline_quota_asq_temp.length; i++) {
    if (airline_quota_asq_temp[i].Quarter == currentQuarter)
    {
      airline_quota_asq.push(airline_quota_asq_temp[i]);
    }
  }

  dest_quota_asq = [];
  dest_quota_asq.length = 0;
  for (i = 0; i < dest_quota_asq_temp.length; i++) {
    if (dest_quota_asq_temp[i].Quarter == currentQuarter)
    {
      dest_quota_asq.push(dest_quota_asq_temp[i]);
    }
  }

  //get relevant interview data
  //empty the list
  interview_data_asq = [];
  interview_data_asq.length = 0;

  download_time_asq = interview_data_asq_temp[0].download_time;
  for (i = 0; i < interview_data_asq_temp.length; i++) {
    var interview = interview_data_asq_temp[i];
    //only get complete interview & not test
    var interview_year = interview["InterviewDate"].substring(0,4);
    var interview_month = interview["InterviewDate"].substring(5,7);//"2023-04-03 06:18:18"

    var interview_quarter = getQuarterFromMonth_asq(interview_month, interview_year);

    if ((currentQuarter == interview_quarter))
    {
      interview.InterviewEndDate = interview.InterviewDate;
      interview.Dest = interview.quota_id.slice(-3);
      interview.Time_of_Day_Origin = interview.quota_id;
      interview.Completed_of_interviews = interview["Number of interviews"];

 
      interview_data_asq.push(interview);
    }
  }
  
  //prepare flight list
  //empty the list
  today_flight_list_asq = [];
  today_flight_list_asq.length = 0;
  
  this_month_flight_list_asq  = [];
  this_month_flight_list_asq.length = 0;
  
  for (i = 0; i < flight_list_temp.length; i++) {
    let flight = flight_list_temp[i];

    //for sorting: YYYY-MM-DD
    flight.DateTimeID = flight.Date.substring(6,10) +  flight.Date.substring(3,5) +  flight.Date.substring(0,2) + flight.Time;
    flight.DateID = flight.Date.substring(6,10) + "-" + flight.Date.substring(3,5) + "-" +  flight.Date.substring(0,2);

    flight.Date_Time = flight.Time;

    //currentMonth: 02-2023
    //flight.Date: 08-02-2023
    var day_of_month = parseInt(flight.Date.substring(0,2));
    if ((is_the_last_month_of_Quarter_asq() && day_of_month <=22) //from 2025 Q1, the last day is 22nd
    || !is_the_last_month_of_Quarter_asq())
    { 
      if (currentQuarter ==  getQuarterFromMonth_asq(flight.Date.substring(3,5), flight.Date.substring(6,10))) 
      { 
        this_month_flight_list_asq.push(flight);
      }	
      
      //only get today & not departed flight
      if (((currentDateID == flight.DateID) && notDeparted_asq(flight.Time))
          || (flight.DateID >= currentDateID)
        )
      { 
        flight.Date_Time = flight.Date.substring(6,10) + flight.Date.substring(3,5) + flight.Date.substring(0,2) + flight.Time;
        //flight.Date_Time = flight.Time;
        today_flight_list_asq.push(flight);
      }
    }			   
  }
  
    //add quota data
    //empty the list
  daily_plan_data_asq = [];
  daily_plan_data_asq.length = 0;
  
  for (i = 0; i < today_flight_list_asq.length; i++) {
    let flight = today_flight_list_asq[i];

    for (j = 0; j < time_of_day_origin_quota_asq.length; j++) {
      let quota = time_of_day_origin_quota_asq[j];
      if ((quota.Time_of_Day_Origin == flight.Time_of_Day_Origin) )
      {
        flight.Quota = quota.Quota;
       }
    }
    
    for (j = 0; j < airline_quota_asq.length; j++) {
      let quota = airline_quota_asq[j];
      if ((quota.Airline == flight.AirlineCode))
      {
        flight.Airline_Quota = quota.Quota;
       }
    }

    for (j = 0; j < dest_quota_asq.length; j++) {
      let quota = dest_quota_asq[j];
      if ((quota.Dest == flight.Dest))
      {
        flight.Dest_Quota = quota.Quota;
       }
    }

    if (flight.Quota>0) {
      //special for BER
      var hide_routes = ["99-999"];

      var hide_dest = ["999"];

      if (!hide_routes.includes(flight.AirlineCode + "-" + flight.Dest))
      {
       if (!hide_dest.includes(flight.Dest)) // from 2026-Q1
        {
          //if (flight.Dest == "AGP")  // testing
          daily_plan_data_asq.push(flight);
        }
      }
    }
  }
}