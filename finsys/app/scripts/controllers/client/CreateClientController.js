(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateClientController: function (scope, resourceFactory, location, http, dateFilter, API_VERSION, Upload, $rootScope, routeParams, WizardHandler) {
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
            scope.showSavingOptions = true;
            scope.savings = {};
            scope.savings.opensavingsproduct = true;
            scope.forceOffice = null;
            scope.showNonPersonOptions = false;
            scope.clientPersonId = 1;
            //address
            scope.isAddressEnabled=true;
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
                    return product.isPrimary == true;
                });
                scope.genderOptions = data.genderOptions;
                scope.clienttypeOptions = data.clientTypeOptions;
                scope.clientClassificationOptions = data.clientClassificationOptions;
                scope.clientNonPersonConstitutionOptions = data.clientNonPersonConstitutionOptions;
                scope.clientNonPersonMainBusinessLineOptions = data.clientNonPersonMainBusinessLineOptions;
                scope.clientLegalFormOptions = data.clientLegalFormOptions;
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
                //scope.formData.mobileNo = '+27';

                angular.element('#mobileNo').focusout(function() {
                        if ( angular.element('#mobileNo').val().startsWith('+27')){

                        }else{
                            scope.formData.mobileNo = '+27' +  angular.element('#mobileNo').val().substring(1);
                            scope.formData.mobileNo= scope.formData.mobileNo.substring(0,12);
                        }
                });

                scope.nations = worldNations();
                var regex = /\s/gi;
                for (var i in scope.nations){
                    $('#nationality').append('<option value='+ scope.nations[i].replace(regex,'&nbsp;')
                        + '>' + scope.nations[i].replace(regex,'&nbsp;') + '</option>');
                }

                var arr = scope.nations; // array, already an object
                Object.setPrototypeOf(arr, Object.prototype); // now no longer an array, still an object

                if (data.savingProductOptions.length > 0) {
                    scope.showSavingOptions = true;
                   // console.log( data.savingProductOptions);
                    /*angular.element( '#createclientform' ).mousemove(function( event ) {
                        angular.element('#savingsProductId option:contains("Prepaid")').prop('selected',true);
                        angular.element('#savingsProductId').prop('disabled',true);
                    });*/
                }

                var aster ='*';
                $('#isSouthAfrican').on('click',function(){
                    if($(this).is(':checked')){
                        $('#nationality option[value="South African"]').attr("selected", "selected");
                        console.log('Checked');
                        angular.element('#expiryDate').prop('required',false);
                        angular.element('#passExpiryDateDiv').hide();

                        angular.element('#labelIDOrPassport').text('RSA ID Number').push('<span class="required">', aster, '</span>');
                        angular.element('#expiryDate').prop('required',false);
                    }else{
                        console.log('Unchecked');
                        $('#nationality option[value=""]').attr("selected", "selected");
                        angular.element('#passExpiryDateDiv').show();
                        angular.element('#expiryDate').prop('required',true);

                        angular.element('#labelIDOrPassport').text('Passport Number').push('<span class="required">', aster,'</span>');
                    }
                });
                angular.element('#passExpiryDateDiv').hide();

                angular.element('#nationality').on('change',function () {
                    var aster ='*';
                    if (angular.element('#nationality').val().toLowerCase().includes('african')){
                        $('#isSouthAfrican').prop('checked','checked');
                        angular.element('#labelIDOrPassport').text('RSA ID Number').push('<span class="required">', aster, '</span>');
                        angular.element('#expiryDate').prop('required',false);
                        angular.element('#passExpiryDateDiv').hide();
                    }else{
                        $('#isSouthAfrican').prop('checked',false);
                        angular.element('#labelIDOrPassport').text('Passport Number').push('<span class="required">', aster,'</span>');
                        angular.element('#passExpiryDateDiv').show();
                        angular.element('#expiryDate').prop('required',true);
                    }
                });

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
                    })


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

            scope.displayPersonOrNonPersonOptions = function (legalFormId) {
                if(legalFormId == scope.clientPersonId || legalFormId == null) {
                    scope.showNonPersonOptions = false;
                }else {
                    scope.showNonPersonOptions = true;
                }
            };

            scope.changeOffice = function (officeId) {
                resourceFactory.clientTemplateResource.get({staffInSelectedOfficeOnly:true, officeId: officeId
                }, function (data) {
                    scope.staffs = data.staffOptions;
                    scope.savingproducts = data.savingProductOptions;
                });
            };

            //angular.element('#activeCheckbox').attr('checked',true);
            //scope.choice=1;
            scope.formData.active = true;
            scope.choice=1;
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
                scope.cancel = "#/clients"
            }

            //return input type
            //return input type
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

            scope.submit = function () {
                var reqDate = dateFilter(scope.first.date, scope.df);

                this.formData.locale = scope.optlang.code;
                this.formData.active = this.formData.active || false;
                this.formData.dateFormat = scope.df;
                this.formData.activationDate = reqDate;

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

                if (scope.first.passExpDate) {
                    reqDate = dateFilter(scope.first.passExpDate, scope.df);
                    this.formData.passExpDate = reqDate;
                }

                if (scope.first.dateOfBirth) {
                    this.formData.dateOfBirth = dateFilter(scope.first.dateOfBirth, scope.df);
                }

                if (this.formData.legalFormId == scope.clientPersonId || this.formData.legalFormId == null) {
                    delete this.formData.fullname;
                } else {
                    delete this.formData.firstname;
                    delete this.formData.middlename;
                    delete this.formData.lastname;
                }

                if(scope.first.incorpValidityTillDate) {
                    this.formData.clientNonPersonDetails.locale = scope.optlang.code;
                    this.formData.clientNonPersonDetails.dateFormat = scope.df;
                    this.formData.clientNonPersonDetails.incorpValidityTillDate = dateFilter(scope.first.incorpValidityTillDate, scope.df);
                }

                /*if (!scope.savings.opensavingsproduct) {
                    this.formData.savingsProductId = null;
                } */
                //scope.formData.savingsProductId
                this.formData.savingsProductId = angular.element('#savingsProductId').val().split(':')[1];

                if(scope.enableAddress===true)
                {
                    for(var i=0;i<scope.addressArray.length;i++)
                    {
                        var temp=new Object();
                        if(scope.addressArray[i].addressTypeId)
                        {
                            temp.addressTypeId=scope.addressArray[i].addressTypeId;
                        }
                        if(scope.addressArray[i].street)
                        {
                            temp.street=scope.addressArray[i].street;
                        }
                        if(scope.addressArray[i].addressLine1)
                        {
                            temp.addressLine1=scope.addressArray[i].addressLine1;
                        }
                        if(scope.addressArray[i].addressLine2)
                        {
                            temp.addressLine2=scope.addressArray[i].addressLine2;
                        }
                        if(scope.addressArray[i].addressLine3)
                        {
                            temp.addressLine3=scope.addressArray[i].addressLine3;
                        }
                        if(scope.addressArray[i].townVillage)
                        {
                            temp.townVlage=scope.addressArray[i].townVillage;
                        }
                        if(scope.addressArray[i].city)
                        {
                            temp.city=scope.addressArray[i].city;
                        }
                        if(scope.addressArray[i].countyDistrict)
                        {
                            temp.countyDistrict=scope.addressArray[i].countyDistrict;
                        }
                        if(scope.addressArray[i].countryId)
                        {
                            temp.countryId=scope.addressArray[i].countryId;
                        }
                        if(scope.addressArray[i].stateProvinceId)
                        {
                            temp.stateProvinceId=scope.addressArray[i].stateProvinceId;
                        }
                        if(scope.addressArray[i].postalCode)
                        {
                            temp.postalCode=scope.addressArray[i].postalCode;
                        }
                        if(scope.addressArray[i].latitude)
                        {
                            temp.latitude=scope.addressArray[i].latitude;
                        }
                        if(scope.addressArray[i].longitude)
                        {
                            temp.longitude=scope.addressArray[i].longitude;
                        }
                        if(scope.addressArray[i].isActive)
                        {
                            temp.isActive=scope.addressArray[i].isActive;

                        }
                        temp.locale = scope.optlang.code;
                        scope.formData.address.push(temp);
                    }
                }

                // family array

                for(var i=0;i<scope.familyArray.length;i++)
                {
                    var temp=new Object();
                    if(scope.familyArray[i].relationshipId)
                    {
                        temp.relationshipId=scope.familyArray[i].relationshipId;
                    }
                    if(scope.familyArray[i].firstName)
                    {
                        temp.firstName=scope.familyArray[i].firstName;
                    }
                    if(scope.familyArray[i].middleName)
                    {
                        temp.middleName=scope.familyArray[i].middleName;
                    }
                    if(scope.familyArray[i].lastName)
                    {
                        temp.lastName=scope.familyArray[i].lastName;
                    }
                    if(scope.familyArray[i].qualification)
                    {
                        temp.qualification=scope.familyArray[i].qualification;
                    }
                    if(scope.familyArray[i].mobileNumber)
                    {
                        temp.mobileNumber=scope.familyArray[i].mobileNumber;
                    }
                    if(scope.familyArray[i].age)
                    {
                        temp.age=scope.familyArray[i].age;
                    }
                    if(scope.familyArray[i].isDependent)
                    {
                        temp.isDependent=scope.familyArray[i].isDependent;
                    }
                    if(scope.familyArray[i].genderId)
                    {
                        temp.genderId=scope.familyArray[i].genderId;
                    }
                    if(scope.familyArray[i].professionId)
                    {
                        temp.professionId=scope.familyArray[i].professionId;
                    }
                    if(scope.familyArray[i].maritalStatusId)
                    {
                        temp.maritalStatusId=scope.familyArray[i].maritalStatusId;
                    }
                    if(scope.familyArray[i].dateOfBirth)
                    {

                        temp.dateOfBirth=dateFilter(scope.familyArray[i].dateOfBirth, scope.df);
                    }

                    //dateFormat and Locale
                    temp.locale = scope.optlang.code;
                    temp.dateFormat = scope.df;
                    scope.formData.familyMembers.push(temp);
                    
                }

                //passExpDate
                console.log(this.formData);
                var passExpDatew=  angular.element('#passExpDate').val();
                var national = angular.element('#nationality option:selected').text().toLowerCase();
                    console.log(national);
                if (national.includes('select')){
                    angular.element('#nationality').css('box-shadow', '2px 2px 3px red');
                    swal({
                        title: 'Select Client Nationality',
                        text: 'Incomplete fields',
                        icon: 'warning',
                        buttons: 'OK',
                        dangerMode: false,
                    }).then(function () {
                        angular.element('#nationality').css('box-shadow', 'none');
                    });
                }else {
                    if ((national != 'south african') && (passExpDatew === '')) {
                        angular.element('#passExpDate').css('box-shadow', '2px 2px 3px red');
                        swal({
                            title: 'Enter Passport Expiry date',
                            text: 'Incomplete fields',
                            icon: 'warning',
                            buttons: 'OK',
                            dangerMode: false,
                        }).then(function () {
                            angular.element('#passExpDate').css('box-shadow', 'none');
                        });
                    } else if ((national != 'south african') && (passExpDatew != '')) {
                        resourceFactory.clientResource.save(this.formData, function (data) {
                            console.log(this.formData);
                            location.path('/viewclient/' + data.clientId);
                        });
                    } else {
                        resourceFactory.clientResource.save(this.formData, function (data) {
                            console.log(this.formData);
                            location.path('/viewclient/' + data.clientId);
                        });
                    }
                }
            };


        }
    });
    mifosX.ng.application.controller('CreateClientController', ['$scope', 'ResourceFactory', '$location', '$http', 'dateFilter', 'API_VERSION', 'Upload', '$rootScope', '$routeParams', 'WizardHandler', mifosX.controllers.CreateClientController]).run(function ($log) {
        $log.info("CreateClientController initialized");
    });
}(mifosX.controllers || {}));
