myTodoApp = angular.module('myApp',['ngRoute']);


myTodoApp.controller('mainController',['$scope','$route','progressService',function($scope,$route,progressService){

    $scope.delete = function(item)
    {
      progressService.clickDelete(item);

      progressService.pending =  progressService.pendingTask().length;
      progressService.done = progressService.totalTasks() - progressService.pending;
    }

    $scope.markedDone=function(item)
    {
        $scope.db = JSON.parse(localStorage.getItem('db'));
        //  console.log($scope.db.taskType);
        $scope.db.taskType[searchItemIndex(item,$scope.db.taskType)] = {[item] : "true"};
        console.log($scope.db.taskType[searchItemIndex(item,$scope.db.taskType)]);
        localStorage.setItem('db',JSON.stringify($scope.db));

        progressService.pending =  progressService.pendingTask().length;
        progressService.done = progressService.totalTasks() - progressService.pending;

        $route.reload();
    }

  console.log("working");

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

  $scope.task ="";
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

        var x= JSON.parse(localStorage.getItem('db'));
        var keys =[];
        for(var i=0;i<x.data.length;i++)
          keys.push(x.data[i].taskKey);
        var allTypes = JSON.parse(localStorage.getItem('db')).taskType;
      //  self = allTypes;
        console.warn(allTypes[0]);
        console.warn(keys);
        console.log("search result ");
        for(var i=0;i<keys.length; i++)
          console.log(mySearch(keys[i],allTypes,"false"));

          progressService.pending =  progressService.pendingTask().length;
          progressService.done = progressService.totalTasks() - progressService.pending;

        $route.reload();

      } else {
        // Sorry! No Web Storage support..
        console.log("DB not Supported");
      }

  }

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


myTodoApp.controller('menuBar',function($scope,progressService,$route,$location){

  $scope.$on('$locationChangeStart', function(event) {

    $scope.location =$location.path();
    $route.reload();

});

  $scope.markAllCompleted = function(){
    $scope.pending = progressService.pendingTask();

    $scope.db = JSON.parse(localStorage.getItem('db'));

    for(var i=0; i< $scope.pending.length ;i++)
    {
      console.log(searchItemIndex($scope.pending[i].key[0],$scope.db.taskType));
      $scope.db.taskType[searchItemIndex($scope.pending[i].key[0],$scope.db.taskType)] = {[$scope.pending[i].key[0]] : "true"};
    }

    localStorage.setItem('db',JSON.stringify($scope.db));
    console.log("final db");
    console.info(localStorage.getItem('db'));
    $route.reload();
  }

  $scope.clearAll = function(){

    localStorage.clear();
    var db = {};
    var data =[],taskType=[];
    db.data =  data;
    db.taskType = taskType;
    localStorage.setItem('db',JSON.stringify(db));
    localStorage.setItem('taskcount',0);
    $route.reload();

  }

  $scope.removeAllCompleted = function(){
    var x =  JSON.parse(localStorage.getItem('db'));
    var allTypes = JSON.parse(localStorage.getItem('db')).taskType;
    var keys =[];
    for(var i=0;i<x.data.length;i++)
      keys.push(x.data[i].taskKey);
    $scope.lists = [];
      for(var i=0;i<keys.length; i++)
      {
          var item =mySearch(keys[i],allTypes,"true");

          if(item===true)
          $scope.lists.push(keys[i]);

      }

      $scope.listItems =[];

      $scope.db = JSON.parse(localStorage.getItem('db'));

      console.log($scope.lists);

      for(var i=0;i<$scope.lists.length;i++)
      {
      //  $scope.listItems.push({"item" : [localStorage.getItem($scope.lists[i])], "key" : [$scope.lists[i]]});

          self.db.data.splice(searchDataItemIndex($scope.lists[i],self.db.data),1);

          self.db.taskType.splice(searchItemIndex($scope.lists[i],self.db.taskType),1);

          localStorage.removeItem($scope.lists[i]);

          localStorage.setItem('db',JSON.stringify(self.db));


      }

      $route.reload();
  }

});



myTodoApp.controller('completedController',['$scope','$log','$route',function($scope,$log,$route){

    $scope.markedDone=function(item){
        $scope.db = JSON.parse(localStorage.getItem('db'));
        //  console.log($scope.db.taskType);
        $scope.db.taskType[searchItemIndex(item,$scope.db.taskType)] = {[item] : "true"};
        console.log($scope.db.taskType[searchItemIndex(item,$scope.db.taskType)]);
        localStorage.setItem('db',JSON.stringify($scope.db));
        $route.reload();
    }

  var x= JSON.parse(localStorage.getItem('db'));


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
        var item =mySearch(keys[i],allTypes,"true");

        if(item===true)
        $scope.lists.push(keys[i]);

    }

    $scope.listItems =[];

    $scope.db = JSON.parse(localStorage.getItem('db'));
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

    this.self = this;
    this.done = 1;
    this.pending =1;

    this.totalTasks =   function(){
        var x= JSON.parse(localStorage.getItem('db'));
        return x.data.length;
    }



    this.pendingTask = function () {
        var x= JSON.parse(localStorage.getItem('db'));
        var keys =[];
        for(var i=0;i<x.data.length;i++)
            keys.push(x.data[i].taskKey);

        var allTypes = JSON.parse(localStorage.getItem('db')).taskType;
        console.warn(allTypes[0]);
        console.warn(keys);
        console.log("search result ");
        self.lists = [];

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
