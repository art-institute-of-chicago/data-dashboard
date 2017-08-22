(function () {
    'use strict';

    angular
        .module('app')
        .factory('SearchService', Service);

    Service.$inject = ['$http', '$q', 'esFactory'];

    // TODO: Use the API service, somehow?
    function Service( $http, $q, esFactory ) {

        // read settings from env.js or env.default.js
        var settings = {
            host: window.config.SEARCH_HOST,
            // do not specify an index: we will do so serverside
        };

        // create instance of elastic.js client
        var elastic = esFactory({
            host: settings.host,
        });

        // define public interface
        return {
            get: search,
        };


        // returns an angular promise
        function search( params ) {

            // Standardize resolution
            var deferred = $q.defer();

            elastic.search({

                from: params.start,
                size: params.rows,
                q: params.query ? params.query : null,
                body: params.query ? getElasticBody( params.query ) : null,

            }).then( function( response ) {

                deferred.resolve( {

                    results: response.data,
                    total: response.pagination.total,
                    start: response.pagination.offset,

                });

            }, function( response ) {

                deferred.reject( response );

            });

            return deferred.promise;

        }


        function getElasticBody( query ) {

            return {

                "query": {
                    "match" : {
                        "_all": {
                            "query": query
                        }
                    }
                }

            }

        }


        function getQueryInGallery( query ) {

            return {

                "query": {
                    "bool": {
                        "must": [
                            {
                                "match" : {
                                    "_all": {
                                        "query": query
                                    }
                                }
                            }
                        ],
                        "filter": {
                            "term": {
                                "is_in_gallery": true
                            }
                        }
                    }
                }
            }

        }

    }

})();
