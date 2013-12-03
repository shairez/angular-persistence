'use strict';

angular.module('angularPersistenceDemo', ['ngPersistence', 'ngMockE2E', "ui.bootstrap.rating", "ngGrid"])
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

    $httpBackend.whenGET("/ads").respond(200, [{id:1, title: "House", rate: 3},
                                                {id:2, title: "Car", rate: 3}]);

    // $http.get("/main.html").success(function(data){}).error(function(error){
    //   console.log(error)
    // });
  })
