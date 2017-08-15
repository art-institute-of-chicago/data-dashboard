(function () {
    'use strict';

    angular
        .module('app')
        .factory('DataFactory', Service);

    Service.$inject = ['$q', '$injector', 'ApiService', 'CacheFactory'];

    function Service( $q, $injector, ApiService, CacheFactory ) {

        return {
            Collection: Collection,
        }

        function Collection( options ) {

            var options = options || {};

            var settings = {
                route: options.route || 'resources',
                id_field: options.id_field || 'id',
                wrapper: options.wrapper || null,
                include: options.include || null,
            };

            // See CacheFactory for more info on ID_FIELD and WRAPPER

            var cache = new CacheFactory.Cache( settings.id_field, settings.wrapper );
            var params = {};

            // Add ?include= to parameters
            if( settings.include ) {

                params.include = settings.include.map( function(e) { return e.field; } ).join();

            }

            // define public interface
            return {
                list: list,
                detail: detail,
                find: find,
                inject: inject,
                route: route,
                settings: settings,
            };


            function list( config ) {

                var url = getUrl();
                var config = getConfig( config );

                var promise = query( url, config );
                var data = cache.list();

                return {
                    promise: promise,
                    cache: data,
                }

            }


            function detail( id, config ) {

                var url = getUrl( id );
                var config = getConfig( config );

                var promise = query( url, config );
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

                    query( url, config );

                    // Necessary so as to avoid inifinite digest cycles.
                    datum.initialized = true;

                }

                return datum;

            }


            // inject() is an in-between of detail() and update()
            // it will update the cache without making a server call
            function inject( datum ) {

                datum = processResponse( datum );

                return cache.update( datum );

            }


            function route( id ) {

                var url = getUrl( id );

                return ApiService.route( url );

            }


            function query( url, config ) {

                console.log( 'GET', url, config );

                var promise = ApiService.get( url, config );

                // Update promise to return the transformed response
                promise = promise.then( processResponse );

                // TODO: Improve promise chaining
                promise.then( cache.update, cache.error );

                return promise;

            }


            function getUrl( id ) {

                var url = [ settings.route, id ];

                return url.join('/');

            }


            function getConfig( config ) {

                // config is an optional argument
                config = config || {};

                // apply any defined params
                angular.merge( config, {
                    params: params
                });

                return config;

            }


            // Accepts response, response.data, and response.data[wrapper]
            function processResponse( response ) {

                // We are only interested in the data
                var data = response.data || response;

                // Unwrap if necessary...
                data = settings.wrapper ? data[settings.wrapper] || data : data

                // Are we processing a list of datums?
                if( Array.isArray( data ) ) {
                    return data.map( processDatum );
                }

                // Assume we are processing just one datum
                return processDatum( data );

            }


            function processDatum( datum ) {

                if( settings.include ) {

                    datum = processIncludes( datum );

                }

                // TODO: Add more steps here as required
                console.log( "Processed " + pluralize(settings.route, 1)
                    + " #" + datum.id
                    + " (" + datum.title + ")"
                );

                return datum;

            }

            function processIncludes( datum ) {

                settings.include.forEach( function( item ) {

                    if( datum.hasOwnProperty( item.field ) ) {

                        $injector.get( item.service ).inject( datum[item.field] );

                        delete datum[item.field];

                    }

                });

                return datum;

            }

        }

    }

})();
