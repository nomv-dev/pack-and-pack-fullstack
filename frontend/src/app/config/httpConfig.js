import appModule from '../app';

// Configuracion de credenciales para el proveedor Http
appModule.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.common['Authorization'] = 'Bearer ' + (localStorage.getItem('auth.token') || 'none');
}]);
