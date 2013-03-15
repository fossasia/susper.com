/*
 * yacytable.js
 * Functions for the searchpage_template_yaml4 web-page template yacytable.html
 * First published 7.3.2013 at https://gitorious.org/yacy/searchpage_template_yaml4
 * (C) by Michael Peter Christen, licensed under a
 * Creative Commons Attribution 2.0 Generic License (CC-BY 2.0) 
 * If you enhance this, please clone the repository and give us a pull request!
 */


// static variables
var start = new Date();
var query = "";
var maximumRecords = "1000";
var startRecord = "0";
var searchresult;
var totalResults = 0;
var filetypes;
var topics;
var script = "";
var modifier = "";
var modifiertype = "";

function search(search, count, offset) {
  var navhtml = document.getElementById("searchnavigation");
  if (navhtml != null) navhtml.innerHTML = "<p>loading...</p>";
  query = search;
  maximumRecords = count;
  if (count == "") maximumRecords = 100;
  startRecord = offset;
  if (offset == "") startRecord = 0;
  start = new Date();
  if (query == null || query == "") {
    return;
  }
  var self = this;
  if (window.XMLHttpRequest) { // Mozilla/Safari
    self.xmlHttpReq = new XMLHttpRequest(); 
  } else if (window.ActiveXObject) { // IE
    self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
  }
  //self.xmlHttpReq.open('GET', "yacysearch.json?verify=false&resource=local&nav=all&contentdom=all&maximumRecords=" + maximumRecords + "&startRecord=" + startRecord + "&query=" + query, true);
  self.xmlHttpReq.open('GET', "http://" + server + "/solr/select?hl=false&wt=yjson&facet=true&facet.mincount=1&facet.field=url_file_ext_s&start=" + startRecord + "&rows=" + maximumRecords + "&query=" + query, true);
  self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  self.xmlHttpReq.onreadystatechange = function() {
    if (self.xmlHttpReq.readyState == 4) {
      preparepage(self.xmlHttpReq.responseText);
    }
  }
  self.xmlHttpReq.send(null);
}

function navget(list, name) {
  for (var i = 0; i < list.length; i++) {
    if (list[i].facetname == name) return list[i];
  }
}

function preparepage(str) {
  document.getElementById("searchnavigation").innerHTML = "<p>parsing result...</p>";
  var raw = document.getElementById("raw");
  if (raw != null) raw.innerHTML = str;
  var rsp = eval("(" + str + ")");
  var firstChannel = rsp.channels[0];
  searchresult = firstChannel.items;
  totalResults = firstChannel.totalResults.replace(/[,.]/,"");
  topics = navget(firstChannel.navigation, "topics");
  filetypefacet = navget(firstChannel.navigation, "filetypes");
  
  filetypes = {};
  if (filetypefacet) {
    var elements = filetypefacet.elements;
    for (var fc = 0; fc < elements.length; fc++) {
        filetypes[elements[fc].name] = elements[fc].count;
    }
  }

  script = "";
  for (var extl = 2; extl < 6; extl++) {
    if (query.length >= 13 && query.substring(query.length - 10 - extl, query.length - extl) == " filetype:") {
      modifier = query.substring(query.length - 9 - extl);
      modifiertype = modifier.substring(modifier.length - extl);
      break;
    }
  }

  if (modifiertype == "png" || modifiertype == "gif" || modifiertype == "jpg" || modifiertype == "PNG" || modifiertype == "GIF" || modifiertype == "JPG") {
    var tt = resultImages();
    document.getElementById("searchresults").innerHTML = tt;
  } else {
    var tt = resultList();
    document.getElementById("searchresults").innerHTML = tt;
  }
  var tt = resultNavigation();
  document.getElementById("searchnavigation").innerHTML = tt;
  //document.getElementById("serverlist").innerHTML = "";
  hideDownloadScript();
}

function makeDownloadScript() {
  document.getElementById("downloadscript").innerHTML = "<div><pre>" + script + "</pre><br/></div>";
  document.getElementById("downloadbutton").innerHTML = "<input id=\"downloadbutton\" type=\"button\" value=\"hide the download script\" onClick=\"hideDownloadScript();\"/>";
}

function hideDownloadScript() {
  document.getElementById("downloadscript").innerHTML = "";
  var dlb = document.getElementById("downloadbutton");
  if (dlb) dlb.innerHTML = "<input type=\"button\" value=\"create a download script\" onClick=\"makeDownloadScript();\"/>";
}

