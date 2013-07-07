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

	return function(entityName, resourceUrl, primaryKey) {

		assertNotEmptyStringParam(entityName, "entityName");
		assertNotEmptyStringParam(resourceUrl, "resourceUrl");
		assertNotEmptyStringParam(primaryKey, "primaryKey");

		var entityManager = {};
		entityManager.resourceUrl = resourceUrl;
		entityManager.primaryKey = primaryKey;

		localEntitiesRepository = entityManager.localEntitiesRepository = {};
		remoteEntitiesRepository = entityManager.remoteEntitiesRepository = {};

		entityManager.repo = localEntitiesRepository;

		function assertEntityPrimaryKey(entity){
			if (!entity.hasOwnProperty(entityManager.primaryKey)){
				throw new Error("Entity must be a primaryKey");
			}else {
				var id = entity[entityManager.primaryKey];
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

		entityManager.query = function(filter, sort) {
			var entityList = createNewEntityList(primaryKey);

			var callUrl = entityManager.resourceUrl;

			var promise = entityList.$promise = $http.get(callUrl);
			promise.success(function(newList){
				var syncedList = getSyncWithRepositoryList(newList);
				replaceListContent(entityList, syncedList);
			})

			
			return entityList;
		}

		entityManager.get = function() {

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

.factory("TaskProxy", function(EntityManager) {
	return EntityManager("Task", "/task", "id");
})

