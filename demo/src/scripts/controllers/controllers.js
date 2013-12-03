'use strict';

angular.module('angularPersistenceDemo')



  .controller('MainCtrl', function ($scope) {
        $scope.myData = [{name: "Moroni", age: 50},
            {name: "Teancum", age: 43},
            {name: "Jacob", age: 27},
            {name: "Nephi", age: 29},
            {name: "Enos", age: 34}];
        $scope.myOptions = { data: 'myData',
            enableCellEdit: true,
            multiSelect: false};
  })

  .controller('hotStuffCtrl', function ($scope, adsEntityMananger) {
    $scope.hotStuff = adsEntityMananger.query(null)
  })

  .controller('sortByPriceCtrl', function ($scope, TaskProxy) {

    $scope.productList = TaskProxy.query();

  })

  .controller('thirdCtrl', function ($scope, TaskProxy) {
    $scope.tasksList = TaskProxy.query();
  })

.factory("TaskProxy", ["ngPersistence.EntityManager", function(EntityManager) {
  return EntityManager("Task", "/task", "id");
}])
