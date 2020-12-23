(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewLineFacilityContractController: function (scope, routeParams, resourceFactory,localStorageService, location, dateFilter, uiConfigService, WizardHandler) {
		    scope.disable=true;
			scope.compareId = function(a,b){

                const av = a.id;
				const bv = b.id
				let comparison = 0;
				if(av > bv) return 1;
				if(bv > av) return -1;
				
				return comparison;
			};
            scope.theclientId = localStorageService.getFromLocalStorage('clientId');
            resourceFactory.lineFacilityContractResource.getLineContract({clientId:scope.theclientId,accountId:routeParams.id},function (data) {
                console.log(data);
                scope.lineContract = data;
                scope.charges = scope.lineContract.charges;
                scope.transDetails =scope.lineContract.facilityTransactions;//facilityTransactions
				scope.transDetailz = scope.transDetails.slice();
				scope.transdetailSort = scope.transDetailz.slice().sort(scope.compareId);
				scope.transDetail =scope.transdetailSort[scope.transdetailSort.length-1];
               // scope.facility = scope.transDetail.facility; before code Review
                scope.facility = scope.transDetail;
				console.log('facility called '+scope.facility);


            });
            resourceFactory.clientResource.get({clientId:  scope.theclientId}, function (data) {
                scope.client = data;
                scope.isClosedClient = scope.client.status.value === 'Closed';

                console.log(scope.client);
            });
            scope.transactionSort = {
                column: 'id',
                descending: true
            };
            scope.approveContract = function (id) {
                var approveDate = dateFilter(new Date(), scope.df);
               scope.approveBody = {
                    command:'approve',
                    approveDate:approveDate,
                   dateFormat: scope.df,
                   locale: scope.optlang.code,
                }
                resourceFactory.approveLineFacilityContractResource.approve({id: id},scope.approveBody, function (data) {
                    console.log(data);
                    location.path('/viewclient/' +  scope.theclientId);
                });
            };
            scope.disburseContract = function (id) {
                var approveDate = dateFilter(new Date(), scope.df);
                scope.disburseBody = {
                    command:'disburse',
                    approveDate:approveDate,
                    dateFormat: scope.df,
                    locale: scope.optlang.code,
                }
                resourceFactory.approveLineFacilityContractResource.disburse({id: id},scope.disburseBody, function (data) {
                    console.log(data);
                    location.path('/viewclient/' +  scope.theclientId);
                });
            };

            scope.routeToEdit = function (id) {
                location.path('/facilityContract/'+ id +'/edit');
            };
        }
    });
    mifosX.ng.application.controller('ViewLineFacilityContractController', ['$scope', '$routeParams', 'ResourceFactory','localStorageService', '$location', 'dateFilter', 'UIConfigService', 'WizardHandler', mifosX.controllers.ViewLineFacilityContractController]).run(function ($log) {
        $log.info("ViewLineFacilityContractController initialized");
    });
}(mifosX.controllers || {}));
