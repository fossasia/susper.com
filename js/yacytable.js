/*
 * yacytable.js
 * Functions for the searchpage_template_yaml4 web-page template yacytable.html
 * First published 7.3.2013 at https://gitorious.org/yacy/searchpage_template_yaml4
 * (C) by Michael Peter Christen, licensed under a
 * Creative Commons Attribution 2.0 Generic License (CC-BY 2.0) 
 * If you enhance this, please clone the repository and give us a pull request!
 */


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

  var search = new SearchModel({query:search,start:offset,rows:count}); 
  search.fetch({
    success:function(search) {
      document.getElementById("searchnavigation").innerHTML = "<p>parsing result...</p>";
      var rowCollection = new RowCollection();
      rowCollection.add(search.attributes.items);
      var totalResults = search.attributes.totalResults.replace(/[,.]/,"");
      var navigation = search.navigationCollection();
  
      // update navigation
      //var topics = navigation.facet("topics");
      var filetypefacet = navigation.facet("filetypes");
      var filetypes = {};
      if (filetypefacet) {
        filetypes = filetypefacet.facetElements();
      }
      for (var key in filetypes) {
        if (query.indexOf("filetype:" + key) >= 0) delete filetypes[key];
      }

      script = ""; // this is a static global
      var modifier = "";
      var modifiertype = "";
      for (var extl = 2; extl < 6; extl++) {
        if (query.length >= 13 && query.substring(query.length - 10 - extl, query.length - extl) == " filetype:") {
          modifier = query.substring(query.length - 9 - extl);
          modifiertype = modifier.substring(modifier.length - extl);
          break;
        }
      }

      if (modifiertype == "png" || modifiertype == "gif" || modifiertype == "jpg" || modifiertype == "PNG" || modifiertype == "GIF" || modifiertype == "JPG") {
        document.getElementById("searchresults").innerHTML = rowCollection.resultImages();
      } else {
        document.getElementById("searchresults").innerHTML = rowCollection.resultTable();
      }
      document.getElementById("searchnavigation").innerHTML = search.fullPageNavigation(maximumRecords) + filetypefacet.facetBox("Filetype", modifier, query, startRecord, maximumRecords)
      hideDownloadScript();
    }
  });
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