function resultNavigation() {
  var html = "";
  if (searchresult.length > totalResults) totalResults = searchresult.length;
  if (totalResults > 0) {
      html += "<p>" + searchresult.length + " results from a total of " + totalResults + " docs in index; search time: " + ((new Date()).getTime() - start.getTime()) + " milliseconds.</p>";
      html += "<div class=\"nav-wrapper\"><nav class=\"ym-vlist\"><h6 class=\"ym-vtitle\">Result Size</h6><dl>";
      if (maximumRecords == 10) html += "<dt><input type=\"checkbox\" checked=\"checked\"></dt><dd>10 results</dd>";
      if (maximumRecords != 10 && totalResults >= 10) html += "<dt><input type=\"checkbox\" onClick=\"window.location.href='yacytable.html?query=" + query + "&startRecord=" + startRecord + "&maximumRecords=" + 10 + "'\"></dt><dd>10 results</dd>";
      if (maximumRecords == 100) html += "<dt><input type=\"checkbox\" checked=\"checked\"></dt><dd>100 results</dd>";
      if (maximumRecords != 100 && totalResults >= 100) html += "<dt><input type=\"checkbox\" onClick=\"window.location.href='yacytable.html?query=" + query + "&startRecord=" + startRecord + "&maximumRecords=" + 100 + "'\"></dt><dd>100 results</dd>";
      if (maximumRecords == 1000) html += "<dt><input type=\"checkbox\" checked=\"checked\"></dt><dd>1000 results</dd>";
      if (maximumRecords != 1000 && totalResults >= 1000) html += "<dt><input type=\"checkbox\" onClick=\"window.location.href='yacytable.html?query=" + query + "&startRecord=" + startRecord + "&maximumRecords=" + 1000 + "'\"></dt><dd>1000 results</dd>";
      if (totalResults <= 10000 && maximumRecords < totalResults) html += "<dt><input type=\"checkbox\" onClick=\"window.location.href='yacytable.html?query=" + query + "&startRecord=" + startRecord + "&maximumRecords=" + Math.max(100,totalResults) + "'\"></dt><dd>all " + Math.max(100,totalResults) + " results</dd>";
      html += "</dl></nav></div>";
  } else {
      if (query == "") {
        html += "<p>please enter some search words or use the following predefined search queries:</p>";
        html += "<div class=\"nav-wrapper\"><nav class=\"ym-vlist\"><h6 class=\"ym-vtitle\">Find Images</h6><dl>";
        html += "<dt>&nbsp;</dt><dd><input type=\"button\" value=\"png\" onClick=\"window.location.href='yacytable.html?query=png+filetype:png&startRecord=" + startRecord + "&maximumRecords=" + 10 + "'\"/></dd>";
        html += "<dt>&nbsp;</dt><dd><input type=\"button\" value=\"gif\" onClick=\"window.location.href='yacytable.html?query=gif+filetype:gif&startRecord=" + startRecord + "&maximumRecords=" + 10 + "'\"/></dd>";
        html += "<dt>&nbsp;</dt><dd><input type=\"button\" value=\"jpg\" onClick=\"window.location.href='yacytable.html?query=jpg+filetype:jpg&startRecord=" + startRecord + "&maximumRecords=" + 10 + "'\"/></dd>";
        html += "</dl></nav></div>";
        html += "<div class=\"nav-wrapper\"><nav class=\"ym-vlist\"><h6 class=\"ym-vtitle\">Find Document</h6><dl>";
        html += "<dt>&nbsp;</dt><dd><input type=\"button\" value=\"pdf\" onClick=\"window.location.href='yacytable.html?query=pdf+filetype:pdf&startRecord=" + startRecord + "&maximumRecords=" + 10 + "'\"/></dd>";
        html += "<dt>&nbsp;</dt><dd><input type=\"button\" value=\"xls\" onClick=\"window.location.href='yacytable.html?query=xls+filetype:xls&startRecord=" + startRecord + "&maximumRecords=" + 10 + "'\"/></dd>";
        html += "<dt>&nbsp;</dt><dd><input type=\"button\" value=\"doc\" onClick=\"window.location.href='yacytable.html?query=doc+filetype:doc&startRecord=" + startRecord + "&maximumRecords=" + 10 + "'\"/></dd>";
        html += "</dl></nav></div>";
      } else {
         html += "no results";
      }
  }

  // add extension navigation
  var extnav = "";
  extnav += "<div class=\"nav-wrapper\"><nav class=\"ym-vlist\"><h6 class=\"ym-vtitle\">Filetype</h6><dl>";
  var ftc = 0;
  for (var key in filetypes) {
      if (filetypes[key] > 0)  {
        extnav += "<dt><input type=\"radio\" name=\"filetypes\" value=\"" + key + "\" onClick=\"window.location.href='yacytable.html?query=" + query + " filetype:" + key + "&startRecord=" + startRecord + "&maximumRecords=" + maximumRecords + "'\"></dt><dd>" + key + " (" + filetypes[key] + ")</dd>";
        ftc++;
      }
  }
  extnav += "</dl></nav></div>";
  if (ftc > 0) {
      html += extnav;
  } else {
      // check if there is a filetype constraint and offer a removal
      if (modifier != "") {
        html += "<div class=\"nav-wrapper\"><nav class=\"ym-vlist\"><h6 class=\"ym-vtitle\">Filetype</h6><dl>";
        html += "<dt><input type=\"checkbox\" checked=\"checked\" name=\"filetypes\" value=\"" + key + "\" onClick=\"window.location.href='yacytable.html?query=" + query.substring(0, query.length - 13) + "&startRecord=" + startRecord + "&maximumRecords=" + maximumRecords + "'\"></dt><dd>" + modifier + " (remove)</dd>";
        html += "</dl></nav></div>";
      }
  }

  return html;
}

