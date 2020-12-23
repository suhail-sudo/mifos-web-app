(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewOfficeController: function (scope, routeParams, route, location, resourceFactory,Upload,API_VERSION, $rootScope) {
            scope.charges = [];

            console.log(routeParams.id);
            resourceFactory.officeResource.get({isOutlet: routeParams.isOutlet}, {officeId: routeParams.id}, function (data) {
                scope.office = data;

                resourceFactory.profileBalanceResource.profileBalance({profileNo: scope.office.profile_no},function (data) {
                    console.log(data);
                    scope.profileBalance = data.data.balance;
                    scope.profileBalance= parseInt(scope.profileBalance)/100;
                });

                resourceFactory.uploadedSummaryResource.uploadedSummary({profileNo:scope.office.profile_no},function(data){
                    console.log(data);
                    scope.uploadedBatch = data.data;
                });
            });
            scope.isOutlet = routeParams.isOutlet;
            resourceFactory.DataTablesResource.getAllDataTables({apptable: 'm_office'}, function (data) {
                scope.officedatatables = data;
            });

            resourceFactory.profileSummaryResource.profileSummary({profileNo: routeParams.id},function (data) {
                console.log(data);
                scope.profileSummary = data.data;

            });

            var entityname="ADDRESS";
            scope.view = {};
            resourceFactory.officeTemplateResource.template(function (data) {
                scope.enableAddress=data.isAddressEnabled;
                if(scope.enableAddress===true){
                    resourceFactory.addressFieldConfiguration.get({entity:entityname},function(data){
                        for(var i=0;i<data.length;i++)
                        {
                            data[i].field='scope.view.'+data[i].field;
                            eval(data[i].field+"="+data[i].is_enabled);
                        }
                    })
                    resourceFactory.officeAddress.get({officeId:routeParams.id},function(data){
                        scope.addresses=data;
                    });
                }
            });

            scope.routeTo=function()
            {
                location.path('/address/office/'+ routeParams.id);
            }

            scope.ChangeAddressStatus=function(id,status,addressId)
            {
                var formdata = {};
                formdata.isActive=!status
                formdata.addressId=addressId
                resourceFactory.officeAddress.put({officeId:id},formdata,function(data)
                {
                    route.reload();
                })
            }

            scope.routeToEdit=function(type,addressId)
            {
                location.path('/editOfficeAddress/'+type+'/'+addressId+'/'+ routeParams.id);
            }

            scope.dataTableChange = function (officedatatable) {
                resourceFactory.DataTablesResource.getTableDetails({datatablename: officedatatable.registeredTableName,
                    entityId: routeParams.id, genericResultSet: 'true'}, function (data) {
                    scope.datatabledetails = data;
                    scope.datatabledetails.isData = data.data.length > 0 ? true : false;
                    scope.datatabledetails.isMultirow = data.columnHeaders[0].columnName == "id" ? true : false;
                    scope.showDataTableAddButton = !scope.datatabledetails.isData || scope.datatabledetails.isMultirow;
                    scope.showDataTableEditButton = scope.datatabledetails.isData && !scope.datatabledetails.isMultirow;
                    scope.singleRow = [];
                    for (var i in data.columnHeaders) {
                        if (scope.datatabledetails.columnHeaders[i].columnCode) {
                            for (var j in scope.datatabledetails.columnHeaders[i].columnValues) {
                                for (var k in data.data) {
                                    if (data.data[k].row[i] == scope.datatabledetails.columnHeaders[i].columnValues[j].id) {
                                        data.data[k].row[i] = scope.datatabledetails.columnHeaders[i].columnValues[j].value;
                                    }
                                }
                            }
                        }
                    }
                    if (scope.datatabledetails.isData) {
                        for (var i in data.columnHeaders) {
                            if (!scope.datatabledetails.isMultirow) {
                                var row = {};
                                row.key = data.columnHeaders[i].columnName;
                                row.value = data.data[0].row[i];
                                scope.singleRow.push(row);
                            }
                        }
                    }
                });
            };

            scope.deleteAll = function (apptableName, entityId) {
                resourceFactory.DataTablesResource.delete({datatablename: apptableName, entityId: entityId, genericResultSet: 'true'}, {}, function (data) {
                    route.reload();
                });
            };

            scope.viewDataTable = function (registeredTableName, data){
                if (scope.datatabledetails.isMultirow) {
                    location.path("/viewdatatableentry/"+registeredTableName+"/"+scope.office.id+"/"+data.row[0]);
                }else{
                    location.path("/viewsingledatatableentry/"+registeredTableName+"/"+scope.office.id);
                }
            };


            //Upload Bulk
            scope.formData = {};
            scope.onFileSelect = function (files) {
                console.log(files);
                scope.formData.file = files[0];
                console.log(scope.formData);
                if (scope.formData.file) {
                    console.log(scope.formData.file.name);
                    scope.upload();
                } else {
                    console.log('No File');
                }

                //console.log(scope.formData);
            };
            //Upload new Cards

            scope.upload = function () {
                console.log(scope.formData);
                if (scope.formData.file){
                    Upload.upload({
                        url: $rootScope.hostUrl + API_VERSION + '/cardoperations/bulkcardsupload',
                        data: {file: scope.formData.file},
                    }).then(function (data) {
                        console.log(data);
                        //scope.uploadedBatch = data.data;
                        swal({
                            title: "Successful",
                            text: data.message,
                            icon: "success",
                            button: "OK",
                            dangerMode: true,
                        }).then(function(){
                            resourceFactory.uploadedSummaryResource.uploadedSummary({profileNo:scope.office.profile_no},function(data){
                                console.log(data);
                                scope.uploadedBatch = data.data;
                            });
                            angular.element('#file').val('');
                        });
                        /*if (data.data.error===''){
                            swal({
                                title: 'Successful',
                                text: 'File Uploaded Successfully',
                                icon: 'success',
                                button: 'OK',
                            });
                        }else {
                            swal({
                                title: 'Not Successful',
                                text: data.data.error,
                                icon: 'error',
                                button: 'OK',
                                dangerMode: true,
                            });
                        } */
                        if (!scope.$$phase) {
                            scope.$apply();
                        }
                    });
                }else{
                    angular.element('#file').css('box-shadow','2px 2px 3px red');
                    swal({
                        title: "No File selected!",
                        text: "Select a File to Upload",
                        icon: "error",
                        button: "OK",
                        dangerMode: true,
                    }).then(function () {
                        angular.element('#file').css('box-shadow','none');
                    });
                }
            };
            
            scope.deductLoadFunc = function (event,batchID) {
                console.log(event.target.id);
                console.log(batchID);
                scope.actionData = {};

                scope.actionData.uploadDate = batchID;
                scope.actionData.command= event.target.id;

                resourceFactory.batchDeductLoadResource.batchDeductLoad(scope.actionData,function(data){
                    console.log(data);
                    swal({
                        title: "Successful",
                        text: data.message,
                        icon: "success",
                        button: "OK",
                        dangerMode: false,
                    }).then(function () {
                        resourceFactory.uploadedSummaryResource.uploadedSummary({profileNo:scope.office.profile_no},function(data){
                            console.log(data);
                            scope.uploadedBatch = data.data;
                        });
                        angular.element('#file').val('');
                    });
                });
            };
        }
    });
    mifosX.ng.application.controller('ViewOfficeController', ['$scope', '$routeParams', '$route', '$location', 'ResourceFactory','Upload','API_VERSION', '$rootScope', mifosX.controllers.ViewOfficeController]).run(function ($log) {
        $log.info("ViewOfficeController initialized");
    });
}(mifosX.controllers || {}));