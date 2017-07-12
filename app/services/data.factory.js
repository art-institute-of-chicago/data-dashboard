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
                route: options.route || 'resources',
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
                inject: inject,
                route: route,
                filter: filter,
            };


            function list( config ) {

                var url = getUrl();
                var config = getConfig( config );

                var promise = ApiService.get( url, config ).then( cache.update, cache.error );
                var data = cache.list();

                return {
                    promise: promise,
                    cache: data,
                }

            }


            function detail( id, config ) {

                var url = getUrl( id );
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
            function find( id, config ) {

                var url = getUrl( id );
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


            // inject() is an in-between of detail() and update()
            // it will update the cache without making a server call
            function inject( datum ) {

                return cache.update( datum );

            }


            function route( id ) {

                var url = getUrl( id );

                return ApiService.route( url );

            }


            // Use this to set persistent param filters for all GET requests
            // Expects an object of params as per Angular's $http.config
            // TODO: Additive filters? Currently, it's a `set` situation.
            function filter( params ) {

                return filters = params || {};

            }


            function getUrl( id ) {

                var url = [ settings.route, id ];

                return url.join('/');

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
