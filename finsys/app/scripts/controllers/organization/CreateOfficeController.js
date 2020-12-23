(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateOfficeController: function (scope, resourceFactory, location, dateFilter, $routeParams) {
            scope.offices = [];
            scope.first = {};
            scope.formData = {};
            scope.nearestBranches = [];
            scope.first.date = new Date();
            scope.restrictDate = new Date();
             //address
             scope.addressTypes=[];
             scope.countryOptions=[];
             scope.stateOptions=[];
             scope.addressTypeId={};
             entityname="ADDRESS";
             scope.addressArray=[];
             scope.formData.address=[];
             scope.isOutlet = $routeParams.isOutlet == "true";
             
            resourceFactory.officeTemplateResource.template(function (data) {
                scope.offices = data.allowedParents;
                scope.officeTypes = data.officeTypes;
                scope.nearestBranches = data.nearestBranches;
                scope.formData = {
                    parentId: scope.offices[0].id
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
                    });
                }
            });

            angular.element('#contactNo').focusout(function() {
                if ( angular.element('#contactNo').val().startsWith('+27')){

                }else{
                    scope.formData.contactNo = '+27' +  angular.element('#contactNo').val().substring(1);
                    scope.formData.contactNo= scope.formData.contactNo.substring(0,12);
                }
            });

            angular.element('#cellphoneNumber').focusout(function() {
                if ( angular.element('#cellphoneNumber').val().startsWith('+27')){

                }else{
                    scope.formData.cellphoneNumber = '+27' +  angular.element('#cellphoneNumber').val().substring(1);
                    scope.formData.cellphoneNumber= scope.formData.cellphoneNumber.substring(0,12);
                }
            });


            // address
            scope.addAddress=function()
            {
            	scope.addressArray=[];
                scope.addressArray.push({});
            }

            scope.removeAddress=function(index)
            {
                scope.addressArray.splice(index,1);
            }
            // end of address
            
             scope.minDat = function() {
                 for(var i=0;i<scope.offices.length;i++) {
                     if ((scope.offices[i].id) === (scope.formData.parentId)) {
                         return scope.offices[i].openingDate;
                     }
                 }
                };

            scope.submit = function () {
            	scope.formData.address=[];
                this.formData.locale = scope.optlang.code;
                var reqDate = dateFilter(scope.first.date, scope.df);
                this.formData.dateFormat = scope.df;
                this.formData.openingDate = reqDate;
                this.formData.nearestBranchId =1;

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
                        temp.dateFormat = scope.df
                        scope.formData.address.push(temp);
                    }
                }



                resourceFactory.officeResource.save(this.formData, function (data) {
                    console.log(this.formData);
                    location.path('/viewoffice/' + data.resourceId);
                });
            };

            $(".toggle-password").click(function()	{
                $(this).toggleClass("fa-eye fa-eye-slash");
                var input = $($(this).attr("toggle"));
                if (input.attr("type") == "password") {
                    input.attr("type", "text");
                }else {
                    input.attr("type", "password");
                }
            });
        }
    });
    mifosX.ng.application.controller('CreateOfficeController', ['$scope', 'ResourceFactory', '$location', 'dateFilter', '$routeParams', mifosX.controllers.CreateOfficeController]).run(function ($log) {
        $log.info("CreateOfficeController initialized");
    });
}(mifosX.controllers || {}));
