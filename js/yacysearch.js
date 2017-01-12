"use strict"
/*
 * yacysearch.js
 * Models, Collections and Views for the yacy_webclient_bootstrap web-page templates
 * (C) 2014, 2015 by Michael Peter Christen, licensed under a
 * Creative Commons Attribution 2.0 Generic License (CC-BY 2.0)
 */

// model for search result evaluation

var SearchModel = Backbone.Model.extend({
  defaults:{hl:'false',query:'',start:'0',rows:'100',layout:'paragraph',startTime:new Date(),servlet:"index.html",contentdom:"text"},

  url:function(){
    u = searchURL + '&hl=false&wt=yjson&facet=true&facet.mincount=1&facet.field=host_s&facet.field=url_file_ext_s&facet.field=url_protocol_s&facet.field=author_sxt&facet.field=collection_sxt&start=' + this.attributes.start + '&rows=' + this.attributes.rows + '&query=' + this.attributes.query;
    if (this.attributes.layout == "images") u += "&fq=url_file_ext_s:(png+OR+jpeg+OR+jpg+OR+gif)";
    return u;
  },

  parse:function(resp){
    return resp[0].channels[0];
  },

  rowCollection:function(){
    var rc = new RowCollection();
    rc.add(this.attributes.items);
    return rc;
  },

  totalResults:function(){
    var tr = this.attributes.totalResults.replace(/[,.]/,"");
    if (this.rowCollection().length > tr) tr = this.rowCollection().length;
    return tr;
  },

  navigationCollection:function(){
    var navigationCollection = new NavigationCollection();
    navigationCollection.add(this.attributes.navigation);
    return navigationCollection;
  },

  renderNavigation:function(title, layout) {
    var html = "";
    // image navigation selection

    var u = this.attributes.servlet + "?query=" + this.attributes.query + "&startRecord=" + this.attributes.start;
    if (this.attributes.layout == "paragraph" || this.attributes.layout == "table") {
      html += "<button type=\"button\" class=\"btn btn-default active\">All</button>";
      html += "<button type=\"button\" class=\"btn btn-default\" onclick=\"window.location.href='" + u + "&maximumRecords=100&layout=images&contentdom=image'\">Images</button>";
    }
    if (this.attributes.layout == "images") {
      html += "<button type=\"button\" class=\"btn btn-default\" onclick=\"window.location.href='" + u + "&maximumRecords=10&layout=paragraph&contentdom=text'\">All</button>";
      html += "<button type=\"button\" class=\"btn btn-default active\">Images</button>";
    }


    // in case of document: document type navigation
    if (this.attributes.layout == "paragraph" || this.attributes.layout == "table") {
      var u = this.attributes.servlet + "?query=" + this.attributes.query + "&startRecord=" + this.attributes.start + "&maximumRecords=" + this.attributes.rows;
      html += "<p class=\"navbutton\"></p><div class=\"btn-group btn-group-justified\">";
      /*  if (this.attributes.layout == "paragraph") {
       html += "<div class=\"btn-group btn-group-xs\"><button type=\"button\" class=\"btn btn-default active\">Paragraph Layout</button></div>";
       html += "<div class=\"btn-group btn-group-xs\"><button type=\"button\" class=\"btn btn-default\" onclick=\"window.location.href='" + u + "&layout=table&contentdom=all'\">Table Layout</button></div>";
       }
       if (this.attributes.layout == "table") {
       html += "<div class=\"btn-group btn-group-xs\"><button type=\"button\" class=\"btn btn-default\" onclick=\"window.location.href='" + u + "&layout=paragraph&contentdom=text'\">Paragraph Layout</button></div>";
       html += "<div class=\"btn-group btn-group-xs\"><button type=\"button\" class=\"btn btn-default active\">Table Layout</button></div>";
       } */
      html += "</div>";
    }
    return html;
  }

});

