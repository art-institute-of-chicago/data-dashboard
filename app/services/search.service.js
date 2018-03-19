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
        };


        // returns an angular promise
        function search( params ) {

            // Standardize resolution
            var deferred = $q.defer();

            ApiService.post( 'search', {

                from: params.from || params.start || params.offset || 0,
                limit: params.limit || params.rows || params.size || null,
                resources: params.resources || null,
                preference: params.preference || null,
                fields: params.fields || null,
                query: params.query || null,
                sort: params.sort || null,
                q: params.q || null,

            }).then( function( response ) {

                // Unwrap POST response data
                var response = response.data;

                deferred.resolve( {

                    results: response.data,
                    total: response.pagination.total,
                    start: response.pagination.offset,

                    // TODO: Combine phrase suggest and autocomplete?
                    autocomplete: ( response.suggest && response.suggest.autocomplete ) ? response.suggest.autocomplete : [],

                });

            }, function( response ) {

                deferred.reject( response );

            });

            return deferred.promise;

        }

    }

})();
