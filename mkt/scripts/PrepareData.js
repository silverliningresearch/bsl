var quota_data;
var interview_data;
var today_flight_list;
var this_month_flight_list;
var daily_plan_data;
var removed_ids_data;

var currentDate; //dd-mm-yyyy
var currentMonth; //mm
var currentYear;
var currentQuarter; //2023-Q1, 2023-Q2
var nextDate; //dd-mm-yyyy

var download_time;

var total_quota = 17000;
var total_completed;
var total_completed_percent;

var total_quota_completed;
var total_hard_quota;

var less_than_2_flights_list;
var less_than_6_flights_list;

const routes_mapping = [
  { flight: "DS-ACE", aci: "U2-ACE" },
  { flight: "DS-AGA", aci: "U2-AGA" },
  { flight: "EC-AGP", aci: "U2-AGP" },
  { flight: "DS-AJA", aci: "U2-AJA" },
  { flight: "EC-ALC", aci: "U2-ALC" },
  { flight: "DS-ATH", aci: "U2-ATH" },
  { flight: "DS-AYT", aci: "U2-AYT" },
  { flight: "EC-BCN", aci: "U2-BCN" },
  { flight: "DS-BDS", aci: "U2-BDS" },
  { flight: "EC-BER", aci: "U2-BER" },
  { flight: "DS-BER", aci: "U2-BER" },
  { flight: "EC-BIA", aci: "U2-BIA" },
  { flight: "DS-BIA", aci: "U2-BIA" },
  { flight: "DS-BIO", aci: "U2-BIO" },
  { flight: "DS-BIQ", aci: "U2-BIQ" },
  { flight: "DS-BOD", aci: "U2-BOD" },
  { flight: "EC-BOD", aci: "U2-BOD" },
  { flight: "DS-BRI", aci: "U2-BRI" },
  { flight: "DS-BUD", aci: "U2-BUD" },
  { flight: "DS-CAG", aci: "U2-CAG" },
  { flight: "DS-CFU", aci: "U2-CFU" },
  { flight: "EC-CHQ", aci: "U2-CHQ" },
  { flight: "DS-CHQ", aci: "U2-CHQ" },
  { flight: "DS-CPH", aci: "U2-CPH" },
  { flight: "DS-CTA", aci: "U2-CTA" },
  { flight: "DS-DJE", aci: "U2-DJE" },

  { flight: "DS-EDI", aci: "U2-EDI" },
  { flight: "U2-EDI", aci: "U2-EDI" },

  { flight: "EC-FAO", aci: "U2-FAO" },
  { flight: "DS-FAO", aci: "U2-FAO" },
  { flight: "DS-FCO", aci: "U2-FCO" },
  { flight: "EC-FCO", aci: "U2-FCO" },
  { flight: "DS-FNC", aci: "U2-FNC" },
  { flight: "DS-FUE", aci: "U2-FUE" },
  { flight: "DS-HAM", aci: "U2-HAM" },
  { flight: "DS-HER", aci: "U2-HER" },
  { flight: "DS-HRG", aci: "U2-HRG" },
  { flight: "EC-IBZ", aci: "U2-IBZ" },
  { flight: "DS-KEF", aci: "U2-KEF" },
  { flight: "DS-KGS", aci: "U2-KGS" },
  { flight: "DS-KRK", aci: "U2-KRK" },
  { flight: "DS-LCA", aci: "U2-LCA" },
  { flight: "EC-LIS", aci: "U2-LIS" },
  { flight: "DS-LIS", aci: "U2-LIS" },
  { flight: "DS-LPA", aci: "U2-LPA" },
  { flight: "EC-MAD", aci: "U2-MAD" },
  { flight: "EC-MAH", aci: "U2-MAH" },
  { flight: "DS-MAH", aci: "U2-MAH" },
  { flight: "DS-MLA", aci: "U2-MLA" },
  { flight: "DS-MPL", aci: "U2-MPL" },
  { flight: "EC-NAP", aci: "U2-NAP" },
  { flight: "DS-NBE", aci: "U2-NBE" },
  { flight: "EC-NCE", aci: "U2-NCE" },
  { flight: "DS-NCE", aci: "U2-NCE" },
  { flight: "EC-NTE", aci: "U2-NTE" },
  { flight: "DS-NTE", aci: "U2-NTE" },
  { flight: "DS-OLB", aci: "U2-OLB" },
  { flight: "EC-OPO", aci: "U2-OPO" },
  { flight: "DS-OPO", aci: "U2-OPO" },
  { flight: "EC-PMI", aci: "U2-PMI" },
  { flight: "DS-PMO", aci: "U2-PMO" },
  { flight: "EC-PRG", aci: "U2-PRG" },
  { flight: "IV-PRN", aci: "GPX-PRN" },
  { flight: "DS-PRN", aci: "U2-PRN" },
  { flight: "DS-PUY", aci: "U2-PUY" },
  { flight: "DS-RAK", aci: "U2-RAK" },
  { flight: "DS-RHO", aci: "U2-RHO" },
  { flight: "DS-RMI", aci: "U2-RMI" },
  { flight: "EC-SCQ", aci: "U2-SCQ" },
  { flight: "DS-SKG", aci: "U2-SKG" },
  { flight: "DS-SPC", aci: "U2-SPC" },
  { flight: "DS-SPU", aci: "U2-SPU" },
  { flight: "EC-SPU", aci: "U2-SPU" },
  { flight: "DS-SUF", aci: "U2-SUF" },
  { flight: "EC-SVQ", aci: "U2-SVQ" },
  { flight: "EC-TFS", aci: "U2-TFS" },
  { flight: "DS-TLS", aci: "U2-TLS" },
  { flight: "DS-TNG", aci: "U2-TNG" },
  { flight: "DS-VCE", aci: "U2-VCE" },
  { flight: "DS-VIE", aci: "U2-VIE" },
  { flight: "DS-VLC", aci: "U2-VLC" }
];

