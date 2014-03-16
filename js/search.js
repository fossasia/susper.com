/*
 * search.js
 * Functions for the searchpage_template_yaml4 web-page template index.html
 * First published 7.3.2013 at https://gitorious.org/yacy/searchpage_template_yaml4
 * (C) by Michael Peter Christen, licensed under a
 * Creative Commons Attribution 2.0 Generic License (CC-BY 2.0) 
 * If you enhance this, please clone the repository and give us a pull request!
 */

// static globals
var searchResult;   // the result of a search
var rowCollection;  // the collection of search result rows

function search(query, startRecord, maximumRecords, layout) {
  var navhtml = document.getElementById("searchnavigation");
  var resulthtml = document.getElementById("searchresults");
  if (navhtml != null) navhtml.innerHTML = "<p>loading...</p>";
  if (maximumRecords == "") maximumRecords = 10;
  if (startRecord == "") startRecord = 0;
  if (query == null) query == "";

  var siteModel = new ModifierModel({key:'site',query:query});
  var filetypeModel = new ModifierModel({key:'filetype',query:query});
  var ext = filetypeModel.attributes.value;
  var hl = (layout=="paragraph") ? 'true' : 'false';

  searchResult = new SearchModel({hl:hl,query:query,start:startRecord,rows:maximumRecords,servlet:"index.html",layout:layout}); 
  searchResult.fetch({
    success:function(searchResult) {
      navhtml.innerHTML = "<p>parsing result...</p>";
      rowCollection = new RowCollection({servlet:searchResult.attributes.servlet});
      rowCollection.add(searchResult.attributes.items);
      var totalResults = searchResult.attributes.totalResults.replace(/[,.]/,"");
      var navigation = searchResult.navigationCollection();
  
      // update navigation
      var topics = navigation.facet("topics");
      var sitefacet = navigation.facet("domains");
      var site = sitefacet ? sitefacet.facetElements() : {};
      for (var key in site) {if (query.indexOf("site:" + key) >= 0) delete site[key];}
      var filetypefacet = navigation.facet("filetypes");
      var filetypes = filetypefacet ? filetypefacet.facetElements() : {};
      for (var key in filetypes) {if (query.indexOf("filetype:" + key) >= 0) delete filetypes[key];}

      if (ext == "png" || ext == "gif" || ext == "jpg" || ext == "PNG" || ext == "GIF" || ext == "JPG") {
        document.getElementById("searchnavigation").innerHTML = "<p>found " + this.length + " images, preparing...</p>";
        resulthtml.innerHTML = rowCollection.resultImages();
        hideDownloadScript();
        navhtml.innerHTML = searchResult.fullPageNavigation("Image Matrix Size");
      } else if (layout=="paragraph") {
        document.getElementById("searchnavigation").innerHTML = "<p>found " + this.length + " images, preparing result list...</p>";
        resulthtml.innerHTML = rowCollection.resultList();
        hideScriptButton();
        navhtml.innerHTML = searchResult.fullPageNavigation("Result List Size");
      } else {
        document.getElementById("searchnavigation").innerHTML = "<p>found " + this.length + " documents, preparing table...</p>";
        resulthtml.innerHTML = rowCollection.resultTable();
        hideDownloadScript();
        navhtml.innerHTML = searchResult.fullPageNavigation("Result Table Size");
      }
      navhtml.innerHTML += searchResult.renderNavigation("Result Layout");
      if (filetypefacet) navhtml.innerHTML += filetypefacet.facetBox(searchResult.attributes.servlet, filetypeModel.attributes.key, filetypeModel.attributes.value, 8, searchResult);
      if (sitefacet) navhtml.innerHTML += sitefacet.facetBox(searchResult.attributes.servlet, siteModel.attributes.key, siteModel.attributes.value, 16, searchResult);
    }
  });
}

function makeDownloadScript() {
  document.getElementById("downloadscript").innerHTML = "<div><pre>" + rowCollection.resultScript(); + "</pre><br/></div>";
  document.getElementById("downloadbutton").innerHTML = "<input id=\"downloadbutton\" type=\"button\" value=\"hide the download script\" onClick=\"hideDownloadScript();\"/>";
}

function hideDownloadScript() {
  document.getElementById("downloadscript").innerHTML = "";
  var dlb = document.getElementById("downloadbutton");
  if (dlb) dlb.innerHTML = "<input type=\"button\" value=\"create a download script\" onClick=\"makeDownloadScript();\"/>";
}

function hideScriptButton() {
  document.getElementById("downloadscript").innerHTML = "";
  var dlb = document.getElementById("downloadbutton");
  if (dlb) dlb.innerHTML = "";
}