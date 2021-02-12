import appModule from './app';

appModule.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/sign-in', {
            templateUrl  : '../views/sign-in.html',
            controller   : 'AuthController',
            controllerAs : 'app'
        })
        .when('/user/register', {
            templateUrl  : '../views/user/register.html',
            controller   : 'UserController',
            controllerAs : 'app'
        })
        .when('/user/search', {
            templateUrl  : '../views/user/search.html',
            controller   : 'UserController',
            controllerAs : 'app'
        })
        .otherwise('/user/search');
}]);
