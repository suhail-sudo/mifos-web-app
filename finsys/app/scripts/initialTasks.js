
(function (mifosX) {
    var defineHeaders = function ($httpProvider, $translateProvider, ResourceFactoryProvider, HttpServiceProvider, $idleProvider, $keepaliveProvider, IDLE_DURATION, WARN_DURATION, KEEPALIVE_INTERVAL) {
        var mainLink = getLocation(window.location.href);
        var host = "";
        var portNumber = "";
        //accessing from openmf server
        if (mainLink.hostname.indexOf('openmf.org') >= 0) {
            var hostname = window.location.hostname;
            console.log('hostname---' + hostname);
            domains = hostname.split('.');
            console.log('domains---' + domains);
            // For multi tenant hosting
            if (domains[0] == "demo") {
                $httpProvider.defaults.headers.common['Fineract-Platform-TenantId'] = 'default';
                $httpProvider.defaults.headers.common['channelType'] = 'web';
                ResourceFactoryProvider.setTenantIdenetifier('default');
                console.log("demo server", domains[0]);
            } else {
                $httpProvider.defaults.headers.common['Fineract-Platform-TenantId'] = domains[0];
                $httpProvider.defaults.headers.common['channelType'] = 'web';
                ResourceFactoryProvider.setTenantIdenetifier(domains[0]);
                console.log("other than demo server", domains[0]);
            }
            $httpProvider.defaults.headers.common['channelType'] = "web";
            console.log('hostname from mainLink = ', host);
        }
        //accessing from a file system or other servers
        else {
            if (mainLink.hostname != "") {
                baseApiUrl = "https://" + mainLink.hostname + (mainLink.port ? ':' + mainLink.port : '');
            }

            if (QueryParameters["baseApiUrl"]) {
                baseApiUrl = QueryParameters["baseApiUrl"];
            }
            var queryLink = getLocation(baseApiUrl);
            //host = "https://" + queryLink.hostname + (queryLink.port ? ':' + queryLink.port : '');
            //host = "https://localhost:8443";
            host = "https://scb.project-demo.app";
            console.log('hostname from mainLink = ', host);
            portNumber = queryLink.port;
            $httpProvider.defaults.headers.common['channelType'] = "web";
            $httpProvider.defaults.headers.common['Fineract-Platform-TenantId'] = 'default';
            $httpProvider.defaults.headers.common['channelType'] = 'web';
            ResourceFactoryProvider.setTenantIdenetifier('default');
            if (QueryParameters["tenantIdentifier"]) {
                $httpProvider.defaults.headers.common['Fineract-Platform-TenantId'] = QueryParameters["tenantIdentifier"];
                $httpProvider.defaults.headers.common['channelType'] = 'web';
                ResourceFactoryProvider.setTenantIdenetifier(QueryParameters["tenantIdentifier"]);
            }
        }
        console.log(host);
        ResourceFactoryProvider.setBaseUrl(host);
        HttpServiceProvider.addRequestInterceptor('demoUrl', function (config) {
            console.log(host);
            return _.extend(config, {url: host + config.url });
        });

        // Enable CORS! (see e.g. http://enable-cors.org/)
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];

        //Set headers
        $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
        $httpProvider.defaults.headers.common['channelType'] = "web";

        // Configure i18n and preffer language
        //$translateProvider.translations('en', translationsEN);
        //$translateProvider.translations('de', translationsDE);
        $translateProvider.useSanitizeValueStrategy('escaped');
        $translateProvider.useStaticFilesLoader({
            prefix: 'global-translations/locale-',
            suffix: '.json'
        });

        $translateProvider.preferredLanguage('en');
        $translateProvider.fallbackLanguage('en');
        //Timeout settings.
        $idleProvider.idleDuration(IDLE_DURATION); //Idle time 
        $idleProvider.warningDuration(WARN_DURATION); //warning time(sec)
        $keepaliveProvider.interval(KEEPALIVE_INTERVAL); //keep-alive ping
    };
    mifosX.ng.application.config(defineHeaders).run(function ($log, $idle) {
        $log.info("Initial tasks are done!");
        $idle.watch();
    });
}(mifosX || {}));

getLocation = function (href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
};

QueryParameters = (function () {
    var result = {};
    if (window.location.search) {
        // split up the query string and store in an associative array
        var params = window.location.search.slice(1).split("&");
        for (var i = 0; i < params.length; i++) {
            var tmp = params[i].split("=");
            result[tmp[0]] = unescape(tmp[1]);
        }
    }
    return result;
}());