var RowModel = Backbone.Model.extend({
  // default keys are: title, link, code, description, pubDate, size, sizename, guid, faviconCode, host, path, file, urlhash, ranking
  scriptline:function(type) {
    if (this.attributes.link == null) return "";
    if (this.attributes.link.indexOf("smb://") >= 0)
      return "smbget -n -a -r \"" + this.attributes.link + "\"";
    else
      return "curl -OL \"" + this.attributes.link + "\"";
  },

  renderRow:function(style) {
    var link = this.attributes.link;
    if (link == null || link == "") link = this.attributes.image;
    if (link == null) return "";
    var image = this.attributes.image ? this.attributes.image : link;
    var protocol = "";
    var host = "";
    // extract the path
    var path = link;
    var file = "";
    var p = link.indexOf("//");
    if (p > 0) {
      protocol = link.substring(0, p - 1);
      q = link.indexOf("/", p + 2);
      if (q > 0) {
        host = link.substring(p + 2, q);
        path = link.substring(q);
      } else {
        host = link.substring(p + 2);
        path = "/";
      }
    }
    var q = path.lastIndexOf("/");
    if (q > 0) {
      file = path.substring(q + 1);
      path = path.substring(0, q + 1);
    } else {
      file = path;
      path = "/";
    }
    var title = this.get("title");
    var description = this.get("description");
    path = unescape(path);
    var origpath = path; // save this for later in the link, this may be shortened now
    if (path.length >= 40) path = path.substring(0, 18) + "..." + path.substring(path.length - 19);
    if (title == "") title = path;
    if (title.length >= 130) title = title.substring(0, 65) + "..." + title.substring(title.length - 65);
    var pd = this.get("pubDate");
    if (pd == undefined) pd = "";
    var comma = pd.indexOf(",");
    if (comma > 0) pd = pd.substring(comma + 2);
    if (pd.substring(pd.length - 6) == " +0000") pd = pd.substring(0, pd.length - 6);
    var pdnt = pd;
    if ((p = pdnt.lastIndexOf(' ')) >= 0) pdnt = pdnt.substring(0, p);
    pd = pd.replace(" ","&nbsp;").replace(" ","&nbsp;").replace(" ","&nbsp;");

    // make table row
    var html = "";

    if (style == "paragraph" || style == "paragraph") {
      html += "<div class=\"searchresults\">";
      html += "<h4 class=\"linktitle\">";
      html += "<a href=\"" + link + "\" target=\"_self\">" + title + "</a></h4>";
      if (title != description) html += "<p class=\"snippet\"><span class=\"snippetLoaded\">" + description + "</span></p>";
      html += "<p class=\"url\"><a href=\"" + link + "\" target=\"_self\">" + link + "</a></p>";
      html += "<p class=\"urlinfo\">" + pdnt + "</p>";
      html += "</div>";
    }

    if (style == "imageCell") {
      if (file.length == 0 || file == "/") file = "[image]";
      html += "<a href=\"" + link + "\" name=\"" + file + "\">";
      html += "<img src=\"" + image + "\" width=\"96\" height=\"96\" />";
      html += "</a>";
    }

    // return entry
    return html;
  }
});

var RowCollection = Backbone.Collection.extend({
  model: RowModel,

  resultScript:function() {
    var script = "";
    for (var i = 0; i < this.length; i++) { script += this.at(i).scriptline() + "\n"; }
    return script;
  },

  resultList:function() {
    var html = "";
    if (this.length > 0) {
      for (var i = 0; i < this.length; i++) { html += this.at(i).renderRow("paragraph"); }
    }
    return html;
  },

  resultTable:function() {
    var html = "";
    if (this.length > 0) {
      for (var i = 0; i < this.length; i++) { html += this.at(i).renderRow("paragraph"); }
    }
    return html;
  },

  resultImages:function() {
    var html = "";
    for (var i = 0; i < this.length; i++) { html += this.at(i).renderRow("imageCell"); }
    return html;
  }
});

