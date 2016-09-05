/*
 * setup.js
 * customization values for the yacy_webclient_bootstrap templates
 * (C) 2014, 2015 by Michael Peter Christen, licensed under a
 * Creative Commons Attribution 2.0 Generic License (CC-BY 2.0)
 *
 * HOW TO USE:
 * Just change the server address to your own search server address!
 * For example, if you want to use your local YaCy, set it to
 *
 * var server="localhost:8090";
 *
 * The address may be different from the place where this wab pages application is hosted
 * because the content is fetched using JSONP.
 *
 * After each update, you must change this again or save the address before doing an update.
 */

var server="search.yacy.net";
var searchURL='http://' + server + '/solr/select?callback=?';
var suggestUrl='http://' + server + '/suggest.json?callback=?';
var homepage="http://susper.com";
var logo="../images/susper.svg";
var headline="";
var greeting="";
var queryplaceholder="";
