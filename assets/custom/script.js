var TLDates;
var TLStart;
var TLEnd;
$(document).on('click', '.drop', function () {$(this).popover('show'); });

$(document).on('click', '.grid', function () {$('[data-toggle="popover"]').popover('hide');});
json = [];
var element;
var today = new Date();

today.setMonth(today.getMonth() - 1);

const ONE_HOUR = 60 * 60 * 1000,
      ONE_DAY = 24 * ONE_HOUR,
      ONE_WEEK = 7 * ONE_DAY,
      ONE_MONTH = 30 * ONE_DAY,
      SIX_MONTHS = 6 * ONE_MONTH;



function loadJSON(name, type) {
  json = [];
  if(type == "app"){
    if(window.location.search){
      var url = "/app-single?app=" + name + "&deviceId=" + window.location.search.split("=")[1];
    } else {
      var url = "/app-single?app=" + name
    }
    fetch(url,{method: "get"}).then(function(response) {
      return response.json();
    }).then(function(res){ 
      res.forEach(function(each){
        if(!(json.filter(td => td.name == each.permission).length == 0)){
          json.filter(td => td.name == each.permission)[0].data.push({date: each.timestamp, details: {event: each.permission, object: ("GPS Location: " + (each.gps ? each.gps : "N/A"))}});
        } else {
          json.push({name: each.permission, data: [{date: each.timestamp, details: {event: each.permission, object: ("GPS Location: " + (each.gps ? each.gps : "N/A"))}}]});
        }
      });
      console.log(json);
      loadTimeLine();  
    });
  } else if (type == "category"){
    var form = new FormData();
      form.append("apps", name);
      if(window.location.search){
        var deviceId = window.location.search.split("=")[1];
        form.append("deviceId", deviceId);
      }

    var settings = {
      "crossDomain": true,
      "url": "/category-data",
      "method": "POST",
      "headers": {
        "cache-control": "no-cache"
      },
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": form
    }

    $.ajax(settings).done(function (response) {
      var res = JSON.parse(response);
      res.forEach(function(each){
        if(!(json.filter(td => td.name == categories[each.package_name].name).length == 0)){
          json.filter(td => td.name == categories[each.package_name].name)[0].data.push({date: each.timestamp, details: {event: each.permission, object: ("GPS Location: " + (each.gps ? each.gps : "N/A"))}});
        } else {
          json.push({name: categories[each.package_name].name, data: [{date: each.timestamp, details: {event: each.permission, object: ("GPS Location: " + (each.gps ? each.gps : "N/A"))}}]});
        }
      });
      console.log(json);
      loadTimeLine();
    });
  } else {
    var form = new FormData();
      form.append("permission", name);
      if(window.location.search){
        var deviceId = window.location.search.split("=")[1];
        form.append("deviceId", deviceId);
      }

    var settings = {
      "crossDomain": true,
      "url": "/permission-data",
      "method": "POST",
      "headers": {
        "cache-control": "no-cache"
      },
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": form
    }

    $.ajax(settings).done(function (response) {
      var res = JSON.parse(response);
      res.forEach(function(each){
        if(!(json.filter(td => td.name == categories[each.package_name].name).length == 0)){
          json.filter(td => td.name == categories[each.package_name].name)[0].data.push({date: each.timestamp, details: {event: each.permission, object: ("GPS Location: " + (each.gps ? each.gps : "N/A"))}});
        } else {
          json.push({name: categories[each.package_name].name, data: [{date: each.timestamp, details: {event: each.permission, object: ("GPS Location: " + (each.gps ? each.gps : "N/A"))}}]});
        }
      });
      console.log(json);
      loadTimeLine();
    });
  }
}