var FacetModel = Backbone.Model.extend({

  facetElements:function() {
    var elts = {};
    for (var fc = 0; fc < this.attributes.elements.length; fc++) {
      elts[this.attributes.elements[fc].name] = this.attributes.elements[fc].count;
    }
    return elts;
  },

  facetBox:function(servlet, modifierKey, modifierValue, maxfacets, search) {
    var html = "";

    var elements = this.facetElements();
    var extnav = "";
    var ftc = 0;
    for (var key in elements) if (elements[key] > 0)  ftc++;
    var display = ftc < maxfacets ? "block" : "none";
    ftc = 0;
    var query = decodeURIComponent(search.attributes.query);
    for (var key in elements) {
      if (elements[key] > 0)  {
        var keyquote = (key.indexOf(' ') > 0) ? "(" + key.replace(/ /g, " ") + ")" : key;
        if (keyquote == modifierValue) {
          var nq = servlet + "?query=" + query.substring(0, query.length - modifierKey.length - modifierValue.length - 1) + "&startRecord=" + search.attributes.start + "&maximumRecords=" + search.attributes.rows + "&layout=" + search.attributes.layout
          extnav += "<li style=\"display:" + display + "\" id=\"" + this.attributes.displayname + "_" + ftc + "\">";
          extnav += "<a href=\"" + nq + "\" class=\"MenuItemLink\"><input type=\"checkbox\" checked=\"checked\" onchange=\"window.location.href='" + nq + "'\"/> " + key + " (" + elements[key] + ")</a></li>";
        } else {
          var nq = servlet + "?query=" + query + " " + modifierKey + keyquote + "&startRecord=" + search.attributes.start + "&maximumRecords=" + search.attributes.rows + "&layout=" + search.attributes.layout
          extnav += "<li style=\"display:" + display + "\" id=\"" + this.attributes.displayname + "_" + ftc + "\">";
          extnav += "<a href=\"" + nq + "\" class=\"MenuItemLink\"><input type=\"checkbox\" onchange=\"window.location.href='" + nq + "'\"/> " + key + " (" + elements[key] + ")</a></li>";
        }
        ftc++;
      }
    }
    extnav = "<ul class=\"nav nav-sidebar menugroup\"><li style=\"cursor: pointer; cursor: hand;\"><h3 onclick=\"toggleVisibility('" + this.attributes.displayname + "', " + ftc + ");\">" + this.attributes.displayname + " [" + ftc + "] <span style=\"float:right\" id=\"chevron-" + this.attributes.displayname + "\" class=\"glyphicon glyphicon-chevron-down\" title=\"click to expand facet\"></span></h3></li>" + extnav + "</ul>";
    if (ftc >= 1) {
      html += extnav;
    }

    return html;
  },

  tagCloud:function(servlet, modifierKey, modifierValue, maxfacets, search) {
    var html = "";

    var elements = this.facetElements();
    var extnav = "";
    var ftc = 0;
    for (var key in elements) if (elements[key] > 0)  ftc++;
    var display = ftc < maxfacets ? "block" : "none";
    ftc = 0;
    var query = decodeURIComponent(search.attributes.query);
    for (var key in elements) {
      if (elements[key] > 0)  {
        var nq = servlet + "?query=" + query + " " + key + "&startRecord=" + search.attributes.start + "&maximumRecords=" + search.attributes.rows + "&layout=" + search.attributes.layout
        var newlink = "<a rel=\"" + elements[key] + "\" href=\"" + nq + "\" style=\"text-decoration:none;font-size:" + (7 + parseInt(elements[key])) + "px;\">" + key + "</a> ";
        extnav += newlink;
        ftc++;
      }
    }
    extnav = "<div id=\"tagcloud\" style=\"text-align:justify\">" + extnav + "</div>";
    if (ftc > 1) {
      html += extnav;
    }

    return html;
  }
});

var NavigationCollection = Backbone.Collection.extend({
  model:FacetModel,

  genericfacets:function() {
    var elts = [];
    var fc = 0;
    for (i = 0; i < this.length; i++) {
      var facet = this.at(i);
      var elements = facet.attributes.elements;
      if (elements[0].modifier === undefined) continue;
      var modifier = decodeURIComponent(elements[0].modifier);
      var mix = modifier.indexOf("/vocabulary", 0);
      if (mix == 0 || mix == 1) elts[fc++] = facet.attributes.facetname;
    }
    return elts;
  },

  facet:function(name){
    for (i = 0; i < this.length; i++) {
      var facet = this.at(i);
      var facetname = facet.attributes.facetname;
      if (facetname == name) return facet;
    }
    return null;
  }
});

