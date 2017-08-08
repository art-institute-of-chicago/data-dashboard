(function () {
    'use strict';

    angular
        .module('app')
        .factory('ApiService', Service);

    Service.$inject = ['$http'];

    function Service( $http ) {

        // Reads from env.js or env.default.js, defaults to valet setup
        var settings = {
            url: window.config.API_URL,
        };

        // Add trailing slash to the url, if it's missing
        settings.url = settings.url.replace(/\/?$/, '/');

        // define public interface
        return {
            get: get,
            error: error,
            route: route,
        };

        function get( url, config ) {

            url = getFullUrl( url );

            return $http.get( url, config );

        }

        // Return errors in a standardized format
        // Meant for feeding messages to Notification
        function error( response ) {

            if( response.status <= 0 ) {
                return "Cannot reach server";
            }

            if( "error" in response.data ) {
                return response.data.error;
            }

            // TODO: Make this more specific
            return "Unknown server error";

        }

        function route( url ) {

            return getFullUrl( url );

        }


        // enforce certain url rules, for ease of use
        function getFullUrl( url ) {

            // remove leading slash, if it's present
            url = url.replace(/^\//g, '');

            // remove trailing slash, if it's present
            // Laravel 301's to non-/ URL otherwise
            url = url.replace(/\/$/, '');

            // prepend the base url
            url = settings.url + url;

            return url;

        }

    }

})();
