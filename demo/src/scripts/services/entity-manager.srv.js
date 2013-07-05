angular.module("angularOrm")
	.factory("EntityManager", function($q, $http, $timeout) {


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


	function createNewEntityList(primaryKey) {
		var entityList = [];
		entityList.$primaryKey = primaryKey;
		entityList.$lastestFromServerList = [];

		entityList.$query = function() {

		}
		// createMapOfKeys
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

			// var attach to queries 

			var callUrl = entityManager.resourceUrl;

			var defer = $q.defer();

			// $http.get(callUrl)

			defer.promise.then(function success(newList) {
				// replaceListContent(entityList.$originalList, result);

				// merge with original entities map

				var syncedList = getSyncWithRepositoryList(newList);
				console.log("Compare Remote", syncedList[0] === localEntitiesRepository[0]);

				replaceListContent(entityList, syncedList);

				//if (result is array)
				//entityList	
				// queriesMap[callUrl] = 

			})

			$timeout(function() {
				defer.resolve([{
						id: 1,
						title: "Task 1"
					}, {
						id: 2,
						title: "Task 2"
					}
				]);
			}, 1000)

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



/*

* holds map by primaryKey of all known entities so far
  keeps references in all of the queries to the same objects,
  keeps a copy of the last state from server that they were (to know diffs)
	for merge - compare lastServer, local and new


*	dirty check flag comparing to the original from server only once, 
	until save or revert

* add a time based EntityManager.saveAll() to sync client & server

  Scenario - grid item in edit mode and same item come back from the 
  server by a different request... what should we do?

merge

compare items

/ detached + sync


query views
~~~~~~~~~~~




notifications - 
~~~~~~~~~~~~~
About to change an changed local item

result from query came back with diff on one of the local objects

resolve conflicts - notification about a possible merge

*/