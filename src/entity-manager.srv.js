angular.module("ngPersistence")
	.factory("ngPersistence.EntityManager", function($q, $http, $timeout) {
		/*

			entity
			~~~~~~

			$dirty - check this before running a full recursive check

		*/

	function emptyList(list) {
		list.length = 0;
	}

	function replaceListContent(oldList, newList) {
		emptyList(oldList);
		angular.forEach(newList, function(item) {
			oldList.push(item);
		})
	}


	function createNewEntityList() {
		var entityList = [];
		entityList.$query = function() {

		}
		return entityList;
	}
 

	function assertNotEmptyStringParam(paramValue, paramName){
		if (!paramValue || !angular.isString(paramValue) || paramValue === ""){
			throw new Error(paramName + " must be a full string");
		}
	}

	return function(resourceUrl, primaryKey) {

		assertNotEmptyStringParam(resourceUrl, "resourceUrl");
		assertNotEmptyStringParam(primaryKey, "primaryKey");

		var entityManager,
            localEntitiesRepository,
            remoteEntitiesRepository;


        entityManager = {
            query: query
        };

		localEntitiesRepository = {};
		remoteEntitiesRepository = {};




		function assertEntityPrimaryKey(entity){
			if (!entity.hasOwnProperty(primaryKey)){
				throw new Error("Entity must be a primaryKey");
			}else {
				var id = entity[primaryKey];
				if (!angular.isString(id) && !angular.isNumber(id)){
					throw new TypeError("Entity's primaryKey must be a string or a number");
				}
			}
		}

		function entityDecorator(entity){
			entity.$$dirty = false;
			entity.$isDirty = function(){
				if (entity.$$dirty){
					return true;
				}
			}

			entity.$revertChanges = function(){} // should it take the new remote version?
			entity.$syncWithRemote = function(){ } // is it like revert ?
			return entity;
		}

		function mergeButKeepReference(oldObj, newObj){
			return oldObj;
		}

		function replaceButKeepReference(oldObj, newObj){
			angular.copy(newObj, oldObj);
			return oldObj;
		}

		function mergeNewEntityWithRepository(entity){
			var localEntity = entity;
			assertEntityPrimaryKey(entity);

			var id = entity[primaryKey];
			if (localEntitiesRepository.hasOwnProperty(id) ){

				localEntity = localEntitiesRepository[id];
				if (localEntity.$isDirty() ){
					localEntity = mergeButKeepReference(localEntity, entity);
				}else{
					localEntity = replaceButKeepReference(localEntity, entity);
				}
				remoteEntitiesRepository[id] = entityDecorator(entity);
			}else{
				entity = entityDecorator(entity);
				remoteEntitiesRepository[id] = entity;
				localEntity = localEntitiesRepository[id] = angular.copy(entity);
			}
			return localEntity;
		}

		
		function getSyncWithRepositoryList(newList){
			var syncedList = [];
			angular.forEach(newList, function(entity){
				var mergedEntity = mergeNewEntityWithRepository( entity );
				syncedList.push( mergedEntity ); 
			})
			return syncedList;
		}

		function query (filter, sort) {
			var entityList = createNewEntityList(primaryKey);

			var callUrl = resourceUrl;

			var promise = entityList.$promise = $http.get(callUrl);
			promise.success(function(newList){
				var syncedList = getSyncWithRepositoryList(newList);
				replaceListContent(entityList, syncedList);
			})

			
			return entityList;
		}

		return entityManager;

	}
})


/* possible names:
	Proxy
	Service
	Gate
	API
	Interface
*/


