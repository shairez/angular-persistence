describe("Entity Manager", function() {
    var EntityManager,
    	emInstance,
    	$httpBackend,
    	queryResult,
    	anotherQueryResult;
    

     beforeEach(module('ngPersistence'));

    beforeEach(inject(["ngPersistence.EntityManager",
    				   "$httpBackend", 
    				   function(EM, httpBackend) {
        EntityManager = EM;
        $httpBackend = httpBackend;
      }])
    ); 

	
   	describe('Initialization', function() {
    	it('Should throw an error when entityName is missing', function() {
    		expect(EntityManager).toThrow();
    	});
    	it('Should throw an error when resourceUrl is missing', function() {
    		function init(){ EntityManager("name"); }
    		expect(init).toThrow();
    	});
    	it('Should throw an error when primaryKey is missing', function() {
    		function init(){ EntityManager("name", "/"); }
    		expect(init).toThrow();
    	});
    	it('Should not throw errors when all params are there', function() {
    		function init(){ EntityManager("name", "/", "id"); }
    		expect(init).not.toThrow();
    	});
    })

	describe('Querying for a list of entities', function() {

		Given(function(){ emInstance = EntityManager("name", "/", "id") });


		describe('Should return an entity list from server', function() {
			Given(function(){ $httpBackend.expectGET("/").respond([]) ; });
			When(function(){ queryResult = emInstance.query();
							 $httpBackend.flush(); });
			Then(function(){  expect(angular.isArray(queryResult)).toBe(true); 
							  expect(queryResult.$promise.then).toBeDefined() 
							});	

		})

		describe('Should return a synced list', function() {
			
			Given(function(){ $httpBackend.whenGET("/").respond([{id:1}]); });
			When(function(){ queryResult = emInstance.query(); 
							 anotherQueryResult = emInstance.query(); 
							 $httpBackend.flush();  })
			Then(function(){  expect(queryResult[0]).toBeDefined();
							  expect(queryResult[0]).toEqual(anotherQueryResult[0]) });	
		})

		describe('Primary key', function() {
			var makeTheCall = function () {
					queryResult = emInstance.query(); 
					$httpBackend.flush();
			}

			describe('Must be inside a returned item', function() {
				Given(function(){ $httpBackend.whenGET("/").respond([{name:"Test"}]); });
				Then(function() { expect(makeTheCall).toThrow() })
			})

			describe('Must be a string or a number', function() {
				Given(function(){ $httpBackend.whenGET("/").respond([{id:undefined}]); });
				Then(function() { expect(makeTheCall).toThrow() })
			})
		})
		
		describe('Saving changes', function() {
			Given(function(){ $httpBackend.whenGET("/").respond([{id:1, name:"Test"}]);
							  queryResult = emInstance.query(); 
							  $httpBackend.flush(); });
			When(function(){ queryResult[0].name = "test2";
							 queryResult.$save();
			 });
			Then(function(){  });
		})
	})

	/* 
		a query should return a list


	* custom headers
	* cache results

detache list
detach entity

sync entity
sync list

1.
query a list from the server
make changes to it
save the changes

2.
query a detached list
make changes to items
save changes

3.
query a list from the server
get and detach item
make changes
merge back to the server


What happen if a detach item get saved after a change was made on the server?


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

    
});

