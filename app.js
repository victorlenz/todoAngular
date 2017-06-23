myTodoApp = angular.module('myApp',['ngRoute']);


myTodoApp.controller('mainController',['$scope',function($scope,$log){

  console.log("working");

  //INITIALISE THE DB FIRST TIME
  if(typeof(Storage) !== "undefined")
  {
    if(localStorage.getItem('taskcount') == null)
    {
      console.log("INITIALISE ");
      localStorage.setItem('taskcount',0);
      var db = {};
      var data =[],taskType=[];
      db.data =  data;
      db.taskType = taskType;
      localStorage.setItem('db',JSON.stringify(db));
    }
  }else {alert("this app will not  work in your  browser");}
  //RETREIVE THE INSTABNCCE OF THE DATABASE
  $scope.db = JSON.parse(localStorage.getItem('db'));


  console.log($scope.db);

  $scope.task ="";
  $scope.taskcount= parseInt(localStorage.getItem('taskcount'));

  //NEW ENTRY OF THE TASK
  $scope.submit = function(){
    if (typeof(Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
        console.log($scope.task);
        console.log("DB Supported");

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
    $scope.listItems.push({"item" : [localStorage.getItem(keys[i])], "key" : [keys[i]]});

  }



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

myTodoApp.controller('completedController',['$scope',function($scope,$log){

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
      $scope.listItems.push({"item" : [localStorage.getItem($scope.lists[i])], "key" : [$scope.lists[i]]});

    }

    console.log("items keys...............................");
    console.log($scope.listItems);

}]);
var test;
myTodoApp.controller('pendingController',['$scope',function($scope,$log){

  $scope.markedDone=function(item)
  {
    $scope.db = JSON.parse(localStorage.getItem('db'));
  //  console.log($scope.db.taskType);
    $scope.db.taskType[searchItemIndex(item,$scope.db.taskType)] = {[item] : "true"};
    console.log($scope.db.taskType[searchItemIndex(item,$scope.db.taskType)]);
    localStorage.setItem('db',JSON.stringify($scope.db));
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
        var item =mySearch(keys[i],allTypes,"false");

        if(item===true)
        $scope.lists.push(keys[i]);

    }

    $scope.listItems =[];

    $scope.db = JSON.parse(localStorage.getItem('db'));
    for(var i=0;i<$scope.lists.length;i++)
    {
      $scope.listItems.push({"item" : [localStorage.getItem($scope.lists[i])], "key" : [$scope.lists[i]]});

    }

    console.log("items keys...............................");
    console.log($scope.listItems);
}]);

myTodoApp.controller('allController',['$scope',function($scope,$log){


}]);

console.log("working");
myTodoApp.directive('toDoList', function(){
  return{
    templateUrl: 'directives/todolistitem.html',
    replace:false
  }
});


function mySearch(nameKey,myArray,c){

  console.log(c);
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
