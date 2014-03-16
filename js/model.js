/*
 * model.js
 * Models, Collections and Views for the searchpage_template_yaml4 web-page templates
 * First published 7.3.2013 at https://gitorious.org/yacy/searchpage_template_yaml4
 * (C) by Michael Peter Christen, licensed under a
 * Creative Commons Attribution 2.0 Generic License (CC-BY 2.0) 
 *
 * This code makes heavy use of the backbone.js library. Please see http://backbonejs.org
 * If you enhance this code, please clone the repository and give us a pull request!
 */

var server="localhost:8090";
//var server="141.52.175.63";


var SearchModel = Backbone.Model.extend({
    urlRoot:'http://' + server + '/yacysearch.json?callback=?',
    //urlRoot:'http://' + server + '/solr/select?wt=yjson&facet=true&facet.mincount=1&facet.field=url_file_ext_s&facet.field=host_s&callback=?',
    defaults:{hl:'false',query:'',start:'0',rows:'100',layout:'paragraph',startTime:new Date(),servlet:"index.html"},

    url:function(){
        return this.urlRoot + '&hl=' + this.attributes.hl + '&query=' + this.attributes.query + '&startRecord=' + this.attributes.start + '&maximumRecords=' + this.attributes.rows;
        //return this.urlRoot + '&hl=' + this.attributes.hl + '&query=' + this.attributes.query + '&start=' + this.attributes.start + '&rows=' + this.attributes.rows;
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

    fullPageNavigation:function(title) {
        var tr = this.totalResults();
        if (tr == 0) return "no results";
        var html = "";
        html += "<p>" + tr + "&nbsp;results, " + ((new Date()).getTime() - this.attributes.startTime.getTime()) + "&nbsp;ms</p>";
        html += "<div class=\"nav-wrapper\"><nav class=\"ym-vlist\"><h6 class=\"ym-vtitle\">" + title + "</h6><dl>";
        if (this.attributes.rows == 10) html += "<dt><input type=\"checkbox\" checked=\"checked\"></dt><dd>10 results</dd>";
        if (this.attributes.rows != 10 && tr >= 10) html += "<dt><input type=\"checkbox\" onClick=\"window.location.href='" + this.attributes.servlet + "?query=" + this.attributes.query + "&startRecord=" + this.attributes.start + "&maximumRecords=" + 10 + "&layout=" + this.attributes.layout+ "'\"></dt><dd>10 results</dd>";
        if (this.attributes.rows == 100) html += "<dt><input type=\"checkbox\" checked=\"checked\"></dt><dd>100 results</dd>";
        if (this.attributes.rows != 100 && tr >= 100) html += "<dt><input type=\"checkbox\" onClick=\"window.location.href='" + this.attributes.servlet + "?query=" + this.attributes.query + "&startRecord=" + this.attributes.start + "&maximumRecords=" + 100 + "&layout=" + this.attributes.layout+ "'\"></dt><dd>100 results</dd>";
        //if (this.attributes.rows == 1000) html += "<dt><input type=\"checkbox\" checked=\"checked\"></dt><dd>1000 results</dd>";
        //if (this.attributes.rows != 1000 && tr >= 1000) html += "<dt><input type=\"checkbox\" onClick=\"window.location.href='" + this.attributes.servlet + "?query=" + this.attributes.query + "&startRecord=" + this.attributes.start + "&maximumRecords=" + 1000 + "&layout=" + this.attributes.layout+ "'\"></dt><dd>1000 results</dd>";
        if (tr <= 1000 && this.attributes.rows < tr && tr >= 100) html += "<dt><input type=\"checkbox\" onClick=\"window.location.href='" + this.attributes.servlet + "?query=" + this.attributes.query + "&startRecord=" + this.attributes.start + "&maximumRecords=" + tr + "&layout=" + this.attributes.layout+ "'\"></dt><dd>all " + tr + " results</dd>";
        html += "</dl></nav></div>";
        return html;
    },

    renderNavigation:function(title, layout) {
        var html = "";
        html += "<div class=\"nav-wrapper\"><nav class=\"ym-vlist\"><h6 class=\"ym-vtitle\">" + title + "</h6><dl>";
        if (this.attributes.layout == "paragraph") html += "<dt><input type=\"radio\" checked=\"checked\"></dt><dd>Paragraph Layout</dd>";
        if (this.attributes.layout == "table") html += "<dt><input type=\"radio\" onClick=\"window.location.href='" + this.attributes.servlet + "?query=" + this.attributes.query + "&startRecord=" + this.attributes.start + "&maximumRecords=" + this.attributes.rows + "&layout=paragraph'\"></dt><dd>Paragraph Layout</dd>";
        if (this.attributes.layout == "table") html += "<dt><input type=\"radio\" checked=\"checked\"></dt><dd>Table Layout</dd>";
        if (this.attributes.layout == "paragraph") html += "<dt><input type=\"radio\" onClick=\"window.location.href='" + this.attributes.servlet + "?query=" + this.attributes.query + "&startRecord=" + this.attributes.start + "&maximumRecords=" + this.attributes.rows + "&layout=table'\"></dt><dd>Table Layout</dd>";
        html += "</dl></nav></div>";
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
    if (this.attributes.link == null) return "";
    var link = this.attributes.link;
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
    path = unescape(path);
    var origpath = path; // save this for later in the link, this may be shortened now
    if (path.length >= 40) path = path.substring(0, 18) + "..." + path.substring(path.length - 19);
    if (title == "") title = path;
    if (title.length >= 60) title = title.substring(0, 28) + "..." + title.substring(title.length - 29);
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
    if (style == "paragraph") {
      html += "<p>";
      html += "<h4><a class=\"sans headlinecolor\" href=\"" + link + "\" name=\"" + title + "\">" + title + "</a></h4>";
      html += "<a class=\"sans\" href=\"" + link + "\" name=\"" + link + "\">" + link + "</a><br/>";
      html += "<span class=\"sans\">" + this.attributes.description + "</span> <i>- " + pdnt + "</i>";
      html += "</p>";
    }
    if (style == "tableRow") {
      html += "<tr>";
      html += "<td><a class=\"sans headlinecolor\" href=\"" + protocol + "://" + host + "/" + "\">" + protocol + "://" + host + "</a></td>"; // Host
      html += "<td><a class=\"sans headlinecolor\" href=\"" + protocol + "://" + host + origpath + "\">" + path + "</a></td>"; // Path
      if (file.length == 0 || file == "/") file = "[index-file]";
      html += "<td><a class=\"sans linkcolor\" href=\"" + link + "\">" + file + "</a></td>"; // URL
      if (this.get("sizename") == "-1 byte") html += "<td></td>"; else html += "<td align=\"right\">" + this.get("sizename").replace(" ","&nbsp;").replace("byte","b") + "</td>"; // Size
      html += "<td align=\"right\">" + pd + "</td>"; // Date
      html += "</tr>";
    }
    if (style == "imageCell") {
      if (file.length == 0 || file == "/") file = "[image]";
      html += "<a href=\"" + link + "\" name=\"" + file + "\">";
      html += "<img src=\"" + link + "\" width=\"96\" height=\"96\" />";
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
      html += "<table class=\"narrow\">";
      html += "<thead><tr><th>Host</td><th>Path</td><th>File</td><th>Size</td><th>Date</td></tr></thead><tbody>";
      for (var i = 0; i < this.length; i++) { html += this.at(i).renderRow("tableRow"); }
      html += "</tbody></table>";
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
      for (var key in elements) {
          if (elements[key] > 0)  {
            if (maxfacets-- > 0) {
                extnav += "<dt><input type=\"checkbox\" name=\"" + this.attributes.displayname + "\" value=\"" + key + "\" onClick=\"window.location.href='" + servlet + "?query=" + search.attributes.query;
                extnav += " " + modifierKey + ":" + key + "&startRecord=" + search.attributes.start + "&maximumRecords=" + search.attributes.rows + "&layout=" + search.attributes.layout + "'\"></dt><dd>" + key + " (" + elements[key] + ")</dd>";
            }
            ftc++;
          }
      }

      extnav = "<div class=\"nav-wrapper\"><nav class=\"ym-vlist\"><h6 class=\"ym-vtitle\">" + this.attributes.displayname + " (" + ftc + ")</h6><dl>" + extnav;
      extnav += "</dl></nav></div>";

      if (ftc > 1) {
          html += extnav;
      } else {
          // check if there is an active constraint and offer a removal
          if (modifierValue != "") {
            var newQuery = search.attributes.query.substring(0, search.attributes.query.length - modifierKey.length - modifierValue.length - 2);
            html += "<div class=\"nav-wrapper\"><nav class=\"ym-vlist\"><h6 class=\"ym-vtitle\">" + this.attributes.displayname + "</h6><dl>";
            html += "<dt><input type=\"checkbox\" checked=\"checked\" name=\"" + this.attributes.displayname + "\" value=\"" + key;
            html += "\" onClick=\"window.location.href='" + servlet + "?query=" + newQuery;
            html += "&startRecord=" + search.attributes.start + "&maximumRecords=" + search.attributes.rows + "&layout=" + search.attributes.layout + "'\"></dt><dd>" + modifierKey + ":" + modifierValue + " (remove)</dd>";
            html += "</dl></nav></div>";
          }
      }

      return html;
    }
});

var NavigationCollection = Backbone.Collection.extend({
    model:FacetModel,

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
      var matcher = " " + this.attributes.key + ":";
      for (var extl = 2; extl < 30; extl++) {
        if (this.attributes.query.length >= matcher.length + 3 && this.attributes.query.substring(this.attributes.query.length - matcher.length - extl, this.attributes.query.length - extl) == matcher) {
          this.attributes.value = this.attributes.query.substring(this.attributes.query.length - extl);
          if ((p = this.attributes.value.indexOf(' ')) >= 0) this.attributes.value = this.attributes.value.substring(0, p);
          break;
        }
       }
    }
});

function execGet() {
  var query = new RegExp("[\\?&]query=([^&#]*)").exec(window.location.href);
  if (query != null) {
    var startRecord = new RegExp("[\\?&]startRecord=([^&#]*)").exec(window.location.href);
    if (startRecord == null) startRecord = 0; else startRecord = startRecord[1];
    var maximumRecords = new RegExp("[\\?&]maximumRecords=([^&#]*)").exec(window.location.href);
    if (maximumRecords == null) maximumRecords = 10; else maximumRecords = maximumRecords[1];
    var layout = new RegExp("[\\?&]layout=([^&#]*)").exec(window.location.href);
    if (layout == null) layout = "paragraph"; else layout = layout[1];
    document.getElementById("query").value=query[1].replace(/%20/g," ").replace(/\+/g," ").replace(/%3A/g,":").replace(/%2F/g,"/").replace(/%22/g,"\"");
    document.getElementById("maximumRecords").value=maximumRecords;
    document.getElementById("startRecord").value=startRecord;
    document.getElementById("layout").value=layout;
    search(document.getElementById("query").value, startRecord, maximumRecords,layout);
  }
}