function loadTimeLine(){

  TLDates = json.map(a => a.data.map(a => a.date)).join().split(",").map(a => Date.parse(a)).sort().map(a => new Date(a));
  TLStart = TLDates[0];
  TLEnd = TLDates[TLDates.length - 1];

  timeline = d3.chart.timeline()
  .end(TLEnd)
  .start(TLStart)
  .minScale(ONE_WEEK / ONE_MONTH)
  .maxScale(ONE_WEEK / ONE_HOUR)
  .eventGrouping(1800000)
  .width(window.innerWidth - 200)
  .padding({top: 50, bottom: 50, left: 200, right: 50})
  .eventClick(function(el) {
    var table = '<table class="table table-striped table-bordered">';
    if(el.hasOwnProperty("events")) {
      table = table + '<thead>This is a group of ' + el.events.length + ' events starting on '+ el.date + '</thead><tbody>';
      table = table + '<tr><th>Date</th><th>Event</th><th>Details</th></tr>';
      for (var i = 0; i < el.events.length; i++) {
        table = table + '<tr><td>' + el.events[i].date + ' </td> ';
        for (var j in el.events[i].details) {
          table = table +'<td> ' + el.events[i].details[j] + ' </td> ';
        }
        table = table + '</tr>';
      }
      table = table + '</tbody>';
    } else {
      table = table + 'Date: ' + el.date + '<br>';
      for (i in el.details) {
        table = table + i.charAt(0).toUpperCase() + i.slice(1) + ': ' + el.details[i] + '<br>';
      }
    }
    $('#legend').html(table);
});

  document.querySelector("#pf-timeline").innerHTML = "";
  document.querySelector("#timeline-selectpicker").innerHTML = "";
  document.querySelector("#legend").innerHTML = "";

  var data = [];

  for (var x in json) { //json lives in external file for testing
    data[x] = {};
    data[x].name = json[x].name;
    data[x].data = [];
    for (var y in json[x].data) {
      data[x].data.push({});
      data[x].data[y].date = new Date(json[x].data[y].date);
      data[x].data[y].details = json[x].data[y].details;
    }
    $('#timeline-selectpicker').append("<option>" + data[x].name + "</option>");
      data[x].display = true;
    }

    $('#timeline-selectpicker').selectpicker('refresh');

    $('#timeline-selectpicker').selectpicker('selectAll');
    
    if(countNames(data) <= 0) {
      timeline.labelWidth(60);
    }

    element = d3.select('#pf-timeline').append('div').datum(data.filter(function(eventGroup) {
      return eventGroup.display === true;
    }));

    $('#timeline-selectpicker').on('changed.bs.select', function(event, clickedIndex, newValue, oldValue) {
      data[clickedIndex].display = !data[clickedIndex].display;
      element.datum(data.filter(function(eventGroup) {
        return eventGroup.display === true;
      }));
      timeline(element);
      $('[data-toggle="popover"]').popover({
        'container': '#pf-timeline',
        'placement': 'top'
      });
    });

    timeline(element);
    $('[data-toggle="popover"]').popover({
      'container': '#pf-timeline',
      'placement': 'top'
    });
    document.querySelector(".timeline-container").style.display = "block";
    window.scroll(0,0);
}

$(window).on('resize', function() {
  timeline(element);
  $('[data-toggle="popover"]').popover({
    'container': '#pf-timeline',
    'placement': 'top'
  });
});


$('#datepicker').datepicker({
  autoclose: true,
  todayBtn: "linked",
  todayHighlight: true
});

$('#datepicker').datepicker('setDate', today);

$('#datepicker').on('changeDate', zoomFilter);

$( document.body ).on( 'click', '.dropdown-menu li', function( event ) {
  var $target = $( event.currentTarget );
    $target.closest( '.dropdown' )
      .find( '[data-bind="label"]' ).text( $target.text() )
        .end()
      .children( '.dropdown-toggle' ).dropdown( 'toggle' );

    zoomFilter();

    return false;
  });

function countNames(data) {
  var count = 0;
  for (var i = 0; i < data.length; i++) {
    if (data[i].name !== undefined && data[i].name !=='') {
      count++;
    }
  }
  return count;
}

function zoomFilter() {
  var range = $('#range-dropdown').find('[data-bind="label"]' ).text(),
      position = $('#position-dropdown').find('[data-bind="label"]' ).text(),
      date = $('#datepicker').datepicker('getDate'),
      startDate,
      endDate;

  switch (range) {
    case '1 hour':
      range = ONE_HOUR;
      break;

    case '1 day':
      range = ONE_DAY;
      break;

    case '1 week':
      range = ONE_WEEK;
      break;

    case '1 month':
      range = ONE_MONTH;
      break;
  }
  switch (position) {
    case 'centered on':
      startDate = new Date(date.getTime() - range/2);
      endDate = new Date(date.getTime() + range/2);
      break;

    case 'starting':
      startDate = date;
      endDate = new Date(date.getTime() + range);
      break;

    case 'ending':
      startDate =  new Date(date.getTime() - range);
      endDate = date;
      break;
  }
  timeline.Zoom.zoomFilter(startDate, endDate);
}

$('#reset-button').click(function() {
  timeline(element);
  $('[data-toggle="popover"]').popover({
    'container': '#pf-timeline',
    'placement': 'top'
  });
});
