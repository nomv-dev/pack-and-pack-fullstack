export default class UserController {
    static get $inject() {
        return ['$scope', '$location', 'AjaxService', 'AlertService'];
    }

    constructor($scope, $location, AjaxService, AlertService) {
        this.$scope            = $scope;
        this.$location         = $location;
        this.$alert            = AlertService;
        this.$ajax             = AjaxService;
        this.user              = {};
        this.usersSearch       = {};
        this.users             = [];
        this.errors            = {};
        this.$scope.pagination = {
            currentPage    : 0,
            itemsPerPage   : 10,
            paginatedUsers : []
        };

        // Observador para el paginado
        this.$scope.$watch('pagination.currentPage', () => {
            if (this.$scope.pagination.currentPage < 1) return;

            // Rango
            const start = ((this.$scope.pagination.currentPage - 1) * this.$scope.pagination.itemsPerPage);
            const end   = start + this.$scope.pagination.itemsPerPage;

            // Filtrado
            this.$scope.pagination.paginatedUsers = this.users.slice(start, end);
        });
    }

    /**
     * Limpieza de formulario de registro
     */
    clear() {
        this.errors = {};
        this.user   = {};
    }

    /**
     * Registro del usuario
     */
    save() {
        // Validacion manual de la confirmacion de contrasenia
        if (this.user.password !== this.user.passwordConfirm) {
            this.errors = { passwordConfirm : 'Las contraseñas no coinciden.' };

            this.$alert.notifyAjax({ status : 406, data : { message : 'Favor de revisar la información ingresada.' } });

            return;
        }

        // Consumo de API Rest
        this.$ajax.call('/user/register', { data : this.user })
            .then(response => {
                this.$alert.notifyAjax(response);
                this.clear();
            })
            .catch(err => {
                // Asignacion de errores
                this.errors = Object.assign((err.data || {}).errors || {}, this.errors.passwordConfirm ? { passwordConfirm : this.errors.passwordConfirm } : {});

                // Notificacion del error
                this.$alert.notifyAjax(err, true);
            });
    }

    /**
     * Limpieza de formulario de busqueda
     */
    clearSearch(clearFilters = true) {
        if (clearFilters) this.usersSearch = {};

        this.users                            = [];
        this.$scope.pagination.currentPage    = 0;
        this.$scope.pagination.paginatedUsers = [];
    }

    /**
     * Consulta filtrada
     */
    search() {
        // Reinicio de paginacion
        this.clearSearch(false);

        // Consumo de API Rest
        this.$ajax.call('/user/search', { data : this.usersSearch })
            .then(response => {
                this.users                         = response.data.data;
                this.$scope.pagination.currentPage = 1;

                if (!this.users.length) this.$alert.notifyAjax({ status : 100, data : { message : 'No se encontraron registros.' } });
            })
            .catch(err => {
                // Notificacion del error
                this.$alert.notifyAjax(err, true);
            });
    }

    /**
     * Evalua el numero de paginas por la consulta realizada
     */
    getPages() {
        let start  = 0;
        let range  = [];
        const stop = Math.ceil(this.users.length / this.$scope.pagination.itemsPerPage);

        for (; start < stop; ) {
            range[start] = start + 1;
            start        += 1;
        }

        return range.filter(v => v !== null);
    };

    /**
     * Eliminacion del usuario
     *
     * @param {*} id
     */
    delete(id) {
        // Confirmacion
        Swal.fire({
            title             : '¿Está seguro de eliminar al usuario?',
            text              : 'El usuario se eliminara de forma permanente.',
            icon              : 'warning',
            showCancelButton  : true,
            cancelButtonText  : 'Cancelar',
            confirmButtonText : 'Si, eliminar'
        })
        .then(result => {
            if (result.isConfirmed) {
                // Consumo de API Rest
                this.$ajax.call('/user/delete', { data : { id } })
                    .then(response => {
                        // Recarga de consulta original
                        this.search();

                        // Notificacion de exito
                        this.$alert.notifyAjax(response);
                    })
                    .catch(err => {
                        // Notificacion del error
                        this.$alert.notifyAjax(err, true);
                    });
            }
        });
    }
}
