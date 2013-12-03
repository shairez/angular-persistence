'use strict';

angular.module('angularPersistenceDemo', ['ngPersistence', 'ngMockE2E', "ui.bootstrap.rating"])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })

  .run(function($httpBackend, $http){
    $httpBackend.whenGET(/.html/).passThrough();

    $httpBackend.whenGET("/task").respond(200, [{id:1, title: "Task 1", rate: 3},
                                                {id:2, title: "Task 2", rate: 3}]);

    // $http.get("/main.html").success(function(data){}).error(function(error){
    //   console.log(error)
    // });
  })
