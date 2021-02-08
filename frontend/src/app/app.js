import angular from 'angular';
import 'angular-route';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import '../style/app.css';
import appDirective from './directives/appDirective';
import AjaxService from './services/ajaxService';
import AlertService from './services/alertService';
import AuthController from './controllers/authController';
import AppController from './controllers/appController';
import UserController from './controllers/userController';

// Inicializacion de paquetes
window.Swal = require('sweetalert2');

// Configuracion del modulo principal
const appModule = angular.module('app', ['ngRoute'])
    .run(($rootScope, $location) => {
        $rootScope.$on('$routeChangeStart', () => {
            // Definicion de ruta activa
            $rootScope.currentLocation = $location.path();

            // Asignacion de datos del usuario en sesion
            const name  = localStorage.getItem('user.name');
            const email = localStorage.getItem('user.email');

            $rootScope.user = (name && email) ? { name, email } : null;

            // Validacion de existencia de token de autenticacion
            if (!localStorage.getItem('auth.token') && $rootScope.currentLocation !== '/user/register') $location.path('/sign-in');
        });
    })
    .directive('app', appDirective)
    .service('AlertService', AlertService)
    .service('AjaxService', AjaxService)
    .controller('AppController', AppController)
    .controller('AuthController', AuthController)
    .controller('UserController', UserController);

export default appModule;

// Configuracion global
// require('./config/httpConfig');

// Configuracion de rutas
require('./routes');
