$(document).ready(function () {
        //var isFirefox = typeof InstallTrigger !== 'undefined';

        //if (isFirefox === false) {
        //    $("#set-susper-default").remove();
        //    $(".input-group-btn").addClass("align-search-btn");
        //    $("#navbar-search").addClass("align-navsearch-btn");
        //}

        if (window.external && window.external.IsSearchProviderInstalled) {
            var isInstalled = window.external.IsSearchProviderInstalled("http://susper.com");

            if (!isInstalled) {
                $("#set-susper-default").show();
            }
        }

        $("#install-susper").on("click", function () {
            window.external.AddSearchProvider("http://susper.com/susper.xml");
        });

        $("#cancel-installation").on("click", function () {
            $("#set-susper-default").remove();
        });
    });
