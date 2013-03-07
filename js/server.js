/*
 * server.js
 * Functions for the searchpage_template_yaml4 web-page templates
 * First published 7.3.2013 at https://gitorious.org/yacy/searchpage_template_yaml4
 * (C) by Michael Peter Christen, licensed under a
 * Creative Commons Attribution 2.0 Generic License (CC-BY 2.0) 
 * If you enhance this, please clone the repository and give us a pull request!
 */

var server="localhost:8090";

var query = new Object();

function getQueryProps() {
  var text = "";
  for (property in query) {
    text += property + " = " + query[property] + ";\n";
  }
  return text;
}

function getURLparameters() {
  if (self.location.search.indexOf("=") == -1) {return;}
  var parameterArray = unescape(self.location.search).substring(1).split("&");
  for (var i=0;i<parameterArray.length;i++) {
    parameterArray[i] = parameterArray[i].split("=");
    eval("query." + parameterArray[i][0] + " = \"" + parameterArray[i][1] + "\"");
 }
}

function xmlhttpPost() {
    var searchform = document.forms['searchform'];
    //var rsslink = document.getElementById("rsslink");
    //if (rsslink != null) rsslink.href="yacysearch.rss?query=" + searchform.query.value;
    if (searchform) search(searchform.query.value, searchform.maximumRecords.value, searchform.startRecord.value);
}

function execGet(name) {
  var query = new RegExp("[\\?&]query=([^&#]*)").exec(window.location.href);
  if (query != null) {
    var startRecord = new RegExp("[\\?&]startRecord=([^&#]*)").exec(window.location.href);
    if (startRecord == null) startRecord = 0; else startRecord = startRecord[1];
    var maximumRecords = new RegExp("[\\?&]maximumRecords=([^&#]*)").exec(window.location.href);
    if (maximumRecords == null) maximumRecords = 10; else maximumRecords = maximumRecords[1];
    document.getElementById("query").value=query[1].replace(/%20/g," ");
    document.getElementById("maximumRecords").value=maximumRecords;
    document.getElementById("startRecord").value=startRecord;
    search(document.getElementById("query").value, maximumRecords, startRecord);
  }
}