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
