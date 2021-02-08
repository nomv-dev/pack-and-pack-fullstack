export default class AlertService {
    /**
     * Metodo para la notifiacion mediante alert  basado en la respuesta de un servicio API Rest
     *
     * @param {*} response
     */
    notifyAjax(response, debug = false) {
        // Debug de la respuesta
        if (debug) console.error(response);

        // Mapeado por codigo de estatus
        const status = parseInt(response.status || 500);

        if (status === 406 && 'errors' in response.data) {
            return;
        }

        let title         = 'Error';
        let text          = (response.data || {}).message || 'Ocurrió un error inesperado. Favor de intentarlo más tarde.';
        let icon          = 'error';
        let actionConfirm = () => {};

        if (status >= 100 && status < 200) {
            title = 'Aviso';
            icon  = 'info';
        }
        else if (status >= 200 && status < 300) {
            title = 'Éxito';
            icon  = 'success';
        }
        else if (status >= 400 && status < 500) {
            title = 'Advertencia';
            icon  = 'warning';
        }

        switch (status) {
            case 401:
                text          = 'Su sesión expiró. Favor de autenticarse.';
                actionConfirm = () => location.reload();
                break;

            case 403:
                text = 'No cuenta con los permisos necesarios.';
                break;

            case 404:
                text = 'No fue posible localizar el recurso solicitado.';
                break;
        }

        // Apertura de alerta
        Swal.fire({
                title             : `¡${ title }!`,
                confirmButtonText : 'Aceptar',
                text,
                icon
            })
            .then(result => {
                if (result.isConfirmed) actionConfirm();
            });
    }
}
