import { uriBackend } from '../config/constants';

export default class AjaxService {
    static get $inject() {
        return ['$http'];
    }

    constructor($http) {
        this.$http         = $http;
        this.defaultConfig = {
            method : 'POST'
        };
    }

    /**
     * Consumo de servicio via Ajax
     *
     * @param {*} url
     * @param {*} config
     */
    call(url, config = {}) {
        return this.$http(
            Object.assign(
                this.defaultConfig,
                (config || {}),
                {
                    headers : {
                        'Authorization' : 'Bearer ' + (localStorage.getItem('auth.token') || 'none')
                    }
                },
                {
                    url : uriBackend + url
                }
            )
        );
    }
}
