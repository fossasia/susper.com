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
    }
});

function execGet() {
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