var currentFlightList = [];
var flightList;
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

function getToDate() {
  var d = new Date();
      
  month = '' + (d.getMonth() + 1),
  day = '' + d.getDate(),
  year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [day, month,year].join('-');
}

function find_flight(list, item) {
  item = item.toLowerCase();
  
  if (item) {
    if (item !== "") {
      for (i = 0; i < list.length; i++) {
        if (list[i].Show.toLowerCase() === item) {
          $('.rt-btn.rt-btn-next').show(); 
          return true;
        }
      }
    }
  }
  $('.rt-btn.rt-btn-next').hide(); 
  return false;
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

  console.log("Load flight list done!");
}


function notDeparted_flight_search(flight_time) {
  var current_time = new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin', hour12: false});
  //15:13:27
  var current_time_value  = current_time.substring(current_time.length-8,current_time.length-6) * 60;
  current_time_value += current_time.substring(current_time.length-5,current_time.length-3)*1;

  //Time: 0805    
  var flight_time_value = flight_time.substring(0,2) * 60 + flight_time.substring(2,4)*1;
  
  //plus  4 hour
  flight_time_value = flight_time_value + 240;

  var result = (flight_time_value > current_time_value);
  return (result);
}

function search_flight() {
  var input = document.getElementById('inputFlightCodeID').value;
  var searchList = document.getElementById('flightSearchList');
  
  searchList.innerHTML = '';
  currentFlightList = [];
  currentFlightList.length = 0;
  input = input.toLowerCase();

  var today = getToDate();
  var count = 0;
  for (i = 0; i < flightList.length; i++) {
    let flight = flightList[i];

    if ((today == flight.Date) 
        && notDeparted_flight_search(flight.Time)) //today flight && departure{ 
    {      
      if (flight.Show.toLowerCase().includes(input)) {
        const elem = document.createElement("option");
        elem.value = flight.Show;
        searchList.appendChild(elem);
        currentFlightList.push(flight);
        count++;
      }
    }
    
    if (count > 30) {
      break;
    }
  }

  if (find_flight(flightList, document.getElementById('inputFlightCodeID').value)) {
    console.log("Found ", document.getElementById('inputFlightCodeID').value);
  }
  else{
    console.log("Not found ", document.getElementById('inputFlightCodeID').value);
  }  
  
  console.log("earch_flight done!");
}

function select_flight() {
  var selectedFlight = document.getElementById('inputFlightCodeID').value;
  var flightDestinationValue;
  var found = false;
 //$('.rt-btn.rt-btn-next').hide(); 

  for (i = 0; i < currentFlightList.length; i++) {
    var currentFlight = currentFlightList[i];
    if (currentFlight.Show == selectedFlight) { 
      flightDestinationValue = currentFlight.DestName + " (" + currentFlight.Dest  + ")";

      api.fn.answers({flight_show:  currentFlight.Show});
      api.fn.answers({flight_number:   currentFlight.Flight});

      api.fn.answers({airport_code:   currentFlight.Dest});
      api.fn.answers({airport_name: flightDestinationValue});
      api.fn.answers({airline_code:   currentFlight.AirlineCode}); //airline code
      api.fn.answers({airline_name:   currentFlight.Airline});  //airline name



      if (currentFlight.Schengen) api.fn.answers({Schengen_flight:  currentFlight.Schengen});
      
      found = true;
      $('.rt-btn.rt-btn-next').show(); 
      break;
    }
  }
  if (!found) {
    alert("Please select a flight number from the list.");
  }
}

function showFlightCodeSection() {
  load_flight_list();

  $('.rt-element.rt-text-container').append(`<input list="flightSearchList" onchange="select_flight()"  onkeyup="search_flight()" name="inputFlightCodeID" id="inputFlightCodeID" >
  <datalist id="flightSearchList"> </datalist>`);

  var currentValue  = api.fn.answers().Core_Q3_ext;
  if (currentValue) {
    if (currentValue !== "") {
      document.getElementById('inputFlightCodeID').value = currentValue;
    }
  }

  if (find_flight(flightList, document.getElementById('inputFlightCodeID').value)) {
    console.log("Found ", document.getElementById('inputFlightCodeID').value);
  }
  else{
    console.log("not found ", document.getElementById('inputFlightCodeID').value);
  }
  $('#inputFlightCodeID').show(); 
}


function hideFlightCodeSection() {
  $('#inputFlightCodeID').hide();
  //var x = document.getElementById('inputFlightCodeID');
  //x.style.display = "none";
}