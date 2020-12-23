(function (module) {
    mifosX.controllers = _.extend(module, {
        EditEmployeeController: function (scope, routeParams, resourceFactory, location, dateFilter) {
            scope.offices = [];
            scope.restrictDate = new Date();

            resourceFactory.employeeResource.get({staffId: routeParams.id, template: 'true'}, function (data) {
                scope.offices = data.allowedOffices;
                scope.staffId = data.id;
                if (data.joiningDate) {
                    var editDate = dateFilter(data.joiningDate, scope.df);
                    data.joiningDate = new Date(editDate);
                }
                scope.formData = {
                    firstname: data.firstname,
                    lastname: data.lastname,
                    isLoanOfficer: data.isLoanOfficer,
                    officeId: data.officeId,
                    mobileNo: data.mobileNo,
                    isActive: data.isActive,
                    joiningDate: data.joiningDate
                };
                //console.log(scope.formData);
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

            scope.submit = function () {
                this.formData.locale = scope.optlang.code;
                var joiningDate = dateFilter(scope.formData.joiningDate, scope.df);
                this.formData.dateFormat = scope.df;
                this.formData.joiningDate = joiningDate;
                resourceFactory.employeeResource.update({'staffId': routeParams.id}, this.formData, function (data) {
                    location.path('/viewemployee/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditEmployeeController', ['$scope', '$routeParams', 'ResourceFactory', '$location', 'dateFilter', mifosX.controllers.EditEmployeeController]).run(function ($log) {
        $log.info("EditEmployeeController initialized");
    });
}(mifosX.controllers || {}));
