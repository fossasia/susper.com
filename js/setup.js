/*
 * setup.js
 * customization values for the searchpage_template_yaml4 web-page templates
 * First published 16.3.2014 at https://gitorious.org/yacy/searchpage_template_yaml4
 * (C) by Michael Peter Christen, licensed under a
 * Creative Commons Attribution 2.0 Generic License (CC-BY 2.0) 
 *
 * HOW TO USE:
 * Just change the server address to your own search server address!
 * The address may be different from the place where this wab pages application is hosted
 * because the content is fetched using JSONP.
 * 
 * After each update, you must change this again or save the address before doing an update.
 */

var server="localhost:8090";
//var server="141.52.175.63";

var homepage="http://yacy.net";
var logo="../images/YaCyLogo2011_60.png";
var greeting="<span class=\"headlineaccentcolor\">Search</span> <span class=\"headlinecolor\">Portal</span>";

function fillHeader() {
	/* set the values */
	document.getElementById("greeting").innerHTML = greeting;
	document.getElementById("homepage").setAttribute("href", homepage);
	document.getElementById("logo").setAttribute("src", logo);
}