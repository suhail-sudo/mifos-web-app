(function (module) {
    mifosX.controllers = _.extend(module, {
        EditClientController: function (scope, routeParams, resourceFactory, location, http, dateFilter, API_VERSION, Upload, $rootScope,localStorageService) {
            scope.offices = [];
            scope.date = {};
            scope.restrictDate = new Date();
            scope.savingproducts = [];
            scope.clientId = routeParams.id;
            scope.showSavingOptions = 'false';
            scope.opensavingsproduct = 'false';
            scope.showNonPersonOptions = false;
            scope.clientPersonId = 1;


            var user =localStorageService.getFromLocalStorage('uRole');
            console.log(user);

            resourceFactory.clientResource.get({clientId: routeParams.id, template:'true', staffInSelectedOfficeOnly:true}, function (data) {
               console.log(data);
                scope.offices = data.officeOptions;
                scope.staffs = data.staffOptions;
                scope.savingproducts = _.reject(data.savingProductOptions, function(product){
                    return product.isPrimary == true;
                });
                scope.genderOptions = data.genderOptions;
                scope.clienttypeOptions = data.clientTypeOptions;
                scope.clientClassificationOptions = data.clientClassificationOptions;
                scope.clientNonPersonConstitutionOptions = data.clientNonPersonConstitutionOptions;
                scope.clientNonPersonMainBusinessLineOptions = data.clientNonPersonMainBusinessLineOptions;
                scope.clientLegalFormOptions = data.clientLegalFormOptions;
                scope.officeId = data.officeId;
                scope.formData = {
                    firstname: data.firstname,
                    lastname: data.lastname,
                    middlename: data.middlename,
                    active: data.active,
                    accountNo: data.accountNo,
                    staffId: data.staffId,
                    externalId: data.externalId,
                    isStaff:data.isStaff,
                    mobileNo: data.mobileNo,
                    savingsProductId: data.savingsProductId,
                    genderId: data.gender.id,
                    fullname: data.fullname,
                    emailAddress: data.emailAddress,
                    nationality: data.nationality,
                    //passExpDate: data.passExpDate,
                    clientNonPersonDetails : {
                        incorpNumber: data.clientNonPersonDetails.incorpNumber,
                        remarks: data.clientNonPersonDetails.remarks
                    }
                };

                scope.nations = worldNations();
                var regex = /\s/gi;
                for (var i in scope.nations){
                    $('#nationality').append('<option value='+ scope.nations[i].replace(regex,'&nbsp;')
                        + '>' + scope.nations[i].replace(regex,'&nbsp;') + '</option>');
                }

                var arr = scope.nations; // array, already an object
                Object.setPrototypeOf(arr, Object.prototype); // now no longer an array, still an object
                angular.element( '#editclientform' ).mousemove(function( event ) {
                    //angular.element('#savingsProductId option:contains("Prepaid")').prop('selected',true);
                    //angular.element('#savingsProductId').prop('disabled',true);

                    var regex = /\s/gi;
                    for (var i in scope.nations){
                        $('#nationality').append('<option value='+ scope.nations[i].replace(regex,'&nbsp;')
                            + '>' + scope.nations[i].replace(regex,'&nbsp;') + '</option>');
                    }

                    var arr = scope.nations; // array, already an object
                    Object.setPrototypeOf(arr, Object.prototype); // now no longer an array, still an object

                });

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

                if(data.gender){
                    scope.formData.genderId = data.gender.id;
                }

                if(data.clientType){
                    scope.formData.clientTypeId = data.clientType.id;
                }

                if(data.clientClassification){
                    scope.formData.clientClassificationId = data.clientClassification.id;
                }

                if(data.legalForm){
                    scope.displayPersonOrNonPersonOptions(data.legalForm.id);
                    scope.formData.legalFormId = data.legalForm.id;
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

                if (data.dateOfBirth) {
                    var dobDate = dateFilter(data.dateOfBirth, scope.df);
                    scope.date.dateOfBirth = new Date(dobDate);
                }

                if (data.passExpDate) {
                    var passportExpDate = dateFilter(data.passExpDate, scope.df);
                    scope.date.passExpDate = new Date(passportExpDate);
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

            });

           /* if (user.includes('Super user') || user.toUpperCase().includes('SYSOPERATOR')){
                angular.element('#mobileNo').prop('disabled',false);
                console.log('FSU');
            }else{
                angular.element('#mobileNo').prop('disabled',true);
            } */

            scope.displayPersonOrNonPersonOptions = function (legalFormId) {
                if(legalFormId == scope.clientPersonId || legalFormId == null) {
                    scope.showNonPersonOptions = false;
                }else {
                    scope.showNonPersonOptions = true;
                }
            };

            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                if (scope.choice === 1) {
                    if (scope.date.activationDate) {
                        this.formData.activationDate = dateFilter(scope.date.activationDate, scope.df);
                    }
                }
                if(scope.date.dateOfBirth){
                    this.formData.dateOfBirth = dateFilter(scope.date.dateOfBirth,  scope.df);
                }

                if(scope.date.passExpDate){
                    this.formData.passExpDate = dateFilter(scope.date.passExpDate,  scope.df);
                }

                if(scope.date.submittedOnDate){
                    this.formData.submittedOnDate = dateFilter(scope.date.submittedOnDate,  scope.df);
                }

                if(scope.date.incorpValidityTillDate){
                    this.formData.clientNonPersonDetails.locale = scope.optlang.code;
                    this.formData.clientNonPersonDetails.dateFormat = scope.df;
                    this.formData.clientNonPersonDetails.incorpValidityTillDate = dateFilter(scope.date.incorpValidityTillDate,  scope.df);
                }

                if(this.formData.legalFormId == scope.clientPersonId || this.formData.legalFormId == null) {
                    delete this.formData.fullname;
                }else {
                    delete this.formData.firstname;
                    delete this.formData.middlename;
                    delete this.formData.lastname;
                }

                resourceFactory.clientResource.update({'clientId': routeParams.id}, this.formData, function (data) {
                    location.path('/viewclient/' + routeParams.id);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditClientController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$http', 'dateFilter', 'API_VERSION', 'Upload', '$rootScope','localStorageService', mifosX.controllers.EditClientController]).run(function ($log) {
        $log.info("EditClientController initialized");
    });
}(mifosX.controllers || {}));
