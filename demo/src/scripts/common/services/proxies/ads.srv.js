angular.module("angularPersistenceDemo")
.factory("adsProxy", ["ngPersistence.EntityManager", function(EntityManager) {
	
	return EntityManager("/ads", "id");
}]);