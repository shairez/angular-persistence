AngularJS Persistence (under construction)
=========

A library to add true data binding between your model and controllers

Solves the following problems:
* Keeping the same entities persistent
* Dealing with sync issues


# EntityManager factory

### Methods

#### `EntityManager(entityName, resourceUrl, primaryKey)`

Creates a new EntityManager instance

*   `entityName`: required, the name of the entity
*   `resourceUrl`: required, the base url for calling a rest service
*   `primaryKey`: required, Must be either a String or a Number

Returns

*   `entityManagerInstance`: See below

Example:

    var taskEntityManager = EntityManager("task", "/tasks", "taskId");


## EntityManager Instance

### Methods

#### `entityManagerInstance.query()`

Makes an `$http` call to the `resourceUrl` and return a list of synced items

Example:

    var tasks = taskEntityManager.query();

### About synced items

An entity manger holds an internal map of entites by their `primaryKey`, and each time a respose returns from the server, a new list is created with a reference to the same object in that map. 
That way we get a data binding between different lists in our app which holds up the same entites and don't have to manually sync them on each change.