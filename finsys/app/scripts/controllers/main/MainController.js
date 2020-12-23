(function (module) {
    mifosX.controllers = _.extend(module, {
        MainController: function (scope, location, sessionManager, translate, $rootScope, localStorageService, keyboardManager, $idle, tmhDynamicLocale,
                  uiConfigService, $http) {
            $http.get('release.json').success(function(data) {
                scope.version = data.version;
                scope.releasedate = data.releasedate;
            });
            
            if (typeof JSON.clone !== "function") {
                JSON.clone = function(obj) {
                    return JSON.parse(JSON.stringify(obj));
                };
            }

            scope.islogofoldernamefetched = false;
            scope.islogofoldernameconfig = false;
            scope.isFaviconPath = false;
            scope.isHeaderLogoPath = false;
            scope.isBigLogoPath = false;
            scope.isLargeLogoPath = false;

            if(!scope.islogofoldernamefetched && $rootScope.tenantIdentifier && $rootScope.tenantIdentifier != "default"){
                scope.islogofoldernamefetched = true;
                $http.get('scripts/config/LogoConfig.json').success(function(datas) {
                    for(var i in datas){
                        var data = datas[i];
                        if(data.tenantIdentifier != undefined && data.tenantIdentifier == $rootScope.tenantIdentifier){
                            if(data.logofoldername != undefined && data.logofoldername != ""){
                                scope.islogofoldernameconfig = true;
                                scope.logofoldername = data.logofoldername;
                                if(data.faviconPath){
                                    scope.isFaviconPath = true;
                                    scope.faviconPath = data.faviconPath;
                                }
                                if(data.bigLogoPath){
                                    scope.isBigLogoPath = true;
                                    scope.bigLogoPath = data.bigLogoPath;
                                }
                                if(data.headerLogoPath){
                                    scope.isHeaderLogoPath = true;
                                    scope.headerLogoPath = data.headerLogoPath;
                                }
                                if(data.largeLogoPath){
                                    scope.isLargeLogoPath = true;
                                    scope.largeLogoPath = data.largeLogoPath;
                                }
                            }
                        }
                    }
                });
            }

            scope.$on('scrollbar.show', function(){
                  console.log('Scrollbar show');
                });
            scope.$on('scrollbar.hide', function(){
                  console.log('Scrollbar hide');
                });

            uiConfigService.init();
            //hides loader
            scope.domReady = true;
            scope.activity = {};
            scope.activityQueue = [];
            if (localStorageService.getFromLocalStorage('Location')) {
                scope.activityQueue = localStorageService.getFromLocalStorage('Location');
            }
            scope.loadSC = function () {
                if (!localStorageService.getFromLocalStorage('searchCriteria'))
                    localStorageService.addToLocalStorage('searchCriteria', {})
                scope.searchCriteria = localStorageService.getFromLocalStorage('searchCriteria');
            };
            scope.saveSC = function () {
                localStorageService.addToLocalStorage('searchCriteria', scope.searchCriteria);
            };
            scope.loadSC();
            scope.setDf = function () {
                if (localStorageService.getFromLocalStorage('dateformat')) {
                    scope.dateformat = localStorageService.getFromLocalStorage('dateformat');
                } else {
                    localStorageService.addToLocalStorage('dateformat', 'dd MMMM yyyy');
                    scope.dateformat = 'dd MMMM yyyy';
                }
                scope.df = scope.dateformat;
                scope.dft = scope.dateformat + ' ' + 'HH:mm:ss'
            };

            scope.updateDf = function(dateFormat){
                localStorageService.addToLocalStorage('dateformat', dateFormat);
                scope.dateformat = dateFormat;
                scope.setDf();
            };
            scope.setDf();
            $rootScope.setPermissions = function (permissions) {
                $rootScope.permissionList = permissions;
                localStorageService.addToLocalStorage('userPermissions', permissions);
                $rootScope.$broadcast('permissionsChanged')
            };

            $rootScope.hasPermission = function (permission) {
                permission = permission.trim();
                //FYI: getting all permissions from localstorage, because if scope changes permissions array will become undefined
                $rootScope.permissionList = localStorageService.getFromLocalStorage('userPermissions');
                //If user is a Super user return true
                if ($rootScope.permissionList && _.contains($rootScope.permissionList, "ALL_FUNCTIONS")) {
                    return true;
                } else if ($rootScope.permissionList && permission && permission != "") {
                    //If user have all read permission return true
                    if (permission.substring(0, 5) == "READ_" && _.contains($rootScope.permissionList, "ALL_FUNCTIONS_READ")) {
                        return true;
                    } else if (_.contains($rootScope.permissionList, permission)) {
                        //check for the permission if user doesn't have any special permissions
                        return true;
                    } else {
                        //return false if user doesn't have permission
                        return false;
                    }
                } else {
                    //return false if no value assigned to has-permission directive
                    return false;
                }
                ;
            };

            scope.$watch(function () {
                return location.path();
            }, function () {
                scope.activity = location.path();
                scope.activityQueue.push(scope.activity);
                localStorageService.addToLocalStorage('Location', scope.activityQueue);
            });

            //Logout the user if Idle
            scope.started = false;
            scope.$on('$idleTimeout', function () {
                scope.logout();
                $idle.unwatch();
                scope.started = false;
            });
            
            $rootScope.$on("SessionExpiredEvent", function (event, data) {
                scope.logout();
             });

            // Log out the user when the window/tab is closed.
            window.onunload = function () {
                scope.logout();
                $idle.unwatch();
                scope.started = false;
            };

            scope.start = function (session) {
                if (session) {
                    $idle.watch();
                    scope.started = true;
                }
            };

            scope.leftnav = false;
            scope.$on("UserAuthenticationTwoFactorRequired", function (event, data) {
                if (sessionManager.get(data)) {
                    scope.start(scope.currentSession);
                }
            });

            scope.$on("UserAuthenticationSuccessEvent", function (event, data) {
                scope.authenticationFailed = false;
                scope.resetPassword = data.shouldRenewPassword;
                if (sessionManager.get(data)) {
                    //console.log(data);
                    localStorageService.addToLocalStorage('uRole',data.roles[0].name);
                    scope.currentSession = sessionManager.get(data);
                    scope.start(scope.currentSession);
                    if (scope.currentSession.user && scope.currentSession.user.userPermissions) {
                        $rootScope.setPermissions(scope.currentSession.user.userPermissions);
                    }
                    $rootScope.officeId = data.officeId;
                    location.path('/home').replace();
                } else {
                    scope.loggedInUserId = data.userId;
                }
                ;
            });

            var setSearchScopes = function () {
                var all = {name: "label.search.scope.all", value: "clients,clientIdentifiers,groups,savings,shares,loans"};
                var clients = {
                    name: "label.search.scope.clients.and.clientIdentifiers",
                    value: "clients,clientIdentifiers"
                };
                var groups = {
                    name: "label.search.scope.groups.and.centers",
                    value: "groups"
                };
                var savings = {name: "label.input.adhoc.search.loans", value: "loans"};
                var shares = {name: "label.search.scope.shares", value: "shares"};
                var loans = {name: "label.search.scope.savings", value: "savings"};
                scope.searchScopes = [all,clients,groups,loans,savings,shares];
                scope.currentScope = all;
            }

            setSearchScopes();

            scope.changeScope = function (searchScope) {
                scope.currentScope = searchScope ;
            }

            scope.search = function () {
                var resource;
                var searchString=scope.search.query;
                var exactMatch=false;
                if(searchString != null){
                    searchString = searchString.replace(/(^"|"$)/g, '');
                    var n = searchString.localeCompare(scope.search.query);
                    if(n!=0)
                    {
                        exactMatch=true;
                    }
                }
                location.path('/search/' + searchString).search({exactMatch: exactMatch, resource: scope.currentScope.value});

            };
           /*scope.text = '<span>FinSys is powered by Mifos and enabled by <a href="https://www.openfactorgroup.com/">OpenFactor Technology Group</a>.' +
						'<br/> OpenFactor business objective includes reducing the cost barrier for ' +
						'financial inclusion and digital enablement for financial services providers.</span><br/>'; */

            scope.logout = function () {
                $rootScope.$broadcast("OnUserPreLogout");
                scope.currentSession = sessionManager.clear();
                scope.resetPassword = false;
                location.path('/').replace();
            };

            scope.langs = mifosX.models.Langs;
            if (localStorageService.getFromLocalStorage('Language')) {
                var temp = localStorageService.getFromLocalStorage('Language');
                for (var i in mifosX.models.Langs) {
                    if (mifosX.models.Langs[i].code == temp.code) {
                        scope.optlang = mifosX.models.Langs[i];
                        tmhDynamicLocale.set(mifosX.models.Langs[i].code);
                        }
                }
            } else {
                scope.optlang = scope.langs[0];
                tmhDynamicLocale.set(scope.langs[0].code);
                }
            translate.use(scope.optlang.code);

            scope.isActive = function (route) {
                if (route == 'clients') {
                    var temp = ['/clients', '/groups', '/centers'];
                    for (var i in temp) {
                        if (temp[i] == location.path()) {
                            return true;
                        }
                    }
                }
                else if (route == 'acc') {
                    var temp1 = ['/accounting', '/freqposting', '/accounting_coa', '/journalentry', '/accounts_closure', '/Searchtransaction', '/accounting_rules'];
                    for (var i in temp1) {
                        if (temp1[i] == location.path()) {
                            return true;
                        }
                    }
                }
                else if (route == 'rep') {
                    var temp2 = ['/reports/all', '/reports/clients', '/reports/loans', '/reports/funds', '/reports/accounting', 'reports/savings'];
                    for (var i in temp2) {
                        if (temp2[i] == location.path()) {
                            return true;
                        }
                    }
                }
                else if (route == 'admin') {
                    var temp3 = ['/users/', '/organization', '/system', '/products', '/global'];
                    for (var i in temp3) {
                        if (temp3[i] == location.path()) {
                            return true;
                        }
                    }
                }
                else {
                    var active = route === location.path();
                    return active;
                }
            };

            keyboardManager.bind('ctrl+shift+n', function () {
                location.path('/nav/offices');
            });
            keyboardManager.bind('ctrl+shift+i', function () {
                location.path('/tasks');
            });
            keyboardManager.bind('ctrl+shift+o', function () {
                location.path('/entercollectionsheet');
            });
            keyboardManager.bind('ctrl+shift+c', function () {
                location.path('/createclient');
            });
            keyboardManager.bind('ctrl+shift+g', function () {
                location.path('/creategroup');
            });
            keyboardManager.bind('ctrl+shift+q', function () {
                location.path('/createcenter');
            });
            keyboardManager.bind('ctrl+shift+f', function () {
                location.path('/freqposting');
            });
            keyboardManager.bind('ctrl+shift+e', function () {
                location.path('/accounts_closure');
            });
            keyboardManager.bind('ctrl+shift+j', function () {
                location.path('/journalentry');
            });
            keyboardManager.bind('ctrl+shift+a', function () {
                location.path('/accounting');
            });
            keyboardManager.bind('ctrl+shift+r', function () {
                location.path('/reports/all');
            });
            keyboardManager.bind('ctrl+s', function () {
                document.getElementById('save').click();
            });
            keyboardManager.bind('ctrl+r', function () {
                document.getElementById('run').click();
            });
            keyboardManager.bind('ctrl+shift+x', function () {
                document.getElementById('cancel').click();
            });
            keyboardManager.bind('ctrl+shift+l', function () {
                document.getElementById('logout').click();
            });
            keyboardManager.bind('alt+x', function () {
                document.getElementById('search').focus();
            });
            keyboardManager.bind('ctrl+shift+h', function () {
                document.getElementById('help').click();
            });
            keyboardManager.bind('ctrl+n', function () {
                document.getElementById('next').click();
            });
            keyboardManager.bind('ctrl+p', function () {
                document.getElementById('prev').click();
            });
            scope.changeLang = function (lang, $event) {
                translate.use(lang.code);
                localStorageService.addToLocalStorage('Language', lang);
                tmhDynamicLocale.set(lang.code);
                scope.optlang = lang;
                };
            scope.helpf = function()
            {
                // first, create addresses array
                var addresses = ["https://open-confluence.atlassian.net/wiki/spaces/OP/pages/254378219/Add+Customer",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/254345336/Manage+Customer",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/254378123/Import+Customer",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/259817546/Manage+group",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/254378136/Create+group",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/259817552/Manage+center",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/259817556/Create+centre",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/267255977/Standing+Instruction+History",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/267550723/Products",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/267288585/Loans",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/267255839/Savings",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/254378023/Fixed+deposit",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/267386892/Recurring+Deposit",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/254378027/Share",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/266436631/Charges",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/266436635/Floating+rates",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/267288607/Product+tax",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/270237773/Services",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/267321680/Teller+Operations",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/267255997/Outlet",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/267256010/Agent",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/254345409/Limit",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/254378271/Fees+Charges",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/259686685/Devices",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/272990209/Consumer+Limits-+Office",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/273186825/Add+User",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/273055759/Manage+User",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/273416205/Password+Preferences",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/273350671/Manage+Employees",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/272957483/Roles+and+Permission",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/273317951/Authorization",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/273121351/Audit+Trail",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/273416266/Accounting",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/273023076/Chart+of+Accounts",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/272957499/Loan+Provisioning",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/273317968/Fund+Sources",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/273055822/Fund+Mapping",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/273383485/Journal+Entries",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/273023098/Search+Journal+Entries",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/273350723/GL+Mapping",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/272957540/GL+Balance+Migration",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/273416373/End+of+Cycle+-+Account+Closure",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/273055858/Accounting+Rules",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/273350768/Frequent+Posting",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/273055881/Provisioning+Entries",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/272990335/Accruals",
                    "https://open-confluence.atlassian.net/wiki/spaces/OP/pages/273186974/Reports"];

                var addrmodels = ['/createclient/','/clients/','/bulkimportclients/','/groups/','/creategroup/','/centers/',
                    '/createcenter/','/standinginstructions/history/','/products/','/loanproducts/','/savingproducts/',
                    '/fixeddepositproducts/','/recurringdepositproducts/','/shareproducts/','/charges./','/productmix/',
                    '/floatingrates/','/taxconfiguration/','/organization/','/tellers/','/offices?isOutlet=true/','/agents/',
                    '/ruleconfig/','/charges/','/couriers/','/device/','/consumelimits/Office/','/createuser/','/users/',
                    '/passwordpreferences/','/employees/','/roles/','/viewmctasks/','/audit/','/accounting/','/accounting_coa/',
                    '/viewallprovisionings/','/managefunds/','/advsearch/','/journalentry/','/searchtransaction/',
                    '/financialactivityaccountmappings/','/openingbalances/','/accounts_closure/','/add_accrule/',
                    '/freqposting/','/viewprovisioningentries/','/run_periodic_accrual/','/reports/'];

                var actualadr = location.absUrl();  // get full URL
                var lastchar = 0;
                for( var i = 0; i<actualadr.length;i++)
                {

                    if(actualadr.charAt(i) == '#')
                    {
                        lastchar = i+1;
                        break;
                        // found '#' and save position of it
                    }
                }//for

                var whereweare = actualadr.substring(lastchar); // cut full URL to after-'#' part

                // string after '#' is compared with model
                var addrfound = false;
                if(whereweare == '/reports/all' || whereweare == '/reports/clients' || whereweare == '/reports/loans' || whereweare == '/reports/savings' || whereweare == '/reports/funds' || whereweare == '/reports/accounting' || whereweare == '/xbrl'  )
                {
                    window.open(addresses[addrmodels.length-1]);
                    addrfound = true;
                }// '/reports/...' are exception -> link to Search in Documentation word 'report'
                else{
                    for(var i = 0; i< addrmodels.length; i++)
                    {
                        //if(i != 5 && i != 10)
                        //{
                        if(addrmodels[i].indexOf(whereweare) != -1)
                        {
                            addrfound = true;
                            window.open(addresses[i]);
                            break;
                            // model found -> open address and break
                        }
                        //}
                    }//for
                }//else
                if(addrfound == false) window.open(addresses[0]); // substring not matching to any model -> open start user manual page

            };//helpf


            sessionManager.restore(function (session) {
                scope.currentSession = session;
                scope.start(scope.currentSession);
                if (session.user != null && session.user.userPermissions) {
                    $rootScope.setPermissions(session.user.userPermissions);
                    localStorageService.addToLocalStorage('userPermissions', session.user.userPermissions);
                }
                ;
            });
        }
    });
    mifosX.ng.application.controller('MainController', [
        '$scope',
        '$location',
        'SessionManager',
        '$translate',
        '$rootScope',
        'localStorageService',
        'keyboardManager', '$idle',
        'tmhDynamicLocale',
        'UIConfigService',
        '$http',
        mifosX.controllers.MainController
    ]).run(function ($log) {
        $log.info("MainController initialized");
    });
}(mifosX.controllers || {}));
