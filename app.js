myTodoApp = angular.module('myApp',['ngRoute']);

myTodoApp.controller('mainController',['$scope',function($scope){

  console.log("working");

  $scope.task ="";
  $scope.submit = function(){
    if (typeof(Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
        console.log($scope.task);
        console.log("DB Supported");

        if(!$scope.taskCount)
          localStorage.setItem('taskcount',0);
          localStorage.setItem("task"+$scope.taskCount,$scope.task);
      } else {
        // Sorry! No Web Storage support..
        console.log("DB not Supported");
      }
  }

  $scope.taskCount= parseInt(localStorage.getItem("taskcount"));
  console.log(  $scope.taskCount);

}]);

myTodoApp.config(function($routeProvider){
    $routeProvider
      .when("/",{
        templateUrl:"views/main.html",
        controller:"mainController"
      });
});

console.log("working");
myTodoApp.directive('toDoList', function(){
  return{
    templateUrl: 'directives/todolistitem.html',
    replace:false
  }
});