function resultList() {
  var html = "";
  if (searchresult.length > 0) {
    document.getElementById("searchnavigation").innerHTML = "<p>found " + searchresult.length + " documents, preparing table...</p>";
    html += "<table class=\"narrow\">";
    html += "<thead><tr><th>Count</td><th>Protocol</td><th>Host</td><th>Path</td><th>URL</td><th>Size</td><th>Date</td></tr></thead><tbody>";
    for (var i = 0; i < searchresult.length; i++) { html += resultLine("row", searchresult[i], i + 1); }
    html += "</tbody></table>";
  }
  return html;
}

function resultImages() {
  var html = "";
  document.getElementById("searchnavigation").innerHTML = "<p>found " + searchresult.length + " images, preparing...</p>";
  for (var i = 0; i < searchresult.length; i++) { html += resultLine("image", searchresult[i]); }
  return html;
}

function resultLine(type, item, linenumber) {
  // evaluate item
  if (item == null) return "";
  if (item.link == null) return "";
  protocol = "";
  host = "";
  path = item.link;
  file = "";
  p = item.link.indexOf("//");
  if (p > 0) {
    protocol = item.link.substring(0, p - 1);
    q = item.link.indexOf("/", p + 2);
    if (q > 0) {
      host = item.link.substring(p + 2, q);
      path = item.link.substring(q);
    } else {
      host = item.link.substring(p + 2);
      path = "/";
    }
  }
  title = item.title;
  q = path.lastIndexOf("/");
  if (q > 0) {
    file = path.substring(q + 1);
    path = path.substring(0, q + 1);
  } else {
    file = path;
    path = "/";
  }
  path = unescape(path);
  if (path.length >= 40) path = path.substring(0, 18) + "..." + path.substring(path.length - 19);
  if (title == "") title = path;
  if (title.length >= 60) title = title.substring(0, 28) + "..." + title.substring(title.length - 29);
  pd = item.pubDate;
  if (pd == undefined) pd = "";
  if (pd.substring(pd.length - 6) == " +0000") pd = pd.substring(0, pd.length - 6);
  if (pd.substring(pd.length - 9) == " 00:00:00") pd = pd.substring(0, pd.length - 9);
  if (pd.substring(pd.length - 5) == " 2010") pd = pd.substring(0, pd.length - 5);
    
  // update navigation
  for (var key in filetypes) {
    if (query.indexOf("filetype:" + key) >= 0) delete filetypes[key];
  }
  
  // update download script
  if (item.link.indexOf("smb://") >= 0) script += "smbget -n -a -r \"" + item.link + "\"\n"; else script += "curl -OL \"" + item.link + "\"\n";
  
  // make table row
  var html = "";
  if (type == "row") {
    html += "<tr>";
    html += "<td>" + linenumber + "</td>"; // Count
    html += "<td>" + protocol + "</td>"; // Protocol
    html += "<td><a class=\"searchresults\" href=\"" + protocol + "://" + host + "/" + "\">" + host + "</a></td>"; // Host
    html += "<td><a class=\"searchresults\" href=\"" + protocol + "://" + host + path + "\">" + path + "</a></td>"; // Path 
    html += "<td><a class=\"searchresults\" href=\"" + item.link + "\">" + item.link + "</a></td>"; // URL
    if (item.sizename == "-1 bytes") html += "<td></td>"; else html += "<td align=\"right\">" + item.sizename + "</td>"; // Size
    html += "<td align=\"right\">" + pd + "</td>"; // Date
    html += "</tr>";
  }
  if (type == "image") {
    var name = title;
    while ((p = name.indexOf("/")) >= 0) { name = name.substring(p + 1); }
    html += "<a href=\"" + item.link + "\" name=\"" + name + "\">";
    html += "<img src=\"" + item.link + "\" width=\"96\" height=\"96\" />";
    html += "</a>";
  }
    
  // return entry
  return html;
}