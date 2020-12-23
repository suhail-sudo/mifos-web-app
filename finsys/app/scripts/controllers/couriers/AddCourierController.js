(function (module) {
    mifosX.controllers = _.extend(module, {
       AddCourierController: function (scope, localStorageService, resourceFactory, $uibModal, location, http, dateFilter, API_VERSION, Upload, $rootScope, routeParams) {
           scope.userDetails = localStorageService.getFromLocalStorage('userData');
           scope.couriers = [];
    	   scope.formData = {};
    	   var idToNodeMap = {};
    	   scope.officesIdArray = [];
    	   scope.enableAddress = true;
    	   scope.formData.linkedOffices = [];
    	   
    	   resourceFactory.couriersTemplateResource.template(function (data) {
    		   scope.enableAddress = true;
    		   scope.userOptions = data.userOptions;
    		   scope.addressTemplate = data.addressTemplate;
    		   scope.addressTypes = data.addressTemplate.addressTypeIdOptions;
    		   scope.countryOptions = data.addressTemplate.countryIdOptions;
    		   scope.stateOptions = data.addressTemplate.stateProvinceIdOptions;
    		   scope.assetGLMappingOptions = data.assetGLMappingOptions;
    		   scope.currencies = data.currencyOptions;
    		   scope.offices = scope.deepCopy(data.officeOptions);
    		   for (var i in data.officeOptions) {
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
           });
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
        	   for (var i in scope.officesIdArray) {
                   scope.formData.linkedOffices.push(scope.officesIdArray[i]);
        	   }
               scope.formData.address.locale = scope.optlang.code;
               resourceFactory.couriersResource.save(this.formData, function (data) {
                   location.path('/viewcourier/' + data.resourceId);
        	   });

           };
       }
    });
    mifosX.ng.application.controller('AddCourierController', ['$scope', 'localStorageService', 'ResourceFactory', '$uibModal', '$location', '$http', 'dateFilter', 'API_VERSION', 'Upload', '$rootScope', '$routeParams', mifosX.controllers.AddCourierController]).run(function ($log) {
        $log.info("AddCourierController initialized");
    });
}(mifosX.controllers || {}))