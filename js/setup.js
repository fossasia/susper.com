/*
 * setup.js
 * customization values for the yacy_webclient_bootstrap templates
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
var urlRoot='http://' + server + '/yacysearch.json?callback=?';
var homepage="http://yacy.net";
var logo="../images/YaCyLogo2011_60.png";
var greeting="Search Portal";
var queryplaceholder="Document Retrieval";
