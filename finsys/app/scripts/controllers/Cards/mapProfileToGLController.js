(function (module) {
    mifosX.controllers = _.extend(module, {
        mapProfileToGLController: function (scope,$rootScope, resourceFactory,translate, location, $routeParams) {
            $rootScope.tempNodeID = -100; // variable used to store nodeID (from directive), so it(nodeID) is available for detail-table

            scope.coadata = [];
            scope.isTreeView = false;

            if (!scope.searchCriteria.acoa) {
                scope.searchCriteria.acoa = null;
                scope.saveSC();
            }
            scope.filterText = scope.searchCriteria.acoa;

            scope.onFilter = function () {
                scope.searchCriteria.acoa = scope.filterText || '';
                scope.saveSC();
            };

            scope.deepCopy = function (obj) {
                if (Object.prototype.toString.call(obj) === '[object Array]') {
                    var out = [], i = 0, len = obj.length;
                    for (; i < len; i++) {
                        out[i] = arguments.callee(obj[i]);
                    }
                    return out;
                }
                if (typeof obj === 'object') {
                    var out = {}, i;
                    for (i in obj) {
                        out[i] = arguments.callee(obj[i]);
                    }
                    return out;
                }
                return obj;
            }

            scope.ChartsPerPage = 15;
            scope.glAccountId='188';
            resourceFactory.accountCoaResource.getAllAccountCoas(scope.glAccountId,function (data) {
                //console.log('Initial Data');
                //console.log(data);
                scope.coadatas = scope.deepCopy(data);
                scope.ASSET = translate.instant('ASSET');

                //console.log('ASSET DATA');
                //console.log(scope.ASSET);

                scope.LIABILITY = translate.instant('LIABILITY');
                scope.EQUITY = translate.instant('EQUITY');
                scope.INCOME = translate.instant('INCOME');
                scope.EXPENSE = translate.instant('EXPENSE');
                scope.Accounting = translate.instant('Accounting');

                var assetObject = {id: -1, name: scope.ASSET, parentId: -999, children: []};

                setTimeout( function(){
                        for (var i in assetObject.children){
                            if (assetObject.children[i].name.toLowerCase().includes('profile')){
                                console.log('found');

                                scope.glAccounts = assetObject.children[i].children;
                                //console.log(scope.glAccounts);

                                for (var k in scope.glAccounts){
                                    angular.element('#glAccountId').append('<option value=' + scope.glAccounts[k].id + '>'
                                        + scope.glAccounts[k].name + '</option>');
                                }

                            }else{
                                console.log('not found');
                            }
                        }
                    }, 2500);

                var liabilitiesObject = {id: -2, name: scope.LIABILITY, parentId: -999, children: []};
                var equitiyObject = {id: -3, name: scope.EQUITY, parentId: -999, children: []};
                var incomeObject = {id: -4, name: scope.INCOME, parentId: -999, children: []};
                var expenseObject = {id: -5, name: scope.EXPENSE, parentId: -999, children: []};
                var rootObject = {id: -999, name: scope.Accounting, children: []};
                var rootArray = [rootObject, assetObject, liabilitiesObject, equitiyObject, incomeObject, expenseObject];

                var idToNodeMap = {};
                for (var i in rootArray) {
                    idToNodeMap[rootArray[i].id] = rootArray[i];
                }

                for (i = 0; i < data.length; i++) {
                    if (data[i].type.value == "ASSET") {
                        if (data[i].parentId == null)  data[i].parentId = -1;
                    } else if (data[i].type.value == "LIABILITY") {
                        if (data[i].parentId == null)  data[i].parentId = -2;
                    } else if (data[i].type.value == "EQUITY") {
                        if (data[i].parentId == null)  data[i].parentId = -3;
                    } else if (data[i].type.value == "INCOME") {
                        if (data[i].parentId == null)  data[i].parentId = -4;
                    } else if (data[i].type.value == "EXPENSE") {
                        if (data[i].parentId == null)  data[i].parentId = -5;
                    }
                    delete data[i].disabled;
                    delete data[i].manualEntriesAllowed;
                    delete data[i].type;
                    delete data[i].usage;
                    delete data[i].description;
                    delete data[i].nameDecorated;
                    delete data[i].tagId;
                    data[i].children = [];
                    idToNodeMap[data[i].id] = data[i];
                }

                function sortByParentId(a, b) {
                    return a.parentId - b.parentId;
                }

                data.sort(sortByParentId);
                var glAccountsArray = rootArray.concat(data);

                var root = [];
                for (var i = 0; i < glAccountsArray.length; i++) {
                    var currentObj = glAccountsArray[i];
                    if (typeof currentObj.parentId === "undefined") {
                        root.push(currentObj);
                    } else {
                        parentNode = idToNodeMap[currentObj.parentId];
                        parentNode.children.push(currentObj);
                        currentObj.collapsed = "true";
                    }
                }
                scope.treedata = root;
            });

            function toObject(arr) {
                var rv = {};
                for (var i = 0; i < arr.length; ++i) {
                    rv[i] = arr[i];
                }
                return rv;
            }

            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.officesarr = data;
                for (var i = 0; i < scope.officesarr.length; ++i) {
                    if (scope.officesarr[i].profile_no) {
                        angular.element('#officeId').append('<option value=' + scope.officesarr[i].id + '>' + scope.officesarr[i].name + '</option>');
                    }
                }

                scope.offices = toObject(scope.officesarr);
            });

            scope.profileData ={}
            scope.mapProfile = function () {
                console.log(scope.profileData);
                resourceFactory.mapProfileToGlAccountResource.mapToGlAccount(scope.profileData,function (data) {
                    console.log(data);
                    if(data.message.toLowerCase().includes('successfully')){
                        swal({
                            title: 'Successfully Mapped',
                            text: data.message,
                            icon: 'success',
                            button: 'OK',
                        }).then(function () {
                            location.path('/offices');
                        });
                    }else{
                        swal({
                            title:  'Error',
                            text: data.message,
                            icon: 'error',
                            button: 'OK',
                            dangerMode: true,
                        });
                    }
                });
            };
            angular.element(document).ready( function () {
                setTimeout(function(){
                    scope.validate = new jaidsValidator();
                    scope.validate.formValidationInit('mapProfileToGL', 'mapProfileBtn',  scope.mapProfile);
                },500);
            });
        }
    });
    mifosX.ng.application.controller('mapProfileToGLController', ['$scope','$rootScope', 'ResourceFactory','$translate', '$location', '$routeParams', mifosX.controllers.mapProfileToGLController]).run(function ($log) {
        $log.info("mapProfileToGLController initialized");
    });
}(mifosX.controllers || {}));