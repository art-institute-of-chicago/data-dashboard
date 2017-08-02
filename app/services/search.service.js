(function () {
    'use strict';

    angular
        .module('app')
        .factory('SearchService', Service);

    Service.$inject = ['$http', '$q', 'esFactory'];

    // TODO: Use the API service, somehow?
    function Service( $http, $q, esFactory ) {

        // TODO: Don't hardcode the search URL
        var solr_url = "http://localhost:8983/solr/data_aggregator/select";

        var elastic = esFactory({
            host: "http://localhost:9200/",
        });

        // define public interface
        return {
            get: es, // switch this b/w `solr` and `es`
        };

        // returns an angular promise
        // performs a strict search for phrase
        function solr( params ) {

            // Standardize resolution b/w Solr and ES
            var deferred = $q.defer();

            $http.get( solr_url, {
                params: {
                    wt: 'json',
                    rows: params.rows,
                    start: params.start,
                    q: params.query || "*.*",
                }
            }).then( function( response ) {

                deferred.resolve({

                    results: response.data.response.docs,
                    total: response.data.response.numFound,
                    start: response.data.response.start,

                });

            }, function( response ) {

                deferred.reject( response );

            });

            return deferred.promise;

        }


        function es( params ) {

            // Standardize resolution b/w Solr and ES
            var deferred = $q.defer();

            elastic.search({

                index: 'data_aggregator:v1',
                q: params.query,
                from: params.start,
                size: params.rows

            }).then( function( response ) {

                deferred.resolve( {

                    results: response.hits.hits.map( function( item ) {
                        return item._source;
                    }),
                    total: response.hits.total,
                    start: params.start,

                });

            }, function( response ) {

                deferred.reject( response );

            });

            return deferred.promise;

        }

    }

})();
