'use strict';

angular.module('angularPersistenceDemo')



  .controller('MainCtrl', function ($scope) {
    
  })

  .controller('firstCtrl', function ($scope) {
    
  })

  .controller('secondCtrl', function ($scope, TaskProxy) {

    $scope.tasksList = TaskProxy.query();

  })

  .controller('thirdCtrl', function ($scope, TaskProxy) {
    $scope.tasksList = TaskProxy.query();
  })

.factory("TaskProxy", ["ngPersistence.EntityManager", function(EntityManager) {
  return EntityManager("Task", "/task", "id");
}])
