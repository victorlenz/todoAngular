var myTodoApp = angular.module('myApp',['ngRoute','ui.select', 'ngSanitize']);

myTodoApp.controller('progressController',['$scope','progressService',function ($scope,progressService) {

  $scope.done = progressService.done;
  $scope.pending = progressService.pending;

      console.log($scope.done);
}]);

myTodoApp.controller('test',function($scope){

  $scope.itemArray = [{id: 1, name: 'first'},
        {id: 2, name: 'second'},
        {id: 3, name: 'third'},
        {id: 4, name: 'fourth'},
        {id: 5, name: 'fifth'}];
  $scope.$watch('selected.value', function(pre,pos){
    console.log(pre,pos);
  });
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