var ModifierModel = Backbone.Model.extend({
  defaults:{key:'',value:'',query:''},
  initialize: function() {
    this.attributes.value = "";
    var matcher = " " + this.attributes.key;
    var query = decodeURIComponent(this.attributes.query);
    if (query.length > matcher.length) {
      for (var extl = 2; extl < 120; extl++) {
        if (query.length - matcher.length - extl < 0) break;
        var subquery = query.substring(query.length - matcher.length - extl, query.length - extl);
        if (subquery == matcher) {
          this.attributes.value = query.substring(query.length - extl);
          if (this.attributes.value.charAt(0) == '(') {
            p = this.attributes.value.indexOf(')');
            this.attributes.value = this.attributes.value.substring(0, p + 1);
          } else if ((p = this.attributes.value.indexOf(' ')) >= 0) {
            this.attributes.value = this.attributes.value.substring(0, p);
          }
          break;
        }
      }
    }
  }
});

// helper functions

function addHover() {
  if (document.all&&document.getElementById) {
    var divs = document.getElementsByTagName("div");
    for (i=0; i<divs.length; i++) {
      var node = divs[i];
      if (node.className=="searchresults") {
        node.onmouseover=function() {
          this.className+=" hover";
        }
        node.onmouseout=function() {
          this.className=this.className.replace(" hover", "");
        }
      }
    }
  }
}

function fadeOutBar() {
  if (document.getElementById("progressbar")) document.getElementById("progressbar").setAttribute('style',"transition:transform 0s;-webkit-transition:-webkit-transform 0s;backgroundColor:transparent;");
}

function statistics(startRecord, maximumRecords, totalcount, navurlbase) {
  if (totalcount == 0) return;
  if (startRecord >= 0) document.getElementById("startRecord").setAttribute('value', startRecord);

  // compose page navigation
  var results_from = parseInt(startRecord) + 1;
  var results_to = Math.min(parseInt(startRecord) + parseInt(maximumRecords), totalcount);
  document.getElementById("progressbar_text").innerHTML = "showing results " + results_from + " - " + results_to + " of " + totalcount;
  var resnavElement = document.getElementById("resNav");
  if (resnavElement != null) {
    var resnav = "<ul class=\"pagination\">";
    thispage = Math.floor(startRecord / maximumRecords);
    if (thispage == 0) {
      resnav += "<li class=\"disabled\"><a href=\"#\">&laquo;</a></li>";
    } else {
      resnav += "<li><a id=\"prevpage\" href=\"";
      resnav += (navurlbase + "&amp;startRecord=" + ((thispage - 1) * maximumRecords));
      resnav += "\">&laquo;</a></li>";
    }

    numberofpages = Math.floor(Math.min(10, 1 + ((totalcount - 1) / maximumRecords)));
    if (!numberofpages) numberofpages = 10;
    for (i = 0; i < numberofpages; i++) {
      if (i == thispage) {
        resnav += "<li class=\"active\"><a href=\"#\">";
        resnav += (i + 1);
        resnav += "</a></li>";
      } else {
        resnav += "<li><a href=\"";
        resnav += (navurlbase + "&amp;startRecord=" + (i * maximumRecords));
        resnav += "\">" + (i + 1) + "</a></li>";
      }
    }
    if (thispage >= numberofpages) {
      resnav += "<li><a href=\"#\">&raquo;</a></li>";
    } else {
      resnav += "<li><a id=\"nextpage\" href=\"";
      resnav += (navurlbase + "&amp;startRecord=" + ((thispage + 1) * maximumRecords));
      resnav += "\">&raquo;</a>";
    }
    resnav += "</ul>";
    resnavElement.innerHTML = resnav;
  }
}

function toggleVisibility(name, count) {
  if (document.getElementById(name + "_0").style.display == "none") {
    for (i = 0; i < count; i++) document.getElementById(name + "_" + i).style.display="block";
    document.getElementById("chevron-" + name).className = "glyphicon glyphicon-chevron-up";
  } else {
    for (i = 0; i < count; i++) document.getElementById(name + "_" + i).style.display="none";
    document.getElementById("chevron-" + name).className = "glyphicon glyphicon-chevron-down";
  }
}
