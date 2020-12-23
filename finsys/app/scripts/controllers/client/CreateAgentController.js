(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateAgentController: function (scope, resourceFactory, location, http, dateFilter, API_VERSION, Upload, $rootScope, routeParams, WizardHandler) {

            scope.offices = [];
            scope.staffs = [];
            scope.savingproducts = [];
            scope.first = {};
            scope.first.date = new Date();
            scope.first.submitondate = new Date ();
            scope.formData = {};
            scope.formDat = {};
            scope.clientNonPersonDetails = {};
            scope.restrictDate = new Date();
            scope.showSavingOptions = false;
            scope.savings = {};
            scope.savings.opensavingsproduct = false;
            scope.forceOffice = null;
            scope.showNonPersonOptions = true;
            scope.showAccountDetails = false;
            //address
            scope.addressTypes=[];
            scope.countryOptions=[];
            scope.stateOptions=[];
            scope.addressTypeId={};
            entityname="ADDRESS";
            scope.addressArray=[];
            scope.formData.address=[];
            //familymembers
            scope.formData.familyMembers=[];
            scope.familyArray=[];
            scope.datatables = [];
            scope.noOfTabs = 1;
            scope.step = '-';
            scope.formData.datatables = [];
            scope.formDat.datatables = [];
            scope.tf = "HH:mm";
            scope.clientId = routeParams.clientId;
            scope.clientsPerPage = 10;
            scope.pageNumber = 1;
            scope.agentPerm = $rootScope.hasPermission('CREATE_AGENT');
            scope.subAgentPerm = $rootScope.hasPermission('CREATE_SUBAGENT');
            scope.createSubAgent = routeParams.isSubAgent=="true";
            if(scope.agentPerm && scope.subAgentPerm){
            	scope.allPerm = true;
            }
            if(!scope.agentPerm && scope.subAgentPerm){
            	scope.createSubAgent = true;
            }
            
            var requestParams = {staffInSelectedOfficeOnly:true};
            if (routeParams.groupId) {
                requestParams.groupId = routeParams.groupId;
            }
            if (routeParams.officeId) {
                requestParams.officeId = routeParams.officeId;
            }
            
            scope.addAddress=function()
            {
            	scope.addressArray=[];
                scope.addressArray.push({});
            }
            resourceFactory.clientTemplateResource.get(requestParams, function (data) {
                scope.offices = data.officeOptions;
                scope.staffs = data.staffOptions;
                scope.formData.officeId = scope.offices[0].id;
                scope.savingproducts = _.reject(data.savingProductOptions, function(product){
                    return product.isPrimary != true;
                });
                scope.genderOptions = data.genderOptions;
                scope.clientTypeOptions = data.clientTypeOptions;
                // for(var i=0; i<scope.savingproducts.length; i++) {
                //     if(scope.savingproducts[i].isPrimary == true){
                //         scope.formData.savingsProductId = scope.savingproducts[i].id;
                //         break;
                //     }
                // }
                
                if(scope.createSubAgent && scope.subAgentPerm){
                	scope.clientTypeOptions = _.reject(scope.clientTypeOptions, function(num){ return num.name == 'Agent'; });
                	scope.showNonPersonOptions = false;
                }
                
                for(var i=0; i<data.clientTypeOptions.length; i++) {
                	if(data.clientTypeOptions[i].name == 'Agent') {
                		scope.formData.clientTypeId = data.clientTypeOptions[i].id;
                		scope.agentTypeId = scope.formData.clientTypeId;
                    }
                    
                    if(data.clientTypeOptions[i].name == 'Sub Agent') {
                		scope.subAgentTypeId = data.clientTypeOptions[i].id;
                	}	
                }
                if(scope.createSubAgent){
                    scope.formData.clientTypeId = scope.subAgentTypeId;
                }
                scope.displayPersonOrNonPersonOptions();
                scope.applicableAgentCommissions =  data.applicableAgentCommissions;
                scope.clientClassificationOptions = data.clientClassificationOptions;
                scope.clientNonPersonConstitutionOptions = data.clientNonPersonConstitutionOptions;
                scope.clientNonPersonMainBusinessLineOptions = data.clientNonPersonMainBusinessLineOptions;
                scope.clientLegalFormOptions = data.clientLegalFormOptions;
                for(var i=0; i< scope.clientLegalFormOptions.length; i++){
                	if(scope.clientLegalFormOptions[i].value == "ENTITY")
                		scope.entityLegalOption =  scope.clientLegalFormOptions[i];
                }
                scope.clientNonPersonAccountTypeOptions = data.clientNonPersonAccountTypeOptions;
                scope.complianceStatusIdOptions = data.clientNonPersonComplainsStatusCodeOptions;
                scope.clientNonPersonAgentTypeCodeOptions = data.clientNonPersonAgentTypeCodeOptions;
                scope.clientNonPersonEnterpriseTypeCodeOptions = data.clientNonPersonEnterpriseTypeCodeOptions;
                scope.datatables = data.datatables;
                if (!_.isUndefined(scope.datatables) && scope.datatables.length > 0) {
                    scope.noOfTabs = scope.datatables.length + 1;
                    angular.forEach(scope.datatables, function (datatable, index) {
                        scope.updateColumnHeaders(datatable.columnHeaderData);
                        angular.forEach(datatable.columnHeaderData, function (colHeader, i) {
                            if (_.isEmpty(scope.formDat.datatables[index])) {
                                scope.formDat.datatables[index] = {data: {}};
                            }

                            if (_.isEmpty(scope.formData.datatables[index])) {
                                scope.formData.datatables[index] = {
                                    registeredTableName: datatable.registeredTableName,
                                    data: {locale: scope.optlang.code}
                                };
                            }

                            if (datatable.columnHeaderData[i].columnDisplayType == 'DATETIME') {
                                scope.formDat.datatables[index].data[datatable.columnHeaderData[i].columnName] = {};
                            }
                        });
                    });
                }

                if (data.savingProductOptions.length > 0) {
                    scope.showSavingOptions = true;
                }
                if(routeParams.officeId) {
                    scope.formData.officeId = routeParams.officeId;
                    for(var i in data.officeOptions) {
                        if(data.officeOptions[i].id == routeParams.officeId) {
                            scope.forceOffice = data.officeOptions[i];
                            break;
                        }
                    }
                }
                if(routeParams.groupId) {
                    if(typeof data.staffId !== "undefined") {
                        scope.formData.staffId = data.staffId;
                    }
                }
                
             


                scope.enableAddress=data.isAddressEnabled;

                if(scope.enableAddress===true)
                {
                    scope.addressTypes=data.address.addressTypeIdOptions;
                    scope.countryOptions=data.address.countryIdOptions;
                    scope.stateOptions=data.address.stateProvinceIdOptions;

                    resourceFactory.addressFieldConfiguration.get({entity:entityname},function(data){



                        for(var i=0;i<data.length;i++)
                        {
                            data[i].field='scope.'+data[i].field;
                            eval(data[i].field+"="+data[i].is_enabled);

                        }



                        scope.addAddress();

                    });


                }


                scope.relationshipIdOptions=data.familyMemberOptions.relationshipIdOptions;
                scope.genderIdOptions=data.familyMemberOptions.genderIdOptions;
                scope.maritalStatusIdOptions=data.familyMemberOptions.maritalStatusIdOptions;
                scope.professionIdOptions=data.familyMemberOptions.professionIdOptions;



            });

            scope.updateColumnHeaders = function(columnHeaderData) {
                var colName = columnHeaderData[0].columnName;
                if (colName == 'id') {
                    columnHeaderData.splice(0, 1);
                }

                colName = columnHeaderData[0].columnName;
                if (colName == 'client_id' || colName == 'office_id' || colName == 'group_id' || colName == 'center_id' || colName == 'loan_id' || colName == 'savings_account_id') {
                    columnHeaderData.splice(0, 1);
                }
            };

            // address


           
            $('#enterpriseType').on('change',function () {
                console.log($('#enterpriseType').val());
            });
            

            scope.removeAddress=function(index)
            {
                scope.addressArray.splice(index,1);
            }

            // end of address


            // family members

            scope.addFamilyMember=function()
            {
                scope.familyArray.push({});
            }

            scope.removeFamilyMember=function(index)
            {
                scope.familyArray.splice(index,1);
            }


            // end of family members


            scope.loadAgents = function(){
                resourceFactory.clientResource.getAllClients({
                    officeId : scope.formData.officeId,
                    offset: ((scope.pageNumber - 1) * scope.clientsPerPage),
                    limit: scope.clientsPerPage,
                    getOnlyAgents : true,
                    orderBy : "submittedon_date",
                    sortOrder : "desc"
                }, function (data) {
                    scope.clients = data.pageItems;
                });
            }
            scope.loadAgents();
            scope.loadNextClients = function(){
                scope.pageNumber++;
                scope.loadAgents();
            }
            scope.loadPreviousClients = function(){
                scope.pageNumber--;
                scope.loadAgents();
            }
            scope.subAgent = {};
            scope.changeParentAgent = function(){
                if(scope.subAgent.parent){
                    scope.formData.commissionId = scope.subAgent.parent.commissionId;
                    scope.formData.savingsProductId =  scope.subAgent.parent.savingsProductId;
                    scope.formData.parentId = scope.subAgent.parent.id;
                    
                }else{
                    scope.formData.commissionId = undefined;
                    scope.formData.parentId = undefined;
                }
            }
            scope.displayPersonOrNonPersonOptions = function () { 
                if(scope.formData.clientTypeId == scope.agentTypeId || scope.formData.clientTypeId == null) {
                    scope.showNonPersonOptions = true;
                }else {
                    scope.showNonPersonOptions = false;
                    scope.isSubAgent = true;
                }
            };
            
            scope.displayAccountDetails = function () {
            	if(scope.formData.clientNonPersonDetails.accountTypeId)
            		scope.showAccountDetails = true;
            	else 
            		scope.showAccountDetails = false;
            }

            scope.changeOffice = function (officeId) {
                scope.loadAgents();
                resourceFactory.clientTemplateResource.get({staffInSelectedOfficeOnly:true, officeId: officeId
                }, function (data) {
                    scope.staffs = data.staffOptions;
                    scope.savingproducts = data.savingProductOptions;
                });

            };

            //Search and select Default Product
            /*scope.setProd = function(){
                angular.element('#savingsProductId option:contains("Money")').prop('selected',true);
                console.log('name');
                //angular.element('#savingsProductId').prop('disabled',true);

                //scope.formData.savingsProductId = angular.element('#savingsProductId').val();
            }*/

            scope.toggleAgentFields = function(){
                var agentText = angular.element('#enterpriseType option:selected').text();
                console.log(agentText);
                if (agentText.toLowerCase().includes('individual')){
                    angular.element('.idOrPassDiv').removeClass('hide');
                    angular.element('.agentData').addClass('hide');
                    angular.element('#passportID').attr('required',true);
                }else if (agentText.toLowerCase().includes('corporate')){
                    angular.element('.idOrPassDiv').addClass('hide');
                    angular.element('.agentData').removeClass('hide');
                    angular.element('#passportID').attr('required',false);
                }else{
                    angular.element('.idOrPassDiv').addClass('hide');
                    angular.element('.agentData').addClass('hide');
                    angular.element('#passportID').attr('required',false);
                }
            }

            scope.setChoice = function () {
                if (this.formData.active) {
                    scope.choice = 1;
                }
                else if (!this.formData.active) {
                    scope.choice = 0;
                }
            };
            if(routeParams.groupId) {
                scope.cancel = '#/viewgroup/' + routeParams.groupId
                scope.groupid = routeParams.groupId;
            }else {
                scope.cancel = "#/agents"
            }
            scope.fieldType = function (type) {
                var fieldType = "";
                if (type) {
                    if (type == 'CODELOOKUP' || type == 'CODEVALUE') {
                        fieldType = 'SELECT';
                    } else if (type == 'DATE') {
                        fieldType = 'DATE';
                    } else if (type == 'DATETIME') {
                        fieldType = 'DATETIME';
                    } else if (type == 'BOOLEAN') {
                        fieldType = 'BOOLEAN';
                    } else {
                        fieldType = 'TEXT';
                    }
                }
                return fieldType;
            };

            scope.dateTimeFormat = function (colHeaders) {
                angular.forEach(colHeaders, function (colHeader, i) {
                    if (colHeaders[i].columnDisplayType == 'DATETIME') {
                        return scope.df + " " + scope.tf;
                    }
                });
                return scope.df;
            };

            angular.element('#mobileNo').focusout(function() {
                if ( angular.element('#mobileNo').val().startsWith('+27')){

                }else{
                    scope.formData.mobileNo = '+27' +  angular.element('#mobileNo').val().substring(1);
                    scope.formData.mobileNo= scope.formData.mobileNo.substring(0,12);
                }
            });

            scope.submit = function () {
                var reqDate = dateFilter(scope.first.date, scope.df);
                this.formData.locale = scope.optlang.code;
                this.formData.active = this.formData.active || false;
                this.formData.dateFormat = scope.df;
                this.formData.clientNonPersonDetails.dateFormat = scope.df;
                this.formData.clientNonPersonDetails.locale = scope.optlang.code;
                this.formData.activationDate = reqDate;
                this.formData.legalFormId = scope.entityLegalOption.id;

                console.log(scope.formData);
                if (!_.isUndefined(scope.datatables) && scope.datatables.length > 0) {
                    angular.forEach(scope.datatables, function (datatable, index) {
                        scope.columnHeaders = datatable.columnHeaderData;
                        angular.forEach(scope.columnHeaders, function (colHeader, i) {
                            scope.dateFormat = scope.df + " " + scope.tf
                            if (scope.columnHeaders[i].columnDisplayType == 'DATE') {
                                if (!_.isUndefined(scope.formDat.datatables[index].data[scope.columnHeaders[i].columnName])) {
                                    scope.formData.datatables[index].data[scope.columnHeaders[i].columnName] = dateFilter(scope.formDat.datatables[index].data[scope.columnHeaders[i].columnName],
                                        scope.dateFormat);
                                    scope.formData.datatables[index].data.dateFormat = scope.dateFormat;
                                }
                            } else if (scope.columnHeaders[i].columnDisplayType == 'DATETIME') {
                                if (!_.isUndefined(scope.formDat.datatables[index].data[scope.columnHeaders[i].columnName].date) && !_.isUndefined(scope.formDat.datatables[index].data[scope.columnHeaders[i].columnName].time)) {
                                    scope.formData.datatables[index].data[scope.columnHeaders[i].columnName] = dateFilter(scope.formDat.datatables[index].data[scope.columnHeaders[i].columnName].date, scope.df)
                                        + " " + dateFilter(scope.formDat.datatables[index].data[scope.columnHeaders[i].columnName].time, scope.tf);
                                    scope.formData.datatables[index].data.dateFormat = scope.dateFormat;
                                }
                            }
                        });
                    });
                } else {
                    delete scope.formData.datatables;
                }

                if (routeParams.groupId) {
                    this.formData.groupId = routeParams.groupId;
                }

                if (routeParams.officeId) {
                    this.formData.officeId = routeParams.officeId;
                }

                if (scope.first.submitondate) {
                    reqDate = dateFilter(scope.first.submitondate, scope.df);
                    this.formData.submittedOnDate = reqDate;
                }

                if (scope.first.dateOfBirth) {
                    this.formData.dateOfBirth = dateFilter(scope.first.dateOfBirth, scope.df);
                }
                if (scope.first.dateOfIncorporation) {
                    this.formData.clientNonPersonDetails.dateOfIncorporation = dateFilter(scope.first.dateOfIncorporation, scope.df);
                }

                var isAgent = false;
                for (var i = 0; i < scope.clientTypeOptions.length; i++) {
                    if (scope.clientTypeOptions[i].id == scope.formData.clientTypeId && scope.clientTypeOptions[i].name == 'Agent') {
                        isAgent = true;
                    }
                }

                if (!isAgent) {
                    delete this.formData.fullname;
                } else {
                    delete this.formData.firstname;
                    delete this.formData.middlename;
                    delete this.formData.lastname;
                }

                if (scope.first.incorpValidityTillDate) {
                    this.formData.clientNonPersonDetails.locale = scope.optlang.code;
                    this.formData.clientNonPersonDetails.dateFormat = scope.df;
                    this.formData.clientNonPersonDetails.incorpValidityTillDate = dateFilter(scope.first.incorpValidityTillDate, scope.df);
                }

                if (!scope.savings.opensavingsproduct) {
                    this.formData.savingsProductId = null;
                }

                // to enable address in create agent form

                if (scope.enableAddress === true) {
                    for (var i = 0; i < scope.addressArray.length; i++) {
                        var temp = new Object();
                        if (scope.addressArray[i].addressTypeId) {
                            temp.addressTypeId = scope.addressArray[i].addressTypeId;
                        }
                        if (scope.addressArray[i].street) {
                            temp.street = scope.addressArray[i].street;
                        }
                        if (scope.addressArray[i].addressLine1) {
                            temp.addressLine1 = scope.addressArray[i].addressLine1;
                        }
                        if (scope.addressArray[i].addressLine2) {
                            temp.addressLine2 = scope.addressArray[i].addressLine2;
                        }
                        if (scope.addressArray[i].townVillage) {
                            temp.townVlage = scope.addressArray[i].townVillage;
                        }
                        if (scope.addressArray[i].city) {
                            temp.city = scope.addressArray[i].city;
                        }
                        if (scope.addressArray[i].countyDistrict) {
                            temp.countyDistrict = scope.addressArray[i].countyDistrict;
                        }
                        if (scope.addressArray[i].countryId) {
                            temp.countryId = scope.addressArray[i].countryId;
                        }
                        if (scope.addressArray[i].stateProvinceId) {
                            temp.stateProvinceId = scope.addressArray[i].stateProvinceId;
                        }
                        if (scope.addressArray[i].postalCode) {
                            temp.postalCode = scope.addressArray[i].postalCode;
                        }
                        if (scope.addressArray[i].latitude) {
                            temp.latitude = scope.addressArray[i].latitude;
                        }
                        if (scope.addressArray[i].longitude) {
                            temp.longitude = scope.addressArray[i].longitude;
                        }
                        if (scope.addressArray[i].isActive) {
                            temp.isActive = scope.addressArray[i].isActive;

                        }
                        temp.locale = scope.optlang.code;

                        scope.formData.address.push(temp);
                    }
                }

                var idnum = angular.element('#passportID').val();
                var agentType = angular.element('#enterpriseType option:selected').text();
                var incorpNum = angular.element('#incorpNumber').val();
                //var agentCode = angular.element('#agentCode').val();
                var agentTypeid = angular.element('#agentTypeId option:selected').val();
                var agentRegNo = angular.element('#agentRegNo').val();
               // var agentCom = angular.element('#commissionId option:selected').val();
                if ((agentType.toLowerCase().includes('individual'))&&(idnum == '')) {
                    angular.element('#passportID').css('box-shadow','2px 2px 3px red');
                    swal({
                        title: 'Enter ID/Passport Number',
                        text:  'Incomplete fields',
                        icon: 'warning',
                        buttons: 'OK',
                        dangerMode: false,
                    }).then(function () {
                        angular.element('#passportID').css('box-shadow','none');
                    });
                } else if ((agentType.toLowerCase().includes('corporate')) &&
                    ( (incorpNum=='') || (agentTypeid=='') || (agentRegNo==''))){
                    angular.element('#incorpNumber').css('box-shadow','2px 2px 3px red');
                    //angular.element('#agentCode').css('box-shadow','2px 2px 3px red');
                    angular.element('#agentTypeId').css('box-shadow','2px 2px 3px red');
                    angular.element('#agentRegNo').css('box-shadow','2px 2px 3px red');
                   // angular.element('#commissionId').css('box-shadow','2px 2px 3px red');
                    swal({
                        title: 'Enter All required Agent Fields',
                        text:  'Incomplete fields',
                        icon: 'warning',
                        buttons: 'OK',
                        dangerMode: false,
                    }).then(function () {
                        angular.element('#incorpNumber').css('box-shadow','none');
                        //angular.element('#agentCode').css('box-shadow','none');
                        angular.element('#agentTypeId').css('box-shadow','none');
                        angular.element('#agentRegNo').css('box-shadow','none');
                       // angular.element('#commissionId').css('box-shadow','none');
                    });
                }else {
                    resourceFactory.clientResource.save(this.formData, function (data) {
                        location.path('/viewclient/' + data.clientId);
                    });
                }
            };
        }
    });
    mifosX.ng.application.controller('CreateAgentController', ['$scope', 'ResourceFactory', '$location', '$http', 'dateFilter', 'API_VERSION', 'Upload', '$rootScope', '$routeParams', 'WizardHandler', mifosX.controllers.CreateAgentController]).run(function ($log) {
        $log.info("CreateAgentController initialized");
    });
}(mifosX.controllers || {}));
