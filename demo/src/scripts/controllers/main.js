'use strict';

angular.module('angularOrm')
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
