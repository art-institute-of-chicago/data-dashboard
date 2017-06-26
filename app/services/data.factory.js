(function () {
    'use strict';

    angular
        .module('app')
        .factory('DataFactory', Service);

    Service.$inject = ['$q', 'ApiService', 'CacheFactory'];

    function Service( $q, ApiService, CacheFactory ) {

        return {
            Collection: Collection,
        }

        function Collection( options ) {

            var options = options || {};

            var settings = {
                id_field: options.id_field || 'id',
                wrapper: options.wrapper || null,
            };

            // See CacheFactory for more info on ID_FIELD and WRAPPER

            var cache = new CacheFactory.Cache( settings.id_field, settings.wrapper );
            var filters = {};

            // define public interface
            return {
                list: list,
                detail: detail,
                find: find,
                route: route,
                filter: filter,
            };


            function list( url, config ) {

                var config = getConfig( config );

                var promise = ApiService.get( url, config ).then( cache.update, cache.error );
                var data = cache.list();

                return {
                    promise: promise,
                    cache: data,
                }

            }


            function detail( url, config ) {

                var id = getId( url );
                var config = getConfig( config );

                var promise = ApiService.get( url, config ).then( cache.update, cache.error );
                var datum = cache.detail( id );

                return {
                    promise: promise,
                    cache: datum,
                }

            }


            // find() is like a soft detail(), meant for static views
            // it will get() a datum only if it's not cached yet
            // very much a convenience function, sans promise handling
            function find( url, config ) {

                var id = getId( url );
                var config = getConfig( config );
                var datum = cache.detail( id );

                // Enrich the datum with an extra property: track whether
                // it is just a stub, or if it contains server data.
                // See also: CacheFactory.Cache.updateDatum()
                if( !datum.initialized ) {

                    ApiService.get( url, config ).then( cache.update, cache.error );

                    // Necessary so as to avoid inifinite digest cycles.
                    datum.initialized = true;

                }

                return datum;

            }


            function route( url ) {

                return ApiService.route( url );

            }


            // Use this to set persistent param filters for all GET requests
            // Expects an object of params as per Angular's $http.config
            // TODO: Additive filters? Currently, it's a `set` situation.
            function filter( params ) {

                return filters = params || {};

            }


            function getId( url ) {

                // Assumes that the last part of the URL is the id
                var id = url.substr( url.lastIndexOf('/') + 1 );

                // TODO: URL should not contain query string
                // GET params should be defined by config.params
                // ...but just to be safe, drop anything after ?

                // TODO: Anticipate trailing forwardslash

                // Ensure that it's numeric
                return parseInt( id );

            }


            function getConfig( config ) {

                // config is an optional argument
                config = config || {};

                // apply any defined filters
                angular.merge( config, {
                    params: filters
                });

                return config;

            }

        }

    }

})();