// If applying to a single string value (like a survey variable):
// const mappedValue = replacements.reduce((current, item) => current.replaceAll(item.flight, item.replace), airlineDestString);

/************************************/
/************************************/
function initCurrentTimeVars() {
  var today = new Date();

  var day = '' + today.getDate();
  var month = '' + (today.getMonth() + 1); //month start from 0;
  var year = today.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  currentDate = [day, month, year].join('-');
  currentYear = year;
  currentMonth = month; //[month, year].join('-');;
  currentQuarter = getQuarterFromMonth(currentMonth, currentYear);

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
    case "2026-Q1":      
        total_quota = 1000;
        break;    

    case "2026-Q2": 
        total_quota = 1500;
        break;         
    case "2026-Q3":       
        total_quota = 2000;
        break;      

    case "2026-Q4":
        total_quota = 1500;
        break;   

    default:
      total_quota = 1000;
      break;
  }
}

function getQuarterFromMonth(month, year)
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

function notDeparted(flight_time) {
  var current_time = new Date().toLocaleString('be-BE', { timeZone: 'Europe/Brussels', hour12: false});
  //15:13:27
  var current_time_value  = current_time.substring(current_time.length-8,current_time.length-6) * 60;
  current_time_value += current_time.substring(current_time.length-5,current_time.length-3)*1;

  //Time: 0805    
  var flight_time_value = flight_time.substring(0,2) * 60 + flight_time.substring(2,4)*1;

  var result = (flight_time_value > current_time_value);
  return (result);
}

