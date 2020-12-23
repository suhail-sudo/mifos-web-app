(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewKycCategoryController: function (scope, routeParams, resourceFactory, $uibModal, location, route) {

            
           resourceFactory.kycCategoryResource.getOne({categoryId: routeParams.id}, function (data) {
                scope.kyccategory = data;
            });
            
            var KycCategoryDeleteCtrl = function ($scope, $uibModalInstance,kycCategoryId) {
               $scope.delete = function () {
                   resourceFactory.kycCategoryResource.delete({categoryId: kycCategoryId}, {}, function (data) {
                       $uibModalInstance.close('delete');
                       location.path('/kyccategory');
                   });
               };
               $scope.cancel = function () {
                   $uibModalInstance.dismiss('cancel');
               };
           }
           
			scope.deleteKycCategory = function(id) {
				$uibModal.open({
                        templateUrl: 'deleteKycCategory.html',
                        controller: KycCategoryDeleteCtrl,
                        resolve: {
                            kycCategoryId: function () {
                                return id;
                            }
                        }
                });
			};
        }
    });
    mifosX.ng.application.controller('ViewKycCategoryController', ['$scope', '$routeParams', 'ResourceFactory', '$uibModal', '$location', '$route', mifosX.controllers.ViewKycCategoryController]).run(function ($log) {
        $log.info("ViewKycCategoryController initialized");
    });
}(mifosX.controllers || {}));

