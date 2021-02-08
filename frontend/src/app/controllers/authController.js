export default class AuthController {
    static get $inject() {
        return ['$rootScope', '$location', 'AjaxService', 'AlertService'];
    }

    constructor($rootScope, $location, AjaxService, AlertService) {
        this.$rootScope = $rootScope;
        this.$location  = $location;
        this.$alert     = AlertService;
        this.$ajax      = AjaxService;
        this.user       = {};
        this.errors     = {};
    }

    /**
     * Autenticacion del usuario
     */
    signIn() {
        this.$ajax.call('/auth/sign-in', { data : this.user })
            .then(response => {
                const data = response.data.data || {};

                // Asignacion de los datos del usuario
                this.$rootScope.user = data.user;

                // Asignacion de datos en el almacenamiento local
                localStorage.setItem('user.name', data.user.name);
                localStorage.setItem('user.email', data.user.email);
                localStorage.setItem('auth.token', data.token);

                // Redireccionamiento
                this.$location.path('/user/search');
            })
            .catch(err => {
                // Asignacion de errores
                this.errors = (err.data || {}).errors || {};

                // Notificacion del error
                this.$alert.notifyAjax(err, true);
            });
    }

    /**
     * Eliminacion de sesion
     */
    logOut() {
        // Limpieza del scope global
        this.$rootScope.user = {};

        // Limpieza del almacenamiento local
        localStorage.removeItem('user.name');
        localStorage.removeItem('user.email');
        localStorage.removeItem('auth.token');

        // Redireccionamiento al login
        this.$location.path('/sign-in');
    }
}
