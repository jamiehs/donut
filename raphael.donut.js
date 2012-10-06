/*!
 * DonutClock 0.1.0 - Raphael plugin
 */
(function (Raphael) {
	Raphael.donutClock = function (x, y, radius, timezoneOffset, element) {
		return new DonutClock(x, y, radius, timezoneOffset, element);
	};
	
    var doc = document, win = window;
    DonutClock = function (x, y, radius, timezoneOffset, element) {
    	radius = radius * 0.9;
	    var ringThickness = radius * 0.5;
		var outerRadius = radius;
		var innerRadius = outerRadius - ringThickness;
		var centerX = x / 2;
		var centerY = y / 2;
		var red = {
			stroke: 'rgba(0,0,0,0)', 
			"stroke-width": 1, 
			fill:"#ff6666"
		};
		var yellow = {
			stroke: 'rgba(0,0,0,0)', 
			"stroke-width": 1, 
			fill:"#ffcc33"
		};
		var green = {
			stroke: 'rgba(0,0,0,0)', 
			"stroke-width": 1, 
			fill:"#33cc33"
		};
    	
		var paper = Raphael( element, x, y)
		
		paper.customAttributes.arc = function (centerX, centerY, startAngle, endAngle, innerR, outerR) {
			var radians = Math.PI / 180,
				largeArc = +( endAngle - startAngle > 180 );
							
				// calculate the start and end points for both inner and outer edges of the arc segment
				// the -90s are about starting the angle measurement from the top get rid of these if this doesn't suit your needs
				outerX1 = centerX + outerR * Math.cos((startAngle-90) * radians),
				outerY1 = centerY + outerR * Math.sin((startAngle-90) * radians),
				outerX2 = centerX + outerR * Math.cos((endAngle-90) * radians),
				outerY2 = centerY + outerR * Math.sin((endAngle-90) * radians),
				innerX1 = centerX + innerR * Math.cos((endAngle-90) * radians),
				innerY1 = centerY + innerR * Math.sin((endAngle-90) * radians),
				innerX2 = centerX + innerR * Math.cos((startAngle-90) * radians),
				innerY2 = centerY + innerR * Math.sin((startAngle-90) * radians);
	
			// build the path array
			var path = [
				["M", outerX1, outerY1], //move to the start point
				["A", outerR, outerR, 0, largeArc, 1, outerX2, outerY2], //draw the outer edge of the arc
				["L", innerX1, innerY1], //draw a line inwards to the start of the inner edge of the arc
				["A", innerR, innerR, 0, largeArc, 0, innerX2, innerY2], //draw the inner arc
				["z"] //close the path
			];
			
			return {path: path};
		};
		
		
		var arcs = [];
		
		var redArc = paper.path().attr(red).attr({arc: [centerX, centerY, timeToDegrees( 22 ), timeToDegrees( 7 ), innerRadius, outerRadius]});
		arcs.push( redArc );
		
		var yellowArc1 = paper.path().attr(yellow).attr({arc: [centerX, centerY, timeToDegrees( 6 ), timeToDegrees( 9 ), innerRadius, outerRadius]});
		arcs.push( yellowArc1 );
		
		var greenArc = paper.path().attr(green).attr({arc: [centerX, centerY, timeToDegrees( 8 ), timeToDegrees( 22 ), innerRadius, outerRadius]});
		arcs.push( greenArc );
		
		var yellowArc2 = paper.path().attr(yellow).attr({arc: [centerX, centerY, timeToDegrees( 21 ), timeToDegrees( 22 ), innerRadius, outerRadius]});
		arcs.push( yellowArc2 );
		
		// Draw Reticle
		reticle = {
			width: 10,
			height: ringThickness * 1.15,
			radius: ringThickness * 0.015
		};
		var reticleShape = paper.rect( ( centerX - ( reticle.width / 2 ) ) , ( centerY - outerRadius ) + ( ( ringThickness - reticle.height ) / 2 ), reticle.width, reticle.height, reticle.radius );
		reticleShape.attr({
			fill: "rgba(255,255,255,0.25)",
			stroke: "rgba(255,255,255,1)",
			'stroke-width': 1
		});
		
		
		
		var rotation = getCurrentTimeRotation( timezoneOffset );
		var easing = '<>';
		var speed = randomIntegerBetween( 1000, 2500);
		var delay = 250;
		
		var redArcAnim = Raphael.animation({
			transform: 'r' + rotation + ',' + centerX + ',' + centerY
		}, speed, easing);
		redArc.animate( redArcAnim.delay( delay ) );
		
		var yellowArc1Anim = Raphael.animation({
			transform: 'r' + rotation + ',' + centerX + ',' + centerY
		}, speed, easing );
		yellowArc1.animate( redArcAnim.delay( delay ) );
		
		var greenArcAnim = Raphael.animation({
			transform: 'r' + rotation + ',' + centerX + ',' + centerY
		}, speed, easing );
		greenArc.animate( redArcAnim.delay( delay ) );
		
		var yellowArc2Anim = Raphael.animation({
			transform: 'r' + rotation + ',' + centerX + ',' + centerY
		}, speed, easing );
		yellowArc2.animate( redArcAnim.delay( delay ) );
	
		setInterval(function(){
			var rotation = getCurrentTimeRotation( timezoneOffset );
			redArc.transform( 'r' + rotation + ',' + centerX + ',' + centerY );
			yellowArc1.transform( 'r' + rotation + ',' + centerX + ',' + centerY );
			greenArc.transform( 'r' + rotation + ',' + centerX + ',' + centerY );
			yellowArc2.transform( 'r' + rotation + ',' + centerX + ',' + centerY );
		}, 5000 );
	};
	
	function getCurrentTimeRotation( timezoneOffset ) {
		var date = new Date();
		var hours = date.getUTCHours();
		var minutes = date.getUTCMinutes();
		
		var hoursOffset = Math.abs( timezoneOffset.split(':')[0] );
		var minutesOffset = Math.abs( timezoneOffset.split(':')[1] );
		if( parseFloat(timezoneOffset) < 0 ){
			// Negative Offset
			minutesOffset = minutesOffset * -1;
			hoursOffset = hoursOffset * -1;
		}
		
		hours = parseInt( hours ) + parseInt( hoursOffset );
		minutes = parseInt( minutes ) + parseInt( minutesOffset );
		hours += minutes/60;
		
		return hours / 24 * 360 * -1;
	}
	
	function timeToDegrees( time )  {
		var degrees = time * 360 / 24;
		if( degrees > 360 ){
			degrees = degrees / 2;
		}
		return degrees;
	}
	
	function randomIntegerBetween(minValue,maxValue){
    	return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
	}	
   
   
})(window.Raphael);