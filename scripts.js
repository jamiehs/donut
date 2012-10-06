var timezone = jstz.determine_timezone();
var timezoneOffset = timezone.offset();

$(document).ready(function(){
	var size = 260;
	var radius = Math.round( size / 2 );
	
	var donut1 = Raphael.donutClock( size, size, radius, timezoneOffset, 'donut1' );
	var donut2 = Raphael.donutClock( size, size, radius, "+08:00", 'donut2' );
	var donut3 = Raphael.donutClock( size, size, radius, "-4:00", 'donut3' );
	var donut4 = Raphael.donutClock( size, size, radius, "-8:00", 'donut4' );
	var donut5 = Raphael.donutClock( size, size, radius, "00:00", 'donut5' );
	var donut6 = Raphael.donutClock( size, size, radius, "+09:00", 'donut6' );
});