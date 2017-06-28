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
