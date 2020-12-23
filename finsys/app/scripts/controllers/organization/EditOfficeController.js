(function (module) {
    mifosX.controllers = _.extend(module, {
        EditOfficeController: function (scope, resourceFactory, location, $routeParams, dateFilter) {
            scope.formData = {};
            scope.first = {};
            scope.nearestBranches = [];
            scope.isOutlet = $routeParams.isOutlet == "true";
            scope.restrictDate = new Date();
            resourceFactory.officeResource.getAllOffices({isOutlet: $routeParams.isOutlet}, function (data) {
                scope.parentId = data[0].id;
            });
            resourceFactory.officeResource.get({officeId: $routeParams.id, template: 'true', isOutlet: scope.isOutlet}, function (data) {
                scope.offices = data.allowedParents;
                scope.officeTypes = data.officeTypes;
                 
                scope.nearestBranches = _.reject( data.nearestBranches, function(branch){ return branch.id == $routeParams.id; });

                scope.id = data.id;
                if (data.openingDate) {
                    var editDate = dateFilter(data.openingDate, scope.df);
                    scope.first.date = new Date(editDate);
                }
                console.log(data);
                scope.formData = {
                    name: data.name,
                    externalId: data.externalId,
                    parentId: data.parentId,
                    nearestBranchId: data.nearestBranchId,
                    profile_no : data.profile_no,
                    vatNo : data.vatNo,
                    compCCNumber : data.compCCNumber,
                    contactNo : data.contactNo
                }

                 for(var i=0; i<scope.officeTypes.length; i++) {
                	if(scope.officeTypes[i].name.localeCompare(data.officeType) == 0) {
                		scope.formData.officeTypeId = scope.officeTypes[i].id;
                		break;
            		}
                }
            });

            angular.element('#contactNo').focusout(function() {
                if ( angular.element('#contactNo').val().startsWith('+27')){

                }else{
                    scope.formData.contactNo = '+27' +  angular.element('#contactNo').val().substring(1);
                    scope.formData.contactNo= scope.formData.contactNo.substring(0,12);
                }
            });

            scope.submit = function () {
                var reqDate = dateFilter(scope.first.date, scope.df);
                this.formData.locale = scope.optlang.code;
                this.formData.dateFormat = scope.df;
                this.formData.openingDate = reqDate;
                resourceFactory.officeResource.update({'officeId': $routeParams.id}, this.formData, function (data) {
                    location.path('/viewoffice/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditOfficeController', ['$scope', 'ResourceFactory', '$location', '$routeParams', 'dateFilter', mifosX.controllers.EditOfficeController]).run(function ($log) {
        $log.info("EditOfficeController initialized");
    });
}(mifosX.controllers || {}));
