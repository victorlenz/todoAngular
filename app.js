myTodoApp = angular.module('myApp',['ngRoute']);

myTodoApp.controller('progressController',['$scope','progressService',function ($scope,progressService) {

  $scope.done = progressService.done;
  $scope.pending = progressService.pending;

      console.log($scope.done);
}]);


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
