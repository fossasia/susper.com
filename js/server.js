/*
 * server.js
 * Functions for the searchpage_template_yaml4 web-page templates
 * First published 7.3.2013 at https://gitorious.org/yacy/searchpage_template_yaml4
 * (C) by Michael Peter Christen, licensed under a
 * Creative Commons Attribution 2.0 Generic License (CC-BY 2.0) 
 * If you enhance this, please clone the repository and give us a pull request!
 */

var server="localhost:8090";


var SearchModel = Backbone.Model.extend({
    urlRoot:'http://' + server + '/solr/select?hl=false&wt=yjson&facet=true&facet.mincount=1&facet.field=url_file_ext_s&callback=?',
    defaults:{query:'',start:'0',rows:'100'},

    url:function(){
        return this.urlRoot + '&query=' + this.attributes.query + '&start=' + this.attributes.start + '&rows=' + this.attributes.rows;
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

    fullPageNavigation:function(maximumRecords) {
        var html = "";
        var tr = this.totalResults();
        if (tr > 0) {
          html += "<p>" + this.rowCollection().length + " results from a total of " + tr + " docs in index; search time: " + ((new Date()).getTime() - start.getTime()) + " milliseconds.</p>";
          html += "<div class=\"nav-wrapper\"><nav class=\"ym-vlist\"><h6 class=\"ym-vtitle\">Result Size</h6><dl>";
          if (maximumRecords == 10) html += "<dt><input type=\"checkbox\" checked=\"checked\"></dt><dd>10 results</dd>";
          if (maximumRecords != 10 && tr >= 10) html += "<dt><input type=\"checkbox\" onClick=\"window.location.href='yacytable.html?query=" + this.attributes.query + "&startRecord=" + this.attributes.start + "&maximumRecords=" + 10 + "'\"></dt><dd>10 results</dd>";
          if (maximumRecords == 100) html += "<dt><input type=\"checkbox\" checked=\"checked\"></dt><dd>100 results</dd>";
          if (maximumRecords != 100 && tr >= 100) html += "<dt><input type=\"checkbox\" onClick=\"window.location.href='yacytable.html?query=" + this.attributes.query + "&startRecord=" + this.attributes.start + "&maximumRecords=" + 100 + "'\"></dt><dd>100 results</dd>";
          if (maximumRecords == 1000) html += "<dt><input type=\"checkbox\" checked=\"checked\"></dt><dd>1000 results</dd>";
          if (maximumRecords != 1000 && tr >= 1000) html += "<dt><input type=\"checkbox\" onClick=\"window.location.href='yacytable.html?query=" + this.attributes.query + "&startRecord=" + this.attributes.start + "&maximumRecords=" + 1000 + "'\"></dt><dd>1000 results</dd>";
          if (tr <= 10000 && maximumRecords < tr && tr > 100) html += "<dt><input type=\"checkbox\" onClick=\"window.location.href='yacytable.html?query=" + this.attributes.query + "&startRecord=" + this.attributes.start + "&maximumRecords=" + tr + "'\"></dt><dd>all " + tr + " results</dd>";
          html += "</dl></nav></div>";
          return html;
        }
    }
});

var script = "";
var RowModel = Backbone.Model.extend({

  tablerow:function(type) {
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
    pd = pd.replace(" ","&nbsp;").replace(" ","&nbsp;").replace(" ","&nbsp;");
    
    // update download script
    if (link.indexOf("smb://") >= 0) script += "smbget -n -a -r \"" + link + "\"\n"; else script += "curl -OL \"" + link + "\"\n";
    
    // make table row
    var html = "";
    if (type == "row") {
      html += "<tr>";
      html += "<td><a class=\"searchresults\" href=\"" + protocol + "://" + host + "/" + "\">" + protocol + "://" + host + "</a></td>"; // Host
      html += "<td><a class=\"searchresults\" href=\"" + protocol + "://" + host + origpath + "\">" + path + "</a></td>"; // Path
      if (file.length == 0 || file == "/") file = "[index-file]";
      html += "<td><a class=\"searchresults\" href=\"" + link + "\">" + file + "</a></td>"; // URL
      if (this.get("sizename") == "-1 byte") html += "<td></td>"; else html += "<td align=\"right\">" + this.get("sizename") + "</td>"; // Size
      html += "<td align=\"right\">" + pd + "</td>"; // Date
      html += "</tr>";
    }
    if (type == "image") {
      var name = title;
      while ((p = name.indexOf("/")) >= 0) { name = name.substring(p + 1); }
      html += "<a href=\"" + link + "\" name=\"" + name + "\">";
      html += "<img src=\"" + link + "\" width=\"96\" height=\"96\" />";
      html += "</a>";
    }
      
    // return entry
    return html;
}
});

var RowCollection = Backbone.Collection.extend({
  model: RowModel,

  resultTable:function() {
    var html = "";
    if (this.length > 0) {
      document.getElementById("searchnavigation").innerHTML = "<p>found " + this.length + " documents, preparing table...</p>";
      html += "<table class=\"narrow\">";
      html += "<thead><tr><th>Host</td><th>Path</td><th>File</td><th>Size</td><th>Date</td></tr></thead><tbody>";
      for (var i = 0; i < this.length; i++) { html += this.at(i).tablerow("row"); }
      html += "</tbody></table>";
    }
    return html;
  },

  resultImages:function() {
    var html = "";
    document.getElementById("searchnavigation").innerHTML = "<p>found " + this.length + " images, preparing...</p>";
    for (var i = 0; i < this.length; i++) { html += this.at(i).tablerow("image"); }
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

    facetBox:function(facetName, modifier, query, startRecord, maximumRecords) {
      var html = "";

      var extnav = "<div class=\"nav-wrapper\"><nav class=\"ym-vlist\"><h6 class=\"ym-vtitle\">" + facetName + "</h6><dl>";
      var ftc = 0;
      var filetypes = this.facetElements();
      for (var key in filetypes) {
          if (filetypes[key] > 0)  {
            extnav += "<dt><input type=\"radio\" name=\"filetypes\" value=\"" + key + "\" onClick=\"window.location.href='yacytable.html?query=" + query;
            extnav += " filetype:" + key + "&startRecord=" + startRecord + "&maximumRecords=" + maximumRecords + "'\"></dt><dd>" + key + " (" + filetypes[key] + ")</dd>";
            ftc++;
          }
      }
      extnav += "</dl></nav></div>";

      if (ftc > 1) {
          html += extnav;
      } else {
          // check if there is a filetype constraint and offer a removal
          if (modifier != "") {
            html += "<div class=\"nav-wrapper\"><nav class=\"ym-vlist\"><h6 class=\"ym-vtitle\">Filetype</h6><dl>";
            html += "<dt><input type=\"checkbox\" checked=\"checked\" name=\"filetypes\" value=\"" + key;
            html += "\" onClick=\"window.location.href='yacytable.html?query=" + query.substring(0, query.length - modifier.length - 1);
            html += "&startRecord=" + startRecord + "&maximumRecords=" + maximumRecords + "'\"></dt><dd>" + modifier + " (remove)</dd>";
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

function execGet() {
  var query = new RegExp("[\\?&]query=([^&#]*)").exec(window.location.href);
  if (query != null) {
    var startRecord = new RegExp("[\\?&]startRecord=([^&#]*)").exec(window.location.href);
    if (startRecord == null) startRecord = 0; else startRecord = startRecord[1];
    var maximumRecords = new RegExp("[\\?&]maximumRecords=([^&#]*)").exec(window.location.href);
    if (maximumRecords == null) maximumRecords = 10; else maximumRecords = maximumRecords[1];
    document.getElementById("query").value=query[1].replace(/%20/g," ").replace(/\+/g," ");
    document.getElementById("maximumRecords").value=maximumRecords;
    document.getElementById("startRecord").value=startRecord;
    search(document.getElementById("query").value, maximumRecords, startRecord);
  }
}