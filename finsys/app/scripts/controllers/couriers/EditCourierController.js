(function (module) {
    mifosX.controllers = _.extend(module, {
       EditCourierController: function (scope, localStorageService, resourceFactory, $uibModal, location, http, dateFilter, API_VERSION, Upload, $rootScope, routeParams) {
           scope.userDetails = localStorageService.getFromLocalStorage('userData');
           scope.couriers = [];
    	   scope.formData = {};
    	   var idToNodeMap = {};
    	   scope.officesIdArray = [];
    	   scope.enableAddress = true;
    	   scope.formData.address = {};
    	   scope.formData.linkedOffices = [];
    	   
    	   resourceFactory.couriersTemplateResource.template(function (data) {
    		   scope.offices = data.officeOptions;
    		   scope.enableAddress = true;
    		   scope.userOptions = data.userOptions;
    		   scope.addressTemplate = data.addressTemplate;
    		   scope.addressTypes = data.addressTemplate.addressTypeIdOptions;
    		   scope.countryOptions = data.addressTemplate.countryIdOptions;
    		   scope.stateOptions = data.addressTemplate.stateProvinceIdOptions;
    		   scope.assetGLMappingOptions = data.assetGLMappingOptions;
    		   scope.currencies = data.currencyOptions;
    		   resourceFactory.couriersResource.get({courierId: routeParams.courierId}, function (data) {
                   scope.courier = data;
                   scope.formData.companyName = data.companyName;
                   scope.formData.companyRegNo = data.companyRegNo;
                   scope.formData.contactPhoneNo = data.contactPhoneNo;
                   scope.formData.contactEmail = data.contactEmail;
                   scope.formData.courierCompanyCode = data.courierCompanyCode;
                   scope.formData.userId = data.user.id;
                   scope.formData.assetGLMappingId = data.assetGLMappingId;
                   scope.formData.address.street = data.address.street;
                   scope.formData.address.addressLine1 = data.address.addressLine1;
                   scope.formData.address.addressLine2 = data.address.addressLine2;
                   scope.formData.address.city = data.address.city;
                   scope.formData.address.stateProvinceId = data.address.stateProvinceId;
                   scope.formData.address.countryId = data.address.countryId;
                   scope.formData.address.postalCode = data.address.postalCode;
                   for(var i in data.linkedOffices) {
                	   data.linkedOffices[i].selectedCheckBox = true;
                	   scope.officesIdArray.push(data.linkedOffices[i].id);
                   }
                   scope.offices = Array.prototype.concat(scope.offices, data.linkedOffices);
                   scope.loadTree();
               });
    		   
    		   
    		  
           });
    	   
    	   scope.loadTree = function() {
    		   for (var i in scope.offices) {
                   scope.offices[i].children = [];
                   idToNodeMap[scope.offices[i].id] = scope.offices[i];
               }
               function sortByParentId(a, b) {
                   return a.parentId - b.parentId;
               }

               scope.offices.sort(sortByParentId);

               var root = [];
               for (var i = 0; i < scope.offices.length; i++) {
                   var currentObj = scope.offices[i];
                   if (currentObj.children) {
                       currentObj.collapsed = "true";
                   }
                   if (typeof currentObj.parentId === "undefined") {
                       root.push(currentObj);
                   } else {
                	   parentNode = idToNodeMap[currentObj.parentId];
                	   if(parentNode)
                	   parentNode.children.push(currentObj);
                   }
               }
               scope.treedata = root; 
    	   }
    	   scope.officesTree = function (node) {
               if (node.selectedCheckBox) {
                   recurOfficeTree(node);
                   scope.officesIdArray = _.uniq(scope.officesIdArray);
               } else {
                   node.selectedCheckBox = false;
                   recurRemoveOfficeTree(node);
               }
           };
           
           scope.deepCopy = function (obj) {
               if (Object.prototype.toString.call(obj) === '[object Array]') {
                   var out = [], i = 0, len = obj.length;
                   for (; i < len; i++) {
                       out[i] = arguments.callee(obj[i]);
                   }
                   return out;
               }
               if (typeof obj === 'object') {
                   var out = {}, i;
                   for (i in obj) {
                       out[i] = arguments.callee(obj[i]);
                   }
                   return out;
               }
               return obj;
           }
           
           function recurOfficeTree(node) {
               node.selectedCheckBox = true;
               scope.officesIdArray.push(node.id);
               if (node.children.length > 0) {
                   for (var i = 0; i < node.children.length; i++) {
                       node.children[i].selectedCheckBox = true;
                       scope.officesIdArray.push(node.children[i].id);
                       if (node.children[i].children.length > 0) {
                           recurOfficeTree(node.children[i]);
                       }
                   }
               }
           }
           
           function recurRemoveOfficeTree(node) {
               scope.officesIdArray = _.without(scope.officesIdArray, node.id);
               if (node.children.length > 0) {
                   for (var i = 0; i < node.children.length; i++) {
                       node.children[i].selectedCheckBox = false;
                       scope.officesIdArray = _.without(scope.officesIdArray, node.children[i].id);
                       if (node.children[i].children.length > 0) {
                           recurRemoveOfficeTree(node.children[i]);
                       }
                   }
               }
           } 
    	   scope.addressTypes=[];
           scope.countryOptions=[];
           scope.stateOptions=[];
           scope.addressTypeId={};
           entityname="ADDRESS";
			
           scope.submit = function () {
        	   scope.couriers = [];
               scope.formData.address.locale = scope.optlang.code;
               for (var i in scope.officesIdArray) {
                   scope.formData.linkedOffices.push(scope.officesIdArray[i]);
        	   }
               resourceFactory.couriersResource.put({courierId: routeParams.courierId}, this.formData, function (data) {
                   location.path('/viewcourier/' + data.resourceId);
        	   });

           };
       }
    });
    mifosX.ng.application.controller('EditCourierController', ['$scope', 'localStorageService', 'ResourceFactory', '$uibModal', '$location', '$http', 'dateFilter', 'API_VERSION', 'Upload', '$rootScope', '$routeParams', mifosX.controllers.EditCourierController]).run(function ($log) {
        $log.info("EditCourierController initialized");
    });
}(mifosX.controllers || {}))