(function (module) {
    mifosX.controllers = _.extend(module, {
    	EditAgentController: function (scope, routeParams, resourceFactory, location, http, dateFilter, API_VERSION, Upload, $rootScope) {
            scope.offices = [];
            scope.date = {};
            scope.formData = {};
            scope.restrictDate = new Date();
            scope.savingproducts = [];
            scope.clientId = routeParams.id;
            scope.showSavingOptions = false;
            scope.opensavingsproduct = false;
            scope.isSubAgent = false;
            scope.agentPerm = $rootScope.hasPermission('CREATE_AGENT');
            scope.subAgentPerm = $rootScope.hasPermission('CREATE_SUBAGENT');
            resourceFactory.clientResource.get({clientId: routeParams.id, template:'true', staffInSelectedOfficeOnly:true}, function (data) {
                console.log(data);
                scope.offices = data.officeOptions;
                scope.staffs = data.staffOptions;
                scope.clientNonPersonDetails = data.clientNonPersonDetails;
                scope.savingproducts = _.reject(data.savingProductOptions, function(product){
                    return product.isPrimary != true;
                });
                scope.genderOptions = data.genderOptions;
                scope.clientClassificationOptions = data.clientClassificationOptions;
                scope.clientNonPersonConstitutionOptions = data.clientNonPersonConstitutionOptions;
                scope.clientNonPersonMainBusinessLineOptions = data.clientNonPersonMainBusinessLineOptions;
                scope.clientNonPersonAgentTypeCodeOptions = data.clientNonPersonAgentTypeCodeOptions;
                scope.clientNonPersonComplainsStatusCodeOptions = data.clientNonPersonComplainsStatusCodeOptions;
                scope.clientNonPersonAccountTypeOptions = data.clientNonPersonAccountTypeOptions;
                scope.clientNonPersonEnterpriseTypeCodeOptions = data.clientNonPersonEnterpriseTypeCodeOptions;
                scope.clientLegalFormOptions = data.clientLegalFormOptions;
                scope.clientTypeOptions = data.clientTypeOptions;
                for(var i=0; i<data.clientTypeOptions.length; i++) {
                	if(data.clientTypeOptions[i].name == 'Sub Agent') {
                		scope.formData.clientTypeId = data.clientTypeOptions[i].id;
                		scope.agentTypeId = scope.formData.clientTypeId;
                	}
                	
                }
                scope.officeId = data.officeId;
                scope.formData = {
                    firstname: data.firstname,
                    lastname: data.lastname,
                    middlename: data.middlename,
                    fullname: data.fullname,
                    active: data.active,
                    accountNo: data.accountNo,
                    staffId: data.staffId,
                    externalId: data.externalId,
                    isStaff:data.isStaff,
                    mobileNo: data.mobileNo,
                    savingsProductId: data.savingsProductId,
                    genderId: data.gender.id
                };
               
                
                if(data.gender){
                    scope.formData.genderId = data.gender.id;
                }

                if(data.clientType){
                    scope.formData.clientTypeId = data.clientType.id;
                }
                if(data.clientNonPersonDetails){
                	scope.formData.clientNonPersonDetails = {
                			accountName: data.clientNonPersonDetails.accountName,
                			accountNumber: data.clientNonPersonDetails.accountNumber,
                			accountTypeId: data.clientNonPersonDetails.accountType.id,
                			agentCode: data.clientNonPersonDetails.agentCode,
                			agentRegNo: data.clientNonPersonDetails.agentRegNo,
                			agentTypeId: data.clientNonPersonDetails.agentType.id,
                			bankCode: data.clientNonPersonDetails.bankCode,
                			bankName: data.clientNonPersonDetails.bankName,
                			enterpriseType: data.clientNonPersonDetails.enterpriseType.id,
                			complianceStatusId: data.clientNonPersonDetails.complianceStatus.id,
                			constitutionId: data.clientNonPersonDetails.constitution.id,
                			financeYear: data.clientNonPersonDetails.financeYear,
                			incorpNumber: data.clientNonPersonDetails.incorpNumber,
                			incorpValidityTillDate: data.clientNonPersonDetails.incorpValidityTillDate,
                			taxNumber: data.clientNonPersonDetails.taxNumber,
                            passportID : data.clientNonPersonDetails.passportID
                	}
                }
                
                if (data.clientNonPersonDetails.dateOfIncorporation) {
                    var incorporationDate = dateFilter(data.clientNonPersonDetails.dateOfIncorporation, scope.df);
                    scope.date.incorporationDate = new Date(incorporationDate);
                }

                if(data.clientClassification){
                    scope.formData.clientClassificationId = data.clientClassification.id;
                }

               
                if(data.clientNonPersonDetails.constitution){
                    scope.formData.clientNonPersonDetails.constitutionId = data.clientNonPersonDetails.constitution.id;
                }

                if(data.clientNonPersonDetails.mainBusinessLine){
                    scope.formData.clientNonPersonDetails.mainBusinessLineId = data.clientNonPersonDetails.mainBusinessLine.id;
                }

                if (data.savingsProductId != null) {
                    scope.opensavingsproduct = 'true';
                    scope.showSavingOptions = 'true';
                } else if (data.savingProductOptions.length > 0) {
                    scope.showSavingOptions = 'true';
                }

                scope.toggleAgentFields = function(){
                    var agentText = angular.element('#enterpriseType option:selected').text();
                    console.log(agentText);
                    if (agentText.toLowerCase().includes('individual')){
                        angular.element('.idOrPassDiv').removeClass('hide');
                        angular.element('.agentData').addClass('hide');
                    }else if (agentText.toLowerCase().includes('corporate')){
                        angular.element('.idOrPassDiv').addClass('hide');
                        angular.element('.agentData').removeClass('hide');
                    }else{
                        angular.element('.idOrPassDiv').addClass('hide');
                        angular.element('.agentData').addClass('hide');
                    }
                }


                if (data.dateOfBirth) {
                    var dobDate = dateFilter(data.dateOfBirth, scope.df);
                    scope.date.dateOfBirth = new Date(dobDate);
                }
                if(data.clientType.name == 'Sub Agent') {
                	scope.isSubAgent = true;
                }

                if (data.clientNonPersonDetails.incorpValidityTillDate) {
                    var incorpValidityTillDate = dateFilter(data.clientNonPersonDetails.incorpValidityTillDate, scope.df);
                    scope.date.incorpValidityTillDate = new Date(incorpValidityTillDate);
                }

                var actDate = dateFilter(data.activationDate, scope.df);
                scope.date.activationDate = new Date(actDate);
                if (data.active) {
                    scope.choice = 1;
                    scope.showSavingOptions = 'false';
                    scope.opensavingsproduct = 'false';
                }

                if (data.timeline.submittedOnDate) {
                    var submittedOnDate = dateFilter(data.timeline.submittedOnDate, scope.df);
                    scope.date.submittedOnDate = new Date(submittedOnDate);
                }

                if (scope.formData.mobileNo) {
                    if (scope.formData.mobileNo.startsWith('+27')) {

                    } else {
                        scope.formData.mobileNo = '+27' + scope.formData.mobileNo.substring(1);
                        scope.formData.mobileNo = scope.formData.mobileNo.substring(0, 12);
                    }

                    angular.element('#mobileNo').focusout(function () {
                        if (angular.element('#mobileNo').val().startsWith('+27')) {

                        } else {
                            scope.formData.mobileNo = '+27' + angular.element('#mobileNo').val().substring(1);
                            scope.formData.mobileNo = scope.formData.mobileNo.substring(0, 12);
                        }
                    });
                }else{
                    angular.element('#mobileNo').focusout(function () {
                        if (angular.element('#mobileNo').val().startsWith('+27')) {

                        } else {
                            scope.formData.mobileNo = '+27' + angular.element('#mobileNo').val().substring(1);
                            scope.formData.mobileNo = scope.formData.mobileNo.substring(0, 12);
                        }
                    });
                }
            });

            scope.displayAgentOrSubAgentOptions = function () {
                if(scope.formData.clientTypeId == scope.agentTypeId || scope.formData.clientTypeId == null) {
                    scope.isSubAgent = true;
                }else {
                    scope.isSubAgent = false;
                }
            };

            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                this.formData.clientNonPersonDetails.locale = scope.optlang.code;
                this.formData.clientNonPersonDetails.dateFormat = scope.df;
                if (scope.choice === 1) {
                    if (scope.date.activationDate) {
                        this.formData.activationDate = dateFilter(scope.date.activationDate, scope.df);
                    }
                }
                if(scope.date.dateOfBirth){
                    this.formData.dateOfBirth = dateFilter(scope.date.dateOfBirth,  scope.df);
                }
                
                if(scope.date.incorporationDate){
                    this.formData.clientNonPersonDetails.dateOfIncorporation = dateFilter(scope.date.incorporationDate,  scope.df);
                }

                if(scope.date.submittedOnDate){
                    this.formData.submittedOnDate = dateFilter(scope.date.submittedOnDate,  scope.df);
                }
                
                if(scope.date.incorpValidityTillDate){
                    this.formData.clientNonPersonDetails.locale = scope.optlang.code;
                    this.formData.clientNonPersonDetails.dateFormat = scope.df;
                    this.formData.clientNonPersonDetails.incorpValidityTillDate = dateFilter(scope.date.incorpValidityTillDate,  scope.df);
                }
                var isAgent = false;
                for(var i = 0; i < scope.clientTypeOptions.length; i++) {
                	if(scope.clientTypeOptions[i].id == scope.formData.clientTypeId && scope.clientTypeOptions[i].name == 'Agent') {
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
                console.log(this.formData);

                var idnum = angular.element('#passportID').val();
                var agentType = angular.element('#enterpriseType option:selected').text();
                var incorpNum = angular.element('#incorpNumber').val();
                //var agentCode = angular.element('#agentCode').val();
                var agentTypeid = angular.element('#agentTypeId option:selected').val();
                var agentRegNo = angular.element('#agentRegNo').val();
                //var agentCom = angular.element('#commissionId option:selected').val();
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
                    ( (incorpNum=='') || (agentTypeid=='') || (agentRegNo=='') )){
                    angular.element('#incorpNumber').css('box-shadow','2px 2px 3px red');
                    //angular.element('#agentCode').css('box-shadow','2px 2px 3px red');
                    angular.element('#agentTypeId').css('box-shadow','2px 2px 3px red');
                    angular.element('#agentRegNo').css('box-shadow','2px 2px 3px red');
                    //angular.element('#commissionId').css('box-shadow','2px 2px 3px red');
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
                        //angular.element('#commissionId').css('box-shadow','none');
                    });
                }else{
                    resourceFactory.clientResource.update({'clientId': routeParams.id}, this.formData, function (data) {
                        location.path('/viewclient/' + routeParams.id);
                    });
                }

            };
        }
    });
    mifosX.ng.application.controller('EditAgentController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$http', 'dateFilter', 'API_VERSION', 'Upload', '$rootScope', mifosX.controllers.EditAgentController]).run(function ($log) {
        $log.info("EditAgentController initialized");
    });
}(mifosX.controllers || {}));
