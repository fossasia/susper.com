/*
 * navigation.js
 * Functions for the searchpage_template_yaml4 web-page templates
 * First published 7.3.2013 at https://gitorious.org/yacy/searchpage_template_yaml4
 * (C) by Michael Peter Christen, licensed under a
 * Creative Commons Attribution 2.0 Generic License (CC-BY 2.0) 
 * If you enhance this, please clone the repository and give us a pull request!
 */


 var menulist = new Array(
  "Usage:usage.html",
  "Search:index.html",
  "About:about.html"
);

String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function menu() {
  document.writeln("<ul>");
  var doc = document.URL;
  if (doc.endsWith("/")) doc += "index.html"
  for (var i = 0; i < menulist.length; ++i) {
    var entry = menulist[i];
    var pos = entry.indexOf(":");
    var link;
    var name;
    if (pos >= 0) {link = entry.substring(pos + 1); name = entry.substring(0, pos);} else {link = entry + ".html"; name = entry;}
    var doccheck = (p = doc.indexOf('?')) >= 0 ? doc.substring(0, p) : doc;
    if (doccheck.endsWith(link)) {
      document.writeln("<li class=\"active\"><a href=\"" + link + "\"><strong>" + name + "</strong></a></li>");
    } else {
      document.writeln("<li><a href=\"" + link + "\">" + name + "</a></li>");
    }
  }
  document.writeln("</ul>");
}

function context() {
  document.writeln("<div style=\"display:block; float:none; width:auto; text-align:right; float:right; display:inline;\">");
  languages();
  searchform();
  document.writeln("</div>");
}

function languages() {
  document.writeln("<ul style=\"padding-left:0px;padding-right:0px;\">");
  document.writeln("<li><a href=\"http://translate.google.com/translate?langpair=de|ar&u=" + document.URL + "\"><img width=\"14\" height=\"8\" src=\"../images/flag_arabic_28x17.gif\" title=\"العربية\"></a></li>");
  document.writeln("<li><a href=\"../de/\"><img width=\"14\" height=\"8\" src=\"../images/flag_deutsch_28x17.gif\" title=\"deutsch\"></a></li>");
  document.writeln("<li><a href=\"../fr/\"><img width=\"14\" height=\"8\" src=\"../images/flag_francais_28x17.gif\" title=\"français\"></li>");
  document.writeln("<li><a href=\"../es/\"><img width=\"14\" height=\"8\" src=\"../images/flag_espanol_28x17.gif\" title=\"español\"></li>");
  document.writeln("<li><a href=\"../en/\"><img width=\"14\" height=\"8\" src=\"../images/flag_english_28x17.gif\" title=\"english\"></a></li>");
  document.writeln("</ul>");
}

function searchform() {
  document.writeln("<form class=\"ym-searchform\">");
  document.writeln("<input class=\"ym-searchfield\" type=\"search\" placeholder=\"Search...\" />");
  document.writeln("<input class=\"ym-searchbutton\" type=\"submit\" value=\"Search\" />");
  document.writeln("</form>");
}

function footer() {
  document.writeln("<p>Search Portal for a <a href=\"http://yacy.net\">YaCy Search Engine</a> (GPL2) based on the <a href=\"https://gitorious.org/yacy/searchpage_template_yaml4\">searchpage_template_yaml4</a> (CC-BY 2.0) template and the <a href=\"http://yaml.de\">YAML4 CSS Framework</a> (CC-BY 2.0)</p>");
}

if (top != self) top.location.replace(location); // this will remove the google translate header if this page is rendered with the google translator

window.onscroll = function() {
  var footer = document.getElementById('footer');
  if (footer) {
    footer.style.position = 'fixed';
    footer.style.bottom = '0';
  }
}