function isvalid_id(id)
{
  valid = true;

  var i = 0;
  for (i = 0; i < removed_ids_data.length; i++) 
  { 
    if (removed_ids_data[i].removed_id == id)
    {
      valid = false;
    }
  }
  return valid;
}
function prepareInterviewData() {
  var quota_data_temp = JSON.parse(mkt_airline_dest_quota);
  removed_ids_data = JSON.parse(removed_ids);

  var interview_data_temp  = JSON.parse(destAirlines_statistics);
  var flight_list_temp  = JSON.parse(Departures_Flight_List_Raw);

  initCurrentTimeVars();	
  
  //get quota data
  quota_data = [];
  quota_data.length = 0;
  for (i = 0; i < quota_data_temp.length; i++) {
    if (quota_data_temp[i].Quarter == currentQuarter)
    {
      quota_data_temp[i]["Airline_Dest_in_schedule"] = "";

      // Loop through the array and apply replaceAll for each pair
      for (k = 0; k < routes_mapping.length; k++) {
        if (routes_mapping[k].aci == quota_data_temp[i]["ACI_Quota"]) {
          quota_data_temp[i]["Airline_Dest_in_schedule"] = quota_data_temp[i]["Airline_Dest_in_schedule"] + routes_mapping[k].flight + "; "; 
        }
      }

      if (quota_data_temp[i]["Airline_Dest_in_schedule"] == "")  quota_data_temp[i]["Airline_Dest_in_schedule"] = quota_data_temp[i]["ACI_Quota"];
      quota_data.push(quota_data_temp[i]);
    }
  }
  
  //get relevant interview data
  //empty the list
  interview_data = [];
  interview_data.length = 0;

  download_time = interview_data_temp[0].download_time;
  for (i = 0; i < interview_data_temp.length; i++) {
    var interview = interview_data_temp[i];
    //only get complete interview & not test
    var interview_year = interview["InterviewDate"].substring(0,4);
    var interview_month = interview["InterviewDate"].substring(5,7);//"2023-04-03 06:18:18"
    var interview_quarter = getQuarterFromMonth(interview_month, interview_year);

    if ((currentQuarter == interview_quarter))
    {
      // var Airline_Dest = '"Airline_Dest"' + ":" + '"' +  interview["quota_id"] + '", ';
      // var InterviewEndDate = '"InterviewEndDate"' + ":" + '"' +  interview["InterviewDate"]+ '", ' ;
      // var Completed_of_interviews = '"Completed_of_interviews"' + ":" + '"' +  interview["Number of interviews"] ;
      // var str = '{' + Airline_Dest + InterviewEndDate + Completed_of_interviews + '"}';

      interview["Airline_Dest"] = interview["quota_id"];
      interview["InterviewEndDate"] = interview["InterviewDate"];
      interview["Completed_of_interviews"] = interview["Number of interviews"];
      
      // Loop through the array and apply replaceAll for each pair
      for (k = 0; k < routes_mapping.length; k++) {
        if (routes_mapping[k].flight == interview["quota_id"]) {
          interview["Airline_Dest"] = routes_mapping[k].aci;
        }
      }
      
      interview_data.push(interview);
      // interview_data.push(JSON.parse(str));
    }
   }

  //prepare flight list
  //empty the list
  today_flight_list = [];
  today_flight_list.length = 0;
  
  this_month_flight_list  = [];
  this_month_flight_list.length = 0;
  
  for (i = 0; i < flight_list_temp.length; i++) {
    let flight = flight_list_temp[i];

    flight.Airline_Dest = flight.AirlineCode + "-" + flight.Dest; // flight.Flight.substring(0,2);//code for compare
	  flight.Dest = flight.Dest + "-" + flight.DestName;//code for compare
    flight.Next = flight.Next + "-" + flight.NextName;//code for compare

    //for sorting: YYYY-MM-DD
    flight.DateTimeID = flight.Date.substring(6,10) +  flight.Date.substring(3,5) +  flight.Date.substring(0,2) + flight.Time;
    flight.Date_Time = flight.Date.substring(6,10) + "-" +  flight.Date.substring(3,5) + "-" + flight.Date.substring(0,2) + " " + flight.Time;

    //currentMonth: 02-2023
    //flight.Date: 08-02-2023
    if (currentQuarter ==  getQuarterFromMonth(flight.Date.substring(3,5), flight.Date.substring(6,10))) { 
      this_month_flight_list.push(flight);
    }	
    
    //only get today & not departed flight
    if (((currentDate == flight.Date) && notDeparted(flight.Time))
        || (nextDate == flight.Date))
    { 
      // flight.nextDay = 0; //display two date infor as requested by Didi
      // if (nextDate == flight.Date) {
      //   flight.nextDay = 1;
      // }
      today_flight_list.push(flight);
    }
			   
  }
  
    //add quota data
    //empty the list
  daily_plan_data = [];
  daily_plan_data.length = 0;
  
  for (i = 0; i < today_flight_list.length; i++) {
    let flight = today_flight_list[i];
    for (j = 0; j < quota_data.length; j++) {
      let quota = quota_data[j];
      if (((quota.Airline_Dest_in_schedule.includes(flight.Airline_Dest)) ) && (quota.Quota>0))
      {
        flight.Quota = quota.Quota;
        daily_plan_data.push(flight);

        // if (flight.Airline_Dest == "EC-BER")
        // {
        //   console.log("flight: ", flight);
        // }

       }
    }
  }
  console.log("currentQuarter: ", currentQuarter);
}
