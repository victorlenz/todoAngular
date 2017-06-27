myTodoApp = angular.module('myApp',['ngRoute']);


myTodoApp.controller('mainController',['$scope','$route','progressService',function($scope,$route,progressService){

   //funciton invoked when the delete is cliced in the tasklist 'item' is task id
    $scope.delete = function(item)
    {
      //call service function and passes the pram as id of the task
      progressService.clickDelete(item);

    }

    //function is called when delete is clicked on the tasklist
    $scope.markedDone=function(item)
    {
        //get the instance of db
        $scope.db = JSON.parse(localStorage.getItem('db'));
        //  searchItemIndex returns the index of taskkey for its type, then at that index new object with true value is overwritten
        $scope.db.taskType[searchItemIndex(item,$scope.db.taskType)] = {[item] : "true"};
        //now the database is overwritten with new object
        localStorage.setItem('db',JSON.stringify($scope.db));
        //route is refreshed
        $route.reload();
    }


  //INITIALISE THE DB FIRST TIME
  if(typeof(Storage) !== "undefined")
  {
    if(localStorage.getItem('taskcount') == null)
    {
      console.log("INITIALISE");
      localStorage.setItem('taskcount',0);
      var db = {};
      var data =[],taskType=[];
      db.data =  data;
      db.taskType = taskType;
      localStorage.setItem('db',JSON.stringify(db));


    }
  }else
    { alert("this app will not  work in your  browser"); }

  //RETREIVE THE INSTABNCCE OF THE DATABASE
  $scope.db = JSON.parse(localStorage.getItem('db'));


  console.log($scope.db);

  //default value of the task
  $scope.task ="";
  //get the total no of tasks, it usually acts as providing id to the taskKey
  $scope.taskcount= parseInt(localStorage.getItem('taskcount'));

  //NEW ENTRY OF THE TASK
  $scope.submit = function(){

    if($scope.task == '' || $scope.task == null)
        return;

    if (typeof(Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
        console.log($scope.task);
        console.log("DB Supported");

          $scope.db = JSON.parse(localStorage.getItem('db'));
          //GET THE CURRENT NO OF TASKS
          $scope.taskCount=  parseInt(localStorage.getItem('taskcount'));

          //SET THE TASK ID
          $scope.db.data.push({'taskKey':'task'+$scope.taskCount});

          //NOW INSERT TASK WITH SAME ID
          localStorage.setItem('task'+$scope.taskCount,$scope.task);

          //UPDATE THE KEYS
          localStorage.setItem('db', JSON.stringify($scope.db));

          //SET THE TASK TYPE false means pending and true means completed

          $scope.db.taskType.push({['task'.concat($scope.taskCount)] : 'false'});
          localStorage.setItem('db',JSON.stringify($scope.db));
          console.log("tasktype"+localStorage.getItem('tasktype'));

          //INCREMENT THE TASKCOUNT
          localStorage.setItem('taskcount',++$scope.taskCount);

          console.log(localStorage.getItem('db'));

          $scope.task ='';

          /*for(var i=0;i<$scope.db.data.length; i++)
          {
          console.log(localStorage.getItem($scope.db.data[i].taskKey));
        }*/

        //RETREIVE temporary instance of db
        var x= JSON.parse(localStorage.getItem('db'));
        var keys =[];
        //this loop will retrive all the keys for the tasks in keys var
        for(var i=0;i<x.data.length;i++)
          keys.push(x.data[i].taskKey);

        //allTypes var will contain all the tasks having its type
        var allTypes = JSON.parse(localStorage.getItem('db')).taskType;
      //  self = allTypes;
        console.warn(allTypes[0]);
        console.warn(keys);
        console.log("search result ");

        //just for test
        for(var i=0;i<keys.length; i++)
          console.log(mySearch(keys[i],allTypes,"false"));

        $route.reload();

      } else {
        // Sorry! No Web Storage support..
        console.log("DB not Supported");
      }

  }

  //same as previous
  $scope.taskCount= parseInt(localStorage.getItem("taskcount"));
  console.log(  $scope.taskCount);


  var x= JSON.parse(localStorage.getItem('db'));
  var keys =[];
  for(var i=0;i<x.data.length;i++)
    keys.push(x.data[i].taskKey);

  $scope.db = JSON.parse(localStorage.getItem('db'));
  $scope.listItems =[];
  for(var i=0;i<keys.length;i++)
  {
    $scope.listItems.push({"item" : [localStorage.getItem(keys[i])], "key" : [keys[i]] , 'type' : [searchTaskType(keys[i],$scope.db.taskType)]});

  }
    //progressService.setTotalTask($scope.listItems.length);

  //$scope.listItems.slice().reverse();



}]);

//route config for the app
myTodoApp.config(function($routeProvider){
    $routeProvider
      .when("/",{
        templateUrl:"views/main.html",
        controller:"mainController"
      }).
      when('/completed',{
        templateUrl: 'pages/completed.html',
        controller : 'completedController'
      }).
      when('/pending',{
        templateUrl : 'pages/pending.html',
        controller: 'pendingController'
      }).
      when("/all",{
        templateUrl:"views/main.html",
        controller:"mainController"
      });
});

//controller for the menubar
myTodoApp.controller('menuBar',function($scope,progressService,$route,$location){

  //monitor for the route change
  $scope.$on('$locationChangeStart', function(event) {

    //$scope.location variable is sent to the view when is updated
    $scope.location =$location.path();
    $route.reload();

});

  //when markAllCompleted is clicked
  $scope.markAllCompleted = function(){

    //retreives all the pending task
    $scope.pending = progressService.pendingTask();
    //retrei the db
    $scope.db = JSON.parse(localStorage.getItem('db'));

    //loops through each not completed i.e the type of the task which is false
    for(var i=0; i< $scope.pending.length ;i++)
    {
      console.log(searchItemIndex($scope.pending[i].key[0],$scope.db.taskType));
      //directly modifying the taskType, searchItemIndex returns index of the key of task, then setting that task with same key with new object
      $scope.db.taskType[searchItemIndex($scope.pending[i].key[0],$scope.db.taskType)] = {[$scope.pending[i].key[0]] : "true"};
    }

    //now that we have updated the tasktype in variable lets save this object to the database
    localStorage.setItem('db',JSON.stringify($scope.db));
    console.log("final db");
    console.info(localStorage.getItem('db'));
    //then refresht the route
    $route.reload();
  }

  //for deleting all the tasks
  $scope.clearAll = function(){

    //clear the local storage
    localStorage.clear();
    var db = {};
    var data =[],taskType=[];
    db.data =  data;
    db.taskType = taskType;
    //a empty object having the consistent db structure has been set to the localStorage
    localStorage.setItem('db',JSON.stringify(db));
    //resetting the id to 0
    localStorage.setItem('taskcount',0);
    $route.reload();

  }

  //when removeAllCompleted is clicked
  $scope.removeAllCompleted = function(){

    //retireve the temporary instance of  the database
    var x =  JSON.parse(localStorage.getItem('db'));
    //retreive the all the types keypairs
    var allTypes = JSON.parse(localStorage.getItem('db')).taskType;
    var keys =[];

    //store all the keys  of tasks
    for(var i=0;i<x.data.length;i++)
      keys.push(x.data[i].taskKey);
    $scope.lists = [];

    //loop for the tasks keys having true in taskType objext
      for(var i=0;i<keys.length; i++)
      {
          //retreive the taskType for the current key
          var item =mySearch(keys[i],allTypes,"true");
          //if its true then simply push it to the lists object
          if(item===true)
          $scope.lists.push(keys[i]);

      }

      $scope.listItems =[];

      $scope.db = JSON.parse(localStorage.getItem('db'));

      console.log($scope.lists);

      for(var i=0;i<$scope.lists.length;i++)
      {
      //  $scope.listItems.push({"item" : [localStorage.getItem($scope.lists[i])], "key" : [$scope.lists[i]]});

        //remove the keys
          self.db.data.splice(searchDataItemIndex($scope.lists[i],self.db.data),1);
          //remove the taskType
          self.db.taskType.splice(searchItemIndex($scope.lists[i],self.db.taskType),1);
          //remove the item from localStorage
          localStorage.removeItem($scope.lists[i]);

      }
      //update the localStorage
      localStorage.setItem('db',JSON.stringify(self.db));
      //reload the route
      $route.reload();
  }

});



myTodoApp.controller('completedController',['$scope','$log','$route',function($scope,$log,$route){

    //when user clicks markedDone button
    $scope.markedDone=function(item){

        $scope.db = JSON.parse(localStorage.getItem('db'));
        // set the tasks having  their  taskType  to true
        $scope.db.taskType[searchItemIndex(item,$scope.db.taskType)] = {[item] : "true"};
        console.log($scope.db.taskType[searchItemIndex(item,$scope.db.taskType)]);

        localStorage.setItem('db',JSON.stringify($scope.db));
        $route.reload();
    }

  var x= JSON.parse(localStorage.getItem('db'));

  //retrive all the keys for the tasks
  var keys =[];
  for(var i=0;i<x.data.length;i++)
    keys.push(x.data[i].taskKey);
  var allTypes = JSON.parse(localStorage.getItem('db')).taskType;
//  self = allTypes;
  console.warn(allTypes[0]);
  console.warn(keys);
  console.log("search result ");

  $scope.lists = [];
    for(var i=0;i<keys.length; i++)
    {
        //search for the tasks ffor completed
        var item =mySearch(keys[i],allTypes,"true");

        //if its found then push to the list
        if(item===true)
        $scope.lists.push(keys[i]);

    }

    $scope.listItems =[];

    $scope.db = JSON.parse(localStorage.getItem('db'));

    //loop through all the keys for the completed task and then push to the listItems available for the view
    for(var i=0;i<$scope.lists.length;i++)
    {

      $scope.listItems.push({"item" : [localStorage.getItem($scope.lists[i])], "key" : [$scope.lists[i]], 'type' : [searchTaskType($scope.lists[i],$scope.db.taskType)]});

    }

    console.log("items keys...............................");
    console.log($scope.listItems);

}]);


myTodoApp.controller('pendingController',['$scope','$log','progressService','$route',function($scope,$log,progressService,$route){


  $scope.markedDone=function(item)
  {
    $scope.db = JSON.parse(localStorage.getItem('db'));
    //  console.log($scope.db.taskType);
    $scope.db.taskType[searchItemIndex(item,$scope.db.taskType)] = {[item] : "true"};
    console.log($scope.db.taskType[searchItemIndex(item,$scope.db.taskType)]);
    localStorage.setItem('db',JSON.stringify($scope.db));
    $route.reload();
  }

    $scope.listItems = progressService.pendingTask();

    console.log("items keys...............................");
    console.log($scope.listItems);
}]);

myTodoApp.controller('allController',['$scope',function($scope){


}]);

myTodoApp.directive('toDoList', function(){
  return{
    templateUrl: 'directives/todolistitem.html',
    replace:true
  }
});

myTodoApp.controller('progressController',['$scope','progressService',function ($scope,progressService) {

  $scope.done = progressService.done;
  $scope.pending = progressService.pending;

      console.log($scope.done);
}]);

myTodoApp.service('progressService',function () {

    //as name describes same calls as
    this.self = this;
    this.done = 1;
    this.pending =1;

    //returns the lotal no of tasksas abvious from the code
    this.totalTasks =function(){
        var x= JSON.parse(localStorage.getItem('db'));
        return x.data.length;
    }


    //returns the object of the pending tasks
    this.pendingTask = function () {
        var x= JSON.parse(localStorage.getItem('db'));

        //gets keys for the all the tasks
        var keys =[];
        for(var i=0;i<x.data.length;i++)
            keys.push(x.data[i].taskKey);

        var allTypes = JSON.parse(localStorage.getItem('db')).taskType;
        console.warn(allTypes[0]);
        console.warn(keys);
        console.log("search result ");
        self.lists = [];

        //looop throught the taks 
        for(var i=0;i<keys.length; i++)
        {
            var item =mySearch(keys[i],allTypes,"false");

            if(item===true)
                self.lists.push(keys[i]);

        }

        self.listItems =[];

        self.db = JSON.parse(localStorage.getItem('db'));
        for(var i=0;i<self.lists.length;i++)
        {
            self.listItems.push({"item" : [localStorage.getItem(self.lists[i])], "key" : [self.lists[i]], 'type' : [searchTaskType(self.lists[i],self.db.taskType)]});

        }

        return self.listItems;
    }

    this.completedTask = function () {

    }

    this.clickMarked =  function (item) {

        self.db = JSON.parse(localStorage.getItem('db'));
        //  console.log($scope.db.taskType);
        self.db.taskType[searchItemIndex(item,$scope.db.taskType)] = {[item] : "true"};
        console.log(self.db.taskType[searchItemIndex(item,self.db.taskType)]);
        localStorage.setItem('db',JSON.stringify(self.db));


    }

    this.clickDelete=function(item)
    {
        self.db = JSON.parse(localStorage.getItem('db'));

        self.db.data.splice(searchDataItemIndex(item,self.db.data),1);

        self.db.taskType.splice(searchItemIndex(item,self.db.taskType),1);

        localStorage.removeItem(item);

        localStorage.setItem('db',JSON.stringify(self.db));

    }

    this.clickEdit =  function (item,newValue) {

        localStorage.setItem(item,newValue);
    }


});

function searchTaskType(nameKey,myArray){

    for (var i=0; i < myArray.length; i++) {
        if (myArray[i][nameKey] !== undefined) {
            return myArray[i][nameKey];
        }
    }
}

function mySearch(nameKey,myArray,c){

    for (var i=0; i < myArray.length; i++) {
        if (myArray[i][nameKey] !== undefined) {

          if(myArray[i][nameKey] == c)
            {
              //return myArray[i];
              return true;
            }
        }
    }
}

function searchItemIndex(nameKey,myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i][nameKey] !== undefined) {
              //return myArray[i];
              return i;
        }
    }
}

function searchDataItemIndex(nameKey,myArray){
    for (var i=0; i < myArray.length; i++) {
        if(db.data[i].taskKey === nameKey)
                return i;
    }
    return -1;
}
