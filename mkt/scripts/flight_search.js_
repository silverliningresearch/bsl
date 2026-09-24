var flightRawList;
var flightList = [];
var flightShortList = [];
var flightForInterview;
/************************************/
function getToDate() {
  var d = new Date();
      
  month = '' + (d.getMonth() + 1),
  day = '' + d.getDate(),
  year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [day, month, year].join('-');
}

function getTomorrow() {
  var d = new Date();
      
  month = '' + (d.getMonth() + 1),
  day = '' + (d.getDate()+1),
  year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [day, month, year].join('-');
}

function flight_in_list_found(list, item) {
  item = item.toLowerCase();
  
  if (item) {
    if (item !== "") {
      for (i = 0; i < list.length; i++) {
        if (list[i].Show.toLowerCase() === item) {
          return true;
        }
      }
    }
  }
  return false;
}

function notDeparted_flight_search(flight_date, flight_time) {
  var current_time = new Date().toLocaleString('en-US', { timeZone: 'Europe/Berlin', hour12: false});
  //15:13:27
  var current_time_value  = current_time.substring(current_time.length-8,current_time.length-6) * 60;
  current_time_value += current_time.substring(current_time.length-5,current_time.length-3)*1;

  //Time: 0805    
  var flight_time_value = flight_time.substring(0,2) * 60 + flight_time.substring(2,4)*1;
  
  var result = false;
  
  //allow departure time range compare to the current time: -0.5h + 4h
  
  //if next date, plus 24 hour
  if (flight_date == getTomorrow()) 
  {  
    flight_time_value = flight_time_value + 24*60;
  }

  if ((current_time_value < (flight_time_value + 60)) && (current_time_value > (flight_time_value - 240))) //within[-1h +4h]
  {
      result = true; 
  }

  return (result);
}

function load_flight_list() {
  flightRawList = JSON.parse(Departures_Flight_List_Raw);
  flightList = [];
  flightList.length = 0;
  flightShortList = [];
  flightShortList.length = 0;


  for (i = 0; i < flightRawList.length; i++) {
    var flight = flightRawList[i];
    if (
        ((flight.Date == getToDate() || (flight.Date == getTomorrow())) //today flight
          && notDeparted_flight_search(flight.Date, flight.Time)   // not departured
        )
        )
    {
      {
        var item  = flightRawList[i];
        var Via = "";
        var ViaName = "";

        var language = api.fn.getCurrentLanguage(); 
        if (language=='fr')
          {
            flightRawList[i].DestName = flightRawList[i].DestNameFR;
            flightRawList[i].Country = flightRawList[i].CountryFR;

            flightRawList[i].Airline = flightRawList[i].AirlineFR;
         }
          else{
          }
        
        var Show = flightRawList[i].Flight.replaceAll(" ", "") + " (";

        Show += flightRawList[i].Time.substring(0, 2) + ":"  + flightRawList[i].Time.slice(-2) + " to " + flightRawList[i].Dest + " (" + flightRawList[i].DestName + " - " + flightRawList[i].Country  +")";

        Show +=")";

        item.Show = Show; 
        item.Via = Via; 
        item.ViaName = ViaName;

        flightList.push(item);
      }
    }
  }

  aui_init_search_list(flightList);
  console.log("Load flight list done!");
}

function save_flight_value(question, value) {
  console.log("question:", question);
  console.log("value:", value);

  api.fn.answers({flight_show:  value.Show});
  api.fn.answers({flight_number:   value.Flight});

  api.fn.answers({airport_code:   value.Dest});
  api.fn.answers({airport_name: value.DestName});
  api.fn.answers({airline_code:   value.AirlineCode}); //airline code
  api.fn.answers({airline_name:   value.Airline});  //airline name

  console.log("save flight  done!");
}

function show_flight_search_box(question) {
  load_flight_list();
  
  var defaultValue = "";

  aui_show_external_search_box(question, defaultValue);
}

function hide_flight_search_box() {
  aui_hide_external_search_box();
}