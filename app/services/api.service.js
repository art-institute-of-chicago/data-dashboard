(function () {
    'use strict';

    angular
        .module('app')
        .factory('ApiService', Service);

    Service.$inject = ['$http', '$rootScope', '$window'];

    function Service( $http, $rootScope, $window ) {

        // Used to store things like the API URL to target
        var settings = {};

        // Prewarm settings
        initEnv();

        // define public interface
        return {
            get: get,
            post: post,
            error: error,
            route: route,
            getEnv: getEnv,
            setEnv: changeEnv,
        };

        function get( url, config ) {

            url = getFullUrl( url );

            return $http.get( url, config );

        }

        function post( url, config ) {

            url = getFullUrl( url );

            return $http.post( url, config );

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

        function getEnv()
        {
            return settings.env;
        }


        function getEnvs( env ) {

            return window.config.API_URLS;

        }

        function initEnv()
        {
            var env = $window.localStorage.getItem('env');

            console.log( env );

            return setEnv( env );

        }

        function changeEnv( env )
        {
            var url = setEnv( env );

            $rootScope.$emit('envChanged');

            return url;
        }

        function setEnv( env ) {

            console.log( env );

            // Use the helper function for fallback logic
            settings.url = getEnvFromEnvs( env );

            // Add trailing slash to the url, if it's missing
            settings.url = settings.url.replace(/\/?$/, '/');

            // Save env to localStorage
            $window.localStorage.setItem('env', env);

            settings.env = env;

            return settings.url;

        }

        // Reads from env.js or env.default.js, defaults to valet setup
        function getEnvFromEnvs( env ) {

            var envs = getEnvs();

            if( typeof envs === 'undefined' )
            {
                return 'http://data-aggregator.test/api/v1/';
            }

            if( typeof env !== 'undefined' && envs.hasOwnProperty( env ) )
            {
                return envs[env];
            }

            // https://stackoverflow.com/a/11509718/1943591
            return envs[ Object.keys(envs)[0] ];

        }

        // enforce certain url rules, for ease of use
        function getFullUrl( url ) {

            // cast to string if necessary
            url = typeof url === 'number' ? url.toString() : url;

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
