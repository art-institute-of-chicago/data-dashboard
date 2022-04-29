(function () {
    'use strict';

    angular
        .module('app')
        .factory('SearchService', Service);

    Service.$inject = ['$http', '$q', 'ApiService'];

    // TODO: Use the API service, somehow?
    function Service( $http, $q, ApiService ) {

        // determines `preference` for consistent ordering
        var session = Math.random();

        // define public interface
        return {
            get: search,
            imageSearch: imageSearch,
        };

        // returns an angular promise
        function search( params ) {

            return getSearchPromise('search', {

                from: params.from || params.start || params.offset || 0,
                limit: params.limit || params.rows || params.size || null,
                resources: params.resources || null,
                preference: params.preference || null,
                fields: params.fields || null,
                query: params.query || null,
                sort: params.sort || null,
                q: params.q || null,

            });

        }

        function imageSearch( params ) {

            return getSearchPromise('image-search', {

                from: params.from || params.start || params.offset || 0,
                limit: params.limit || params.rows || params.size || null,
                resources: params.resources || null,
                fields: params.fields || null,
                file: params.file || null,
                hash_type: params.hash_type || null,

            });

        }

        function getSearchPromise( endpoint, params ) {

            // Standardize resolution
            var deferred = $q.defer();

            ApiService.post( endpoint, params).then( function( response ) {

                // Unwrap POST response data
                var response = response.data;

                deferred.resolve( {

                    results: response.data,

                });

            }, function( response ) {

                deferred.reject( response );

            });

            return deferred.promise;

        }

    }

})();
