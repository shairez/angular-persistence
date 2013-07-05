describe("Entity Manager", function() {
    var EntityManager,
    	emInstance,
    	$httpBackend,
    	queryResult;
    

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


		Given(function(){ $httpBackend.resetExpectations() });
		Given(function(){ emInstance = EntityManager("name", "/", "id") });
		Given(function(){ $httpBackend.expectGET("/").respond([]) });
		
		When(function(){ queryResult = emInstance.query() });
		
		Then(function(){  expect(angular.isArray(queryResult)).toBe(true); });	
		Then(function(){  expect(queryResult.$promise.then).toBeDefined() });	
		
		
	})

    
});

